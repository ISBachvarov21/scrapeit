import os

PYPPETEER_CHROMIUM_REVISION = '1353551'

os.environ['PYPPETEER_CHROMIUM_REVISION'] = PYPPETEER_CHROMIUM_REVISION

import pyppeteer
import pyppeteer.browser


async def get_browser() -> pyppeteer.browser.Browser:
    if 'browser' not in globals():
        global browser
        browser = await pyppeteer.launch(headless=True, args=['--no-sandbox', '--headless', '--disable-gpu'])
        
    return globals()['browser']
