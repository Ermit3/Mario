export default class Bomb{

    constructor(main,groundLayer,x,y){
        this.bomb = main.physics.add.sprite(400, 675, 'bomb');
        this.bomb.setCollideWorldBounds(true);
        main.physics.add.collider(groundLayer, this.bomb);
        this.moveBomb();
    }

    moveBomb(){
        if(player.y >= 400){
            this.bomb.body.setVelocityX(-100);
            this.bomb.anims.play('bombleft', true);
        }
        else{
            this.bomb.body.setVelocityX(100);
            this.bomb.anims.play('bombright', true);
        }
        setTimeout(() => {
            this.bomb.destroy()
        }, 1000)
    }

}