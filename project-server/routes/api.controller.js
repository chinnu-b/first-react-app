//start api.controller.js code
//use mongodb library to connect to the database

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const database  = require('../utils/database').getDb();
const SECRET_KEY = 'secret'; 
const { ObjectId } = require('mongodb');
const multer  = require('multer')
//upload file using multer and retain original name
const upload = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
        }
    ,
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const uploadFile = multer({ storage: upload }).single('file');



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
                //check if user is admin
                // const user = database.collection('users').findOne({ _id: new ObjectId(userId.toString()) });
                // if (!user) {
                    // res.status(404).json({ status: 'failed', message: 'User not found' });
                // }
                // else {
                    res.json({ status: 'success', message: 'Valid token' });
                // }
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
            const newUser = await database.collection('users').insertOne({ email, password: hashedPassword, firstName, lastName, status:'Pending'}, {returnOriginal: false});
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
router.post('/getPayments', async (req, res) => {
    try {
        const { userId } = req.body;
        const payments = await database.collection('payments').find({parties:{$in:[new ObjectId(userId)]}}).toArray();
        res.json({status:'success', message: 'Payments found', payments });
    } catch (err) {
        console.error(err);
        res.status(500).json({status:'failed', message: 'Server error' });
    }
})

router.post('/makePayment', async (req, res) => {
    try {
        const { userId, amount, account, userName } = req.body;
        const admin = await database.collection('users').findOne({ isAdmin: true });
        if (!admin || !userId) {
            res.status(404).json({status:'failed', message: 'User not found' });
        }
        const payment = await database.collection('payments').insertOne({ parties: [new ObjectId(userId), admin._id], amount, account, date: new Date(), from:userName, to:admin.firstName });
       
        if (!payment.insertedId) {
            res.status(500).json({status:'failed', message: 'Payment not created' });
        }
        else {
            res.json({status:'success', message: 'Payment created', payment: payment });
            const user = await database.collection('users').findOneAndUpdate({ _id: new ObjectId(userId.toString()) }, { $set: { paymentRequested: false, waitingForPortfolio: true } }, { returnOriginal: true });
        }
        
    } catch (err) {
        console.error(err);
        res.status(500).json({status:'failed', message: 'Server error' });
    }
})
//uploadFile
router.post('/uploadFile', uploadFile, async (req, res) => {
    try {
        const fileDetails = req.file;
        res.json({status:'success', message: 'File uploaded', fileDetails });
    } catch (err) {
        console.error(err);
        res.status(500).json({status:'failed', message: 'Server error' });
    }
})

//editUser
router.post('/editUser', async (req, res) => {
    try {
        const { userId, firstName, lastName, skills, works, quotes, hobbies, achievements, photo } = req.body;
        console.log(userId, firstName, lastName, skills, works, quotes, hobbies, achievements, photo);
        const user = await database.collection('users').findOneAndUpdate({ _id: new ObjectId(userId.toString()) }, { $set: { firstName, lastName, skills, works, quotes, hobbies, achievements, photo, status:'Completed', waitingForPortfolio:false } }, { returnOriginal: true });
        if (!user) {
            res.status(404).json({status:'failed', message: 'User not found' });
        }
        else {
            res.json({status:'success', message: 'User updated', user: user });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({status:'failed', message: 'Server error' });
    }
})
//deleteUser
router.post('/deleteUser', async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await database.collection('users').findOneAndDelete({ _id: new ObjectId(userId.toString()) });
        if (!user) {
            res.status(404).json({status:'failed', message: 'User not found' });
        }
        else {
            res.json({status:'success', message: 'User deleted', user: user.value });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({status:'failed', message: 'Server error' });
    }
})
//send feedback
router.post('/sendFeedback', async (req, res) => {
    try {
        const { userId, feedback } = req.body;
        const user = await database.collection('users').findOne({ _id: new ObjectId(userId) });
        if (!user) {
            res.status(404).json({status:'failed', message: 'User not found' });
        }
        const sentFeedback = await database.collection('feedbacks').insertOne({ user: new ObjectId(userId), feedback, date: new Date(), userName: user.firstName });
        if (!sentFeedback.insertedId) {
            res.status(500).json({status:'failed', message: 'Feedback not sent' });
        }
        else {
            res.json({status:'success', message: 'Feedback sent', feedback: sentFeedback });
        }       
    } catch (err) {
        console.error(err);
        res.status(500).json({status:'failed', message: 'Server error' });
    }
})

//getFeedbacks
router.post('/getFeedbacks', async (req, res) => {
    try {
        const { userId } = req.body;
        const feedbacks = await database.collection('feedbacks').find({ }).toArray();
        res.json({status:'success', message: 'Feedbacks found', feedbacks });
    } catch (err) {
        console.error(err);
        res.status(500).json({status:'failed', message: 'Server error' });
    }
})
//requestPayment
router.post('/requestPayment', async (req, res) => {
    try {
        const { userId } = req.body;
        // add a paymentRequested flag to the user
        const user = await database.collection('users').findOneAndUpdate({ _id: new ObjectId(userId.toString()) }, { $set: { paymentRequested: true, requestSentToAdmin: false } }, { returnOriginal: true });
        if (!user) {
            res.status(404).json({status:'failed', message: 'User not found' });
        }
        else {
            res.json({status:'success', message: 'Payment requested', user: user.value });
        }  
    } catch (err) {
        console.error(err);
        res.status(500).json({status:'failed', message: 'Server error' });
    }
})

//sendRequestToAdmin
router.post('/sendRequestToAdmin', async (req, res) => {
    try {
        const { userId } = req.body;
        // add a requestSentToAdmin flag to the user
        const user = await database.collection('users').findOneAndUpdate({ _id: new ObjectId(userId.toString()) }, { $set: { requestSentToAdmin: true, } }, { returnOriginal: true });
        if (!user) {
            res.status(404).json({status:'failed', message: 'User not found' });
        }
        else {
            res.json({status:'success', message: 'Request sent to admin', user: user.value });
        }  
    } catch (err) {
        console.error(err);
        res.status(500).json({status:'failed', message: 'Server error' });
    }
})






module.exports = router