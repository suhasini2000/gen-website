import os
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")


def test_root_and_content_are_json_safe():
    root = requests.get(f"{BASE_URL}/api/", timeout=20)
    content = requests.get(f"{BASE_URL}/api/content", timeout=20)
    assert root.status_code == 200
    assert root.json()["message"] == "GenInfotech API ready"
    assert content.status_code == 200
    assert "_id" not in content.json()


def test_enquiries_requires_auth_for_reads():
    response = requests.get(f"{BASE_URL}/api/enquiries", timeout=20)
    assert response.status_code == 401


def test_enquiry_create_shape_and_id_safety():
    response = requests.post(
        f"{BASE_URL}/api/enquiries",
        json={"student_name": "TEST_API_REVIEW", "phone": "9999999999", "course": "Python Programming", "mode": "Offline", "message": "regression"},
        timeout=20,
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data["id"], str)
    assert data["student_name"] == "TEST_API_REVIEW"
    assert "_id" not in data