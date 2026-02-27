// ============================================
// Appointment Page JavaScript
// ============================================

function populateDepartments() {
    const deptSelect = document.getElementById('department');
    if (!deptSelect) return;

    deptSelect.innerHTML = '<option value="">Select Department</option>';
    departments.forEach(dept => {
        deptSelect.innerHTML += `<option value="${dept.id}">${dept.name}</option>`;
    });
}

function populateDoctors(deptId) {
    const doctorSelect = document.getElementById('doctor');
    if (!doctorSelect) return;

    doctorSelect.innerHTML = '<option value="">Select Doctor</option>';

    if (deptId) {
        const doctors = getDoctorsByDepartment(deptId);
        doctors.forEach(doc => {
            doctorSelect.innerHTML += `<option value="${doc.id}">${doc.name} - ${doc.specialty}</option>`;
        });
    }
}

function showAppointmentConfirmation(appointment) {
    const formContainer = document.getElementById('appointment-form-container');
    const confirmationContainer = document.getElementById('appointment-confirmation');

    if (formContainer) formContainer.style.display = 'none';

    if (confirmationContainer) {
        confirmationContainer.style.display = 'block';
        confirmationContainer.innerHTML = `
            <div class="confirmation-card">
                <div class="confirmation-icon"><i class="fa-solid fa-circle-check"></i></div>
                <h2>Appointment Booked Successfully!</h2>
                <div class="ticket-id">
                    <span>Ticket ID</span>
                    <strong>${appointment.ticketId}</strong>
                </div>
                <div class="appointment-details">
                    <div class="detail-row">
                        <span class="label">Patient Name:</span>
                        <span class="value">${appointment.fullName}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Department:</span>
                        <span class="value">${appointment.department}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Doctor:</span>
                        <span class="value">${appointment.doctor}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Date:</span>
                        <span class="value">${formatDate(appointment.date)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Time Slot:</span>
                        <span class="value">${appointment.timeSlot}</span>
                    </div>
                </div>
                <div class="confirmation-note">
                    <p>Please arrive 15 minutes before your appointment time.</p>
                    <p>Bring your ID and any previous medical records.</p>
                </div>
                <div class="confirmation-actions">
                    <button onclick="window.print()" class="btn btn-secondary">Print Ticket</button>
                    <a href="queue.html" class="btn btn-primary">View Queue</a>
                    <a href="appointment.html" class="btn btn-outline">Book Another</a>
                </div>
            </div>
        `;
    }
}

function handleAppointmentSubmit(event) {
    event.preventDefault();

    const form = event.target;
    if (!validateForm(form)) {
        return;
    }

    const formData = new FormData(form);
    const dept = getDepartmentById(formData.get('department'));
    const doctor = getDoctorById(formData.get('doctor'));

    const appointment = {
        ticketId: generateTicketId(),
        fullName: formData.get('fullName').trim(),
        phone: formData.get('phone').trim(),
        gender: formData.get('gender'),
        age: formData.get('age'),
        department: dept.name,
        departmentId: dept.id,
        doctor: doctor.name,
        doctorId: doctor.id,
        date: formData.get('appointmentDate'),
        timeSlot: formData.get('timeSlot'),
        symptoms: formData.get('symptoms').trim(),
        status: 'Pending',
        createdAt: new Date().toISOString()
    };

    saveAppointment(appointment);
    showAppointmentConfirmation(appointment);
}

function initAppointmentForm() {
    const form = document.getElementById('appointment-form');
    if (!form) return;

    const dateInput = document.getElementById('appointment-date');
    if (dateInput) {
        dateInput.min = getTodayDate();
    }

    populateDepartments();

    const deptSelect = document.getElementById('department');
    if (deptSelect) {
        deptSelect.addEventListener('change', event => {
            populateDoctors(event.target.value);
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const preselectedDept = urlParams.get('dept');
    if (preselectedDept && deptSelect) {
        deptSelect.value = preselectedDept;
        populateDoctors(preselectedDept);
    }

    form.addEventListener('submit', handleAppointmentSubmit);

    const inputs = form.querySelectorAll('input, select, textarea');
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
    initAppointmentForm();
    console.log('Appointment page JavaScript connected!');
});
