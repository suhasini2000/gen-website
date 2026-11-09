"""Reusable public-site browser smoke test for the archived run scripts."""

from __future__ import annotations

import os
from pathlib import Path
from urllib.parse import urljoin

from playwright.sync_api import Error as PlaywrightError
from playwright.sync_api import sync_playwright


PUBLIC_ROUTES = (
    ("/", "home-hero"),
    ("/courses", "courses-main-title"),
    ("/about", None),
    ("/projects", None),
    ("/gallery", None),
    ("/contact", None),
    ("/vedic-maths", None),
    ("/ai-vista-360", None),
)


def _record_console_message(message, messages):
    if message.type == "error":
        messages.append(f"console error: {message.text}")


def _write_log(path: Path | None, lines: list[str]) -> None:
    if path is not None:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def run_smoke(
    *,
    screenshot: Path | None = None,
    error_screenshot: Path | None = None,
    console_log: Path | None = None,
    mobile: bool = False,
) -> None:
    """Check public routes and navigation without submitting forms or signing in."""
    base_url = os.environ.get("BASE_URL", "http://127.0.0.1:3000").rstrip("/") + "/"
    viewport = {"width": 390, "height": 844} if mobile else {"width": 1920, "height": 1080}
    runtime_errors: list[str] = []
    console_errors: list[str] = []
    results: list[str] = [f"Base URL: {base_url}", f"Viewport: {viewport['width']}x{viewport['height']}"]
    current_url = base_url

    screenshot = screenshot.resolve() if screenshot else None
    error_screenshot = error_screenshot.resolve() if error_screenshot else None

    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(headless=True)
            page = browser.new_page(viewport=viewport)
            page.on("pageerror", lambda error: runtime_errors.append(str(error)))
            page.on("console", lambda message: _record_console_message(message, console_errors))

            current_url = base_url
            response = page.goto(current_url, wait_until="domcontentloaded", timeout=60_000)
            if response is not None and response.status >= 400:
                raise AssertionError(f"Homepage returned HTTP {response.status}")
            page.get_by_test_id("home-hero").wait_for(state="visible", timeout=30_000)
            results.append("PASS homepage and hero rendered")

            language_toggle = page.get_by_test_id("lang-toggle")
            if language_toggle.count():
                initial_language = page.evaluate("localStorage.getItem('gi-lang') || 'en'")
                next_language = "te" if initial_language == "en" else "en"
                page.get_by_test_id(f"lang-toggle-{next_language}").click()
                page.wait_for_function(
                    "language => localStorage.getItem('gi-lang') === language",
                    arg=next_language,
                )
                page.reload(wait_until="domcontentloaded")
                page.get_by_test_id("home-hero").wait_for(state="visible", timeout=30_000)
                persisted_language = page.evaluate("localStorage.getItem('gi-lang')")
                if persisted_language != next_language:
                    raise AssertionError("Language choice did not persist after reload")
                results.append("PASS language toggle and persistence")
            else:
                results.append("SKIP language toggle not present")

            for route, expected_test_id in PUBLIC_ROUTES[1:]:
                current_url = urljoin(base_url, route.lstrip("/"))
                response = page.goto(current_url, wait_until="domcontentloaded", timeout=60_000)
                if response is not None and response.status >= 400:
                    raise AssertionError(f"{route} returned HTTP {response.status}")
                if expected_test_id:
                    page.get_by_test_id(expected_test_id).wait_for(state="visible", timeout=30_000)
                elif route == "/gallery":
                    page.locator(
                        '[data-testid="gallery-placeholder"], [data-testid="gallery-real"]'
                    ).wait_for(state="visible", timeout=30_000)
                else:
                    page.locator("main h1").first.wait_for(state="visible", timeout=30_000)
                results.append(f"PASS {route} rendered")

            current_url = urljoin(base_url, "ai-training")
            page.goto(current_url, wait_until="domcontentloaded", timeout=60_000)
            page.wait_for_url("**/ai-vista-360", timeout=15_000)
            results.append("PASS /ai-training redirects to /ai-vista-360")

            current_url = urljoin(base_url, "contact")
            page.goto(current_url, wait_until="domcontentloaded", timeout=60_000)
            page.locator("form.enquiry-form").wait_for(state="visible", timeout=30_000)
            results.append("PASS contact enquiry form rendered (not submitted)")

            overflow = page.evaluate(
                "() => document.documentElement.scrollWidth > document.documentElement.clientWidth"
            )
            if mobile and overflow:
                results.append("WARN mobile page has horizontal overflow")

            if screenshot is not None:
                screenshot.parent.mkdir(parents=True, exist_ok=True)
                page.screenshot(path=str(screenshot), type="jpeg", quality=80, full_page=True)
                results.append(f"Screenshot: {screenshot}")

            browser.close()
    except (AssertionError, PlaywrightError, OSError) as error:
        results.append(f"FAIL {error}")
        if error_screenshot is not None:
            error_screenshot.parent.mkdir(parents=True, exist_ok=True)
            try:
                with sync_playwright() as playwright:
                    browser = playwright.chromium.launch(headless=True)
                    page = browser.new_page(viewport=viewport)
                    page.goto(current_url, wait_until="domcontentloaded", timeout=15_000)
                    page.screenshot(path=str(error_screenshot), type="jpeg", quality=80, full_page=True)
                    browser.close()
                results.append(f"Failure screenshot: {error_screenshot}")
            except PlaywrightError as screenshot_error:
                results.append(f"Could not capture failure screenshot: {screenshot_error}")
        results.extend(f"Runtime error: {error}" for error in runtime_errors)
        results.extend(console_errors)
        _write_log(console_log, results)
        raise

    results.extend(f"Runtime error: {error}" for error in runtime_errors)
    results.extend(console_errors)
    _write_log(console_log, results)
    if runtime_errors:
        raise AssertionError("Browser runtime errors were reported:\n" + "\n".join(runtime_errors))
    print("\n".join(results))
