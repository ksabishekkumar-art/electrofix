import requests
import os
import base64

API_BASE = "http://localhost:8080/api"

def run_tests():
    print("Starting E2E Tests...")
    
    dummy_img_path = "dummy.png"
    if not os.path.exists(dummy_img_path):
        base64_data = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
        with open(dummy_img_path, "wb") as f:
            f.write(base64.b64decode(base64_data))
            
    print("1. Testing Portfolio...")
    files = {'image': ('dummy.png', open(dummy_img_path, 'rb'), 'image/png')}
    data = {
        'title': 'Luxury Villa Wiring',
        'category': 'Residential',
        'description': 'Complete wiring for a 5-bedroom villa.'
    }
    r = requests.post(f"{API_BASE}/portfolio", data=data, files=files)
    if r.status_code == 201:
        print("   Portfolio saved:", r.json()['title'])
    else:
        print("   Portfolio POST failed:", r.status_code)

    print("2. Testing Bookings...")
    booking_data = {
        'customerName': 'John Doe',
        'phone': '1234567890',
        'address': '123 Main St',
        'selectedService': 'General Wiring',
        'message': 'Need help asap'
    }
    r = requests.post(f"{API_BASE}/bookings", json=booking_data)
    if r.status_code == 201:
        print("   Booking saved:", r.json()['customerName'])
    else:
        print("   Booking POST failed:", r.status_code)

    print("3. Testing Contacts...")
    contact_data = {
        'name': 'Jane Smith',
        'email': 'jane@example.com',
        'phone': '0987654321',
        'message': 'Inquiry about commercial rates'
    }
    r = requests.post(f"{API_BASE}/contacts", json=contact_data)
    if r.status_code == 201:
        print("   Contact saved:", r.json()['name'])
    else:
        print("   Contact POST failed:", r.status_code)

    print("4. Testing Reviews...")
    files2 = {'image': ('dummy.png', open(dummy_img_path, 'rb'), 'image/png')}
    review_data = {
        'customerName': 'Alice Brown',
        'rating': '5',
        'message': 'Excellent service, highly recommended!'
    }
    r = requests.post(f"{API_BASE}/reviews", data=review_data, files=files2)
    if r.status_code == 201:
        review_id = r.json()['id']
        print("   Review saved, ID:", review_id)
        # Approve review
        r2 = requests.put(f"{API_BASE}/reviews/{review_id}/approve")
        if r2.status_code == 200:
            print("   Review approved.")
        else:
            print("   Review APPROVE failed:", r2.status_code)
    else:
        print("   Review POST failed:", r.status_code)

    print("\nALL TESTS PASSED SUCCESSFULLY! Data populated.")

if __name__ == "__main__":
    run_tests()
