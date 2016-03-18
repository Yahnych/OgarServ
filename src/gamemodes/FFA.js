var Mode = require('./Mode');

function FFA() {
    Mode.apply(this, Array.prototype.slice.call(arguments));

    this.ID = 0;
    this.name = "Free For All";
    this.specByLeaderboard = true;
}

module.exports = FFA;
FFA.prototype = new Mode();

// Gamemode Specific Functions

FFA.prototype.leaderboardAddSort = function (player, leaderboard) {
    // Adds the player and sorts the leaderboard
    var len = leaderboard.length - 1;
    var loop = true;
    while ((len >= 0) && (loop)) {
        // Start from the bottom of the leaderboard
        if (player.getScore(false) <= leaderboard[len].getScore(false)) {
            leaderboard.splice(len + 1, 0, player);
            loop = false; // End the loop if a spot is found
        }
        len--;
    }
    if (loop) {
        // Add to top of the list because no spots were found
        leaderboard.splice(0, 0, player);
    }
};

// Override

FFA.prototype.onPlayerSpawn = function (gameServer, player) {
    // Random color
    player.color = gameServer.getRandomColor();

    // Set up variables
    var pos, startMass;

    // Spawn player
    gameServer.spawnPlayer(player, pos, startMass);
};

FFA.prototype.updateLB = function (gameServer) {
    var lb = gameServer.leaderboard;
    // Loop through all clients
    for (var i = 0, llen = gameServer.clients.length; i < llen; i++) {
        if (typeof gameServer.clients[i] == "undefined") {
            continue;
        }

        var player = gameServer.clients[i].playerTracker;
        var playerScore = player.getScore(true);
        if (player.cells.length <= 0) {
            continue;
        }

        if (lb.length == 0) {
            // Initial player
            lb.push(player);

        } else if (lb.length < gameServer.config.gameLBlength) {
            this.leaderboardAddSort(player, lb);
        } else {
            // 10 in leaderboard already
            if (playerScore > lb[gameServer.config.gameLBlength - 1].getScore(false)) {
                lb.pop();
                this.leaderboardAddSort(player, lb);
            }
        }
    }
    this.rankOne = lb[0];
};
