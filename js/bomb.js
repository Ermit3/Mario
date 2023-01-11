import Enemy from './enemy'

export default class Bomb extends Enemy{
    constructor(main, groundLayer,x,y){
        super(main, groundLayer,x,y, 'bomb');
        
    }
}