const Point= require('./Point');

var Ship = function(id, x,y){
    this.id = id; //instance id
    this.x = x;
    this.y = y;
    this.velX = 0;
    this.velY = 0;
    this.angle = 90;
    this.rotationSpeed = 3;
    this.acceleration = 0.1;
    this.deceleration = 0.99;
    this.maxSpeed = 2;

    //todo deal with what goes over the wire
    this.velocity = new Point();
    this.temp={
        accelerationVector: new Point()
    };

    this.class = Ship;
};

Ship.properties = {
    id: 0, //class id
    name: "ship"
};

Ship.netScheme = {
    id: Uint8Array,
    x: Int16Array,
    y: Int16Array,
    velX: Float32Array,
    velY: Float32Array,
    angle: Int16Array
};

Ship.getNetSchemeBufferSize = function(){
    
    if (typeof Ship.netSchemeBufferSize=="undefined"){
        Ship.netSchemeBufferSize = Uint8Array.BYTES_PER_ELEMENT; //every scheme starts with the class id

        for (var property in Ship.netScheme) {
            if (Ship.netScheme.hasOwnProperty(property)) {
                //count the bytesize required for the netScheme buffer
                Ship.netSchemeBufferSize += Ship.netScheme[property].BYTES_PER_ELEMENT
            }
        }
    }

    return Ship.netSchemeBufferSize;
};

Ship.prototype.serialize = function(){
    //todo define behaviour when a netScheme is undefined
    if (typeof Ship.netScheme == "undefined"){
        console.warn("no netScheme defined! This will result in awful performance");
    }

    //buffer has one Uint8Array for class id, then payload
    var dataBuffer = new ArrayBuffer(Ship.getNetSchemeBufferSize());
    var dataView = new DataView(dataBuffer);

    //first set the id of the class, so that the deserializer can fetch information about it
    dataView.setUint8(0, Ship.properties.id);
    //advance the offset counter
    var dataByteOffset = Uint8Array.BYTES_PER_ELEMENT;

    for (var property in Ship.netScheme) {
        if (Ship.netScheme.hasOwnProperty(property)) {

            //create bytearrays of the required properties
            // console.log(property, dataBufferIndex);
            if (Ship.netScheme[property]==Float32Array){
                dataView.setFloat32(dataByteOffset, this[property]);
            }
            if (Ship.netScheme[property]==Int16Array){
                dataView.setInt16(dataByteOffset, this[property]);
            }
            else if (Ship.netScheme[property]==Int8Array){
                dataView.setInt8(dataByteOffset, this[property]);
            }
            else if (Ship.netScheme[property]==Uint8Array){
                dataView.setUint8(dataByteOffset, this[property]);
            }

            dataByteOffset += Ship.netScheme[property].BYTES_PER_ELEMENT;
        }
    }

    return dataBuffer;
};

Ship.deserialize = function(dataBuffer){
    var dataBufferIndex = Uint8Array.BYTES_PER_ELEMENT;
    var dataView = new DataView(dataBuffer);
    var data = {};

    for (var property in Ship.netScheme) {
        if (Ship.netScheme.hasOwnProperty(property)) {

            //TODO refactor this ugly if clause
            //TODO type checking and warnings
            if (Ship.netScheme[property]==Float32Array){
                data[property] = dataView.getFloat32(dataBufferIndex);
            }
            if (Ship.netScheme[property]==Int16Array){
                data[property] = dataView.getInt16(dataBufferIndex);
            }
            else if (Ship.netScheme[property]==Int8Array){
                data[property] = dataView.getInt8(dataBufferIndex);
            }
            else if (Ship.netScheme[property]==Uint8Array){
                data[property] = dataView.getUint8(dataBufferIndex);
            }

            dataBufferIndex += Ship.netScheme[property].BYTES_PER_ELEMENT;
        }
    }

    var ship = new Ship(data.id, data.x, data.y);
    ship.angle = data.angle;
    ship.velX = data.velX;
    ship.velY = data.velY;
    ship.velocity.set(data.velX, data.velY);

    return ship;
};

Ship.prototype.step = function(worldSettings){
    if (this.isRotatingRight){ this.angle += this.rotationSpeed; }
    if (this.isRotatingLeft){this.angle -= this.rotationSpeed; }

    if(this.angle>360){ this.angle -= 360; }
    if(this.angle<0){ this.angle += 360; }

    if (this.isAccelerating) {
        this.temp.accelerationVector.set(
            Math.cos( this.angle * (Math.PI / 180) ),
            Math.sin( this.angle * (Math.PI / 180) )
        ).setMagnitude(this.acceleration);
    }
    else{
        this.temp.accelerationVector.set(0,0);
    }

    // console.log(this.temp.accelerationVector.x,this.temp.accelerationVector.y);
    // console.log(this.temp.accelerationVector.x, this.temp.accelerationVector.y);
    // console.log(this.temp.accelerationVector.x, this.temp.accelerationVector.y);
    Point.add(this.velocity,this.temp.accelerationVector, this.velocity);
    this.velocity.multiply(this.deceleration, this.deceleration);
    this.velocity.x = Math.round(this.velocity.x * 100)/100;
    this.velocity.y = Math.round(this.velocity.y * 100)/100;

    this.velX = this.velocity.x;
    this.velY = this.velocity.y;

    this.isAccelerating = false;
    this.isRotatingLeft = false;
    this.isRotatingRight = false;
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;

    if (this.x>=worldSettings.width){ this.x = worldSettings.width - this.x;}
    else if (this.y>=worldSettings.height){ this.y = worldSettings.height - this.y;}
    else if (this.x < 0){ this.x = worldSettings.width + this.x;}
    else if (this.y<0){ this.y = worldSettings.width + this.y;}
};


module.exports = Ship;