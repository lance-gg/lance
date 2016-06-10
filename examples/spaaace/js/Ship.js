var Ship = function(x,y){
    this.x = x;
    this.y = y;
    this.angle = 90;
    this.rotationSpeed = 3;
    this.acceleration = 0.1;
    this.deceleration = 0.999;
    this.maxSpeed = 2;
};

module.exports = Ship;