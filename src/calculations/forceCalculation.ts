import type { Orientation,Vector3 } from '../models/types';
import { gravityVector,GRAVITY } from './coordinateSystem';
export const calculateWeight=(massKg:number)=>massKg*GRAVITY;
/** 慣性力は加速度と逆向き。 */
export const calculateInertiaForce=(massKg:number,accelerationMS2:number)=>-massKg*accelerationMS2;
export function gravityForce(massKg:number,orientation:Orientation):Vector3 { const g=gravityVector(orientation); return {x:massKg*g.x,y:massKg*g.y,z:massKg*g.z}; }