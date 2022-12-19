
export default class Koopa extends Enemy{
    static koopa;

    constructor(main,groundlayer){
        this.koopa=main.physics.add.sprite(x,y,'koopa');
        this.koopa.koopAlive = true;
        this.koopa.setCollideWorldBounds(true);
        main.physics.add.collider(groundLayer, this.koopa);
    }


}