FROM node:latest
COPY ./hermes /hermes
RUN mv /zod/.env.example /hermes/.env
RUN cd /zod \
 && yarn install \
 && yarn build

ENTRYPOINT ["/zod/bin/run"]
