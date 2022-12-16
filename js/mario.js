function isGhost(player) {
    player.alpha = player.alpha == 1 ? 0.2 : 1;
    player.isGhost = player.isGhost == false ? true : false;

    // for (var i = 0; i < 10; i++) {
    //     i % 2 == 0 ? setTimeout(() => { this.Ghost(1) }, this.blueGhostTimer + i * 100) : setTimeout(() => { this.Ghost(0) }, this.blueGhostTimer + i * 100);
    // }
}

export default class Mario {
    player;

    constructor(main, groundLayer, x, y) {
        this.player = main.physics.add.sprite(x, y, 'player');
        this.player.isAlive = true;
        this.player.setCollideWorldBounds(true);
        main.physics.add.collider(groundLayer, this.player);
        this.player.isAlive = true;
        this.player.lifescore = 3;
        this.player.isGhost = false;
    }

    playerMove(player, cursors) {
        if (player.isAlive) {
            if (cursors.left.isDown) {
                player.body.setVelocityX(-200);
                player.anims.play('walk', true); // walk left
                player.flipX = true; // flip the sprite to the left
            }
            else if (cursors.right.isDown) {
                player.body.setVelocityX(200);
                player.anims.play('walk', true);
                player.flipX = false; // use the original sprite looking to the right
            } else {
                player.body.setVelocityX(0);
                player.anims.play('idle', true);
            }
            // jump 
            if (cursors.up.isDown && player.body.onFloor()) {
                player.body.setVelocityY(-400);
                console.log(player.lifescore);
                console.log(player.isAlive);
            }
        }
    }

    collideWithEnemy(main, enemy) {
        main.physics.add.overlap(this.player, enemy, function (player, enemy) {
            if (player.y + 15.5 < enemy.y) {
                player.body.setVelocityY(-200);
                enemy.anims.play('gumbadeath', true);
                enemy.setVelocity(0, 0);
                enemy.gumbaAlive = false;
                setTimeout(() => {
                    console.log("destroy");
                    gumba.destroy();
                }, 250);
            }
            if (player.y + 15.5 >= enemy.y && player.isAlive == true && player.isGhost === false) {
                player.enemyTouch = true;
                console.log("touch");
            }
        });
    }

    playerDeath(player) {
        if (player.enemyTouch === true) {
            if (player.lifescore > 0) {
                player.lifescore = player.lifescore - 1;
                console.log(player.lifescore);
                player.enemyTouch = false
                isGhost(player)
                setTimeout(() => {
                    isGhost(player)
                }, 2000);
            } else {
                player.isAlive = false;
                console.log("DEAD");
                setTimeout(() => {
                    player.destroy();
                }, 1000);
            }
        }
    }
}


// function MarioMove(player, cursors) {
//     if (player.isAlive) {
//         if (cursors.left.isDown) {
//             player.body.setVelocityX(-200);
//             player.anims.play('walk', true); // walk left
//             player.flipX = true; // flip the sprite to the left
//         }
//         else if (cursors.right.isDown) {
//             player.body.setVelocityX(200);
//             player.anims.play('walk', true);
//             player.flipX = false; // use the original sprite looking to the right
//         } else {
//             player.body.setVelocityX(0);
//             player.anims.play('idle', true);
//         }
//         // jump
//         if (cursors.up.isDown && player.body.onFloor()) {
//             player.body.setVelocityY(-400);
//             console.log(player.lifescore);
//             console.log(player.isAlive);
//         }
//     }
// }

// function isGhost(player) {
//     player.alpha = player.alpha == 1 ? 0.2 : 1;
//     player.isGhost = player.isGhost == false ? true : false;

//     // for (var i = 0; i < 10; i++) {
//     //     i % 2 == 0 ? setTimeout(() => { this.Ghost(1) }, this.blueGhostTimer + i * 100) : setTimeout(() => { this.Ghost(0) }, this.blueGhostTimer + i * 100);
//     // }
// }

// function MarioDeath(player) {
//     if (player.enemyTouch === true) {
//         if (player.lifescore > 0) {
//             player.lifescore = player.lifescore - 1;
//             console.log(player.lifescore);
//             player.enemyTouch = false
//             isGhost(player)
//             setTimeout(() => {
//                 isGhost(player)
//             }, 2000);
//         } else {
//             player.isAlive = false;
//             console.log("DEAD");
//             player.destroy();
//         }
//     }
// }

// export { MarioMove, MarioDeath }