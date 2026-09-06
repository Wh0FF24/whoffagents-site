/**
 * InquiryForm — the site's one inquiry intake.
 *
 * Two modes, decided at build time:
 *  - VITE_PRIVATE_PREVIEW is not explicitly 'false' → local simulation. Nothing leaves the
 *    browser, and the form says so both before and after submitting. It never
 *    claims a lead was received.
 *  - explicitly 'false' → POST JSON to VITE_CONTACT_ENDPOINT, which must be a
 *    same-origin path. With no valid endpoint configured the form says so
 *    honestly and offers a mailto fallback rather than faking a success.
 *
 * No provider keys, no analytics on the payload, no storage, and nothing the
 * visitor typed is ever logged.
 */
import { useId, useRef, useState } from "react";
import { Link } from "react-router-dom";

const SERVICES = ["Website", "AI agent", "Developer tools"];
const CONTACT_METHODS = [
  {
    key: "Email",
    label: "Email",
    type: "email",
    autoComplete: "email",
    placeholder: "you@business.com",
  },
  {
    key: "Phone",
    label: "Phone",
    type: "tel",
    autoComplete: "tel",
    placeholder: "(555) 555-0123",
  },
];

const FALLBACK_EMAIL = "hello@whoffagents.com";
const REQUEST_TIMEOUT_MS = 12000;

const IS_PREVIEW = import.meta.env.VITE_PRIVATE_PREVIEW !== "false";
const RAW_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT;

/**
 * Same-origin path only: must start with a single "/" and contain no
 * backslash, so "//evil.example" and "/\evil.example" are both rejected.
 */
function sameOriginPath(value) {
  if (typeof value !== "string") return null;
  const path = value.trim();
  if (!path.startsWith("/")) return null;
  if (path.startsWith("//")) return null;
  if (path.includes("\\")) return null;
  return path;
}

const ENDPOINT = sameOriginPath(RAW_ENDPOINT);

export default function InquiryForm({ initialService = "Website" }) {
  const uid = useId();
  const nameId = `${uid}-name`;
  const businessId = `${uid}-business`;
  const emailId = `${uid}-email`;
  const phoneId = `${uid}-phone`;
  const needsId = `${uid}-needs`;
  const honeypotId = `${uid}-website-confirm`;
  const helpId = `${uid}-help`;
  const statusId = `${uid}-status`;

  const [service, setService] = useState(
    SERVICES.includes(initialService) ? initialService : SERVICES[0],
  );
  const [contactMethod, setContactMethod] = useState("Email");
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [needs, setNeeds] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [sending, setSending] = useState(false);
  // status: { tone: 'success' | 'error' | 'note', message: string, showMailto?: boolean }
  const [status, setStatus] = useState(null);
  const sendingRef = useRef(false);

  const usePhone = contactMethod === "Phone";

  function finish(next) {
    sendingRef.current = false;
    setSending(false);
    setStatus(next);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // Double-click / double-submit guard: the ref settles synchronously,
    // before React has a chance to re-render the disabled button.
    if (sendingRef.current) return;
    sendingRef.current = true;
    setSending(true);
    setStatus(null);

    // Honeypot: a real person never sees this field. No request, no success.
    if (honeypot.trim() !== "") {
      finish({
        tone: "error",
        message: `We could not submit this form. Please email ${FALLBACK_EMAIL} and we will pick it up from there.`,
        showMailto: true,
      });
      return;
    }

    if (IS_PREVIEW) {
      finish({
        tone: "note",
        message: "Preview complete. Nothing was sent.",
      });
      return;
    }

    if (!ENDPOINT) {
      finish({
        tone: "error",
        message: `This form has no delivery address configured, so your message was not sent. Please email ${FALLBACK_EMAIL} instead.`,
        showMailto: true,
      });
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          service,
          name: name.trim(),
          business: business.trim(),
          contactMethod,
          contactValue: (usePhone ? phone : email).trim(),
          needs: needs.trim(),
        }),
        signal: controller.signal,
      });

      let payload = null;
      try {
        payload = await response.json();
      } catch {
        payload = null;
      }

      // Success requires both: a 2xx AND the server explicitly accepting it.
      if (!response.ok || !payload || payload.accepted !== true) {
        finish({
          tone: "error",
          message: `We could not deliver that just now — your details are still here, so you can try again. If it keeps failing, email ${FALLBACK_EMAIL}.`,
          showMailto: true,
        });
        return;
      }

      setName("");
      setBusiness("");
      setEmail("");
      setPhone("");
      setNeeds("");
      finish({
        tone: "success",
        message:
          "Your inquiry was received. We will reply within one business day.",
      });
    } catch (error) {
      // Nothing the visitor typed is logged here — only the failure shape matters.
      const timedOut = error?.name === "AbortError";
      finish({
        tone: "error",
        message: timedOut
          ? `We could not confirm receipt before the request timed out. Your details are still here. Please email ${FALLBACK_EMAIL} to check before submitting again.`
          : `We could not confirm receipt. Your details are still here. Please email ${FALLBACK_EMAIL} to check before submitting again.`,
        showMailto: true,
      });
    } finally {
      clearTimeout(timer);
    }
  }

  return (
    <form className="iq-form" onSubmit={handleSubmit} aria-describedby={helpId}>
      {IS_PREVIEW && (
        <p className="iq-preview-note">
          Local preview: this form is a simulation. Submitting sends nothing and
          reaches nobody.
        </p>
      )}

      <fieldset className="iq-fieldset iq-services">
        <legend className="iq-legend">What do you need?</legend>
        <div className="iq-radios">
          {SERVICES.map((option) => (
            <label className="iq-radio" key={option}>
              <input
                type="radio"
                name="service"
                value={option}
                className="iq-radio-input"
                checked={service === option}
                onChange={() => setService(option)}
                disabled={sending}
                required
              />
              <span className="iq-radio-label">{option}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="iq-row">
        <div className="iq-field">
          <label className="iq-label" htmlFor={nameId}>
            Name
          </label>
          <input
            id={nameId}
            className="iq-input"
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            disabled={sending}
            required
          />
        </div>

        <div className="iq-field">
          <label className="iq-label" htmlFor={businessId}>
            Business <span className="iq-optional">(optional)</span>
          </label>
          <input
            id={businessId}
            className="iq-input"
            type="text"
            name="business"
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            autoComplete="organization"
            disabled={sending}
          />
        </div>
      </div>

      <div className="iq-field">
        <span className="iq-label" id={`${uid}-contact-label`}>
          How should we reply?
        </span>
        <div
          className="iq-toggle"
          role="group"
          aria-labelledby={`${uid}-contact-label`}
        >
          {CONTACT_METHODS.map((method) => (
            <button
              key={method.key}
              type="button"
              className="iq-toggle-button"
              aria-pressed={contactMethod === method.key}
              onClick={() => setContactMethod(method.key)}
              disabled={sending}
            >
              {method.label}
            </button>
          ))}
        </div>
      </div>

      {usePhone ? (
        <div className="iq-field">
          <label className="iq-label" htmlFor={phoneId}>
            Phone
          </label>
          <input
            id={phoneId}
            className="iq-input"
            type="tel"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            placeholder="(555) 555-0123"
            disabled={sending}
            required
          />
        </div>
      ) : (
        <div className="iq-field">
          <label className="iq-label" htmlFor={emailId}>
            Email
          </label>
          <input
            id={emailId}
            className="iq-input"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="you@business.com"
            disabled={sending}
            required
          />
        </div>
      )}

      <div className="iq-field">
        <label className="iq-label" htmlFor={needsId}>
          What are you trying to get done?
        </label>
        <textarea
          id={needsId}
          className="iq-textarea"
          name="needs"
          rows={4}
          value={needs}
          onChange={(e) => setNeeds(e.target.value)}
          maxLength={1200}
          disabled={sending}
          required
        />
      </div>

      {/* Honeypot — hidden from people, tempting to bots. Never sent anywhere. */}
      <div className="iq-hp" aria-hidden="true">
        <label htmlFor={honeypotId}>Website confirm</label>
        <input
          id={honeypotId}
          name="website_confirm"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <button type="submit" className="iq-submit" disabled={sending}>
        {sending ? "Sending…" : "Tell us about your project →"}
      </button>

      <p className="iq-help" id={helpId}>
        We use these details to respond to your inquiry.{" "}
        <Link className="iq-privacy-link" to="/privacy">
          Privacy
        </Link>
      </p>

      <p
        className={status ? `iq-status iq-status-${status.tone}` : "iq-status"}
        id={statusId}
        role="status"
        aria-live="polite"
      >
        {status?.message}
        {status?.showMailto && (
          <>
            {" "}
            <a className="iq-mailto" href={`mailto:${FALLBACK_EMAIL}`}>
              {FALLBACK_EMAIL}
            </a>
          </>
        )}
      </p>
    </form>
  );
}
