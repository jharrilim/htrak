import socket from 'socket.io';

export abstract class LocationSocket {
    constructor(private _sock: socket.Server) {
    }

    abstract onConnectionHandler(): socket.Namespace;
}
