/* Testimonials carousel (React 18 via CDN + htm, no build step).
   Mounts into #testimonials-root in index.html. */

(function () {
  const { useState, useEffect, useCallback } = React;
  const html = htm.bind(React.createElement);

  // PLACEHOLDER CONTENT — replace with real learner quotes (with their permission) before deploying.
  const TESTIMONIALS = [
    {
      quote: "Replace this with a real learner quote about the DevOps Micro Internship.",
      name: "Learner Name",
      role: "Role, Company",
    },
    {
      quote: "Replace this with a real learner quote about a course or book.",
      name: "Learner Name",
      role: "Role, Company",
    },
    {
      quote: "Replace this with a real learner quote about the community.",
      name: "Learner Name",
      role: "Role, Company",
    },
  ];

  const AUTO_ADVANCE_MS = 6000;

  const prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function TestimonialsCarousel({ items }) {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(prefersReducedMotion);
    const count = items.length;

    const go = useCallback((i) => setIndex(((i % count) + count) % count), [count]);
    const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
    const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

    useEffect(() => {
      if (paused || count < 2) return;
      const id = setInterval(next, AUTO_ADVANCE_MS);
      return () => clearInterval(id);
    }, [paused, next, count]);

    const onKeyDown = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    const t = items[index];

    return html`
      <div
        class="testimonials"
        role="region"
        aria-roledescription="carousel"
        aria-label="Learner testimonials"
        onMouseEnter=${() => setPaused(true)}
        onMouseLeave=${() => setPaused(prefersReducedMotion)}
        onFocus=${() => setPaused(true)}
        onBlur=${() => setPaused(prefersReducedMotion)}
        onKeyDown=${onKeyDown}
      >
        <h3 class="testimonials-title">What Learners Say</h3>

        <figure class="testimonial-card" key=${index} aria-live=${paused ? "polite" : "off"}>
          <i class="fa-solid fa-quote-left testimonial-icon" aria-hidden="true"></i>
          <blockquote>${t.quote}</blockquote>
          <figcaption>
            <strong>${t.name}</strong>
            <span>${t.role}</span>
          </figcaption>
        </figure>

        <div class="testimonial-controls">
          <button type="button" class="testimonial-arrow" onClick=${prev} aria-label="Previous testimonial">
            <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
          </button>

          <div class="testimonial-dots">
            ${items.map(
              (_, i) => html`
                <button
                  type="button"
                  key=${i}
                  class=${"testimonial-dot" + (i === index ? " active" : "")}
                  onClick=${() => go(i)}
                  aria-label=${`Show testimonial ${i + 1} of ${count}`}
                  aria-current=${i === index ? "true" : undefined}
                ></button>
              `
            )}
          </div>

          <button type="button" class="testimonial-arrow" onClick=${next} aria-label="Next testimonial">
            <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    `;
  }

  const root = document.getElementById("testimonials-root");
  if (root) {
    ReactDOM.createRoot(root).render(html`<${TestimonialsCarousel} items=${TESTIMONIALS} />`);
  }
})();
