FROM node:16

WORKDIR /todo_list_app
COPY package.json .
RUN npm install
COPY . .
CMD npm start