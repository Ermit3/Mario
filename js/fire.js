export default class Fire {
    constructor(main, groundLayer, player) {
        this.main = main
        this.fireball = main.physics.add.sprite(player.x, player.y * 0.99, 'fireball');
        this.fireball.setCollideWorldBounds(true);
        // Collider
        main.physics.add.collider(main.groundLayer, this.fireball);
        main.physics.add.collider(main.bricksLayer, this.fireball);
        main.physics.add.collider(main.boxLayer, this.fireball);
        this.collideWithEnemy();
        // Params
        this.fireball.bounce = 0;
        this.fireball.body.bounce.set(1.03);
        this.fireball.body.gravity.set(0, 0);
        // Action
        this.moveFire(player.direction)
    }

    // Direction boule de feu
    moveFire(direction) {
        if (direction == "left") {
            this.fireball.body.setVelocityX(-250);
            this.fireball.anims.play('fireball', true);
        } else if (direction = "right") {
            this.fireball.body.setVelocityX(250);
            this.fireball.anims.play('fireball', true);
        }
        setTimeout(() => {
            this.fireball.destroy()
            this.main.fireballsGroup.remove(this.fireball)
        }, 4000)
    }

    // Action quand boule de feu et enemy se touche
    collideWithEnemy() {
        for (const enemy of this.main.enemies) {
            this.main.physics.add.overlap(enemy.enemy, this.fireball, (_enemy, _fireball) => {
                if (_enemy.enemyAlive) {
                    _enemy.enemyAlive = false
                } else {
                    console.log('deja mort');
                }
            });
        }
    }
}