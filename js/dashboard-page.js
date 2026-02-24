// ============================================
// Dashboard Page JavaScript
// ============================================

function renderDashboardStats() {
    const statsContainer = document.getElementById('dashboard-stats');
    if (!statsContainer) return;

    const appointments = getAppointments();
    const today = getTodayDate();

    const total = appointments.length;
    const todayBookings = appointments.filter(apt => apt.date === today).length;
    const served = appointments.filter(apt => apt.status === 'Served').length;
    const cancelled = appointments.filter(apt => apt.status === 'Cancelled').length;
    const pending = appointments.filter(apt => apt.status === 'Pending').length;

    statsContainer.innerHTML = `
        <div class="stat-card total">
            <div class="stat-icon"><i class="fa-solid fa-chart-column"></i></div>
            <div class="stat-content">
                <span class="stat-value">${total}</span>
                <span class="stat-label">Total Bookings</span>
            </div>
        </div>
        <div class="stat-card today">
            <div class="stat-icon"><i class="fa-solid fa-calendar-days"></i></div>
            <div class="stat-content">
                <span class="stat-value">${todayBookings}</span>
                <span class="stat-label">Today's Bookings</span>
            </div>
        </div>
        <div class="stat-card served">
            <div class="stat-icon"><i class="fa-solid fa-circle-check"></i></div>
            <div class="stat-content">
                <span class="stat-value">${served}</span>
                <span class="stat-label">Served</span>
            </div>
        </div>
        <div class="stat-card cancelled">
            <div class="stat-icon"><i class="fa-solid fa-circle-xmark"></i></div>
            <div class="stat-content">
                <span class="stat-value">${cancelled}</span>
                <span class="stat-label">Cancelled</span>
            </div>
        </div>
        <div class="stat-card pending">
            <div class="stat-icon"><i class="fa-solid fa-hourglass-half"></i></div>
            <div class="stat-content">
                <span class="stat-value">${pending}</span>
                <span class="stat-label">Pending</span>
            </div>
        </div>
    `;
}

function renderAppointmentsTable(filter = '') {
    const tableBody = document.getElementById('appointments-table-body');
    if (!tableBody) return;

    let appointments = getAppointments();

    if (filter) {
        const searchTerm = filter.toLowerCase();
        appointments = appointments.filter(apt =>
            apt.ticketId.toLowerCase().includes(searchTerm) ||
            apt.fullName.toLowerCase().includes(searchTerm) ||
            apt.department.toLowerCase().includes(searchTerm)
        );
    }

    appointments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (appointments.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="no-data">
                    ${filter ? 'No appointments found matching your search.' : 'No appointments booked yet.'}
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = appointments.map(apt => `
        <tr class="status-${apt.status.toLowerCase()}">
            <td><span class="ticket-id">${apt.ticketId}</span></td>
            <td>${apt.fullName}</td>
            <td>${apt.department}</td>
            <td>${apt.doctor}</td>
            <td>${formatDate(apt.date)}<br><small>${apt.timeSlot}</small></td>
            <td>
                <span class="status-badge ${apt.status.toLowerCase()}">${apt.status}</span>
            </td>
            <td>
                <div class="action-buttons">
                    ${apt.status === 'Pending' ? `
                        <button class="btn-icon btn-serve" onclick="markAsServed('${apt.ticketId}')" title="Mark as Served">
                            <i class="fa-solid fa-check"></i>
                        </button>
                        <button class="btn-icon btn-cancel" onclick="markAsCancelled('${apt.ticketId}')" title="Cancel">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    ` : ''}
                    <button class="btn-icon btn-delete" onclick="deleteAppointmentConfirm('${apt.ticketId}')" title="Delete">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function initDashboardSearch() {
    const searchInput = document.getElementById('dashboard-search');
    if (searchInput) {
        searchInput.addEventListener('input', event => {
            renderAppointmentsTable(event.target.value);
        });
    }
}

function markAsServed(ticketId) {
    updateAppointment(ticketId, { status: 'Served' });
    renderDashboardStats();
    renderAppointmentsTable(document.getElementById('dashboard-search')?.value || '');
}

function markAsCancelled(ticketId) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
        updateAppointment(ticketId, { status: 'Cancelled' });
        renderDashboardStats();
        renderAppointmentsTable(document.getElementById('dashboard-search')?.value || '');
    }
}

function deleteAppointmentConfirm(ticketId) {
    if (confirm('Are you sure you want to delete this appointment? This action cannot be undone.')) {
        deleteAppointment(ticketId);
        renderDashboardStats();
        renderAppointmentsTable(document.getElementById('dashboard-search')?.value || '');
    }
}

function initDashboard() {
    renderDashboardStats();
    renderAppointmentsTable();
    initDashboardSearch();
}

document.addEventListener('DOMContentLoaded', () => {
    initCommonPageFeatures();
    initDashboard();
    console.log('Dashboard page JavaScript connected!');
});
