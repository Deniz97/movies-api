FROM node:20.11.1

WORKDIR /app

COPY package.json /app/
COPY package-lock.json /app/
RUN npm ci

COPY . /app
RUN npx prisma generate
RUN npm run build
EXPOSE 3001
CMD ["npm run start:prod"]
