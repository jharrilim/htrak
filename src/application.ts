import express from 'express';
import http from 'http';
import socket from 'socket.io';
import { LocationEvents } from './location-events';

export class Application {
    private readonly _express: express.Express = express();
    private readonly _srv: http.Server = http.createServer(this._express);
    private readonly _io: socket.Server = socket(this._srv);

    constructor() {
        this._express = express();
        this._srv = http.createServer(this._express);
        this._io = socket(this._srv);
    }

    start() {
        return new Promise((resolve, reject) => {
            try {
                return this._express.listen(8080, '0.0.0.0', args => resolve(args));
            } catch (err) {
                reject(err);
            }
        });
    }

    static create() {
        const app = new Application();
        app._io.on('connection', socket => {
            socket.on(LocationEvents.ConnectionEstablished, msg => {
                console.log('connected');
            });
            socket.on(LocationEvents.Disconnect, () => {
                console.log('closed');
            })
        });
        
        return app;
    }
}
