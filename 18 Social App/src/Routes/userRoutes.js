const express = require("express");
const app = express();
const User = require('../Models/userModel')
const Thought = require('../Models/thoughtModel')

//Route for fetching All Users
app.get('/getAllUsers', async (req, res) => {
    try {
        const users = await User.find().populate('thoughts').populate('friends');
        res.status(201).json({
            success: true,
            message: "All users data fetched successfully",
            data: users
        })
    } catch (error) {
        console.log("Error occured", error)
        res.status(500).json({
            success: false,
            message: "There is an error while fetching users",
            error: error.message
        });
    }
});

//Route for fetching single specific user by _id
app.get('/getUserById/:id', async (req, res) => {
    try {
        let user = await User.findById(req.params.id).populate('thoughts').populate('friends');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Cannot find your specific user'
            });
        }
        res.status(201).json({
            success: true,
            message: "Successfully fetched the specified user",
            data: user
        })

    } catch (error) {
        console.log("An error occured", error)
        return res.status(500).json({
            success: false,
            message: "An error occured while fetching specified user",
            error: error.message

        });
    }
});

// Route for posting a new user
app.post('/addUser', async (req, res) => {
    try {
        const { username, email } = req.body;
        const user = new User({
            username,
            email
        });
        const newUser = await user.save();
        res.status(201).json({
            success: true,
            message: "Successfully added the user",
            data: newUser
        });
    } catch (error) {
        console.log("There is an error occured while adding user", error)
        res.status(400).json(
            {
                success: false,
                message: "There is an error occured while adding user",
                error: error.message
            });
    }
});

//Route for updating an existing user
app.put('/updateUserById/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.username = req.body.username;
        user.email = req.body.email;
        const updatedUser = await user.save();
        res.status(201).json({
            success: true,
            message: "Successfully updated the user",
            data: updatedUser
        });
    } catch (error) {
        console.log("An error occured while updating the user", error)
        res.status(400).json({
            success: false,
            message: "An error occured while updating the user",
            error: error.message
        });
    }
});

//Route for deleting user plus deleting that user thoughts
app.delete('/deleteUserById/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        await user.deleteOne();

        // BONUS: Remove user's associated thoughts
        await Thought.deleteMany({ username: user.username });
        res.status(201).json({
            success: true,
            message: 'Successfully deleted the user with his associated thoughts'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occured while deleting the user with his associated thoughts",
            error: error.message
        });
    }
});

//Route to add a new friend to a user's friend list
app.post('/addFriendById/:userId/:friendId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const friend = await User.findById(req.params.friendId);
        if (!friend) {
            return res.status(404).json({
                success: false,
                message: 'Friend not found'
            });
        }

        // Check if the friend is already in the user's friend list
        if (user.friends.includes(req.params.friendId)) {
            return res.status(400).json({
                success: false,
                message: 'Friend already added'
            });
        }
        //Both users added to the friendlist of one another
        user.friends.push(req.params.friendId);
        await user.save();
        friend.friends.push(req.params.userId);
        await friend.save();
        res.status(201).json({
            success: true,
            message: "Successfully added friend to user's friend list",
            data: user
        });
    } catch (error) {
        console.log("An error occured while adding friend to user's list")
        res.status(500).json({
            success: false,
            message: "An error occured while adding friend to user's list",
            error: error.message
        });
    }
});

// Route to remove a friend from a user's friend list
app.delete('/deleteFriendById/:userId/:friendId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if the friend is in the user's friend list
        if (!user.friends.includes(req.params.friendId)) {
            return res.status(400).json({
                success: false,
                message: 'Friend not found in the user\'s friend list'
            });
        }

        user.friends = user.friends.filter(friendId => friendId.toString() !== req.params.friendId);
        await user.save();

        res.status(201).json({
            success: true,
            message: "Successfully removed the user from friend list",
            data: user
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = app