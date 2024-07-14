import { useField } from 'formik';
import PropTypes from 'prop-types';

export const Input = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div>
      <label htmlFor={props.id || props.name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        {...field}
        {...props}
        className={`w-full px-3 py-2 mt-1 text-gray-700 bg-gray-200 border ${meta.touched && meta.error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400`}
      />
      {meta.touched && meta.error ? <p className="mt-1 text-sm text-red-500">{meta.error}</p> : null}
    </div>
  );
};

Input.propTypes = {
    label: PropTypes.string.isRequired,
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    placeholder: PropTypes.string,
  };
