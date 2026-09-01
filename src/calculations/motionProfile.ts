import type { Motion,MotionPhase } from '../models/types'; import { mmPerSecToMPerSec,mmToM } from '../utils/unitConversion';
export function getAccelerations(m:Motion){ const v=mmPerSecToMPerSec(m.maxSpeedMmS); return m.accelMode==='direct'?{a:m.accelerationMS2,d:m.decelerationMS2}:{a:v/m.accelTimeS,d:v/m.decelTimeS}; }
export function createMotionPhases(m:Motion,strokeMm:number):{phases:MotionPhase[];warning?:string}{
 const v=mmPerSecToMPerSec(m.maxSpeedMmS),stroke=mmToM(strokeMm),{a,d}=getAccelerations(m);
 let la=v*v/(2*a),ld=v*v/(2*d); let warning:string|undefined;
 if(!Number.isFinite(la)||!Number.isFinite(ld)||a<=0||d<=0) return {phases:[],warning:'加減速度または加減速時間が不正です。'};
 if(la+ld>stroke){const ratio=stroke/(la+ld);la*=ratio;ld*=ratio;warning='指定速度に達しない三角速度プロファイルです。加減速距離をストロークに合わせて按分しました。';}
 const lc=Math.max(0,stroke-la-ld);
 return {phases:[
  {id:'stop',label:'停止',accelerationMS2:0,distanceM:0},
  {id:'posAccel',label:'+加速',accelerationMS2:a,distanceM:la},{id:'posConstant',label:'+定速',accelerationMS2:0,distanceM:lc},{id:'posDecel',label:'+減速',accelerationMS2:-d,distanceM:ld},
  {id:'negAccel',label:'-加速',accelerationMS2:-a,distanceM:la},{id:'negConstant',label:'-定速',accelerationMS2:0,distanceM:lc},{id:'negDecel',label:'-減速',accelerationMS2:d,distanceM:ld}
 ],warning};
}