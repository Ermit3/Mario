/* import Gumba from './gumba';
import Koopa from './koopa'; */
import Mario from './mario';
import Enemy from './enemy';
import Mushroom from './mushroom';
import Bonus from "./bonus";
import Bomb from "./Bomb";
import BombPlat from './bombplat';

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 750,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 }, // from 500 to 600
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

var bricks = [];
var map;
var layer;
var player;
var mario;
var cursors;
var groundLayer, coinsLayer, backgroundLayer, pipesLayer, bricksLayer, decorationLayer;
var text;
var score = 0;
//var gumba;
var gumbadead;
var lifecount;
var lifescore = 3;
var death = false;

function preload() {
    // JSON map
    this.load.tilemapTiledJSON('map', 'assets/untitled4.json', null);
    // tiles
    this.load.image('tileset_x4', 'assets/tileset_x4.png', { frameWidth: 16 });
    this.load.image('bonusTile', 'assets/m_box.png', { frameWidth: 16 });
    this.load.image('bonusTileOff', 'assets/bonusTileOff.png', { frameWidth: 16 });
    this.load.image('brickTile', 'assets/brickTile.png', { frameWidth: 16 });
    this.load.image('breackbrick1', 'assets/breackbrick1.png', { frameWidth: 16 });
    this.load.image('breackbrick2', 'assets/breackbrick2.png', { frameWidth: 16 });
    this.load.atlas('mystery_box', 'assets/mystery_tiles.png', 'assets/mystery_tiles.json');
    // bonus
    this.load.image('mushroom', 'assets/mushroom.png');
    this.load.image('flower', 'assets/flower.png');
    // coin
    this.load.image('coin', 'assets/coinGold.png');
    // fireball
    this.load.atlas('fireball', 'assets/fireball_01.png', 'assets/fireball_01.json');
    //Bomb
    this.load.image('bombplat','assets/bombplat.png',{frameWidth:16});
    this.load.atlas('bomb','assets/bombasprite.png','assets/bombasprite.json');
    // player animations
    this.load.atlas('player', 'assets/mario_complete.png', 'assets/mario_complete.json');
    this.load.atlas('gumba', 'assets/spritegumba.png', 'assets/spritegumba.json');
    this.load.atlas('koopa', 'assets/KoopaSprite2.png', 'assets/KoopaSprite2.json');

    //this.load.image('gumba','assets/gumba.png');
    this.load.image('life', 'assets/life.png');
    //this.load.image('gumbadead','assets/deathgumba.png');
}

function create() {

    // create the ground layer
    let map = this.make.tilemap({ key: 'map' });
    const groundTiles = map.addTilesetImage('tileset_x4');
    const backgroundLayer = map.createDynamicLayer('backgroundLayer', groundTiles, 0, 0);
    const decorationLayer = map.createDynamicLayer('decorationLayer', groundTiles, 0, 0);
    const groundLayer = map.createStaticLayer('groundLayer', groundTiles, 0, 0);
    this.groundLayer = groundLayer;
    const poleLayer = map.createFromObjects('poleLayer', 'pole', { key: 'bonusTileOff' })
    const bricksLayer = map.createFromObjects('bricksLayer', 'brick', { key: 'brickTile' })
    const boxLayer = map.createFromObjects('bricksLayer', 'box', { key: 'bonusTile' })
    this.bricksLayer = bricksLayer;
    this.boxLayer = boxLayer;

    console.log(boxLayer);
    // const colude = map.setCollisionFromCollisionGroup(true, true, bricksLayer)
    // console.log(colude);

    // collision avec le groundLayer
    groundLayer.setCollisionByExclusion([-1]);

    // GameOver
    this.physics.resume(); // Après gameover si le monde est en pause, il reprendra
    this.gameOver = false;
    this.winGame = false;

    // add coins
    // var coinTiles = map.addTilesetImage('coin');
    // coinLayer = map.createDynamicLayer('Coins', coinTiles, 0, 0);

    // GESTION BORDURE
    // set the boundaries of our game world
    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;
    // FIN BORDURE //

    // GESTION APPARITION
    /// MARIO
    mario = new Mario(this, groundLayer, 50, 600);
    player = mario.player;
    window.player = player;
    this.player = player;

    // Pole
    poleLayer.forEach(pole => {
        this.physics.world.enable(pole);
        pole.body.allowGravity = false;
        pole.body.immovable = true;
        this.physics.add.collider(player, pole, (_player, _pole) => {
            this.winGame = true;
            this.winGameText.visible = true;
            this.restartText.visible = true;
            this.physics.pause();
        });
    })

    //Bomb plateforme
    //let bombplat1 = this.add.sprite(400, 675, 'bombplat');
    this.bombplat1 = new BombPlat(this,400,675);

    // Bricks
    bricksLayer.forEach(brick => {
        this.physics.world.enable(brick);
        brick.body.allowGravity = false;
        brick.body.immovable = true;
        brick.body.setSize(brick.width, brick.height, true);
        this.physics.add.collider(player, brick, (_player, _brick) => {
            if (_player.body.touching.up && _brick.body.touching.down && _brick.name == "brick") {
                console.log(_brick.name);
                if (_player.level >= 2) {
                    _brick.destroy()
                } else {
                    // animation
                }
            }
        });
    })

    boxLayer.forEach(brick => {
        this.physics.world.enable(brick);
        brick.body.allowGravity = false;
        brick.body.immovable = true;
        brick.body.actived = true;
        brick.body.setSize(brick.width, brick.height, true);
        this.physics.add.collider(player, brick, (_player, _box) => {
            if (_player.body.touching.up && _box.body.touching.down && brick.body.actived) {
                if (_player.level < 3) {
                    bonus(this, _box, groundLayer);
                    brick.body.actived = false;
                } else {

                }
            }
        });
    })

    //ENEMY

    //KOOPA
    this.koopa1 = new Enemy(this, groundLayer, 400, 600, 'koopa');
    this.koopa = new Enemy(this, groundLayer, 500, 600, 'koopa');

    /// GUMBA
    this.gumba3 = new Enemy(this, groundLayer, 200, 600, 'gumba');
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
    // coinLayer.setTileIndexCallback(7, collectCoin, this);
    // // // when the player overlaps with a tile with index 17, collectCoin 
    // // // will be called    
    // this.physics.add.overlap(player, coinLayer);

    // GESTION DES SPRITES

    /// MARIO LEVEL 1
    // player walk animation
    this.anims.create({
        key: 'death',
        frames: [{ key: 'player', frame: 'mario_s_death' }], // p1_death
        frameRate: 10,
    });
    // 1
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNames('player', { prefix: 'mario_s_walk', start: 1, end: 3, zeroPad: 2 }), // p1_walk
        frameRate: 10,
        repeat: -1
    });
    // idle with only one frame, so repeat is not neaded
    this.anims.create({
        key: 'idle',
        frames: [{ key: 'player', frame: 'mario_s_idle' }], // p1_stand
        frameRate: 10,
    });
    // 
    this.anims.create({
        key: 'jump',
        frames: [{ key: 'player', frame: 'mario_s_jump' }], // p1_jump
        frameRate: 10,
    });
    // 2
    this.anims.create({
        key: 'walk2',
        frames: this.anims.generateFrameNames('player', { prefix: 'mario_l_walk', start: 1, end: 3, zeroPad: 2 }), // p1_walk
        frameRate: 10,
        repeat: -1
    });
    // idle with only one frame, so repeat is not neaded
    this.anims.create({
        key: 'idle2',
        frames: [{ key: 'player', frame: 'mario_l_idle' }], // p1_stand
        frameRate: 10,
    });
    // 
    this.anims.create({
        key: 'jump2',
        frames: [{ key: 'player', frame: 'mario_l_jump' }], // p1_jump
        frameRate: 10,
    });
    // 3
    this.anims.create({
        key: 'walk3',
        frames: this.anims.generateFrameNames('player', { prefix: 'mario_f_walk', start: 1, end: 3, zeroPad: 2 }), // p1_walk
        frameRate: 10,
        repeat: -1
    });
    // idle with only one frame, so repeat is not neaded
    this.anims.create({
        key: 'idle3',
        frames: [{ key: 'player', frame: 'mario_f_idle' }], // p1_stand
        frameRate: 10,
    });
    // 
    this.anims.create({
        key: 'jump3',
        frames: [{ key: 'player', frame: 'mario_f_jump' }], // p1_jump
        frameRate: 10,
    });
    this.anims.create({
        key: 'throw',
        frames: [{ key: 'player', frame: 'mario_f_throw' }], // p1_jump
        frameRate: 10,
    });
    // 

    //Bomb
    this.anims.create({
        key:'bombright',
        frames:[{key:'bomb',frame:'bombright'}]
    });

    this.anims.create({
        key:'bombleft',
        frames:[{key:'bomb',frame:'bombleft'}]
    });

    ///FIREBALL
    this.anims.create({
        key: 'fireball',
        frames: this.anims.generateFrameNames('fireball', { prefix: 'fire_', start: 1, end: 4, zeroPad: 2 }),
        frameRate: 10,
        repeat: -1
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
    // Zoom
    this.cameras.main.setZoom(1);
    // make the camera follow the player 
    this.cameras.main.startFollow(player, false, 0, 0, 0, 0);
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

    lifecount = this.add.text(760, 20, "" + player.lifescore + "", {
        fontSize: '20px',
        fill: '#ffffff'
    });
    // fix the text to the camera
    lifecount.setScrollFactor(0);

    ///GameOver
    this.winGameText = this.add.text(400, 200, "FELICITATION", {
        fontSize: '100px',
        fill: '#ff0000',
    });
    this.winGameText.setOrigin(0.5);
    this.winGameText.depth = 2;
    this.winGameText.visible = false;
    this.winGameText.setScrollFactor(0);
    this.winGameText.setStroke('#000', 5)
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

function bonus(main, tile, groundLayer) {
    console.log("bonus");
    if (player.level == 1) {
        var mushroom = new Mushroom(main, groundLayer, tile.x, tile.y - 64, 'mushroom');
        var bonus = mushroom.bonus;
        if (!main.mushrooms) {
            main.mushrooms = [];
            console.log("create");
        }
        main.mushrooms.push(mushroom);
        console.log(bonus.name);
    } else if (player.level == 2) {
        console.log(groundLayer);
        var flower = new Bonus(main, groundLayer, tile.x, tile.y - 64, 'flower', false);
        var bonus = flower.bonus;
    } else {
        return
    }

    console.log(tile.x * 64 + 32, tile.y);
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
    
    // console.log(player.body.touching.down);

    if ((this.gameOver || this.winGame) && cursors.space.isDown) {
        mario.restartScene(this);
    } else if (this.gameOver || this.winGame) {
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
    mario.playerMove(cursors);

    // Flower Mario Throw Fire
    mario.playerThrow(cursors);

    //LauchBombs
    this.bombplat1.LaunchBomb();
    
    // MarioDeath(player);
    mario.playerDeath(player, this,this.koopa1.enemy);

    // mario.playerDead(player);
}