export default class Bonus {

    constructor(main, groundLayer, x, y, name) {
        this.bonus = main.physics.add.sprite(x, y, name);
        main.physics.add.collider(groundLayer, this.bonus);
        main.physics.add.collider(main.bricksLayer, this.bonus);
        main.physics.add.collider(main.boxLayer, this.bonus);
        this.bonus.setCollideWorldBounds(true);
        this.bonus.name = name;
        this.bonus.destroyed = false;
        if (name == "flower") {
            this.bonus.body.allowGravity = false;
            this.bonus.body.immovable = true;
        }
    }
}