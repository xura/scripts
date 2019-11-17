FROM node:latest
COPY ./hermes /hermes
RUN mv /hermes/.env /hermes/.prod.env
RUN cd /hermes \
 && yarn install \
 && yarn build

ENTRYPOINT ["/hermes/bin/hermes"]
