
/**
 * The BaseTypes class defines the base types used in Lance.
 * These are the types which can be used to define an object's netscheme attributes,
 * which can be serialized by lance.
 * @example
 *     netScheme() {
 *       return {
 *             strength: { type: BaseTypes.TYPES.FLOAT32 },
 *             shield: { type: BaseTypes.TYPES.INT8 },
 *             name: { type: BaseTypes.String },
 *             backpack: { type: BaseTypes.ClassInstance },
 *             coins: {
 *                 type: BaseTypes.List,
 *                 itemType: BaseTypes.TYPES.UINT8
 *             }
 *         };
 *     }
 */
enum BaseTypes {
    Float32 = 'FLOAT32',
    Int32 = 'INT32',
    Int16 = 'INT16',
    Int8 = 'INT8',
    UInt8 = 'UINT8',
    String = 'STRING',
    ClassInstance = 'CLASSINSTANCE',
    List = 'List'
}


    // static TYPES: 'FLOAT32' | 'INT32' | 'INT16' | 'INT8' | 'UINT8' | 'STRING' | 'CLASSINSTANCE' | 'LIST';


/**
 * @type {object}
 * @property {string} FLOAT32 Seriablizable float
 * @property {string} INT32 Seriablizable 32-bit integer
 * @property {string} INT16 Seriablizable 16-bit integer
 * @property {string} INT8 Seriablizable 8-bit integer
 * @property {string} UINT8 Seriablizable unsigned 8-bit integer
 * @property {string} STRING Seriablizable string
 * @property {string} CLASSINSTANCE Seriablizable class. Make sure you register all the classes included in this way.
 * @property {string} LIST Seriablizable list.  In the netScheme definition, if an attribute is defined as a list, the itemType should also be defined.
 */


export default BaseTypes;
