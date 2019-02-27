const express = require('express');
const router = express.Router();

const Match = require('./match');
const Player = require('./player');

router.use('/createMatch', (req,res,next) => {
    console.log('create');
    let player = Player(req.session.id,req.session.nickName || 'Guest');
    let match = Match([player]);
    res.send('create');
    
    res.send(Match.matchRes(match,player.sessionID));
});

router.use('/seekMatch', (req,res,next) => {
    let player = Player(req.session.id, req.session.nickName);
    let match = Match.joinAvailable(player);
    if (match) {
        let matchRes = Match.matchRes(match,player.sessionID);
        res.send(matchRes);
    } else {
        let player = Player(req.session.id,req.session.nickName || 'Guest');
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


module.exports = router;
module.exports.Match = Match;
module.exports.Player = Player;