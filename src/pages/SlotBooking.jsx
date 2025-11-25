import { useState } from 'react';
import { Calendar, Clock, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { postJSON, postForm, API_BASE } from "../utils/api";

export default function CandidateSlotBooking() {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    email: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [bookingResponse, setBookingResponse] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.time) {
      newErrors.time = 'Time is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${API_BASE}/slotbooking/book-slot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Always try to parse JSON response, even for errors
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        data = { detail: 'Invalid response from server' };
      }

      console.log('Response status:', response.status);
      console.log('Response data:', data);

      if (response.ok) {
        setBookingResponse(data);
        setSubmitted(true);
        
      
        setTimeout(() => {
          setFormData({ date: '', time: '', email: '' });
          setSubmitted(false);
          setBookingResponse(null);
        }, 5000);
      } else {
        // Enhanced error handling
        console.log('Error response:', data);
        
        if (response.status === 409) {
          // Conflict - slot already booked or candidate has existing booking
          const errorMessage = data.detail || data.message || 'Conflict occurred';
          setErrors({ general: errorMessage });
        } else if (response.status === 422) {
          // Validation errors
          if (data.detail && Array.isArray(data.detail)) {
            const fieldErrors = {};
            data.detail.forEach(error => {
              const field = error.loc[error.loc.length - 1];
              fieldErrors[field] = error.msg;
            });
            setErrors(fieldErrors);
          } else {
            setErrors({ general: data.detail || 'Validation error occurred' });
          }
        } else if (response.status === 503) {
          // Service unavailable
          setErrors({ general: data.detail || 'Service temporarily unavailable' });
        } else {
          // Other errors
          const errorMessage = data.detail || data.message || `Server error (${response.status})`;
          setErrors({ general: errorMessage });
        }
      }
    } catch (error) {
      console.error('Network error:', error);
      setErrors({ 
        general: 'Network error. Please check if the server is running and try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Schedule Your Slot</h1>
        <p className="text-gray-600 mb-6">Select your preferred date and time for the interview</p>

        {submitted && bookingResponse ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">Slot Booked Successfully!</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Booking ID:</strong> {bookingResponse.booking_id}</p>
              <p><strong>Date:</strong> {new Date(bookingResponse.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {bookingResponse.time}</p>
              <p><strong>Email:</strong> {bookingResponse.email}</p>
              <p><strong>Test Link:</strong> 
                <a 
                  href={bookingResponse.test_link} 
                  className="text-blue-600 hover:underline ml-1"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Click here
                </a>
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Please save your test link. The test will be available 5 minutes before your scheduled time.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center text-red-800">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">{errors.general}</span>
                </div>
              </div>
            )}

            <div>
              <label className="flex items-center text-gray-700 font-semibold mb-2">
                <Calendar className="w-4 h-4 mr-2 text-indigo-600" />
                Select Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={today}
                disabled={loading}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              {errors.date && (
                <div className="flex items-center mt-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.date}
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center text-gray-700 font-semibold mb-2">
                <Clock className="w-4 h-4 mr-2 text-indigo-600" />
                Select Time
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                  errors.time ? 'border-red-500' : 'border-gray-300'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              {errors.time && (
                <div className="flex items-center mt-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.time}
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center text-gray-700 font-semibold mb-2">
                <Mail className="w-4 h-4 mr-2 text-indigo-600" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="candidate@example.com"
                disabled={loading}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              {errors.email && (
                <div className="flex items-center mt-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </div>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full font-semibold py-2 px-4 rounded-lg transition duration-200 transform ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-105 active:scale-95'
              } text-white`}
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
