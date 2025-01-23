# STAGE 1

FROM node:20-alpine AS build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./tsconfig.json  ./

COPY ./src ./src

RUN npm run build

# STAGE 2

FROM node:20-alpine AS serve-stage

WORKDIR /app

COPY package*.json .

RUN  npm install --omit=dev --ignore-scripts

COPY --from=build-stage /app/dist ./

CMD ["node", "/app"]

# METADATA #

EXPOSE 8080