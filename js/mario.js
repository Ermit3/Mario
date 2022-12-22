function isGhost(player) {
    player.alpha = player.alpha == 1 ? 0.2 : 1;
    player.isGhost = player.isGhost == false ? true : false;

    // for (var i = 0; i <= 10; i++) {
    //     i % 2 == 0 ? setTimeout(() => { player.alpha = 1; i == 10 ? player.isGhost = false : console.log("k"); }, i * 100) : setTimeout(() => { player.alpha = 0.1 }, i * 100);
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
        this.player.lifescore = 1;
        this.player.isGhost = false;
        this.player.depth = 1; // z-index du texte
        this.player.level = 1; //
        (this.player.level == 1) ? this.player.setScale(1.1) : this.player.setScale(1.6)
    }

    playerMove(player, cursors, main) {
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
            if (!player.body.onFloor()) {
                player.anims.play('jump', true); // Active when player not on the ground
            }
            if (cursors.up.isDown && player.body.onFloor()) {
                player.body.setVelocityY(-400);
            }
            // Debug cursor
            if (cursors.down.isDown && player.body.onFloor()) {
                console.log("Lifecount " + player.lifescore);
                console.log("Alive " + player.isAlive);
                console.log("Ghost " + player.isGhost);
                console.log(main);
            }
        }
    }

    collideWithEnemy(main, enemy) {
        main.physics.add.overlap(this.player, enemy, function (player, enemy) {
            if (player.y + 15.5 < enemy.y && player.isAlive == true) {
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

    playerDeath(player, main) {
        if (player.enemyTouch === true) {
            if (player.lifescore > 0) {
                player.lifescore = player.lifescore - 1;
                console.log(player.lifescore);
                player.enemyTouch = false // 
                isGhost(player) // Frame d'invinsibilité
                setTimeout(() => {
                    isGhost(player)
                }, 2000);
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

    restartScene(main) {
        main.scene.start('main');
    }
}