ARG NODE_VERSION
FROM node:${NODE_VERSION}-alpine AS deps

WORKDIR /app
COPY package*.json ./
RUN npm install

FROM node:alpine AS runner

WORKDIR /app

COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules
COPY . ./

CMD ["npm", "start"]