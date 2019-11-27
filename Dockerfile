FROM node:latest
ADD https://cdn.xura.io/zod/zod.tar.gz /
RUN tar xf zod.tar.gz -C /
COPY ./zod/.env.example /zod/.env
ENTRYPOINT ['/zod/bin/zod']
