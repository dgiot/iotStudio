FROM node:10
MAINTAINER h7ml@qq.com
COPY ./ /dashboard
WORKDIR /dashboard

RUN curl -o- -L https://yarnpkg.com/install.sh | bash
RUN $HOME/.yarn/bin/yarn install
RUN yarn install && yarn build

FROM nginx
RUN mkdir /dashboard
COPY --from=0 /dashboard/dist /dashboard
COPY nginx.conf /etc/nginx/nginx.conf
