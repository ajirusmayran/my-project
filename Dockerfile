FROM node:10

WORKDIR /usr/src/web-reactjs

COPY package*.json ./

RUN rm -f ./package-lock.json

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
# Bundle app source

COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]