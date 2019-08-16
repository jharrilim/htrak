import { Application } from '../src/application';
import ioClient from 'socket.io-client';
import { LocationEvents } from '../src/location-events';

describe('Integration', () => {
    const PORT = '8080';
    const HOSTNAME = '0.0.0.0';

    describe('Events', () => {
        test('A message is emitted on connection', async (done) => {
            const app = Application.create();
            
            const { address, port } = await app.start(+PORT, HOSTNAME);
            console.debug(`App started successfully on: ${address}:${port}`);
            const sock = ioClient(`http://${HOSTNAME}:${PORT}`);
            
            sock.on(LocationEvents.ConnectionEstablished, ({ message }: { message: string }) => {
                expect(message).toBeDefined();
                expect(typeof message).toBe('string');
                done();
            });
        });
    });
});
