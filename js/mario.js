import Bomb from "./bomb";
import Fire from "./fire";

function transformation(type, player, main) {
    let count = 0;
    for (var i = 0; i <= 10; i++) {
        if (i % 2 == 0) {
            var transformation1 = setTimeout(() => {
                if (type == "levelUP") {
                    player.setScale(0.8);
                } else if (type == "isGhost") {
                    player.alpha = 1;
                }
                count++;
                if (count == 9) {
                    if (type == "levelUP") {
                        main.physics.resume();
                    } else if (type == "isGhost") {
                        player.isGhost = false;
                    }
                    player.body.setSize(player.width, player.height, true)
                    clearTimeout(transformation1)
                }
            }, i * 100);
        } else {
            var transformation2 = setTimeout(() => {
                if (type == "levelUP") {
                    player.setScale(0.7);
                } else if (type == "isGhost") {
                    player.alpha = 0.1;
                }
                count++;
                if (count == 8) {
                    clearTimeout(transformation2)
                }
            }, i * 100);
        }
    }
}


// Fonction de frame d'invisibilité
function _isGhost(player) {
    player.isGhost = true;
    transformation("isGhost", player);
}

// Fonction mettant la physique du jeu en pause et fait grandir le player  
function _levelUp(player, main) {
    main.physics.pause();
    transformation("levelUP", player, main);
}

export default class Mario {
    player;
    fire = Date.now()
    counter = 0;


    constructor(main, groundLayer, x, y) {
        this.main = main;
        this.groundLayer = groundLayer;
        this.player = main.physics.add.sprite(x, y, 'player');
        this.player.setCollideWorldBounds(true);
        this.main.physics.add.collider(this.groundLayer, this.player);
        this.player.depth = 1; // z-index du texte
        this.player.level = 1; //
        this.player.counter = 0;
        this.player.isAlive = true;
        this.player.isGhost = false;
        this.player.setScale(0.8);
        this.player.direction = "right";
        setTimeout(() => {
            this.player.body.setSize(player.width, player.height, true)
        }, 100)
        setInterval(() => {
            this.player.counter++;
        }, 1000)
        this.player.fire = {
            available: true,
            date: Date.now()
        }
        this.walk = "walk"
        this.idle = "idle"
        this.jump = "jump"
        if (this.player.level >= 1) {
            this.player.setScale(0.8)
        }
        // (this.player.level == 1) ? this.player.setScale(0.7) : this.player.setScale(0.9)
    }

    playerMove(cursors) {
        if (this.player.isAlive) {
            if (this.player.level == 2) {
                this.walk = "walk2"
                this.idle = "idle2"
                this.jump = "jump2"
            } else if (this.player.level === 3) {
                this.walk = "walk3"
                this.idle = "idle3"
                this.jump = "jump3"
            }
            if (cursors.left.isDown && cursors.space.isUp) {
                this.player.body.setVelocityX(-200);
                this.player.anims.play(this.walk, true); // walk left
                this.player.flipX = true; // flip the sprite to the left
                this.player.direction = "left";
            } else if (cursors.right.isDown && cursors.space.isUp) {
                this.player.body.setVelocityX(200);
                this.player.anims.play(this.walk, true);
                this.player.flipX = false; // use the original sprite looking to the right
                this.player.direction = "right";
            } else if (cursors.left.isDown && cursors.space.isDown) {
                this.player.body.setVelocityX(-400);
                this.player.anims.play(this.walk, true);
                this.player.flipX = true; // use the original sprite looking to the right
                this.player.direction = "left";
            } else if (cursors.right.isDown && cursors.space.isDown) {
                this.player.body.setVelocityX(400);
                this.player.anims.play(this.walk, true);
                this.player.flipX = false; // use the original sprite looking to the right
                this.player.direction = "right";
            } else {
                this.player.body.setVelocityX(0);
                this.player.anims.play(this.idle, true);
            }
            // jump
            if (!this.player.body.onFloor() && !this.player.body.touching.down) {
                this.player.anims.play(this.jump, true); // Active when player not on the ground
            }
            if (cursors.up.isDown && (this.player.body.onFloor() || this.player.body.touching.down)) {
                this.player.body.setVelocityY(-630);
            }
        }
    }


    playerThrow(cursors) {
        if (!this.DOWN) {
            this.DOWN = this.main.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        }
        if (Phaser.Input.Keyboard.JustDown(this.DOWN)) {
            if (this.player.isAlive && this.player.level == 3 && this.player.fire.date + 200 < (Date.now())) {
                this.player.fire.date = Date.now()
                this.player.anims.play('throw', true);
                this.player.fireball = new Fire(this.main, this.groundLayer, this.player)
            }
        }
    }

    collideWithEnemy(main, enemy, death) {
        main.physics.add.overlap(this.player, enemy, function (player, enemy) {
            if (player.y + 15.5 < enemy.y && player.isAlive == true) {
                player.body.setVelocityY(-200);
                enemy.anims.play(death, true);
                enemy.setVelocity(0, 0);
                enemy.enemyAlive = false;
                if (death == 'gumbadeath') {
                    console.log('gumba');
                    setTimeout(() => {
                        enemy.destroy();
                    }, 250);
                }
                if (death == 'koopadeath') {
                    console.log('koopa');
                    enemy.KoopaShell = enemy.KoopaShell + 1;
                    //console.log(enemy.KoopaShell);
                    if (enemy.KoopaShell >= 3) {
                        enemy.setVelocity(-800, 0);
                        /* if (enemy.body.blocked.right) {
                            enemy.direction = 'left';
                            //console.log("blockedright");
                        }
                        if (enemy.body.blocked.left) {
                            enemy.direction = 'right';
                        }
                        if (enemy.direction === 'right') {
                            enemy.setVelocity(800, 0);
                        }
                        if (enemy.direction === 'left') {
                            enemy.setVelocity(800, 0);
                        } */
                    }
                }
            }
            if (player.y + 15.5 >= enemy.y && player.isAlive == true && player.isGhost === false) {
                player.enemyTouch = true;
                // console.log("touch");
            }
        });
    }


    



    playerDeath(player, main,enemy) {
        if (player.enemyTouch === true && player.isGhost == false && enemy.enemyAlive == true) {
            if (player.lifescore > 0) {
                player.lifescore -= 1;
                if (player.level == 1) {
                    player.setScale(0.7)
                }
                console.log(player.lifescore);
                player.enemyTouch = false // 
                player.level -= 1;
                _isGhost(player) // Frame d'invinsibilité
                // setTimeout(() => {
                //     isGhost(player)
                // }, 2000);
            } else {
                player.isAlive = false;
                player.body.setVelocityX(0);
                // player.body.setVelocityY(-50);
                player.anims.play('death', true);
                // main.cameras.main.fade(1000, 255, 255, 255);
                main.gameOver = true;
                main.gameOverText.visible = true;
                main.restartText.visible = true;
                main.physics.pause();
                // setTimeout(() => {
                //     main.scene.start('main');
                // }, 1500);
            }
        }
        if (player.y >= 780.64) {
            player.isAlive = false;
            player.body.setVelocityX(0);
            // player.body.setVelocityY(-50);
            player.anims.play('death', true);
            console.log("DEAD");
            // main.cameras.main.fade(1000, 255, 255, 255);
            main.gameOver = true;
            main.gameOverText.visible = true;
            main.restartText.visible = true;
            main.physics.pause();
        }
    }

    levelUp(main, bonus) {
        if (this.player.level == 1 && bonus.name == "mushroom") {
            _levelUp(this.player, main)
            this.player.level = 2;
            this.player.lifescore = 1;
        } else if (this.player.level >= 1 && bonus.name == "flower") {
            this.player.level = 3;
            this.player.lifescore = 2;
        }
        setTimeout(() => {
            this.player.body.setSize(player.width, player.height, true)
        }, 100)
    }


    

    restartScene(main) {
        main.scene.start('main');
    }
}