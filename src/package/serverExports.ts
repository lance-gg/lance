import { GameEngine, GameEngineOptions, InputDesc, PreStepDesc } from '../GameEngine.js';
import { GameWorld } from '../GameWorld.js';
import { P2PhysicsEngine } from '../physics/P2PhysicsEngine.js';
import { SimplePhysicsEngine, SimplePhysicsEngineOptions } from '../physics/SimplePhysicsEngine.js';
import { CannonPhysicsEngine } from '../physics/CannonPhysicsEngine.js';
import BaseTypes from '../serialize/BaseTypes.js';
import { TwoVector } from '../serialize/TwoVector.js';
import { ThreeVector } from '../serialize/ThreeVector.js';
import Quaternion from '../serialize/Quaternion.js';
import { GameObject } from '../serialize/GameObject.js';
import DynamicObject from '../serialize/DynamicObject.js';
import { PhysicalObject2D } from '../serialize/PhysicalObject2D.js';
import { PhysicalObject3D } from '../serialize/PhysicalObject3D.js';
import { ServerEngine, ServerEngineOptions } from '../ServerEngine.js';
import Renderer from '../render/Renderer.js';
import Lib from '../lib/lib.js';
import Serializer from '../serialize/Serializer.js';
// TODO: remove Renderer from server exports.
// some games (Brawler) have a renderer which needs to be notified on object create,
// and instead of just listening to the object-create event, they are invoked by the
// object itself on creation

export {
  GameEngine, GameEngineOptions,
  GameWorld,
  Serializer,
  Renderer,
  InputDesc,
  PreStepDesc,
  P2PhysicsEngine,
  SimplePhysicsEngine, SimplePhysicsEngineOptions,
  CannonPhysicsEngine,
  BaseTypes,
  TwoVector,
  ThreeVector,
  Quaternion,
  GameObject,
  DynamicObject,
  PhysicalObject2D,
  PhysicalObject3D,
  ServerEngine, ServerEngineOptions,
  Lib,
}
