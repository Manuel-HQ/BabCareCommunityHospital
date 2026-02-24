// ============================================
// Departments Page JavaScript
// ============================================

function renderDepartments() {
    const container = document.getElementById('departments-container');
    if (!container) return;

    container.innerHTML = departments.map(dept => `
        <div class="department-card" data-department="${dept.id}">
            <div class="department-icon">${dept.icon}</div>
            <h3>${dept.name}</h3>
            <p class="department-desc">${dept.description}</p>
            <div class="doctors-list">
                <h4>Our Doctors</h4>
                ${dept.doctors.map(doc => `
                    <div class="doctor-item">
                        <span class="doctor-name">${doc.name}</span>
                        <span class="doctor-specialty">${doc.specialty}</span>
                        <span class="doctor-hours">${doc.hours}</span>
                    </div>
                `).join('')}
            </div>
            <a href="appointment.html?dept=${dept.id}" class="btn btn-primary btn-sm">Book Appointment</a>
        </div>
    `).join('');
}

function filterDepartments(searchTerm = '', filter = 'all') {
    const cards = document.querySelectorAll('.department-card');

    cards.forEach(card => {
        const deptId = card.dataset.department;
        const dept = getDepartmentById(deptId);

        let matchesSearch = true;
        let matchesFilter = true;

        if (searchTerm) {
            const searchText = `${dept.name} ${dept.description} ${dept.doctors.map(d => d.name).join(' ')}`.toLowerCase();
            matchesSearch = searchText.includes(searchTerm);
        }

        if (filter !== 'all') {
            matchesFilter = deptId === filter;
        }

        card.style.display = (matchesSearch && matchesFilter) ? 'block' : 'none';
    });
}

function initDepartmentSearch() {
    const searchInput = document.getElementById('department-search');
    const filterBtns = document.querySelectorAll('.filter-btn');

    if (searchInput) {
        searchInput.addEventListener('input', event => {
            const searchTerm = event.target.value.toLowerCase();
            filterDepartments(searchTerm);
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(button => button.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            filterDepartments('', filter);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initCommonPageFeatures();
    renderDepartments();
    initDepartmentSearch();
    console.log('Departments page JavaScript connected!');
});
