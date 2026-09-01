import type { CalculationResult,PhaseId } from '../models/types';
import { fmt } from '../utils/unitConversion';

const descriptions:Record<PhaseId,string>={
 stop:'停止中（速度0・加速度0）',
 posAccel:'＋X方向へ速度を上げる',
 posConstant:'＋X方向へ一定速度で走る',
 posDecel:'＋X方向へ走りながら減速する',
 negAccel:'－X方向へ速度を上げる',
 negConstant:'－X方向へ一定速度で走る',
 negDecel:'－X方向へ走りながら減速する'
};

export function PhaseMotionDiagram({result}:{result:CalculationResult}){
 const phases=new Map(result.phases.map(p=>[p.phase.id,p.phase]));
 const ordered=(['stop','posAccel','posConstant','posDecel','negAccel','negConstant','negDecel'] as PhaseId[]).map(id=>phases.get(id)).filter((p):p is NonNullable<typeof p>=>Boolean(p));
 if(!ordered.length)return null;
 return <section className="phase-motion" aria-labelledby="phase-motion-title">
  <div className="phase-motion-heading"><div><h3 id="phase-motion-title">1往復の動作フェーズ</h3><p>速度の向きと変化から、表の「＋／－」「加速／定速／減速」を確認できます。</p></div><div className="phase-axis-note"><b>＋／－</b><span>移動方向（X）</span><b>加速／減速</b><span>速度の変化</span></div></div>
  <svg viewBox="0 0 920 320" role="img" aria-label="停止からプラスX方向へ加速、定速、減速し、折り返してマイナスX方向へ加速、定速、減速して停止する速度時間線図">
   <defs><marker id="phaseAxisArrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0L8 4L0 8z"/></marker></defs>
   <g className="phase-grid"><line x1="74" y1="160" x2="884" y2="160" markerEnd="url(#phaseAxisArrow)"/><line x1="74" y1="280" x2="74" y2="28" markerEnd="url(#phaseAxisArrow)"/><line x1="74" y1="62" x2="884" y2="62"/><line x1="74" y1="258" x2="884" y2="258"/></g>
   <text className="phase-axis-label" x="889" y="180" textAnchor="end">時間</text><text className="phase-axis-label" x="52" y="33">速度</text><text className="phase-sign plus" x="55" y="67">＋X</text><text className="phase-sign minus" x="55" y="263">－X</text><text className="phase-zero" x="55" y="165">0</text>
   <g className="phase-area plus"><path d="M90 160L190 62H340L440 160Z"/></g><g className="phase-area minus"><path d="M490 160L590 258H740L840 160Z"/></g>
   <g className="phase-profile"><line className="pos-accel" x1="90" y1="160" x2="190" y2="62"/><line className="pos-constant" x1="190" y1="62" x2="340" y2="62"/><line className="pos-decel" x1="340" y1="62" x2="440" y2="160"/><line className="neg-accel" x1="490" y1="160" x2="590" y2="258"/><line className="neg-constant" x1="590" y1="258" x2="740" y2="258"/><line className="neg-decel" x1="740" y1="258" x2="840" y2="160"/></g>
   <g className="phase-stop-points"><circle cx="90" cy="160" r="5"/><circle cx="440" cy="160" r="5"/><circle cx="490" cy="160" r="5"/><circle cx="840" cy="160" r="5"/></g>
   <g className="phase-diagram-labels">
    <g className="pos-accel"><rect x="101" y="92" width="78" height="25" rx="5"/><text x="140" y="109" textAnchor="middle">＋加速</text></g><g className="pos-constant"><rect x="226" y="29" width="78" height="25" rx="5"/><text x="265" y="46" textAnchor="middle">＋定速</text></g><g className="pos-decel"><rect x="350" y="92" width="78" height="25" rx="5"/><text x="389" y="109" textAnchor="middle">＋減速</text></g>
    <g className="neg-accel"><rect x="501" y="203" width="78" height="25" rx="5"/><text x="540" y="220" textAnchor="middle">－加速</text></g><g className="neg-constant"><rect x="626" y="270" width="78" height="25" rx="5"/><text x="665" y="287" textAnchor="middle">－定速</text></g><g className="neg-decel"><rect x="750" y="203" width="78" height="25" rx="5"/><text x="789" y="220" textAnchor="middle">－減速</text></g>
   </g>
   <text className="phase-stop-label" x="90" y="184" textAnchor="middle">停止</text><text className="phase-turn-label" x="465" y="149" textAnchor="middle">折返し</text><text className="phase-stop-label" x="840" y="184" textAnchor="middle">停止</text>
   <text className="phase-direction plus" x="265" y="140" textAnchor="middle">往路　＋X →</text><text className="phase-direction minus" x="665" y="140" textAnchor="middle">← －X　復路</text>
  </svg>
  <div className="phase-cards">{ordered.map(p=><div key={p.id} className={`phase-card phase-${p.id}`}><b>{p.label}</b><span>{descriptions[p.id]}</span><small>a = {fmt(p.accelerationMS2,2)} m/s²　／　距離 {fmt(p.distanceM,3)} m</small></div>)}</div>
  <p className="phase-motion-note">速度線図はフェーズの意味を示す概念図です。各区間の距離と加速度は現在の計算値を表示しています。停止は走行距離0ですが、最大荷重・静的安全率の評価には含まれます。</p>
 </section>
}