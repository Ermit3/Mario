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
var death = false;

function preload() {
    // JSON map
    this.load.tilemapTiledJSON('map', 'assets/map2.json',null);
    // tiles
    this.load.image('tiles', 'assets/tiles3.png',{frameWidth :64});
    this.load.image('bonusTile', 'assets/bonusTile.png',{frameWidth :64});
    this.load.image('brickTile', 'assets/brickTile.png',{frameWidth :64});
    this.load.image('breackbrick1', 'assets/breackbrick1.png',{frameWidth :64});
    this.load.image('breackbrick2', 'assets/breackbrick2.png',{frameWidth :64});



    // coin
    this.load.image('coin', 'assets/coinGold.png');
    // player animations
    this.load.atlas('player', 'assets/player2.png', 'assets/player.json');
    this.load.atlas('gumba','assets/spritegumba.png','assets/spritegumba.json');

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
    player = this.physics.add.sprite(300, 350, 'player');
    //player.setBounce(0.2); // our player will bounce from items
    // player.setSize(300, 300, true);

    player.setCollideWorldBounds(true); // ne peux pas d�passer la carte
    player.lifescore = lifescore;
    player.level = 1;

    (player.level == 1)?player.setScale(1.1):player.setScale(1.6)


    this.gumba3 = new Gumba();
    this.gumba3.createObject(this,'gumba3',groundLayer,50,550)
    this.gumba3.collideWithPlayer(this,player,'gumba3',death)
    console.log(this.gumba);

    this.gumba1 = new Gumba();
    this.gumba1.createObject(this,'gumba1',groundLayer,100,550)

    this.gumba1.collideWithPlayer(this,player,'gumba1',death)

    console.log(this.gumba1);

    this.gumba2 = new Gumba();
    this.gumba2.createObject(this,'gumba2',groundLayer,300,550)
    this.gumba2.collideWithPlayer(this,player,'gumba2',death)

    
    // player will collide with the level tiles 
    this.physics.add.collider(groundLayer, player);
    
    groundLayer.setTileIndexCallback(3, breackBrick, this);
    groundLayer.setTileIndexCallback(4, breackBrick, this);

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

    this.anims.create({
        key: 'testtiles',
        frames: [{key: 'tiles', frame: 2}],
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
    this.cameras.main.setZoom(1);
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

function breackBrick(sprite,tile) {

    // console.log( player.y/64)
    var playerTile = groundLayer.getTileAtWorldXY(player.x, player.y, true)
    if(playerTile.y -tile.y  == 1){
        console.log(tile.index)
        if(tile.index==3){
            tile.index=11
            var box =this.add.image(tile.x*64+32, tile.y*64+24, 'bonusTile');
            var y = 24
            for (var i = 1 ; i <= 10; i++){
                if (i < 5){
                    setTimeout(() => {y = y-4;box.setPosition(tile.x*64+32, tile.y*64+y);}, i*30);
                } else{
                    
                    setTimeout(() => {y = y+4;box.setPosition(tile.x*64+32, tile.y*64+y);}, i*30);  
                }        
            }
            setTimeout(() => {box.destroy();tile.index=7;bonus(this,tile)}, 310);  
        }
        if(tile.index==4){
            tile.index=11
            var box =this.add.image(tile.x*64+32, tile.y*64+24, 'brickTile');
            var y = 24
            if(player.level == 1){
                for (var i = 1 ; i <= 10; i++){
                    if (i < 5){
                        setTimeout(() => {y = y-4;box.setPosition(tile.x*64+32, tile.y*64+y);}, i*30);
                    } else{
                        
                        setTimeout(() => {y = y+4;box.setPosition(tile.x*64+32, tile.y*64+y);}, i*30);  
                    }        
                }
                setTimeout(() => {box.destroy(),tile.index=4}, 310); 
            } else{
                groundLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin

                for (var i = 1 ; i < 6; i++){
                    if (i < 4){
                    setTimeout(() => {y = y-4;;box.setTexture('breackbrick1');box.setPosition(tile.x*64+32, tile.y*64+y);}, i*50);
                     }else
                    setTimeout(() => {y = y-4;;box.setTexture('breackbrick2');box.setPosition(tile.x*64+32, tile.y*64+y);}, i*50);
                     }
                setTimeout(() => {box.destroy()}, 310); 
            }
        }

    
    // tile.index=4
    // groundLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin
    // groundLayer.At(tile.x-64, tile.y)

    return false;
    }


}

function bonus(main,tile){
    console.log('bonus');
    var bonusss = main.physics.add.sprite(tile.x*64+32, tile.y*64+32-64,'coin');
    main.physics.add.collider(groundLayer, bonusss);
    main.physics.add.overlap(player, bonusss, (player, bonusss) => {
        console.log("Y'a contact")
        player.level = 2;
        bonusss.destroy()
    });


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

function update(time, delta) {

     lifecount.setText(player.lifescore);

    this.gumba1.changeDirection()
    this.gumba2.changeDirection()
    this.gumba3.changeDirection()

if(player.level == 2)player.setScale(1.6);
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