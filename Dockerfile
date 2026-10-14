# sec/atlas: static export built in one stage, served by unprivileged nginx in the other.
#
#   docker build -t sec-atlas --build-arg NEXT_PUBLIC_SITE_URL=https://your.domain .
#   docker run --rm -p 8080:8080 sec-atlas
#
# The build runs the content validation (prebuild) and the size budget gate, so a
# broken translation or a regression stops the image from being produced.
# Note: next/font downloads the Google fonts at BUILD time (they are then
# self-hosted in the output); the build container needs outbound internet once.

FROM node:22-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Canonical URL for sitemap, robots and Open Graph. Set it to where the site is served.
ARG NEXT_PUBLIC_SITE_URL=http://localhost:8080
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/out /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s CMD wget -q -O /dev/null http://127.0.0.1:8080/en || exit 1
