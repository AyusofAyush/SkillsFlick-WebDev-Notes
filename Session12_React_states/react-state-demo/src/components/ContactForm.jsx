import React, { useState } from 'react';
import '../styles/ContactForm.css';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';

      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Invalid email format';
        return '';

      case 'subject':
        if (!value.trim()) return 'Subject is required';
        if (value.trim().length < 5) return 'Subject must be at least 5 characters';
        return '';

      case 'message':
        if (!value.trim()) return 'Message is required';
        if (value.trim().length < 10) return 'Message must be at least 10 characters';
        if (value.trim().length > 500) return 'Message must not exceed 500 characters';
        return '';

      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate on change if field was touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors({ ...errors, [name]: error });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = { name: true, email: true, subject: true, message: true };
    setTouched(allTouched);

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.keys(newErrors).length > 0) {
      setSubmitStatus({ type: 'error', message: 'Please fix all errors before submitting' });
      return;
    }

    // Simulate API call
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitStatus({
        type: 'success',
        message: '✅ Message sent successfully! We\'ll get back to you soon.'
      });

      // Reset form
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTouched({});
      setErrors({});
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: '❌ Failed to send message. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return Object.keys(formData).every(key => {
      const value = formData[key];
      return value.trim() && !validateField(key, value);
    });
  };

  const getFieldClassName = (fieldName) => {
    let className = 'form-input';
    if (touched[fieldName] && errors[fieldName]) {
      className += ' error';
    } else if (touched[fieldName] && !errors[fieldName] && formData[fieldName]) {
      className += ' success';
    }
    return className;
  };

  return (
    <div className="contact-form-container">
      <div className="section-header">
        <h2>📧 Contact Form Component</h2>
        <p>Form validation, controlled components, and user feedback</p>
      </div>

      <div className="form-card">
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">
              Name <span className="required">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldClassName('name')}
              placeholder="John Doe"
            />
            {touched.name && errors.name && (
              <span className="error-message">{errors.name}</span>
            )}
            {touched.name && !errors.name && formData.name && (
              <span className="success-message">✓ Looks good!</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email <span className="required">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldClassName('email')}
              placeholder="john@example.com"
            />
            {touched.email && errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
            {touched.email && !errors.email && formData.email && (
              <span className="success-message">✓ Valid email!</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="subject">
              Subject <span className="required">*</span>
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldClassName('subject')}
              placeholder="How can we help?"
            />
            {touched.subject && errors.subject && (
              <span className="error-message">{errors.subject}</span>
            )}
            {touched.subject && !errors.subject && formData.subject && (
              <span className="success-message">✓ Great subject!</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="message">
              Message <span className="required">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldClassName('message')}
              placeholder="Tell us more..."
              rows="6"
            />
            <div className="message-meta">
              {touched.message && errors.message && (
                <span className="error-message">{errors.message}</span>
              )}
              {touched.message && !errors.message && formData.message && (
                <span className="success-message">✓ Message looks good!</span>
              )}
              <span className={`char-count ${formData.message.length > 500 ? 'error' : ''}`}>
                {formData.message.length}/500
              </span>
            </div>
          </div>

          {submitStatus && (
            <div className={`alert ${submitStatus.type}`}>
              {submitStatus.message}
            </div>
          )}

          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting || !isFormValid()}
          >
            {isSubmitting ? (
              <>
                <span className="spinner">⏳</span> Sending...
              </>
            ) : (
              <>
                <span>📤</span> Send Message
              </>
            )}
          </button>
        </form>

        <div className="form-stats">
          <h4>Form Status</h4>
          <div className="stats-grid">
            <div className="stat">
              <span className="stat-label">Valid:</span>
              <span className="stat-value">{isFormValid() ? '✅' : '❌'}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Errors:</span>
              <span className="stat-value">{Object.values(errors).filter(Boolean).length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Filled:</span>
              <span className="stat-value">
                {Object.values(formData).filter(v => v.trim()).length}/4
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="code-explanation">
        <h3>💡 Key Concepts</h3>
        <ul>
          <li><strong>Controlled Components:</strong> Form inputs controlled by React state</li>
          <li><strong>Form Validation:</strong> Real-time field validation with error messages</li>
          <li><strong>Touch State:</strong> Track which fields user has interacted with</li>
          <li><strong>Object State:</strong> Managing multiple form fields in one object</li>
          <li><strong>Conditional Classes:</strong> Dynamic styling based on validation state</li>
          <li><strong>Submit Handling:</strong> Preventing submission with invalid data</li>
        </ul>
      </div>
    </div>
  );
}

export default ContactForm;
