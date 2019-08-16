import express from 'express';
import http from 'http';
import socket from 'socket.io';
import { LocationEvents } from './location-events';
import { AddressInfo } from 'net';

type Point = { x: number; y: number; };
type Locations = { home: Point, current: Point };
type Person = { isHome: boolean } & Locations;
const distanceBetween = (p1: Point) => (p2: Point) => Math
    .sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

const MAX_DISTANCE = 200;

export class Application {
    private readonly _express: express.Express;
    private readonly _srv: http.Server;
    private readonly _io: socket.Server;
    private _hostname = 'localhost';
    private _port = 8080;
    private socks: { [key: string]: Person } = {};
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
        app._io.on(LocationEvents.ConnectionEstablished, socket => {
            console.info('CONNECTED: ' + socket.id);

            socket.emit(LocationEvents.ConnectionEstablished, { message: 'Connection established' });

            socket.on(
                LocationEvents.SetHome,
                ({ message }: { message: Point }) => {
                    if (!app.socks[socket.id]) {
                        app.socks[socket.id] = { current: message, home: message, isHome: true };
                    } else {
                        app.socks[socket.id] = { ...app.socks[socket.id], home: message };
                    }
                }
            );

            socket.on(LocationEvents.Disconnect, () => {
                console.log('closed');
            });

            socket.on(LocationEvents.CheckHome, ({ message }: { message: Point }) => {
                const person = app.socks[socket.id];
                const distance = distanceBetween(person.home)(message);
                const isHome = distance <= MAX_DISTANCE;  // Home if within 200m
                if(person.isHome && !isHome) { // Person just left home
                    socket.emit(LocationEvents.LeftHome, { message: 'Don\'t forget to lock your doors!' });
                }
                person.isHome = isHome;
            });
        });
        return app;
    }
}
