import type { CalculationResult,Conditions } from '../models/types';
import { fmt } from '../utils/unitConversion';

const clamp=(value:number,min:number,max:number)=>Math.max(min,Math.min(max,value));

/** 平面図で見えないY方向を確認するための動的な正面図・側面図。 */
export function OrthographicViews({conditions,result}:{conditions:Conditions;result:CalculationResult}){
 const {layout,drive}=conditions;
 const yReference=Math.max(100,layout.railSpanMm,layout.blockSpanMm);
 const yMap=(y:number)=>128-clamp(y/yReference,-1.15,1.15)*72;
 const frontMap=(z:number)=>160+clamp(z/Math.max(1,layout.railSpanMm/2),-1.25,1.25)*88;
 const sideMap=(x:number)=>160+clamp(x/Math.max(1,layout.blockSpanMm/2),-1.25,1.25)*88;
 const frontCog={x:frontMap(result.cogMm.z),y:yMap(result.cogMm.y)};
 const frontDrive={x:frontMap(drive.positionMm.z),y:yMap(drive.positionMm.y)};
 const sideCog={x:sideMap(result.cogMm.x),y:yMap(result.cogMm.y)};
 const sideDrive={x:sideMap(drive.positionMm.x),y:yMap(drive.positionMm.y)};
 return <div className="orthographic-section">
  <div className="orthographic-heading"><div><b>紙面垂直方向を含む三面図</b><span>入力した重心・駆動位置に連動して移動します</span></div><div className="view-keys"><span className="span-key rs-key">RS：左右レール間隔</span><span className="span-key bs-key">BS：前後ブロック間隔</span><span className="view-key"><i className="cog-key"/>合成重心 <i className="drive-key"/>駆動作用点</span></div></div>
  <div className="orthographic-grid">
   <figure className="rs-view"><figcaption><div><b>正面図（Z–Y）</b><em>RS = 左右レールの間隔</em></div><span>横偏心と高さを確認</span></figcaption><svg viewBox="0 0 320 230" role="img" aria-label={`正面図。RSレールスパン ${layout.railSpanMm} mm、重心 Zg ${result.cogMm.z} mm、Yg ${result.cogMm.y} mm。駆動 Bt ${drive.positionMm.z} mm、Br ${drive.positionMm.y} mm`}>
    <defs><marker id="orthoArrowFront" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path className="rs-arrow-head" d="M0 0L7 3.5L0 7z"/></marker></defs>
    <line x1="30" y1="128" x2="292" y2="128" className="mount-plane"/><text x="31" y="145">取付面 Y=0</text><line x1="160" y1="30" x2="160" y2="183" className="datum-line"/><text x="164" y="180">Z=0</text>
    {[frontMap(-layout.railSpanMm/2),frontMap(layout.railSpanMm/2)].map((x,i)=><g className="ortho-guide" key={i}><rect x={x-20} y="113" width="40" height="15" rx="3"/><path d={`M${x-14} 113v-17h28v17`}/></g>)}
    <line x1={frontMap(-layout.railSpanMm/2)} y1="199" x2={frontMap(layout.railSpanMm/2)} y2="199" className="ortho-dimension rs-dimension" markerStart="url(#orthoArrowFront)" markerEnd="url(#orthoArrowFront)"/><text className="rs-label" x="160" y="194" textAnchor="middle">RS レールスパン {fmt(layout.railSpanMm,0)} mm</text>
    <g className="ortho-cog" transform={`translate(${frontCog.x},${frontCog.y})`}><circle r="10"/><path d="M-7 0h14M0-7v14"/><text x="14" y="-9">重心</text></g><text className="point-value" x={clamp(frontCog.x+14,35,238)} y={clamp(frontCog.y+15,44,112)}>Zg {fmt(result.cogMm.z,0)} / Yg {fmt(result.cogMm.y,0)}</text>
    <g className="ortho-drive" transform={`translate(${frontDrive.x},${frontDrive.y})`}><circle r="8"/><circle r="3"/><text x="12" y="-9">駆動</text></g><text className="point-value drive-value" x={clamp(frontDrive.x+12,35,228)} y={clamp(frontDrive.y+16,44,112)}>Bt {fmt(drive.positionMm.z,0)} / Br {fmt(drive.positionMm.y,0)}</text>
    <g className="ortho-axis"><line x1="270" y1="45" x2="298" y2="45" markerEnd="url(#orthoArrowFront)"/><text x="284" y="39">+Z</text><line x1="270" y1="45" x2="270" y2="17" markerEnd="url(#orthoArrowFront)"/><text x="275" y="24">+Y</text></g>
   </svg></figure>
   <figure className="bs-view"><figcaption><div><b>側面図（X–Y）</b><em>BS = 同一レール上の前後ブロック間隔</em></div><span>長手位置と高さを確認</span></figcaption><svg viewBox="0 0 320 230" role="img" aria-label={`側面図。BSブロックスパン ${layout.blockSpanMm} mm、重心 Xg ${result.cogMm.x} mm、Yg ${result.cogMm.y} mm。駆動X ${drive.positionMm.x} mm、Br ${drive.positionMm.y} mm`}>
    <defs><marker id="orthoArrowSide" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path className="bs-arrow-head" d="M0 0L7 3.5L0 7z"/></marker></defs>
    <line x1="30" y1="128" x2="292" y2="128" className="mount-plane"/><text x="31" y="145">取付面 Y=0</text><line x1="160" y1="30" x2="160" y2="183" className="datum-line"/><text x="164" y="180">X=0</text>
    <line x1="58" y1="121" x2="262" y2="121" className="side-rail"/>
    {[sideMap(-layout.blockSpanMm/2),sideMap(layout.blockSpanMm/2)].map((x,i)=><g className="ortho-guide" key={i}><rect x={x-20} y="106" width="40" height="22" rx="3"/><path d={`M${x-14} 106v-14h28v14`}/><text x={x} y="120" textAnchor="middle">B{i+1}</text></g>)}
    <line x1={sideMap(-layout.blockSpanMm/2)} y1="199" x2={sideMap(layout.blockSpanMm/2)} y2="199" className="ortho-dimension bs-dimension" markerStart="url(#orthoArrowSide)" markerEnd="url(#orthoArrowSide)"/><text className="bs-label" x="160" y="194" textAnchor="middle">BS ブロックスパン {fmt(layout.blockSpanMm,0)} mm</text>
    <g className="ortho-cog" transform={`translate(${sideCog.x},${sideCog.y})`}><circle r="10"/><path d="M-7 0h14M0-7v14"/><text x="14" y="-9">重心</text></g><text className="point-value" x={clamp(sideCog.x+14,35,238)} y={clamp(sideCog.y+15,44,112)}>Xg {fmt(result.cogMm.x,0)} / Yg {fmt(result.cogMm.y,0)}</text>
    <g className="ortho-drive" transform={`translate(${sideDrive.x},${sideDrive.y})`}><circle r="8"/><circle r="3"/><text x="12" y="-9">駆動</text></g><text className="point-value drive-value" x={clamp(sideDrive.x+12,35,218)} y={clamp(sideDrive.y+16,44,112)}>X {fmt(drive.positionMm.x,0)} / Br {fmt(drive.positionMm.y,0)}</text>
    <g className="ortho-axis"><line x1="270" y1="45" x2="298" y2="45" markerEnd="url(#orthoArrowSide)"/><text x="284" y="39">+X</text><line x1="270" y1="45" x2="270" y2="17" markerEnd="url(#orthoArrowSide)"/><text x="275" y="24">+Y</text></g>
   </svg></figure>
  </div><p className="orthographic-note">図上の位置は入力値に連動します。極端な値では見切れ防止のため表示位置のみ端で制限しますが、計算には入力した実値を使用します。</p>
 </div>;
}