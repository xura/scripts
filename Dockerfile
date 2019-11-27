FROM node:latest
ADD https://cdn.xura.io/zod/zod.tar.gz ./
COPY ./zod/.env.example /zod/.env
ENTRYPOINT ['/zod/bin/zod']
