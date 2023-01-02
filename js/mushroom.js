import Bonus from './bonus';

export default class Mushroom extends Bonus {

    constructor(main, groundLayer, x, y) {
        super(main, groundLayer, x, y, 'mushroom');
    }

    changeDirection() {
        this.bonus.setVelocity(50, 0);
        if (this.bonus.body.blocked.right) {
            this.bonus.direction = 'left';
        }
        if (this.bonus.body.blocked.left) {
            this.bonus.direction = 'right';
        }
        if (this.bonus.direction === 'right') {
            this.bonus.setVelocity(50, 0);
        }
        if (this.bonus.direction === 'left') {
            this.bonus.setVelocity(-50, 0);
        }
    }
}