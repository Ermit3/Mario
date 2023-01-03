/* import Gumba from './gumba';
import Koopa from './koopa'; */
import Mario from './mario';
import Enemy from './enemy';
import Mushroom from './mushroom';
import Bonus from "./bonus";

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 }, // from 500 to 600
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
    this.load.image('bonusTile', 'assets/bonusTile.png', { frameWidth: 64 });
    this.load.image('bonusTileOff', 'assets/bonusTileOff.png', { frameWidth: 64 });
    this.load.image('brickTile', 'assets/brickTile.png', { frameWidth: 64 });
    this.load.image('breackbrick1', 'assets/breackbrick1.png', { frameWidth: 64 });
    this.load.image('breackbrick2', 'assets/breackbrick2.png', { frameWidth: 64 });
    this.load.atlas('mystery_box', 'assets/mystery_tiles.png', 'assets/mystery_tiles.json');
    // bonus
    this.load.image('mushroom', 'assets/mushroom.png');
    this.load.image('flower', 'assets/flower.png');
    // coin
    this.load.image('coin', 'assets/coinGold.png');
    // player animations
    this.load.atlas('player', 'assets/opti_player.png', 'assets/opti_player.json');
    this.load.atlas('gumba', 'assets/spritegumba.png', 'assets/spritegumba.json');
    this.load.atlas('koopa', 'assets/KoopaSprite2.png', 'assets/KoopaSprite2.json');

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

    //ENEMY

    //KOOPA
    this.koopa1 = new Enemy(this, groundLayer, 400, 550, 'koopa');

    /// GUMBA
    this.gumba3 = new Enemy(this, groundLayer, 50, 550, 'gumba');
    /* this.gumba1 = new Gumba(this, groundLayer, 100, 550,'gumba');
    this.gumba2 = new Gumba(this, groundLayer, 300, 550,'gumba'); */
    // FIN APPARITION //

    // small fix to our player images, we resize the physics body object slightly
    // player.body.setSize(player.width, player.height - 8);

    /* mario.collideWithEnemy(this, this.gumba1.gumba);
    mario.collideWithEnemy(this, this.gumba2.gumba); */
    mario.collideWithEnemy(this, this.gumba3.enemy, 'gumbadeath');
    mario.collideWithEnemy(this, this.koopa1.enemy, 'koopadeath');

    //mario.collideWithKoopa(this, this.koopa1.koopa);

    // PLAYER PHYSICS
    // player will collide with the level tiles 
    this.physics.add.collider(groundLayer, player);
    // FIN PLAYER PHYSICS //

    // TILES PHYSICS
    groundLayer.setTileIndexCallback(3, breackBrick, this);
    groundLayer.setTileIndexCallback(4, breackBrick, this);
    // END TILES //


    //Animation des KOOPA
    this.anims.create({
        key: 'left',
        frames: [{ key: 'koopa', frame: 'Koopa2' }],
    })
    this.anims.create({
        key: 'right',
        frames: [{ key: 'koopa', frame: 'Koopa1' }],
    })
    this.anims.create({
        key: 'koopadeath',
        frames: [{ key: 'koopa', frame: 'koopaDead' }],
    })
    // FIN Animation des KOOPA
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
    ///TILES
    this.anims.create({
        key: 'tiles_on',
        frames: [{ key: 'mystery_box', frame: 'box_1' }],
    })
    this.anims.create({
        key: 'tiles_off',
        frames: [{ key: 'mystery_box', frame: 'box_4' }],
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

function breackBrick(sprite, tile) {

    // console.log( player.y/64)
    var playerTile = groundLayer.getTileAtWorldXY(player.x, player.y, true)
    if (playerTile.y - tile.y == 1) {
        console.log(tile.index)
        if (tile.index == 3) {
            tile.index = 11
            var box = this.add.image(tile.x * 64 + 32, tile.y * 64 + 24, 'bonusTile');
            var y = 24
            for (var i = 1; i <= 10; i++) {
                if (i < 5) {
                    setTimeout(() => { y = y - 4; box.setPosition(tile.x * 64 + 32, tile.y * 64 + y); }, i * 30);
                } else {
                    setTimeout(() => { y = y + 4; box.setPosition(tile.x * 64 + 32, tile.y * 64 + y); }, i * 30);
                }
            }
            setTimeout(() => {
                box.destroy()
                box = this.add.image(tile.x * 64 + 32, tile.y * 64 + 32, 'bonusTileOff');
                box.setScale(0.4)
                tile.index = 7;
                bonus(this, tile)
            }, 310);
        }
        if (tile.index == 4) {
            tile.index = 11
            var box = this.add.image(tile.x * 64 + 32, tile.y * 64 + 24, 'brickTile');
            var y = 24
            if (player.level == 1) {
                for (var i = 1; i <= 10; i++) {
                    if (i < 5) {
                        setTimeout(() => { y = y - 4; box.setPosition(tile.x * 64 + 32, tile.y * 64 + y); }, i * 30);
                    } else {

                        setTimeout(() => { y = y + 4; box.setPosition(tile.x * 64 + 32, tile.y * 64 + y); }, i * 30);
                    }
                }
                setTimeout(() => { box.destroy(), tile.index = 4 }, 310);
            } else {
                groundLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin

                for (var i = 1; i < 6; i++) {
                    if (i < 4) {
                        setTimeout(() => { y = y - 4;; box.setTexture('breackbrick1'); box.setPosition(tile.x * 64 + 32, tile.y * 64 + y); }, i * 50);
                    } else
                        setTimeout(() => { y = y - 4;; box.setTexture('breackbrick2'); box.setPosition(tile.x * 64 + 32, tile.y * 64 + y); }, i * 50);
                }
                setTimeout(() => { box.destroy() }, 310);
            }
        }


        // tile.index=4
        // groundLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin
        // groundLayer.At(tile.x-64, tile.y)

        return false;
    }


}

function bonus(main, tile) {
    // var mushroom2 = main.physics.add.sprite(tile.x * 64 + 32, tile.y * 64 + 32 - 64, 'mushroom');
    // main.physics.add.collider(groundLayer, mushroom2);
    // mushroom2.setCollideWorldBounds(true);
    // move(mushroom2);
    if (player.level == 1) {
        var mushroom = new Mushroom(main, groundLayer, tile.x * 64 + 32, tile.y * 64 + 32 - 64, 'mushroom');
        var bonus = mushroom.bonus;
        if (!main.mushrooms) {
            main.mushrooms = [];
            console.log("create");
        }
        main.mushrooms.push(mushroom);
        console.log(bonus.name);
    } else if (player.level == 2) {
        var flower = new Bonus(main, groundLayer, tile.x * 64 + 32, tile.y * 64 + 32 - 64, 'flower');
        var bonus = flower.bonus;
    } else {
        return
    }

    main.physics.add.overlap(player, bonus, (player, bonus) => {
        console.log("Y'a contact");
        if (bonus.name == "mushroom" || bonus.name == "flower") {
            mario.levelUp(main, bonus);
        } else {
            // coin
        }
        // if (bonus.name == "mushroom" || bonus.name == "flower") {
        //     mushroom.destroy()
        // } else if (bonus.name == "flower") {
        //     flower.destroy()
        // }
        bonus.destroyed = true;
        bonus.destroy();
    });
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

    if (this.mushrooms) {
        this.mushrooms.forEach(mushroom => {
            if (mushroom.bonus.name == "mushroom" && !mushroom.bonus.destroyed) {
                mushroom.changeDirection();
            }
        });
    }

    this.koopa1.changeDirectionKoopa();

    /* this.gumba1.changeDirection(this.gumba1);
    this.gumba2.changeDirection(this.gumba2); */
    this.gumba3.changeDirection();

    //this.koopa1.ShellMovement();
    // MarioMove(player, cursors);
    mario.playerMove(player, cursors, this);

    // MarioDeath(player);
    mario.playerDeath(player, this);

    // mario.playerDead(player);
}