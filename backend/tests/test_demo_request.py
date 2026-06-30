"""Backend tests for /api/demo-request and /api/chat endpoints."""
import os
import requests
import pytest

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://voice-agent-hub-62.preview.emergentagent.com').rstrip('/')


@pytest.fixture
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


class TestRoot:
    def test_root(self, api):
        r = api.get(f"{BASE_URL}/api/")
        assert r.status_code == 200
        assert r.json().get("message") == "PlugDrop.ai API"


class TestDemoRequest:
    def test_create_demo_request_success(self, api):
        payload = {
            "name": "TEST_Agent QA",
            "email": "test_agent@example.com",
            "phone": "+919999999999",
            "company": "PlugDrop QA",
            "interest": "general",
            "message": "Automated test demo request",
        }
        r = api.post(f"{BASE_URL}/api/demo-request", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert data["company"] == payload["company"]
        assert data["phone"] == payload["phone"]
        assert "id" in data and isinstance(data["id"], str)

    def test_create_demo_request_invalid_email(self, api):
        r = api.post(f"{BASE_URL}/api/demo-request", json={
            "name": "x", "email": "not-an-email", "phone": "+911"
        })
        assert r.status_code in (400, 422)

    def test_create_demo_request_missing_fields(self, api):
        r = api.post(f"{BASE_URL}/api/demo-request", json={"name": "x"})
        assert r.status_code in (400, 422)

    def test_list_demo_requests(self, api):
        r = api.get(f"{BASE_URL}/api/demo-requests")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        # Should have at least one record (the test_create test above)
        if data:
            assert "_id" not in data[0]  # mongo _id should be excluded
            assert "id" in data[0]


class TestChat:
    def test_chat_empty(self, api):
        r = api.post(f"{BASE_URL}/api/chat", json={"message": ""})
        assert r.status_code == 400

    def test_chat_voice_topic(self, api):
        r = api.post(f"{BASE_URL}/api/chat", json={"message": "Tell me about voice AI"})
        assert r.status_code == 200
        assert "voice" in r.json()["reply"].lower() or "telephony" in r.json()["reply"].lower()

    def test_chat_fallback(self, api):
        r = api.post(f"{BASE_URL}/api/chat", json={"message": "xyz random text"})
        assert r.status_code == 200
        assert len(r.json()["reply"]) > 0
