var players = [];

function Player(sessionID, nickName, colors, eyesStyles) {
    let player = getPlayerByID(sessionID);
    if (player)
        return player;
    player = {
        sessionID : sessionID,
        nickName : nickName,
        colors : colors,
        eyesStyles : eyesStyles
    };
    players.push(player);
    return player;
}

function getPlayerByID(ID) {
    return players.find((value) => {
        return value.sessionID == ID;
    });
}

module.exports = Player;
module.exports.getPlayerByID = getPlayerByID;