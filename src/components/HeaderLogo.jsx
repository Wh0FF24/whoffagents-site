import { useEffect, useRef, useState } from 'react';
import assembly from '../../public/brand/whoff-agents-stacked-animated-on-dark.svg?raw';
import '../styles/header-logo.css';

export default function HeaderLogo() {
  const root = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame;
    let finish;
    let cancelled = false;
    const stop = () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      clearTimeout(finish);
      setPlaying(false);
    };
    const startWhenVisible = () => {
      if (cancelled || preference.matches) return;
      // The homepage has its own entrance. Wait until the header is visible
      // so its logo assembly is not spent behind that entrance.
      const header = root.current?.closest('header');
      if (document.hidden || (header && Number(getComputedStyle(header).opacity) < 0.99)) {
        frame = requestAnimationFrame(startWhenVisible);
        return;
      }
      setPlaying(true);
      finish = setTimeout(stop, 1800);
    };
    const onPreference = () => { if (preference.matches) stop(); };
    preference.addEventListener('change', onPreference);
    if (!preference.matches) frame = requestAnimationFrame(startWhenVisible);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      clearTimeout(finish);
      preference.removeEventListener('change', onPreference);
    };
  }, []);

  return <span ref={root} className="hl-logo" data-playing={playing ? 'true' : 'false'}>
    <img src="/brand/whoff-logo.svg" alt="Whoff Agents LLC" width="1133" height="351" />
    {playing && <span className="hl-assembly" aria-hidden="true">
      <span className="hl-vectors" dangerouslySetInnerHTML={{ __html: assembly }} />
    </span>}
  </span>;
}
