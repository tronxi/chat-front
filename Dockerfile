FROM node:lts-alpine3.14 as builder
WORKDIR /front
ARG HREF
COPY . /front
RUN npm install -y
RUN npm install -g @angular/cli -y
RUN ng build --prod

FROM nginx:1.17.6-alpine
RUN rm -r /usr/share/nginx/html/
COPY --from="builder" /front/dist/chat-front/ /usr/share/nginx/html/
COPY --from="builder" /front/script.sh /usr/share/nginx/html/
CMD ["/bin/sh",  "-c",  "/usr/share/nginx/html/script.sh && envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]
