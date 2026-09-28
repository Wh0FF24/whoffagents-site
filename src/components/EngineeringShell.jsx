import { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';

const primary = [['/capabilities', 'Capabilities'], ['/research', 'Research'], ['/about', 'Company']];
const services = [['/studio', 'The studio'], ['/web', 'Websites'], ['/agents', 'AI agents'], ['/receptionist', 'AI receptionist'], ['/products', 'Developer tools'], ['/blog', 'Notes & articles']];

export function EngineeringNav() {
  const [open, setOpen] = useState(false);
  const serviceMenu = useRef(null);
  const toggle = useRef(null);
  const { pathname } = useLocation();
  function close() {
    setOpen(false);
    if (serviceMenu.current) serviceMenu.current.open = false;
  }
  return <>
    <a href="#main-content" className="wf-skip">Skip to content</a>
    <header className="wf-header" onKeyDown={event => {
      if (event.key === 'Escape') { close(); toggle.current?.focus(); }
    }}>
      <div className="wf-nav wf-container">
        <Link to="/" aria-label="Whoff Agents home" className="wf-logo" onClick={close}>
          <img src="/brand/whoff-logo.svg" alt="Whoff Agents LLC" width="1065" height="315" />
        </Link>
        <nav className="wf-desktop-links" aria-label="Main navigation">
          {primary.map(([to, label]) => <Link key={to} to={to} onClick={close} aria-current={pathname === to ? 'page' : undefined}>{label}</Link>)}
          <details ref={serviceMenu} className="wf-services-menu">
            <summary>Services & tools <ChevronDown size={13} /></summary>
            <div>{services.map(([to, label]) => <Link key={to} to={to} onClick={close}>{label}<ArrowUpRight size={14} /></Link>)}</div>
          </details>
        </nav>
        <Link to="/contact" className="wf-nav-contact" onClick={close}>Let’s talk <ArrowUpRight size={17} /></Link>
        <button ref={toggle} type="button" className="wf-menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="wf-mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
      <nav id="wf-mobile-navigation" className="wf-mobile-links" aria-label="Mobile navigation" hidden={!open}>
        {primary.map(([to, label]) => <Link key={to} to={to} onClick={close}>{label}<ArrowUpRight size={17}/></Link>)}
        <span>Services & tools</span>
        {services.map(([to, label]) => <Link key={to} to={to} onClick={close}>{label}</Link>)}
        <Link to="/contact" onClick={close}>Let’s talk <ArrowUpRight size={17}/></Link>
      </nav>
    </header>
  </>;
}

export function EngineeringFooter() {
  return <footer className="wf-footer">
    <div className="wf-container">
      <div className="wf-footer-top">
        <Link to="/" className="wf-logo" aria-label="Whoff Agents home"><img src="/brand/whoff-logo.svg" alt="Whoff Agents LLC" width="1065" height="315" /></Link>
        <p>Independent minds.<br/>Useful systems.</p>
        <a href="mailto:will@whoffagents.com">will@whoffagents.com <ArrowUpRight size={18}/></a>
      </div>
      <div className="wf-footer-columns">
        <div><span>Explore</span><Link to="/capabilities">Capabilities</Link><Link to="/research">Research & development</Link><Link to="/about">Company</Link><a href="/downloads/whoff-capabilities.pdf" download>Capability statement ↓</a></div>
        <div><span>Services & tools</span>{services.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}</div>
        <div><span>Contact</span><address>Whoff Agents LLC<br/>1379 Ullainee Rd<br/>Caret, VA 22436</address><a href="mailto:hello@whoffagents.com">Existing projects & support <ArrowUpRight size={12}/></a><a href="tel:+13853180061">+1 385-318-0061 · AI receptionist</a></div>
      </div>
      <div className="wf-footer-bottom"><span>© 2026 Whoff Agents LLC</span><div><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/refund-policy">Refunds</Link></div><div className="wf-colors" aria-hidden="true"><i/><i/><i/><i/></div></div>
    </div>
  </footer>;
}
