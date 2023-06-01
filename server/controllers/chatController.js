const { verifyToken } = require('./tokenController');

const Chat = require('../models/chatModel');
const User = require('../models/userModel');

async function getNextChatId() {
    try {
        const allChats = await Chat.find();
        let max = -1;
        allChats.forEach(chat => {
            if (parseInt(chat.id, 10) > max)
                max = parseInt(chat.id, 10);
        });
        return (max + 1).toString();
    } catch (error) {
        console.error("Error retrieving next chat ID:", error);
        return -1;
    }
}



function getNextMessageId(messages) {
    if (messages.length === 0) {
        return 0;
    }
    return parseInt(messages[messages.length - 1].id, 10) + 1;
}

async function createMessage(req, res) {
    const { id } = req.params;
    const senderUsername = verifyToken(req)
    if (senderUsername === null) {
        return res.status(401).send('unauthorized')
    }
    const { msg } = req.body;
    console.log(msg)
    const chat = await Chat.findOne({ id: id })
    if (!chat) {
        return res.status(404).json({ error: 'Chat not found' });
    }
    var messages = chat.messages
    const messageId = getNextMessageId(messages)
    const currentTime = new Date().toISOString();
    console.log(currentTime);
    const sender = await User.findOne({ username: senderUsername.username });
    if (!sender) {
        return res.status(404).json({ error: 'sender not found' });
    }
    if (!(sender.username === chat.users[0].username || sender.username === chat.users[1].username)) {
        return res.status(404).json({ error: 'sender not in the chat' });
    }
    const jsonSender = { username: sender.username, displayName: sender.displayName, profilePic: sender.profilePic }
    const newMessageJSON = { id: messageId, created: currentTime, sender: jsonSender, content: msg }
    messages.push(newMessageJSON)
    await Chat.updateOne({ id: id }, { $set: { messages: messages } })
    const updatedChat = await Chat.findOne({ id: id })
    return res.status(200).json(updatedChat.messages[messageId]);
}

async function createChat(req, res) {
    try {
        const { username } = req.body;
        const userOfTheToken = verifyToken(req)
        if (userOfTheToken === null) {
            return res.status(401).send('unauthorized')
        }
        if (userOfTheToken.username === username) {
            return res.status(400).send('bad request')
        }
        const user1 = await User.findOne({ username: userOfTheToken.username });
        if (!user1) {
            return res.status(404).json({ error: 'User not found' });
        }
        const jsonUser1 = { username: user1.username, displayName: user1.displayName, profilePic: user1.profilePic }
        const user2 = await User.findOne({ username: username });
        if (!user2) {
            return res.status(404).json({ error: 'User not found' });
        }
        const jsonUser2 = { username: user2.username, displayName: user2.displayName, profilePic: user2.profilePic }
        const id = await getNextChatId()
        if (id === -1) {
            return res.status(500).json({ error: 'Failed to get last id' });
        }
        var users = []
        users.push(jsonUser1)
        users.push(jsonUser2)
        var messages = []
        const newChat = await Chat.create({ id, users, messages });
        return res.status(200).json(newChat);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create chat' });
    }
}

async function getAllMessages(req, res) {
    const { id } = req.params;
    console.log(id)
    const sender = verifyToken(req)
    console.log("username:: " + sender.username)
    if (sender === null) {
        return res.status(401).send('unauthorized')
    }
    const chat = await Chat.findOne({ id: id })
    if (!chat) {
        return res.status(404).json({ error: 'Chat not found' });
    }
    if (!(sender.username === chat.users[0].username || sender.username === chat.users[1].username)) {
        return res.status(404).json({ error: 'client not in the chat' });
    }
    return res.status(200).json(chat.messages);
}

async function getAllChats(req, res) {
    const sender = verifyToken(req)
    if (sender === null) {
        return res.status(401).send('unauthorized')
    }
    const allChats = await Chat.find()
    let userChats = []
    allChats.forEach(chat => {
        if (sender.username === chat.users[0].username) {
            var jsonLastMessage = null
            if(!(chat.messages.length === 0)){
                const lastMessage = chat.messages[chat.messages.length - 1]
                jsonLastMessage = { id: lastMessage.id, created: lastMessage.created, content: lastMessage.content }
            }
            userChats.push({ id: chat.id, user: chat.users[1], lastMessage: jsonLastMessage })
        }
        if (sender.username === chat.users[1].username) {
            var jsonLastMessage = null
            if(!(chat.messages.length === 0)){
                const lastMessage = chat.messages[chat.messages.length - 1]
                jsonLastMessage = { id: lastMessage.id, created: lastMessage.created, content: lastMessage.content }
            }
            userChats.push({ id: chat.id, user: chat.users[0], lastMessage: jsonLastMessage })
        }
    });
    console.log(userChats)
    return res.status(200).json(userChats)
}

async function getChatById(req, res) {
    const { id } = req.params;
    const sender = verifyToken(req)
    if (sender === null) {
        return res.status(401).send('unauthorized')
    }
    const chat = await Chat.findOne({ id: id })
    if (!chat) {
        return res.status(404).json({ error: 'Chat not found' });
    }
    if (!(sender.username === chat.users[0].username || sender.username === chat.users[1].username)) {
        return res.status(404).json({ error: 'client not in the chat' });
    }
    return res.status(200).json(chat)
}

async function deleteChatById(req, res) {
    const { id } = req.params;
    const sender = verifyToken(req)
    if (sender === null) {
        return res.status(401).send('unauthorized')
    }
    const chat = await Chat.findOne({ id: id })
    if (!chat) {
        return res.status(404).json({ error: 'Chat not found' });
    }
    if (!(sender.username === chat.users[0].username || sender.username === chat.users[1].username)) {
        return res.status(404).json({ error: 'client not in the chat' });
    }
    const result = await Chat.deleteOne({ id: id })
    return res.status(200).json(result)
}

module.exports = {
    createChat,
    createMessage,
    getAllMessages,
    getAllChats,
    getChatById,
    deleteChatById
};
