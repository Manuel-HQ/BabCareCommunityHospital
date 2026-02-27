// ============================================
// Core JavaScript - Shared Utilities
// ============================================

function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-GB', options);
}

function formatTime(date) {
    return new Date(date).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

function getAppointments() {
    const appointments = localStorage.getItem('hospital_appointments');
    return appointments ? JSON.parse(appointments) : [];
}

function saveAppointment(appointment) {
    const appointments = getAppointments();
    appointments.push(appointment);
    localStorage.setItem('hospital_appointments', JSON.stringify(appointments));
    return appointment;
}

function updateAppointment(ticketId, updates) {
    const appointments = getAppointments();
    const index = appointments.findIndex(apt => apt.ticketId === ticketId);

    if (index !== -1) {
        appointments[index] = { ...appointments[index], ...updates };
        localStorage.setItem('hospital_appointments', JSON.stringify(appointments));
        return appointments[index];
    }

    return null;
}

function deleteAppointment(ticketId) {
    const appointments = getAppointments();
    const filtered = appointments.filter(apt => apt.ticketId !== ticketId);
    localStorage.setItem('hospital_appointments', JSON.stringify(filtered));
}

function generateTicketId() {
    const year = new Date().getFullYear();
    const existingAppointments = getAppointments();
    const count = existingAppointments.length + 1;
    return `HSP-${year}-${String(count).padStart(4, '0')}`;
}

function getContactMessages() {
    const messages = localStorage.getItem('hospital_contact_messages');
    return messages ? JSON.parse(messages) : [];
}

function saveContactMessage(message) {
    const messages = getContactMessages();
    messages.push({ ...message, id: `MSG-${Date.now()}`, date: new Date().toISOString() });
    localStorage.setItem('hospital_contact_messages', JSON.stringify(messages));
}

function getQueueStatus() {
    const status = localStorage.getItem('hospital_queue_status');
    return status ? JSON.parse(status) : { nowServing: null, queueIndex: 0 };
}

function setQueueStatus(status) {
    localStorage.setItem('hospital_queue_status', JSON.stringify(status));
}

function resetQueue() {
    setQueueStatus({ nowServing: null, queueIndex: 0 });
}

function updateDateTime() {
    const now = new Date();
    const dateElement = document.getElementById('live-date');
    const timeElement = document.getElementById('live-time');

    if (dateElement) {
        dateElement.textContent = formatDate(now);
    }

    if (timeElement) {
        timeElement.textContent = formatTime(now);
    }
}

function initDateTimeClock() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
}

function initNavigation() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navItems = document.querySelectorAll('.nav-links a');

    navItems.forEach(item => {
        if (item.getAttribute('href') === currentPage) {
            item.classList.add('active');
        }
    });
}

function isValidName(value) {
    return /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ\s'.-]{1,79}$/.test(value);
}

// Strict RFC-aligned email regex:
// - local part: alphanum + ._%+- (no leading/trailing dot)
// - single @
// - domain: labels separated by dots
// - TLD: 2-24 alpha characters only
function isValidEmail(value) {
    return /^[a-zA-Z0-9]([a-zA-Z0-9._%+\-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9\-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,24}$/.test(value);
}

// Returns the most specific error message for a given email string
function getEmailError(value) {
    if (/\s/.test(value))
        return 'Email address cannot contain spaces — e.g., name@example.com';
    if (!value.includes('@'))
        return 'Email must include "@" — e.g., name@example.com';
    if ((value.match(/@/g) || []).length > 1)
        return 'Email can only contain one "@" symbol';
    const [local, domain] = value.split('@');
    if (!local)
        return 'Please enter a username before the "@" symbol';
    if (/^[.]|[.]$/.test(local))
        return 'The part before "@" cannot start or end with a dot';
    if (!domain || !domain.includes('.'))
        return 'Please include a domain after "@" — e.g., gmail.com';
    const tld = domain.split('.').pop();
    if (!tld || tld.length < 2)
        return 'Email must end with a valid extension — e.g., .com or .org';
    if (/[^a-zA-Z]/.test(tld))
        return 'The email extension must contain letters only — e.g., .com, .org, .net';
    return 'Please enter a valid email address — e.g., name@example.com';
}

function isValidGhanaPhone(value) {
    const normalized = value.replace(/[\s-]/g, '');
    return /^(\+233|0)\d{9}$/.test(normalized);
}

function isSelectPlaceholder(field) {
    return field.tagName === 'SELECT' && !field.value;
}

function validateField(field) {
    const value = field.value.trim();
    const errorElement = document.getElementById(`${field.id}-error`);
    let isValid = true;
    let errorMessage = '';

    if (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA') {
        field.value = value;
    }

    field.classList.remove('error');
    if (errorElement) errorElement.textContent = '';

    if ((field.hasAttribute('required') && !value) || isSelectPlaceholder(field)) {
        isValid = false;
        errorMessage = 'This field is required';
    }

    switch (field.id) {
        case 'name':
        case 'fullName':
            if (value && !isValidName(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid name (letters, spaces, apostrophes, hyphens only)';
            }
            break;

        case 'phone':
            if (value && !isValidGhanaPhone(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid Ghana phone number (e.g., +233 XX XXX XXXX or 0XX XXX XXXX)';
            }
            break;

        case 'age': {
            const age = Number(value);
            if (value && (!Number.isInteger(age) || age < 0 || age > 150)) {
                isValid = false;
                errorMessage = 'Please enter a valid age (0-150)';
            }
            break;
        }

        case 'appointment-date':
            if (value && value < getTodayDate()) {
                isValid = false;
                errorMessage = 'Appointment date cannot be in the past';
            }
            break;

        case 'email':
            if (value && !isValidEmail(value)) {
                isValid = false;
                errorMessage = getEmailError(value);
            }
            break;

        case 'subject':
            if (value && value.length < 3) {
                isValid = false;
                errorMessage = 'Subject must be at least 3 characters long';
            }
            break;

        case 'message':
        case 'symptoms':
            if (value && value.length < 10) {
                isValid = false;
                errorMessage = 'Please provide at least 10 characters';
            }
            break;
    }

    if (!isValid) {
        field.classList.add('error');
        if (errorElement) errorElement.textContent = errorMessage;
    }

    return isValid;
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    let firstInvalidField = null;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
            if (!firstInvalidField) {
                firstInvalidField = input;
            }
        }
    });

    if (firstInvalidField) {
        firstInvalidField.focus();
    }

    return isValid;
}

function initCommonPageFeatures() {
    initNavigation();
    initDateTimeClock();
}
