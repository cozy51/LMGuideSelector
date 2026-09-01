import type { MassItem,Vector3 } from '../models/types';
export function calculateCenterOfGravity(items:MassItem[]):{totalMassKg:number;cogMm:Vector3}{
 const valid=items.filter(i=>i.massKg>=0&&Number.isFinite(i.massKg)); const totalMassKg=valid.reduce((s,i)=>s+i.massKg,0);
 if(totalMassKg===0)return {totalMassKg:0,cogMm:{x:0,y:0,z:0}};
 const axis=(k:keyof Vector3)=>valid.reduce((s,i)=>s+i.massKg*i.positionMm[k],0)/totalMassKg;
 return {totalMassKg,cogMm:{x:axis('x'),y:axis('y'),z:axis('z')}};
}