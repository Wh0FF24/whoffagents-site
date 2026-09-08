import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
export function StudioLogo() {
  return (
    <img
      className="st-official-logo"
      src="/brand/whoff-logo.svg"
      width="1065"
      height="315"
      alt=""
    />
  );
}
export default function StudioNav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const links = [
    ["/web", "Websites"],
    ["/agents", "AI agents"],
    ["/receptionist", "AI receptionist"],
    ["/products", "Developer tools"],
    ["/about", "The studio"],
  ];
  return (
    <>
      <a href="#main-content" className="st-skip">
        Skip to content
      </a>
      <header className="st-header">
        <div className="st-container st-nav">
          <Link
            to="/"
            className="st-logo"
            aria-label="Whoff Agents home"
            onClick={() => setOpen(false)}
          >
            <StudioLogo />
          </Link>
          <nav className="st-desktop-nav" aria-label="Main navigation">
            {links.map(([to, text]) => (
              <Link
                key={to}
                to={to}
                aria-current={pathname === to ? "page" : undefined}
              >
                {text}
              </Link>
            ))}
          </nav>
          <Link
            className="st-nav-cta"
            to={
              ["/web", "/agents"].includes(pathname)
                ? `${pathname}#lead-form`
                : "/#lead-form"
            }
          >
            Let’s talk
            <ArrowUpRight size={17} />
          </Link>
          <button
            className="st-menu-button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
        <nav
          id="mobile-navigation"
          className="st-mobile-nav"
          aria-label="Mobile navigation"
          hidden={!open}
        >
          {links.map(([to, text]) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              aria-current={pathname === to ? "page" : undefined}
            >
              {text}
              <ArrowUpRight size={18} />
            </Link>
          ))}
          <Link to="/#lead-form" onClick={() => setOpen(false)}>
            Start a project
            <ArrowUpRight size={18} />
          </Link>
        </nav>
      </header>
    </>
  );
}
