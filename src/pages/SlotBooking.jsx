import { useState } from 'react';
import { Calendar, Clock, Mail, SquareUser,CheckCircle, AlertCircle } from 'lucide-react';
import { postJSON } from "../utils/api";
import { useSearchParams } from 'react-router-dom';

export default function CandidateSlotBooking() {

  const [searchParams] = useSearchParams(); // Add this line
  const jobdescriptionId = searchParams.get('id');

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    email: '',
    name:''
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
  
    // Time must be greater than present time (only if date is today)
    // Time must be greater than present time only if date is today
if (formData.date && formData.time) {
  const selectedDate = new Date(formData.date);
  const todayDate = new Date();

  const [hours, minutes] = formData.time.split(":").map(Number);

  const selectedDateTime = new Date(formData.date);
  selectedDateTime.setHours(hours, minutes, 0, 0);

  if (
    selectedDate.toDateString() === todayDate.toDateString() && 
    selectedDateTime <= todayDate
  ) {
    newErrors.time = "Time must be greater than the present time";
  }
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
    const slotSubmitData = {
      ...formData,
     jd_id: jobdescriptionId // Add the ID from URL
    };
    try {
      const data = await postJSON('/slotbooking/book-slot', slotSubmitData);
      setBookingResponse(data);
      setSubmitted(true);
      
      setTimeout(() => {
        setFormData({ date: '', time: '', email: '' });
        setSubmitted(false);
        setBookingResponse(null);
      }, 5000);
    } catch (err) {
      setErrors({ 
        general: err?.message || 'Failed to book slot. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!jobdescriptionId) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.errorBox}>
            <div style={styles.errorContent}>
              <AlertCircle style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
              <span style={styles.errorText}>No Job Description ID found. Please use a valid interview link.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f0f9ff, #e0e7ff)',
      padding: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    card: {
      maxWidth: '28rem',
      width: '100%',
      background: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      padding: '1.5rem',
      boxSizing: 'border-box',
      overflow: 'hidden'
    },
    title: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '0.5rem'
    },
    subtitle: {
      color: '#4b5563',
      marginBottom: '1.5rem'
    },
    successBox: {
      background: '#f0fdf4',
      border: '1px solid #bbf7d0',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      textAlign: 'center'
    },
    successTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: '#166534',
      marginBottom: '0.5rem'
    },
    detailsContainer: {
      marginTop: '0.5rem',
      marginBottom: '1rem'
    },
    detailRow: {
      fontSize: '0.875rem',
      color: '#374151',
      margin: '0.5rem 0'
    },
    testLinkText: {
      color: '#2563eb',
      textDecoration: 'none',
      marginLeft: '0.25rem'
    },
    testLinkHover: {
      textDecoration: 'underline'
    },
    successNote: {
      fontSize: '0.75rem',
      color: '#9ca3af',
      marginTop: '1rem'
    },
    formSpace: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem'
    },
    errorBox: {
      background: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '0.5rem',
      padding: '1rem'
    },
    errorContent: {
      display: 'flex',
      alignItems: 'center',
      color: '#b91c1c'
    },
    errorText: {
      fontSize: '0.875rem',
      fontWeight: '500'
    },
    fieldGroup: {
      display: 'flex',
      flexDirection: 'column'
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      color: '#374151',
      fontWeight: '600',
      marginBottom: '0.5rem'
    },
    labelIcon: {
      width: '1rem',
      height: '1rem',
      marginRight: '0.5rem',
      color: '#4f46e5'
    },
    input: {
      width: '100%',
      padding: '0.5rem 1rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      outline: 'none',
      transition: 'all 0.2s',
      boxSizing: 'border-box'
    },
    inputError: {
      borderColor: '#ef4444'
    },
    inputDisabled: {
      opacity: '0.5',
      cursor: 'not-allowed'
    },
    fieldError: {
      display: 'flex',
      alignItems: 'center',
      marginTop: '0.25rem',
      color: '#dc2626',
      fontSize: '0.875rem'
    },
    fieldErrorIcon: {
      width: '1rem',
      height: '1rem',
      marginRight: '0.25rem'
    },
    button: {
      width: '100%',
      fontWeight: '600',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      fontSize: '1rem',
      color: 'white',
      boxSizing: 'border-box'
    },
    buttonLoading: {
      background: '#9ca3af',
      cursor: 'not-allowed'
    },
    buttonActive: {
      background: '#4f46e5'
    },
    buttonHover: {
      background: '#4338ca'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Schedule Your Slot</h1>
        <p style={styles.subtitle}>Select your preferred date and time for the interview</p>

        {submitted && bookingResponse ? (
          <div style={styles.successBox}>
            <CheckCircle style={{ width: '3rem', height: '3rem', color: '#16a34a', margin: '0 auto 0.75rem' }} />
            <h3 style={styles.successTitle}>Slot Booked Successfully!</h3>
            <div style={styles.detailsContainer}>
              <p style={styles.detailRow}><strong>Booking ID:</strong> {bookingResponse.booking_id}</p>
              <p style={styles.detailRow}><strong>Name:</strong> {bookingResponse.name}</p>
              <p style={styles.detailRow}><strong>Email:</strong> {bookingResponse.email}</p>
              <p style={styles.detailRow}><strong>Date:</strong> {new Date(bookingResponse.date).toLocaleDateString()}</p>
              <p style={styles.detailRow}><strong>Time:</strong> {bookingResponse.time}</p>
              
            </div>
            <p style={styles.successNote}>
              Please save your test link. The test will be available 5 minutes before your scheduled time.
            </p>
          </div>
        ) : (
          <div style={styles.formSpace}>
            {errors.general && (
              <div style={styles.errorBox}>
                <div style={styles.errorContent}>
                  <AlertCircle style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
                  <span style={styles.errorText}>{errors.general}</span>
                </div>
              </div>
            )}          
          
            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                <SquareUser style={styles.labelIcon} />
                Candidate Name
              </label>
              <input
                type="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="candidate name"
                disabled={loading}
                style={{
                  ...styles.input,
                  ...(errors.email && styles.inputError),
                  ...(loading && styles.inputDisabled)
                }}
              />
              {errors.name && (
                <div style={styles.fieldError}>
                  <AlertCircle style={styles.fieldErrorIcon} />
                  {errors.name}
                </div>
              )}
            </div>


            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                <Mail style={styles.labelIcon} />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="candidate@example.com"
                disabled={loading}
                style={{
                  ...styles.input,
                  ...(errors.email && styles.inputError),
                  ...(loading && styles.inputDisabled)
                }}
              />
              {errors.email && (
                <div style={styles.fieldError}>
                  <AlertCircle style={styles.fieldErrorIcon} />
                  {errors.email}
                </div>
              )}
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                <Calendar style={styles.labelIcon} />
                Select Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={today}
                disabled={loading}
                style={{
                  ...styles.input,
                  ...(errors.date && styles.inputError),
                  ...(loading && styles.inputDisabled)
                }}
              />
              {errors.date && (
                <div style={styles.fieldError}>
                  <AlertCircle style={styles.fieldErrorIcon} />
                  {errors.date}
                </div>
              )}
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                <Clock style={styles.labelIcon} />
                Select Time
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                disabled={loading}
                style={{
                  ...styles.input,
                  ...(errors.time && styles.inputError),
                  ...(loading && styles.inputDisabled)
                }}
              />
              {errors.time && (
                <div style={styles.fieldError}>
                  <AlertCircle style={styles.fieldErrorIcon} />
                  {errors.time}
                </div>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                ...styles.button,
                ...(loading ? styles.buttonLoading : styles.buttonActive)
              }}
              onMouseEnter={(e) => !loading && (e.target.style.background = '#4338ca')}
              onMouseLeave={(e) => !loading && (e.target.style.background = '#4f46e5')}
              onMouseDown={(e) => !loading && (e.target.style.transform = 'scale(0.95)')}
              onMouseUp={(e) => !loading && (e.target.style.transform = 'scale(1)')}
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}