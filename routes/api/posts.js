const express = require('express');


const router = express.Router();

// @route
router.get('/', (req, res) => res.send('Post Route'));


module.exports = router;