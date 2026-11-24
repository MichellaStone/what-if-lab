
/* WHAT IF LAB — Experiment Library v1 */

(function () {
  "use strict";

  const worlds = {
    Earth: 9.81,
    Moon: 1.62,
    Mars: 3.71,
    Mercury: 3.70,
    Venus: 8.87
  };

  const experiments = [

    {
      id: "planet-jump",
      number: "05",
      category: "physics space",
      label: "Planetary Science",
      title: "What if you jumped on another planet?",
      description: "Discover how gravity changes the height and duration of your jump.",
      min: 1,
      max: 6,
      step: 0.1,
      initial: 3,
      control: "Jump launch speed",
      unit: "m/s",
      art: "gravity",
      formula: "h = v² / 2g     •     t = 2v / g",
      explanation: "Lower gravity allows you to jump higher and remain in the air longer, provided your launch speed stays the same.",
      note: "This model assumes constant gravity, no air resistance and equal takeoff and landing heights. It does not account for spacesuits or human muscle limitations."
    },

    {
      id: "moon-distance",
      number: "06",
      category: "space physics",
      label: "Astronomy",
      title: "What if the Moon came closer?",
      description: "Change the Moon's distance and discover its effects on tidal forces.",
      min: 0.5,
      max: 2,
      step: 0.01,
      initial: 1,
      control: "Lunar distance",
      unit: "× normal",
      art: "gravity",
      formula: "Relative tidal force = 1 / d³",
      explanation: "The Moon pulls on different parts of Earth with slightly different strengths. This difference produces tidal effects. Moving the Moon closer greatly increases its tide-generating influence.",
      note: "The model estimates relative lunar tidal forcing, not actual ocean tide heights. Coastlines, ocean depth, the Sun and other factors affect real tides."
    },

    {
      id: "solar-distance",
      number: "07",
      category: "space physics",
      label: "Solar Science",
      title: "What if Earth moved closer to the Sun?",
      description: "Explore how orbital distance changes the solar energy reaching Earth.",
      min: 0.5,
      max: 2,
      step: 0.01,
      initial: 1,
      control: "Distance from the Sun",
      unit: "AU",
      art: "weight",
      formula: "Solar irradiance = 1361 / d²",
      explanation: "Light spreads out as it travels. At half Earth's current distance from the Sun, solar irradiance would be four times greater. At twice the distance, it would be one quarter as strong.",
      note: "Solar irradiance is not the same as surface temperature. This simplified model assumes constant solar luminosity and does not simulate Earth's atmosphere or climate."
    },

    {
      id: "black-hole",
      number: "08",
      category: "space physics",
      label: "Astrophysics",
      title: "What if the Sun became a black hole?",
      description: "Explore the event horizon of a black hole with different masses.",
      min: 1,
      max: 30,
      step: 1,
      initial: 1,
      control: "Black hole mass",
      unit: "solar masses",
      art: "time",
      formula: "Schwarzschild radius = 2GM / c²",
      explanation: "If the Sun were hypothetically replaced by a black hole of equal mass, Earth's orbit would remain approximately the same in an idealized model. However, sunlight would disappear. A black hole does not automatically pull everything around it inward.",
      note: "This calculation assumes a nonrotating, uncharged black hole. The Sun is not massive enough to naturally become a black hole."
    },

    {
      id: "sound-speed",
      number: "09",
      category: "physics",
      label: "Acoustics",
      title: "What if sound travelled faster?",
      description: "Discover how air temperature changes the speed of sound.",
      min: -40,
      max: 60,
      step: 1,
      initial: 20,
      control: "Air temperature",
      unit: "°C",
      art: "time",
      formula: "c = 331.3 × √(1 + T / 273.15)",
      explanation: "Sound travels through vibrations in matter. In warmer air, the speed of sound is higher because of the properties of the gas at higher temperatures.",
      note: "This model approximates the speed of sound in dry air at ordinary atmospheric conditions. Sound cannot travel through a perfect vacuum."
    }

  ];

  const format = (n, digits = 2) =>
    n.toLocaleString("en-US", {
      maximumFractionDigits: digits,
      minimumFractionDigits: digits
    });

  /* SCIENTIFIC CALCULATIONS */

  function calculate(id, value, world = "Moon") {

    if (id === "planet-jump") {
      const g = worlds[world];
      return [
        ["Maximum height", format(value ** 2 / (2 * g)) + " m"],
        ["Time in the air", format(2 * value / g) + " s"],
        ["Local gravity", format(g) + " m/s²"],
        ["Height compared to Earth", format(9.81 / g) + "×"]
      ];
    }

    if (id === "moon-distance") {
      const distance = 384400 * value;
      const angle = 2 * Math.asin(1737.4 / distance)
        * 180 / Math.PI;

      return [
        ["Moon's distance", format(distance, 0) + " km"],
        ["Relative tidal forcing", format(1 / value ** 3) + "×"],
        ["Apparent angular diameter", format(angle) + "°"],
        ["Distance compared to normal", format(value * 100, 0) + "%"]
      ];
    }

    if (id === "solar-distance") {
      const flux = 1361 / value ** 2;

      return [
        ["Solar irradiance", format(flux, 0) + " W/m²"],
        ["Relative solar energy", format(1 / value ** 2) + "×"],
        ["Distance", format(value) + " AU"],
        ["Orbital radius", format(value * 149.5978707) + " million km"]
      ];
    }

    if (id === "black-hole") {
      const radius = 2.953 * value;

      return [
        ["Event horizon radius", format(radius) + " km"],
        ["Event horizon diameter", format(2 * radius) + " km"],
        ["Black hole mass", format(value, 0) + " solar masses"],
        ["Radius compared to Earth", format(radius / 6371 * 100, 3) + "%"]
      ];
    }

    if (id === "sound-speed") {
      const speed = 331.3 *
        Math.sqrt(1 + value / 273.15);

      return [
        ["Speed of sound", format(speed) + " m/s"],
        ["Speed in km/h", format(speed * 3.6, 0) + " km/h"],
        ["Time to travel 1 km", format(1000 / speed) + " s"],
        ["Wavelength at 440 Hz", format(speed / 440, 3) + " m"]
      ];
    }

    return [];
  }

  /* REUSABLE SCIENTIFIC VISUALS */

  function visual(id, value, world = "Moon") {

    let drawing = "";

    if (id === "planet-jump") {

      const height = value ** 2 / (2 * worlds[world]);
      const peak = 153 - height / Math.max(height, 3) * 100;

      drawing = `
        <path d="M0 185 Q90 172 180 185
          T360 185 V220 H0Z" fill="#536278"/>
        <line x1="80" y1="${peak}" x2="280"
          y2="${peak}" stroke="#a69aff"
          stroke-dasharray="5 5"/>
        <text x="80" y="${peak - 9}"
          fill="#a69aff" font-size="12">
          Peak: ${format(height)} m
        </text>
        <g data-jumper transform="translate(180 153)">
          <circle cy="-24" r="13" fill="#e6edf7"/>
          <rect x="-9" y="-29" width="18" height="10"
            rx="5" fill="#52698e"/>
          <rect x="-12" y="-10" width="24" height="27"
            rx="7" fill="#e6edf7"/>
          <path d="M-10 -5 L-23 10 M10 -5 L23 10
            M-6 14 L-9 27 M6 14 L9 27"
            stroke="#e6edf7" stroke-width="7"
            stroke-linecap="round"/>
        </g>
        <text x="180" y="208" text-anchor="middle"
          fill="#ffffff" font-size="13">${world}</text>
      `;

    } else if (id === "moon-distance") {

      const x = 145 + value * 85;
      const radius = 12 / value;

      drawing = `
        <ellipse cx="83" cy="105"
          rx="${43 + 4 / value ** 3}" ry="43"
          fill="#426f9c" opacity=".5"/>
        <circle cx="83" cy="105" r="42"
          fill="#367bb7"/>
        <path d="M55 81 L77 68 100 81
          90 101 72 108 59 97Z
          M90 118 L112 115 105 140 92 146Z"
          fill="#85b99a"/>
        <line x1="130" y1="105" x2="${x-radius}"
          y2="105" stroke="#a69aff"
          stroke-dasharray="4 5"/>
        <circle cx="${x}" cy="105" r="${radius}"
          fill="#c2c4ce"/>
        <text x="180" y="190" text-anchor="middle"
          fill="#e6edf7" font-size="13">
          ${format(value)}× lunar distance
        </text>
      `;

    } else if (id === "solar-distance") {

      const x = 130 + value * 96;

      drawing = `
        <circle cx="65" cy="105" r="60"
          fill="#ffad45" opacity=".08"/>
        <circle cx="65" cy="105" r="45"
          fill="#ffad45" opacity=".18"/>
        <circle cx="65" cy="105" r="33"
          fill="#ffc76b"/>
        <path d="M105 85 L${x-15} 85
          M105 105 L${x-15} 105
          M105 125 L${x-15} 125"
          stroke="#ffc76b"
          stroke-opacity="${Math.min(1, 0.4 / value ** 2)}"
          stroke-width="2"
          stroke-dasharray="6 5"/>
        <circle cx="${x}" cy="105" r="16"
          fill="#65a9dc"/>
        <text x="${x}" y="142" text-anchor="middle"
          fill="#e6edf7" font-size="12">Earth</text>
        <text x="180" y="190" text-anchor="middle"
          fill="#e6edf7" font-size="13">
          ${format(value)} AU
        </text>
      `;

    } else if (id === "black-hole") {

      const radius = 18 + value * 1.6;

      drawing = `
        <ellipse cx="180" cy="107"
          rx="${radius+50}" ry="${radius*.42}"
          fill="none" stroke="#d28a50"
          stroke-width="15" opacity=".35"
          transform="rotate(-12 180 107)"/>
        <circle cx="180" cy="107" r="${radius+8}"
          fill="none" stroke="#e5a357"
          stroke-width="3" opacity=".8"/>
        <circle cx="180" cy="107" r="${radius}"
          fill="#020308"/>
        <text x="180" y="211" text-anchor="middle"
          fill="#e6edf7" font-size="13">
          Horizon radius: ${format(2.953 * value)} km
        </text>
      `;

    } else if (id === "sound-speed") {

      const speed = 331.3 *
        Math.sqrt(1 + value / 273.15);

      const wave = Array.from({length: 321}, (_, i) => {
        const y = 105 + 38 * Math.sin(
          i / (10 * speed / 343)
        );

        return `${i ? "L" : "M"}${i+20} ${y}`;
      }).join(" ");

      drawing = `
        <line x1="20" y1="105" x2="340" y2="105"
          stroke="#56657a" stroke-dasharray="4 5"/>
        <path d="${wave}" fill="none"
          stroke="#72dfc0" stroke-width="3"/>
        <text x="180" y="175" text-anchor="middle"
          fill="#a69aff" font-size="14">
          ${format(speed)} m/s
        </text>
        <text x="180" y="198" text-anchor="middle"
          fill="#e6edf7" font-size="12">
          Sound wave at 440 Hz
        </text>
      `;

    }

    return `
      <svg viewBox="0 0 360 220"
        width="360" height="220"
        role="img" aria-label="Illustrative science model">
        <rect width="360" height="220"
          rx="12" fill="#080d18"/>
        ${drawing}
      </svg>
    `;
  }

  /* AUTOMATIC HOMEPAGE CARDS */

  function addHomepageCards() {

    const grid = document.querySelector(
      "#experiments .cards"
    );

    if (!grid) return;

    experiments.forEach(exp => {

      const card = document.createElement("article");

      card.className = "card";

      card.dataset.category = exp.category;

      card.dataset.search =
        exp.title + " " + exp.description + " " + exp.label;

      card.innerHTML = `
        <div class="art ${exp.art}">
          ${visual(exp.id, exp.initial)}
        </div>
        <div class="card-content">
          <div class="tag">
            ${exp.label} · ${exp.number}
          </div>
          <h3>${exp.title}</h3>
          <p>${exp.description}</p>
          <a class="explore"
            href="experiments.html?lab=${exp.id}">
            Run experiment →
          </a>
        </div>
      `;

      grid.appendChild(card);

    });

    if (typeof filterCards === "function") {
      filterCards();
    }
  }

  /* SHARED EXPERIMENT PAGE */

  function renderExperiment() {

    const page = document.getElementById("experiment-page");

    if (!page) return;

    const params = new URLSearchParams(location.search);

    const exp = experiments.find(
      item => item.id === params.get("lab")
    ) || experiments[0];

    document.title = exp.title + " | What If Lab";

    document.getElementById("experiment-title")
      .textContent = exp.title;

    document.getElementById("experiment-description")
      .textContent = exp.description;

    document.getElementById("experiment-label")
      .textContent = "Experiment " + exp.number +
        " / " + exp.label;

    const picker = document.getElementById("lab-picker");

    experiments.forEach(item => {
      const option = document.createElement("option");

      option.value = item.id;
      option.textContent = item.title;
      option.selected = item.id === exp.id;

      picker.appendChild(option);
    });

    picker.addEventListener("change", () => {
      location.href = "experiments.html?lab=" +
        encodeURIComponent(picker.value);
    });

    let frame = 0;

    page.innerHTML = `
      <div class="lab">

        <div class="lab-header">
          <strong>Interactive Simulator</strong>
          <span class="tag">Live calculation</span>
        </div>

        <div class="workspace">

          <div class="visual" id="exp-visual"></div>

          <div class="controls">

            ${exp.id === "planet-jump" ? `
              <div class="control">
                <label for="world-select">Choose a world</label>
                <select id="world-select">
                  ${Object.keys(worlds).map(world =>
                    '<option' +
                    (world === "Moon" ? " selected" : "") +
                    '>' + world + '</option>'
                  ).join("")}
                </select>
              </div>
            ` : ""}

            <div class="control">

              <label for="exp-slider">
                ${exp.control}
                <output id="exp-value"></output>
              </label>

              <input type="range"
                id="exp-slider"
                min="${exp.min}"
                max="${exp.max}"
                step="${exp.step}"
                value="${exp.initial}">

            </div>

            ${exp.id === "planet-jump" ? `
              <button class="primary" id="jump-button">
                Launch jump ↑
              </button>
            ` : ""}

            <button class="secondary" id="exp-reset">
              Reset experiment
            </button>

          </div>

        </div>

      </div>

      <div class="metrics" id="exp-results"
        aria-live="polite"></div>

      <article class="science">

        <div class="eyebrow">Understand the science</div>

        <h2>Why does this happen?</h2>

        <p>${exp.explanation}</p>

        <div class="formula">${exp.formula}</div>

        <p class="note">${exp.note}</p>

        <p class="muted">
          Illustrations are schematic and not to scale.
        </p>

        <a href="index.html#experiments">
          ← Explore more experiments
        </a>

      </article>
    `;

    const slider = document.getElementById("exp-slider");
    const worldSelect = document.getElementById("world-select");
    const scene = document.getElementById("exp-visual");

    function update() {

      cancelAnimationFrame(frame);

      const value = Number(slider.value);

      const world = worldSelect
        ? worldSelect.value : "Moon";

      document.getElementById("exp-value").textContent =
        value + " " + exp.unit;

      scene.innerHTML = visual(exp.id, value, world);

      document.getElementById("exp-results").innerHTML =
        calculate(exp.id, value, world).map(result => `
          <div class="metric">
            <small>${result[0]}</small>
            <strong>${result[1]}</strong>
          </div>
        `).join("");

    }

    slider.addEventListener("input", update);

    if (worldSelect) {
      worldSelect.addEventListener("change", update);
    }

    document.getElementById("exp-reset")
      .addEventListener("click", () => {

        slider.value = exp.initial;

        if (worldSelect) worldSelect.value = "Moon";

        update();

      });

    /* REAL-TIME JUMP ANIMATION */

    const jumpButton = document.getElementById("jump-button");

    if (jumpButton) {

      jumpButton.addEventListener("click", () => {

        update();

        const speed = Number(slider.value);
        const gravity = worlds[worldSelect.value];
        const height = speed ** 2 / (2 * gravity);
        const duration = 2 * speed / gravity;

        const jumper = scene.querySelector("[data-jumper]");

        const reducedMotion = matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

        if (reducedMotion ||
          document.documentElement.classList
            .contains("animation-disabled")) {
          jumper.setAttribute("transform",
            `translate(180 ${153 - height /
            Math.max(height, 3) * 100})`);
          return;
        }

        const start = performance.now();

        function animate(now) {

          const time = Math.min(
            (now - start) / 1000, duration
          );

          const displacement = Math.max(
            0, speed * time -
            0.5 * gravity * time ** 2
          );

          const y = 153 - displacement /
            Math.max(height, 3) * 100;

          jumper.setAttribute(
            "transform", `translate(180 ${y})`
          );

          if (time < duration) {
            frame = requestAnimationFrame(animate);
          }
        }

        frame = requestAnimationFrame(animate);

      });

    }

    update();
  }

  function initialize() {
    addHomepageCards();
    renderExperiment();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded", initialize, {once: true}
    );
  } else {
    initialize();
  }

})();
