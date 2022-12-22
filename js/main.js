import Gumba from './gumba';
import Mario from './mario';

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: {
        key: 'main',
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var map;
var layer;
var player;
var mario;
var cursors;
var groundLayer, coinLayer;
var text;
var score = 0;
//var gumba;
var gumbadead;
var lifecount;
var lifescore = 3;
var death = false;

function preload() {
    // JSON map
    this.load.tilemapTiledJSON('map', 'assets/map2.json', null);
    // tiles
    this.load.image('tiles', 'assets/tiles3.png', { frameWidth: 64 });
    // coin
    this.load.image('coin', 'assets/coinGold.png');
    // player animations
    this.load.atlas('player', 'assets/opti_player.png', 'assets/opti_player.json');
    this.load.atlas('gumba', 'assets/spritegumba.png', 'assets/spritegumba.json');
    this.load.atlas('death', 'assets/player3.png', 'assets/player3.json');

    //this.load.image('gumba','assets/gumba.png');
    this.load.image('life', 'assets/life.png');
    //this.load.image('gumbadead','assets/deathgumba.png');



}

function create() {

    // create the ground layer
    map = this.make.tilemap({ key: 'map', tileWidth: 64, tileHeight: 64 });
    var groundTiles = map.addTilesetImage('tiles');
    groundLayer = map.createDynamicLayer('world', groundTiles, 0, 0);

    // collision avec le groundLayer
    groundLayer.setCollisionByExclusion([-1]);

    // GameOver
    this.physics.resume(); // Après gameover si le monde est en pause, il reprendra
    this.gameOver = false;

    // add coins
    var coinTiles = map.addTilesetImage('coin');
    coinLayer = map.createDynamicLayer('Coins', coinTiles, 0, 0);

    // GESTION BORDURE
    // set the boundaries of our game world
    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;
    // FIN BORDURE //

    // GESTION APPARITION
    /// MARIO
    mario = new Mario(this, groundLayer, 200, 200);
    player = mario.player;
    /// GUMBA
    this.gumba3 = new Gumba(this, groundLayer, 50, 550);
    this.gumba1 = new Gumba(this, groundLayer, 100, 550);
    this.gumba2 = new Gumba(this, groundLayer, 300, 550);
    // FIN APPARITION //

    // small fix to our player images, we resize the physics body object slightly
    player.body.setSize(player.width, player.height - 8);

    mario.collideWithEnemy(this, this.gumba1.gumba);
    mario.collideWithEnemy(this, this.gumba2.gumba);
    mario.collideWithEnemy(this, this.gumba3.gumba);

    // PLAYER PHYSICS
    // player will collide with the level tiles 
    this.physics.add.collider(groundLayer, player);
    // FIN PLAYER PHYSICS //


    coinLayer.setTileIndexCallback(7, collectCoin, this);
    // // when the player overlaps with a tile with index 17, collectCoin 
    // // will be called    
    this.physics.add.overlap(player, coinLayer);

    // GESTION DES SPRITES
    /// MARIO
    // player walk animation
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNames('player', { prefix: 'p1_walk', start: 3, end: 1, zeroPad: 2 }),
        frameRate: 10,
        repeat: -1
    });
    // idle with only one frame, so repeat is not neaded
    this.anims.create({
        key: 'idle',
        frames: [{ key: 'player', frame: 'p1_stand' }],
        frameRate: 10,
    });
    // 
    this.anims.create({
        key: 'jump',
        frames: [{ key: 'player', frame: 'p1_jump' }],
        frameRate: 10,
    });
    // 
    this.anims.create({
        key: 'death',
        frames: [{ key: 'player', frame: 'p1_death' }],
        frameRate: 10,
    });
    ///GUMBA
    this.anims.create({
        key: 'gumbadeath',
        frames: [{ key: 'gumba', frame: 'sprite25' }],
    })
    // FIN SPRITE //

    cursors = this.input.keyboard.createCursorKeys();

    // GESTION DE CAMERA
    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // make the camera follow the player
    this.cameras.main.startFollow(player);
    // set background color, so the sky is not black    
    this.cameras.main.setBackgroundColor('#ccccff');
    // à coriger
    this.cameras.main.fadeIn(1000);
    // FIN CAMERA //

    // GESTION DU TEXT
    // this text will show the score
    text = this.add.text(20, 570, '0', {
        fontSize: '20px',
        fill: '#ffffff'
    });
    // fix the text to the camera
    text.setScrollFactor(0);

    lifecount = this.add.text(100, 570, "" + player.lifescore + "", {
        fontSize: '20px',
        fill: '#ffffff'
    });
    // fix the text to the camera
    lifecount.setScrollFactor(0);

    ///GameOver
    this.gameOverText = this.add.text(400, 200, "GAME OVER", {
        fontSize: '100px',
        fill: '#000',
    });
    this.gameOverText.setOrigin(0.5);
    this.gameOverText.depth = 2;
    this.gameOverText.visible = false;
    this.gameOverText.setScrollFactor(0);
    this.gameOverText.setStroke('#000', 5)
    /// RESTART
    this.restartText = this.add.text(400, 300, "Press 'space' to restart", {
        fontSize: '30px',
        fill: '#000'
    });
    this.restartText.setOrigin(0.5);
    this.restartText.depth = 2;
    this.restartText.visible = false;
    this.restartText.setScrollFactor(0);
    this.restartText.setStroke('#000', 2)
    // FIN TEXT //
}


// this function will be called when the player touches a coin
function collectCoin(sprite, tile) {
    coinLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin
    score++; // add 10 points to the score
    text.setText(score); // set the text to show the current score
    return false;
}

function update(time, delta) {

    if (this.gameOver && cursors.space.isDown) {
        mario.restartScene(this);
    } else if (this.gameOver) {
        return
    }

    this.gumba1.changeDirection();
    this.gumba2.changeDirection();
    this.gumba3.changeDirection();

    // MarioMove(player, cursors);
    mario.playerMove(player, cursors, this);

    // MarioDeath(player);
    mario.playerDeath(player, this);

    // mario.playerDead(player);
}