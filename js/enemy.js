export default class Enemy{

    static enemy;

    constructor(main, groundLayer, x, y,tile) {
        this.enemy = main.physics.add.sprite(x, y, tile);
        this.enemy.enemyAlive = true;
        this.enemy.KoopaShell=0;
        this.KoopaMario = false;
        this.enemy.setCollideWorldBounds(true);
        main.physics.add.collider(groundLayer, this.enemy);
    }


    /* ShellMovement(){
        if (this.enemy.enemyAlive == false && this.KoopaMario == false){
        this. enemy.setVelocity(100, 0);
            if (this. enemy.body.blocked.right) {
                this. enemy.direction = 'left';
            }
            if (this. enemy.body.blocked.left) {
                this. enemy.direction = 'right';
            }
            if (this. enemy.direction === 'right') {
                this. enemy.setVelocity(100, 0);
            }
            if (this. enemy.direction === 'left') {
                this. enemy.setVelocity(-100, 0);
            }
        }
    } */

    changeDirection() {
        
        if (this.enemy.enemyAlive == true) {
            
            this.enemy.setVelocity(100, 0);
            if (this.enemy.body.blocked.right) {
                this.enemy.direction = 'left';
            }
            if (this.enemy.body.blocked.left) {
                this.enemy.direction = 'right';
            }
            if (this.enemy.direction === 'right') {
                this.enemy.setVelocity(100, 0);
            }
            if (this.enemy.direction === 'left') {
                this.enemy.setVelocity(-100, 0);
            }
        }
    }

    changeDirectionKoopa() {
        
        if (this.enemy.enemyAlive == true) {
            this.enemy.setVelocity(100, 0);
            if (this.enemy.body.blocked.right) {
                this.enemy.direction = 'left';
            }
            if (this.enemy.body.blocked.left) {
                this.enemy.direction = 'right';
            }
            if (this.enemy.direction === 'right') {
                this.enemy.setVelocity(100, 0);
                this.enemy.anims.play('right', true);
            }
            if (this.enemy.direction === 'left') {
                this.enemy.setVelocity(-100, 0);
                this.enemy.anims.play('left', true);
            }
        }
    }
}