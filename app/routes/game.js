import express from 'express';
import Games from '../Redis/Games';
import Gameplay from '../Gameplay/Gameplay';

var router = express.Router();

router.post('/game/create', (req, res, next) => {
    let creator = req.user.username;
    let rules = req.body.rules;

    Games.storeGame(creator, rules)
        .then(() => res.status(200).json({success: true}))
        .catch((reason) => res.status(200).json({success: false, reason: reason}));
});

router.post('/game/state', (req, res, next) => {
    Games.getGameState(req.body.creatorUsername)
        .then((state) => res.status(200).json({state: state}))
        .catch((reason) => res.status(200).json({success: false, reason: reason}));
});

router.post('/game/logs', (req, res, next) => {
    Games.getLogs(req.body.creatorUsername)
        .then((logs) => res.status(200).json({logs: logs}))
        .catch((reason) => res.status(200).json({success: false, reason: reason}));
});

router.post('/game/watch', (req, res, next) => {
    Gameplay.getGame(req.body.creatorUsername)
        .then((state) => res.status(200).json({state: state}))
        .catch((reason) => res.status(200).json({success: false, reason: reason}));
});

module.exports = router;