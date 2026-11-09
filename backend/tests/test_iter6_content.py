"""Tests for the sixth content iteration."""
# Iteration 6: content v2 migration (courses/socials/reviews) + enquiry units
import os
import pytest
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
MAIN_ORDER = ["AI Tools Training", "Python", "Java", ".NET", "Full Stack Development", "C / C++", "MS Office", "Tally with GST", "AutoCAD"]


@pytest.fixture(scope="module")
def content():
    r = requests.get(f"{BASE_URL}/api/content", timeout=20)
    assert r.status_code == 200
    return r.json()


# Courses
def test_courses_count_and_main_order(content):
    courses = content["courses"]
    assert len(courses) == 49
    assert [c["name"] for c in courses[:9]] == MAIN_ORDER
    assert all(c["featured"] for c in courses[:9])
    assert not any(c["featured"] for c in courses[9:])


def test_courses_have_telugu_and_no_fee(content):
    for c in content["courses"]:
        assert c.get("description_te"), c["name"]
        assert "fee" not in c and "show_fee" not in c
    ai = content["courses"][0]
    assert "ChatGPT" in ai["topics"]


# Socials and reviews
def test_social_links(content):
    s = content["social_links"]
    assert len(s) == 4
    assert [x["platform"] for x in s] == ["youtube", "youtube", "instagram", "instagram"]
    assert not any(x["platform"] == "facebook" for x in s)


def test_reviews(content):
    r = content["reviews"]
    assert len(r["youtube_videos"]) == 2
    assert "NplVw3DcuCM" in r["youtube_videos"][0] and "EzJCs3qoCRk" in r["youtube_videos"][1]
    assert r["google_reviews_url"] == "" and r["instagram_reel_url"] == ""


# Enquiry units
@pytest.mark.parametrize("unit", ["vedic_maths", "ai_vista", "main"])
def test_enquiry_units(unit):
    r = requests.post(f"{BASE_URL}/api/enquiries", json={"student_name": f"TEST_iter6_{unit}", "phone": "9999999999", "course": "X", "mode": "Offline", "unit": unit}, timeout=20)
    assert r.status_code == 200
    d = r.json()
    assert d["unit"] == unit and isinstance(d["id"], str) and "_id" not in d


def test_enquiry_default_unit():
    r = requests.post(f"{BASE_URL}/api/enquiries", json={"student_name": "TEST_iter6_default", "phone": "9999999999", "course": "X", "mode": "Online"}, timeout=20)
    assert r.status_code == 200
    assert r.json()["unit"] == "main"


def test_enquiry_invalid_unit():
    r = requests.post(f"{BASE_URL}/api/enquiries", json={"student_name": "TEST_iter6_bad", "phone": "9", "course": "X", "mode": "Online", "unit": "bogus"}, timeout=20)
    assert r.status_code == 422


def test_enquiries_and_put_require_auth():
    assert requests.get(f"{BASE_URL}/api/enquiries", timeout=20).status_code == 401
    assert requests.put(f"{BASE_URL}/api/content", json={}, timeout=20).status_code == 401
