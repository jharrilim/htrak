const sock = require('socket.io-client');
const io = sock('http://0.0.0.0:8080/');

const mockCoordinates = {
    x: 200,
    y: 200
};

io.on('connection', ({ message }) => {
    console.log('Connected.');

    // TODO: Send Geoloaction coordinates
    io.emit('setHome', {
        message: {
            x: 200,
            y: 200
        }
    });

    setInterval(() => {
        console.log(`Current: (${mockCoordinates.x},${mockCoordinates.y})`);
        io.emit('checkHome', { message: mockCoordinates });
        mockCoordinates.x += 20;
        mockCoordinates.y += 20;
    }, 3000);
});

io.on('checkHome', ({ message }) => {
    console.log('Is home? ' + message);
});

io.on('message', console.log);

io.on('leftHome', console.log);
