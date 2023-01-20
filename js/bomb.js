export default class Bomb{

    constructor(main,groundLayer,bombplat){
        this.bomb = main.physics.add.sprite(bombplat.x,bombplat.y, 'bomb');
        this.bomb.setCollideWorldBounds(true);
        main.physics.add.collider(groundLayer, this.bomb);
        this.bomb.body.allowGravity = false;
        this.moveBomb();
        this.main = main;
        this.groundLayer=groundLayer;
        this.bombplat=bombplat;
        
   
    }

    moveBomb(){
        if(player.x < 650){
            this.bomb.body.setVelocityX(-300);
            this.bomb.anims.play('bombleft', true);
        }
        if(player.x>=650){
            this.bomb.body.setVelocityX(300);
            this.bomb.anims.play('bombright', true);
        }
        setTimeout(() => {
            this.bomb.destroy()
        }, 10000) 
    }


}