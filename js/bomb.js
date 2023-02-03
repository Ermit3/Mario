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
        this.player = main.player;
        this.player.myscene = main;
        console.log(main.player);
        this.collideMario();
    }

    collideMario(){
        //console.log(this.player);
        this.main.physics.add.overlap(this.bomb, this.player, function (_bomb,_player){
            //console.log(_player);
            _player.isAlive = false;
            _player.body.setVelocityX(0);
            _player.anims.play('death', true);
            _player.myscene.gameOver = true;
            _player.myscene.gameOverText.visible = true;
            _player.myscene.restartText.visible = true;
            _player.myscene.physics.pause();
            console.log('ici');    
        }
        )
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