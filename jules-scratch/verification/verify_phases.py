from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.goto("http://localhost:8000")

    page.screenshot(path="jules-scratch/verification/01-introduction.png")

    page.click("a[href='#initial-stress']")
    page.wait_for_timeout(1000) # wait for content to load
    page.screenshot(path="jules-scratch/verification/02-initial-stress.png")

    page.click("a[href='#cm-parameters']")
    page.wait_for_timeout(1000)
    page.screenshot(path="jules-scratch/verification/03-cm-parameters.png")

    page.click("a[href='#model-configuration']")
    page.wait_for_timeout(1000)
    page.screenshot(path="jules-scratch/verification/04-model-configuration.png")

    page.click("a[href='#equal-disp-boundary']")
    page.wait_for_timeout(1000)
    page.screenshot(path="jules-scratch/verification/05-equal-disp-boundary.png")

    page.click("a[href='#earthquake-step-setting']")
    page.wait_for_timeout(1000)
    page.screenshot(path="jules-scratch/verification/06-earthquake-step-setting.png")

    page.click("a[href='#ru-acc-time-diagram']")
    page.wait_for_timeout(1000)
    page.screenshot(path="jules-scratch/verification/07-ru-acc-time-diagram.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
