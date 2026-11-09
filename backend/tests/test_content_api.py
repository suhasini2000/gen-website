"""Tests for content API behavior."""
import os
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
COURSE_KEYS = {"id", "name", "category", "description", "duration", "topics", "description_te", "featured"}


# Content: seeded courses + structure
def test_content_seeded_courses_shape():
    r = requests.get(f"{BASE_URL}/api/content", timeout=20)
    assert r.status_code == 200
    d = r.json()
    assert "_id" not in d
    for k in ["courses", "projects", "gallery", "faculty", "social_links", "reviews", "branding"]:
        assert k in d
    assert len(d["courses"]) == 49
    assert sum(1 for c in d["courses"] if c["featured"]) == 9
    for c in d["courses"]:
        assert COURSE_KEYS <= set(c.keys())
        assert "_id" not in c
    assert any(c["name"] == "Python" for c in d["courses"])
    assert {s["platform"] for s in d["social_links"]} == {"youtube", "instagram"}
    assert "logo_url" in d["branding"]


# Content: write protection
def test_put_content_requires_auth():
    r = requests.put(f"{BASE_URL}/api/content", json={"courses": []}, timeout=20)
    assert r.status_code == 401


def test_put_content_bad_token():
    r = requests.put(f"{BASE_URL}/api/content", json={"courses": []}, headers={"Authorization": "Bearer abc"}, timeout=20)
    assert r.status_code in (401, 403)


def test_get_enquiries_requires_auth():
    assert requests.get(f"{BASE_URL}/api/enquiries", timeout=20).status_code == 401


# Enquiries: create + validation
def test_post_enquiry_and_validation():
    r = requests.post(f"{BASE_URL}/api/enquiries", json={"student_name": "TEST_iter4", "phone": "9000000000", "course": "Python Programming", "mode": "Online", "message": "iter4"}, timeout=20)
    assert r.status_code == 200
    d = r.json()
    assert d["student_name"] == "TEST_iter4" and d["mode"] == "Online" and isinstance(d["id"], str)
    assert "_id" not in d
    bad = requests.post(f"{BASE_URL}/api/enquiries", json={"student_name": "TEST_x"}, timeout=20)
    assert bad.status_code == 422
