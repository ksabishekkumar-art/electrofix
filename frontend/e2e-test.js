const fs = require('fs');
const path = require('path');

const API_BASE = "http://localhost:8080/api";

async function runTests() {
    console.log("Starting E2E Tests...");
    
    // Create a dummy image for testing
    const dummyImagePath = path.join(__dirname, 'dummy.png');
    if (!fs.existsSync(dummyImagePath)) {
        // Create 1x1 png (base64)
        const base64Data = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
        fs.writeFileSync(dummyImagePath, Buffer.from(base64Data, 'base64'));
    }

    try {
        console.log("1. Testing Portfolio...");
        const formData = new FormData();
        formData.append('title', 'Luxury Villa Wiring');
        formData.append('category', 'Residential');
        formData.append('description', 'Complete wiring for a 5-bedroom villa.');
        formData.append('image', new Blob([fs.readFileSync(dummyImagePath)]), 'dummy.png');
        
        let res = await fetch(`${API_BASE}/portfolio`, { method: 'POST', body: formData });
        if (!res.ok) throw new Error("Portfolio POST failed");
        let json = await res.json();
        console.log("   Portfolio saved:", json.title);

        console.log("2. Testing Bookings...");
        res = await fetch(`${API_BASE}/bookings`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                customerName: 'John Doe',
                phone: '1234567890',
                address: '123 Main St',
                selectedService: 'General Wiring',
                message: 'Need help asap'
            })
        });
        if (!res.ok) throw new Error("Booking POST failed");
        json = await res.json();
        console.log("   Booking saved:", json.customerName);

        console.log("3. Testing Contacts...");
        res = await fetch(`${API_BASE}/contacts`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: 'Jane Smith',
                email: 'jane@example.com',
                phone: '0987654321',
                message: 'Inquiry about commercial rates'
            })
        });
        if (!res.ok) throw new Error("Contact POST failed");
        json = await res.json();
        console.log("   Contact saved:", json.name);

        console.log("4. Testing Reviews...");
        const reviewForm = new FormData();
        reviewForm.append('customerName', 'Alice Brown');
        reviewForm.append('rating', '5');
        reviewForm.append('message', 'Excellent service, highly recommended!');
        reviewForm.append('image', new Blob([fs.readFileSync(dummyImagePath)]), 'dummy.png');
        
        res = await fetch(`${API_BASE}/reviews`, { method: 'POST', body: reviewForm });
        if (!res.ok) throw new Error("Review POST failed");
        json = await res.json();
        const reviewId = json.id;
        console.log("   Review saved, ID:", reviewId);
        
        // Approve review
        res = await fetch(`${API_BASE}/reviews/${reviewId}/approve`, { method: 'PUT' });
        if (!res.ok) throw new Error("Review APPROVE failed");
        console.log("   Review approved.");

        console.log("\nALL TESTS PASSED SUCCESSFULLY! Data populated.");
    } catch (e) {
        console.error("Test Failed:", e.message);
    }
}

runTests();
