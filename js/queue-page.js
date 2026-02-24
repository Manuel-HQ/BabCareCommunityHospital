// ============================================
// Queue Page JavaScript
// ============================================

function getTodayAppointments() {
    const today = getTodayDate();
    return getAppointments().filter(apt => apt.date === today);
}

function renderQueue() {
    const queueContainer = document.getElementById('queue-container');
    const queueStats = document.getElementById('queue-stats');
    if (!queueContainer) return;

    const todayAppointments = getTodayAppointments();
    const queueStatus = getQueueStatus();

    if (queueStats) {
        const pending = todayAppointments.filter(apt => apt.status === 'Pending').length;
        const served = todayAppointments.filter(apt => apt.status === 'Served').length;

        queueStats.innerHTML = `
            <div class="stat-card">
                <span class="stat-value">${todayAppointments.length}</span>
                <span class="stat-label">Total Today</span>
            </div>
            <div class="stat-card">
                <span class="stat-value">${pending}</span>
                <span class="stat-label">Waiting</span>
            </div>
            <div class="stat-card">
                <span class="stat-value">${served}</span>
                <span class="stat-label">Served</span>
            </div>
        `;
    }

    if (todayAppointments.length === 0) {
        queueContainer.innerHTML = `
            <div class="empty-queue">
                <div class="empty-icon"><i class="fa-solid fa-clipboard-list"></i></div>
                <h3>No Appointments Today</h3>
                <p>There are no appointments scheduled for today.</p>
                <a href="appointment.html" class="btn btn-primary">Book Appointment</a>
            </div>
        `;
        return;
    }

    const sortedAppointments = [...todayAppointments].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    queueContainer.innerHTML = `
        <div class="queue-header">
            <h3>Today's Queue - ${formatDate(new Date())}</h3>
        </div>
        <div class="queue-list">
            ${sortedAppointments.map((apt, index) => {
                const isNowServing = queueStatus.nowServing === apt.ticketId;
                const isServed = apt.status === 'Served';
                const isCancelled = apt.status === 'Cancelled';

                let statusClass = '';
                if (isNowServing) statusClass = 'now-serving';
                else if (isServed) statusClass = 'served';
                else if (isCancelled) statusClass = 'cancelled';

                return `
                    <div class="queue-item ${statusClass}">
                        <div class="queue-number">#${index + 1}</div>
                        <div class="queue-ticket">${apt.ticketId}</div>
                        <div class="queue-info">
                            <span class="patient-name">${apt.fullName}</span>
                            <span class="department">${apt.department}</span>
                        </div>
                        <div class="queue-time">${apt.timeSlot}</div>
                        <div class="queue-status">
                            ${isNowServing ? '<span class="status-badge serving">Now Serving</span>' : ''}
                            ${isServed ? '<span class="status-badge served">Served</span>' : ''}
                            ${isCancelled ? '<span class="status-badge cancelled">Cancelled</span>' : ''}
                            ${!isNowServing && !isServed && !isCancelled ? '<span class="status-badge pending">Waiting</span>' : ''}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function nextPatient() {
    const todayAppointments = getTodayAppointments()
        .filter(apt => apt.status === 'Pending')
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    if (todayAppointments.length === 0) {
        alert('No more patients in the queue.');
        return;
    }

    const queueStatus = getQueueStatus();
    const currentIndex = todayAppointments.findIndex(apt => apt.ticketId === queueStatus.nowServing);

    if (queueStatus.nowServing) {
        updateAppointment(queueStatus.nowServing, { status: 'Served' });
    }

    const nextIndex = currentIndex + 1;

    if (nextIndex < todayAppointments.length) {
        const nextApt = todayAppointments[nextIndex];
        setQueueStatus({ nowServing: nextApt.ticketId, queueIndex: nextIndex });
    } else if (todayAppointments.length > 0) {
        const nextApt = todayAppointments[0];
        setQueueStatus({ nowServing: nextApt.ticketId, queueIndex: 0 });
    }

    renderQueue();
}

function initQueuePage() {
    renderQueue();

    const nextBtn = document.getElementById('next-patient-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', nextPatient);
    }

    const resetBtn = document.getElementById('reset-queue-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset the queue? This will clear the "Now Serving" status.')) {
                resetQueue();
                renderQueue();
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initCommonPageFeatures();
    initQueuePage();
    console.log('Queue page JavaScript connected!');
});
