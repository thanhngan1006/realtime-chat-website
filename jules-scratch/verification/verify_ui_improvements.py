import re
from playwright.sync_api import sync_playwright, Page, expect

def verify_ui(page: Page):
    """
    Navigates to the login page, enters credentials, and takes a screenshot of the chat UI.
    """
    # 1. Navigate to the login page
    page.goto("http://localhost:5173/login")

    # 2. Wait for the login form to be visible
    expect(page.get_by_role("heading", name="Login")).to_be_visible(timeout=10000)

    # 3. Fill in login credentials
    page.get_by_placeholder("Enter your email").fill("test@example.com")
    page.get_by_placeholder("Enter your password").fill("password123")

    # 4. Click the login button
    page.get_by_role("button", name="Login").click()

    # 5. Wait for the chat page to load by looking for the chat input field
    chat_input = page.get_by_placeholder("Aa")
    expect(chat_input).to_be_visible(timeout=10000)

    # 6. Take a screenshot of the improved UI
    page.screenshot(path="jules-scratch/verification/verification.png")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_ui(page)
        except Exception as e:
            print(f"An error occurred during verification: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    main()