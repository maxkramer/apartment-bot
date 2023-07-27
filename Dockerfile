ARG BUILDER_WORKDIR=/tmp/builder/london-apartment-bot
ARG RUN_WORKDIR=/london-apartment-bot

FROM node:20-alpine as builder

ARG BUILDER_WORKDIR
WORKDIR $BUILDER_WORKDIR
COPY package*.json $BUILDER_WORKDIR

RUN npm install

COPY . $BUILDER_WORKDIR
RUN npm run build

FROM ubuntu:jammy

ENV NODE_ENV production
ENV LOG_DIR /var/log/london-apartment-bot

RUN apt-get update && apt-get install -y curl dumb-init git && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g npm && \
    rm -rf /var/lib/apt/lists/*

ARG RUN_WORKDIR
ARG BUILDER_WORKDIR
WORKDIR $RUN_WORKDIR

COPY --from=builder $BUILDER_WORKDIR $RUN_WORKDIR

RUN npx playwright install --with-deps chromium && \
    npm prune --omit=dev

CMD ["dumb-init", "npm", "start"]
