// constants for player center offset from x,y value, radius of sprite
 var PLAYERXOFF = 50;
 var PLAYERYOFF = 100;
 var PLAYERRADIUS = 40;
 var ENEMYXOFF = 50;
 var ENEMYYOFF = 110;
 var ENEMYYRADIUS = 43;

// constants for start points, bounds and increments for players and enemies
 var XINC = 101;
 var YINC = 83;
 var YTOP = 50;
 var PLAYER_XSTART = 2 * XINC;
 var PLAYER_YSTART = YTOP + 25 + 4 * YINC;
 var PLAYER_XMAX = 4 * XINC;
 var PLAYER_XMIN = 0 * XINC;
 var PLAYER_YMAX = 0 * YINC;
 var NUM_ENEMIES = 3;
 var ENEMY_XMAX = 5 * XINC;

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    // code to show dimensions of canvas and sprites
    //var w = Resources.get(this.sprite).width;
    //console.log('canvas wid and height', ctx.canvas.width, ctx.canvas.height);
    //console.log('enemy wid and height',Resources.get(this.sprite).width,Resources.get(this.sprite).height);

    // draws a circle around  enemy sprite for collision debug
    this.circle = function() {
            ctx.beginPath();
            ctx.arc(this.x + ENEMYXOFF, this.y + ENEMYYOFF, ENEMYYRADIUS, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.stroke();
        };
        // randomize initializes the enemy start point and speed
    this.randomize = function() {
        this.x = -XINC; // start off screen
        this.y = 65 + YINC * Math.floor((Math.random() * 3)); // random of 3 tracks for enemies
        this.speed = (0.5 + Math.random()) * 300; //random speed from 100-300
    };
};


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed * dt;

    // this calculates the distance between the center of the enemy and the player
    var distance = Math.sqrt(Math.pow((this.x + ENEMYXOFF) - (player.x + PLAYERXOFF), 2) + Math.pow((this.y + ENEMYYOFF) - (player.y + PLAYERYOFF), 2));

    if (distance < PLAYERRADIUS + ENEMYYRADIUS) player.reset(); // if closer than the radius of the two added, then collision, reset the player

    if (this.x > ENEMY_XMAX) // if off screen reset speed and start point
    {
        this.randomize(); // this randomizes the speed and the track of the enemies
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    //this.circle(); for debug of collision.  draws circle around the enemy sprite
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

//*************added
var Player = function() {
    var gameWins = 0; // variable stores game wins
    var gameNumber = 1; // variable stores game number

    this.sprite = 'images/char-boy.png';

    //console.log('player wid and height',Resources.get(this.sprite).width,Resources.get(this.sprite).height); debug for sprite size

    this.x = PLAYER_XSTART; // starting x and y value for player
    this.y = PLAYER_YSTART;

    this.update = function() {};
    this.render = function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        //this.circle();	for debug of collisions
    };

    // this is the player reset function.  sends the player back to start and increments the game number.  also re-sets the enemies	
    this.reset = function() {
        for (var i = 0; i < NUM_ENEMIES; ++i) allEnemies[i].randomize();
        player.x = PLAYER_XSTART;
        player.y = PLAYER_YSTART;
        var gamesBox = document.getElementById('gamenum');
        gameNumber = gameNumber + 1;
        console.log(gameNumber);
        gamesBox.value = gameNumber;
    };

    // draws circle around player sprite for collision debug
    this.circle = function() {
            ctx.beginPath();
            ctx.arc(this.x + PLAYERXOFF, this.y + PLAYERYOFF, PLAYERRADIUS, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.stroke();
        };
        // look for the 4 arrow keys
    this.handleInput = function(key) {
        switch (key) {

            case 'left':
                if (this.x > PLAYER_XMIN) this.x = this.x - XINC; // if player not at left edge, move left one block
                break;

            case 'right':
                if (this.x < PLAYER_XMAX) this.x = this.x + XINC; // if player not at right edge, move right one block
                break;

            case 'up':
                if (this.y > PLAYER_YMAX) { // if player not at water yet
                    this.y = this.y - YINC; // move up one block
                    if (this.y < PLAYER_YMAX) { // now if at water
                        var winsBox = document.getElementById('wins'); // get wins box from html
                        gameWins = gameWins + 1; // increment wins
                        winsBox.value = gameWins; // set wins box ons screen to current value
                        setTimeout(function() {
                            player.reset();
                        }, 1000); // you won! bask in your glory for one second before starting again
                    }
                }
                break;

            case 'down':
                if (this.y < PLAYER_YSTART) this.y = this.y + YINC; // if player not at bottom, allow to move down
                break;

            default: // other keys won't do anything
                break;
        }

    };

};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var gameStart = function() { // called from init.  needed to do this to instantiate after sprites loaded so we could get resources of screen
    // elements (sprites and canvas.) Otherwise they are undefined
    player = new Player(); // global player object

    allEnemies = new Array(); // global array of enemy objects

    for (var i = 0; i < NUM_ENEMIES; ++i) { // loop through the new enemy array
        allEnemies.push(new Enemy()); // create
        allEnemies[i].randomize(); // initialize start and speed
    }
};



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});