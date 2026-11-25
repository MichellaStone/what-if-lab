
/* WHAT IF LAB
   BIOLOGY — THE IMPOSSIBLE BODY
   Experiments 20–29
*/

export function biologyLabs(E) {

  const {
    knob, metric, fmt, clamp, P,
    line, path, circle, glow,
    label, bar, arrow
  } = E;

  const TAU = Math.PI * 2;

  const green = "#75efa7";
  const pink = "#ff8ba7";
  const blue = "#66caff";
  const gold = "#ffcc78";

  const percent = n => fmt(n * 100, 1) + "%";

  const stats = (...pairs) =>
    pairs.map(([name, value]) => metric(name, value));

  const progress = (s, duration) =>
    clamp(s.t / duration, 0, 1);

  function human(c, x, y, scale, color, arm = 1) {

    c.save();
    c.translate(x, y);
    c.scale(scale, scale);

    circle(c, 0, -80, 22, color);

    line(c, 0, -50, 0, 23, color, 35);

    line(c, -13, -44, -43, 5, color, 13);

    if (arm > 0) {
      line(
        c, 13, -44,
        13 + 30 * arm,
        -44 + 49 * arm,
        color, 13
      );
    }

    line(c, -8, 20, -22, 83, color, 15);
    line(c, 8, 20, 22, 83, color, 15);

    c.restore();
  }

  function heading(c, text) {
    label(c, text, 20, 25, green);
  }

  const labs = [

    /* 20 — PHOTOSYNTHETIC HUMAN */

    {
      id: "photosynthetic-human",
      title: "What if humans could photosynthesize?",
      label: "Alternative Human Biology",
      category: "biology",

      desc: "Become a solar-powered human and see how much energy sunlight could provide.",

      action: "Absorb sunlight",

      knobs: [
        knob("light", "Sunlight intensity", 0, 1000, 25, 700, "W/m²"),
        knob("area", "Effective exposed skin area", .2, 2, .1, 1, "m²"),
        knob("eff", "Conversion efficiency", 1, 10, .5, 3, "%"),
        knob("hours", "Sunlight duration", 1, 12, 1, 6, "hours")
      ],

      presets: [
        ["Cloudy day", {light: 150}],
        ["Bright sunlight", {light: 1000}],
        ["Superhuman skin", {eff: 10}]
      ],

      formula: "Energy = irradiance × area × efficiency × time",

      explain: "Photosynthesis converts light energy into chemical energy. Imagine human skin could perform a similar process. Would its energy output be enough to replace food?",

      note: "Hypothetical energy-budget model. The human body cannot photosynthesize. The selected efficiency and exposure are assumptions, not biological predictions or sun-exposure advice.",

      calc: p => {
        let power = p.light * p.area * p.eff / 100;
        let kcal = power * p.hours * 3600 / 4184;
        return {power, kcal};
      },

      stats: (p, s, q) => stats(
        ["Chemical power", fmt(q.power) + " W"],
        ["Daily energy", fmt(q.kcal) + " kcal"],
        ["Illustrative 2000 kcal share", percent(q.kcal / 2000)],
        ["Accumulated energy", fmt(q.kcal * progress(s, 8)) + " kcal"]
      ),

      duration: () => 8,

      draw: (c, p, s, q) => {

        heading(c, "SOLAR-POWERED HUMAN");

        glow(c, 105, 110, 35, gold);

        human(c, 365, 155, 1.1, green);

        for (let i = 0; i < 14; i++) {

          let t = (i / 14 + s.t * .4) % 1;

          c.globalAlpha = p.light / 1000;

          glow(
            c,
            145 + t * 165,
            85 + (i % 7) * 18,
            3, gold
          );
        }

        c.globalAlpha = 1;

        bar(
          c, 80, 270, 500,
          clamp(q.kcal * progress(s, 8) / 2000, 0, 1),
          green, "Stored energy"
        );
      }
    },

    /* 21 — LIMB REGENERATION */

    {
      id: "limb-regeneration",
      title: "What if you could regrow your limbs?",
      label: "Regenerative Biology",
      category: "biology",

      desc: "Watch a missing limb regenerate through a hypothetical tissue-growth model.",

      action: "Begin regeneration",

      knobs: [
        knob("rate", "Relative regeneration rate", .2, 2, .1, 1, "×"),
        knob("time", "Virtual growth time", 10, 120, 5, 60, "days")
      ],

      presets: [
        ["Slow growth", {rate: .3}],
        ["Accelerated growth", {rate: 2}],
        ["Long observation", {time: 120}]
      ],

      formula: "Illustrative growth fraction = 1 − exp(−kt)",

      explain: "Axolotls can regenerate lost limbs through coordinated cellular processes. Human healing does not currently reproduce this ability.",

      note: "The exponential growth curve is an invented teaching model. It is not measured human or axolotl regeneration data and does not predict treatment outcomes.",

      calc: p => ({
        final: 1 - Math.exp(-p.rate * p.time / 30)
      }),

      stats: (p, s, q) => {

        let days = p.time * progress(s, 8);
        let growth = 1 - Math.exp(-p.rate * days / 30);

        return stats(
          ["Model growth", percent(growth)],
          ["Virtual time", fmt(days) + " days"],
          ["Remaining growth", percent(1 - growth)],
          ["Final model growth", percent(q.final)]
        );
      },

      duration: () => 8,

      draw: (c, p, s) => {

        let days = p.time * progress(s, 8);
        let growth = 1 - Math.exp(-p.rate * days / 30);

        heading(c, "HYPOTHETICAL LIMB REGENERATION");

        human(c, 300, 155, 1.2, "#7794ab", 0);

        if (growth > .01) {

          line(
            c, 316, 102,
            316 + 36 * growth,
            102 + 59 * growth,
            green, 15
          );

          glow(
            c, 316 + 36 * growth,
            102 + 59 * growth,
            5, green
          );
        }

        for (let i = 0; i < 20; i++) {

          let a = i / 20 * TAU + s.t;

          glow(
            c,
            316 + 36 * growth + Math.cos(a) * 16,
            102 + 59 * growth + Math.sin(a) * 16,
            2, green
          );
        }

        label(c, percent(growth), 510, 120, green, "center");

        bar(c, 80, 275, 500, growth, green, "Tissue growth");
      }
    },

    /* 22 — BIOLUMINESCENCE */

    {
      id: "glowing-human",
      title: "What if humans glowed in the dark?",
      label: "Bioluminescence",
      category: "biology",

      desc: "Activate light-producing skin cells and turn the human body into a living lantern.",

      action: "Activate bioluminescence",

      knobs: [
        knob("cells", "Active glowing cells", 0, 100, 1, 75, "%"),
        knob("power", "Relative cell brightness", 1, 10, 1, 5, "units"),
        knob("ambient", "Ambient light", 0, 100, 1, 10, "%")
      ],

      presets: [
        ["Pitch darkness", {ambient: 0}],
        ["Maximum glow", {cells: 100, power: 10}],
        ["Daylight", {ambient: 100}]
      ],

      formula: "Relative light output = active fraction × cell brightness",

      explain: "Some organisms produce visible light through chemical reactions. Bioluminescence can help attract prey, communicate or avoid predators.",

      note: "This is a fictional human bioluminescence model using relative brightness units, not measured optical power.",

      calc: p => ({
        output: p.cells / 100 * p.power,
        contrast: p.cells / 100 * p.power / (1 + p.ambient / 10)
      }),

      stats: (p, s, q) => stats(
        ["Active cells", fmt(p.cells, 0) + "%"],
        ["Relative light output", fmt(q.output)],
        ["Visibility index", fmt(q.contrast)],
        ["Ambient light", fmt(p.ambient, 0) + "%"]
      ),

      draw: (c, p, s, q) => {

        c.fillStyle = `rgb(${p.ambient * 2},${p.ambient * 2},${p.ambient * 2})`;
        c.fillRect(0, 0, 660, 300);

        heading(c, "LIVING LIGHT");

        human(c, 330, 155, 1.2, "#395d6e");

        c.save();

        c.shadowColor = green;
        c.shadowBlur = q.output * 5;
        c.globalAlpha = clamp(
          q.output / 10 * (.85 + .15 * Math.sin(s.t * 3)),
          0, 1
        );

        human(c, 330, 155, 1.2, green);

        c.restore();

        for (let i = 0; i < 50; i++) {

          let y = 55 + i * 3.5;
          let x = 330 + Math.sin(i * 7) * 10;

          if (i < p.cells / 2) {
            glow(c, x, y, 2, blue);
          }
        }
      }
    },

    /* 23 — OCTOPUS CAMOUFLAGE */

    {
      id: "human-camouflage",
      title: "What if your skin changed color like an octopus?",
      label: "Animal Adaptation",
      category: "biology",

      desc: "Blend your body into a forest, desert or ocean background.",

      action: "Activate camouflage",

      knobs: [
        knob("habitat", "Habitat: forest / desert / ocean", 0, 2, 1, 0, "mode"),
        knob("skill", "Color matching ability", 0, 100, 1, 90, "%"),
        knob("rate", "Relative adaptation rate", .2, 3, .1, 1, "×")
      ],

      presets: [
        ["Forest", {habitat: 0}],
        ["Desert", {habitat: 1}],
        ["Ocean", {habitat: 2}]
      ],

      formula: "Model match = ability × (1 − exp(−kt))",

      explain: "Octopuses can rapidly alter their appearance using specialized skin structures, including pigment-containing chromatophores.",

      note: "The color matching percentage is a mathematical illustration, not a measured probability of invisibility or predator detection.",

      calc: p => ({
        habitat: ["Forest", "Desert", "Ocean"][p.habitat]
      }),

      stats: (p, s, q) => {

        let match = p.skill / 100 *
          (1 - Math.exp(-p.rate * s.t));

        return stats(
          ["Environment", q.habitat],
          ["Color match index", percent(match)],
          ["Remaining contrast index", percent(1 - match)],
          ["Adaptation rate", fmt(p.rate) + "×"]
        );
      },

      draw: (c, p, s) => {

        let colors = [
          [45, 115, 67],
          [174, 133, 80],
          [29, 91, 138]
        ];

        let target = colors[p.habitat];

        let match = p.skill / 100 *
          (1 - Math.exp(-p.rate * s.t));

        let base = [212, 151, 130];

        let skin = base.map((v, i) =>
          Math.round(v + (target[i] - v) * match)
        );

        c.fillStyle = `rgb(${target.join(",")})`;
        c.fillRect(0, 0, 660, 300);

        for (let i = 0; i < 35; i++) {

          c.globalAlpha = .08;

          circle(
            c,
            (i * 97) % 660,
            (i * 53) % 300,
            20 + i % 25,
            "#ffffff"
          );
        }

        c.globalAlpha = 1;

        human(c, 330, 155, 1.2, `rgb(${skin.join(",")})`);

        heading(c, "ADAPTIVE SKIN MODEL");

        bar(c, 80, 275, 500, match, green, "Color matching");
      }
    },

    /* 24 — TARDIGRADE CRYPTOBIOSIS */

    {
      id: "tardigrade-mode",
      title: "What if you could survive like a tardigrade?",
      label: "Extreme Biology",
      category: "biology",

      desc: "Observe a virtual organism entering a dry dormant state and rehydrating.",

      action: "Run dormancy cycle",

      knobs: [
        knob("dry", "Relative drying rate", .2, 3, .1, 1, "×"),
        knob("wet", "Relative rehydration rate", .2, 3, .1, 1, "×")
      ],

      presets: [
        ["Slow drying", {dry: .3}],
        ["Rapid drying", {dry: 3}],
        ["Rapid recovery model", {wet: 3}]
      ],

      formula: "Water fraction: exponential loss and recovery",

      explain: "Some tardigrades can enter cryptobiosis, a state associated with extremely low metabolic activity. Certain species tolerate severe dehydration in this state.",

      note: "A simplified water-content curve, not a survival predictor. Humans cannot enter tardigrade cryptobiosis. Do not attempt to reproduce these conditions.",

      calc: p => ({
        minimum: Math.exp(-p.dry * 3)
      }),

      stats: (p, s, q) => {

        let water = hydration(p, s);

        return stats(
          ["Relative water content", percent(water)],
          ["Lowest modeled content", percent(q.minimum)],
          ["Model phase", s.t < 5 ? "Drying" : "Rehydration"],
          ["Cycle progress", percent(progress(s, 10))]
        );
      },

      duration: () => 10,

      draw: (c, p, s) => {

        let water = hydration(p, s);

        heading(c, "WATER BEAR / DORMANCY CYCLE");

        let width = 36 + water * 27;

        for (let i = 0; i < 5; i++) {

          let x = 210 + i * (28 + water * 9);

          circle(c, x, 140, width, "#6aa99b", green, 2);

          if (i < 4) {

            line(c, x, 165, x - 8, 205, "#6aa99b", 15);
            line(c, x, 115, x + 9, 82, "#6aa99b", 15);
          }
        }

        circle(c, 205, 126, 5, "#10202a");
        circle(c, 205, 151, 5, "#10202a");

        for (let i = 0; i < 20 * water; i++) {

          glow(
            c,
            160 + (i * 67) % 330,
            50 + (i * 39) % 170,
            2, blue
          );
        }

        bar(c, 80, 275, 500, water, blue, "Water content");
      }
    },

    /* 25 — GIANT INSECTS */

    {
      id: "giant-insects",
      title: "What if insects became human-sized?",
      label: "Scaling Biology",
      category: "biology",

      desc: "Enlarge a virtual beetle and discover how radically its biological geometry changes.",

      action: "Grow giant insect",

      knobs: [
        knob("scale", "Linear size multiplier", 1, 200, 1, 50, "×"),
        knob("base", "Original body length", 1, 10, 1, 3, "cm")
      ],

      presets: [
        ["Normal insect", {scale: 1}],
        ["Giant beetle", {scale: 30}],
        ["Human-sized", {scale: 60, base: 3}]
      ],

      formula: "Area ∝ L² · Volume ∝ L³ · Diffusion time ∝ L²",

      explain: "When an organism grows proportionally larger, its volume increases faster than its surface area. Insects use tracheal systems to deliver oxygen, and body scaling affects their transport requirements.",

      note: "Geometric similarity model. Actual insect size depends on anatomy, oxygen delivery, ecology and many other factors.",

      calc: p => ({
        length: p.base * p.scale / 100,
        volume: p.scale ** 3,
        ratio: 1 / p.scale
      }),

      stats: (p, s, q) => stats(
        ["Final body length", fmt(q.length) + " m"],
        ["Relative body volume", fmt(q.volume, 0) + "×"],
        ["Relative surface/volume", percent(q.ratio)],
        ["Diffusion time scaling", fmt(p.scale ** 2, 0) + "×"]
      ),

      duration: () => 6,

      draw: (c, p, s) => {

        heading(c, "THE SQUARE-CUBE LAW");

        let scale = 1 + (p.scale - 1) * progress(s, 6);
        let r = 18 + Math.log(scale) / Math.log(200) * 57;

        for (let i = 0; i < 3; i++) {

          let y = 110 + i * 35;

          path(c, [
            [310, y],
            [310 - r, y + 15],
            [290 - r, y + 40]
          ], green, 4);

          path(c, [
            [350, y],
            [350 + r, y + 15],
            [370 + r, y + 40]
          ], green, 4);
        }

        c.beginPath();
        c.ellipse(330, 160, r, r * 1.2, 0, 0, TAU);
        c.fillStyle = "#447b58";
        c.fill();
        c.strokeStyle = green;
        c.stroke();

        circle(c, 330, 95, r * .42, "#294d3f");

        line(c, 330, 115, 330, 160 + r, "#182e29", 2);

        label(c, fmt(scale, 0) + "× size", 520, 90, green, "center");

        bar(c, 80, 275, 500, 1 / scale, blue, "Relative surface / volume");
      }
    },

    /* 26 — TWO HEARTS */

    {
      id: "two-hearts",
      title: "What if humans had two hearts?",
      label: "Alternative Anatomy",
      category: "biology",

      desc: "Activate a second virtual pump and observe how fluid flow changes in an idealized circulatory network.",

      action: "Start circulation",

      knobs: [
        knob("n", "Number of parallel pumps", 1, 2, 1, 2, "pumps"),
        knob("pressure", "Model pressure difference", 30, 150, 5, 90, "mmHg"),
        knob("load", "Shared flow resistance", 5, 40, 1, 15, "units")
      ],

      presets: [
        ["One pump", {n: 1}],
        ["Two pumps", {n: 2}],
        ["High resistance", {load: 40}]
      ],

      formula: "Q = ΔP / (Rload + Rpump / n)",

      explain: "A heart provides pressure that drives circulation. Ideal parallel pumps can reduce the effective internal resistance of a fluid network.",

      note: "An abstract fluid-circuit model, not a human cardiovascular simulation. Real hearts have complex feedback and cannot be represented by simply adding pumps.",

      calc: p => ({
        flow: p.pressure / (p.load + 5 / p.n)
      }),

      stats: (p, s, q) => stats(
        ["Model total flow", fmt(q.flow) + " L/min"],
        ["Flow per pump", fmt(q.flow / p.n) + " L/min"],
        ["Pump count", fmt(p.n, 0)],
        ["Relative flow vs one pump", fmt(q.flow / (p.pressure / (p.load + 5))) + "×"]
      ),

      draw: (c, p, s, q) => {

        heading(c, "PARALLEL CIRCULATORY PUMPS");

        let size = 30 + 5 * Math.sin(s.t * 6);

        let positions = p.n === 1 ? [330] : [230, 430];

        for (let x of positions) {

          path(c, [[x, 95], [x, 65], [330, 65]], blue, 5);
          path(c, [[x, 170], [x, 230], [330, 230]], pink, 5);

          c.save();
          c.translate(x, 130);
          c.scale(size / 30, size / 30);

          c.beginPath();
          c.moveTo(0, 30);
          c.bezierCurveTo(-65, -15, -25, -55, 0, -22);
          c.bezierCurveTo(25, -55, 65, -15, 0, 30);

          c.fillStyle = "#d95070";
          c.fill();

          c.restore();
        }

        for (let i = 0; i < 9; i++) {

          let x = 180 + ((i * 37 + s.t * q.flow * 12) % 300);

          glow(c, x, 65, 3, blue);
          glow(c, 660 - x, 230, 3, pink);
        }

        label(c, fmt(q.flow) + " L/min", 330, 275, green, "center");
      }
    },

    /* 27 — SLIME MOLD MAZE */

    {
      id: "slime-mold-maze",
      title: "What if a brainless organism could solve a maze?",
      label: "Biological Intelligence",
      category: "biology",

      desc: "Change the cost of two paths and watch a slime-mold-inspired network discover the cheaper route.",

      action: "Release slime mold",

      knobs: [
        knob("upper", "Upper route cost", 1, 20, 1, 8, "units"),
        knob("lower", "Lower route cost", 1, 20, 1, 12, "units")
      ],

      presets: [
        ["Upper shortcut", {upper: 4, lower: 16}],
        ["Lower shortcut", {upper: 16, lower: 4}],
        ["Equal routes", {upper: 10, lower: 10}]
      ],

      formula: "Selected model cost = min(upper, lower)",

      explain: "Physarum slime mold can reorganize its transport network between nutrient sources. Researchers have observed maze-solving behavior without a nervous system.",

      note: "This animation uses a deterministic two-route optimization model inspired by slime mold. It is not a biological growth algorithm or a general maze solver.",

      calc: p => ({
        best: p.upper <= p.lower ? "Upper" : "Lower",
        cost: Math.min(p.upper, p.lower)
      }),

      stats: (p, s, q) => stats(
        ["Lowest route cost", fmt(q.cost) + " units"],
        ["Selected route", p.upper === p.lower ? "Tie" : q.best],
        ["Cost difference", fmt(Math.abs(p.upper - p.lower))],
        ["Network progress", percent(progress(s, 6))]
      ),

      duration: () => 6,

      draw: (c, p, s, q) => {

        heading(c, "BIOLOGICAL PATH OPTIMIZATION");

        let up = [[65,150],[135,150],[135,65],[310,65],[310,110],[505,110],[505,150],[595,150]];

        let down = [[65,150],[135,150],[135,235],[380,235],[380,185],[505,185],[505,150],[595,150]];

        path(c, up, "#344c45", 28);
        path(c, down, "#344c45", 28);

        let f = progress(s, 6);

        if (f > 0) {

          for (let route of [up, down]) {

            let chosen = route === (q.best === "Upper" ? up : down);

            c.globalAlpha = chosen ? 1 : Math.max(.12, 1 - f * 1.2);

            let n = f * (route.length - 1);
            let i = Math.floor(n);

            let partial = route.slice(0, i + 1);

            if (i < route.length - 1) {

              let a = route[i], b = route[i + 1];

              partial.push([
                a[0] + (b[0] - a[0]) * (n - i),
                a[1] + (b[1] - a[1]) * (n - i)
              ]);
            }

            path(c, partial, gold, 7);
          }
        }

        c.globalAlpha = 1;

        glow(c, 65, 150, 15, green);
        glow(c, 595, 150, 15, gold);

        label(c, "START", 65, 185, green, "center");
        label(c, "FOOD", 595, 185, gold, "center");

        label(c, "Cost: " + p.upper, 220, 48, P.ink);
        label(c, "Cost: " + p.lower, 220, 265, P.ink);
      }
    },

    /* 28 — GECKO ADHESION */

    {
      id: "gecko-human",
      title: "What if you could climb walls like a gecko?",
      label: "Biomechanics",
      category: "biology",

      desc: "Test an imaginary adhesive skin system against gravity.",

      action: "Test adhesion",

      knobs: [
        knob("mass", "Body mass", 30, 120, 1, 70, "kg"),
        knob("area", "Model contact area", 10, 500, 10, 200, "cm²"),
        knob("stress", "Hypothetical adhesive stress", 1, 100, 1, 40, "kPa")
      ],

      presets: [
        ["Weak adhesion", {stress: 5}],
        ["Strong adhesion", {stress: 80}],
        ["Small contact patch", {area: 20}]
      ],

      formula: "F = stress × area · Weight = mg",

      explain: "Gecko feet use microscopic structures that interact with surfaces through intermolecular forces. Their adhesive abilities are an example of remarkable biological engineering.",

      note: "Idealized force comparison with invented human-scale parameters. This cannot determine whether a person could safely climb any surface. It is not climbing or equipment guidance.",

      calc: p => ({
        force: p.stress * p.area * .1,
        weight: p.mass * 9.81
      }),

      stats: (p, s, q) => stats(
        ["Model adhesive force", fmt(q.force) + " N"],
        ["Body weight", fmt(q.weight) + " N"],
        ["Force / weight ratio", fmt(q.force / q.weight) + "×"],
        ["Ideal comparison", q.force >= q.weight ? "Force exceeds weight" : "Force below weight"]
      ),

      duration: () => 4,

      draw: (c, p, s, q) => {

        heading(c, "HYPOTHETICAL ADHESION TEST");

        c.fillStyle = "#34485b";
        c.fillRect(130, 38, 60, 240);

        for (let y = 40; y < 280; y += 30) {
          line(c, 130, y, 190, y, "#61778c");
        }

        let f = progress(s, 4);

        let y = q.force >= q.weight
          ? 175 - 45 * f
          : 140 + 55 * f;

        human(c, 240, y, .85, green);

        line(c, 191, y - 35, 205, y - 35, green, 5);

        arrow(c, 395, 150, 395, 225, pink);

        arrow(
          c, 395, 150, 395,
          150 - Math.min(100, q.force / q.weight * 75),
          green
        );

        label(c, "Adhesion", 420, 75, green);
        label(c, "Weight", 420, 225, pink);
      }
    },

    /* 29 — NIGHT VISION */

    {
      id: "human-night-vision",
      title: "What if you could see in near-total darkness?",
      label: "Sensory Biology",
      category: "biology",

      desc: "Change light sensitivity and photon collection to reveal a hidden night scene.",

      action: "Activate night vision",

      knobs: [
        knob("light", "Model incident photons", 0, 100, 1, 5, "units"),
        knob("gain", "Relative collection gain", 1, 50, 1, 10, "×"),
        knob("time", "Relative integration time", .1, 3, .1, 1, "×")
      ],

      presets: [
        ["Total darkness", {light: 0}],
        ["Night vision", {light: 5, gain: 40}],
        ["Moonlight model", {light: 30, gain: 10}]
      ],

      formula: "N = incident count × gain × time · SNR ≈ √N",

      explain: "Vision in dim environments depends partly on collecting enough photons. More collected photons improve the ideal photon-limited signal-to-noise ratio.",

      note: "This is a simplified photon-counting model, not measured retinal sensitivity. Gain represents increased photon collection, not electronic amplification. In zero light, visible-light vision remains impossible.",

      calc: p => {
        let n = p.light * p.gain * p.time;
        return {n, snr: Math.sqrt(n)};
      },

      stats: (p, s, q) => stats(
        ["Model photon count", fmt(q.n, 0)],
        ["Ideal signal/noise", fmt(q.snr)],
        ["Collection gain", fmt(p.gain, 0) + "×"],
        ["Visual clarity index", percent(q.snr / (q.snr + 10))]
      ),

      duration: () => 3,

      draw: (c, p, s, q) => {

        let clarity = q.snr / (q.snr + 10);

        let exposure = .25 + .75 * progress(s, 3);

        c.fillStyle = "#010604";
        c.fillRect(0, 0, 660, 300);

        c.save();
        c.globalAlpha = clarity * exposure;

        for (let i = 0; i < 12; i++) {

          let x = 25 + i * 57;
          let h = 70 + (i * 37) % 115;

          path(c, [
            [x - 25, 240],
            [x, 240 - h],
            [x + 25, 240]
          ], green, 3);

          line(c, x, 240 - h, x, 265, "#518d63", 4);
        }

        circle(c, 520, 65, 23, green);

        line(c, 20, 265, 640, 265, green, 2);

        c.restore();

        c.save();
        c.globalAlpha = .12 * (1 - clarity);

        for (let i = 0; i < 180; i++) {

          let x = (i * 137 + Math.floor(s.t * 7) * 19) % 660;
          let y = (i * 79 + Math.floor(s.t * 7) * 13) % 300;

          circle(c, x, y, .8, green);
        }

        c.restore();

        heading(c, "LOW-LIGHT VISION MODEL");

        label(
          c,
          q.n === 0 ? "NO LIGHT SIGNAL" : "SIGNAL DETECTED",
          330, 288, green, "center"
        );
      }
    }

  ];

  /* DEHYDRATION MODEL */

  function hydration(p, s) {

    if (s.t <= 5) {
      return Math.exp(-p.dry * 3 * s.t / 5);
    }

    let minimum = Math.exp(-p.dry * 3);

    return 1 - (1 - minimum) *
      Math.exp(-p.wet * 3 * (s.t - 5) / 5);
  }

  /* REGISTER BIOLOGY EXPERIMENTS */

  labs.forEach((lab, index) => {

    lab.number = String(index + 20);

  });

  return labs;

}

/* END OF BIOLOGY PACK */
