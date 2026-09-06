import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Check,
  Code2,
  Globe2,
  Phone,
  Play,
  RotateCcw,
  ShieldCheck,
  Plus,
  Minus,
  AudioLines,
} from "lucide-react";
import { buildStripeURL } from "../utils/utm";
import { products } from "../data/products";
import StudioShowcase from "../components/StudioShowcase";
import InquiryForm from "../components/InquiryForm";
import "../styles/studio.css";

const PREVIEW = import.meta.env.VITE_PRIVATE_PREVIEW !== "false";
const work = [
  {
    title: "Spindle Creek",
    type: "A quilting studio, brought to life.",
    image: "/work/spindle.webp",
    href: "https://spindlecreek.com",
    label: "Website project",
    tags: ["Custom design", "Inquiries", "Illustration"],
    detail:
      "A warm, illustrated home for longarm quilting, classes, and retreats. A clear path from discovering the studio to getting in touch.",
  },
  {
    title: "Island Airporter",
    type: "The journey starts before the airport.",
    image: "/work/island.webp",
    href: "https://main.d1v4o3c4563ysj.amplifyapp.com",
    label: "Build preview · awaiting approval",
    tags: ["Booking experience", "Mobile design", "Custom software"],
    detail:
      "A coastal identity and a simpler booking experience for an island shuttle service. An active website build, shown here as a private preview.",
  },
];
export function Kicker({ children, number }) {
  return (
    <div className="st-kicker">
      {number && <span className="st-index">{number}</span>}
      {children}
    </div>
  );
}
export function Action({ children, to = "/#lead-form", secondary = false }) {
  return (
    <Link
      className={`st-button ${secondary ? "st-button-secondary" : ""}`}
      to={to}
    >
      {children}
      <ArrowUpRight size={19} aria-hidden="true" />
    </Link>
  );
}
function BrowserFrame({ project, className = "", priority = false }) {
  return (
    <div className={`st-browser ${className}`}>
      <div className="st-browser-bar">
        <span className="st-browser-dots">
          <i />
          <i />
          <i />
        </span>
        <span>{project.title}</span>
        <ArrowUpRight size={12} />
      </div>
      <img
        src={project.image}
        width="1200"
        height="917"
        alt={`${project.title} website design`}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
      />
    </div>
  );
}
export function SelectedWork() {
  const [selected, setSelected] = useState(0);
  const project = work[selected];
  return (
    <section className="st-work st-section" id="work">
      <div className="st-container">
        <div className="st-section-heading">
          <div>
            <Kicker number="02">A LOOK AT THE WORK</Kicker>
            <h2>
              Made to feel
              <br />
              <span className="st-serif">like you.</span>
            </h2>
          </div>
          <p>
            Different businesses deserve different websites.
            <br />
            We start with yours.
          </p>
        </div>
        <div
          className="st-project-tabs"
          role="tablist"
          aria-label="Website projects"
        >
          {work.map((item, i) => (
            <button
              key={item.title}
              id={`work-tab-${i}`}
              role="tab"
              aria-selected={selected === i}
              aria-controls="work-panel"
              tabIndex={selected === i ? 0 : -1}
              onKeyDown={(e) => {
                if (
                  ["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)
                ) {
                  e.preventDefault();
                  const n =
                    e.key === "Home" ? 0 : e.key === "End" ? 1 : 1 - selected;
                  setSelected(n);
                  document.getElementById(`work-tab-${n}`)?.focus();
                }
              }}
              onClick={() => setSelected(i)}
            >
              <span>0{i + 1}</span>
              {item.title}
              <ArrowUpRight size={18} />
            </button>
          ))}
        </div>
        <div
          id="work-panel"
          role="tabpanel"
          aria-labelledby={`work-tab-${selected}`}
          className={`st-project ${selected === 1 ? "st-project-blue" : ""}`}
        >
          <div className="st-project-image">
            <BrowserFrame project={project} />
            <span className="st-project-corner">W / 0{selected + 1}</span>
          </div>
          <div className="st-project-copy">
            <span className="st-small-label">{project.label}</span>
            <h3>{project.type}</h3>
            <p>{project.detail}</p>
            <ul className="st-tags">
              {project.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="st-text-link"
            >
              Explore the {selected === 1 ? "preview" : "website"}
              <ArrowUpRight size={19} />
            </a>
          </div>
        </div>
        {PREVIEW && (
          <p className="st-review-note">
            Private review: portfolio permissions will be confirmed before these
            projects appear on the public site.
          </p>
        )}
      </div>
    </section>
  );
}
function Services() {
  const services = [
    {
      n: "01",
      title: ["Websites that", "mean business."],
      desc: "A site that feels like you, works on a phone, and makes the next step obvious.",
      detail: "CUSTOM DESIGN / BOOKING / E-COMMERCE",
      price: "From $1,500 + care",
      to: "/web",
      icon: Globe2,
    },
    {
      n: "02",
      title: ["An extra pair", "of hands."],
      desc: "AI assistants for the calls, inboxes, and repeat work that fill up your day.",
      detail: "PHONE / EMAIL / EVERYDAY AUTOMATION",
      price: "Built around your workflow",
      to: "/agents",
      icon: Phone,
    },
    {
      n: "03",
      title: ["Less setup.", "More shipping."],
      desc: "Skills, starter kits, and developer tools drawn from the way we work.",
      detail: "CLAUDE CODE / MCP / STARTER KITS",
      price: "Free tools and one-time purchases",
      to: "/products",
      icon: Code2,
    },
  ];
  return (
    <section id="services" className="st-services st-container">
      <Kicker number="01">THREE WAYS WE CAN HELP</Kicker>
      <div className="st-service-grid">
        {services.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              className={`st-service st-service-${s.n}`}
              key={s.n}
              to={s.to}
            >
              <div className="st-service-top">
                <Icon size={27} strokeWidth={1.3} />
                <span>{s.n}</span>
              </div>
              <h2>
                {s.title.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </h2>
              <p>{s.desc}</p>
              <span className="st-service-detail">{s.detail}</span>
              <div className="st-service-bottom">
                <span>{s.price}</span>
                <ArrowUpRight size={24} />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
const scenarios = {
  Phone: [
    {
      who: "Caller",
      text: "Hi, are you able to help with a leaking kitchen sink?",
    },
    {
      who: "Assistant",
      text: "I’m the AI assistant for the shop. I can take your details and ask the team to call you back. Is the water turned off?",
    },
    { who: "Caller", text: "Yes, it is. Tomorrow would be great." },
    {
      who: "Assistant",
      text: "Thanks. I’ll pass that along. What’s the best name and number for the callback?",
    },
  ],
  Email: [
    {
      who: "Incoming email",
      text: "Could you send over the details for the estimate we discussed?",
    },
    {
      who: "Assistant",
      text: "Matched to the open estimate. Prepared a reply with the approved scope and flagged it for your review.",
    },
    {
      who: "Your next step",
      text: "Review the draft, make any changes, and send when you’re ready.",
    },
  ],
  "Repeat work": [
    {
      who: "Monday morning",
      text: "The weekly report is due. The numbers are in three different places.",
    },
    {
      who: "Assistant",
      text: "Collected the connected data, organized the report, and marked two missing entries for review.",
    },
    {
      who: "Your next step",
      text: "Check the exceptions instead of assembling the entire report.",
    },
  ],
};
export function AgentDemo({ standalone = false }) {
  const [scenario, setScenario] = useState("Phone");
  const [step, setStep] = useState(0);
  const messages = scenarios[scenario];
  return (
    <section
      className={`st-agent-section st-section ${standalone ? "st-agent-standalone" : ""}`}
      id="agent-demo"
    >
      <div className="st-container st-agent-layout">
        <div className="st-agent-intro">
          <Kicker number={standalone ? "01" : "03"}>
            USEFUL AI. ON YOUR TERMS.
          </Kicker>
          <h2>
            Busy running
            <br />
            your business?
            <br />
            <span>Give it a hand.</span>
          </h2>
          <p>
            Answer the missed inquiry. Draft the routine reply. Take a recurring
            task off the list. We build an assistant around the way you already
            work.
          </p>
          <Action to="/agents#lead-form">Find your first use case</Action>
          <div className="st-human-note">
            <ShieldCheck size={19} />
            <span>
              You choose its job.
              <br />
              You approve it before it goes live.
            </span>
          </div>
        </div>
        <div className="st-demo">
          <div className="st-demo-header">
            <span className="st-demo-mark">
              <AudioLines size={22} />
            </span>
            <div>
              <strong>A little less on your plate.</strong>
              <span>AN ILLUSTRATIVE WORKFLOW</span>
            </div>
          </div>
          <div className="st-demo-tabs" aria-label="Choose an example">
            {Object.keys(scenarios).map((s) => (
              <button
                key={s}
                aria-pressed={scenario === s}
                onClick={() => {
                  setScenario(s);
                  setStep(0);
                }}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="st-demo-messages" aria-live="polite">
            {messages.slice(0, step + 1).map((m, i) => (
              <div
                key={`${scenario}-${i}`}
                className={`st-message ${m.who === "Assistant" ? "st-message-agent" : ""}`}
              >
                <span>{m.who}</span>
                <p>{m.text}</p>
              </div>
            ))}
          </div>
          <div className="st-demo-controls">
            <span>
              {String(step + 1).padStart(2, "0")} /{" "}
              {String(messages.length).padStart(2, "0")}
            </span>
            <button
              onClick={() => setStep(step < messages.length - 1 ? step + 1 : 0)}
            >
              {step < messages.length - 1 ? (
                <>
                  <Play size={15} />
                  Next step
                </>
              ) : (
                <>
                  <RotateCcw size={15} />
                  Replay example
                </>
              )}
            </button>
          </div>
          <p className="st-demo-disclosure">
            Example conversation, not a live call. No microphone or phone number
            needed.
          </p>
        </div>
      </div>
    </section>
  );
}
export function Process() {
  return (
    <section className="st-process st-container st-section">
      <div className="st-process-lead">
        <Kicker number="04">SMALL TEAM. CLEAR PROCESS.</Kicker>
        <h2>
          From “what if”
          <br />
          to <span className="st-serif">working.</span>
        </h2>
        <p>AI does the heavy lifting. A person owns the judgment.</p>
      </div>
      <ol>
        {[
          [
            "Talk it through.",
            "Tell us what’s getting in the way. We agree on the job, the scope, and the price.",
          ],
          [
            "See the real thing.",
            "We build a working version using your content and workflow. You try it and tell us what needs changing.",
          ],
          [
            "Make it yours.",
            "A person checks the details. You sign off. We launch and help keep it running.",
          ],
        ].map(([title, desc], i) => (
          <li key={title}>
            <span className="st-process-number">0{i + 1}</span>
            <div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
            {i === 2 && <Check className="st-process-check" size={22} />}
          </li>
        ))}
      </ol>
    </section>
  );
}
export function Pricing({ full = false }) {
  const [care, setCare] = useState("Basic");
  return (
    <section className="st-pricing st-section" id="pricing">
      <div className="st-container">
        <div className="st-section-heading">
          <div>
            <Kicker number="05">WEBSITE PRICING</Kicker>
            <h2>
              Know the price.
              <br />
              <span className="st-serif">Love the result.</span>
            </h2>
          </div>
          <div>
            <p>
              One build fee. A clear care plan.
              <br />
              Your domain, your content, your site.
            </p>
            <Link className="st-text-link" to="/refund-policy">
              30-day satisfaction guarantee
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
        <div className="st-price-grid">
          {[
            {
              name: "Redesign",
              price: "$1,500",
              label: "THE ESSENTIALS",
              desc: "A considered, custom website for a business ready for its next chapter.",
              items: [
                "Up to 5 custom pages",
                "Mobile design & local search setup",
                "Your content, brought together",
              ],
            },
            {
              name: "Redesign Pro",
              price: "$3,000",
              label: "MORE ROOM TO GROW",
              desc: "A website that takes bookings, accepts payments, and works harder.",
              items: [
                "Everything in Redesign, up to 10 pages",
                "Booking & payment integrations",
                "Analytics & email capture",
              ],
            },
            {
              name: "Platform",
              price: "$6,000",
              label: "BUILT AROUND YOU",
              desc: "For the thing that doesn’t fit a template. Let’s work out what it needs.",
              items: [
                "Custom scope & unlimited pages",
                "Portals, order flows & calculators",
                "Everything in Redesign Pro",
              ],
              from: true,
            },
          ].map((tier, i) => (
            <article
              key={tier.name}
              className={`st-price-card ${i === 1 ? "st-price-featured" : ""}`}
            >
              <span className="st-small-label">{tier.label}</span>
              <h3>{tier.name}</h3>
              <p>{tier.desc}</p>
              <div className="st-price">
                {tier.from && <small>from </small>}
                {tier.price}
              </div>
              <span className="st-price-caption">
                one-time build + care plan
              </span>
              <ul>
                {tier.items.map((item) => (
                  <li key={item}>
                    <Check size={15} />
                    {item}
                  </li>
                ))}
              </ul>
              <Action to="/web#lead-form" secondary={i !== 1}>
                Let’s talk {tier.name.toLowerCase()}
              </Action>
            </article>
          ))}
        </div>
        <div className="st-care">
          <div>
            <h3>A little care goes a long way.</h3>
            <p>Hosting, SSL, security, and backups with every plan.</p>
          </div>
          <div className="st-care-options" aria-label="Compare care plans">
            {["Basic", "Full"].map((c) => (
              <button
                key={c}
                aria-pressed={care === c}
                onClick={() => setCare(c)}
              >
                Care {c}
                <strong>
                  ${c === "Basic" ? "95" : "195"}
                  <small>/mo</small>
                </strong>
              </button>
            ))}
          </div>
          <p className="st-care-description" aria-live="polite">
            {care === "Basic"
              ? "Care Basic includes hosting, security, backups, and small fixes."
              : "Care Full adds unlimited content edits within two business days and a quarterly results report."}{" "}
            Annual prepay includes two months of care free.
          </p>
        </div>
        {!full && (
          <p className="st-pricing-footnote">
            Looking for an AI assistant? Phone answering setup is $500, plus
            usage. Other projects are scoped individually.{" "}
            <Link to="/agents">
              Explore AI agents <ArrowUpRight size={14} />
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}
export function FAQ({ agent = false }) {
  const [open, setOpen] = useState(0);
  const questions = agent
    ? [
        [
          "What can an assistant actually do?",
          "A defined job in the tools you already use: phone intake, email drafts, calendar tasks, or routine reports. We agree on exactly what it can access and what requires your approval.",
        ],
        [
          "What happens when it doesn’t know?",
          "We design an explicit fallback: admit the gap, take a message, or hand the decision back to you. You test real situations before it reaches your customers.",
        ],
        [
          "Is there a monthly subscription?",
          "The phone-answering setup is $500 once. Phone and AI usage are ongoing and depend on volume. We estimate them with you before launch. Other work is quoted to its scope.",
        ],
        [
          "Can I try it before it goes live?",
          "Yes. You test the assistant against your real situations and approve its behavior before customers use it.",
        ],
      ]
    : [
        [
          "How soon could my site be ready?",
          "For most Redesign and Redesign Pro projects, the first working version is ready in under a week once we have your content. Custom platforms are scoped individually.",
        ],
        [
          "Do I have to write all the content?",
          "Bring what you have: your services, prices, photos, and existing site. We draft the pages together, and you approve the finished content.",
        ],
        [
          "Who owns the website?",
          "You do. Your domain, your content, your site. If you leave, you can take it with you. The care plan pays for hosting and upkeep.",
        ],
        [
          "Is a person actually involved?",
          "Yes. Agents handle much of the building. A person directs the work, checks the details, and is responsible for what we deliver.",
        ],
      ];
  return (
    <section className="st-faq st-container st-section">
      <div>
        <Kicker>BEFORE YOU ASK</Kicker>
        <h2>
          Fair questions.
          <br />
          <span className="st-serif">Straight answers.</span>
        </h2>
      </div>
      <div className="st-faq-list">
        {questions.map(([q, a], i) => (
          <div key={q} className={open === i ? "is-open" : ""}>
            <h3>
              <button
                aria-expanded={open === i}
                aria-controls={`faq-answer-${i}`}
                onClick={() => setOpen(open === i ? -1 : i)}
              >
                {q}
                {open === i ? <Minus size={20} /> : <Plus size={20} />}
              </button>
            </h3>
            <div id={`faq-answer-${i}`} hidden={open !== i}>
              <p>{a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
export function Contact({ service = "Website" }) {
  return (
    <section className="st-contact st-section" id="lead-form">
      <div className="st-container st-contact-layout">
        <div>
          <Kicker>LET’S MAKE SOMETHING USEFUL</Kicker>
          <h2>
            What’s on
            <br />
            <span>your mind?</span>
          </h2>
          <p>
            A website that needs a fresh start?
            <br />A job you’re tired of doing by hand?
            <br />
            Tell us. We’ll take it from there.
          </p>
          <a className="st-contact-email" href="mailto:hello@whoffagents.com">
            hello@whoffagents.com
            <ArrowUpRight size={20} />
          </a>
          <div className="st-contact-location">
            <span className="st-cross" aria-hidden="true">
              +
            </span>
            Based in Provo, Utah.
            <br />
            Working wherever you are.
          </div>
        </div>
        <InquiryForm initialService={service} />
      </div>
    </section>
  );
}
export function StudioHome() {
  return (
    <div className="studio-page">
      <StudioShowcase />
      <Services />
      <SelectedWork />
      <AgentDemo />
      <Process />
      <Pricing />
      <FAQ />
      <Contact />
    </div>
  );
}
export function StudioWeb() {
  return (
    <div className="studio-page">
      <StudioShowcase web />
      <SelectedWork />
      <Process />
      <Pricing full />
      <FAQ />
      <Contact />
    </div>
  );
}
export function StudioAgents() {
  return (
    <div className="studio-page">
      <section className="st-agents-hero st-container">
        <Kicker>CUSTOM AI AGENTS</Kicker>
        <h1>
          Less “I’ll get to it.”
          <br />
          <span>More done.</span>
        </h1>
        <p>
          Software that handles a defined job in your business.
          <br />
          Built around your workflow, with you in control.
        </p>
        <div className="st-hero-actions">
          <Action to="/agents#lead-form">Tell us about the job</Action>
          <Action secondary to="/agents#agent-demo">
            Walk through an example
          </Action>
        </div>
      </section>
      <AgentDemo standalone />
      <section className="st-agent-offer st-container st-section">
        <div>
          <Kicker>START WITH ONE USEFUL THING</Kicker>
          <h2>
            The phone gets answered.
            <br />
            <span className="st-serif">You get the message.</span>
          </h2>
          <p>
            We configure your number, approved business information, greeting,
            and call handling. You test it before it reaches a customer.
          </p>
        </div>
        <div className="st-agent-price">
          <span>PHONE ANSWERING SETUP</span>
          <strong>
            $500<small>once</small>
          </strong>
          <p>
            Plus the phone line and actual AI usage.
            <br />
            We estimate ongoing costs before you switch it on.
          </p>
          <Action to="/agents#lead-form">Ask about phone answering</Action>
          <p>
            <a
              className="st-text-link"
              href={buildStripeURL(
                products.find((p) => p.category === "agent").buyLink,
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ready? Purchase setup <ArrowUpRight size={16} />
            </a>
          </p>
        </div>
      </section>
      <Process />
      <FAQ agent />
      <Contact service="AI agent" />
    </div>
  );
}
export function ToolsIntro() {
  return (
    <header className="st-tools-heading st-container">
      <Kicker>THE STUDIO TOOLBOX</Kicker>
      <h1>
        Skip the setup.
        <br />
        <span>Build the good part.</span>
      </h1>
      <p>
        Developer tools from our own workbench.
        <br />
        Free downloads and straightforward, one-time purchases.
      </p>
    </header>
  );
}
export function StudioAbout() {
  return (
    <div className="studio-page">
      <section className="st-about st-container st-section">
        <Kicker>A SMALL STUDIO WITH A DIFFERENT WAY OF WORKING</Kicker>
        <h1>
          Agents build.
          <br />
          <span>People care.</span>
        </h1>
        <div className="st-about-grid">
          <div>
            <p className="st-about-lede">
              Whoff Agents is an independent studio in Provo, Utah. We make
              websites, build custom AI assistants, and package useful tools for
              developers.
            </p>
            <p>
              Our own business is the proving ground. We use agents to research,
              draft, and build. A person sets the direction, reviews the work,
              and takes responsibility for the result.
            </p>
            <p>
              Will is the human partner behind the studio. Atlas coordinates the
              agents. You work with a small team that can explain what it is
              building and why.
            </p>
            <Action>Tell us what you’re working on</Action>
          </div>
          <div className="st-about-emblem">
            <span>W</span>
            <div>
              INDEPENDENT IN SPIRIT.
              <br />
              ACCOUNTABLE BY DESIGN.
            </div>
          </div>
        </div>
      </section>
      <Process />
      <Contact />
    </div>
  );
}
