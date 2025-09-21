// ===================================
// CONTACT FORM VALIDATION SYSTEM
// ===================================
// This script handles real-time validation for the portfolio contact form
// It validates name, email, subject, and message fields with custom rules

// Wait for DOM to be fully loaded before running any scripts
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Form validation system initialized');
    
    // =============================
    // GET ALL FORM ELEMENTS
    // =============================
    // First, we need to grab all the form elements we'll be working with
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectSelect = document.getElementById('subject');
    const messageTextarea = document.getElementById('message');
    const successMessage = document.getElementById('successMessage');
    
    // Check if all elements exist (error prevention)
    if (!form || !nameInput || !emailInput || !subjectSelect || !messageTextarea) {
        console.error('❌ Form elements not found! Please check your HTML IDs.');
        return;
    }
    
    // =============================
    // VALIDATION FUNCTIONS OBJECT
    // =============================
    // This object contains all our validation logic for different field types
    const validators = {
        
        // NAME VALIDATION FUNCTION
        // Checks if name is valid according to our rules
        validateName: function(name) {
            // Remove extra spaces from beginning and end
            const trimmedName = name.trim();
            
            // Rule 1: Name cannot be empty
            if (trimmedName.length === 0) {
                return { 
                    isValid: false, 
                    message: "Name is required" 
                };
            }
            
            // Rule 2: Name must be at least 2 characters
            if (trimmedName.length < 2) {
                return { 
                    isValid: false, 
                    message: "Name must be at least 2 characters" 
                };
            }
            
            // Rule 3: Name shouldn't be too long
            if (trimmedName.length > 50) {
                return { 
                    isValid: false, 
                    message: "Name must be less than 50 characters" 
                };
            }
            
            // Rule 4: Name should only contain letters, spaces, hyphens, and apostrophes
            // This regex pattern allows: letters (a-z, A-Z), spaces, hyphens (-), apostrophes (')
            const namePattern = /^[a-zA-Z\s\-\']+$/;
            if (!namePattern.test(trimmedName)) {
                return { 
                    isValid: false, 
                    message: "Name can only contain letters, spaces, hyphens, and apostrophes" 
                };
            }
            
            // If all rules pass, name is valid!
            return { 
                isValid: true, 
                message: "" 
            };
        },
        
        // EMAIL VALIDATION FUNCTION
        // Checks if email follows proper email format
        validateEmail: function(email) {
            // Convert to lowercase and remove extra spaces
            const trimmedEmail = email.trim().toLowerCase();
            
            // Rule 1: Email cannot be empty
            if (trimmedEmail.length === 0) {
                return { 
                    isValid: false, 
                    message: "Email is required" 
                };
            }
            
            // Rule 2: Email must follow proper format (user@domain.extension)
            // This regex checks for: text + @ + text + . + text
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(trimmedEmail)) {
                return { 
                    isValid: false, 
                    message: "Please enter a valid email address" 
                };
            }
            
            // Email is valid!
            return { 
                isValid: true, 
                message: "" 
            };
        },
        
        // SUBJECT VALIDATION FUNCTION
        // Checks if a subject is selected from dropdown
        validateSubject: function(subject) {
            // Rule: Subject must be selected (not empty)
            if (subject === "" || subject === null) {
                return { 
                    isValid: false, 
                    message: "Please select a subject" 
                };
            }
            
            // Subject is valid!
            return { 
                isValid: true, 
                message: "" 
            };
        },
        
        // MESSAGE VALIDATION FUNCTION
        // Checks if message meets our requirements
        validateMessage: function(message) {
            // Remove extra spaces
            const trimmedMessage = message.trim();
            
            // Rule 1: Message cannot be empty
            if (trimmedMessage.length === 0) {
                return { 
                    isValid: false, 
                    message: "Message is required" 
                };
            }
            
            // Rule 2: Message must be at least 10 characters (meaningful message)
            if (trimmedMessage.length < 10) {
                return { 
                    isValid: false, 
                    message: "Message must be at least 10 characters long" 
                };
            }
            
            // Rule 3: Message shouldn't be too long
            if (trimmedMessage.length > 500) {
                return { 
                    isValid: false, 
                    message: "Message must be less than 500 characters" 
                };
            }
            
            // Message is valid!
            return { 
                isValid: true, 
                message: "" 
            };
        }
    };
    
    // =============================
    // DISPLAY VALIDATION RESULTS
    // =============================
    // This function shows or hides error messages and changes field styling
    function showValidationResult(inputElement, errorElementId, validation) {
        // Find the error message element
        const errorElement = document.getElementById(errorElementId);
        
        if (!errorElement) {
            console.error(`❌ Error element with ID '${errorElementId}' not found`);
            return;
        }
        
        if (validation.isValid) {
            // FIELD IS VALID
            // Remove error styling and add success styling
            inputElement.classList.remove('invalid');
            inputElement.classList.add('valid');
            errorElement.textContent = ''; // Clear error message
            console.log(`✅ ${inputElement.name} field is valid`);
        } else {
            // FIELD IS INVALID
            // Remove success styling and add error styling
            inputElement.classList.remove('valid');
            inputElement.classList.add('invalid');
            errorElement.textContent = validation.message; // Show error message
            console.log(`❌ ${inputElement.name} field error: ${validation.message}`);
        }
    }
    
    // =============================
    // REAL-TIME VALIDATION SETUP
    // =============================
    // These event listeners validate fields as the user types/changes them
    
    // Validate name as user types
    nameInput.addEventListener('input', function() {
        console.log('👤 Validating name field...');
        const validation = validators.validateName(this.value);
        showValidationResult(this, 'nameError', validation);
    });
    
    // Validate email as user types
    emailInput.addEventListener('input', function() {
        console.log('📧 Validating email field...');
        const validation = validators.validateEmail(this.value);
        showValidationResult(this, 'emailError', validation);
    });
    
    // Validate subject when user selects option
    subjectSelect.addEventListener('change', function() {
        console.log('📋 Validating subject field...');
        const validation = validators.validateSubject(this.value);
        showValidationResult(this, 'subjectError', validation);
    });
    
    // Validate message as user types + show character count
    messageTextarea.addEventListener('input', function() {
        console.log('💬 Validating message field...');
        const validation = validators.validateMessage(this.value);
        showValidationResult(this, 'messageError', validation);
        
        // Show character count for user feedback
        const charCount = this.value.trim().length;
        const maxChars = 500;
        const errorElement = document.getElementById('messageError');
        
        // If message is valid, show character count instead of error
        if (validation.isValid && errorElement) {
            errorElement.innerHTML = `<span style="color: #6c757d; font-size: 0.8rem;">${charCount}/${maxChars} characters</span>`;
        }
    });
    
    // =============================
    // FORM SUBMISSION HANDLING
    // =============================
    // This handles what happens when user clicks "Send Message" button
    form.addEventListener('submit', function(event) {
        // Prevent the form from submitting normally (we want to validate first)
        event.preventDefault();
        console.log('📤 Form submission started...');
        
        // VALIDATE ALL FIELDS AT ONCE
        console.log('🔍 Running full form validation...');
        const nameValidation = validators.validateName(nameInput.value);
        const emailValidation = validators.validateEmail(emailInput.value);
        const subjectValidation = validators.validateSubject(subjectSelect.value);
        const messageValidation = validators.validateMessage(messageTextarea.value);
        
        // SHOW ALL VALIDATION RESULTS
        showValidationResult(nameInput, 'nameError', nameValidation);
        showValidationResult(emailInput, 'emailError', emailValidation);
        showValidationResult(subjectSelect, 'subjectError', subjectValidation);
        showValidationResult(messageTextarea, 'messageError', messageValidation);
        
        // CHECK IF ENTIRE FORM IS VALID
        const isFormValid = nameValidation.isValid && 
                           emailValidation.isValid && 
                           subjectValidation.isValid && 
                           messageValidation.isValid;
        
        if (isFormValid) {
            // ✅ FORM IS VALID - PROCESS SUBMISSION
            console.log('🎉 Form validation passed! Processing submission...');
            
            // Prepare form data (in real project, this would be sent to server)
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim().toLowerCase(),
                subject: subjectSelect.value,
                message: messageTextarea.value.trim(),
                timestamp: new Date().toISOString()
            };
            
            // Log the form data (for demonstration)
            console.log('📊 Form data:', formData);
            
            // Show success message to user
            successMessage.style.display = 'block';
            successMessage.scrollIntoView({ behavior: 'smooth' });
            
            // Reset the form to empty state
            form.reset();
            console.log('🔄 Form reset completed');
            
            // Remove all validation styling
            [nameInput, emailInput, subjectSelect, messageTextarea].forEach(element => {
                element.classList.remove('valid', 'invalid');
            });
            
            // Clear all error messages
            ['nameError', 'emailError', 'subjectError', 'messageError'].forEach(errorId => {
                const errorElement = document.getElementById(errorId);
                if (errorElement) {
                    errorElement.textContent = '';
                }
            });
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
                console.log('✨ Success message hidden');
            }, 5000);
            
        } else {
            // ❌ FORM HAS ERRORS
            console.log('⚠️ Form validation failed - please check errors above');
            successMessage.style.display = 'none';
            
            // Focus on first invalid field for better UX
            const firstInvalidField = form.querySelector('.invalid');
            if (firstInvalidField) {
                firstInvalidField.focus();
                firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
    
    console.log('✅ Form validation system setup complete!');
});

// =============================
// ADDITIONAL HELPER FUNCTIONS
// =============================

// Function to clear all validation states (useful for testing)
function clearAllValidation() {
    const fields = ['name', 'email', 'subject', 'message'];
    const errors = ['nameError', 'emailError', 'subjectError', 'messageError'];
    
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.classList.remove('valid', 'invalid');
        }
    });
    
    errors.forEach(errorId => {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = '';
        }
    });
    
    console.log('🧹 All validation states cleared');
}

// Make clearAllValidation available globally for testing
window.clearAllValidation = clearAllValidation;