var Ship = function(id, x,y){
    this.id = id; //instance id
    this.x = x;
    this.y = x;
    this.angle = 90;
    this.rotationSpeed = 3;
    this.acceleration = 0.1;
    this.deceleration = 0.999;
    this.maxSpeed = 2;

    this.class = Ship;
    // console.log(this.deserialize(this.serialize()));
};

Ship.properties = {
    id: 0, //class id
    name: "ship"
};

Ship.netScheme = {
    id: Uint8Array,
    x: Int16Array,
    y: Int16Array,
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
    var dataBuffer = new ArrayBuffer(Uint8Array.BYTES_PER_ELEMENT + Ship.getNetSchemeBufferSize());
    var dataView = new DataView(dataBuffer);

    //first set the size of the payload in bytes
    dataView.setUint8(0, Ship.properties.id);
    //advance the offset counter
    var dataByteOffset = Uint8Array.BYTES_PER_ELEMENT;

    for (var property in Ship.netScheme) {
        if (Ship.netScheme.hasOwnProperty(property)) {
            //create bytearrays of the required properties
            // console.log(property, dataBufferIndex);
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
    var dataBufferIndex = 0;
    var dataView = new DataView(dataBuffer);
    var data = {};

    for (var property in Ship.netScheme) {
        if (Ship.netScheme.hasOwnProperty(property)) {
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

    return data;
};

module.exports = Ship;