var Ship = function(x,y){
    this.id = 0;
    this.x = x;
    this.y = x;
    this.angle = 90;
    this.rotationSpeed = 3;
    this.acceleration = 0.1;
    this.deceleration = 0.999;
    this.maxSpeed = 2;

    // console.log(this.deserialize(this.serialize()));
};

Ship.prototype.netScheme = {
    x: Int16Array,
    y: Int16Array,
    angle: Int16Array
};

Ship.prototype.getNetSchemeBufferSize = function(){

    if (typeof Ship.prototype.netSchemeBufferSize=="undefined"){
        Ship.prototype.netSchemeBufferSize = 0;

        for (var property in this.netScheme) {
            if (this.netScheme.hasOwnProperty(property)) {
                //count the bytesize required for the netScheme buffer
                Ship.prototype.netSchemeBufferSize += Ship.prototype.netScheme[property].BYTES_PER_ELEMENT
            }
        }
    }

    return this.netSchemeBufferSize;
};

Ship.prototype.serialize = function(){
    //todo define behaviour when a netScheme is undefined
    if (typeof this.netScheme == "undefined"){
        console.warn("no netScheme defined! This will result in awful performance");
    }

    var dataBuffer = new ArrayBuffer(this.getNetSchemeBufferSize());
    var dataView = new DataView(dataBuffer);
    var dataBufferIndex = 0;

    for (var property in this.netScheme) {
        if (this.netScheme.hasOwnProperty(property)) {
            //create bytearrays of the required properties
            // console.log(property, dataBufferIndex);
            if (this.netScheme[property]==Int16Array){
                dataView.setInt16(dataBufferIndex, this[property]);
            }
            else if (this.netScheme[property]==Int8Array){
                dataView.setInt8(dataBufferIndex, this[property]);
            }
            dataBufferIndex += this.netScheme[property].BYTES_PER_ELEMENT;
        }
    }

    return dataBuffer;
};

Ship.prototype.deserialize = function(dataBuffer){
    var dataBufferIndex = 0;
    var dataView = new DataView(dataBuffer);
    var data = {};

    for (var property in this.netScheme) {
        if (this.netScheme.hasOwnProperty(property)) {
            if (this.netScheme[property]==Int16Array){
                data[property] = dataView.getInt16(dataBufferIndex);
            }
            else if (this.netScheme[property]==Int8Array){
                data[property] = dataView.getInt8(dataBufferIndex);
            }

            dataBufferIndex += this.netScheme[property].BYTES_PER_ELEMENT;
        }
    }

    return data;
};

module.exports = Ship;