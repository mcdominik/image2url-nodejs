FROM node:22.15-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:22.15-alpine as production

ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

RUN apk add --no-cache tini

COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder --chown=appuser:appgroup /usr/src/app/dist ./dist

RUN mkdir ./storage && chown appuser:appgroup ./storage

USER appuser

EXPOSE 3000

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "dist/server"]