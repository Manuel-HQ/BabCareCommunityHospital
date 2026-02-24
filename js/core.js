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

function validateField(field) {
    const value = field.value.trim();
    const errorElement = document.getElementById(`${field.id}-error`);
    let isValid = true;
    let errorMessage = '';

    field.classList.remove('error');
    if (errorElement) errorElement.textContent = '';

    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }

    switch (field.id) {
        case 'phone':
            if (value && !/^(\+233|0)\d{9}$/.test(value.replace(/\s/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid Ghana phone number (e.g., +233 XX XXX XXXX or 0XX XXX XXXX)';
            }
            break;

        case 'age': {
            const age = parseInt(value, 10);
            if (value && (isNaN(age) || age < 0 || age > 150)) {
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
            if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
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

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    return isValid;
}

function initCommonPageFeatures() {
    initNavigation();
    initDateTimeClock();
}
