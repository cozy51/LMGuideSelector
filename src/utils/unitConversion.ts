/** 計算内部は SI (m, N, N·m, s)。UI境界のみ変換する。 */
export const mmToM=(v:number)=>v/1000;
export const mToMm=(v:number)=>v*1000;
export const nmmToNm=(v:number)=>v/1000;
export const nmToNmm=(v:number)=>v*1000;
export const mmPerSecToMPerSec=(v:number)=>v/1000;
export const mPerSecToMmPerSec=(v:number)=>v*1000;
export const mToKm=(v:number)=>v/1000;
export const finite=(v:number,fallback=0)=>Number.isFinite(v)?v:fallback;
export const fmt=(v:number,digits=2)=>Number.isFinite(v)?v.toLocaleString('ja-JP',{maximumFractionDigits:digits}):'—';