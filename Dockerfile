FROM node:latest
ADD https://cdn.xura.io/zod/zod.tar.gz /
RUN tar xf zod.tar.gz -C /
COPY ./zod/.env.example /zod/.env
RUN chmod 755 /zod/bin/zod
ENTRYPOINT ["/zod/bin/zod"]
