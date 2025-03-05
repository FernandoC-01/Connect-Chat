const router = require("express").Router();
const path = require('path');
const { save, read } = require('../helper/fs');
const messagePath = path.join(__dirname, '../api/blog.json');

//get all messages in a room
router.get("/api/rooms/:roomId/messages", async (req, res) => {
	try {
        const messages = read(messagePath);
        res.json(messages);
    } catch(err) {
        res.status(500).json({
            error: `${err}`
        })
    }
});

//create a new message
router.post('/api/rooms/:roomId/messages', async (req, res) => {
	try {
		const { when, user, room, body } = req.body;
        if (!when || !user || !room ||!body) return res.status(422).send('Missing data');

        const messages = read(messagePath);
        const newMessage = {
        message_id: messages.length ? messages[messages.length - 1].message_id + 1 : 1,
        when,
        user,
        room,
        body
    };

    messages.push(newMessage);
    save(messages, messagePath);
    res.status(201).json(newMessage);

	} catch (err) {
        res.status(500).json({
            error: `${err}`
        })
    }
});

//update a message
router.put('/api/rooms/:roomId/messages/:messageId', async (req, res) => {
    try {
        const { id } = req.params; // Use req.params to get the ID
        const { when, user, room, body } = req.body;

        const messages = read(messagePath);
        const postIndex = messages.findIndex(p => p.post_id === parseInt(id));

        if (postIndex === -1) return res.status(404).send('Post not found');

        // Update the specific message with new data
        const updatedPost = { ...messages[postIndex], title, author, body };
        messages[postIndex] = updatedPost;

        // Save the updated messages array back to the file
        save(messages, messagePath);
        
        res.json(updatedPost);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: `${err}`
        });
    }
});

// delete a message
router.delete('/api/rooms/:roomId/messages/:messageId', async (req, res) => {
    try{
    const { id } = req.params;

    const messages = read(messagePath);
    const filteredMessages = messages.filter(p => p.post_id !== parseInt(id));

    if (messages.length === filteredMessages.length) return res.status(404).send('Post not found');

    save(filteredMessages, messagePath);

    res.status(200).json({
        message: `You successfully deleted post ${id}!`
    });
    }catch (err){
        console.log(err);
		res.status(500).json({
			error: `${err}`,
		});
    }
});

module.exports = router;