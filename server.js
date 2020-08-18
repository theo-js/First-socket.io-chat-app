const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html')
	console.log(req.ip)
})

io.on('connection', socket => {
	console.log('A user is connected')
	io.sockets.emit('log', 'Un nouvel utilisateur a rejoint le tchat')
	io.sockets.emit('clientsCount', io.engine.clientsCount)
	console.log('Connected: ' + io.engine.clientsCount)

	socket.on('disconnect', () => {
		console.log('A user is disconnected')
		io.sockets.emit('log', 'Un utilisateur a quitté le tchat')
		io.sockets.emit('clientsCount', io.engine.clientsCount)
		console.log('Connected: ' + io.engine.clientsCount)
	})

	socket.on('chat message', msg => io.sockets.emit('chat message', msg))
	socket.on('color change', (username, color) => io.sockets.emit('log', `${username} a changé sa couleur en ${require('./functions/translateColName')['fr'](color)}`))
	socket.on('name change', (previous, present) => io.sockets.emit('log', `${previous} a changé son nom pour ${present}`))
})

const port = 8080
http.listen(port, () => console.log('Server listening at port ' + port))