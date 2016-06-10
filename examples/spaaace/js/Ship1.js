var Ship = function(x,y){
    this.x = x;
    this.y = y;
    this.velocity = 0;
    this.rotation = 0;
    this.acceleration = 0.2;
    this.deceleration = 0.05;
    this.maxSpeed = 2;
};

module.exports = Ship;