// Environment Config
const ENV = "production"; // Switch to 'development' for local testing
const API_BASE_URL = ENV === "production" ? "https://electrofix-backend.onrender.com/api" : "http://localhost:8080/api";

function showNetworkError(message) {
    if (window.showJarvisPopup) {
        window.showJarvisPopup(`ERROR: ${message}`);
    } else {
        console.error(message);
    }
}

const api = {
    // Services
    getServices: async () => {
        try { const res = await fetch(`${API_BASE_URL}/services`); return await res.json(); } catch (e) { console.error(e); return []; }
    },
    createService: async (formData) => {
        try { const res = await fetch(`${API_BASE_URL}/services`, { method: 'POST', body: formData }); return await res.json(); } catch (e) { throw e; }
    },
    updateService: async (id, formData) => {
        try { const res = await fetch(`${API_BASE_URL}/services/${id}`, { method: 'PUT', body: formData }); return await res.json(); } catch (e) { throw e; }
    },
    deleteService: async (id) => {
        try { await fetch(`${API_BASE_URL}/services/${id}`, { method: 'DELETE' }); } catch (e) { throw e; }
    },

    // Portfolio
    getPortfolio: async () => {
        try { const res = await fetch(`${API_BASE_URL}/portfolio`); return await res.json(); } catch (e) { return []; }
    },
    createPortfolio: async (formData) => {
        try { const res = await fetch(`${API_BASE_URL}/portfolio`, { method: 'POST', body: formData }); return await res.json(); } catch (e) { throw e; }
    },
    updatePortfolio: async (id, formData) => {
        try { const res = await fetch(`${API_BASE_URL}/portfolio/${id}`, { method: 'PUT', body: formData }); return await res.json(); } catch (e) { throw e; }
    },
    deletePortfolio: async (id) => {
        try { await fetch(`${API_BASE_URL}/portfolio/${id}`, { method: 'DELETE' }); } catch (e) { throw e; }
    },

    // Bookings
    getBookings: async () => {
        try { const res = await fetch(`${API_BASE_URL}/bookings`); return await res.json(); } catch (e) { return []; }
    },
    createBooking: async (data) => {
        try { const res = await fetch(`${API_BASE_URL}/bookings`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) }); return await res.json(); } catch (e) { throw e; }
    },
    deleteBooking: async (id) => {
        try { await fetch(`${API_BASE_URL}/bookings/${id}`, { method: 'DELETE' }); } catch (e) { throw e; }
    },
    trackBooking: async (id, phone) => {
        try { const res = await fetch(`${API_BASE_URL}/bookings/track/${id}?phone=${encodeURIComponent(phone)}`); if(!res.ok) throw new Error('Not found'); return await res.json(); } catch (e) { throw e; }
    },
    updateBookingStatus: async (id, data) => {
        try { const res = await fetch(`${API_BASE_URL}/bookings/status/${id}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) }); return await res.json(); } catch (e) { throw e; }
    },

    // Contacts
    getContacts: async () => {
        try { const res = await fetch(`${API_BASE_URL}/contacts`); return await res.json(); } catch (e) { return []; }
    },
    createContact: async (data) => {
        try { const res = await fetch(`${API_BASE_URL}/contacts`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) }); return await res.json(); } catch (e) { throw e; }
    },
    deleteContact: async (id) => {
        try { await fetch(`${API_BASE_URL}/contacts/${id}`, { method: 'DELETE' }); } catch (e) { throw e; }
    },

    // Reviews
    getReviews: async () => {
        try { const res = await fetch(`${API_BASE_URL}/reviews`); if (!res.ok) throw new Error('Network error'); return await res.json(); } catch (e) { showNetworkError("Failed to fetch reviews"); return []; }
    },
    createReview: async (formData) => {
        try { const res = await fetch(`${API_BASE_URL}/reviews`, { method: 'POST', body: formData }); if (!res.ok) throw new Error('Failed to post review'); return await res.json(); } catch (e) { showNetworkError(e.message); throw e; }
    },
    approveReview: async (id) => {
        try { const res = await fetch(`${API_BASE_URL}/reviews/${id}/approve`, { method: 'PUT' }); if (!res.ok) throw new Error('Failed to approve review'); return await res.json(); } catch (e) { showNetworkError(e.message); throw e; }
    },
    deleteReview: async (id) => {
        try { const res = await fetch(`${API_BASE_URL}/reviews/${id}`, { method: 'DELETE' }); if (!res.ok) throw new Error('Failed to delete review'); } catch (e) { showNetworkError(e.message); throw e; }
    }
};
