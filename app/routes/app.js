import express from 'express';
import passport from 'passport';

var router = express.Router();

router.get('/user/data', (req, res) => {
    res.status(200).json({
        id: req.user._id,
        username: req.user.username
    });
});

module.exports = router;