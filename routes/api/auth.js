const express = require('express');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const congif = require('config');
const bcrypt = require('bcrypt');

const User = require('../../models/Users');
const auth = require('../../middleware/auth');


const router = express.Router();

// @route get user auth 
router.get('/', auth, async (req, res) => {
    try {
        let user = await User.findById(req.user.id).select('-password');
        console.log('User  foud for access token ', req.user.id);
        console.log('User ', user);
        return res.status(200).json({
            body: {
                user
            }
        });
    } catch (err) {
        console.log('Error Auth api ', err.message);
        return res.status(500).send('Server Error');
    }
});


// @route Register user
router.post('/',
    [
        check('email', 'Email is required').isEmail(),
        check('password', ' password is required').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                data: errors.array()
            });
        }
        const { email, password } = req.body;

        try {

            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({
                    data: {
                        message: 'Invalid id pass'
                    }
                });
            }

            let isMatchPass = await bcrypt.compare(password, user.password);
            if (!isMatchPass) {
                return res.status(400).json({
                    data: {
                        message: 'Invalid pass'
                    }
                });
            }

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