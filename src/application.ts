import express from 'express';
import http from 'http';
import socket from 'socket.io';
import { LocationEvents } from './location-events';
import { AddressInfo } from 'net';

export class Application {
    private readonly _express: express.Express;
    private readonly _srv: http.Server;
    private readonly _io: socket.Server;
    private _hostname = 'localhost';
    private _port = 8080;

    public get hostname() {
        return this._hostname;
    }

    public get port() {
        return this._port;
    }

    constructor() {
        this._express = express();
        this._srv = http.createServer(this._express);
        this._io = socket(this._srv);
    }

    start(port: number, hostname: string): Promise<AddressInfo> {
        this._port = port;
        this._hostname = hostname;
        return new Promise((resolve, reject) => {
            try {
                return this._srv.listen(this._port, this._hostname, () => {
                    this._io.listen(this._srv);
                    resolve(this._srv.address() as AddressInfo);
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    static create() {
        const app = new Application();
        app._io.on('connect', socket => {
            socket.emit(LocationEvents.SetHome, { message: 'Set Home' });
        });
        app._io.on(LocationEvents.ConnectionEstablished, socket => {
            console.info('CONNECTED');

            socket.emit(LocationEvents.SetHome, { message: 'Set Home' });

            socket.on(LocationEvents.Disconnect, () => {
                console.log('closed');
            })
        });

        return app;
    }
}
