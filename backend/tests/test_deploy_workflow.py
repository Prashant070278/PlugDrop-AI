"""
CI/CD config validation tests for the Hostinger FTP GitHub Actions workflow.
Validates /app/.github/workflows/deploy.yml against the user's stated requirements.
This is a static config validation — no live deployment is invoked.
"""
import json
import os
import re
import urllib.request

import pytest
import yaml

WORKFLOW_PATH = "/app/.github/workflows/deploy.yml"
README_PATH = "/app/.github/workflows/README.md"
PKG_JSON_PATH = "/app/frontend/package.json"
CRACO_CONFIG_PATH = "/app/frontend/craco.config.js"
YARN_LOCK_PATH = "/app/frontend/yarn.lock"


@pytest.fixture(scope="module")
def workflow():
    with open(WORKFLOW_PATH, "r") as f:
        content = f.read()
    # PyYAML parses the `on:` key as boolean True — that's a known quirk; the YAML is still valid.
    data = yaml.safe_load(content)
    return {"raw": content, "data": data}


@pytest.fixture(scope="module")
def deploy_steps(workflow):
    return workflow["data"]["jobs"]["build-and-deploy"]["steps"]


# --- Files-exist sanity ---

def test_workflow_file_exists():
    assert os.path.isfile(WORKFLOW_PATH), "deploy.yml is missing"


def test_readme_file_exists():
    assert os.path.isfile(README_PATH), "workflows/README.md is missing"


def test_yarn_lockfile_exists():
    assert os.path.isfile(YARN_LOCK_PATH), "frontend/yarn.lock missing"


def test_craco_config_exists():
    assert os.path.isfile(CRACO_CONFIG_PATH), "frontend/craco.config.js missing"


# --- YAML syntax ---

def test_workflow_yaml_is_valid(workflow):
    assert isinstance(workflow["data"], dict)
    assert "jobs" in workflow["data"]
    assert "build-and-deploy" in workflow["data"]["jobs"]


# --- No reference to broken action in the workflow itself ---

def test_workflow_does_not_use_presshold(workflow):
    # The workflow file (deploy.yml) must not invoke presshold.
    assert "presshold" not in workflow["raw"].lower(), (
        "deploy.yml still references the broken presshold/sftp-deploy action"
    )


# --- Action references ---

def test_uses_checkout_v4(deploy_steps):
    assert any(s.get("uses") == "actions/checkout@v4" for s in deploy_steps)


def test_uses_setup_node_v4_with_node20_and_yarn_cache(deploy_steps):
    setup = next((s for s in deploy_steps if s.get("uses", "").startswith("actions/setup-node@")), None)
    assert setup is not None, "actions/setup-node step missing"
    assert setup["uses"] == "actions/setup-node@v4"
    with_ = setup.get("with", {})
    assert str(with_.get("node-version")) == "20"
    assert with_.get("cache") == "yarn"
    assert with_.get("cache-dependency-path") == "frontend/yarn.lock"


def test_uses_samkirkland_ftp_deploy(deploy_steps):
    ftp = next((s for s in deploy_steps if "FTP-Deploy-Action" in s.get("uses", "")), None)
    assert ftp is not None, "FTP deploy step missing"
    assert ftp["uses"] == "SamKirkland/FTP-Deploy-Action@v4.3.5"


def test_samkirkland_action_exists_on_github():
    req = urllib.request.Request(
        "https://github.com/SamKirkland/FTP-Deploy-Action",
        method="HEAD",
        headers={"User-Agent": "ci-validator"},
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        assert resp.status == 200, f"SamKirkland/FTP-Deploy-Action repo not reachable, got {resp.status}"


def test_samkirkland_tag_v4_3_5_exists():
    req = urllib.request.Request(
        "https://github.com/SamKirkland/FTP-Deploy-Action/releases/tag/v4.3.5",
        method="HEAD",
        headers={"User-Agent": "ci-validator"},
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        assert resp.status == 200, f"v4.3.5 tag not found, got {resp.status}"


# --- FTP step config ---

def test_ftp_step_has_correct_hostinger_config(deploy_steps):
    ftp = next(s for s in deploy_steps if "FTP-Deploy-Action" in s.get("uses", ""))
    w = ftp["with"]
    assert str(w["server"]) == "82.112.239.180"
    assert int(w["port"]) == 21
    assert w["server-dir"] == "/home/u858921777/domains/plugdrop.ai/public_html/"
    assert w["local-dir"] == "./frontend/build/"
    # Secrets referenced
    assert "secrets.FTP_USERNAME" in str(w["username"])
    assert "secrets.FTP_PASSWORD" in str(w["password"])


# --- Build step config ---

def test_install_step_uses_frozen_lockfile_in_frontend(deploy_steps):
    install = next(
        (s for s in deploy_steps if s.get("run", "").strip().startswith("yarn install")),
        None,
    )
    assert install is not None, "yarn install step missing"
    assert "--frozen-lockfile" in install["run"]
    assert install.get("working-directory") == "frontend"


def test_build_step_uses_yarn_build_in_frontend(deploy_steps):
    build = next(
        (s for s in deploy_steps if s.get("run", "").strip() == "yarn build"),
        None,
    )
    assert build is not None, "yarn build step missing"
    assert build.get("working-directory") == "frontend"
    # REACT_APP_BACKEND_URL should be injected via secrets at build time
    env = build.get("env", {})
    assert "REACT_APP_BACKEND_URL" in env
    assert "secrets.REACT_APP_BACKEND_URL" in str(env["REACT_APP_BACKEND_URL"])


# --- Secrets referenced in workflow ---

def test_required_secrets_referenced(workflow):
    raw = workflow["raw"]
    for secret in ["FTP_USERNAME", "FTP_PASSWORD", "REACT_APP_BACKEND_URL"]:
        assert re.search(r"secrets\.\s*" + secret, raw), f"secret {secret} not referenced"


# --- Frontend build system sanity ---

def test_package_json_build_uses_craco():
    with open(PKG_JSON_PATH) as f:
        pkg = json.load(f)
    assert pkg["scripts"]["build"] == "craco build"
    # CRACO must be a declared dependency
    assert "@craco/craco" in pkg.get("devDependencies", {}) or "@craco/craco" in pkg.get("dependencies", {})


# --- README documents secrets ---

def test_readme_documents_required_secrets():
    with open(README_PATH) as f:
        content = f.read()
    for secret in ["FTP_USERNAME", "FTP_PASSWORD", "REACT_APP_BACKEND_URL"]:
        assert secret in content, f"README does not document {secret}"
    # Mentions where to obtain (Hostinger hPanel)
    assert re.search(r"hPanel|Hostinger", content, re.IGNORECASE), \
        "README should mention Hostinger / hPanel as the source for FTP credentials"
