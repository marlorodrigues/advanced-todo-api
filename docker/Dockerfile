###
# Build Stage
###
FROM node:22-alpine AS build-stage

WORKDIR /app
COPY . .
RUN npm ci && npm run generate && npm run build

###
# Release Stage
###
FROM node:22-alpine3.18 AS release-stage

RUN mkdir -p /tmp
RUN apk add curl nano --no-cache

WORKDIR /app

COPY --from=build-stage /app/node_modules /app/node_modules
COPY --from=build-stage /app/build /app/build
COPY --from=build-stage /app/prisma /app/prisma
COPY --from=build-stage /app/package.json /app
COPY --from=build-stage /app/package-lock.json /app
COPY --from=build-stage /app/config /app/config

EXPOSE 3200
USER root

CMD ["npm", "start"]
