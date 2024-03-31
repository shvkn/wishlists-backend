FROM node:16-alpine AS base
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
ENV NODE_ENV="production"
RUN --mount=type=cache,id=yarn,target=/yarn/store yarn install --immutable

FROM base AS build
RUN --mount=type=cache,id=yarn,target=/yarn/store yarn install --immutable
RUN yarn build

FROM node:16-alpine AS production
WORKDIR /app
RUN npm install -g pm2
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app
CMD [ "pm2-runtime", "src/main.js", "--update-env" ]
