import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "../components/formComponentLogin";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";
import { setAuthToken, fetchWithToken } from "../utils/authUtils";
import api from "../utils/api";

const LoginPage = () => {
  const navigate = useNavigate();

  const ValidationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email address").required("Required"),
    pin: Yup.string()
      .required("Required")
      .matches(/^\d{4,6}$/, "PIN must be 4 to 6 digits"),
  });

  const handleLogin = async (values) => {
    const { email, pin } = values;
    try {
      const response = await api.post("/api/auth/login", {
        email,
        password: pin,
      });
      const { token, role, expires_in } = response.data;
      console.log("Received token:", token);
      const tokenExpiry = Date.now() + expires_in * 1000;
      setAuthToken(token);
      localStorage.setItem("tokenExpiry", tokenExpiry);
      toast.success("Login successful!");

      try {
        const userDataResponse = await fetchWithToken("/api/user/data");
        console.log("User data:", userDataResponse.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }

      navigate(role === "admin" ? "/form-generator" : "/form-result-viewer");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-bl from-slate-50 to-blue-200">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <ToastContainer />
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">SS Digital</h1>
          <h2 className="text-2xl font-semibold text-gray-700">
            Welcome! 👋
          </h2>
        </div>
        <Formik
          initialValues={{ email: "", pin: "" }}
          validationSchema={ValidationSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <Input
                id="email"
                name="email"
                type="email"
                label="Email"
                placeholder="Enter your email"
              />
              <Input
                id="pin"
                name="pin"
                type="password"
                label="PIN"
                placeholder="Enter 4-6 digit PIN"
              />
              <div className="flex items-center justify-end">
                <Link to="/forgot-pin" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot PIN?
                </Link>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 disabled:opacity-50"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </Form>
          )}
        </Formik>
        {/* <p className="text-sm text-center text-gray-600">
          New on our platform?{" "}
          <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            Create an account
          </Link>
        </p> */}
      </div>
    </div>
  );
};

export default LoginPage;