const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let messages = [{
    username: 'zee computer',
    message: 'hey welcome to the zone',
    date: Date.now()
}]

wss.on('connection', function connection(ws) {

    console.log(`new user connected ⚡️`)

    ws.on('message', message => {
        const parsedMessage = JSON.parse(message)

        console.log('get a new message')
        console.log(parsedMessage)
        
        parsedMessage.date = Date.now()

        messages = [parsedMessage, ...messages]

        wss.clients.forEach(client => {
            // if (client !== ws && client.readyState === WebSocket.OPEN) {
            // client.send(data);
            // }
            client.send(JSON.stringify(messages))
        });
    });

    ws.on('close', function close() {
        console.log(`user disconnected ☹️`);
    });

    ws.send(JSON.stringify(messages))
});

console.log(`we're listening on port: 8080 ⚡️`)