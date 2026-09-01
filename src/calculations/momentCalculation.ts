import type { Vector3 } from '../models/types'; import { add,cross } from './coordinateSystem';
export const calculateMoment=(positionM:Vector3,forceN:Vector3):Vector3=>cross(positionM,forceN);
export const calculateTotalMoment=(items:{positionM:Vector3;forceN:Vector3}[]):Vector3=>items.reduce((m,i)=>add(m,calculateMoment(i.positionM,i.forceN)),{x:0,y:0,z:0});