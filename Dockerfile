FROM node:16-bullseye
RUN sed -i 's/http:/https:/' /etc/apt/sources.list
RUN apt-get update && apt-get install -y python3-sklearn python3-nltk
WORKDIR /home/node
#USER node:node
COPY . /home/node
RUN npm ci
ENV OPENSSL_CONF /dev/null
ENV MONGODB_URI mongodb+srv://discover-news:0sdBzUjAFw8yy5wM@cluster0.apk3j.mongodb.net/news-scraper
CMD "npm" "start"
