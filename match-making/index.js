const express = require('express');
const router = express.Router();

const Match = require('./match');
const Player = require('./player');

router.use('/createMatch', (req,res,next) => {
    let player = Player.getPlayerByID(req.body.sessionID);
    if (!player) {
        player = Player(req.session.id,req.session.nickName || 'Guest',
        req.body.colors, req.body.eyesStyles);
    }
    if (req.session.colors) {
        player.colors = req.session.colors;
    }
    if (req.session.eyesStyles) {
        player.eyesStyles = req.session.eyesStyles;
    }
    let match = Match([player]);
    
    res.send(Match.matchRes(match,player.sessionID));
});

router.use('/seekMatch', (req,res,next) => {
    let player = Player.getPlayerByID(req.body.sessionID);
    if (!player) {
        player = Player(req.session.id, req.session.nickName || 'Guest');
    }
    if (req.session.colors) {
        player.colors = req.session.colors;
    } else {
        player.colors = [0.6,0];
    }
    if (req.session.eyesStyles) {
        player.eyesStyles = req.session.eyesStyles;
    } else {
        player.eyesStyles = [1,1];
    }
    if (req.body.strikable) {
        player.strikable = true;
    }
    if (req.body.colors) {
        player.colors = req.body.colors;
    }
    if (req.body.eyesStyles) {
        player.eyesStyles = req.body.eyesStyles;
    }
    if (req.body.maxHalfSize) {
        player.maxHalfSize = Number.parseInt(req.body.maxHalfSize);
    } else {
        player.maxHalfSize = 7;
    }
    if (req.body.minHalfSize) {
        player.minHalfSize = Number.parseInt(req.body.minHalfSize);
    } else {
        player.minHalfSize = 7;
    }
    let match = Match.joinAvailable(player);
    if (match) {
        let matchRes = Match.matchRes(match,player.sessionID);
        res.send(matchRes);
    } else {
        let match = Match([player]);
        res.send(Match.matchRes(match,player.sessionID));
    }
});


router.use('/stopSeek', (req, res, next) => {
    if (!req.body.matchID) {
        res.send({error : 'parameter \'matchID\' is missing'});
        return;
    }
    let match = Match.getMatchByID(req.body.matchID);
    if (match.players.length < 2) {
        Match.remove(match.id);
        res.send('match removed');
    } else {
        res.send('match is ongoing');
    }
});

router.use('/playMove', (req, res, next) => {
    if (!req.body.matchID) {
        res.send({error : 'parameter \'matchID\' is missing'});
        return;
    }
    if (!req.body.move) {
        res.send({error : 'parameter \'move\' is missing'});
        return;
    }
    let match = Match.getMatchByID(req.body.matchID);
    match.moves.push(req.body.move);
    res.send('played move: ' + req.body.move);
});

router.use('/getMatch', (req, res, next) => {
    if (!req.body.matchID) {
        res.send({error : 'parameter \'matchID\' is missing'});
        return;
    }
    let match = Match.getMatchByID(req.body.matchID);
    if (match) {
        res.send(Match.matchRes(match,req.body.sessionID? req.body.sessionID : req.session.id));
    } else {
        res.send({error : 'no match'});
    }
});


router.use('/finishMatch', (req, res, next) => {
    if (!req.body.matchID) {
        res.send({error : 'parameter \'matchID\' is missing'});
        return;
    }
    let match = Match.getMatchByID(req.body.matchID);
    if (!match) {
        res.send('match is over');
        return;
    }
    if (match.finished) {
        Match.remove(req.body.matchID);
        res.send('removed match');
    } else {
        match.finished = true;
        res.send('set match to finish');
    }
});

router.use('/pingMatch' ,(req,res,next) => {
    if (!req.body.matchID) {
        res.send({error : 'parameter \'matchID\' is missing'});
        return;
    }
    let match = Match.getMatchByID(req.body.matchID);
    Match.myPlayerIndex(match,req.body.sessionID ? req.body.sessionID : req.session.id);
    res.send('ping');
});


module.exports = router;
module.exports.Match = Match;
module.exports.Player = Player;