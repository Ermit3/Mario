export default class Enemy{

    static enemy;
    //this.enemy.EnemyAlive = true;

    changeDirection() {
        if (this.enemy.gumbaAlive == true) {

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

    CollideWithPlayer(main, player, death){
        main.physics.add.collider(player, this.enemy,funtion(player,enemy){});
    }

}