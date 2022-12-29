/* import Enemy from './enemy';

export default class Gumba extends Enemy {

    static gumba;

    constructor(main, groundLayer, x, y,tile){
        super(main, groundLayer, x, y,tile);
    }



} */


    /* constructor(main, groundLayer, x, y) {
        this.gumba = main.physics.add.sprite(x, y, 'gumba');
        this.gumba.enemyAlive = true;
        // main.load.atlas('gumba','./assets/spritegumba.png','assets/spritegumba.json');
        //gumba.setBounce(0.2);
        this.gumba.setCollideWorldBounds(true);
        main.physics.add.collider(groundLayer, this.gumba);
    }
 */
    

    /* changeDirection() {
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
    } */

    /* addCollider() {
        this.physics.add.collider(groundLayer, gumba);
    } */

    // collideWithPlayer(main, player, death) {

    //     main.physics.add.collider(player, this.gumba, function (player, gumba) {

    //         if (player.y + 15.5 < gumba.y) {
    //             // console.log("Mario win");
    //             gumba.anims.play('gumbadeath', true);
    //             gumba.setVelocity(0, 0);
    //             gumba.gumbaAlive = false;
    //             setTimeout(() => {
    //                 console.log("destroy");
    //                 gumba.destroy();
    //             }, 250);
    //         }
    //         if (player.y + 15.5 >= gumba.y && player.isAlive == true && player.isGhost === false) {
    //             // if (player.lifescore > 0) {
    //             //     player.lifescore = player.lifescore - 1;
    //             //     console.log(player.lifescore);
    //             // } else {
    //             //     player.isAlive = false;
    //             //     console.log(player.lifescore);
    //             // }
    //             // player.isGhost = true;
    //             // console.log("Mario lose 1");
    //             // setTimeout(() => {
    //             //     console.log("TIMER");
    //             //     player.isGhost = false
    //             // }, 5000);
    //             player.enemyTouch = true;
    //             console.log("touch");
    //         }
    //     });
    // }

