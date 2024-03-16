//start api.controller.js code
//use mongodb library to connect to the database

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const database  = require('../utils/database').getDb();
const SECRET_KEY = 'secret'; 
const { ObjectId } = require('mongodb');

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await database.collection('users').findOne({ email });
        if (!user) {
            res.json({status:'failed', message: 'User not found' });
        }
        else if (user && bcrypt.compareSync(password, user.password)) {
            //generate token
            const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
            user.token = token;
            res.json({status:'success', message: 'Login successful', user});
        }
        else {
            res.json({status:'failed', message: 'Incorrect credentials' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({status:'failed', message: 'Server error' });
    }
})
router.post('/verifyToken', async (req, res) => {
    try {
        const { token, userId } = req.body;
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                res.json({ status: 'failed', message: 'Invalid token' });
            } else if (decoded.userId !== userId) {
                res.json({ status: 'failed', message: 'Invalid token' });
            } else {
                res.json({ status: 'success', message: 'Valid token' });
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'failed', message: 'Server error' });
    }
});

router.post('/signup', async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        const user = await database.collection('users').findOne({ email });
        if (user) {
            res.status(409).json({status:'failed', message: 'User already exists' });
        }
        else {
            const hashedPassword = bcrypt.hashSync(password, 10);
            const newUser = await database.collection('users').insertOne({ email, password: hashedPassword, firstName, lastName}, {returnOriginal: false});
            if (!newUser.insertedId) {
                res.status(500).json({ status:'failed', message: 'User not created' });
            }else{
                let user = await database.collection('users').findOne({ email },{projection:{password:0}});
                res.json({status:'success', message: 'User created', user });
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({status:'failed', message: 'Server error' });
    }
})

router.post('/getUserByUserId', async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await database.collection('users').findOne({ _id: new ObjectId(userId.toString())},{projection:{password:0}});
        if (!user) {
            res.status(404).json({status:'failed', message: 'User not found' });
        }
        else {
            res.json({status:'success', message: 'User found', user });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({status:'failed', message: 'Server error' });
    }
})

router.post('/updateUser', async (req, res) => {
    try {
        const { userId, firstName, lastName } = req.body;
        const user = await database.collection('users').findOneAndUpdate({ _id: userId }, { $set: { firstName, lastName } }, { returnOriginal: true });
        if (!user.value) {
            res.status(404).json({status:'failed', message: 'User not found' });
        }
        else {
            res.json({status:'success', message: 'User updated', user: user.value });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({status:'failed', message: 'Server error' });
    }
})

router.post('/getUsers', async (req, res) => {
    try {
        const users = await database.collection('users').find({}).toArray();
        res.json({status:'success', message: 'Users found', users });
    } catch (err) {
        console.error(err);
        res.status(500).json({status:'failed', message: 'Server error' });
    }
})

module.exports = router;
