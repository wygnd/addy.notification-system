FROM node:24-alpine AS builder
LABEL authors="wygnd"

WORKDIR /app

RUN npm config set registry https://registry.npmmirror.com && \
    npm install -g pnpm@11.3.0

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

COPY . .
ENV CI=true
RUN pnpm run build

FROM node:24-alpine AS production

WORKDIR /app

RUN npm config set registry https://registry.npmmirror.com && \
    npm install -g pnpm@11.3.0

ENV CI=true
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]