# syntax=docker/dockerfile:1

FROM golang:1.16-alpine as go

WORKDIR /app

RUN go get github.com/OpenSLO/oslo

COPY ./files/*.yaml /app

CMD oslo validate /app/valid-service.yaml > oslo-output
