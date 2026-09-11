'use client';

/* eslint-disable @next/next/no-html-link-for-pages -- Public login CTAs intentionally use document navigation for Cloudflare Worker route compatibility. */
import Image from 'next/image';
import { ArrowDown, ArrowRight, Box, Braces, CalendarDays, CircleHelp, Clock3, Eye, FileInput, FileText, GitBranch, ImageIcon, IndianRupee, Layers3, Lightbulb, ListChecks, MessageSquareText, Mouse, Search, ShieldCheck, SlidersHorizontal, SquareTerminal, Users, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { roundRules, rounds } from '@/lib/mock-data';
import { PublicLayout } from '@/components/layout/PublicLayout';

const reveal = { initial:{opacity:0,y:24}, whileInView:{opacity:1,y:0}, viewport:{once:true,amount:.18}, transition:{duration:.65,ease:[.16,1,.3,1] as const} };
const introSequence = { hidden:{}, visible:{transition:{staggerChildren:.12,delayChildren:.08}} };
const introItem = { hidden:{opacity:0,y:18}, visible:{opacity:1,y:0,transition:{duration:.65,ease:[.16,1,.3,1] as const}} };
const promptPipeline = [
  { step:'INPUT', copy:'Vague problem or observation', Icon:FileInput },
  { step:'CONTEXT', copy:'Identify missing information', Icon:Layers3 },
  { step:'CONSTRAINTS', copy:'Define boundaries and requirements', Icon:SlidersHorizontal },
  { step:'PROMPT', copy:'Structure a precise prompt', Icon:SquareTerminal },
  { step:'OUTPUT', copy:'Accurate, useful result', Icon:Box },
];
type RoundPipelineStep = { label:string; copy:string; Icon:LucideIcon };
const roundSignals: Record<number,RoundPipelineStep[]> = {
  1: [
    { label:'VAGUE INPUT', copy:'A broad or unclear problem statement.', Icon:MessageSquareText },
    { label:'IDENTIFY', copy:'Find missing information.', Icon:Search },
    { label:'QUESTION', copy:'Determine what to ask.', Icon:CircleHelp },
    { label:'STRUCTURE', copy:'Organize into a precise prompt.', Icon:Layers3 },
    { label:'PRECISE PROMPT', copy:'A complete and effective prompt.', Icon:FileText },
  ],
  2: [
    { label:'OUTPUT', copy:'An AI-generated response.', Icon:FileText },
    { label:'ANALYZE', copy:'Study structure, tone and content.', Icon:Search },
    { label:'INFER', copy:'Identify possible intent and constraints.', Icon:Lightbulb },
    { label:'RECONSTRUCT', copy:'Rebuild the original prompt.', Icon:GitBranch },
    { label:'PROMPT', copy:'A faithful reconstructed prompt.', Icon:SquareTerminal },
  ],
  3: [
    { label:'IMAGE', copy:'A reference image as input.', Icon:ImageIcon },
    { label:'OBSERVE', copy:'Identify key objects and relationships.', Icon:Eye },
    { label:'MAP', copy:'Understand composition and structure.', Icon:GitBranch },
    { label:'DESCRIBE', copy:'Translate into detailed language.', Icon:ListChecks },
    { label:'RECREATE', copy:'A precise image-generation prompt.', Icon:Box },
  ],
};
const roundAnnotations: Record<number,{left:string[];right:string[]}> = {
  1:{left:['FIND',"WHAT'S",'MISSING'],right:['INFORMATION GAPS','CREATE OPPORTUNITIES.']},
  2:{left:['REVERSE','ENGINEER','INTELLIGENCE'],right:['EVERY OUTPUT','HAS A REASON.']},
  3:{left:['SEE','UNDERSTAND','TRANSLATE'],right:['VISUAL THINKING','MEETS','LINGUISTIC PRECISION.']},
};

function SignalChain({ steps, label }: { steps:RoundPipelineStep[]; label:string }) { return <motion.div className="round-signal" aria-label={label} initial="hidden" whileInView="visible" viewport={{once:true,amount:.45}} variants={{hidden:{opacity:0,y:16},visible:{opacity:1,y:0,transition:{duration:.65,staggerChildren:.08,ease:[.16,1,.3,1]}}}}><div className="round-pipeline-track" aria-hidden="true"/>{steps.map(({label:step,copy,Icon},index)=><motion.div className="round-pipeline-node" key={step} variants={{hidden:{opacity:0,y:10},visible:{opacity:1,y:0}}}><span>{String(index+1).padStart(2,'0')}</span><div className="round-pipeline-icon"><Icon size={21} strokeWidth={1.45}/></div><strong>{step}</strong><small>{copy}</small>{index<steps.length-1&&<i/>}</motion.div>)}</motion.div>; }

function RoundEditorial({ round, compact = false }: { round: typeof rounds[number]; compact?: boolean }) { return <motion.article className={`round-editorial ${compact?'compact':''}`} {...reveal}>
  <div className="round-num"><strong>{round.code}</strong><span>{roundAnnotations[round.id].left.map(line=><i key={line}>{line}</i>)}</span></div><div className="round-rule"/><div className="round-copy"><p className="eyebrow">ROUND {round.code} / CORE CHALLENGE</p><h3>{round.title}</h3><blockquote>“{round.prompt}”</blockquote><p>{round.description}</p><SignalChain steps={roundSignals[round.id]} label={`Round ${round.code} process`}/>{compact&&<><div className="skill-list">{round.skills.map(skill=><span key={skill}>{skill}</span>)}</div><small>EVALUATION / {round.evaluation}</small></>}</div><aside className="round-side-note" aria-hidden="true"><i/>{roundAnnotations[round.id].right.map(line=><span key={line}>{line}</span>)}</aside>
  </motion.article>;
}

function ChallengeSection(){ return <section id="challenge" className="rounds-section"><div className="rounds-scene" aria-hidden="true"><div className="rounds-scene-sticky"><div className="rounds-architecture"/><div className="rounds-atmosphere"/></div></div><header className="section-heading"><aside aria-hidden="true"><i/><span>IDEAS</span><span>PROMPTS</span><span>OUTPUTS</span><span>IMPACT</span></aside><div><p className="eyebrow"><span>02 / </span>THE CHALLENGE</p><h2>Three rounds.<br/>Three ways to think.<br/><em>One skill — precision.</em></h2></div><aside aria-hidden="true"><i/><span>THINK</span><span>ANALYZE</span><span>CREATE</span><span>REFINE</span><span>SOLVE</span></aside></header>{rounds.map(round=><RoundEditorial round={round} key={round.id}/>)}<div className="rounds-footer-rail" aria-hidden="true"><span>SCROLL TO EXPLORE MORE.</span><i/><span>MORE THAN A HACKATHON.<br/>A THINKING REVOLUTION.</span></div></section>; }

function RulesSection(){
  const [selected,setSelected]=useState<number|null>(null);
  const regulation=selected ? roundRules[selected-1] : null;

  useEffect(()=>{
    if(!selected)return;
    const previousOverflow=document.body.style.overflow;
    const closeOnEscape=(event:KeyboardEvent)=>{if(event.key==='Escape')setSelected(null)};
    document.body.style.overflow='hidden';
    window.addEventListener('keydown',closeOnEscape);
    return()=>{document.body.style.overflow=previousOverflow;window.removeEventListener('keydown',closeOnEscape)};
  },[selected]);

  return <>
    <motion.section id="rules" className="home-rules home-round-rulebook home-round-rulebook-compact" {...reveal}>
      <header><p className="eyebrow">RULES / ROUND PROTOCOLS</p><h2>Know the rules.<br/>Compete precisely.</h2><p>Select a round to review its permitted tools, submission format and qualification conditions.</p></header>
      <div className="home-rule-rounds" aria-label="Competition round rules">{roundRules.map((item)=><button type="button" aria-haspopup="dialog" onClick={()=>setSelected(item.round)} key={item.round}><span>{item.code}</span><small>ROUND {item.code}</small><strong>{item.title}</strong><p>{item.subtitle}</p><ArrowRight size={16}/></button>)}</div>
      <footer><ShieldCheck size={15}/><span>FINAL AUTHORITY</span><p>The decision of the organizers and jury is final and binding.</p></footer>
    </motion.section>
    <AnimatePresence>{regulation&&<motion.div className="home-rule-modal-backdrop" role="presentation" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onMouseDown={()=>setSelected(null)}>
      <motion.section className="home-rule-modal" role="dialog" aria-modal="true" aria-labelledby={`round-${regulation.code}-rules-title`} initial={{opacity:0,y:24,scale:.985}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:14,scale:.99}} transition={{duration:.35,ease:[.16,1,.3,1]}} onMouseDown={(event)=>event.stopPropagation()}>
        <header className="home-rule-modal-head"><div><p className="eyebrow">ROUND {regulation.code} / RULES & REGULATIONS</p><h3 id={`round-${regulation.code}-rules-title`}>{regulation.title}</h3><span>{regulation.subtitle}</span></div><button type="button" onClick={()=>setSelected(null)} aria-label="Close rules popup" autoFocus><X size={18}/></button></header>
        <div className="home-rule-modal-body"><p className="home-rule-modal-intro">{regulation.intro}</p><ol>{regulation.rules.map((rule,index)=><li key={rule}><span>{String(index+1).padStart(2,'0')}</span><p>{rule}</p></li>)}</ol><footer><ShieldCheck size={15}/><p>The organizers and jury retain final authority over qualification and disqualification decisions.</p></footer></div>
      </motion.section>
    </motion.div>}</AnimatePresence>
  </>;
}

export function HomePage() { return <PublicLayout><main className="home-main">
  <section id="home" className="reference-hero" aria-labelledby="hero-title">
    <Image className="reference-hero-image" src="/prompthon-hero-v2.png" alt="A dark brutalist hall opening to daylight with a laptop displaying a restrained green technical interface" fill priority sizes="100vw"/>
    <div className="reference-hero-shade"/><div className="hero-coordinate-grid" aria-hidden="true"/><div className="hero-measure hero-measure-left" aria-hidden="true"><span/><i/></div>
    <motion.div className="reference-hero-copy" initial={false} animate={{opacity:1,y:0}} transition={{duration:.55,ease:[.16,1,.3,1]}}>
      <div className="hero-heading-block">
        <div className="presenter"><span>EASWARI ENGINEERING COLLEGE</span><span>DEPARTMENT OF COMPUTER SCIENCE AND BUSINESS SYSTEMS</span><p><i/>PRESENTS</p></div>
        <h1 id="hero-title"><strong>PROMPTHON</strong><span>2026</span></h1>
        <p className="hero-subtitle">AI PROMPT ENGINEERING HACKATHON</p>
      </div>
      <div className="hero-information-block">
        <i className="copy-rule"/>
        <p className="hero-intro">Turn vague problems into precise instructions.<br/>Reverse-engineer intelligence.<br/>Recreate the impossible.</p>
        <div className="reference-meta" aria-label="Event information">
          <div><CalendarDays/><p><strong>12 SEP 2026</strong><span>SATURDAY</span></p></div>
          <div><Clock3/><p><strong>9:00 AM — 4:00 PM</strong><span>5 HOURS</span></p></div>
          <div><Users/><p><strong>TEAM SIZE</strong><span>1 — 3 MEMBERS</span></p></div>
          <div><IndianRupee/><p><strong>ENTRY FEE</strong><span>₹100</span></p></div>
        </div>
      </div>
      <div className="hero-actions"><a className="reference-login" href="/login"><ArrowRight size={18}/>Participant login</a><a className="reference-explore" href="#challenge">Explore the challenge <ArrowDown size={16}/></a></div>
      <div className="scroll-cue"><Mouse size={20}/><span>SCROLL TO DISCOVER</span></div>
    </motion.div>
    <motion.aside className="hero-wall-note" initial={false} animate={{opacity:1}} aria-hidden="true">
      <span>HUMAN IDEAS</span><b>+</b><span>AI POSSIBILITIES</span><b>=</b><span>BIGGER SOLUTIONS</span>
    </motion.aside>
    <motion.aside className="hero-side-copy" initial={false} animate={{opacity:1,x:0}} aria-hidden="true"><i/><span>THINK</span><span>ANALYZE</span><span>CREATE</span><span>REFINE</span><span>SOLVE</span></motion.aside>
    <p className="hero-platform-note"><i/>A PLATFORM FOR<br/>THE NEXT GENERATION<br/>OF PROBLEM SOLVERS</p>
  </section>
  <motion.section id="about" className="intro-section editorial-section" variants={introSequence} initial="hidden" whileInView="visible" viewport={{once:true,amount:.12}}>
    <Image className="intro-architecture" src="/prompthon-about-environment.png" alt="" fill sizes="100vw" aria-hidden="true"/>
    <div className="intro-architecture-shade" aria-hidden="true"/>
    <motion.div className="section-index" variants={introItem}><span>01</span><b>WHAT IS<br/>PROMPTHON?</b></motion.div>
    <motion.div className="intro-grid-reveal" variants={introItem} aria-hidden="true"><i/><span/><b/></motion.div>
    <div className="intro-heading">
      <motion.p className="eyebrow" variants={introItem}><span>01 / </span>WHAT IS PROMPTHON?</motion.p>
      <motion.h2 variants={introItem}>Beyond asking.<br/>Into engineering.</motion.h2>
      <motion.p className="intro-standard" variants={introItem}>SAME QUESTIONS. A HIGHER STANDARD.</motion.p>
    </div>
    <motion.div className="intro-copy" variants={introItem}><p className="large-copy">Prompthon is an AI prompt engineering challenge where participants learn to think beyond simply asking AI questions.</p><p>Competitors discover missing information, formulate precise prompts, reverse-engineer outputs and translate visual observations into structured instructions.</p><motion.div className="code-note" variants={introItem}><Braces size={18}/><span>clarity + context + constraints = precision</span></motion.div></motion.div>
    <motion.div className="about-blueprint" variants={introItem} aria-hidden="true">
      <header><span><em>PROMPT PIPELINE</em> / LOGIC MAP</span><b>SYS.01</b><small>FROM AMBIGUITY<br/>TO IMPACT</small></header>
      <div className="blueprint-schematic"><div className="blueprint-signal"/>{promptPipeline.map(({step,copy,Icon},index)=><div className="blueprint-stage" key={step}><span>{String(index+1).padStart(2,'0')}</span><div className="pipeline-glyph"><Icon size={19} strokeWidth={1.45}/></div><strong>{step}</strong><small>{copy}</small><i/></div>)}</div>
    </motion.div>
    <aside className="intro-annotation intro-annotation-left" aria-hidden="true"><i/><span>HUMAN IDEAS</span><b>+</b><span>AI POSSIBILITIES</span><b>=</b><span>BIGGER SOLUTIONS</span></aside>
    <aside className="intro-annotation intro-annotation-right" aria-hidden="true"><i/><span>THINK</span><span>ANALYZE</span><span>CREATE</span><span>REFINE</span><span>SOLVE</span></aside>
    <aside className="intro-footer-note intro-footer-left" aria-hidden="true"><i/><span>ENGINEERING<br/>A MORE CAPABLE<br/>TOMORROW.</span></aside>
    <aside className="intro-footer-note intro-footer-right" aria-hidden="true"><i/><span>PRECISION<br/>BUILDS<br/>POSSIBILITIES.</span></aside>
    <div className="intro-footer-rail" aria-hidden="true"><span><i/>MORE THAN A HACKATHON.</span><b/><span>A THINKING REVOLUTION.</span></div>
  </motion.section>
  <ChallengeSection/>
  <RulesSection/>
  <PrizeSection/>
  <motion.section id="contact" className="coordinator-section editorial-section" {...reveal}><div><p className="eyebrow"><span>04 / </span>CONTACT / COORDINATORS</p><h2>Direct line<br/>to the event.</h2><div className="contact-signal" aria-hidden="true"><i/><span>CHANNEL OPEN</span></div></div><div className="contact-list"><a href="tel:+919808144754"><span>Karthick Vamsi</span><strong>98081 44754</strong></a><a href="tel:+919445423155"><span>Hemachandran</span><strong>94454 23155</strong></a></div></motion.section>
  <FinalCta/>
  </main></PublicLayout>; }

const prizePlacements = [
  { rank:'02', order:'SECOND', amount:'₹2000', place:'SECOND PLACE', copy:['SHARP','THINKERS','BRIGHTER','TOMORROWS.'] },
  { rank:'01', order:'FIRST', amount:'₹3000', place:'FIRST PLACE', copy:['BIGGER','IDEAS','BOLDER','POSSIBILITIES.'] },
  { rank:'03', order:'THIRD', amount:'₹1000', place:'THIRD PLACE', copy:['GOOD','THINKING','GOES','A LONG WAY.'] },
];

function PrizeBlock({ prize, position }: { prize:typeof prizePlacements[number]; position:number }) {
  return <motion.article
    className={`prize-monolith prize-monolith-${prize.rank}`}
    initial={{opacity:0,y:70}}
    whileInView={{opacity:1,y:0}}
    viewport={{once:true,amount:.28}}
    transition={{duration:.9,delay:.22 + position*.1,ease:[.16,1,.3,1]}}
  >
    <div className="prize-monolith-top" aria-hidden="true"/>
    <div className="prize-monolith-side" aria-hidden="true"/>
    <div className="prize-monolith-face">
      <span>{prize.rank} / {prize.order}</span>
      <strong>{prize.amount}</strong>
      <p>{prize.place}</p>
      <i/>
      <small>{prize.copy.map(line=><b key={line}>{line}</b>)}</small>
    </div>
    <div className="prize-floor-reflection" aria-hidden="true"/>
  </motion.article>;
}

function PrizeSection(){ return <motion.section id="prizes" className="prize-section" aria-labelledby="prizes-heading" initial="hidden" whileInView="visible" viewport={{once:true,amount:.12}} variants={{hidden:{opacity:0},visible:{opacity:1,transition:{duration:.8,staggerChildren:.1}}}}>
  <Image className="prize-environment" src="/prompthon-prizes-environment.png" alt="" fill sizes="100vw" aria-hidden="true"/>
  <div className="prize-environment-shade" aria-hidden="true"/>
  <div className="prize-technical-grid" aria-hidden="true"/>
  <div className="prize-ghost-numbers" aria-hidden="true"><span>02</span><span>01</span><span>03</span></div>
  <div className="prize-scene">
    <motion.header className="prize-copy" variants={introItem}>
      <p className="eyebrow"><span>03 / </span>PRIZES</p>
      <h2 id="prizes-heading">Precision deserves<br/>recognition.</h2>
      <i/>
      <p>Great thinking deserves greater opportunities.<br/>Compete. Create. Solve. And take home rewards<br/>that fuel your next big idea.</p>
      <small>IDEAS<br/>TODAY<br/>A BRIGHTER<br/>TOMORROW.</small>
    </motion.header>
    <aside className="prize-annotation" aria-hidden="true"><i/><div><span>REWARDING<br/>EXACT THINKING.</span><b>{'//'}</b><span>SAME QUESTIONS.<br/>A HIGHER<br/>STANDARD.</span></div></aside>
    <div className="prize-stage">{prizePlacements.map((prize,index)=><PrizeBlock prize={prize} position={index} key={prize.rank}/>)}</div>
    <div className="prize-horizon" aria-hidden="true"><i/><span/></div>
    <footer className="prize-footer-rail" aria-hidden="true">
      <span className="prize-scroll"><Mouse size={16}/>SCROLL TO EXPLORE</span>
      <span><i/>PROMPTHON 2026</span>
      <b/>
      <span>THINK DEEPER.<br/>SOLVE BOLDER.</span>
      <span>PRECISION<br/>BUILDS<br/>POSSIBILITIES.</span>
    </footer>
  </div>
</motion.section>; }
function ClosingPanel({ side }: { side:'input'|'output' }) {
  const isInput = side === 'input';
  return <motion.aside className={`closing-panel closing-panel-${side}`} aria-hidden="true" initial={{opacity:0,x:isInput?-34:34,y:12}} whileInView={{opacity:1,x:0,y:0}} viewport={{once:true,amount:.35}} transition={{duration:.9,delay:.3,ease:[.16,1,.3,1]}}>
    <div className="closing-panel-dots"><i/><i/><i/></div>
    <span>{isInput?'INPUT':'OUTPUT'}</span>
    <p><b>&gt;</b>{isInput?<><em>A BLANK INPUT</em><em>CAN LEAD TO</em><em>A BRIGHTER</em><em>TOMORROW.</em></>:<><em>SOLUTIONS</em><em>IDEAS</em><em>OPPORTUNITIES</em><em>REAL IMPACT</em></>}</p>
    <small>_</small>
  </motion.aside>;
}

function FinalCta(){ return <motion.section className="final-cta" aria-labelledby="closing-heading" initial="hidden" whileInView="visible" viewport={{once:true,amount:.2}} variants={{hidden:{opacity:0},visible:{opacity:1,transition:{duration:.8,staggerChildren:.11}}}}>
  <Image className="closing-environment" src="/prompthon-closing-environment.png" alt="" fill sizes="100vw" aria-hidden="true"/>
  <div className="closing-environment-light" aria-hidden="true"/>
  <div className="closing-particles" aria-hidden="true"/>
  <ClosingPanel side="input"/><ClosingPanel side="output"/>
  <aside className="closing-note closing-note-left" aria-hidden="true"><i/>IDEAS<br/>PROMPTS<br/>PEOPLE<br/>IMPACT</aside>
  <aside className="closing-note closing-note-right" aria-hidden="true"><i/>SAME<br/>QUESTIONS.<br/>BIGGER<br/>POSSIBILITIES.</aside>
  <aside className="closing-note closing-note-process" aria-hidden="true"><i/>THINK<br/>ANALYZE<br/>CREATE<br/>SOLVE<br/>REPEAT</aside>
  <motion.div className="closing-content" variants={introItem}>
    <p className="closing-kicker"><i/>PROMPTHON 2026<i/></p>
    <h2 id="closing-heading">THINK LIKE A HACKER.<br/><span>PROMPT LIKE A PRO.</span></h2>
    <p className="closing-subtitle">THE CHALLENGE BEGINS WITH A BLANK INPUT.</p>
    <a className="closing-login" href="/login"><span>[</span><ArrowRight size={16}/>PARTICIPANT LOGIN<span>]</span></a>
    <p className="closing-keywords">IDEAS&nbsp; / &nbsp;INNOVATION&nbsp; / &nbsp;INTELLIGENCE&nbsp; / &nbsp;IMPACT</p>
  </motion.div>
  <div className="closing-platform-copy" aria-hidden="true"><i/>FROM CURIOSITY TO CLARITY&nbsp;&nbsp; // &nbsp;&nbsp;FROM PROMPTS TO POSSIBILITIES<i/></div>
  <footer className="closing-footer-notes" aria-hidden="true"><span><i/>POWERED BY<br/>A COMMUNITY THAT<br/>BUILDS TOMORROW.</span><span><i/>MORE THAN<br/>A HACKATHON.<br/>A THINKING REVOLUTION.</span></footer>
</motion.section>; }
