import Gumba from './gumba';

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 500},
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
var cursors;
var groundLayer, coinLayer;
var text;
var score = 0;
//var gumba;
var gumbadead;
var lifecount;
var lifescore = 3;
//this.death = false;

var gumba = new Gumba();
console.log(gumba);


function preload() {
    // JSON map
    this.load.tilemapTiledJSON('map', 'assets/map2.json',null);
    // tiles
    this.load.image('tiles', 'assets/tiles3.png',{frameWidth :64});
    // coin
    this.load.image('coin', 'assets/coinGold.png');
    // player animations
    this.load.atlas('player', 'assets/player2.png', 'assets/player.json');
    //this.load.atlas('gumba','assets/spritegumba.png','assets/spritegumba.json');

    //this.load.image('gumba','assets/gumba.png');
    this.load.image('life','assets/life.png');
    //this.load.image('gumbadead','assets/deathgumba.png');

}

function create() {

    // create the ground layer
    map = this.make.tilemap({key: 'map',tileWidth:64 ,tileHeight:64});
    var groundTiles = map.addTilesetImage('tiles');
    groundLayer = map.createDynamicLayer('world', groundTiles, 0, 0);

    // collision avec le groundLayer
    groundLayer.setCollisionByExclusion([-1]);
    


    // add coins
    var coinTiles = map.addTilesetImage('coin');
    coinLayer = map.createDynamicLayer('Coins', coinTiles, 0, 0);

    // set the boundaries of our game world
    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;

    // ajout player     
    player = this.physics.add.sprite(200, 200, 'player');
    //player.setBounce(0.2); // our player will bounce from items
    player.setCollideWorldBounds(true); // ne peux pas d�passer la carte

    /*//ajouter gumba
    gumba = this.physics.add.sprite(100,550,'gumba');
    //gumba.setBounce(0.2);
    gumba.setCollideWorldBounds(true);
    this.physics.add.collider(groundLayer, gumba);*/

    /*//Mort d'un gumba
    gumbadead = this.physics.add.sprite(150,550,'gumbadead');
    this.physics.add.collider(groundLayer,gumbadead);*/

    //mario life
    /*life = this.add.sprite(40,80,'life',{height : '20 px'});
    life1 = this.add.sprite(110,80,'life',{height : '20 px'});
    life2 = this.add.sprite(180,80,'life',{height : '20 px'});*/

    // small fix to our player images, we resize the physics body object slightly
    player.body.setSize(player.width, player.height-8);
    
    // player will collide with the level tiles 
    this.physics.add.collider(groundLayer, player);
    

    coinLayer.setTileIndexCallback(7, collectCoin, this);
    // // when the player overlaps with a tile with index 17, collectCoin 
    // // will be called    
    this.physics.add.overlap(player, coinLayer);
    // player walk animation
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNames('player', {prefix: 'p1_walk', start: 1, end: 11, zeroPad: 2}),
        frameRate: 10,
        repeat: -1
    });
    // idle with only one frame, so repeat is not neaded
    this.anims.create({
        key: 'idle',
        frames: [{key: 'player', frame: 'p1_stand'}],
        frameRate: 10,
    });

    //gumba animation
    this.anims.create({
        key : 'gumbadeath',
        frames: [{key: 'gumba', frame: 'sprite25'}],
    })

    cursors = this.input.keyboard.createCursorKeys();

    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // make the camera follow the player
    this.cameras.main.startFollow(player);

    // set background color, so the sky is not black    
    this.cameras.main.setBackgroundColor('#ccccff');

    // this text will show the score
    text = this.add.text(20, 570, '0', {
        fontSize: '20px',
        fill: '#ffffff'
    });
    // fix the text to the camera
    text.setScrollFactor(0);

    lifecount = this.add.text(100, 570, '3', {
        fontSize: '20px',
        fill: '#ffffff'
    });
    // fix the text to the camera
    lifecount.setScrollFactor(0);
}


// this function will be called when the player touches a coin
function collectCoin(sprite, tile) {
    coinLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin
    score++; // add 10 points to the score
    text.setText(score); // set the text to show the current score
    return false;
}

/*function removeGumba(gumba){
    gumba.anims.play('gumbadeath',true);
    //console.log("test");
}*/
var gumbaAlive = true;
function update(time, delta) {
    
    //faire bouger gumba
    if(gumbaAlive == true){
        gumba.setVelocity(100,0);
        if(gumba.body.blocked.right){
            gumba.direction='left';
        }
        if(gumba.body.blocked.left){
            gumba.direction='right';
        }
        if(gumba.direction === 'right'){
            gumba.setVelocity(100,0);
        }
        if(gumba.direction === 'left'){
            gumba.setVelocity(-100,0);
        }
    }
    
    
    ///////////////////
    //Mort de Mario
    this.physics.add.collider(player,gumba, function (player){
        if(player.y +15.5 < gumba.y){
            console.log("Mario win");
            gumba.anims.play('gumbadeath',true);
            gumba.setVelocity(0,0);
            gumbaAlive = false;
            setTimeout(() => {
                gumba.destroy();
            }, 1000);      
        }
        if(player.y + 15.5 >= gumba.y  && death == false ){
            death = true;
            lifescore = lifescore -1 ;
            lifecount.setText(lifescore);
            setTimeout(() => {
                console.log("Mario lose");        
                death =false ;
            }, 5000);
                      
        }
    });

    //mouvements de mario
    if (cursors.left.isDown)
    {
        player.body.setVelocityX(-200);
        player.anims.play('walk', true); // walk left
        player.flipX = true; // flip the sprite to the left
    }
    else if (cursors.right.isDown)
    {
        player.body.setVelocityX(200);
        player.anims.play('walk', true);
        player.flipX = false; // use the original sprite looking to the right
    } else {
        player.body.setVelocityX(0);
        player.anims.play('idle', true);
    }
    // jump 
    if (cursors.up.isDown && player.body.onFloor())
    {
        player.body.setVelocityY(-400);        
    }
}