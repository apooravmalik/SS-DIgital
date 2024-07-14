import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import { Input } from '../components/formComponentLogin';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../utils/api';

const SignupPage = () => {
  const navigate = useNavigate();

  const ValidationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Required')
      .min(2, 'Name is too short')
      .max(50, 'Name is too long'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Required'),
    pin: Yup.string()
      .required('Required')
      .min(4, 'PIN must be at least 4 digits')
      .max(6, 'PIN must be at most 6 digits'),
    confirmPin: Yup.string()
      .oneOf([Yup.ref('pin'), null], 'PINs must match')
      .required('Required')
  });

  const handleSignup = async (values) => {
    const { email, pin } = values;
    try {
      await api.post('/api/auth/signup', {
        email,
        password: pin,
      });

      toast.success('Signup successful!');
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-white">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
        <ToastContainer />
        <div className="flex items-center justify-center mb-6">
          <span className="text-3xl font-bold">SS Digital</span>
        </div>
        <h2 className="text-2xl font-semibold text-center text-gray-700">Welcome to SS Digital! 👋</h2>
        <Formik
          initialValues={{ name: '', email: '', pin: '', confirmPin: '' }}
          validationSchema={ValidationSchema}
          onSubmit={handleSignup}
        >
          {() => (
            <Form className="space-y-4">
              <Input
                id="name"
                name="name"
                type="text"
                label="Name"
                placeholder="Enter your name"
              />
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
                placeholder="••••••••"
              />
              <Input
                id="confirmPin"
                name="confirmPin"
                type="password"
                label="Confirm PIN"
                placeholder="••••••••"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
              >
                Sign Up
              </button>
            </Form>
          )}
        </Formik>
        <p className="text-sm text-center text-gray-600">
          Already have an account? <a href="/" className="font-medium text-indigo-600 hover:text-indigo-500">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
