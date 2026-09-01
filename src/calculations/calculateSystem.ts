import type { CalculationResult,Conditions,ForceMoment,PhaseResult,Vector3 } from '../models/types';
import { calculateCenterOfGravity } from './centerOfGravity'; import { add } from './coordinateSystem';
import { gravityForce } from './forceCalculation'; import { calculateMoment } from './momentCalculation';
import { createBlockPositions,distributeBlockLoads } from './blockLoadDistribution'; import { createMotionPhases } from './motionProfile';
import { calculateBallMeanLoad,calculateRollerMeanLoad } from './meanLoad'; import { mmToM } from '../utils/unitConversion';

const zero=():Vector3=>({x:0,y:0,z:0}); const pos=(v:Vector3):Vector3=>({x:mmToM(v.x),y:mmToM(v.y),z:mmToM(v.z)});
export function validateConditions(c:Conditions):string[]{ const w:string[]=[];
 if(c.layout.blockSpanMm<=0&&c.layout.blocksPerRail>1)w.push('BSは0より大きくしてください。');
 if(c.layout.railSpanMm<=0&&c.layout.railCount>1)w.push('RSは0より大きくしてください。');
 if(c.layout.strokeMm<=0)w.push('ストロークは0より大きくしてください。');
 if(c.motion.maxSpeedMmS<0)w.push('速度を負にできません。');
 if(c.motion.accelMode==='time'&&(c.motion.accelTimeS<=0||c.motion.decelTimeS<=0))w.push('加減速時間は0より大きくしてください。');
 if(c.masses.some(m=>m.massKg<0))w.push('質量を負にできません。');
 if(c.desiredLifeHours<0)w.push('要求寿命を負にできません。');
 return w;
}
export function calculateSystem(c:Conditions):CalculationResult{
 const cg=calculateCenterOfGravity(c.masses),positions=createBlockPositions(c.layout),profile=createMotionPhases(c.motion,c.layout.strokeMm); const warnings=validateConditions(c);if(profile.warning)warnings.push(profile.warning);
 if(c.layout.blockSpanMm<50&&c.layout.blocksPerRail>1)warnings.push('BSが小さく、ピッチ・ヨー荷重が集中しやすい設計です。');
 if(c.layout.railSpanMm<50&&c.layout.railCount>1)warnings.push('RSが小さく、ローリング荷重が集中しやすい設計です。');
 if(Math.abs(cg.cogMm.y)>Math.max(c.layout.blockSpanMm,c.layout.railSpanMm)*2)warnings.push('重心高さが支持スパンに対して極端です。');
 const phases:PhaseResult[]=profile.phases.map(phase=>{
  let force=zero(),moment=zero();
  for(const item of c.masses){
   const g=gravityForce(item.massKg,c.orientation); const inertia={x:-item.massKg*phase.accelerationMS2,y:0,z:0}; const f=add(g,inertia); force=add(force,f);moment=add(moment,calculateMoment(pos(item.positionMm),f));
  }
  const driveForce=c.drive.mode==='automatic'?-force.x:c.drive.forceN; const drive={x:driveForce,y:0,z:0}; force=add(force,drive);moment=add(moment,calculateMoment(pos(c.drive.positionMm),drive));
  const system:ForceMoment={forceN:force,momentNm:moment}; const distributed=distributeBlockLoads(system,positions);
  if(distributed.residual>1e-5)warnings.push(`${phase.label}: 現在の配置では一部モーメントをブロック間反力へ分配できません（製品モーメント定格を別途確認）。`);
  if(Object.values(distributed.loads).some(l=>l.rawYReactionN<0))warnings.push(`${phase.label}: ブロックに逆ラジアル荷重（浮き上がり傾向）が発生します。`);
  return {phase,system,loads:distributed.loads};
 });
 let pMaxN=0,worstBlock='—',worstPhase='—';for(const p of phases)for(const [id,l] of Object.entries(p.loads))if(l.equivalentN>pMaxN){pMaxN=l.equivalentN;worstBlock=id;worstPhase=p.phase.label;}
 const histories=positions.map(b=>phases.map(p=>({loadN:p.loads[b.id]?.equivalentN??0,distanceM:p.phase.distanceM})));const meanLoadN=Math.max(0,...histories.map(calculateBallMeanLoad)),rollerMeanLoadN=Math.max(0,...histories.map(calculateRollerMeanLoad));
 if(pMaxN>0&&Object.values(phases.flatMap(p=>Object.values(p.loads))).some(l=>l.equivalentN>pMaxN*.8))warnings.push('複数状態で高いブロック荷重が発生しています。');
 return {totalMassKg:cg.totalMassKg,cogMm:cg.cogMm,phases,pMaxN,worstBlock,worstPhase,meanLoadN,rollerMeanLoadN,distancePerCycleM:mmToM(c.layout.strokeMm)*2,warnings:[...new Set(warnings)]};
}