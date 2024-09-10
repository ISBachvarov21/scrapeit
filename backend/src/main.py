from fastapi import FastAPI
import threading
from fastapi.responses import FileResponse
from browser import get_browser
from pydantic import BaseModel

app = FastAPI()

lock = threading.Lock()
link = ""
image_number = 0

class Link(BaseModel):
    link:str

@app.post("/link/set")
async def set_link(link: Link):
    link = link.link
    browser = await get_browser()
    page = await browser.newPage()
    await page.setViewport({'width': 1920, 'height': 1080})
    await page.goto(link, {'waitUntil': 'networkidle0'})
    
    with lock:
        await page.screenshot({'path': fr'images/{globals()['image_number']}.png', 'fullPage': True})
        globals()['image_number'] += 1
        return FileResponse(fr'images/{globals()['image_number'] - 1}.png')
