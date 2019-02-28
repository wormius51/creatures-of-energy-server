const uuidv1 = require('uuid/v1');

var matches = [];

function Match(players) {
    let id = uuidv1();
    let match = {
        id : id,
        players : players,
        moves : []
    };
    matches.push(match);
    return match;
}

function remove(matchID) {
    let i = matches.findIndex((value) => {
        return value.id == matchID;
    });
    matches.splice(i,1);
}

function getMatchByID(matchID) {
    return matches.find((value) => {
        return value.id == matchID;
    });
}

function joinAvailable(player) {
    let match = matches.find((value) => {
        return value.players.length < 2;
    });
    if (match) {
        match.players.push(player);
    }
    return match;
}

function myPlayerIndex(match ,sessionID) {
    return match.players.findIndex((value) => {
        return value.sessionID == sessionID;
    });
}

function matchRes(match, sessionID) {
    let names = [];
    let colors = [];
    let eyesStyles = [];
    let i = 0;
    match.players.forEach(element => {
        names.push(element.nickName);
        if (element.colors) {
            colors.push(element.colors[i]);
        }
        if (element.eyesStyles) {
            eyesStyles.push(element.eyesStyles[i]);
        }
        i++;
    });
    return {
        matchID : match.id,
        myIndex : myPlayerIndex(match,sessionID),
        names : names,
        colors : colors,
        eyesStyles : eyesStyles,
        moves : match.moves
    };
}


module.exports = Match;
module.exports.remove = remove;
module.exports.getMatchByID = getMatchByID;
module.exports.joinAvailable = joinAvailable;
module.exports.myPlayerIndex = myPlayerIndex;
module.exports.matchRes = matchRes;