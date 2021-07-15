FROM node:12-alpine as build-server
MAINTAINER h7ml@qq.com
COPY ./ /dashboard
WORKDIR /dashboard

# Install packages
RUN npm install && npm run build

FROM nginx
RUN mkdir /dashboard
COPY --from=0 /dashboard/dist /dashboard
COPY nginx.conf /etc/nginx/nginx.conf
