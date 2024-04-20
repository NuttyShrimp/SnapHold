FROM node:20-alpine AS base

WORKDIR /src

COPY --link package.json yarn.lock .
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn prisma generate

RUN yarn run build

# RUN yarn prisma generate --generator docker

ENV NODE_ENV=production

CMD [ "yarn", "start"]
