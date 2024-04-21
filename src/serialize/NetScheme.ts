/**
 * The netScheme type defines the base types used in Lance.
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
type NetScheme = { 
    [key: string] : { 'type': string, 'itemType'?: string }
} 

export { NetScheme }
