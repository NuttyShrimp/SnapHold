FROM node:20-alpine AS base

WORKDIR /src

COPY --link package.json yarn.lock .

FROM base AS builder

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn prisma generate

RUN yarn run build

FROM base

ENV NODE_ENV=production

COPY --from=builder /src/.output /src/.output
COPY --from=builder /src/.nuxt /src/.nuxt
COPY --from=builder /src/prisma /src/prisma

RUN yarn global add prisma

CMD [ "yarn", "start"]
