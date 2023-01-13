FROM node:14

# Create app directory
WORKDIR /usr/src/app

COPY . .

RUN npm i

EXPOSE 4001

CMD [ "npm", "run", "start:prod" ]
