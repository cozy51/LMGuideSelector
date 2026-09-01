import type { Orientation,Vector3 } from '../models/types';
/**
 * 右手系: +X=移動方向、+Y=基本上方、+Z=横方向。
 * 正モーメントは右ねじ則。MA=Mz(ピッチ), MB=My(ヨー), MC=Mx(ロール)。
 */
export const GRAVITY=9.80665;
export const gravityVector=(o:Orientation):Vector3=>o==='vertical'?{x:-GRAVITY,y:0,z:0}:o==='wall'?{x:0,y:0,z:-GRAVITY}:{x:0,y:-GRAVITY,z:0};
export const cross=(a:Vector3,b:Vector3):Vector3=>({x:a.y*b.z-a.z*b.y,y:a.z*b.x-a.x*b.z,z:a.x*b.y-a.y*b.x});
export const add=(a:Vector3,b:Vector3):Vector3=>({x:a.x+b.x,y:a.y+b.y,z:a.z+b.z});