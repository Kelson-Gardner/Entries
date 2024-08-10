
FROM node:20.8.1

WORKDIR /Entries

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4173

CMD ["npm", "run", "preview"]