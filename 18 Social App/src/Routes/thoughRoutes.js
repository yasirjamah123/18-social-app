const express = require('express');
const app = express();
const Thought = require('../Models/thoughtModel');
const User = require('../Models/userModel');

//Route to get all thoughts
app.get('/getAllThoughts', async (req, res) => {
    try {
        const thoughts = await Thought.find();
        res.status(201).json({
            success: true,
            messsgae: "Successfully fetched all the thoughts",
            data: thoughts
        });
    } catch (error) {
        console.log("An error occured while fetching the thoughts", error)
        res.status(500).json({
            success: false,
            message: "An error occured while fetching the thoughts",
            error: error.message
        });
    }
});


// Route to get a single thought by its _id
app.get('/getThoughtById/:id', async (req, res) => {
    try {
        const thought = await Thought.findById(req.params.id);
        if (!thought) {
            return res.status(404).json({
                success: false,
                message: 'Thought not found'
            });
        }
        const userName = thought.username;
        const user = await User.find({ username: userName }).populate('thoughts').populate('friends');
        res.status(201).json({
            success: true,
            message: "Successfully fetched the specified thought by id",
            data: thought,
            associatedUser: user
        });
    } catch (error) {
        console.log("An error occured while fetching a specified thought", error)
        res.status(500).json({
            success: false,
            message: "An error occured while fetching a specified thought",
            error: error.message
        });
    }
});

// Route to create a new thought
app.post('/addThought', async (req, res) => {
    try {
        const { thoughtText, username, userId } = req.body;

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const thought = new Thought({
            thoughtText,
            username,
            userId
        });
        const newThought = await thought.save();

        // Pushed the created thought's _id to the associated user's thoughts array field
        user.thoughts.push(newThought._id);
        await user.save();

        res.status(201).json({
            success: true,
            message: "Successfully added the thought",
            data: newThought

        }
        );
    } catch (error) {
        console.log("An error occured while adding thought", error)
        res.status(400).json({
            success: false,
            message: "An error occured while adding thought",
            error: error.message
        });
    }
});

// Route to update a thought by its _id
app.put('/updateThoughtById/:id', async (req, res) => {
    try {
        const { thoughtText } = req.body;
        const thought = await Thought.findById(req.params.id);
        if (!thought) {
            return res.status(404).json({
                success: false,
                message: 'Thought not found'
            });
        }
        thought.thoughtText = thoughtText;
        const updatedThought = await thought.save();
        res.status(201).json({
            success: true,
            messsage: "Successfully updated the thought",
            data: updatedThought
        }
        );
    } catch (error) {
        console.log("An error occured while updating the thought", error)
        res.status(400).json({
            success: false,
            message: "An error occured while updating the thought",
            error: error.message
        });
    }
});

// Route to remove a thought by its _id
app.delete('/deleteThoughtById/:id', async (req, res) => {
    try {
        const thought = await Thought.findById(req.params.id);
        if (!thought) {
            return res.status(404).json({
                success: false,
                message: 'Thought not found'
            });
        }
        // Find the associated user and update their thoughts
        const user = await User.findOne({ username: thought.username });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Associated user not found'
            });
        }
        // Remove thought's _id from associated user's thoughts array field
        if (user.thoughts) {
            user.thoughts = user.thoughts.filter(thoughtId => thoughtId.toString() !== req.params.id);
        }
        await user.save();
        await thought.deleteOne();
        res.status(200).json({
            success: true,
            message: 'Successfully deleted the thought'
        });
    } catch (error) {
        console.log("An error occurred while deleting the thought", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the thought",
            error: error.message
        });
    }
});


// Route to create a reaction stored in a single thought's reactions array field
app.post('/addReaction/:thoughtId', async (req, res) => {
    try {
        const thought = await Thought.findById(req.params.thoughtId);
        if (!thought) {
            return res.status(404).json({
                success: false,
                message: 'Thought not found'
            });
        }

        // Extracting reaction data from request body
        const { reactionBody, username } = req.body;
        const newReaction = { reactionBody, username };

        thought.reactions.push(newReaction);
        await thought.save();

        res.status(201).json({
            success: true,
            message: "Successfully added reaction to the thought",
            data: thought
        });
    } catch (error) {
        console.log("An error occured while adding reaction to the thought", error)
        res.status(500).json({
            success: false,
            message: "An error occured while adding reaction to the thought",
            error: error.message
        });
    }
});

// Route to pull and remove a reaction by the reaction's reactionId value
app.delete('/deleteReaction/:thoughtId/:reactionId', async (req, res) => {
    try {
        const thought = await Thought.findById(req.params.thoughtId);
        if (!thought) {
            return res.status(404).json({
                success: false,
                message: 'Thought not found'
            });
        }

        // Find index of the reaction with the given reactionId
        const reactionIndex = thought.reactions.findIndex(reaction => reaction._id.toString() === req.params.reactionId);
        if (reactionIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Reaction not found'
            });
        }

        thought.reactions.splice(reactionIndex, 1);
        await thought.save();

        res.status(201).json({
            success: true,
            message: "Successfully removed the reaction from thought",
            data: thought
        });
    } catch (error) {
        console.log("An error occured while removing reaction from thought", error)
        res.status(500).json({
            success: false,
            message: "An error occured while removing reaction from thought",
            error: error.message
        });
    }
});

module.exports = app;
