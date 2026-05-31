// Authentication Check
document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('admin_auth') !== 'true') {
        window.location.href = 'efx-hidden-control-panel.html';
    }
    showSection('services');
    
    // Initialize Particles
    if (window.particlesJS) {
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 30, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": ["#00e5ff", "#38f9ff"] },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.4, "random": true },
                "size": { "value": 3, "random": true },
                "line_linked": { "enable": true, "distance": 150, "color": "#00e5ff", "opacity": 0.2, "width": 1 },
                "move": { "enable": true, "speed": 1.5, "direction": "none", "random": true, "out_mode": "out" }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": { "onhover": { "enable": true, "mode": "grab" }, "resize": true },
                "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 0.5 } } }
            },
            "retina_detect": true
        });
    }
    setTimeout(initAnalytics, 1000);
});

function logout() {
    sessionStorage.removeItem('admin_auth');
    window.location.href = 'efx-hidden-control-panel.html';
}

function initAnalytics() {
    const ctxBookings = document.getElementById('bookingsChart');
    const ctxServices = document.getElementById('servicesChart');
    if (!ctxBookings || !ctxServices) return;

    // Use Chart.defaults for global Stark theme
    Chart.defaults.color = '#8d99ae';
    Chart.defaults.font.family = "'Rajdhani', sans-serif";

    new Chart(ctxBookings, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Monthly Bookings',
                data: [12, 19, 15, 25, 22, 30],
                borderColor: '#00e5ff',
                backgroundColor: 'rgba(0, 229, 255, 0.2)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: 'rgba(0, 229, 255, 0.1)' } },
                x: { grid: { color: 'rgba(0, 229, 255, 0.1)' } }
            }
        }
    });

    new Chart(ctxServices, {
        type: 'doughnut',
        data: {
            labels: ['Wiring', 'Lighting', 'Repairs', 'Installations'],
            datasets: [{
                data: [40, 20, 25, 15],
                backgroundColor: ['#00e5ff', '#38f9ff', '#ffb400', '#ff3b3b'],
                borderWidth: 1,
                borderColor: '#050505'
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: 'bottom' } }
        }
    });
}

function showSection(sectionId) {
    document.querySelectorAll('.admin-section').forEach(sec => sec.style.display = 'none');
    document.getElementById(sectionId + '-section').style.display = 'block';
    
    document.querySelectorAll('.sidebar-menu li a').forEach(a => a.classList.remove('active'));
    event && event.target.classList.add('active');

    if (sectionId === 'services') loadServicesAdmin();
    if (sectionId === 'portfolio') loadPortfolioAdmin();
    if (sectionId === 'bookings') loadBookingsAdmin();
    if (sectionId === 'contacts') loadContactsAdmin();
    if (sectionId === 'reviews') loadReviewsAdmin();
}

window.previewMedia = (input, containerId) => {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    if (input.files && input.files.length > 0) {
        Array.from(input.files).forEach(file => {
            const url = URL.createObjectURL(file);
            if (file.type.startsWith('image/')) {
                container.innerHTML += `<img src="${url}" style="height:60px; border-radius:4px;">`;
            } else if (file.type.startsWith('video/')) {
                container.innerHTML += `<video src="${url}" style="height:60px; border-radius:4px;" controls></video>`;
            }
        });
    }
};

// --- Services CRUD ---
async function loadServicesAdmin() {
    const tbody = document.getElementById('services-table-body');
    tbody.innerHTML = '<tr><td colspan="6">Loading...</td></tr>';
    const services = await api.getServices();
    if (services.length === 0) { tbody.innerHTML = '<tr><td colspan="6">No services found.</td></tr>'; return; }
    tbody.innerHTML = services.map(s => `<tr>
        <td>${s.id}</td>
        <td>${s.imageUrl ? `<img src="${window.getImageUrl(s.imageUrl)}" width="50" height="50" style="border-radius:4px; object-fit:cover;">` : 'No Image'}</td>
        <td>${s.name}</td><td>${s.category}</td><td>₹${s.price}</td>
        <td>
            <button class="action-btn edit-btn" onclick="editService(${s.id}, '${s.name.replace(/'/g, "\\'")}', ${s.price}, '${s.category.replace(/'/g, "\\'")}', '${s.description.replace(/'/g, "\\'")}')">Edit</button>
            <button class="action-btn delete-btn" onclick="deleteService(${s.id})">Delete</button>
        </td></tr>`).join('');
}

function openServiceModal() { document.getElementById('modal-title').textContent = 'Add Service'; document.getElementById('service-form').reset(); document.getElementById('service-id').value = ''; document.getElementById('service-modal').style.display = 'flex'; }
function closeModal() { document.getElementById('service-modal').style.display = 'none'; }
function editService(id, name, price, category, desc) { document.getElementById('modal-title').textContent = 'Edit Service'; document.getElementById('service-id').value = id; document.getElementById('service-name').value = name; document.getElementById('service-price').value = price; document.getElementById('service-category').value = category; document.getElementById('service-desc').value = desc; document.getElementById('service-modal').style.display = 'flex'; }
async function deleteService(id) { if (confirm('Delete this service?')) { await api.deleteService(id); loadServicesAdmin(); } }

document.getElementById('service-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('service-id').value;
    const formData = new FormData();
    formData.append('name', document.getElementById('service-name').value);
    formData.append('price', document.getElementById('service-price').value);
    formData.append('category', document.getElementById('service-category').value);
    formData.append('description', document.getElementById('service-desc').value);
    const imageFile = document.getElementById('service-image').files[0];
    if (imageFile) formData.append('image', imageFile);
    
    if (id) await api.updateService(id, formData);
    else await api.createService(formData);
    closeModal(); loadServicesAdmin();
});

// --- Portfolio CRUD ---
async function loadPortfolioAdmin() {
    const tbody = document.getElementById('portfolio-table-body');
    tbody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
    const portfolio = await api.getPortfolio();
    if (portfolio.length === 0) { tbody.innerHTML = '<tr><td colspan="5">No portfolio projects found.</td></tr>'; return; }
    tbody.innerHTML = portfolio.map(p => {
        let mediaHtml = 'No Media';
        if (p.imageUrls && p.imageUrls.length > 0) {
            mediaHtml = `<img src="${window.getImageUrl(p.imageUrls[0])}" width="50" height="50" style="border-radius:4px; object-fit:cover;">`;
        } else if (p.imageUrl) {
            mediaHtml = `<img src="${window.getImageUrl(p.imageUrl)}" width="50" height="50" style="border-radius:4px; object-fit:cover;">`;
        } else if (p.videoUrl) {
            mediaHtml = `<video src="${window.getImageUrl(p.videoUrl)}" width="50" height="50" style="border-radius:4px; object-fit:cover;"></video>`;
        }
        
        return `<tr>
        <td>${p.id}</td>
        <td>${mediaHtml}</td>
        <td>${p.title}</td><td>${p.category}</td>
        <td>
            <button class="action-btn edit-btn" onclick="editPortfolio(${p.id}, '${p.title.replace(/'/g, "\\'")}', '${p.category.replace(/'/g, "\\'")}', '${p.description.replace(/'/g, "\\'")}')">Edit</button>
            <button class="action-btn delete-btn" onclick="deletePortfolio(${p.id})">Delete</button>
        </td></tr>`;
    }).join('');
}

function openPortfolioModal() { document.getElementById('port-modal-title').textContent = 'Add Project'; document.getElementById('portfolio-form').reset(); document.getElementById('port-id').value = ''; document.getElementById('img-preview-container').innerHTML = ''; document.getElementById('vid-preview-container').innerHTML = ''; document.getElementById('portfolio-modal').style.display = 'flex'; }
function closePortfolioModal() { document.getElementById('portfolio-modal').style.display = 'none'; }
function editPortfolio(id, title, category, desc) { document.getElementById('port-modal-title').textContent = 'Edit Project'; document.getElementById('port-id').value = id; document.getElementById('port-title').value = title; document.getElementById('port-category').value = category; document.getElementById('port-desc').value = desc; document.getElementById('img-preview-container').innerHTML = ''; document.getElementById('vid-preview-container').innerHTML = ''; document.getElementById('portfolio-modal').style.display = 'flex'; }
async function deletePortfolio(id) { if (confirm('Delete this project?')) { await api.deletePortfolio(id); loadPortfolioAdmin(); } }

document.getElementById('portfolio-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('port-id').value;
    const formData = new FormData();
    formData.append('title', document.getElementById('port-title').value);
    formData.append('category', document.getElementById('port-category').value);
    formData.append('description', document.getElementById('port-desc').value);
    
    const imageFiles = document.getElementById('port-images').files;
    for (let i = 0; i < imageFiles.length; i++) {
        formData.append('images', imageFiles[i]);
    }
    
    const videoFile = document.getElementById('port-video').files[0];
    if (videoFile) formData.append('video', videoFile);
    
    if (id) await api.updatePortfolio(id, formData);
    else await api.createPortfolio(formData);
    closePortfolioModal(); loadPortfolioAdmin();
});

// --- Bookings Admin ---
async function loadBookingsAdmin() {
    const tbody = document.getElementById('bookings-table-body');
    const data = await api.getBookings();
    if (data.length === 0) { tbody.innerHTML = '<tr><td colspan="8">No bookings found.</td></tr>'; return; }
    tbody.innerHTML = data.map(b => `<tr>
        <td>${b.id}</td>
        <td>${new Date(b.createdAt).toLocaleDateString()}</td>
        <td>${b.customerName}<br/><small>${b.phone}</small></td>
        <td>${b.selectedService}</td>
        <td style="color: ${getStatusColor(b.bookingStatus)}; font-weight: bold;">${b.bookingStatus || 'Pending'}</td>
        <td>${b.technicianName || 'N/A'}</td>
        <td>${b.estimatedArrivalTime || 'N/A'}</td>
        <td>
            <button class="action-btn edit-btn" onclick="openBookingStatusModal(${b.id}, '${b.bookingStatus || 'Pending'}', '${(b.technicianName || '').replace(/'/g, "\\'")}', '${(b.estimatedArrivalTime || '').replace(/'/g, "\\'")}')">Status</button>
            <button class="action-btn delete-btn" onclick="deleteBooking(${b.id})">Delete</button>
        </td></tr>`).join('');
}

function getStatusColor(status) {
    switch(status) {
        case 'Confirmed': return '#3498db';
        case 'Technician Assigned': return '#f39c12';
        case 'On The Way': return 'var(--neon-cyan)';
        case 'Work Started': return '#9b59b6';
        case 'Completed': return '#2ecc71';
        case 'Cancelled': return '#e74c3c';
        default: return 'orange'; // Pending
    }
}

function openBookingStatusModal(id, status, techName, eta) {
    document.getElementById('status-booking-id').value = id;
    document.getElementById('status-select').value = status;
    document.getElementById('status-tech-name').value = techName;
    document.getElementById('status-eta').value = eta;
    document.getElementById('booking-status-modal').style.display = 'flex';
}

function closeBookingStatusModal() {
    document.getElementById('booking-status-modal').style.display = 'none';
}

document.getElementById('booking-status-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('status-booking-id').value;
    const data = {
        bookingStatus: document.getElementById('status-select').value,
        technicianName: document.getElementById('status-tech-name').value,
        estimatedArrivalTime: document.getElementById('status-eta').value
    };
    await api.updateBookingStatus(id, data);
    closeBookingStatusModal();
    loadBookingsAdmin();
});

async function deleteBooking(id) { if (confirm('Delete booking?')) { await api.deleteBooking(id); loadBookingsAdmin(); } }

// --- Contacts Admin ---
async function loadContactsAdmin() {
    const tbody = document.getElementById('contacts-table-body');
    const data = await api.getContacts();
    if (data.length === 0) { tbody.innerHTML = '<tr><td colspan="6">No contacts found.</td></tr>'; return; }
    tbody.innerHTML = data.map(c => `<tr><td>${c.id}</td><td>${new Date(c.createdAt).toLocaleDateString()}</td><td>${c.name}</td><td>${c.email}</td><td>${c.phone}</td><td><button class="action-btn delete-btn" onclick="deleteContact(${c.id})">Delete</button></td></tr>`).join('');
}
async function deleteContact(id) { if (confirm('Delete contact request?')) { await api.deleteContact(id); loadContactsAdmin(); } }

// --- Reviews Admin ---
async function loadReviewsAdmin() {
    const tbody = document.getElementById('reviews-table-body');
    const data = await api.getReviews();
    if (data.length === 0) { tbody.innerHTML = '<tr><td colspan="6">No reviews found.</td></tr>'; return; }
    tbody.innerHTML = data.map(r => `<tr>
        <td>${r.id}</td>
        <td>${r.profileImage ? `<img src="${window.getImageUrl(r.profileImage)}" width="40" height="40" style="border-radius:50%; object-fit:cover;">` : 'N/A'}</td>
        <td>${r.customerName}</td><td>${r.rating} / 5</td>
        <td>${r.approved ? '<span style="color:var(--accent);">Approved</span>' : '<span style="color:yellow;">Pending</span>'}</td>
        <td>
            ${!r.approved ? `<button class="action-btn edit-btn" onclick="approveReview(${r.id})">Approve</button>` : ''}
            <button class="action-btn delete-btn" onclick="deleteReview(${r.id})">Delete</button>
        </td></tr>`).join('');
}
async function approveReview(id) { await api.approveReview(id); loadReviewsAdmin(); }
async function deleteReview(id) { if (confirm('Delete review?')) { await api.deleteReview(id); loadReviewsAdmin(); } }
