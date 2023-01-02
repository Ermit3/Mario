export default class Bonus {

    constructor(main, groundLayer, x, y, name) {
        this.bonus = main.physics.add.sprite(x, y, name);
        main.physics.add.collider(groundLayer, this.bonus);
        this.bonus.setCollideWorldBounds(true);
    }
}