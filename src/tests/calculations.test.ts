import { describe,expect,it } from 'vitest';
import { calculateCenterOfGravity } from '../calculations/centerOfGravity'; import { calculateWeight,calculateInertiaForce } from '../calculations/forceCalculation';
import { calculateMoment } from '../calculations/momentCalculation'; import { createBlockPositions,distributeBlockLoads } from '../calculations/blockLoadDistribution';
import { calculateStaticSafety } from '../calculations/staticSafety'; import { calculateBallMeanLoad,calculateRollerMeanLoad } from '../calculations/meanLoad';
import { calculateBallRatedLifeKm } from '../calculations/ratedLife'; import { calculateLifeHours,calculateTravel } from '../calculations/lifeHours'; import { mmToM,mToMm,nmmToNm,nmToNmm,mmPerSecToMPerSec } from '../utils/unitConversion';
import { defaultConditions } from '../models/defaults';
import { calculateSystem } from '../calculations/calculateSystem';import { selectCandidates } from '../productData/selection';import { sampleProducts } from '../productData/products';
describe('基礎計算',()=>{
 it('合成重心',()=>expect(calculateCenterOfGravity([{id:'1',name:'a',massKg:10,positionMm:{x:0,y:0,z:0}},{id:'2',name:'b',massKg:30,positionMm:{x:100,y:200,z:0}}])).toEqual({totalMassKg:40,cogMm:{x:75,y:150,z:0}}));
 it('重量と慣性力',()=>{expect(calculateWeight(200)).toBeCloseTo(1961.33,2);expect(calculateInertiaForce(10,2)).toBe(-20)});
 it('外積モーメント',()=>expect(calculateMoment({x:0,y:.25,z:0},{x:100,y:0,z:0})).toEqual({x:0,y:0,z:-25}));
 it('単位変換',()=>{expect(mmToM(1000)).toBe(1);expect(mToMm(1)).toBe(1000);expect(nmmToNm(1000)).toBe(1);expect(nmToNmm(1)).toBe(1000);expect(mmPerSecToMPerSec(800)).toBe(.8)});
});
describe('4ブロック荷重分配',()=>{
 const p=createBlockPositions(defaultConditions.layout);
 it('中心静荷重を均等分配',()=>{const r=distributeBlockLoads({forceN:{x:0,y:-4000,z:0},momentNm:{x:0,y:0,z:0}},p);Object.values(r.loads).forEach(l=>expect(l.radialN).toBeCloseTo(1000));});
 it('純ピッチと純ロールで釣合う',()=>{const sys={forceN:{x:0,y:-4000,z:0},momentNm:{x:300,y:0,z:240}};const r=distributeBlockLoads(sys,p);expect(r.residual).toBeLessThan(1e-8);const ry=p.map(x=>r.loads[x.id].rawYReactionN);expect(ry.reduce((s,v)=>s+v,0)).toBeCloseTo(4000);expect(p.reduce((s,x,i)=>s+x.zM*ry[i],0)).toBeCloseTo(300);expect(p.reduce((s,x,i)=>s+x.xM*ry[i],0)).toBeCloseTo(-240);});
 it('1ブロックで支持不能なモーメントを残差に残す',()=>{const one=createBlockPositions({...defaultConditions.layout,railCount:1,blocksPerRail:1});const r=distributeBlockLoads({forceN:{x:0,y:-1000,z:0},momentNm:{x:100,y:0,z:0}},one);expect(r.residual).toBeCloseTo(100);});
});
describe('寿命計算',()=>{
 it('安全率',()=>expect(calculateStaticSafety(12000,3000)).toBe(4));
 it('距離加重立方平均',()=>expect(calculateBallMeanLoad([{loadN:100,distanceM:1},{loadN:200,distanceM:1}])).toBeCloseTo(Math.cbrt(4_500_000)));
 it('ローラー指数',()=>expect(calculateRollerMeanLoad([{loadN:100,distanceM:1},{loadN:200,distanceM:1}])).toBeGreaterThan(150));
 it('ボール定格寿命',()=>expect(calculateBallRatedLifeKm(10000,1000,1)).toBe(50000));
 it('寿命時間',()=>{const t=calculateTravel(500,10,8,250);expect(t.hourKm).toBe(.6);expect(calculateLifeHours(6000,t.hourKm)).toBe(10000);});
});
describe('候補選定',()=>{it('製品方向係数をPmaxへ反映',()=>{const result=calculateSystem(defaultConditions),base=sampleProducts[0],weighted={...base,model:'WEIGHTED',radialFactor:2};const c=selectCandidates([base,weighted],result,1.2,1,100,1);expect(c.find(x=>x.product.model==='WEIGHTED')!.pMaxN).toBeGreaterThan(c.find(x=>x.product.model===base.model)!.pMaxN);});});