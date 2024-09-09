import pytesseract
import cv2
import asyncio
from pyppeteer import launch
import bs4
from fuzzysearch import find_near_matches

async def main():
    # TODO: dynamic image reading and text extraction
    # TODO: should come after backend is implemented
    # image = cv2.imread(r'images/ss.png')
    image = cv2.imread(r'images/amazon-usb-c.png')

    # Convert the image to grayscale
    image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # HACK: hardcoded crop
    # image = image[230:274, 58:272]
    # image = image[92:112, 86:270]

    text = pytesseract.image_to_string(image, lang='eng')
    
    browser = await launch(headless=True, args=['--no-sandbox', '--headless', '--disable-gpu'])
    page = await browser.newPage()
    await page.setViewport({'width': 1920, 'height': 1080})
    await page.goto('https://www.amazon.com/s?k=usb+c&crid=13MUUAA4E6QXG&sprefix=usb+%2Caps%2C220&ref=nb_sb_noss_2', {'waitUntil': 'networkidle0'})
    await page.screenshot({'path': 'images/amazon-usb-c.png', 'fullPage': True})
    
    content = await page.content()
    
    soup = bs4.BeautifulSoup(content, 'html5lib')
    
    text = text.strip().split('\n')

    matches = []
    for subtext in text:
        matches = find_near_matches(subtext, soup.body.prettify(), max_l_dist=4) # type: ignore
        if matches:
            break
    
    matched_element = None
    for match in matches:
        matched_element = soup.find(lambda tag: tag.string and match.matched in tag.string) # type: ignore
        if matched_element:
            break
    
    if not matched_element:
        print('No match found')
        print('Text:', text)
        return
    
    current_element = matched_element
    parent_tags = []
    
    while current_element.parent.parent is not None:
        current_element = current_element.parent
        if current_element:
            parent_tags.append(current_element.name)
        else:
            break
        
    # NOTE: parent hierarchy must be reversed when constructing the CSS selector
    css_selector = f'{" > ".join(parent_tags[::-1])} > {matched_element.name}'

    print(f'CSS selector: {css_selector}')
    # Find all elements that match this parent hierarchy
    matching_elements = soup.css.select(css_selector) # type: ignore

    print(f'Found {len(matching_elements)} matching elements')
    for element in matching_elements:
        print(element.text)
        
    await browser.close()

loop = asyncio.new_event_loop()
asyncio.set_event_loop(loop)

asyncio.get_event_loop().run_until_complete(main())