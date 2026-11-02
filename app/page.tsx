import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "PHANTASM YT AI | Watch. Search. Chat.",
  description:
    "A premium AI-powered video experience for discovering content, searching smarter, and getting instant answers.",
};

const capabilities = [
  {
    number: "01",
    title: "Watch without friction",
    description:
      "Discover and play curated video content through a focused, responsive viewing experience.",
    detail: "Video intelligence",
  },
  {
    number: "02",
    title: "Search in context",
    description:
      "Turn natural language questions into precise searches without breaking your viewing flow.",
    detail: "Semantic discovery",
  },
  {
    number: "03",
    title: "Chat with every moment",
    description:
      "Bring an AI copilot into the experience and switch models as your task demands.",
    detail: "Adaptive assistance",
  },
];

export default async function Home() {
  const { userId } = await auth();
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <main className="landing-shell overflow-hidden">
      <div className="gradient-field" aria-hidden="true">
        <div className="gradient-orb gradient-orb-one" />
        <div className="gradient-orb gradient-orb-two" />
        <div className="noise-layer" />
      </div>

      <nav className="nav-bar" aria-label="Primary navigation">
        <Link className="brand-mark" href="/" aria-label="PHANTASM home">
          <span className="brand-glyph" aria-hidden="true">
            P
          </span>
          <span>PHANTASM</span>
        </Link>

        <div className="nav-actions">
          <Link className="nav-link" href="/sign-in">
            Sign in
          </Link>
          <Link className="nav-cta" href="/sign-up">
            Get started
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </nav>

      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="status-pill">
            <span className="status-dot" aria-hidden="true" />
            Intelligent viewing is online
          </div>

          <h1 id="hero-title">
            Watch deeper.
            <br />
            <span>Think further.</span>
          </h1>

          <p className="hero-lede">
            One cinematic workspace for discovery, AI-powered search, and
            answers that move as fast as your curiosity.
          </p>

          <div className="hero-actions">
            <Link className="primary-cta" href="/sign-up">
              Enter PHANTASM
              <span aria-hidden="true">→</span>
            </Link>
            <Link className="secondary-cta" href="/sign-in">
              Sign in
            </Link>
          </div>
        </div>

        <div className="experience-panel" aria-label="PHANTASM product preview">
          <div className="panel-chrome">
            <div className="window-controls" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <span className="panel-label">PHANTASM / LIVE WORKSPACE</span>
            <span className="panel-state">● Active</span>
          </div>

          <div className="video-preview">
            <div className="preview-grid" aria-hidden="true" />
            <div className="preview-signal">
              <div className="signal-ring signal-ring-one" />
              <div className="signal-ring signal-ring-two" />
              <div className="signal-core">P</div>
            </div>
            <div className="preview-caption">
              <span>AI workspace</span>
              <strong>Context mode</strong>
            </div>
          </div>

          <div className="ai-console">
            <div className="console-heading">
              <span>PHANTASM AI</span>
              <span className="model-badge">Nemotron 3 Ultra</span>
            </div>
            <div className="prompt-line">
              <span className="prompt-avatar">P</span>
              <p>Explain the key ideas from this video.</p>
            </div>
            <div className="response-line">
              <span className="response-mark" aria-hidden="true" />
              <p>
                Analyzing visual context and generating a structured
                breakdown...
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="signal-strip" aria-label="Platform capabilities">
        <p>WATCH</p>
        <span aria-hidden="true" />
        <p>SEARCH</p>
        <span aria-hidden="true" />
        <p>CHAT</p>
        <span aria-hidden="true" />
        <p className="signal-accent">DISCOVER MORE</p>
      </section>

      <section className="capabilities-section" aria-labelledby="capabilities-title">
        <div className="section-heading">
          <p className="eyebrow">BUILT FOR FOCUS</p>
          <h2 id="capabilities-title">
            The platform between
            <br />
            <span>you and the signal.</span>
          </h2>
        </div>

        <div className="capability-grid">
          {capabilities.map((capability) => (
            <article className="capability-card" key={capability.number}>
              <div className="card-topline">
                <span>{capability.number}</span>
                <span>{capability.detail}</span>
              </div>
              <div>
                <h3>{capability.title}</h3>
                <p>{capability.description}</p>
              </div>
              <span className="card-arrow" aria-hidden="true">
                ↗
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="closing-section">
        <div>
          <p className="eyebrow">YOUR NEXT IDEA STARTS HERE</p>
          <h2>Move from watching to understanding.</h2>
        </div>
        <Link className="primary-cta" href="/sign-up">
          Get started
          <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}
