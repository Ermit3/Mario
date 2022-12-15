

export default class Gumba {

    static gumba;

    constructor(main, groundLayer, x, y) {
        this.gumba = main.physics.add.sprite(x, y, 'gumba');
        this.gumba.gumbaAlive = true;
        // main.load.atlas('gumba','./assets/spritegumba.png','assets/spritegumba.json');
        //gumba.setBounce(0.2);
        this.gumba.setCollideWorldBounds(true);
        main.physics.add.collider(groundLayer, this.gumba);
    }

    changeDirection() {
        if (this.gumba.gumbaAlive == true) {

            this.gumba.setVelocity(100, 0);
            if (this.gumba.body.blocked.right) {
                this.gumba.direction = 'left';
            }
            if (this.gumba.body.blocked.left) {
                this.gumba.direction = 'right';
            }
            if (this.gumba.direction === 'right') {
                this.gumba.setVelocity(100, 0);
            }
            if (this.gumba.direction === 'left') {
                this.gumba.setVelocity(-100, 0);
            }
        }
    }

    addCollider() {
        this.physics.add.collider(groundLayer, gumba);
    }

    collideWithPlayer(main, player, death) {

        main.physics.add.collider(player, this.gumba, function (player, gumba) {

            if (player.y + 15.5 < gumba.y) {
                // console.log("Mario win");
                gumba.anims.play('gumbadeath', true);
                gumba.setVelocity(0, 0);
                gumba.gumbaAlive = false;
                setTimeout(() => {
                    console.log("OK");
                    gumba.destroy();
                }, 250);
            }
            if (player.y + 15.5 >= gumba.y && death == false) {
                death = true;
                // lifescore = lifescore -1 ;
                // lifecount.setText(lifescore);
                console.log("Mario lose 1");
                setTimeout(() => {
                    console.log("Mario lose");
                    main.death = false;
                }, 5000);

            }
        });
    }

}










/*function createObject(){
    this.load.atlas('gumba','assets/spritegumba.png','assets/spritegumba.json');
    gumba = this.physics.add.sprite(150,500,'gumba');
}

function changeDirection(gumba){

    if(gumbaAlive == true){
        gumba.setVelocity(100,0);
        if(gumba.body.blocked.right){
            gumba.direction='left';
        }
        if(gumba.body.blocked.left){
            gumba.direction='right';
        }
        if(gumba.direction === 'right'){
            gumba.setVelocity(100,0);
        }
        if(gumba.direction === 'left'){
            gumba.setVelocity(-100,0);
        }
    }
}

function addCollider(){
    this.physics.add.collider(groundLayer, gumba);
}

function collideWithPlayer(gumba, player){
    this.physics.add.collider(player,gumba, function (player,gumba){
        if(player.y +15.5 < gumba.y){
            console.log("Mario win");
            gumba.anims.play('gumbadeath',true);
            gumba.setVelocity(0,0);
            gumbaAlive = false;
            setTimeout(() => {
                gumba.destroy();
            }, 1000);      
        }
        if(player.y + 15.5 >= gumba.y  && death == false ){
            death = true;
            lifescore = lifescore -1 ;
            lifecount.setText(lifescore);
            setTimeout(() => {
                console.log("Mario lose");        
                death =false ;
            }, 5000);
                      
        }
    });

}
///////////////////////////
//coordonnée liste*/