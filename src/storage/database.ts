import Dexie,{type EntityTable} from 'dexie'; import type { Project } from '../models/types';
const db=new Dexie('LMGuideEngineeringStudio') as Dexie&{projects:EntityTable<Project,'id'>};db.version(1).stores({projects:'id,name,updatedAt'});
export const projectDb=db;
export const saveProject=(p:Project)=>db.projects.put(p);
export const listProjects=()=>db.projects.orderBy('updatedAt').reverse().toArray();
export const deleteProject=(id:string)=>db.projects.delete(id);
export function exportProject(p:Project){return JSON.stringify(p,null,2)}
export function importProject(json:string):Project{const p=JSON.parse(json) as Project;if(!p.name||!p.conditions)throw new Error('案件JSONの必須項目がありません。');return {...p,id:p.id||crypto.randomUUID(),updatedAt:new Date().toISOString()};}