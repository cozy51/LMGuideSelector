import type { RollingElement } from '../models/types';
export const calculateBallRatedLifeKm=(C:number,Pm:number,fw:number)=>C>0&&Pm>0&&fw>0?Math.pow(C/(fw*Pm),3)*50:0;
/** 汎用ローラー参考式。正式選定時はシリーズ固有基準距離をメーカー資料で確認する。 */
export const calculateRollerRatedLifeKm=(C:number,Pm:number,fw:number)=>C>0&&Pm>0&&fw>0?Math.pow(C/(fw*Pm),10/3)*100:0;
export const calculateRatedLifeKm=(type:RollingElement,C:number,Pm:number,fw:number)=>type==='ball'?calculateBallRatedLifeKm(C,Pm,fw):calculateRollerRatedLifeKm(C,Pm,fw);