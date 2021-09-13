# syntax=docker/dockerfile:1

FROM golang:1.16-alpine as go

RUN go get github.com/OpenSLO/oslo

WORKDIR /oslo

ARG OSLO_SPEC_PATH

COPY $OSLO_SPEC_PATH ./main.yaml

RUN oslo validate ./main.yaml > ./init-status

FROM node:14-alpine

WORKDIR /app

COPY --from=go /oslo/init-status ./
COPY --from=go /oslo/main.yaml ./

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

CMD [ "node", "index.js" ]