'use client';

/* eslint-disable @next/next/no-html-link-for-pages -- Public login CTAs intentionally use document navigation for Cloudflare Worker route compatibility. */

import Link from 'next/link';
import { ArrowRight, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const links = [
  { label:'Home', href:'/#home', section:'home' },
  { label:'About', href:'/#about', section:'about' },
  { label:'Rounds', href:'/#challenge', section:'challenge' },
  { label:'Rules', href:'/#rules', section:'rules' },
  { label:'Prizes', href:'/#prizes', section:'prizes' },
  { label:'Contact', href:'/#contact', section:'contact' },
];

export function PublicHeader() {
  const [open,setOpen] = useState(false);
  const [activeSection,setActiveSection] = useState('home');
  const pathname = usePathname();

  useEffect(()=>{
    if(pathname!=='/') return;
    const sections = links.map(({section})=>document.getElementById(section)).filter((section): section is HTMLElement=>Boolean(section));
    const observer = new IntersectionObserver(entries=>{
      const visible = entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(visible) setActiveSection(visible.target.id);
    },{rootMargin:'-28% 0px -58% 0px',threshold:[0,.08,.2]});
    sections.forEach(section=>observer.observe(section));
    return ()=>observer.disconnect();
  },[pathname]);

  return <header className="public-nav">
    <Link className="wordmark public-brand" href="/" aria-label="PROMPTHON home"><span className="prompthon-symbol" aria-hidden="true"><i/><b/></span><span><strong>PROMPTHON</strong><small>THINK &gt; PROMPT &gt; SOLVE</small></span></Link>
    <nav className="desktop-nav" aria-label="Primary navigation">{links.map(({label,href,section})=><Link className={pathname==='/'&&activeSection===section?'active':''} onClick={()=>setActiveSection(section)} key={href} href={href}>{label}</Link>)}</nav>
    <a className="nav-login" href="/login"><ArrowRight size={15}/> Participant login</a>
    <button className="menu-button" onClick={()=>setOpen(true)} aria-label="Open menu"><Menu size={20}/></button>
    <AnimatePresence>{open && <motion.div className="mobile-menu" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><div className="mobile-menu-top"><span>PROMPTHON / MENU</span><button onClick={()=>setOpen(false)} aria-label="Close menu"><X/></button></div><nav>{links.map(({label,href,section},i)=><motion.div key={href} initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}} transition={{delay:i*.06}}><Link href={href} onClick={()=>{setActiveSection(section);setOpen(false)}}><span>0{i+1}</span>{label}</Link></motion.div>)}<a className="primary-button" href="/login">Participant login <ArrowRight size={17}/></a></nav></motion.div>}</AnimatePresence>
  </header>;
}

export function PublicFooter() {
  return <footer className="public-footer">
    <div className="footer-main">
      <div className="footer-identity"><Link className="wordmark" href="/#home"><span className="prompthon-symbol" aria-hidden="true"><i/><b/></span><span>PROMPTHON 2026</span></Link><p>AI PROMPT ENGINEERING HACKATHON</p></div>
      <p className="footer-statement">Precision in thought.<br/>Possibility in every prompt.</p>
      <nav aria-label="Footer navigation">{links.slice(1).map(({label,href})=><Link key={href} href={href}>{label}</Link>)}<a href="/login">Participant login</a></nav>
    </div>
    <div className="footer-meta"><p>EASWARI ENGINEERING COLLEGE<br/><span>DEPARTMENT OF COMPUTER SCIENCE AND BUSINESS SYSTEMS</span></p><p>12 SEPTEMBER 2026<br/><span>CHENNAI / INDIA</span></p></div>
    <div className="footer-rail"><i/><a className="footer-powered" href="http://neuralweblabs.com/" target="_blank" rel="noopener noreferrer"><span>Powered by</span><strong>NeuralWeb Labs</strong></a><i/></div>
  </footer>;
}

export function PublicLayout({ children }: { children: React.ReactNode }) { return <div className="site-shell"><PublicHeader/>{children}<PublicFooter/></div>; }
