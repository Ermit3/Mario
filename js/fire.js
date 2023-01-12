export default class Fire {
    constructor(main, groundLayer, player) {
        this.fireball = main.physics.add.sprite(player.x, player.y * 0.99, 'fireball');
        this.fireball.setCollideWorldBounds(true);
        main.physics.add.collider(groundLayer, this.fireball);
        this.fireball.bounce = 0;
        this.fireball.body.bounce.set(1.03);
        this.fireball.body.gravity.set(0, 0);

        // console.log(this.fireball.body.bounce);

        this.moveFire(player.direction)
    }

    moveFire(direction) {
        if (direction == "left") {
            this.fireball.body.setVelocityX(-250);
            // this.fireball.body.setVelocityY(-(Math.cos(1) * 200));
            this.fireball.anims.play('fireball', true);
        } else if (direction = "right") {
            this.fireball.body.setVelocityX(250);
            this.fireball.anims.play('fireball', true);
        }
        setTimeout(() => {
            this.fireball.destroy()
        }, 4000)
    }
}