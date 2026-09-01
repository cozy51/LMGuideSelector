export interface LoadDistance { loadN:number;distanceM:number }
function powerMean(items:LoadDistance[],p:number){const d=items.reduce((s,i)=>s+Math.max(0,i.distanceM),0);if(d<=0)return 0;return Math.pow(items.reduce((s,i)=>s+Math.pow(Math.max(0,i.loadN),p)*Math.max(0,i.distanceM),0)/d,1/p);}
/** 停止は走行距離0のため寿命等価平均から除外する。 */
export const calculateBallMeanLoad=(items:LoadDistance[])=>powerMean(items,3);
export const calculateRollerMeanLoad=(items:LoadDistance[])=>powerMean(items,10/3);