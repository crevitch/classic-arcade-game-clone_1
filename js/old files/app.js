// constants for player center offset from x,y value, radius of sprite
const playerXoff=50;
const playerYoff=100;
const playerRadius=40;
const enemyXoff=50;
const enemyYoff=110;
const enemyRadius=43;

// constants for start points, bounds and increments for players and enemies
const xinc = 101;
const yinc = 83;
const ytop = 50;
const player_xstart = 2*xinc;
const player_ystart = ytop + 25 + 4*yinc ;
const player_xmax = 4*xinc;
const player_xmin = 0*xinc;
const player_ymax = 0*yinc ;
const num_enemies =3;
const enemy_xmax = 5*xinc;

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
	this.circle=function(){
		ctx.beginPath();
		ctx.arc(this.x+enemyXoff, this.y+enemyYoff, enemyRadius, 0, Math.PI*2, true); 
		ctx.closePath();
		ctx.stroke();	
	}
	// randomize initializes the enemy start point and speed
	this.randomize = function(){
	this.x = -xinc;// start off screen
	this.y = 65 + yinc * Math.floor((Math.random()*3));	// random of 3 tracks for enemies
	this.speed = (0.5 + Math.random()) * 300 //random speed from 100-300
}
}


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
	this.x = this.x + this.speed * dt;
	
	// this calculates the distance between the center of the enemy and the player
	var distance = Math.sqrt(Math.pow((this.x + enemyXoff)-(player.x + playerXoff),2) + Math.pow((this.y + enemyYoff)-(player.y + playerYoff),2));
	
	if (distance < playerRadius+enemyRadius)player.reset();	// if closer than the radius of the two added, then collision, reset the player
	
	if (this.x > enemy_xmax)	// if off screen reset speed and start point
	{
	this.randomize();			// this randomizes the speed and the track of the enemies
	}
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	//this.circle(); for debug of collision.  draws circle around the enemy sprite
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

//*************added
var player = function() {
	var gameWins=0;			// variable stores game wins
	var gameNumber=1;		// variable stores game number
	
	this.sprite = 'images/char-boy.png';
	
	//console.log('player wid and height',Resources.get(this.sprite).width,Resources.get(this.sprite).height); debug for sprite size
	
	this.x = player_xstart;	// starting x and y value for player
	this.y = player_ystart;
	
	this.update=function(){}
	this.render=function(){ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
		//this.circle();	for debug of collisions
		}
	
// this is the player reset function.  sends the player back to start and increments the game number.  also re-sets the enemies	
	this.reset=function(){
		for  (var i=0;i<num_enemies;++i) allEnemies[i].randomize();
		player.x = player_xstart;
		player.y = player_ystart;
		var gamesBox = document.getElementById('gamenum');
		gameNumber=gameNumber+1;
		console.log(gameNumber);
		gamesBox.value = gameNumber;
	}
	
	// draws circle around player sprite for collision debug
	this.circle=function(){
		ctx.beginPath();
		ctx.arc(this.x+playerXoff, this.y + playerYoff, playerRadius, 0, Math.PI*2, true); 
		ctx.closePath();
		ctx.stroke();	
	}
	// look for the 4 arrow keys
	this.handleInput=function(key){
	switch (key) {
		
	case 'left':
    if(this.x > player_xmin)this.x = this.x - xinc;		// if player not at left edge, move left one block
	break;
	
	case 'right':
	if(this.x < player_xmax)this.x=this.x + xinc;		// if player not at right edge, move right one block
	break;
	
	case 'up':
    if(this.y>player_ymax){								// if player not at water yet
		this.y=this.y - yinc;							// move up one block
		if(this.y < player_ymax){						// now if at water
		var winsBox = document.getElementById('wins');	// get wins box from html
		gameWins = gameWins + 1;						// increment wins
		winsBox.value = gameWins;						// set wins box ons screen to current value
		setTimeout(function(){player.reset();}, 1000);	// you won! bask in your glory for one second before starting again
		}
	}
	break;
	
	case 'down':
	if(this.y<player_ystart)this.y=this.y + yinc;		// if player not at bottom, allow to move down
	break;
  
	default:											// other keys won't do anything
    break;
	}
	
	}
	
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var gameStart =function(){			// called from init.  needed to do this to instantiate after sprites loaded so we could get resources of screen
									// elements (sprites and canvas.) Otherwise they are undefined
player = new player();				// global player object

allEnemies = new Array();			// global array of enemy objects

	for  (var i=0; i<num_enemies; ++i) {	// loop through the new enemy array
	allEnemies.push(new Enemy());			// create
	allEnemies[i].randomize();				// initialize start and speed
	}
}



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
