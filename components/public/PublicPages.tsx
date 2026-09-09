'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowDown, ArrowLeft, ArrowRight, Box, Braces, CalendarDays, Check, Clock3, FileInput, IndianRupee, Layers3, Mouse, ScanLine, SlidersHorizontal, SquareTerminal, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { rounds, rules } from '@/lib/mock-data';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { PageIntro } from '@/components/ui';

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
const roundSignals: Record<number,string[]> = {
  1: ['VAGUE INPUT','IDENTIFY','QUESTION','STRUCTURE','PRECISE PROMPT'],
  2: ['OUTPUT','ANALYZE','INFER','RECONSTRUCT','PROMPT'],
  3: ['IMAGE','OBSERVE','MAP','DESCRIBE','RECREATE'],
};

function SignalChain({ steps, label }: { steps:string[]; label:string }) { return <motion.div className="round-signal" aria-label={label} initial={{opacity:0,x:16}} whileInView={{opacity:1,x:0}} viewport={{once:true,amount:.55}} transition={{duration:.7,ease:[.16,1,.3,1]}}>{steps.map((step,index)=><div key={step}><span>{step}</span>{index<steps.length-1&&<i/>}</div>)}</motion.div>; }

function RoundEditorial({ round, compact = false }: { round: typeof rounds[number]; compact?: boolean }) { return <motion.article className={`round-editorial ${compact?'compact':''}`} {...reveal}>
  <div className="round-num">{round.code}</div><div className="round-rule"/><div className="round-copy"><p className="eyebrow">ROUND {round.code} / CORE CHALLENGE</p><h3>{round.title}</h3><blockquote>“{round.prompt}”</blockquote><p>{round.description}</p><SignalChain steps={roundSignals[round.id]} label={`Round ${round.code} process`}/><div className="skill-list">{round.skills.map(skill=><span key={skill}>{skill}</span>)}</div><small>EVALUATION / {round.evaluation}</small></div>
  </motion.article>;
}

export function HomePage() { return <PublicLayout><main className="home-main">
  <section className="reference-hero" aria-labelledby="hero-title">
    <Image className="reference-hero-image" src="/prompthon-hero-v2.png" alt="A dark brutalist hall opening to daylight with a laptop displaying a restrained green technical interface" fill priority sizes="100vw"/>
    <div className="reference-hero-shade"/><div className="hero-coordinate-grid" aria-hidden="true"/><div className="hero-measure hero-measure-left" aria-hidden="true"><span/><i/></div>
    <motion.div className="reference-hero-copy" initial={{opacity:0,y:22}} animate={{opacity:1,y:0}} transition={{duration:.9,ease:[.16,1,.3,1]}}>
      <div className="presenter"><span>EASWARI ENGINEERING COLLEGE</span><span>DEPARTMENT OF COMPUTER SCIENCE AND BUSINESS SYSTEMS</span><p><i/>PRESENTS</p></div>
      <h1 id="hero-title"><strong>PROMPTHON</strong><span>2026</span></h1>
      <p className="hero-subtitle">AI PROMPT ENGINEERING HACKATHON</p><i className="copy-rule"/>
      <p className="hero-intro">Turn vague problems into precise instructions.<br/>Reverse-engineer intelligence.<br/>Recreate the impossible.</p>
      <div className="reference-meta" aria-label="Event information">
        <div><CalendarDays/><p><strong>12 SEP 2026</strong><span>SATURDAY</span></p></div>
        <div><Clock3/><p><strong>9:00 AM — 4:00 PM</strong><span>5 HOURS</span></p></div>
        <div><Users/><p><strong>TEAM SIZE</strong><span>1 — 3 MEMBERS</span></p></div>
        <div><IndianRupee/><p><strong>ENTRY FEE</strong><span>₹100</span></p></div>
      </div>
      <div className="hero-actions"><Link className="reference-login" href="/login"><ArrowRight size={18}/>Participant login</Link><a className="reference-explore" href="#challenge">Explore the challenge <ArrowDown size={16}/></a></div>
      <div className="scroll-cue"><Mouse size={20}/><span>SCROLL TO DISCOVER</span></div>
    </motion.div>
    <motion.aside className="hero-wall-note" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.7,duration:.9}} aria-hidden="true">
      <span>HUMAN IDEAS</span><b>+</b><span>AI POSSIBILITIES</span><b>=</b><span>BIGGER SOLUTIONS</span>
    </motion.aside>
    <motion.aside className="hero-side-copy" initial={{opacity:0,x:14}} animate={{opacity:1,x:0}} transition={{delay:.55,duration:.75}} aria-hidden="true"><i/><span>THINK</span><span>ANALYZE</span><span>CREATE</span><span>REFINE</span><span>SOLVE</span></motion.aside>
    <p className="hero-platform-note"><i/>A PLATFORM FOR<br/>THE NEXT GENERATION<br/>OF PROBLEM SOLVERS</p>
  </section>
  <motion.section className="intro-section editorial-section" variants={introSequence} initial="hidden" whileInView="visible" viewport={{once:true,amount:.12}}>
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
  <section id="challenge" className="challenge-teaser"><p><i/>02 / THE CHALLENGE</p><h2>THREE ROUNDS.<br/>THREE WAYS TO THINK.</h2><div><span>ONE SKILL — PRECISION.</span><button aria-label="Previous challenge"><ArrowLeft/></button><button aria-label="Next challenge"><ArrowRight/></button></div></section>
  <section className="rounds-section"><header className="section-heading"><p className="eyebrow"><span>02 / </span>THE CHALLENGE</p><h2>Three rounds.<br/>Three ways to think.<br/><em>One skill — precision.</em></h2></header>{rounds.map(round=><RoundEditorial round={round} key={round.id}/>)}</section>
  <PrizeSection/>
  <motion.section id="contact" className="coordinator-section editorial-section" {...reveal}><div><p className="eyebrow"><span>04 / </span>CONTACT / COORDINATORS</p><h2>Direct line<br/>to the event.</h2><div className="contact-signal" aria-hidden="true"><i/><span>CHANNEL OPEN</span></div></div><div className="contact-list"><a href="tel:+919808144754"><span>Karthick Vamsi</span><strong>98081 44754</strong></a><a href="tel:+919445423155"><span>Hemachandran</span><strong>94454 23155</strong></a></div></motion.section>
  <FinalCta/>
  </main></PublicLayout>; }

function PrizeSection({ index = '03' }: { index?: string }){ return <motion.section className="prize-section" {...reveal}><header className="prize-head"><div><p className="eyebrow"><span>{index} / </span>PRIZES</p><h2>Precision deserves<br/>recognition.</h2></div><p>REWARDING<br/>EXACT THINKING</p></header><div className="prize-stage"><div className="prize-axis" aria-hidden="true"><span>RANK</span><i/><span>RECOGNITION</span></div>{[['02','₹2000','SECOND PLACE'],['01','₹3000','FIRST PLACE'],['03','₹1000','THIRD PLACE']].map(([n,p,l],index)=><motion.div className={`prize prize-${n}`} key={n} initial={{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.35}} transition={{duration:.7,delay:index*.08,ease:[.16,1,.3,1]}}><span>{n}</span><strong>{p}</strong><p>{l}</p></motion.div>)}</div></motion.section>; }
function FinalCta(){ return <section className="final-cta"><div className="closing-system" aria-hidden="true"><span>INPUT</span><i/><span>INTENT</span><i/><span>OUTPUT</span></div><div className="scanline"><ScanLine/></div><p className="eyebrow">&gt; AWAITING INPUT_</p><h2>THINK LIKE A HACKER.<br/><span>PROMPT LIKE A PRO.</span></h2><p>THE CHALLENGE BEGINS WITH A BLANK INPUT.</p><Link className="primary-button" href="/login">Participant login <ArrowRight size={17}/></Link><small className="system-close">PROMPTHON.EXE / READY FOR INITIALIZATION</small></section>; }

export function AboutPage(){ return <PublicLayout><main className="public-page"><PageIntro index="01" eyebrow="ABOUT THE SYSTEM" title="Precision is not a feature. It is the discipline." copy="PROMPTHON 2026 is an official technical event created by the Department of Computer Science and Business Systems, Easwari Engineering College."/><section className="manifesto-grid"><motion.div {...reveal}><p className="big-statement">AI is only as useful as the thinking that directs it.</p></motion.div><motion.div className="prose" {...reveal}><p>Prompthon asks participants to move past casual prompting and work like engineers: uncover ambiguity, define constraints, test assumptions and communicate intent with clarity.</p><p>The competition is designed for students in Grades 9—12 and rewards thoughtful iteration over lucky output.</p></motion.div></section><section className="principles"><p className="eyebrow">COMPETITION PRINCIPLES</p>{[['01','Discover before directing'],['02','Make constraints explicit'],['03','Prove every result'],['04','Optimize for useful output']].map(([n,t])=><div key={n}><span>{n}</span><h3>{t}</h3><Check size={18}/></div>)}</section><section className="institution-block"><div><p className="eyebrow">ORGANIZED BY</p><h2>Department of Computer Science<br/>and Business Systems</h2></div><p>Easwari Engineering College<br/>12 September 2026</p></section></main></PublicLayout>; }

export function RoundsPage(){ return <PublicLayout><main className="public-page"><PageIntro index="02" eyebrow="THE CHALLENGE" title="Three tests of exact thinking." copy="Each round isolates a different prompt-engineering skill. Progression is controlled by organizer review."/><section className="rounds-page-list">{rounds.map(round=><RoundEditorial round={round} compact key={round.id}/>)}</section><section className="qualification-flow"><p className="eyebrow">QUALIFICATION LOGIC</p><div><span>ROUND 01</span><ArrowRight/><span>ADMIN REVIEW</span><ArrowRight/><span className="accent">APPROVED</span><ArrowRight/><span>ROUND 02 UNLOCKED</span></div><div className="muted-path"><span>REJECTED</span><ArrowRight/><span>COMPETITION ENDS FOR TEAM</span></div></section></main></PublicLayout>; }

export function RulesPage(){ return <PublicLayout><main className="public-page"><PageIntro index="03" eyebrow="RULES & GUIDELINES" title="Clear constraints. Fair evaluation." copy="The operating principles that keep every round focused, comparable and transparent."/><section className="rules-list">{rules.map(([n,title,copy])=><motion.article key={n} {...reveal}><span>{n}</span><h2>{title}</h2><p>{copy}</p></motion.article>)}</section><section className="rules-note"><p className="eyebrow">FINAL AUTHORITY</p><h2>The decision of the organizers and judges is final and binding.</h2></section></main></PublicLayout>; }

export function PrizesPage(){ return <PublicLayout><main className="public-page"><PageIntro index="04" eyebrow="PRIZES" title="Precision, recognized." copy="Three placements. One shared standard: exceptional command of context, structure and intent."/><PrizeSection index="04"/><section className="evaluation-matrix"><p className="eyebrow">EVALUATION LENS</p>{rounds.map(r=><div key={r.id}><span>ROUND {r.code}</span><strong>{r.title}</strong><p>{r.evaluation}</p></div>)}</section><FinalCta/></main></PublicLayout>; }
