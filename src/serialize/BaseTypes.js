
/**
 * The BaseTypes class defines the base types used in Lance.
 * These are the types which can be used to define an object's netscheme attributes,
 * which can be serialized by lance.
 * @example
 *     static get netScheme() {
 *       return {
 *             strength: { type: BaseTypes.TYPES.FLOAT32 },
 *             shield: { type: BaseTypes.TYPES.INT8 },
 *             name: { type: BaseTypes.TYPES.STRING },
 *             backpack: { type: BaseTypes.TYPES.CLASSINSTANCE },
 *             coins: {
 *                 type: BaseTypes.TYPES.LIST,
 *                 itemType: BaseTypes.TYPES.UINT8
 *             }
 *         };
 *     }
 */
class BaseTypes {}

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
BaseTypes.TYPES = {

  /**
   * Seriablizable float
   * @alias TYPES.FLOAT32
   * @memberof! BaseTypes#
   */
    FLOAT32: 'FLOAT32',

    /**
     * Seriablizable 32-bit int
     * @alias TYPES.INT32
     * @memberof! BaseTypes#
     */
    INT32: 'INT32',

    /**
     * Seriablizable 16-bit int
     * @alias TYPES.INT16
     * @memberof! BaseTypes#
     */
    INT16: 'INT16',

    /**
     * Seriablizable 8-bit int
     * @alias TYPES.INT8
     * @memberof! BaseTypes#
     */
    INT8: 'INT8',

    /**
     * Seriablizable unsigned 8-bit int
     * @alias TYPES.UINT8
     * @memberof! BaseTypes#
     */
    UINT8: 'UINT8',

    /**
     * Seriablizable string
     * @alias TYPES.STRING
     * @memberof! BaseTypes#
     */
    STRING: 'STRING',

    /**
     * Seriablizable class.  Make sure you registered the classes included in this way.
     * @alias TYPES.CLASSINSTANCE
     * @memberof! BaseTypes#
     */
    CLASSINSTANCE: 'CLASSINSTANCE',

    /**
     * Seriablizable list.
     * @alias TYPES.LIST
     * @memberof! BaseTypes#
     */
    LIST: 'LIST'
};

export default BaseTypes;
