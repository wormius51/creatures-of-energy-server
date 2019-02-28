const express = require('express');
const router = express.Router();

const Match = require('./match');
const Player = require('./player');

router.use('/createMatch', (req,res,next) => {
    let player = Player(req.session.id,req.session.nickName || 'Guest');
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
    let player = Player(req.session.id, req.session.nickName);
    if (req.session.colors) {
        player.colors = req.session.colors;
    }
    if (req.session.eyesStyles) {
        player.eyesStyles = req.session.eyesStyles;
    }
    let match = Match.joinAvailable(player);
    if (match) {
        let matchRes = Match.matchRes(match,player.sessionID);
        res.send(matchRes);
    } else {
        let player = Player(req.session.id,req.session.nickName || 'Guest');
        if (req.session.colors) {
            player.colors = req.session.colors;
        }
        if (req.session.eyesStyles) {
            player.eyesStyles = req.session.eyesStyles;
        }
        let match = Match([player]);
        res.send(Match.matchRes(match,player.sessionID));
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
        res.send(Match.matchRes(match,req.session.id));
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
    if (match.finished) {
        Match.remove(req.body.matchID);
        res.send('removed match');
    } else {
        match.finished = true;
        res.send('set match to finish');
    }
});


module.exports = router;
module.exports.Match = Match;
module.exports.Player = Player;