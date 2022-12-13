

export default class Gumba{
    //gumbaAlive = true;
    createObject(){
        this.load.atlas('gumba','assets/spritegumba.png','assets/spritegumba.json');
        var gumba = this.physics.add.sprite(10,10,'gumba');
        console.log("test");
        console.log(gumba);
    }

    changeDirection(){
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
    
    addCollider(){
        this.physics.add.collider(groundLayer, gumba);
    }

    collideWithPlayer(){
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
    
    //console.log(gumba);

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