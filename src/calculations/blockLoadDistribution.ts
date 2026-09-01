import type { BlockPosition,DirectionalLoad,ForceMoment,Layout } from '../models/types';
import { mmToM } from '../utils/unitConversion';

export function createBlockPositions(layout:Layout):BlockPosition[]{
 const result:BlockPosition[]=[]; const rs=mmToM(layout.railSpanMm),bs=mmToM(layout.blockSpanMm);
 for(let rail=0;rail<layout.railCount;rail++) for(let block=0;block<layout.blocksPerRail;block++){
  const z=layout.railCount===1?0:-rs/2+rs*rail/(layout.railCount-1);
  const x=layout.blocksPerRail===1?0:-bs/2+bs*block/(layout.blocksPerRail-1);
  result.push({id:`Block ${result.length+1}`,xM:x,zM:z,rail:rail+1,index:block+1});
 }
 return result;
}

// A*x=b の最小ノルム解 x=Aᵀ(AAᵀ)⁻¹b。特異な行は除外して解く。
function minimumNorm(rows:number[][],targets:number[]):{values:number[];residual:number}{
 const n=rows[0]?.length??0;
 const rank=(matrix:number[][])=>{const a=matrix.map(r=>[...r]);let rank=0;for(let col=0;col<n&&rank<a.length;col++){let pivot=rank;for(let r=rank+1;r<a.length;r++)if(Math.abs(a[r][col])>Math.abs(a[pivot][col]))pivot=r;if(Math.abs(a[pivot][col])<1e-12)continue;[a[rank],a[pivot]]=[a[pivot],a[rank]];for(let r=rank+1;r<a.length;r++){const f=a[r][col]/a[rank][col];for(let j=col;j<n;j++)a[r][j]-=f*a[rank][j];}rank++;}return rank;};
 const active:{r:number[];b:number}[]=[];for(let i=0;i<rows.length;i++){const candidate=[...active.map(v=>v.r),rows[i]];if(rank(candidate)>active.length)active.push({r:rows[i],b:targets[i]});}
 if(!active.length)return {values:Array(n).fill(0),residual:Math.hypot(...targets)};
 const gram=active.map(a=>active.map(c=>a.r.reduce((s,v,j)=>s+v*c.r[j],0)));
 const b=active.map(v=>v.b); const aug=gram.map((r,i)=>[...r,b[i]]); const m=aug.length;
 for(let col=0;col<m;col++){
  let pivot=col;for(let r=col+1;r<m;r++)if(Math.abs(aug[r][col])>Math.abs(aug[pivot][col]))pivot=r;
  if(Math.abs(aug[pivot][col])<1e-12)return {values:Array(n).fill(0),residual:Math.hypot(...targets)};
  [aug[col],aug[pivot]]=[aug[pivot],aug[col]]; const p=aug[col][col];for(let j=col;j<=m;j++)aug[col][j]/=p;
  for(let r=0;r<m;r++)if(r!==col){const f=aug[r][col];for(let j=col;j<=m;j++)aug[r][j]-=f*aug[col][j];}
 }
 const lambda=aug.map(r=>r[m]); const values=Array(n).fill(0).map((_,j)=>active.reduce((s,a,i)=>s+a.r[j]*lambda[i],0));
 const residual=Math.hypot(...rows.map((r,i)=>r.reduce((s,v,j)=>s+v*values[j],0)-targets[i]));
 return {values,residual};
}

export function distributeBlockLoads(system:ForceMoment,positions:BlockPosition[],factors={radial:1,reverse:1,lateral:1}):{loads:Record<string,DirectionalLoad>;residual:number}{
 const n=positions.length;if(!n)return {loads:{},residual:Number.MAX_SAFE_INTEGER};
 // 反力の釣合い: ΣR=-F, Σ(r×R)=-M。
 const y=minimumNorm([Array(n).fill(1),positions.map(p=>p.zM),positions.map(p=>p.xM)],[-system.forceN.y,system.momentNm.x,-system.momentNm.z]);
 const z=minimumNorm([Array(n).fill(1),positions.map(p=>p.xM)],[-system.forceN.z,system.momentNm.y]);
 const x=Array(n).fill(-system.forceN.x/n);
 const loads:Record<string,DirectionalLoad>={}; positions.forEach((p,i)=>{
  const radial=Math.max(0,y.values[i]),reverse=Math.max(0,-y.values[i]),lateral=Math.abs(z.values[i]),axial=Math.abs(x[i]);
  loads[p.id]={radialN:radial,reverseRadialN:reverse,lateralN:lateral,axialN:axial,rawYReactionN:y.values[i],equivalentN:factors.radial*radial+factors.reverse*reverse+factors.lateral*lateral+axial};
 });
 return {loads,residual:Math.hypot(y.residual,z.residual)};
}