'use strict';

const Serializer = require('./../serialize/Serializer');
const Serializable = require('./../serialize/Serializable');

class Collection extends Serializable {
	static get netScheme() {
		return {
			events: {
				type: Serializer.TYPES.LIST,
				itemType: Serializer.TYPES.CLASSINSTANCE
			}
		};
	}

	constructor() {
		super();
		this.events = [];
	}
}

class SyncHeader extends Serializable {
	static get netScheme() {
		return {
			stepCount: { type: Serializer.TYPES.INT32 },
			fullUpdate: { type: Serializer.TYPES.UINT8 }
		};
	}

	constructor(stepCount, fullUpdate) {
		super();
		this.stepCount = stepCount;
		this.fullUpdate = fullUpdate;
	}
}

class ObjectEvent extends Serializable {
	static get netScheme() {
		return {
			stepCount: { type: Serializer.TYPES.INT32 },
			objectInstance: { type: Serializer.TYPES.CLASSINSTANCE }
		};
	}

	constructor(stepCount, objectInstance) {
		super();
		this.stepCount = stepCount;
		this.objectInstance = objectInstance;
	}
}

class ObjectCreate extends ObjectEvent {}
class ObjectUpdate extends ObjectEvent {}
class ObjectDestroy extends ObjectEvent {}

module.exports = {
	Collection: Collection,
	SyncHeader: SyncHeader,
	ObjectCreate: ObjectCreate,
	ObjectUpdate: ObjectUpdate,
	ObjectDestroy: ObjectDestroy
};