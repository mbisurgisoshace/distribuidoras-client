FROM nginx:alpine

COPY ./distribuidoras_nginx.conf /etc/nginx/conf.d/default.conf
COPY ./dist /usr/share/nginx/html
