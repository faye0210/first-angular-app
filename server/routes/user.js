const express = require('express')
const router = express.Router()
const User = require('../model/user')
const config = require('../config/dev')
const jwt = require('jsonwebtoken')

router.post('/login', function(req, res) {
    const { email, password } = req.body

    if (!email) {
        return res.status(422).send({errors: [{title: 'User error', detail: 'Please fill email'}]})        
    }
    if (!password) {
        return res.status(422).send({errors: [{title: 'User error', detail: 'Please fill password'}]})        
    }

    User.findOne({email}, function(err, foundUser){
        if (err) {
            return res.status(422).send({errors: [{title: 'User error', detail: 'Something went wrong'}]})        
        }
        if (!foundUser) {
            return res.status(422).send({errors: [{title: 'User error', detail: 'User does not exist'}]})        
        }
        if (!foundUser.hashSamePass(password)) {
            return res.status(422).send({errors: [{title: 'User error', detail: 'Incorrect password'}]})        
        }

        const token = jwt.sign({
            UserId: foundUser.id,
            username: foundUser.username
        }, config.SECRET, { expiresIn: '1h' });

        return res.json(token)
    })
})

router.post('/register', function(req, res) {
    const { username, email, password, confirmPassword } = req.body
    // const username = req.body.username
    // const email = req.body.email
    // const password = req.body.password
    // const confirmPassword = req.body.confirmPassword

    if(!username) {
        return res.status(422).send({errors: [{title: 'User error', detail: 'Please fill username'}]})
    }
    if (!email) {
        return res.status(422).send({errors: [{title: 'User error', detail: 'Please fill email'}]})        
    }
    if (!password) {
        return res.status(422).send({errors: [{title: 'User error', detail: 'Please fill password'}]})        
    }
    if (password !== confirmPassword) {
        return res.status(422).send({errors: [{title: 'User error', detail: 'Please check passwords'}]})        
    }

    User.findOne({email}, function(err, foundUser) {
        if (err) {
            return res.status(422).send({errors: [{title: 'User error', detail: 'Something went wrong'}]})        
        }
        if (foundUser) {
            return res.status(422).send({errors: [{title: 'User error', detail: 'User alredy exist'}]})        
        }

        const user = new User({username, email, password})
        user.save(function(err){
            if (err) {
                return res.status(422).send({errors: [{title: 'User error', detail: 'Something went wrong'}]})        
            }
            return res.json({"registered": true})
        })
    })
})

module.exports = router