import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Allow connections from any origin
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Store connected users with their descriptions
const users = {};
// Store chat rooms
const chatRooms = new Map();

// Helper function to get or create private chat
function getOrCreatePrivateChat(user1Id, user2Id) {
    // Sort IDs to ensure consistent room ID
    const participants = [user1Id, user2Id].sort();
    const roomId = `private_${participants.join('_')}`;

    if (!chatRooms.has(roomId)) {
        chatRooms.set(roomId, {
            id: roomId,
            name: `Private Chat`,
            participants,
            isGroup: false,
            messages: []
        });
    }

    return chatRooms.get(roomId);
}

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle user joining
    socket.on('join', (username) => {
        users[socket.id] = { username, description: '' };

        // Broadcast to all clients that a new user has joined
        io.emit('userJoined', { id: socket.id, ...users[socket.id] });

        // Send the current users list to the newly joined user
        socket.emit('usersList', Object.entries(users).map(([id, user]) => ({
            id,
            ...user
        })));

        // Send available chat rooms to the user
        const userRooms = Array.from(chatRooms.values())
            .filter(room => room.participants.includes(socket.id));
        socket.emit('chatRooms', userRooms);

        console.log(`${username} joined the chat`);
    });

    // Handle starting a private chat
    socket.on('startPrivateChat', (otherUserId) => {
        if (!users[otherUserId]) return;

        const room = getOrCreatePrivateChat(socket.id, otherUserId);

        // Notify both users about the chat
        room.participants.forEach(participantId => {
            const otherUser = users[participantId === socket.id ? otherUserId : socket.id];
            io.to(participantId).emit('roomCreated', {
                ...room,
                name: `Chat with ${otherUser.username}`
            });
        });
    });

    // Handle creating a group chat
    socket.on('createRoom', ({ name, participants }) => {
        const roomId = `group_${Date.now()}`;
        const room = {
            id: roomId,
            name,
            participants,
            isGroup: true,
            messages: []
        };

        chatRooms.set(roomId, room);

        // Notify all participants about the new room
        participants.forEach(participantId => {
            io.to(participantId).emit('roomCreated', room);
        });
    });

    // Handle chat messages
    socket.on('message', ({ roomId, text }) => {
        const room = chatRooms.get(roomId);
        if (room && room.participants.includes(socket.id)) {
            const message = {
                id: Date.now().toString(),
                user: users[socket.id].username,
                userId: socket.id,
                text,
                timestamp: new Date().toISOString()
            };

            room.messages.push(message);

            // Send message to all participants in the room
            room.participants.forEach(participantId => {
                io.to(participantId).emit('message', { roomId, message });
            });
        }
    });

    // Handle typing indicator
    socket.on('typing', ({ roomId, isTyping }) => {
        const room = chatRooms.get(roomId);
        if (room && room.participants.includes(socket.id)) {
            room.participants.forEach(participantId => {
                if (participantId !== socket.id) {
                    io.to(participantId).emit('userTyping', {
                        userId: socket.id,
                        username: users[socket.id].username,
                        isTyping,
                        roomId
                    });
                }
            });
        }
    });

    // Handle user updates
    socket.on('updateUser', (data) => {
        if (users[socket.id]) {
            users[socket.id] = {
                username: data.username,
                description: data.description
            };

            // Broadcast the updated user info
            io.emit('userUpdated', {
                id: socket.id,
                ...users[socket.id]
            });
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        const username = users[socket.id]?.username;
        if (username) {
            console.log(`${username} disconnected`);

            // Notify all clients that a user has left
            io.emit('userLeft', { id: socket.id, username });

            // Remove user from users object
            delete users[socket.id];
        }
    });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Local access: http://localhost:${PORT}`);
    console.log(`Network access: http://[YOUR_IP]:${PORT}`);
});