
import Bomb from './Bomb';

export default class BombPlat{
    bomba = Date.now();
    constructor(main,groundLayer, x,y){
        //console.log('ici');
        //this.player = player;
        this.bombplat = main.physics.add.sprite(x,y, 'bombplat');
        // 400, 675
        this.bombplat.setCollideWorldBounds(true);
        main.physics.add.collider(main.groundLayer, this.bombplat);
        this.main = main;
        this.groundLayer= groundLayer;
        this.bombplat.bomba = {
            available: true,
            date: Date.now()
        }
    }


    /* playerThrow(cursors) {
        if (!this.DOWN) {
            this.DOWN = this.main.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        }
        if (Phaser.Input.Keyboard.JustDown(this.DOWN)) {
            if (this.player.isAlive && this.player.level == 3 && this.player.fire.date + 200 < (Date.now())) {
                this.player.fire.date = Date.now()
                this.player.anims.play('throw', true);
                this.player.fireball = new Fire(this.main, this.groundLayer, this.player)
            }
        }
    } */
    
     LaunchBomb(){
        if (this.bombplat.bomba.date + 5000 < (Date.now())) {
            this.bombplat.bomba.date = Date.now()
            this.bombplat.bomb = new Bomb(this.main, this.groundLayer,this.bombplat);
        }        
    } 
}