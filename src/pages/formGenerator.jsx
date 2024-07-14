import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
// import axios from "axios";
import { getAuthToken } from '../utils/authUtils'; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../utils/api";

const FormGenerator = () => {
  const [initialValues, setInitialValues] = useState({
    bankDetails: [{
      accountHolderName: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      branchAddress: "",
      scannerImage: null,
    }]
  });

  useEffect(() => {
    const savedData = loadFromLocalStorage();
    if (savedData) {
      setInitialValues(savedData);
      toast.info("Loaded saved draft");
    }
  }, []);

  const validationSchema = Yup.object({
    bankDetails: Yup.array().of(
      Yup.object({
        accountHolderName: Yup.string().required("Required"),
        bankName: Yup.string().required("Required"),
        accountNumber: Yup.string().required("Required"),
        ifscCode: Yup.string().required("Required"),
        branchAddress: Yup.string().required("Required"),
        scannerImage: Yup.mixed(),
      })
    )
  });

  const saveToLocalStorage = (values) => {
    const dataToSave = {
      bankDetails: values.bankDetails.map(detail => ({ ...detail, scannerImage: null }))
    };
    localStorage.setItem("bankFormData", JSON.stringify(dataToSave));
    toast.success("Draft saved successfully");
  };

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem("bankFormData");
    return saved ? JSON.parse(saved) : null;
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };


  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const token = getAuthToken();
      
      // Convert all scanner images to base64
      const bankDetailsWithBase64 = await Promise.all(values.bankDetails.map(async (detail) => {
        if (detail.scannerImage) {
          const base64Image = await convertToBase64(detail.scannerImage);
          return { ...detail, scannerImage: base64Image };
        }
        return detail;
      }));
  
      const payload = {
        bankDetails: bankDetailsWithBase64
      };
  
      const response = await api.post("/api/formgenerator/create", payload, {
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
  
      console.log("Form submitted successfully:", response.data);
      saveToLocalStorage(values);
      resetForm();
      toast.success("Form submitted successfully!");
  
      const fullUrl = response.data.magicLink;
      const magicLinkIdentifier = fullUrl.split('/').pop();
  
      // Create the result path
      const resultPath = `/form-result/${magicLinkIdentifier}`;
  
      // Show an alert with the clickable magic link
      const result = window.confirm(`Form submitted successfully! Click OK to view the result or copy this link:\n\n${window.location.origin}${resultPath}`);
      
      if (result) {
        // If user clicks OK, navigate to the result page
        window.location.href = resultPath;
      } else {
        // If user clicks Cancel, copy the link to clipboard
        navigator.clipboard.writeText(`${window.location.origin}${resultPath}`).then(() => {
          toast.info("Magic link copied to clipboard!");
        }).catch(err => {
          console.error("Could not copy text: ", err);
        });
      }
  
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        `Error: ${error.response?.data?.message || "Failed to submit form"}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderForm = (arrayHelpers) => (
    <div>
      {arrayHelpers.form.values.bankDetails && arrayHelpers.form.values.bankDetails.map((detail, index) => (
        <div key={index} className="mb-8 p-4 border rounded">
          <h3 className="text-lg font-semibold mb-4">Bank Details #{index + 1}</h3>
          {Object.keys(detail).map((field) => (
            field !== 'scannerImage' && (
              <div key={field} className="mb-4">
                <label htmlFor={`bankDetails.${index}.${field}`} className="block text-sm font-medium text-gray-700">
                  {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <Field
                  name={`bankDetails.${index}.${field}`}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <ErrorMessage
                  name={`bankDetails.${index}.${field}`}
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            )
          ))}
          <div className="mb-4">
            <label htmlFor={`bankDetails.${index}.scannerImage`} className="block text-sm font-medium text-gray-700">
              Scanner Image (Optional)
            </label>
            <input
              id={`bankDetails.${index}.scannerImage`}
              name={`bankDetails.${index}.scannerImage`}
              type="file"
              onChange={(event) => {
                arrayHelpers.form.setFieldValue(`bankDetails.${index}.scannerImage`, event.currentTarget.files[0]);
              }}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
          {index > 0 && (
            <button
              type="button"
              onClick={() => arrayHelpers.remove(index)}
              className="mt-2 py-1 px-3 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Remove
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => arrayHelpers.push({
          accountHolderName: "",
          bankName: "",
          accountNumber: "",
          ifscCode: "",
          branchAddress: "",
          scannerImage: null,
        })}
        className="mt-4 py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Add More Bank Details
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold mb-6 text-center">Bank Details Form</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ isSubmitting, values }) => (
          <Form className="space-y-4">
            <FieldArray name="bankDetails">
              {arrayHelpers => renderForm(arrayHelpers)}
            </FieldArray>
            <div className="flex justify-between mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
              <button
                type="button"
                onClick={() => saveToLocalStorage(values)}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Save Draft
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FormGenerator;