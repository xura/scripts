FROM node:latest
COPY ./zod/.env.example /zod/.env
ADD https://cdn.xura.io/zod/zod.tar.gz /
RUN tar xf zod.tar.gz -C /zod
ENTRYPOINT ['/zod/bin/zod']
