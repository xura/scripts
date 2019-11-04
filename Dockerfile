FROM node:latest
COPY ./hermes /hermes
RUN cd /hermes \
 && yarn install \
 && yarn build

ENTRYPOINT ["/hermes/bin/hermes"]
