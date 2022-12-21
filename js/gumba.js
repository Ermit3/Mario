

export default class Gumba{
    // gumbaAlive = true;
    createObject(main,name,groundLayer,x,y){
        this.gumbaAlive = true;
        this.gumba = main.physics.add.sprite(x,y,'gumba');
        this.gumba.isAlive = true;
        this.gumba.name = name;
        this.gumba.setScale(0.8)
        // main.load.atlas('gumba','./assets/spritegumba.png','assets/spritegumba.json');
        //gumba.setBounce(0.2);
        this.gumba.setCollideWorldBounds(true);
        main.physics.add.collider(groundLayer, this.gumba);
        console.log("test");
        // console.log(this.gumba);
    }

    changeDirection(){
        // console.log(this)
        // console.log(this.gumba.isAlive)
        // console.log(this.gumbaAlive)
        // console.log(this.gumba.isAlive)



        if(this.gumba.isAlive == true){
            // console.log(gumba)

            this.gumba.setVelocity(100,0);
            if(this.gumba.body.blocked.right){
                this.gumba.direction='left';
            }
            if(this.gumba.body.blocked.left){
                this.gumba.direction='right';
            }
            if(this.gumba.direction === 'right'){
                this.gumba.setVelocity(100,0);
            }
            if(this.gumba.direction === 'left'){
                this.gumba.setVelocity(-100,0);
            }
        }
    }
    
    addCollider(){
        this.physics.add.collider(groundLayer, gumba);
    }

    collideWithPlayer(main,player,gumbaName,death){
        // console.log(this)
        // console.log(this.gumba)
        // console.log(death)
        // console.log(lifescore)
      

        main.physics.add.collider(player,this.gumba, function (player,gumba){


            if(player.y +15.5*player.level < gumba.y && gumba.isAlive == true){

                gumba.anims.play('gumbadeath',true);
                gumba.setVelocity(0,0);

                gumba.isAlive = false;
                console.log('test')
                console.log(gumba)
                setTimeout(() => {
                    gumba.destroy();
                    // gumba.visible=false; 
                    console.log(gumba)
                }, 250);  
            }
            if(player.y + 15.5 >= gumba.y  && death == false ){
                death = true;
                console.log(player.lifescore);    
                player.lifescore = player.lifescore -1 ;
                console.log(player.lifescore);  
                // lifecount.setText(lifescore);
                console.log("Mario lose 1");    
                setTimeout(() => {   
                    main.death =false ;
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