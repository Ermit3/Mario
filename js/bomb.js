export default class Bomb{

    constructor(main,groundLayer,bombplat){
        this.bomb = main.physics.add.sprite(bombplat.x,bombplat.y, 'bomb');
        this.bomb.setCollideWorldBounds(true);
        main.physics.add.collider(groundLayer, this.bomb);
        this.moveBomb();
        this.main = main;
        this.groundLayer=groundLayer;
        this.bombplat=bombplat;
        console.log(main);
    }

    moveBomb(){
        if(player.y >= 400){
            this.bomb.body.setVelocityX(-100);
            this.bomb.anims.play('bombleft', true);
        }
        if(player.y<400){
            this.bomb.body.setVelocityX(100);
            this.bomb.anims.play('bombright', true);
        }
        setTimeout(() => {
            this.bomb.destroy()
        }, 2000)
    }


}