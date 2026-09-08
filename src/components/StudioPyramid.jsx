import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowDown, Pause, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { deferScene } from '../utils/deferScene';
import '../styles/studio-pyramid.css';
const services = [['Websites','Distinct by design. Built to work.','/web'],['AI agents','Useful help for everyday work.','/agents'],['Developer tools','Less setup. More making.','/products']];
export default function StudioPyramid(){
  const [selected,setSelected]=useState(0); const selectedRef=useRef(0);
  const select=(index)=>{selectedRef.current=index;setSelected(index);scene.current?.select(index);};
  const host=useRef(null), scene=useRef(null), section=useRef(null), pausedRef=useRef(false);
  const [state,setState]=useState('loading'), [paused,setPaused]=useState(false), [opened,setOpened]=useState(false);
  useEffect(()=>{
    let dead=false;
    const media=matchMedia('(prefers-reduced-motion: reduce)');
    const sync=()=>scene.current?.setReduced(media.matches);
    const cancel=deferScene(()=>import('./pyramidScene').then(({createPyramidScene})=>{
      if(dead)return;
      scene.current=createPyramidScene(host.current,()=>setState('fallback'),index=>{selectedRef.current=index;setSelected(index);scene.current?.select(index);});
      sync();if(selectedRef.current)scene.current?.select(selectedRef.current);scroll();setState(scene.current?'ready':'fallback');
    }).catch(()=>{if(!dead)setState('fallback');}));
    const scroll=()=>{if(pausedRef.current||media.matches||!matchMedia("(min-width: 801px) and (min-height: 700px)").matches)return; const rect=section.current.getBoundingClientRect(); const travel=rect.height-(innerHeight-86); const progress=Math.max(0,Math.min(1,(86-rect.top)/Math.max(1,travel*.8))); const index=Math.min(2,Math.floor(progress*3)); if(selectedRef.current!==index){selectedRef.current=index;setSelected(index);scene.current?.select(index);} scene.current?.setOpen(progress); setOpened(progress>=.5);};
    media.addEventListener('change',sync);window.addEventListener('scroll',scroll,{passive:true});
    return()=>{dead=true;cancel();scene.current?.dispose();media.removeEventListener('change',sync);window.removeEventListener('scroll',scroll);};
  },[]);
  return <section ref={section} className="py-hero" data-scene={state}>
    <div className="py-stage"><div className="py-heading"><p>INDEPENDENT MINDS. EXCEPTIONAL WORK.</p><h1>A different<br/>kind of <em>studio.</em></h1><p>Distinctive websites. Useful AI. Thoughtfully built tools.<br/>Human direction, with the power to build beyond it.</p><div className="py-service-picker" role="group" aria-label="Explore a studio service">{services.map(([name],index)=><button key={name} aria-pressed={selected===index} onClick={()=>select(index)}>{name}</button>)}</div>
<div className="py-service-detail" aria-live="polite" aria-atomic="true"><p>{['A website that captures your character and makes the next step clear. Explore our designs, process, and website packages.','Put a defined job in capable hands. Explore phone intake, email assistance, and everyday automation.','Start closer to the finish. Browse practical developer tools, starter kits, and free resources.'][selected]}</p><Link className="py-primary" to={services[selected][2]}>{['Explore our work','Find your AI use case','Browse developer tools'][selected]} <ArrowUpRight size={19}/></Link></div><span className="py-scroll-note"><ArrowDown size={13}/> SCROLL THROUGH OUR SERVICES · OR SELECT A FACE</span></div>
    <div className="py-sculpture"><span className="py-object-note" aria-hidden="true">0{selected+1} — {services[selected][0].toUpperCase()}</span><div ref={host} className="py-canvas" aria-hidden="true" />{state!=='ready'&&<svg className="py-poster" viewBox="0 0 500 500" aria-hidden="true"><path d="M250 55 70 365 275 438Z" fill="#003da5" stroke="#c0c0c0" strokeWidth="3"/><path d="M250 55 435 340 275 438Z" fill="#c8102e" stroke="#e1bd70" strokeWidth="3"/><path d="M70 365 435 340 275 438Z" fill="#091c36" stroke="#c0c0c0" strokeWidth="2"/></svg>}
    <div className="py-controls"><button onClick={()=>{setOpened(!opened);scene.current?.setOpen(opened?0:1,true);}} aria-pressed={opened}>{opened?'Close the pyramid':'Open the pyramid'} <ArrowUpRight size={14}/></button>{state==='ready'&&<button onClick={()=>{pausedRef.current=!paused;setPaused(!paused);scene.current?.setPaused(!paused);}}>{paused?<Play size={12}/>:<Pause size={12}/>} {paused?'Resume motion':'Pause motion'}</button>}</div></div>
    <div className="py-directions">{services.map(([name,detail,url],i)=><Link to={url} key={url} onMouseEnter={()=>select(i)} onFocus={()=>select(i)} data-selected={selected===i}><span>0{i+1} /</span><h2>{name}<ArrowUpRight size={21}/></h2><p>{detail}</p></Link>)}</div>
  </div></section>;
}
