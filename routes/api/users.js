const express = require('express');
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const congif = require('config')
const User = require('../../models/Users');

const router = express.Router();

// @route Register user
router.post('/',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Email is required').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                data: errors.array()
            });
        }
        const { name, email, password } = req.body;

        try {

            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({
                    data: {
                        message: 'User already exists'
                    }
                });
            }

            const avatar = gravatar.url(email, {
                //size
                s: '200',
                // proper
                r: 'pg',
                d: 'mm'
            });
            user = new User({
                email,
                password,
                avatar,
                name
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            let payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(payload,
                congif.get('jwtSecret'),
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    console.log('User Registered');
                    return res.json({ data: { token: token, msg: 'User registered' } });
                }
            );

            // return res.status(200).send('Saved');
        } catch (err) {
            console.error(err.message);
            return res.send('Server Error');
        }

    });


module.exports = router;