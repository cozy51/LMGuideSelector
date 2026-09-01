import type { DirectionalLoad,Product } from '../models/types';
export interface EquivalentLoadStrategy { calculate(load:DirectionalLoad,product:Product):number }
export const genericDirectionalStrategy:EquivalentLoadStrategy={calculate:(l,p)=>p.radialFactor*l.radialN+p.reverseRadialFactor*l.reverseRadialN+p.lateralFactor*l.lateralN+l.axialN};
/** メーカー固有式はこのレジストリへ追加する。未確認式を推測しない。 */
export const equivalentStrategies:Record<string,EquivalentLoadStrategy>={generic:genericDirectionalStrategy};