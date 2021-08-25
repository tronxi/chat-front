FROM alpine/git as git
ARG BRANCH=master
WORKDIR /repo
ADD https://api.github.com/repos/tronxi/chat-front/git/refs/heads/master version.json
RUN git clone https://github.com/tronxi/chat-front.git
RUN cd chat-front && git checkout $BRANCH

FROM node:current-alpine3.12 as builder
ARG ENVIRONMENT=dev
ARG PATH=/
COPY --from="git" /repo/chat-front /front
WORKDIR /front
RUN npm install -y
RUN npm install -g @angular/cli -y
RUN ng build --configuration=$ENVIRONMENT --base-href $PATH

FROM nginx:1.17.6-alpine
RUN rm -r /usr/share/nginx/html/
COPY --from="builder" /front/dist/chat-front/ /usr/share/nginx/html/
