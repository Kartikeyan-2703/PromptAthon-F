'use client';

import Link from 'next/link';
import { ArrowRight, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

const links = [['Home','/'],['About','/about'],['Rounds','/rounds'],['Rules','/rules'],['Prizes','/prizes'],['Contact','/#contact']];

export function PublicHeader() {
  const [open,setOpen] = useState(false);
  const pathname = usePathname();
  return <header className="public-nav">
    <Link className="wordmark public-brand" href="/" aria-label="PROMPTHON home"><span className="prompthon-symbol" aria-hidden="true"><i/><b/></span><span><strong>PROMPTHON</strong><small>THINK &gt; PROMPT &gt; SOLVE</small></span></Link>
    <nav className="desktop-nav" aria-label="Primary navigation">{links.map(([label,href])=><Link className={(!href.includes('#')&&(href==='/'?pathname==='/':pathname===href))?'active':''} key={href} href={href}>{label}</Link>)}</nav>
    <Link className="nav-login" href="/login"><ArrowRight size={15}/> Participant login</Link>
    <button className="menu-button" onClick={()=>setOpen(true)} aria-label="Open menu"><Menu size={20}/></button>
    <AnimatePresence>{open && <motion.div className="mobile-menu" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><div className="mobile-menu-top"><span>PROMPTHON / MENU</span><button onClick={()=>setOpen(false)} aria-label="Close menu"><X/></button></div><nav>{links.map(([label,href],i)=><motion.div key={href} initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}} transition={{delay:i*.06}}><Link href={href} onClick={()=>setOpen(false)}><span>0{i+1}</span>{label}</Link></motion.div>)}<Link className="primary-button" href="/login" onClick={()=>setOpen(false)}>Participant login <ArrowRight size={17}/></Link></nav></motion.div>}</AnimatePresence>
  </header>;
}

export function PublicFooter() {
  return <footer className="public-footer"><div><Link className="wordmark" href="/"><span className="brand-mark">P</span><span>PROMPTHON 2026</span></Link><p>AI Prompt Engineering Hackathon</p></div><div><p>Easwari Engineering College</p><p>Department of Computer Science and Business Systems</p><p>12 September 2026</p></div><nav>{links.slice(1,4).map(([l,h])=><Link key={h} href={h}>{l}</Link>)}<Link href="/login">Participant login</Link></nav></footer>;
}

export function PublicLayout({ children }: { children: React.ReactNode }) { return <div className="site-shell"><PublicHeader/>{children}<PublicFooter/></div>; }
