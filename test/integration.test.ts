import { Application } from '../src/application';
import ioClient from 'socket.io-client';
import { LocationEvents } from '../src/location-events';

describe('Integration', () => {
    const PORT = '8080';
    const HOSTNAME = '::1';

    describe('Events', () => {
        test('A message is emitted on connection', async () => {
            const app = Application.create();
            
            const { address, port } = await app.start(+PORT, '127.0.0.1');
            console.debug(`App started successfully on: ${address}:${port}`);
            const sock = ioClient({ port: PORT, autoConnect: true, hostname: HOSTNAME });
            
            sock.on(LocationEvents.SetHome, ({ message }: { message: string }) => {
                expect(message).toBeUndefined();
            });
            console.debug('Socket Connected? ' + sock.connected);
            

        });
    });
});
