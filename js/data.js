// ============================================
// Hospital Data - Departments & Doctors
// ============================================

const hospitalData = {
    name: "Community Care Hospital",
    tagline: "Your Health, Our Priority",
    emergencyNumbers: ["112", "193"],
    address: "123 Health Avenue, Accra, Ghana",
    phone: "+233 30 123 4567",
    email: "info@communitycarehospital.com",
    workingHours: {
        weekdays: "8:00 AM - 8:00 PM",
        weekends: "9:00 AM - 5:00 PM",
        emergency: "24/7"
    }
};

const departments = [
    {
        id: "opd",
        name: "Out-Patient Department (OPD)",
        description: "General consultations and primary care services for all age groups. First point of contact for most patients.",
        icon: '<i class="fa-solid fa-hospital"></i>',
        doctors: [
            { id: "doc1", name: "Dr. Kwame Asante", specialty: "General Practitioner", hours: "Mon-Fri: 8AM - 4PM" },
            { id: "doc2", name: "Dr. Ama Mensah", specialty: "Family Medicine", hours: "Mon-Sat: 9AM - 5PM" },
            { id: "doc3", name: "Dr. Kofi Boateng", specialty: "General Practitioner", hours: "Mon-Fri: 2PM - 8PM" }
        ]
    },
    {
        id: "pediatrics",
        name: "Pediatrics",
        description: "Specialized medical care for infants, children, and adolescents. Vaccinations and growth monitoring available.",
        icon: '<i class="fa-solid fa-baby"></i>',
        doctors: [
            { id: "doc4", name: "Dr. Akua Owusu", specialty: "Pediatrician", hours: "Mon-Fri: 8AM - 3PM" },
            { id: "doc5", name: "Dr. Yaw Danquah", specialty: "Child Specialist", hours: "Tue-Sat: 10AM - 6PM" }
        ]
    },
    {
        id: "maternity",
        name: "Maternity",
        description: "Comprehensive maternity services including antenatal care, delivery, and postnatal support. 24/7 emergency delivery.",
        icon: '<i class="fa-solid fa-person-pregnant"></i>',
        doctors: [
            { id: "doc6", name: "Dr. Afua Sarpong", specialty: "Obstetrician-Gynecologist", hours: "Mon-Fri: 9AM - 5PM" },
            { id: "doc7", name: "Dr. Kofi Adjei", specialty: "Maternity Specialist", hours: "Mon-Sat: 8AM - 4PM" },
            { id: "doc8", name: "Dr. Efua Mensah", specialty: "Midwife Consultant", hours: "24/7 On-Call" }
        ]
    },
    {
        id: "laboratory",
        name: "Laboratory",
        description: "Full diagnostic laboratory services including blood tests, urine analysis, X-rays, ultrasound, and more.",
        icon: '<i class="fa-solid fa-flask"></i>',
        doctors: [
            { id: "doc9", name: "Dr. Samuel Asare", specialty: "Pathologist", hours: "Mon-Sat: 7AM - 6PM" },
            { id: "doc10", name: "Dr. Grace Anim", specialty: "Lab Technician", hours: "Mon-Fri: 8AM - 5PM" }
        ]
    },
    {
        id: "pharmacy",
        name: "Pharmacy",
        description: "In-house pharmacy providing prescription medications, over-the-counter drugs, and medical supplies.",
        icon: '<i class="fa-solid fa-pills"></i>',
        doctors: [
            { id: "doc11", name: "Pharm. Benjamin Osei", specialty: "Chief Pharmacist", hours: "Mon-Sat: 8AM - 8PM" },
            { id: "doc12", name: "Pharm. Lydia Tetteh", specialty: "Clinical Pharmacist", hours: "Mon-Fri: 9AM - 6PM" }
        ]
    },
    {
        id: "dental",
        name: "Dental",
        description: "Complete dental care services including check-ups, cleaning, fillings, extractions, and cosmetic dentistry.",
        icon: '<i class="fa-solid fa-tooth"></i>',
        doctors: [
            { id: "doc13", name: "Dr. Emmanuel Addo", specialty: "Dental Surgeon", hours: "Mon-Fri: 9AM - 5PM" },
            { id: "doc14", name: "Dr. Patricia Ansah", specialty: "Orthodontist", hours: "Tue-Sat: 10AM - 6PM" }
        ]
    }
];

const services = [
    {
        id: "opd-service",
        name: "Out-Patient Services",
        description: "General consultations, health screenings, and primary care for all ages.",
        icon: '<i class="fa-solid fa-hospital"></i>'
    },
    {
        id: "pharmacy-service",
        name: "24/7 Pharmacy",
        description: "Full-service pharmacy with prescription filling and medication counseling.",
        icon: '<i class="fa-solid fa-pills"></i>'
    },
    {
        id: "lab-service",
        name: "Diagnostic Lab",
        description: "State-of-the-art laboratory for blood work, imaging, and diagnostics.",
        icon: '<i class="fa-solid fa-flask"></i>'
    }
];

// Time slots
const timeSlots = [
    { id: "morning", label: "Morning (8AM - 12PM)", value: "Morning" },
    { id: "afternoon", label: "Afternoon (12PM - 4PM)", value: "Afternoon" },
    { id: "evening", label: "Evening (4PM - 8PM)", value: "Evening" }
];

// Helper functions for data
function getDepartmentById(id) {
    return departments.find(dept => dept.id === id);
}

function getDoctorById(doctorId) {
    for (const dept of departments) {
        const doctor = dept.doctors.find(doc => doc.id === doctorId);
        if (doctor) return { ...doctor, departmentId: dept.id, departmentName: dept.name };
    }
    return null;
}

function getDoctorsByDepartment(deptId) {
    const dept = getDepartmentById(deptId);
    return dept ? dept.doctors : [];
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { hospitalData, departments, services, timeSlots, getDepartmentById, getDoctorById, getDoctorsByDepartment };
}