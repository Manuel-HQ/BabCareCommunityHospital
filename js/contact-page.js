// ============================================
// Contact Page JavaScript
// ============================================

function handleContactSubmit(event) {
    event.preventDefault();

    const form = event.target;
    if (!validateForm(form)) {
        return;
    }

    const formData = new FormData(form);

    const subjectField = document.getElementById('subject');
    if (subjectField && !validateField(subjectField)) {
        subjectField.focus();
        return;
    }

    const message = {
        name: formData.get('name').trim(),
        email: formData.get('email').trim(),
        subject: (formData.get('subject') || '').trim() || 'General Inquiry',
        message: formData.get('message').trim()
    };

    saveContactMessage(message);

    const formContainer = document.getElementById('contact-form-container');
    if (formContainer) {
        formContainer.innerHTML = `
            <div class="success-message">
                <div class="success-icon"><i class="fa-solid fa-circle-check"></i></div>
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for contacting us. We will get back to you within 24 hours.</p>
                <button onclick="location.reload()" class="btn btn-primary">Send Another Message</button>
            </div>
        `;
    }
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', handleContactSubmit);

    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initCommonPageFeatures();
    initContactForm();
    console.log('Contact page JavaScript connected!');
});
