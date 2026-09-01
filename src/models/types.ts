export type Orientation='horizontal'|'vertical'|'wall';
export type RollingElement='ball'|'roller';
export type DataQuality='official'|'manualVerified'|'unverified'|'sample';
export interface Vector3 { x:number; y:number; z:number }
export interface MassItem { id:string; name:string; massKg:number; positionMm:Vector3 }
export interface Layout { railCount:number; blocksPerRail:number; railSpanMm:number; blockSpanMm:number; railLengthMm:number; strokeMm:number }
export interface Drive { type:'ballscrew'|'belt'|'rack'|'linearMotor'|'other'; mode:'automatic'|'manual'; forceN:number; positionMm:Vector3 }
export interface Motion { maxSpeedMmS:number; accelMode:'time'|'direct'; accelTimeS:number; decelTimeS:number; accelerationMS2:number; decelerationMS2:number; cyclesPerMin:number; hoursPerDay:number; daysPerYear:number }
export interface Conditions { orientation:Orientation; masses:MassItem[]; layout:Layout; drive:Drive; motion:Motion; loadFactor:number; requiredSafety:number; desiredLifeHours:number }
export type PhaseId='stop'|'posAccel'|'posConstant'|'posDecel'|'negAccel'|'negConstant'|'negDecel';
export interface MotionPhase { id:PhaseId; label:string; accelerationMS2:number; distanceM:number }
export interface ForceMoment { forceN:Vector3; momentNm:Vector3 }
export interface BlockPosition { id:string; xM:number; zM:number; rail:number; index:number }
export interface DirectionalLoad { radialN:number; reverseRadialN:number; lateralN:number; axialN:number; equivalentN:number; rawYReactionN:number }
export interface PhaseResult { phase:MotionPhase; system:ForceMoment; loads:Record<string,DirectionalLoad> }
export interface CalculationResult { totalMassKg:number; cogMm:Vector3; phases:PhaseResult[]; pMaxN:number; worstBlock:string; worstPhase:string; meanLoadN:number; rollerMeanLoadN:number; distancePerCycleM:number; warnings:string[] }
export interface Product { manufacturer:string; series:string; model:string; size:string; rollingElement:RollingElement; loadType:string; C_N:number; C0_N:number; blockWidthMm:number; blockHeightMm:number; blockLengthMm:number; railWidthMm:number; massKg:number; radialFactor:number; reverseRadialFactor:number; lateralFactor:number; accuracyGrades:string[]; preloadClasses:string[]; options:string[]; officialUrl?:string; selectorUrl?:string; cadUrl?:string; catalogUrl?:string; dataSource:string; sourceUrl?:string; verifiedDate?:string; dataQuality:DataQuality }
export interface Candidate { product:Product; pMaxN:number; meanLoadN:number; worstBlock:string; worstPhase:string; safetyFactor:number; lifeKm:number; lifeHours:number; safetyOk:boolean; lifeOk:boolean; score:number }
export interface Project { id:string; name:string; conditions:Conditions; selectedModel?:string; updatedAt:string }