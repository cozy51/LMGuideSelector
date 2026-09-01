export function calculateTravel(strokeMm:number,cyclesPerMin:number,hoursPerDay:number,daysPerYear:number){
 const cycleKm=2*strokeMm/1_000_000,hourKm=cycleKm*cyclesPerMin*60,dayKm=hourKm*hoursPerDay,yearKm=dayKm*daysPerYear; return {cycleKm,hourKm,dayKm,yearKm};
}
export const calculateLifeHours=(lifeKm:number,hourKm:number)=>lifeKm>0&&hourKm>0?lifeKm/hourKm:0;