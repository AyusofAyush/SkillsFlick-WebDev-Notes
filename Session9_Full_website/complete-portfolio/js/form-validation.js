// ===== FORM VALIDATION JAVASCRIPT =====

// Enhanced form validation with real-time feedback
class FormValidator {
    constructor() {
        this.rules = {};
        this.forms = new Map();
        this.init();
    }
    
    init() {
        this.setupValidationRules();
        this.initializeForms();
        console.log('📝 Form validation system initialized');
    }
    
    setupValidationRules() {
        this.rules = {
            required: {
                test: (value) => value && value.trim().length > 0,
                message: 'This field is required'
            },
            email: {
                test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
                message: 'Please enter a valid email address'
            },
            minLength: (length) => ({
                test: (value) => value && value.trim().length >= length,
                message: `Must be at least ${length} characters long`
            }),
            maxLength: (length) => ({
                test: (value) => !value || value.trim().length <= length,
                message: `Must be no more than ${length} characters long`
            }),
            pattern: (regex, message) => ({
                test: (value) => !value || regex.test(value),
                message: message || 'Invalid format'
            }),
            phone: {
                test: (value) => !value || /^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, '')),
                message: 'Please enter a valid phone number'
            },
            url: {
                test: (value) => !value || /^https?:\/\/[^\s$.?#].[^\s]*$/i.test(value),
                message: 'Please enter a valid URL'
            },
            strongPassword: {
                test: (value) => !value || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value),
                message: 'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character'
            }
        };
    }
    
    initializeForms() {
        const forms = document.querySelectorAll('form[data-validate]');
        
        forms.forEach(form => {
            this.setupForm(form);
        });
        
        // Setup contact form specifically
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            this.setupContactForm(contactForm);
        }
    }
    
    setupForm(form) {
        const formData = {
            form: form,
            fields: new Map(),
            isValid: false,
            submitButton: form.querySelector('[type="submit"]')
        };
        
        // Setup fields
        const fields = form.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            this.setupField(field, formData);
        });
        
        // Setup form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit(formData);
        });
        
        this.forms.set(form, formData);
    }
    
    setupContactForm(form) {
        const fieldConfigs = {
            name: ['required', this.rules.minLength(2), this.rules.maxLength(50)],
            email: ['required', 'email'],
            subject: ['required', this.rules.minLength(5), this.rules.maxLength(100)],
            message: ['required', this.rules.minLength(10), this.rules.maxLength(1000)]
        };
        
        // Add validation attributes
        Object.entries(fieldConfigs).forEach(([fieldName, rules]) => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                field.setAttribute('data-rules', JSON.stringify(rules.map(rule => 
                    typeof rule === 'string' ? rule : 'custom'
                )));
            }
        });
        
        this.setupForm(form);
        
        // Add custom validation for contact form
        this.addContactFormEnhancements(form);
    }
    
    setupField(field, formData) {
        const fieldData = {
            element: field,
            rules: this.parseRules(field),
            isValid: false,
            touched: false,
            errorElement: null
        };
        
        // Create error element
        fieldData.errorElement = this.createErrorElement(field);
        
        // Add event listeners
        field.addEventListener('blur', () => {
            fieldData.touched = true;
            this.validateField(fieldData);
            this.updateFormValidation(formData);
        });
        
        field.addEventListener('input', () => {
            if (fieldData.touched) {
                // Debounce validation on input
                clearTimeout(fieldData.inputTimeout);
                fieldData.inputTimeout = setTimeout(() => {
                    this.validateField(fieldData);
                    this.updateFormValidation(formData);
                }, 300);
            }
            
            // Show character count for textarea
            if (field.tagName === 'TEXTAREA') {
                this.updateCharacterCount(field);
            }
        });
        
        field.addEventListener('focus', () => {
            this.clearFieldError(fieldData);
        });
        
        formData.fields.set(field.name, fieldData);
    }
    
    parseRules(field) {
        const rules = [];
        
        // Parse data-rules attribute
        if (field.hasAttribute('data-rules')) {
            try {
                const ruleNames = JSON.parse(field.getAttribute('data-rules'));
                ruleNames.forEach(ruleName => {
                    if (this.rules[ruleName]) {
                        rules.push(this.rules[ruleName]);
                    }
                });
            } catch (e) {
                console.warn('Invalid rules format:', field.name);
            }
        }
        
        // Parse HTML5 validation attributes
        if (field.hasAttribute('required')) {
            rules.push(this.rules.required);
        }
        
        if (field.type === 'email') {
            rules.push(this.rules.email);
        }
        
        if (field.hasAttribute('minlength')) {
            const minLength = parseInt(field.getAttribute('minlength'));
            rules.push(this.rules.minLength(minLength));
        }
        
        if (field.hasAttribute('maxlength')) {
            const maxLength = parseInt(field.getAttribute('maxlength'));
            rules.push(this.rules.maxLength(maxLength));
        }
        
        if (field.hasAttribute('pattern')) {
            const pattern = new RegExp(field.getAttribute('pattern'));
            const title = field.getAttribute('title') || 'Invalid format';
            rules.push(this.rules.pattern(pattern, title));
        }
        
        return rules;
    }
    
    validateField(fieldData) {
        const value = fieldData.element.value;
        fieldData.isValid = true;
        
        for (const rule of fieldData.rules) {
            if (!rule.test(value)) {
                this.showFieldError(fieldData, rule.message);
                fieldData.isValid = false;
                break;
            }
        }
        
        if (fieldData.isValid) {
            this.showFieldSuccess(fieldData);
        }
        
        return fieldData.isValid;
    }
    
    updateFormValidation(formData) {
        let allValid = true;
        
        formData.fields.forEach(fieldData => {
            if (fieldData.touched && !fieldData.isValid) {
                allValid = false;
            }
        });
        
        formData.isValid = allValid;
        
        // Update submit button state
        if (formData.submitButton) {
            formData.submitButton.disabled = !allValid;
            formData.submitButton.classList.toggle('disabled', !allValid);
        }
        
        return allValid;
    }
    
    createErrorElement(field) {
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.style.cssText = `
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: none;
            opacity: 0;
            transition: opacity 0.2s ease;
        `;
        
        // Insert after the field or its wrapper
        const wrapper = field.closest('.form-group') || field.parentElement;
        wrapper.appendChild(errorElement);
        
        return errorElement;
    }
    
    showFieldError(fieldData, message) {
        const field = fieldData.element;
        const errorElement = fieldData.errorElement;
        
        // Style field
        field.style.borderColor = '#ef4444';
        field.classList.add('error');
        
        // Show error message
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        requestAnimationFrame(() => {
            errorElement.style.opacity = '1';
        });
        
        // Add shake animation
        field.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            field.style.animation = '';
        }, 500);
    }
    
    showFieldSuccess(fieldData) {
        const field = fieldData.element;
        
        field.style.borderColor = '#10b981';
        field.classList.remove('error');
        field.classList.add('success');
        
        this.clearFieldError(fieldData);
    }
    
    clearFieldError(fieldData) {
        const field = fieldData.element;
        const errorElement = fieldData.errorElement;
        
        field.style.borderColor = '';
        field.classList.remove('error', 'success');
        
        errorElement.style.opacity = '0';
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 200);
    }
    
    addContactFormEnhancements(form) {
        // Add character counters
        const textareas = form.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            this.addCharacterCounter(textarea);
        });
        
        // Add real-time email validation feedback
        const emailField = form.querySelector('[name="email"]');
        if (emailField) {
            this.addEmailValidationFeedback(emailField);
        }
        
        // Add subject suggestions
        const subjectField = form.querySelector('[name="subject"]');
        if (subjectField) {
            this.addSubjectSuggestions(subjectField);
        }
    }
    
    addCharacterCounter(textarea) {
        const maxLength = textarea.hasAttribute('maxlength') ? 
            parseInt(textarea.getAttribute('maxlength')) : 1000;
            
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = `
            text-align: right;
            font-size: 0.75rem;
            color: #6b7280;
            margin-top: 0.25rem;
        `;
        
        const updateCounter = () => {
            const count = textarea.value.length;
            counter.textContent = `${count}/${maxLength}`;
            
            if (count > maxLength * 0.9) {
                counter.style.color = '#ef4444';
            } else if (count > maxLength * 0.7) {
                counter.style.color = '#f59e0b';
            } else {
                counter.style.color = '#6b7280';
            }
        };
        
        textarea.addEventListener('input', updateCounter);
        textarea.parentElement.appendChild(counter);
        
        updateCounter();
    }
    
    addEmailValidationFeedback(emailField) {
        let validationTimeout;
        
        emailField.addEventListener('input', () => {
            clearTimeout(validationTimeout);
            validationTimeout = setTimeout(() => {
                const email = emailField.value;
                
                if (email && this.rules.email.test(email)) {
                    this.showEmailSuggestions(emailField, email);
                }
            }, 500);
        });
    }
    
    showEmailSuggestions(emailField, email) {
        // Simple email domain suggestions
        const commonDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
        const [localPart, domain] = email.split('@');
        
        if (domain && domain.length > 0) {
            const suggestions = commonDomains.filter(d => 
                d.startsWith(domain.toLowerCase()) && d !== domain.toLowerCase()
            );
            
            if (suggestions.length > 0) {
                this.showSuggestionDropdown(emailField, localPart, suggestions);
            }
        }
    }
    
    showSuggestionDropdown(field, localPart, suggestions) {
        // Remove existing dropdown
        const existingDropdown = field.parentElement.querySelector('.suggestion-dropdown');
        if (existingDropdown) {
            existingDropdown.remove();
        }
        
        const dropdown = document.createElement('div');
        dropdown.className = 'suggestion-dropdown';
        dropdown.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            max-height: 150px;
            overflow-y: auto;
        `;
        
        suggestions.forEach(domain => {
            const suggestion = document.createElement('div');
            suggestion.className = 'suggestion-item';
            suggestion.textContent = `${localPart}@${domain}`;
            suggestion.style.cssText = `
                padding: 0.5rem 0.75rem;
                cursor: pointer;
                transition: background-color 0.15s ease;
            `;
            
            suggestion.addEventListener('mouseenter', () => {
                suggestion.style.backgroundColor = '#f3f4f6';
            });
            
            suggestion.addEventListener('mouseleave', () => {
                suggestion.style.backgroundColor = '';
            });
            
            suggestion.addEventListener('click', () => {
                field.value = suggestion.textContent;
                dropdown.remove();
                field.dispatchEvent(new Event('input', { bubbles: true }));
            });
            
            dropdown.appendChild(suggestion);
        });
        
        field.parentElement.style.position = 'relative';
        field.parentElement.appendChild(dropdown);
        
        // Remove dropdown when clicking outside
        setTimeout(() => {
            document.addEventListener('click', function closeDropdown(e) {
                if (!dropdown.contains(e.target) && e.target !== field) {
                    dropdown.remove();
                    document.removeEventListener('click', closeDropdown);
                }
            });
        }, 0);
    }
    
    addSubjectSuggestions(subjectField) {
        const suggestions = [
            'Project Inquiry',
            'Collaboration Opportunity',
            'Job Opportunity',
            'Freelance Project',
            'General Question',
            'Website Feedback'
        ];
        
        const datalist = document.createElement('datalist');
        datalist.id = 'subject-suggestions';
        
        suggestions.forEach(suggestion => {
            const option = document.createElement('option');
            option.value = suggestion;
            datalist.appendChild(option);
        });
        
        document.body.appendChild(datalist);
        subjectField.setAttribute('list', 'subject-suggestions');
    }
    
    async handleSubmit(formData) {
        // Validate all fields
        let allValid = true;
        
        formData.fields.forEach(fieldData => {
            fieldData.touched = true;
            if (!this.validateField(fieldData)) {
                allValid = false;
            }
        });
        
        if (!allValid) {
            this.showFormError(formData.form, 'Please fix the errors above');
            return;
        }
        
        // Show loading state
        const submitButton = formData.submitButton;
        const originalText = submitButton.innerHTML;
        
        submitButton.innerHTML = `
            <span>Sending...</span>
            <i class="fas fa-spinner fa-spin"></i>
        `;
        submitButton.disabled = true;
        
        try {
            // Simulate form submission
            await this.submitForm(formData);
            
            // Show success
            this.showFormSuccess(formData.form);
            
            // Reset form
            setTimeout(() => {
                formData.form.reset();
                this.resetFormValidation(formData);
            }, 2000);
            
        } catch (error) {
            this.showFormError(formData.form, 'Failed to send message. Please try again.');
        } finally {
            // Reset button
            setTimeout(() => {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }, 3000);
        }
    }
    
    async submitForm(formData) {
        // In a real application, this would make an API call
        return new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
    }
    
    showFormSuccess(form) {
        const message = document.createElement('div');
        message.className = 'form-message success';
        message.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Thank you! Your message has been sent successfully.</span>
        `;
        message.style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: #d1fae5;
            color: #065f46;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
            border: 1px solid #a7f3d0;
        `;
        
        form.insertBefore(message, form.firstChild);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
    
    showFormError(form, errorMessage) {
        const message = document.createElement('div');
        message.className = 'form-message error';
        message.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${errorMessage}</span>
        `;
        message.style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: #fef2f2;
            color: #991b1b;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
            border: 1px solid #fca5a5;
        `;
        
        form.insertBefore(message, form.firstChild);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
    
    resetFormValidation(formData) {
        formData.fields.forEach(fieldData => {
            fieldData.touched = false;
            fieldData.isValid = false;
            this.clearFieldError(fieldData);
        });
        
        formData.isValid = false;
        
        if (formData.submitButton) {
            formData.submitButton.disabled = true;
        }
    }
    
    // Public methods for external use
    validateForm(form) {
        const formData = this.forms.get(form);
        if (formData) {
            return this.updateFormValidation(formData);
        }
        return false;
    }
    
    addCustomRule(name, rule) {
        this.rules[name] = rule;
    }
    
    removeForm(form) {
        this.forms.delete(form);
    }
}

// CSS for form validation effects
const formValidationStyles = document.createElement('style');
formValidationStyles.textContent = `
    .form-group {
        position: relative;
    }
    
    input.error,
    textarea.error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    input.success,
    textarea.success {
        border-color: #10b981 !important;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
        20%, 40%, 60%, 80% { transform: translateX(3px); }
    }
    
    .suggestion-dropdown::-webkit-scrollbar {
        width: 6px;
    }
    
    .suggestion-dropdown::-webkit-scrollbar-track {
        background: #f3f4f6;
    }
    
    .suggestion-dropdown::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 3px;
    }
    
    .character-counter {
        transition: color 0.2s ease;
    }
    
    .submit-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;
document.head.appendChild(formValidationStyles);

// Initialize form validator
let formValidator;

document.addEventListener('DOMContentLoaded', () => {
    formValidator = new FormValidator();
});

// Export for external use
window.FormValidator = FormValidator;