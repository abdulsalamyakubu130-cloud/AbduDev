import { useEffect, useRef, useState } from "react";
import "./App.css";
import profileImage from "./assets/abdudev-profile.png";
import {
  ABOUT_FACTS,
  ABOUT_PARAGRAPHS,
  CONTACT_CHANNELS,
  HERO_BADGES,
  HERO_METRICS,
  NAV_ITEMS,
  PROCESS_STEPS,
  SERVICES,
  SOCIAL_LINKS,
  TECH_STACK,
  TIMELINE,
  VALUE_POINTS,
  WORK_SHOWCASE,
} from "./content.js";

const RESUME_VIEW_PATH = "/Yakubu-Abdulsalam-Enemona-Resume.html";
const RESUME_DOWNLOAD_PATH = "/Yakubu-Abdulsalam-Enemona-Resume.rtf";
const CONTACT_EMAIL = "yakubuabdulsalam24434@gmail.com";
const CONTACT_PHONE_URI = "tel:+2348125229560";
const CONTACT_WHATSAPP_URI = "https://wa.me/2348125229560";
const BOT_QUICK_ACTIONS = [
  { label: "Services", prompt: "What services do you offer?" },
  { label: "Stack", prompt: "What tech stack do you use?" },
  { label: "Contact", prompt: "How can I contact you?" },
  { label: "Resume", prompt: "How do I download your resume?" },
  { label: "Time", prompt: "What is your local time?" },
];

function getLagosTimeParts() {
  const now = new Date();

  return {
    time: new Intl.DateTimeFormat("en-NG", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Africa/Lagos",
    }).format(now),
    date: new Intl.DateTimeFormat("en-NG", {
      weekday: "long",
      day: "numeric",
      month: "long",
      timeZone: "Africa/Lagos",
    }).format(now),
  };
}

function getBotReply(prompt) {
  const query = prompt.toLowerCase();

  if (/\b(time|clock|lagos)\b/.test(query)) {
    const clock = getLagosTimeParts();

    return {
      text: `It is currently ${clock.time} WAT in Lagos, Nigeria. Today is ${clock.date}.`,
    };
  }

  if (/\b(service|build|website|landing|design|redesign)\b/.test(query)) {
    const serviceList = SERVICES.map((service) => service.title).join(", ");

    return {
      text: `AbduDev currently focuses on ${serviceList}. The goal is stronger frontend delivery, reliable backend support, and cleaner visual presentation.`,
      sectionId: "services",
    };
  }

  if (/\b(stack|tech|react|frontend|backend|node|express|html|css|javascript|graphic|figma|mongodb|mysql)\b/.test(query)) {
    const stackList = TECH_STACK.slice(0, 4)
      .map((item) => item.title)
      .join(", ");

    return {
      text: `The main stack includes ${stackList}. AbduDev works across frontend development, backend systems, databases, and graphic design workflow.`,
      sectionId: "stack",
    };
  }

  if (/\b(work|project|portfolio|case study)\b/.test(query)) {
    const focusList = WORK_SHOWCASE.map((item) => item.title).join(", ");

    return {
      text: `AbduDev is currently positioned around ${focusList}. The portfolio is ready to present real frontend, backend, and design work more clearly.`,
      sectionId: "work",
    };
  }

  if (/\b(contact|hire|email|phone|whatsapp|reach)\b/.test(query)) {
    return {
      text: "You can contact AbduDev by phone on 08125229560, by email at yakubuabdulsalam24434@gmail.com, or directly through WhatsApp.",
      sectionId: "contact",
    };
  }

  if (/\b(resume|cv)\b/.test(query)) {
    return {
      text: "Use the Download Resume button to save a copy, or use Preview Template to open the polished document-style version.",
      sectionId: "contact",
    };
  }

  if (/\b(about|abdudev|who are you)\b/.test(query)) {
    return {
      text: "AbduDev is a developer-designer brand focused on frontend development, backend systems, and graphic design for modern digital projects.",
      sectionId: "about",
    };
  }

  return {
    text: "Ask about services, tech stack, contact details, work focus, or the current Lagos time and I will guide you.",
  };
}

function SectionHeading({ eyebrow, title, copy }) {
  return (
    <div className="section-heading">
      <p className="section-heading__eyebrow" data-reveal>
        {eyebrow}
      </p>
      <h2 data-reveal>{title}</h2>
      <p className="section-heading__copy" data-reveal>
        {copy}
      </p>
    </div>
  );
}

function readContactPayload(formElement) {
  if (!formElement) {
    return { name: "", email: "", message: "" };
  }

  const formData = new FormData(formElement);

  return {
    name: String(formData.get("name") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    message: String(formData.get("message") || "").trim(),
  };
}

function buildMailDraftUrl(payload) {
  const subject = encodeURIComponent(`Project inquiry from ${payload.name}`);
  const body = encodeURIComponent(
    [
      "Hello AbduDev,",
      "",
      `My name is ${payload.name}.`,
      `You can reply to me at ${payload.email}.`,
      "",
      "Project brief:",
      payload.message,
    ].join("\n"),
  );

  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

function buildWhatsAppDraftUrl(payload) {
  const text = encodeURIComponent(
    [
      "Hello AbduDev,",
      "",
      `My name is ${payload.name}.`,
      `My email is ${payload.email}.`,
      "",
      "Project brief:",
      payload.message,
    ].join("\n"),
  );

  return `${CONTACT_WHATSAPP_URI}?text=${text}`;
}

function App() {
  const botFeedRef = useRef(null);
  const contactFormRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("hero");
  const [contactStatus, setContactStatus] = useState("idle");
  const [clock, setClock] = useState(() => getLagosTimeParts());
  const [botInput, setBotInput] = useState("");
  const [botMessages, setBotMessages] = useState([
    {
      role: "bot",
      text: "Hi, I'm AbduBot. Ask me about services, work, contact details, resume download, tech stack, or the current Lagos time.",
    },
  ]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 1600);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.title = "AbduDev | Dev and Design Portfolio";

    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        "AbduDev builds frontend interfaces, backend systems, and design assets for modern digital projects.",
      );

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", "#050816");
  }, []);

  useEffect(() => {
    if (isLoading) {
      return undefined;
    }

    const sections = Array.from(document.querySelectorAll("[data-section]"));
    const revealElements = Array.from(
      document.querySelectorAll("[data-reveal]"),
    );

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.35 },
    );

    revealElements.forEach((element) => revealObserver.observe(element));
    sections.forEach((section) => sectionObserver.observe(section));

    return () => {
      revealObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, [isLoading]);

  useEffect(() => {
    const syncClock = () => {
      setClock(getLagosTimeParts());
    };

    syncClock();
    const timer = window.setInterval(syncClock, 30000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!botFeedRef.current) {
      return;
    }

    botFeedRef.current.scrollTo({
      top: botFeedRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [botMessages]);

  const handleNavigate = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleContactSubmit = (event) => {
    event.preventDefault();
    const payload = readContactPayload(event.currentTarget);

    if (!payload.name || !payload.email || !payload.message) {
      setContactStatus("error");
      return;
    }

    setContactStatus("email");
    window.location.href = buildMailDraftUrl(payload);
  };

  const handleWhatsAppSubmit = () => {
    const payload = readContactPayload(contactFormRef.current);

    if (!payload.name || !payload.email || !payload.message) {
      setContactStatus("error");
      return;
    }

    setContactStatus("whatsapp");
    window.open(
      buildWhatsAppDraftUrl(payload),
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleBotConversation = (prompt) => {
    const response = getBotReply(prompt);

    setBotMessages((current) => [
      ...current,
      { role: "user", text: prompt },
      { role: "bot", text: response.text },
    ]);

    if (response.sectionId) {
      handleNavigate(response.sectionId);
    }
  };

  const handleBotSubmit = (event) => {
    event.preventDefault();

    const prompt = botInput.trim();
    if (!prompt) {
      return;
    }

    setBotInput("");
    handleBotConversation(prompt);
  };

  const handleResumeDownload = () => {
    if (typeof window === "undefined") {
      return;
    }

    const link = document.createElement("a");
    link.href = RESUME_DOWNLOAD_PATH;
    link.download = "Yakubu-Abdulsalam-Enemona-Resume.rtf";
    document.body.append(link);
    link.click();
    link.remove();
  };

  const resumePrimaryLabel = "Download Resume";
  const resumeSummary =
    "Download the resume file directly, or preview the polished document-style version online.";

  if (isLoading) {
    return (
      <div className="preloader" role="status" aria-live="polite">
        <div className="preloader__panel">
          <div className="preloader__brand">
            <div className="preloader__mark" aria-hidden="true">
              A
            </div>
            <strong className="preloader__title">AbduDev</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-shell">
      <div className="portfolio-shell__grid" aria-hidden="true" />

      <header className="site-header">
        <button
          className="site-header__brand"
          type="button"
          onClick={() => handleNavigate("hero")}
        >
          <span className="site-header__mark">A</span>
          <span className="site-header__brand-copy">
            <strong>AbduDev</strong>
            <small>Development + design</small>
          </span>
        </button>

        <nav className="site-header__nav" aria-label="Primary navigation">
          <button
            className={`site-header__nav-item ${activeSection === "hero" ? "is-active" : ""}`}
            type="button"
            onClick={() => handleNavigate("hero")}
          >
            Home
          </button>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`site-header__nav-item ${activeSection === item.id ? "is-active" : ""}`}
              type="button"
              onClick={() => handleNavigate(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          className="button button--primary site-header__cta"
          type="button"
          onClick={() => handleNavigate("contact")}
        >
          Hire Me
        </button>
      </header>

      <main className="page-shell">
        <section id="hero" className="hero" data-section>
          <div className="hero__grid">
            <div className="hero__copy">
              <p className="section-heading__eyebrow" data-reveal>
                AbduDev / Frontend, backend, and graphic design
              </p>
              <h1 className="hero__title">
                <span data-reveal style={{ "--reveal-order": 0 }}>
                  Building frontend,
                </span>
                <span data-reveal style={{ "--reveal-order": 1 }}>
                  backend, and design
                </span>
                <span data-reveal style={{ "--reveal-order": 2 }}>
                  work that feels sharp.
                </span>
              </h1>
              <p
                className="hero__lede"
                data-reveal
                style={{ "--reveal-order": 3 }}
              >
                AbduDev builds frontend interfaces, backend systems, and graphic
                design assets for brands, products, and businesses that need
                cleaner structure, stronger visuals, and more professional presentation.
              </p>

              <div
                className="hero__actions"
                data-reveal
                style={{ "--reveal-order": 4 }}
              >
                <button
                  className="button button--primary"
                  type="button"
                  onClick={() => handleNavigate("work")}
                >
                  View My Work
                </button>
                <button
                  className="button button--secondary"
                  type="button"
                  onClick={handleResumeDownload}
                >
                  {resumePrimaryLabel}
                </button>
                <button
                  className="button button--secondary"
                  type="button"
                  onClick={() => handleNavigate("contact")}
                >
                  Contact Me
                </button>
              </div>

              <div
                className="hero__badges"
                data-reveal
                style={{ "--reveal-order": 5 }}
              >
                {HERO_BADGES.map((badge) => (
                  <span key={badge}>{badge}</span>
                ))}
              </div>
            </div>

            <div
              className="hero__visual"
              data-reveal
              style={{ "--reveal-order": 2 }}
            >
              <div className="hero__visual-frame">
                <div className="hero__visual-glow" aria-hidden="true" />
                <div className="hero__led hero__led--top" aria-hidden="true" />
                <div className="hero__led hero__led--side" aria-hidden="true" />
                <img
                  src={profileImage}
                  alt="Yakubu Abdulsalam Enemona portrait"
                  loading="eager"
                />

                <article className="hero__glass hero__glass--top">
                  <span>Available now</span>
                  <strong>
                    For frontend, backend, and graphic design projects
                  </strong>
                </article>

                <article className="hero__glass hero__glass--bottom">
                  <span>Direct contact</span>
                  <strong>08125229560</strong>
                </article>
              </div>
            </div>
          </div>

          <div className="hero__bottom">
            <div
              className="hero__metrics"
              data-reveal
              style={{ "--reveal-order": 6 }}
            >
              {HERO_METRICS.map((metric) => (
                <article key={metric.label} className="hero__metric">
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </article>
              ))}
            </div>

            <article
              className="hero__time-card"
              data-reveal
              style={{ "--reveal-order": 7 }}
            >
              <span>Local time / Lagos</span>
              <strong>{clock.time}</strong>
              <p>{clock.date}</p>
            </article>
          </div>
        </section>

        <section id="work" className="page-section" data-section>
          <SectionHeading
            eyebrow="Selected Work"
            title="What AbduDev is built to create."
            copy="A selection of frontend, backend, and design projects, including live demos you can open directly from the portfolio."
          />

          <div className="work-grid">
            {WORK_SHOWCASE.map((item, index) => (
              <article
                key={item.title}
                className="work-card"
                data-reveal
                style={{ "--reveal-order": index }}
              >
                <span>{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <div className="work-card__tags">
                  {item.points.map((point) => (
                    <span key={point}>{point}</span>
                  ))}
                </div>
                {item.href ? (
                  <a
                    className="work-card__link"
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.cta || "View Project"}
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section id="services" className="page-section" data-section>
          <SectionHeading
            eyebrow="Services"
            title="Development and design services built around frontend, backend, and visuals."
            copy="From interfaces and APIs to graphic assets and launch polish, each service is focused on making the final product feel cleaner, stronger, and more useful."
          />

          <div className="service-list">
            {SERVICES.map((service, index) => (
              <article
                key={service.title}
                className="service-row"
                data-reveal
                style={{ "--reveal-order": index }}
              >
                <div className="service-row__number">{service.number}</div>
                <div className="service-row__content">
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                  <div className="service-row__tags">
                    {service.items.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="stack"
          className="page-section page-section--split"
          data-section
        >
          <div className="split-panel">
            <SectionHeading
              eyebrow="Process"
              title="A simple workflow that keeps projects clean from start to finish."
              copy="The goal is to move from direction to design and development without letting the final product lose clarity or polish along the way."
            />

            <div className="process-list">
              {PROCESS_STEPS.map((step, index) => (
                <article
                  key={step.title}
                  className="process-card"
                  data-reveal
                  style={{ "--reveal-order": index }}
                >
                  <span>{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="split-panel">
            <SectionHeading
              eyebrow="Tech Stack"
              title="The tools behind the work."
              copy="AbduDev works across frontend tools, backend systems, databases, and design workflow to deliver more complete digital projects."
            />

            <div className="tech-grid">
              {TECH_STACK.map((item, index) => (
                <article
                  key={item.title}
                  className="tech-card"
                  data-reveal
                  style={{ "--reveal-order": index % 3 }}
                >
                  <span>{item.label}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="page-section" data-section>
          <div className="about-grid">
            <div className="about-story">
              <SectionHeading
                eyebrow="About"
                title="A developer-designer brand focused on frontend, backend, and graphic design."
                copy={ABOUT_PARAGRAPHS[0]}
              />

              <p
                className="about-story__body"
                data-reveal
                style={{ "--reveal-order": 3 }}
              >
                {ABOUT_PARAGRAPHS[1]}
              </p>

              <div className="fact-grid">
                {ABOUT_FACTS.map((fact, index) => (
                  <article
                    key={fact.label}
                    className="fact-card"
                    data-reveal
                    style={{ "--reveal-order": index + 4 }}
                  >
                    <span>{fact.label}</span>
                    <strong>{fact.value}</strong>
                  </article>
                ))}
              </div>
            </div>

            <div className="about-side">
              <div className="value-grid">
                {VALUE_POINTS.map((item, index) => (
                  <article
                    key={item.title}
                    className="value-card"
                    data-reveal
                    style={{ "--reveal-order": index }}
                  >
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>

              <div className="timeline">
                {TIMELINE.map((item, index) => (
                  <article
                    key={item.year}
                    className="timeline-item"
                    data-reveal
                    style={{ "--reveal-order": index + 1 }}
                  >
                    <span>{item.year}</span>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="page-section contact" data-section>
          <div className="contact-panel">
            <div className="contact-copy">
              <SectionHeading
                eyebrow="Contact"
                title="Let’s build a website that looks cleaner and feels more professional."
                copy="If you need frontend development, backend help, or graphic design support, reach out directly by phone, email, WhatsApp, or the project form."
              />

              <div className="contact-links" data-reveal>
                {CONTACT_CHANNELS.map((channel) => (
                  <a key={channel.label} href={channel.href}>
                    <span>{channel.label}</span>
                    <strong>{channel.value}</strong>
                  </a>
                ))}
              </div>

              <div
                className="contact-socials"
                data-reveal
                style={{ "--reveal-order": 1 }}
              >
                {SOCIAL_LINKS.map((item) => (
                  <a key={item.label} href={item.href}>
                    {item.label}
                  </a>
                ))}
              </div>

              <article
                className="resume-card"
                data-reveal
                style={{ "--reveal-order": 2 }}
              >
                <span>Resume</span>
                <strong>Yakubu Abdulsalam Enemona</strong>
                <p>
                  Software Developer based in Lagos State, Nigeria.{" "}
                  {resumeSummary}
                </p>
                <div className="resume-card__actions">
                  <button
                    className="button button--primary"
                    type="button"
                    onClick={handleResumeDownload}
                  >
                    {resumePrimaryLabel}
                  </button>
                  <a
                    className="button button--secondary"
                    href={RESUME_VIEW_PATH}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Preview Template
                  </a>
                </div>
              </article>

              <div
                className="abdu-bot"
                data-reveal
                style={{ "--reveal-order": 3 }}
              >
                <div className="abdu-bot__panel">
                  <div className="abdu-bot__head">
                    <span>AI Assistant</span>
                    <strong>AbduBot</strong>
                    <p>
                      Ask about services, contact details, work focus, stack, or
                      local time.
                    </p>
                  </div>

                  <div
                    ref={botFeedRef}
                    className="abdu-bot__feed"
                    aria-live="polite"
                  >
                    {botMessages.map((message, index) => (
                      <article
                        key={`${message.role}-${index}`}
                        className={`abdu-bot__message abdu-bot__message--${message.role}`}
                      >
                        <span>
                          {message.role === "bot" ? "AbduBot" : "You"}
                        </span>
                        <p>{message.text}</p>
                      </article>
                    ))}
                  </div>

                  <div className="abdu-bot__chips">
                    {BOT_QUICK_ACTIONS.map((action) => (
                      <button
                        key={action.label}
                        className="abdu-bot__chip"
                        type="button"
                        onClick={() => handleBotConversation(action.prompt)}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>

                  <form className="abdu-bot__form" onSubmit={handleBotSubmit}>
                    <input
                      type="text"
                      value={botInput}
                      onChange={(event) => setBotInput(event.target.value)}
                      placeholder="Ask AbduBot something..."
                      aria-label="Message AbduBot"
                    />
                    <button className="button button--primary" type="submit">
                      Send
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <form
              ref={contactFormRef}
              className="contact-form"
              data-reveal
              onSubmit={handleContactSubmit}
            >
              <label>
                <span>Name</span>
                <input name="name" type="text" placeholder="Your name" />
              </label>
              <label>
                <span>Email</span>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                />
              </label>
              <label>
                <span>Project brief</span>
                <textarea
                  name="message"
                  rows="6"
                  placeholder="Tell me about the website you want to build."
                />
              </label>
              <div className="contact-form__actions">
                <button className="button button--primary" type="submit">
                  Send by Email
                </button>
                <button
                  className="button button--secondary"
                  type="button"
                  onClick={handleWhatsAppSubmit}
                >
                  Send on WhatsApp
                </button>
                <a
                  className="button button--secondary"
                  href={CONTACT_PHONE_URI}
                >
                  Call Now
                </a>
              </div>
              <p
                className={`status-text ${contactStatus !== "idle" ? "is-visible" : ""}`}
              >
                {contactStatus === "email"
                  ? "Your email app is opening. Send the draft there to deliver it directly to AbduDev."
                  : null}
                {contactStatus === "whatsapp"
                  ? "WhatsApp is opening with your project message."
                  : null}
                {contactStatus === "error"
                  ? "Please complete every field before sending by email or WhatsApp."
                  : null}
              </p>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <strong>AbduDev</strong>
        </div>
        <a href="mailto:yakubuabdulsalam24434@gmail.com">
          yakubuabdulsalam24434@gmail.com
        </a>
      </footer>
    </div>
  );
}

export default App;
