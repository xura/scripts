FROM node:latest
ADD https://cdn.xura.io/zod/zod-v0.0.0/zod-v0.0.0-linux-x64.tar.gz ./zod.tar.gz
RUN tar -xzf ./zod.tar.gz
COPY ./zod/.env.example ./zod/.env
