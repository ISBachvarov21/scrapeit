FROM python:3.12 AS development

WORKDIR /usr/src/app/backend

RUN apt-get update

RUN apt-get install -y tesseract-ocr tesseract-ocr-all
RUN apt-get install -y ffmpeg libsm6 libxext6
RUN apt-get install -y chromium libxtst6
RUN apt install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
COPY images .

FROM development AS installer

COPY requirements.txt . 

RUN pip install -r requirements.txt

COPY . .

FROM installer AS production

EXPOSE 8000

CMD [ "python", "src/main.py" ]