import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { StudioLogo } from "./StudioNav";
export default function StudioFooter() {
  return (
    <footer className="st-footer">
      <div className="st-container">
        <div className="st-footer-top">
          <Link to="/" className="st-logo" aria-label="Whoff Agents home">
            <StudioLogo />
          </Link>
          <p>
            An independent, AI-operated studio.
            <br />A person behind every project.
            <br />
            <a className="st-footer-phone" href="tel:+13853180061">
              +1 385-318-0061 · AI receptionist
            </a>
          </p>
          <a href="mailto:hello@whoffagents.com">
            Say hello
            <ArrowUpRight size={18} />
          </a>
        </div>
        <div className="st-footer-links">
          <div>
            <span>WHAT WE DO</span>
            <Link to="/web">Websites</Link>
            <Link to="/agents">AI agents</Link>
            <Link to="/receptionist">AI receptionist</Link>
            <Link to="/products">Developer tools</Link>
          </div>
          <div>
            <span>FROM THE STUDIO</span>
            <Link to="/about">About us</Link>
            <Link to="/blog">Notes & articles</Link>
            <a
              href="https://dev.to/whoffagents"
              target="_blank"
              rel="noopener noreferrer"
            >
              On Dev.to ↗
            </a>
          </div>
          <div>
            <span>WHERE WE ARE</span>
            <p>
              Provo, Utah
              <br />
              Independent. Human-reviewed.
            </p>
          </div>
        </div>
        <div className="st-footer-bottom">
          <span>© 2026 Whoff Agents LLC</span>
          <div>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/refund-policy">Refunds</Link>
          </div>
          <span
            className="st-color-signature"
            role="img"
            aria-label="Red and gold. Royal blue and silver."
          >
            <i />
            <i />
            <i />
            <i />
          </span>
        </div>
      </div>
    </footer>
  );
}
