FROM node:12-alpine as build-server
MAINTAINER h7ml@qq.com
COPY ./ /dashboard
WORKDIR /dashboard

# global install & update
RUN npm i -g npm && npm i -g yarn
RUN rm yarn.lock
RUN yarn
RUN yarn build

FROM nginx
RUN mkdir /dashboard
COPY --from=0 /dashboard/dist /dashboard
COPY nginx.conf /etc/nginx/nginx.conf
