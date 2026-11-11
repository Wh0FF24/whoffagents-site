/**
 * The waitlist form on the /haze page. It is its own form, with its own
 * address. It shares nothing with the site's inquiry form, and a signup never
 * reaches the site's lead form.
 *
 * What it does is decided when the site is built, in this order:
 *  1. Preview build (VITE_PRIVATE_PREVIEW is "true"): the form works on
 *     screen and sends nothing.
 *  2. Live build with no VITE_HAZE_WAITLIST_ENDPOINT: the form is not shown.
 *     One line says the waitlist is not open. There is no fallback to email
 *     or to any other form.
 *  3. Live build with VITE_HAZE_WAITLIST_ENDPOINT set to a path on this same
 *     site: one POST of JSON holding exactly email, where, pay, note and
 *     website. A 2xx answer is "sent". Anything else is "failed".
 *
 * It keeps nothing in the browser, sends no cookies, and reports nothing to
 * analytics on any path.
 */
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";

const IS_PREVIEW = import.meta.env.VITE_PRIVATE_PREVIEW === "true";

// A path on this same site and nothing else: it starts with one "/" and has
// no backslash, so an address on another host is never accepted.
function sameSitePath(value) {
  if (typeof value !== "string") return null;
  const path = value.trim();
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return null;
  return path;
}

const ENDPOINT = sameSitePath(import.meta.env.VITE_HAZE_WAITLIST_ENDPOINT);
const IS_OPEN = IS_PREVIEW || ENDPOINT !== null;
const LEAVE_ADDRESS = "hello@whoffagents.com";
const TIMEOUT_MS = 12000;
const NOTE_LENGTH = 200;

const WHERE = [
  { value: "extension", label: "Browser extension" },
  { value: "android", label: "Android app" },
  { value: "both", label: "Both" },
];

const PAY = [
  { value: "free", label: "Nothing, I would only use a free version", wide: true },
  { value: "3", label: "$3 a month" },
  { value: "5", label: "$5 a month" },
  { value: "8", label: "$8 a month" },
  { value: "once", label: "A one-time price, not monthly", wide: true },
];

const MESSAGES = {
  sent: "You are on the list. One email when there is news.",
  failed: "That did not go through. Try again in a minute.",
  email: "Enter an email address we can reach you at.",
  choice: "Pick one answer for each question.",
  closed: "The waitlist is not open yet.",
  preview: "Local preview. Nothing was sent.",
};

// False in the page the server renders, true once the browser has taken the
// page over. Until then the button is off, so the form can never be sent the
// browser's own way, with what was typed in the address.
const never = () => () => {};
const useTakenOver = () =>
  useSyncExternalStore(
    never,
    () => true,
    () => false,
  );

function Choices({ legend, name, options, value, onChange, missing, describedBy }) {
  return (
    <fieldset className="hz-choices" data-missing={missing ? "true" : undefined} aria-describedby={missing ? describedBy : undefined}>
      <legend>{legend}</legend>
      <div className="hz-choice-grid" data-count={options.length}>
        {options.map((option) => (
          <label key={option.value} className={option.wide ? "hz-choice is-wide" : "hz-choice"}>
            <input
              type="radio"
              name={name}
              value={option.value}
              required
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function HazeWaitlistForm() {
  const uid = useId();
  const emailId = `${uid}-email`;
  const noteId = `${uid}-note`;
  const emailProblemId = `${uid}-email-problem`;
  const choiceProblemId = `${uid}-choice-problem`;

  const takenOver = useTakenOver();
  const [email, setEmail] = useState("");
  const [where, setWhere] = useState("");
  const [pay, setPay] = useState("");
  const [note, setNote] = useState("");
  const [website, setWebsite] = useState("");
  const [problems, setProblems] = useState(null);
  const [sending, setSending] = useState(false);
  // null, "failed", or one of the two endings: "sent" and "preview".
  const [outcome, setOutcome] = useState(null);

  const form = useRef(null);
  const emailField = useRef(null);
  const ending = useRef(null);
  const busy = useRef(false);
  const finished = outcome === "sent" || outcome === "preview";

  // The ending takes the form's place. Focus moves to it, so a keyboard or
  // screen reader user lands on the answer and hears it.
  useEffect(() => {
    if (finished) ending.current?.focus();
  }, [finished]);

  if (!IS_OPEN) {
    return (
      <p className="hz-form-closed" data-hz-waitlist="closed">
        {MESSAGES.closed}
      </p>
    );
  }

  async function submit(event) {
    event.preventDefault();
    if (busy.current) return;

    const field = emailField.current;
    const missing = {
      email: field.value.trim() === "" || !field.checkValidity(),
      where: where === "",
      pay: pay === "",
    };
    if (missing.email || missing.where || missing.pay) {
      setOutcome(null);
      setProblems(missing);
      const first = missing.email ? field : form.current.querySelector(`input[name="${missing.where ? "where" : "pay"}"]`);
      first?.focus();
      return;
    }
    setProblems(null);

    // A preview build sends nothing, whatever was typed.
    if (IS_PREVIEW) {
      setOutcome("preview");
      return;
    }
    // People never see the last field. If it holds anything, a script filled
    // the form in: answer as if it went through, and send nothing.
    if (website.trim() !== "") {
      setOutcome("sent");
      return;
    }

    busy.current = true;
    setSending(true);
    setOutcome(null);
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
    let next = "failed";
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        mode: "same-origin",
        credentials: "omit",
        cache: "no-store",
        referrerPolicy: "no-referrer",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: field.value.trim(), where, pay, note: note.trim().slice(0, NOTE_LENGTH), website }),
        signal: controller.signal,
      });
      if (response.ok) next = "sent";
    } catch {
      // A request that could not be made, or took too long, is a failure.
    }
    window.clearTimeout(timer);
    busy.current = false;
    setSending(false);
    setOutcome(next);
  }

  const settle = (key) => setProblems((current) => (current ? { ...current, [key]: false } : current));
  const choiceMissing = Boolean(problems?.where || problems?.pay);

  return (
    <div className="hz-form-wrap" data-hz-waitlist={IS_PREVIEW ? "preview" : "open"}>
      <p className="hz-form-ending" role="status" tabIndex={-1} ref={ending} hidden={!finished}>
        {finished ? MESSAGES[outcome] : ""}
      </p>
      {!finished && (
        <form className="hz-form" method="post" noValidate onSubmit={submit} ref={form}>
          <div className="hz-field" data-missing={problems?.email ? "true" : undefined}>
            <label htmlFor={emailId}>Email</label>
            <input
              id={emailId}
              ref={emailField}
              name="email"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              autoCapitalize="none"
              spellCheck={false}
              value={email}
              aria-invalid={problems?.email ? "true" : undefined}
              aria-describedby={problems?.email ? emailProblemId : undefined}
              onChange={(event) => {
                setEmail(event.target.value);
                settle("email");
              }}
            />
          </div>

          <Choices
            legend="Where would you use it?"
            name="where"
            options={WHERE}
            value={where}
            missing={problems?.where}
            describedBy={choiceProblemId}
            onChange={(value) => {
              setWhere(value);
              settle("where");
            }}
          />
          <Choices
            legend="What would you pay?"
            name="pay"
            options={PAY}
            value={pay}
            missing={problems?.pay}
            describedBy={choiceProblemId}
            onChange={(value) => {
              setPay(value);
              settle("pay");
            }}
          />

          <div className="hz-field">
            <label htmlFor={noteId}>
              What bothers you most about being tracked? <span className="hz-optional">(optional)</span>
            </label>
            <input id={noteId} name="note" type="text" maxLength={NOTE_LENGTH} autoComplete="off" value={note} onChange={(event) => setNote(event.target.value)} />
          </div>

          <div className="hz-form-extra" aria-hidden="true">
            <input name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
          </div>

          <div className="hz-form-end">
            <div className="hz-form-problems" role="alert">
              {problems?.email && <p id={emailProblemId}>{MESSAGES.email}</p>}
              {choiceMissing && <p id={choiceProblemId}>{MESSAGES.choice}</p>}
              {outcome === "failed" && <p>{MESSAGES.failed}</p>}
            </div>
            <button className="hz-button hz-form-submit" type="submit" disabled={!takenOver || sending} aria-busy={sending || undefined}>
              Join the waitlist
            </button>
            <noscript>
              <p className="hz-form-noscript">This form needs JavaScript to send.</p>
            </noscript>
          </div>
        </form>
      )}
      <p className="hz-form-small">
        The list holds your email, these answers and the day you joined. Nothing else. One email when there is news. To
        leave the list, email{" "}
        <a href={`mailto:${LEAVE_ADDRESS}`}>{LEAVE_ADDRESS}</a>.
      </p>
    </div>
  );
}
