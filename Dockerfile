FROM node:12-alpine
MAINTAINER h7ml@qq.com
COPY ./ /dashboard
WORKDIR /dashboard

RUN apk add --update --no-cache git curl python2 && \
  curl --compressed -o- -L https://yarnpkg.com/install.sh | sh && \
  cd /usr/local/bin && \
  rm yarn && \
  ln -s /root/.yarn/bin/yarn && \
  yarn install && yarn build

FROM nginx
RUN mkdir /dashboard
COPY --from=0 /dashboard/dist /dashboard
COPY nginx.conf /etc/nginx/nginx.conf
