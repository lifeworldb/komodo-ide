var app = require('express')()
var server = require('http').Server(app)
var io = require('socket.io')(server)
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//app.use(app.static(__dirname+'/node_modules'))
app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/index.html')
})

/*io.on('connection', (socket) => {
    console.log('a user connected')

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})*/

var room = '';
var lobby = io.of('/lobby')
var join = io.of('/join')

lobby.on('connection', (socket) => {
    console.log('Conection on lobby')

    socket.on('disconnect', () => {
        console.log('user disconnected on lobby')
    })
})

join.use((socket, next) => {
    let IdRoom = socket.handshake.query.room
    if (IdRoom) {
        room = socket.handshake.query.room;
        console.log('room: #'+room)
        return next()
    } else {
        console.log('No room')
        return next()
    }
    
})

join.on('connection', (socket) => {
    console.log('Conection join')

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })

    socket.on('room'+room, (data) => {
        join.emit('room'+room, data)
        console.log('Data entry: '+data)
    })
})

server.listen(3080, () => {
    console.log('Listening on *: 3080')
})