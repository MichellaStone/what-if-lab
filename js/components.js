
/* ==========================================
   WHAT IF LAB
   Shared Website Components
   ========================================== */

(function () {

  "use strict";

  // 01. SHARED NAVIGATION

  function renderHeader() {

    const header = document.querySelector(
      "[data-site-header]"
    );

    if (!header) return;

    header.classList.add("site-header");

    header.innerHTML = `
      <div class="container nav">

        <a href="index.html" class="logo">
          whatif<span>lab.</span>
        </a>

        <nav class="nav-links"
             aria-label="Main navigation">

          <a href="index.html">Home</a>

          <a href="index.html#experiments">
            Experiments
          </a>

          <a href="index.html#about">
            About
          </a>

        </nav>

      </div>
    `;

  }

  // 02. SHARED FOOTER

  function renderFooter() {

    const footer = document.querySelector(
      "[data-site-footer]"
    );

    if (!footer) return;

    footer.classList.add("site-footer");

    footer.innerHTML = `
      <div class="container footer-row">

        <a href="index.html" class="logo">
          whatif<span>lab.</span>
        </a>

        <span>
          Change the rules. Discover the science.
        </span>

        <a href="index.html#experiments">
          Explore experiments
        </a>

        <a href="index.html#about">
          About us
        </a>

        <span>
          © ${new Date().getFullYear()} What If Lab
        </span>

      </div>
    `;

  }

  // 03. INITIALIZE COMPONENTS

  function initializeComponents() {

    renderHeader();
    renderFooter();

  }

  if (document.readyState === "loading") {

    document.addEventListener(
      "DOMContentLoaded",
      initializeComponents,
      { once: true }
    );

  } else {

    initializeComponents();

  }

})();

/* END OF SHARED COMPONENTS */
