FROM node:22-slim AS build

WORKDIR /app/

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build


FROM node:22-slim AS server

WORKDIR /app/

COPY --from=build /app /app

RUN yarn install --production --frozen-lockfile

CMD ["yarn", "start:prod"]
