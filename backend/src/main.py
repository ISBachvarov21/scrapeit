# import pytesseract
# import cv2
import asyncio
from pyppeteer import launch
import bs4
from fuzzysearch import find_near_matches

async def main():
    # # TODO: dynamic image reading and text extraction
    # # TODO: should come after backend is implemented
    # image = cv2.imread(r'images/ss3.png')

    # # Convert the image to grayscale
    # image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # # HACK: hardcoded crop
    # image = image[230:274, 58:272]


    # text = pytesseract.image_to_string(image, lang='eng+bul')
    
    browser = await launch(headless=True, args=['--no-sandbox', '--headless', '--disable-gpu'])
    page = await browser.newPage()
    await page.setViewport({'width': 1920, 'height': 1080})
    await page.goto('https://karclean.bg/', {'waitUntil': 'networkidle0'})
    
    content = await page.content()
    
    soup = bs4.BeautifulSoup(content, 'html5lib')
    
    # text = text.strip().split('\n')

    text = ["KARCHER WD 3 V-17/4/20"]
    
    matches = []
    for subtext in text:
        matches = find_near_matches(subtext, soup.body.prettify(), max_l_dist=4) # type: ignore
        if matches:
            break
    
    matched_element = None
    for match in matches:
        print(f'trying to match: {match.matched}')
        matched_element = soup.find(lambda tag: tag.string and match.matched in tag.string) # type: ignore
        if matched_element:
            break
    
    if not matched_element:
        print('No match found')
        return
    
    print(f'Matched: {matched_element}')
    
    current_element = matched_element
    parent_tags = []
    
    # NOTE: Changing this to more than 2 levels up breaks the CSS selector.
    # TODO: Submit issue to soupsieve
    for _ in range(2):
        current_element = current_element.find_parent()
        if current_element:
            parent_tags.append(current_element.name)
        else:
            break
    
    print(f'Parent tags: {parent_tags}')
    css_selector = f'{" ".join(parent_tags)} {matched_element.name}'
    print(f'CSS selector: {css_selector}')

    # Find all elements that match this parent hierarchy
    matching_elements = soup.css.select(css_selector)

    print(f'Found {len(matching_elements)} matching elements')
    # for element in matching_elements:
    #     print(element.text)
    

loop = asyncio.new_event_loop()
asyncio.set_event_loop(loop)

asyncio.get_event_loop().run_until_complete(main())