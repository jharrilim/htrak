FROM       node:10-alpine as base
WORKDIR    /app
COPY       . .
RUN        npm ci
RUN        npm run build

FROM       node:10-alpine as runtime
WORKDIR    /app
COPY       --from=base /app/dist .
ENTRYPOINT [ "node", "." ]
