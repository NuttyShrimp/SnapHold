FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS builder

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

RUN pnpm prisma generate

RUN pnpm run build

FROM base

ENV NODE_ENV=production

COPY --from=builder /app/.output /src/.output
COPY --from=builder /app/.nuxt /src/.nuxt
COPY --from=builder /app/prisma /src/prisma

RUN yarn global add prisma

CMD [ "pnpm", "start"]
