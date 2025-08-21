// DOM Elements
const form = document.getElementById('auth-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const submitButton = document.querySelector('button[type="submit"]');
const errorBanner = document.getElementById('error-banner');
const errorMessage = document.getElementById('error-message');
const closeErrorButton = document.querySelector('.close-error');
const togglePasswordButton = document.querySelector('.toggle-password');

// Password strength elements
const strengthFill = document.getElementById('strength-fill');
const strengthText = document.getElementById('strength-text');

// Common password blacklist (in a real app, this would be more comprehensive)
const commonPasswords = [
  'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
  'admin', 'letmein', 'welcome', 'monkey', 'dragon', 'master', 'hello'
];

// Form validation state
let formErrors = {
  email: '',
  password: '',
  confirmPassword: ''
};

// Initialize the form
document.addEventListener('DOMContentLoaded', function() {
  setupEventListeners();
  setupPasswordStrengthIndicator();
});

// Setup event listeners
function setupEventListeners() {
  // Form submission
  form.addEventListener('submit', handleFormSubmit);
  
  // Real-time validation
  emailInput.addEventListener('input', () => validateEmail());
  emailInput.addEventListener('blur', () => validateEmail());
  
  passwordInput.addEventListener('input', () => {
    validatePassword();
    updatePasswordStrength();
  });
  passwordInput.addEventListener('blur', () => validatePassword());
  
  confirmPasswordInput.addEventListener('input', () => validateConfirmPassword());
  confirmPasswordInput.addEventListener('blur', () => validateConfirmPassword());
  
  // Password visibility toggle
  togglePasswordButton.addEventListener('click', togglePasswordVisibility);
  
  // Error banner close
  closeErrorButton.addEventListener('click', hideErrorBanner);
  
  // Keyboard navigation
  document.addEventListener('keydown', handleKeyboardNavigation);
}

// Handle form submission
async function handleFormSubmit(event) {
  event.preventDefault();
  
  // Validate all fields
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();
  const isConfirmPasswordValid = validateConfirmPassword();
  
  if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
    showFormErrors();
    return;
  }
  
  // Disable submit button and show loading state
  submitButton.disabled = true;
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
  
  try {
    // Simulate API call (replace with actual authentication logic)
    await simulateAuthentication();
    
    // Success - redirect or show success message
    showSuccessMessage();
    
  } catch (error) {
    // Handle network/API errors
    showNetworkError(error.message);
  } finally {
    // Re-enable submit button
    submitButton.disabled = false;
    submitButton.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
  }
}

// Email validation
function validateEmail() {
  const email = emailInput.value.trim();
  const emailError = document.getElementById('email-error');
  
  if (!email) {
    formErrors.email = 'Email address is required';
    showFieldError(emailError, formErrors.email);
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    formErrors.email = 'Please enter a valid email address';
    showFieldError(emailError, formErrors.email);
    return false;
  }
  
  // Clear error
  formErrors.email = '';
  hideFieldError(emailError);
  return true;
}

// Password validation
function validatePassword() {
  const password = passwordInput.value;
  const passwordError = document.getElementById('password-error');
  
  if (!password) {
    formErrors.password = 'Password is required';
    showFieldError(passwordError, formErrors.password);
    return false;
  }
  
  if (password.length < 8) {
    formErrors.password = 'Password must be at least 8 characters long';
    showFieldError(passwordError, formErrors.password);
    return false;
  }
  
  if (commonPasswords.includes(password.toLowerCase())) {
    formErrors.password = 'This password is too common. Please choose a stronger password';
    showFieldError(passwordError, formErrors.password);
    return false;
  }
  
  // Clear error
  formErrors.password = '';
  hideFieldError(passwordError);
  return true;
}

// Confirm password validation
function validateConfirmPassword() {
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  const confirmPasswordError = document.getElementById('confirm-password-error');
  
  if (!confirmPassword) {
    formErrors.confirmPassword = 'Please confirm your password';
    showFieldError(confirmPasswordError, formErrors.confirmPassword);
    return false;
  }
  
  if (password !== confirmPassword) {
    formErrors.confirmPassword = 'Passwords do not match';
    showFieldError(confirmPasswordError, formErrors.confirmPassword);
    return false;
  }
  
  // Clear error
  formErrors.confirmPassword = '';
  hideFieldError(confirmPasswordError);
  return true;
}

// Password strength indicator
function setupPasswordStrengthIndicator() {
  // Initial state
  updatePasswordStrength();
}

function updatePasswordStrength() {
  const password = passwordInput.value;
  
  if (!password) {
    resetPasswordStrength();
    return;
  }
  
  const strength = calculatePasswordStrength(password);
  displayPasswordStrength(strength);
}

function calculatePasswordStrength(password) {
  let score = 0;
  
  // Length scoring
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  
  // Character variety scoring
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  // Common password penalty
  if (commonPasswords.includes(password.toLowerCase())) {
    score = Math.max(0, score - 2);
  }
  
  // Determine strength level
  if (score <= 2) return 'weak';
  if (score <= 4) return 'medium';
  return 'strong';
}

function displayPasswordStrength(strength) {
  // Update progress bar
  strengthFill.className = `strength-fill ${strength}`;
  
  // Update text
  strengthText.className = `strength-text ${strength}`;
  
  switch (strength) {
    case 'weak':
      strengthText.textContent = 'Weak';
      break;
    case 'medium':
      strengthText.textContent = 'Medium';
      break;
    case 'strong':
      strengthText.textContent = 'Strong';
      break;
  }
}

function resetPasswordStrength() {
  strengthFill.className = 'strength-fill';
  strengthText.className = 'strength-text';
  strengthText.textContent = 'Enter a password';
}

// Error handling functions
function showFieldError(errorElement, message) {
  errorElement.textContent = message;
  errorElement.hidden = false;
  errorElement.classList.remove('hidden');
}

function hideFieldError(errorElement) {
  errorElement.hidden = true;
  errorElement.classList.add('hidden');
}

function showFormErrors() {
  const errors = Object.values(formErrors).filter(error => error);
  if (errors.length > 0) {
    showErrorBanner(errors.join('. '));
  }
}

function showErrorBanner(message) {
  errorMessage.textContent = message;
  errorBanner.hidden = false;
  errorBanner.classList.remove('hidden');
  
  // Auto-hide after 10 seconds
  setTimeout(() => {
    hideErrorBanner();
  }, 10000);
}

function hideErrorBanner() {
  errorBanner.hidden = true;
  errorBanner.classList.add('hidden');
}

function showNetworkError(message) {
  showErrorBanner(`Network error: ${message}. Please try again.`);
}

function showSuccessMessage() {
  // In a real app, you might redirect or show a success page
  alert('Account created successfully!');
}

// Password visibility toggle
function togglePasswordVisibility() {
  const type = passwordInput.type === 'password' ? 'text' : 'password';
  passwordInput.type = type;
  
  const icon = togglePasswordButton.querySelector('i');
  icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
  
  // Update aria-label
  const label = type === 'password' ? 'Show password' : 'Hide password';
  togglePasswordButton.setAttribute('aria-label', label);
}

// Keyboard navigation
function handleKeyboardNavigation(event) {
  // Close error banner with Escape key
  if (event.key === 'Escape' && !errorBanner.hidden) {
    hideErrorBanner();
  }
  
  // Submit form with Enter key (only when no errors)
  if (event.key === 'Enter' && event.target.tagName === 'INPUT') {
    const hasErrors = Object.values(formErrors).some(error => error);
    if (!hasErrors) {
      form.requestSubmit();
    }
  }
}

// Simulate authentication (replace with actual API call)
async function simulateAuthentication() {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      // Simulate random network failure (10% chance)
      if (Math.random() < 0.1) {
        reject(new Error('Connection timeout'));
      } else {
        resolve({ success: true });
      }
    }, 1500);
  });
}

// Accessibility improvements
function announceToScreenReader(message) {
  // Create a temporary element for screen reader announcements
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Add screen reader only class for announcements
const style = document.createElement('style');
style.textContent = `
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;
document.head.appendChild(style);
