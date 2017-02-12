import express from 'express';
import passport from 'passport';

var router = express.Router();

router.get('/dashboard', (req, res) => {
    res.status(200).json({
        message: "You're authorized!"
    });
});

module.exports = router;