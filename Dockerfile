FROM node:16.14-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm run build

FROM node:16.14-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g pnpm

RUN pnpm install --production

COPY . .

COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/client/dist ./apps/client/dist

EXPOSE 3001

CMD [ "node", "apps/api/dist/main" ]
