import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight, Download, Mail } from "lucide-react";
import CoreEmblem from "../components/eng/CoreEmblem";
import Glyph from "../components/eng/Glyphs";
import LoopFigure from "../components/eng/LoopFigure";
import RadarFigure from "../components/eng/RadarFigure";
import "../styles/engineering-pages.css";
import "../styles/eng-visuals.css";

// Scroll choreography, loaded after first paint; the page is complete without it.
function useEngMotion() {
  const root = useRef(null);
  useEffect(() => {
    let motion = null;
    let dead = false;
    import("../components/eng/engMotion")
      .then(({ createEngMotion }) => createEngMotion(root.current))
      .then((created) => {
        if (dead) created?.dispose();
        else motion = created;
      })
      .catch(() => {});
    return () => {
      dead = true;
      motion?.dispose();
    };
  }, []);
  return root;
}

function PageLabel({ index, children }) {
  return (
    <p className="eng-label">
      <span className="eng-index">{index}</span>
      {children}
    </p>
  );
}

function PageHero({ index, label, title, children, aside, emblem }) {
  return (
    <header className={`eng-hero eng-shell${emblem ? " eng-hero--emblem" : ""}`}>
      <PageLabel index={index}>{label}</PageLabel>
      <div className="eng-hero-grid">
        <div className="eng-hero-text">
          <h1>{title}</h1>
          <div className="eng-hero-intro">{children}</div>
          {emblem && aside && <aside className="eng-hero-aside">{aside}</aside>}
        </div>
        {emblem ? (
          <div className="eng-hero-visual">
            <CoreEmblem variant={emblem} />
          </div>
        ) : (
          aside && <aside className="eng-hero-aside">{aside}</aside>
        )}
      </div>
    </header>
  );
}

function TextLink({ to, children, download = false }) {
  const className = "eng-text-link";
  const content = (
    <>
      <span>{children}</span>
      {download ? (
        <Download size={17} aria-hidden="true" />
      ) : (
        <ArrowUpRight size={17} aria-hidden="true" />
      )}
    </>
  );
  return to.startsWith("mailto:") || download ? (
    <a className={className} href={to} download={download || undefined}>
      {content}
    </a>
  ) : (
    <Link className={className} to={to}>
      {content}
    </Link>
  );
}

function ProjectInvitation({
  label = "Bring a problem worth solving.",
  children,
}) {
  return (
    <section className="eng-invitation">
      <div className="eng-shell eng-invitation-grid">
        <h2 data-split="">{label}</h2>
        <div data-reveal="">
          <p>
            {children ||
              "A clear outcome is a good place to begin. Tell us what needs to work, and we can explore the next useful step."}
          </p>
          <TextLink to="/contact">Start a conversation</TextLink>
        </div>
      </div>
    </section>
  );
}

const capabilities = [
  {
    number: "01",
    id: "software",
    title: "Software engineering",
    description:
      "Applications and tools shaped around the people who use them. We connect the interface, business logic, and underlying systems so the whole experience works together.",
    detail: ["Web applications", "Custom tools", "Product development"],
  },
  {
    number: "02",
    id: "autonomy",
    title: "AI agents & automation",
    description:
      "Workflows that turn a clear intention into useful action. We define the context an agent needs, the tools it can use, and the points where a person should make the decision.",
    detail: ["Agent workflows", "Tool integration", "Human oversight"],
  },
  {
    number: "03",
    id: "integration",
    title: "Systems integration",
    description:
      "The connections that make individual tools useful together. We work across interfaces and data flows, with attention to the handoffs where information or intent can be lost.",
    detail: ["APIs", "Connected workflows", "Data exchange"],
  },
  {
    number: "04",
    id: "verification",
    title: "Testing & evaluation",
    description:
      "A result should stand up to inspection. We build checks around the outcome that matters, examine failure cases, and use what we learn to guide the next iteration.",
    detail: ["Prototyping", "Failure analysis", "Evidence-based iteration"],
  },
];

const approach = [
  {
    title: "Define useful.",
    text: "Agree on the problem, the people involved, and what a good outcome would look like.",
  },
  {
    title: "Build to learn.",
    text: "Start with a focused implementation that helps answer the most important open question.",
  },
  {
    title: "Verify, then improve.",
    text: "Inspect the result, make its limits visible, and choose the next step from evidence.",
  },
];

export function Capabilities() {
  const root = useEngMotion();
  return (
    <article className="eng-page eng-capabilities" ref={root}>
      <PageHero
        index="01"
        label="Capabilities"
        emblem="capabilities"
        title={
          <>
            From intent
            <br />
            to operation.
          </>
        }
        aside={
          <>
            <span className="eng-small-label">One connected practice</span>
            <p>
              Understand the problem.
              <br />
              Build the system.
              <br />
              Check the result.
            </p>
            <TextLink to="/downloads/whoff-capabilities.pdf" download>
              Capability statement
            </TextLink>
          </>
        }
      >
        <p>
          Software, AI, and the engineering between them. We turn ideas into
          systems people can use, inspect, and improve.
        </p>
      </PageHero>

      <section className="eng-shell eng-practice" aria-label="Our capabilities">
        <div className="eng-practice-map" data-draw="" aria-hidden="true">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <path data-stroke d="M50 50L25 25M50 50L75 25M50 50L25 75M50 50L75 75" />
          </svg>
          <span className="eng-practice-hub" />
        </div>
        <div className="eng-practice-grid" data-reveal-group="">
          {capabilities.map((capability) => (
            <div className="eng-practice-card" id={capability.id} key={capability.number}>
              <div className="eng-practice-top" data-draw="">
                <span className="eng-row-number" aria-hidden="true">
                  {capability.number}
                </span>
                <Glyph name={capability.id} />
              </div>
              <h2>{capability.title}</h2>
              <p>{capability.description}</p>
              <ul className="eng-tags" aria-label={`${capability.title} includes`}>
                {capability.detail.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="eng-section eng-shell eng-approach">
        <div className="eng-approach-heading">
          <PageLabel index="A">The working approach</PageLabel>
          <h2 data-split="">
            Make the next step
            <br />
            worth taking.
          </h2>
        </div>
        <div className="eng-track" data-run={approach.length} data-step={approach.length}>
          <span className="eng-track-line" aria-hidden="true">
            <span />
          </span>
          <ol>
            {approach.map((step, index) => (
              <li className="eng-track-step" key={step.title}>
                <span className="eng-track-node" aria-hidden="true">{`0${index + 1}`}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="eng-secondary-work">
        <div className="eng-shell eng-split-section">
          <div>
            <PageLabel index="B">Ways to work with us</PageLabel>
            <h2 data-split="">
              From a single tool
              <br />
              to a connected system.
            </h2>
            <p className="eng-section-intro" data-reveal="">
              Our web studio, agent work, and developer tools are specific ways
              this engineering practice takes shape.
            </p>
          </div>
          <div className="eng-service-grid" data-reveal-group="">
            {[
              ["/web", "Websites & web applications", "web"],
              ["/agents", "AI agents & workflow automation", "agents"],
              ["/receptionist", "AI receptionist", "voice"],
              ["/products", "Developer tools & products", "products"],
            ].map(([to, label, glyph]) => (
              <Link className="eng-service-card" to={to} key={to}>
                <Glyph name={glyph} />
                <span>{label}</span>
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <ProjectInvitation />
    </article>
  );
}

const principles = [
  {
    glyph: "question",
    title: "Begin with a real question.",
    text: "State what is uncertain and why the answer would matter to someone using the system.",
  },
  {
    glyph: "challenge",
    title: "Challenge the approach.",
    text: "Test assumptions, look for failure, and make room for results that change the direction of the work.",
  },
  {
    glyph: "evidence",
    title: "Keep claims tied to evidence.",
    text: "Separate an intended capability from a demonstrated result. A prototype is a place to learn, and its limits are part of the finding.",
  },
];

export function Research() {
  const root = useEngMotion();
  return (
    <article className="eng-page eng-research" ref={root}>
      <PageHero
        index="02"
        label="Research & development"
        emblem="research"
        title={
          <>
            Useful progress
            <br />
            starts with
            <br />
            a question.
          </>
        }
        aside={
          <>
            <span className="eng-small-label">Our measure of progress</span>
            <p>
              A clearer answer.
              <br />A stronger capability.
              <br />A better next experiment.
            </p>
            <ArrowDown
              className="eng-aside-arrow"
              size={24}
              aria-hidden="true"
            />
          </>
        }
      >
        <p>
          We investigate the questions that stand between an interesting idea
          and a dependable system. Learning and capability development are
          valuable outcomes in their own right.
        </p>
      </PageHero>

      <section className="eng-program-section">
        <div className="eng-shell eng-program-grid eng-program-grid--radar">
          <div className="eng-program-copy">
            <div className="eng-program-meta">
              <span className="eng-small-label">Current research program</span>
              <span className="eng-status">
                <span aria-hidden="true" />
                In development
              </span>
            </div>
            <h2 data-split="">Persona Fleet</h2>
            <p className="eng-program-lede" data-reveal="">
              Making observable communications less informative.
            </p>
            <p data-reveal="">
              A research program in cellular privacy and cyber deception.
              Persona Fleet explores whether realistic decoy activity can
              introduce useful ambiguity into what an observer can infer.
            </p>
            <TextLink to="/research/persona-fleet">
              Explore the research
            </TextLink>
          </div>
          <RadarFigure />
        </div>
      </section>

      <section
        className="eng-section eng-shell eng-split-section"
        id="autonomy"
      >
        <div>
          <PageLabel index="A">A longer-term direction</PageLabel>
          <h2 data-split="">
            Useful autonomy,
            <br />
            step by step.
          </h2>
          <p className="eng-section-intro" data-reveal="">
            We are interested in systems that carry context forward, act
            reliably, and remain accountable to the people they serve. That
            ambition guides our research; each capability still needs to be
            established through testing.
          </p>
        </div>
        <div className="eng-principles eng-principle-cards" data-reveal-group="">
          {principles.map((principle, index) => (
            <div className="eng-principle-card" key={principle.title} data-draw="">
              <span className="eng-principle-n" aria-hidden="true">{`0${index + 1}`}</span>
              <Glyph name={principle.glyph} />
              <h3>{principle.title}</h3>
              <p>{principle.text}</p>
            </div>
          ))}
        </div>
      </section>
      <ProjectInvitation label="Have a question to investigate?">
        We welcome conversations with researchers, product teams, and
        organizations working toward a useful technical outcome.
      </ProjectInvitation>
    </article>
  );
}

export function PersonaFleet() {
  const root = useEngMotion();
  return (
    <article className="eng-page eng-persona" ref={root}>
      <PageHero
        index="02.1"
        label="Persona Fleet / Research program"
        emblem="research"
        title={
          <>
            Less revealing.
            <br />
            By design.
          </>
        }
        aside={
          <>
            <span className="eng-status">
              <span aria-hidden="true" />
              In development
            </span>
            <dl className="eng-program-facts">
              <div>
                <dt>Field</dt>
                <dd>Cellular privacy & cyber deception</dd>
              </div>
              <div>
                <dt>Approach</dt>
                <dd>Research, prototype, evaluate</dd>
              </div>
            </dl>
          </>
        }
      >
        <p>
          Persona Fleet investigates how realistic decoy activity could make
          observable communications less useful to an adversary.
        </p>
      </PageHero>

      <section className="eng-shell eng-study-intro">
        <PageLabel index="A">The question</PageLabel>
        <h2 data-split="">
          What if an observer could see activity,
          <br className="eng-desktop-break" /> but learn less from it?
        </h2>
        <p data-reveal="">
          Communications can reveal patterns beyond the content of a message.
          This program explores how decoy activity might introduce ambiguity
          into those patterns, and how to evaluate whether that ambiguity is
          useful.
        </p>
      </section>

      <figure className="eng-study-figure eng-shell" data-reveal="">
        <div
          className="eng-study-diagram"
          role="img"
          aria-label="Illustrative research model: observe a pattern, introduce ambiguity with decoy activity, then evaluate it against detection."
        >
          <div className="eng-study-stage">
            <span className="eng-diagram-number">01 / Observation</span>
            <div className="eng-signal eng-signal-observed" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
            <h3>A visible pattern</h3>
            <p>Activity gives an observer something to interpret.</p>
          </div>
          <div className="eng-study-stage">
            <span className="eng-diagram-number">02 / Ambiguity</span>
            <div className="eng-signal eng-signal-ambiguous" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
            <h3>A harder inference</h3>
            <p>
              Realistic decoy activity is intended to complicate that
              interpretation.
            </p>
          </div>
          <div className="eng-study-stage">
            <span className="eng-diagram-number">03 / Evaluation</span>
            <div className="eng-evaluation-symbol" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <h3>A result to test</h3>
            <p>
              Challenge the approach with detectors and inspect what they can
              still learn.
            </p>
          </div>
        </div>
        <figcaption>
          Illustrative research model. These shapes represent an idea, not
          measured traffic or performance.
        </figcaption>
      </figure>

      <section className="eng-section eng-shell eng-split-section">
        <div>
          <PageLabel index="B">The standard</PageLabel>
          <h2 data-split="">
            Protection is measured,
            <br />
            not asserted.
          </h2>
        </div>
        <div className="eng-study-copy" data-reveal="">
          <p>
            Plausible decoy activity is only part of the research problem. We
            also need to understand what an observer can distinguish, and where
            the approach breaks down.
          </p>
          <p>
            The program includes challenging its own decoys with its own
            detectors. This creates a way to examine weaknesses and refine the
            work before making protection claims.
          </p>
          <div className="eng-research-note">
            <span className="eng-small-label">Current maturity</span>
            <p>
              Persona Fleet is in development. The outcomes described here are
              research objectives; protection effectiveness has not been
              established.
            </p>
          </div>
          <TextLink to="/research">All research & development</TextLink>
        </div>
      </section>
      <ProjectInvitation label="Explore a research collaboration.">
        For conversations about the problem, potential applications, or
        evaluation, contact the engineering team.
      </ProjectInvitation>
    </article>
  );
}

export function Company() {
  const root = useEngMotion();
  return (
    <article className="eng-page eng-company" ref={root}>
      <PageHero
        index="03"
        label="The company"
        emblem="company"
        title={
          <>
            Built to learn.
            <br />
            Here to build.
          </>
        }
        aside={
          <>
            <span className="eng-small-label">Whoff Agents LLC</span>
            <p>
              AI-native engineering.
              <br />
              Human responsibility.
            </p>
            <span className="eng-company-location">
              Virginia, United States
              <br />
              Established 2026
            </span>
          </>
        }
      >
        <p>
          We build useful software, automation, and autonomous systems. Our work
          connects research with practical engineering, guided by a simple
          question: does this help someone do something that matters?
        </p>
      </PageHero>

      <section className="eng-company-principle">
        <div className="eng-shell eng-company-principle-grid">
          <div>
            <PageLabel index="A">Our operating philosophy</PageLabel>
            <h2 data-split="">Verification over trust.</h2>
            <p data-reveal="">
              AI participates throughout research, development, testing, and
              review. People retain technical ownership, judgment, and final
              authority. We make progress by checking what works, understanding
              what does not, and carrying that learning forward.
            </p>
          </div>
          <LoopFigure />
        </div>
      </section>

      <section className="eng-section eng-shell eng-split-section">
        <div>
          <PageLabel index="B">Why we build</PageLabel>
          <h2 data-split="">
            Useful autonomy.
            <br />
            Lasting continuity.
          </h2>
        </div>
        <div className="eng-study-copy" data-reveal="">
          <p>
            We are interested in systems that understand an intention, carry
            context forward, and help people make meaningful progress.
            Reliability and accountability are central to that ambition.
          </p>
          <p>
            Some work becomes a product. Some becomes a stronger capability or a
            better understanding of a hard problem. Research and learning are
            part of building a company that can keep doing useful work.
          </p>
          <TextLink to="/research">Our research approach</TextLink>
        </div>
      </section>

      <section className="eng-shell eng-team-section">
        <div className="eng-section-heading">
          <PageLabel index="C">People & experience</PageLabel>
          <h2 data-split="">
            Technical ownership.
            <br />
            Accountable leadership.
          </h2>
        </div>
        <div className="eng-people-grid" data-reveal-group="">
          <div className="eng-person-card">
            <span className="eng-monogram" aria-hidden="true">
              <b>B</b>
            </span>
            <div>
              <span className="eng-small-label">Leadership</span>
              <h3>Bill / CEO & Managing Member</h3>
              <p>
                Forty years of prior defense and intelligence program-management
                experience, including work with DAWIA and ISO quality
                requirements. This is individual experience brought to Whoff.
              </p>
            </div>
          </div>
          <div className="eng-person-card">
            <span className="eng-monogram is-royal" aria-hidden="true">
              <b>W</b>
            </span>
            <div>
              <span className="eng-small-label">Engineering</span>
              <h3>Will / President & CTO</h3>
              <p>
                Leads technical direction and engineering. Pursuing an M.S. in
                Electrical and Computer Engineering.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="eng-company-data">
        <div className="eng-shell eng-split-section">
          <div>
            <PageLabel index="D">Company details</PageLabel>
            <h2 data-split="">Whoff Agents LLC</h2>
            <p className="eng-section-intro" data-reveal="">
              A veteran-owned small business.
              <br />
              Virginia LLC, formed May 2026.
            </p>
            <TextLink to="/downloads/whoff-capabilities.pdf" download>
              Download capability statement
            </TextLink>
          </div>
          <div className="eng-plate" data-reveal="">
            <span className="eng-plate-head" aria-hidden="true">
              <span>Company record</span>
              <span>Virginia LLC</span>
            </span>
            <dl className="eng-facts-list">
              <div>
                <dt>Principal office</dt>
                <dd>
                  <address>
                    1379 Ullainee Rd
                    <br />
                    Caret, VA 22436
                  </address>
                </dd>
              </div>
              <div>
                <dt>UEI</dt>
                <dd className="eng-mono-value">HV62R8JGP7Z8</dd>
              </div>
              <div>
                <dt>CAGE</dt>
                <dd className="eng-mono-value">25HT7</dd>
              </div>
              <div>
                <dt>Contact</dt>
                <dd>
                  <a href="mailto:will@whoffagents.com">will@whoffagents.com</a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
      <ProjectInvitation />
    </article>
  );
}

export function Contact() {
  return (
    <article className="eng-page eng-contact">
      <PageHero
        index="04"
        label="Contact"
        title={
          <>
            Start with
            <br />
            the problem.
          </>
        }
        aside={
          <>
            <span className="eng-small-label">
              Engineering / Research / Collaboration
            </span>
            <p>
              A first conversation can be simple. An idea, a constraint, or a
              question is enough to start.
            </p>
          </>
        }
      >
        <p>
          Tell us what you are trying to make possible, what needs to work, and
          what is getting in the way.
        </p>
      </PageHero>

      <section
        className="eng-shell eng-contact-main"
        aria-labelledby="eng-contact-heading"
      >
        <div className="eng-contact-primary">
          <span className="eng-small-label" id="eng-contact-heading">
            Speak with Will / President & CTO
          </span>
          <a className="eng-contact-email" href="mailto:will@whoffagents.com">
            <span>will@whoffagents.com</span>
            <ArrowUpRight size={40} aria-hidden="true" />
          </a>
          <p>
            For engineering projects, research discussions, and partnerships.
          </p>
          <a className="eng-email-button" href="mailto:will@whoffagents.com">
            <Mail size={17} aria-hidden="true" />
            Write an email
          </a>
        </div>
        <div className="eng-contact-notes">
          <span className="eng-small-label">Useful starting points</span>
          <ol>
            <li>What outcome are you working toward?</li>
            <li>What exists today?</li>
            <li>What constraints should we understand?</li>
          </ol>
        </div>
      </section>

      <section className="eng-section eng-shell eng-contact-secondary">
        <div>
          <h2>Already using a Whoff product?</h2>
          <p>
            For existing products, tools, and general support, reach us here.
          </p>
          <TextLink to="mailto:hello@whoffagents.com">
            hello@whoffagents.com
          </TextLink>
        </div>
        <div>
          <h2>Looking for a specific service?</h2>
          <p>Explore our current services and tools.</p>
          <div className="eng-inline-links">
            <TextLink to="/web">Websites</TextLink>
            <TextLink to="/agents">AI agents</TextLink>
            <TextLink to="/products">Products</TextLink>
          </div>
        </div>
      </section>
    </article>
  );
}
