import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
// import axios from "axios";
import DatePicker from "react-datepicker";
import PropTypes from 'prop-types';
import "react-datepicker/dist/react-datepicker.css";
import api from "../utils/api";

const ImageWithFallback = React.memo(function ImageWithFallback({ src, alt, className }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [loading, setLoading] = useState(true);

  const onLoad = useCallback(() => setLoading(false), []);
  const onError = useCallback(() => {
    setImgSrc("/path/to/fallback/image.png"); // Update this path
    setLoading(false);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = onLoad;
    img.onerror = onError;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, onLoad, onError]);

  return (
    <>
      {loading && <div className="loading-placeholder">Loading...</div>}
      <img
        src={imgSrc}
        alt={alt}
        className={className}
        style={{ display: loading ? 'none' : 'block' }}
      />
    </>
  );
});

ImageWithFallback.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
};

ImageWithFallback.defaultProps = {
  className: '',
};

const ResultGenerator = () => {
  const { magicLink } = useParams();
  const location = useLocation();
  const [formEntries, setFormEntries] = useState([]);
  const [submissionMagicLink, setSubmissionMagicLink] = useState(null);
  const [submissionDate, setSubmissionDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = magicLink 
        ? `/api/formgenerator/result/${magicLink}`
        : '/api/formgenerator/result';
      // console.log('Fetching data from:', url);
      const response = await api.get(url);
      // console.log('Received data:', response.data);
      setFormEntries(response.data.data);
      setSubmissionMagicLink(response.data.magicLink);
      setSubmissionDate(new Date(response.data.submissionDate));
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [magicLink]);

  useEffect(() => {
    console.log('Effect triggered. Magic Link:', magicLink);
    fetchData();
  }, [fetchData, location.pathname, magicLink]);

  const filteredEntries = useMemo(() => 
    selectedDate
      ? formEntries.filter(
          (entry) =>
            new Date(entry.updated_at).toDateString() ===
            selectedDate.toDateString()
        )
      : formEntries,
    [formEntries, selectedDate]
  );

  const handleDateChange = useCallback((date) => {
    setSelectedDate(date);
  }, []);

  const handleClearFilter = useCallback(() => {
    setSelectedDate(null);
  }, []);

  const handleRefresh = useCallback(() => {
    console.log('Refreshing data...');
    fetchData();
  }, [fetchData]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto px-4">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">SS Digital</h1>
          <nav>
            <a href="/" className="text-blue-600 hover:text-blue-800">
              Login
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          {magicLink ? "Form Results" : "Latest Form Results"}
        </h2>
        
        {submissionMagicLink && (
          <p className="mb-2 text-sm text-gray-600">
            Magic Link: {submissionMagicLink}
          </p>
        )}
        {submissionDate && (
          <p className="mb-4 text-sm text-gray-600">
            Submission Date: {submissionDate.toLocaleString()}
          </p>
        )}
        
        <div className="mb-4 flex items-center">
          <div className="mr-4">
            <label className="block text-sm font-medium text-gray-700">
              Filter by Date:
            </label>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              className="form-input rounded-md shadow-sm mt-1 block w-full"
              placeholderText="Select a date"
            />
          </div>
          <button
            onClick={handleClearFilter}
            className="mt-6 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Clear Filter
          </button>
          <button
            onClick={handleRefresh}
            className="mt-6 ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Data
          </button>
        </div>
        
        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white shadow overflow-hidden sm:rounded-lg p-4"
            >
              <h3 className="text-lg font-medium text-gray-900">
                {entry.account_holder_name}
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Bank: {entry.bank_name}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Account: {entry.account_number}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                IFSC: {entry.ifsc_code}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Branch: {entry.branch_address}
              </p>
              {entry.scanner_image_url && (
                <ImageWithFallback
                  src={entry.scanner_image_url}
                  alt="Scanned document"
                  className="mt-2 max-w-full h-auto"
                />
              )}
              <p className="mt-2 text-xs text-gray-500">
                Updated: {new Date(entry.updated_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        
        {filteredEntries.length === 0 && (
          <p className="text-center py-10 text-gray-500">No entries found for the selected date.</p>
        )}
      </main>
    </div>
  );
};

export default ResultGenerator;