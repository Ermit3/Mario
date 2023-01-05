function transformation(type, player, main) {
    let count = 0;
    for (var i = 0; i <= 10; i++) {
        if (i % 2 == 0) {
            var transformation1 = setTimeout(() => {
                if (type == "levelUP") {
                    player.setScale(1);
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

    constructor(main, groundLayer, x, y) {
        this.player = main.physics.add.sprite(x, y, 'player');
        this.player.setCollideWorldBounds(true);
        main.physics.add.collider(groundLayer, this.player);
        this.player.depth = 1; // z-index du texte
        this.player.level = 1; //
        this.player.lifescore = 0;
        this.player.isAlive = true;
        this.player.isGhost = false;
        (this.player.level == 1) ? this.player.setScale(0.7) : this.player.setScale(0.9)
    }

    playerMove(player, cursors) {
        if (player.isAlive) {
            if (cursors.left.isDown && cursors.space.isUp) {
                player.body.setVelocityX(-200);
                player.anims.play('walk', true); // walk left
                player.flipX = true; // flip the sprite to the left
            }
            else if (cursors.right.isDown && cursors.space.isUp) {
                player.body.setVelocityX(200);
                player.anims.play('walk', true);
                player.flipX = false; // use the original sprite looking to the right
            } else if (cursors.left.isDown && cursors.space.isDown) {
                player.body.setVelocityX(-400);
                player.anims.play('walk', true);
                player.flipX = true; // use the original sprite looking to the right
            } else if (cursors.right.isDown && cursors.space.isDown) {
                player.body.setVelocityX(400);
                player.anims.play('walk', true);
                player.flipX = false; // use the original sprite looking to the right
            } else {
                player.body.setVelocityX(0);
                player.anims.play('idle', true);
            }
            // jump
            if (!player.body.onFloor()) {
                player.anims.play('jump', true); // Active when player not on the ground
            }
            if (cursors.up.isDown && player.body.onFloor()) {
                player.body.setVelocityY(-500);
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
                console.log("touch");
            }
        });
    }

    PlayerBomb(main, enemy){
        main.physics.add.collider(this.player, enemy, function (player,enemy) {
            console.log('bomba');
        })
    }

    playerDeath(player, main,enemy) {
        if (player.enemyTouch === true && player.isGhost == false && enemy.enemyAlive == true) {
            if (player.lifescore > 0) {
                player.lifescore -= 1;
                player.setScale(0.7)
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
                console.log("DEAD");
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
    }

    restartScene(main) {
        main.scene.start('main');
    }
}