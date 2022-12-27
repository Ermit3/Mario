export default class Enemy{

    static enemy;

    constructor(main, groundLayer, x, y,tile) {
        this.enemy = main.physics.add.sprite(x, y, tile);
        this.enemy.enemyAlive = true;
        this.enemy.setCollideWorldBounds(true);
        main.physics.add.collider(groundLayer, this.enemy);
    }


    changeDirection(enemy) {
        if (enemy.enemyAlive == true) {

            enemy.setVelocity(100, 0);
            if (enemy.body.blocked.right) {
                enemy.direction = 'left';
            }
            if (enemy.body.blocked.left) {
                enemy.direction = 'right';
            }
            if (enemy.direction === 'right') {
                enemy.setVelocity(100, 0);
            }
            if (enemy.direction === 'left') {
                enemy.setVelocity(-100, 0);
            }
        }
    }
}