export default class Koopa {
    static koopa;

    constructor(main,groundlayer,x,y){
        this.koopa=main.physics.add.sprite(x,y,'koopa');
        this.koopa.koopaAlive = true;
        this.koopa.setCollideWorldBounds(true);
        main.physics.add.collider(groundlayer, this.koopa);
    }

    /* addCollider() {
        this.physics.add.collider(groundLayer, koopa);
    } */

    changeDirection() {
        if (this.koopa.koopaAlive == true) {

            this.koopa.setVelocity(100, 0);
            this.koopa.anims.play('right', true);
            if (this.koopa.body.blocked.right) {
                this.koopa.direction = 'left';
            }
            if (this.koopa.body.blocked.left) {
                this.koopa.direction = 'right';
            }
            if (this.koopa.direction === 'right') {
                this.koopa.setVelocity(100, 0);
                this.koopa.anims.play('right', true);
            }
            if (this.koopa.direction === 'left') {
                this.koopa.setVelocity(-100, 0);
                this.koopa.anims.play('left', true);
            }
        }
    }

}