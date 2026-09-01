import type { Conditions } from '../models/types';
import { fmt } from '../utils/unitConversion';

const driveNames:Record<Conditions['drive']['type'],string>={ballscrew:'ボールねじ',belt:'ベルト',rack:'ラック＆ピニオン',linearMotor:'リニアモータ',other:'その他の駆動'};

/**
 * 駆動作用点の入力記号を説明する模式図。
 * 寸法を理解するための図であり、実際の縮尺・製品形状は表さない。
 */
export function DrivePositionDiagram({conditions}:{conditions:Conditions}){
 const {layout,drive}=conditions;
 const bt=drive.positionMm.z,br=drive.positionMm.y,driveX=drive.positionMm.x;
 // 入力値の符号を保ちながら、極端な値でも図からはみ出さない表示座標へ制限する。
 const clamp=(v:number,min:number,max:number)=>Math.max(min,Math.min(max,v));
 const frontDriveX=150+clamp(bt/Math.max(1,layout.railSpanMm/2),-1,1)*60;
 const frontDriveY=82-clamp(br/Math.max(50,Math.abs(br)), -1,1)*34;
 const sideDriveX=150+clamp(driveX/Math.max(1,layout.blockSpanMm/2),-1,1)*60;
 const sideDriveY=82-clamp(br/Math.max(50,Math.abs(br)), -1,1)*34;
 return <figure className="drive-diagram">
  <figcaption><b>駆動作用点の寸法</b><span>{driveNames[drive.type]}／模式図（縮尺不同）</span></figcaption>
  <div className="drive-diagram-views">
   <div><h4>正面図（Z–Y）</h4><svg viewBox="0 0 300 190" role="img" aria-label={`正面図。RS ${layout.railSpanMm} mm、Br ${br} mm、Bt ${bt} mm`}>
    <defs><marker id="driveDimArrow" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto-start-reverse"><path d="M0 0L7 3.5L0 7z"/></marker></defs>
    <line x1="50" y1="82" x2="250" y2="82" className="mounting-plane"/><text x="253" y="86">取付面</text>
    <g className="guide-section"><path d="M58 55h42v27H58z"/><path d="M200 55h42v27h-42z"/><rect x="68" y="64" width="22" height="18"/><rect x="210" y="64" width="22" height="18"/></g>
    <line x1="150" y1="38" x2="150" y2="150" className="center-line"/><text x="154" y="145">中心 Z=0</text>
    <g className="drive-point"><circle cx={frontDriveX} cy={frontDriveY} r="9"/><circle cx={frontDriveX} cy={frontDriveY} r="3"/><text x={frontDriveX+12} y={frontDriveY-8}>駆動作用点</text></g>
    <line x1="79" y1="105" x2="221" y2="105" className="dimension-line" markerStart="url(#driveDimArrow)" markerEnd="url(#driveDimArrow)"/><line x1="79" y1="82" x2="79" y2="111" className="extension-line"/><line x1="221" y1="82" x2="221" y2="111" className="extension-line"/><text x="150" y="101" textAnchor="middle">RS {fmt(layout.railSpanMm,0)} mm</text>
    {bt===0?<><line x1="142" y1="128" x2="158" y2="128" className="dimension-line"/><line x1="150" y1={frontDriveY} x2="150" y2="134" className="extension-line"/><text x="150" y="124" textAnchor="middle">Bt 0（中心）</text></>:<><line x1="150" y1="128" x2={frontDriveX} y2="128" className="dimension-line" markerStart="url(#driveDimArrow)" markerEnd="url(#driveDimArrow)"/><line x1={frontDriveX} y1={frontDriveY} x2={frontDriveX} y2="134" className="extension-line"/><text x={(150+frontDriveX)/2} y="124" textAnchor="middle">Bt {fmt(bt,0)}</text></>}
    <line x1="35" y1="82" x2="35" y2={frontDriveY} className="dimension-line" markerStart="url(#driveDimArrow)" markerEnd="url(#driveDimArrow)"/><line x1="35" y1={frontDriveY} x2={frontDriveX} y2={frontDriveY} className="extension-line"/><text x="29" y={(82+frontDriveY)/2} textAnchor="middle" transform={`rotate(-90 29 ${(82+frontDriveY)/2})`}>Br {fmt(br,0)}</text>
    <g className="diagram-axis"><line x1="260" y1="155" x2="285" y2="155"/><text x="276" y="149">+Z</text><line x1="260" y1="155" x2="260" y2="130"/><text x="265" y="137">+Y</text></g>
   </svg></div>
   <div><h4>側面図（X–Y）</h4><svg viewBox="0 0 300 190" role="img" aria-label={`側面図。BS ${layout.blockSpanMm} mm、駆動X位置 ${driveX} mm、Br ${br} mm`}>
    <defs><marker id="sideDriveDimArrow" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto-start-reverse"><path d="M0 0L7 3.5L0 7z"/></marker></defs>
    <line x1="45" y1="82" x2="255" y2="82" className="mounting-plane"/><text x="258" y="86">取付面</text>
    <g className="guide-section"><path d="M58 55h42v27H58z"/><path d="M200 55h42v27h-42z"/><rect x="68" y="64" width="22" height="18"/><rect x="210" y="64" width="22" height="18"/></g>
    <line x1="150" y1="38" x2="150" y2="150" className="center-line"/><text x="154" y="145">中心 X=0</text>
    <g className="drive-point"><circle cx={sideDriveX} cy={sideDriveY} r="9"/><circle cx={sideDriveX} cy={sideDriveY} r="3"/><text x={sideDriveX+12} y={sideDriveY-8}>駆動作用点</text></g>
    <line x1="79" y1="105" x2="221" y2="105" className="dimension-line" markerStart="url(#sideDriveDimArrow)" markerEnd="url(#sideDriveDimArrow)"/><line x1="79" y1="82" x2="79" y2="111" className="extension-line"/><line x1="221" y1="82" x2="221" y2="111" className="extension-line"/><text x="150" y="101" textAnchor="middle">BS {fmt(layout.blockSpanMm,0)} mm</text>
    {driveX===0?<><line x1="142" y1="128" x2="158" y2="128" className="dimension-line"/><line x1="150" y1={sideDriveY} x2="150" y2="134" className="extension-line"/><text x="150" y="124" textAnchor="middle">駆動X 0（中心）</text></>:<><line x1="150" y1="128" x2={sideDriveX} y2="128" className="dimension-line" markerStart="url(#sideDriveDimArrow)" markerEnd="url(#sideDriveDimArrow)"/><line x1={sideDriveX} y1={sideDriveY} x2={sideDriveX} y2="134" className="extension-line"/><text x={(150+sideDriveX)/2} y="124" textAnchor="middle">駆動X {fmt(driveX,0)}</text></>}
    <line x1="35" y1="82" x2="35" y2={sideDriveY} className="dimension-line" markerStart="url(#sideDriveDimArrow)" markerEnd="url(#sideDriveDimArrow)"/><line x1="35" y1={sideDriveY} x2={sideDriveX} y2={sideDriveY} className="extension-line"/><text x="29" y={(82+sideDriveY)/2} textAnchor="middle" transform={`rotate(-90 29 ${(82+sideDriveY)/2})`}>Br {fmt(br,0)}</text>
    <g className="diagram-axis"><line x1="260" y1="155" x2="285" y2="155"/><text x="276" y="149">+X</text><line x1="260" y1="155" x2="260" y2="130"/><text x="265" y="137">+Y</text></g>
   </svg></div>
  </div>
  <dl className="symbol-legend"><div><dt>Br</dt><dd>LMガイド取付面を基準とした駆動作用点の高さ</dd></div><div><dt>Bt</dt><dd>ガイド中心（Z=0）から駆動作用点までの横偏心</dd></div><div><dt>駆動X</dt><dd>ブロック配置中心（X=0）から駆動作用点までの長手方向偏心</dd></div><div><dt>RS / BS</dt><dd>レール間隔／前後ブロック間隔</dd></div></dl>
 </figure>;
}