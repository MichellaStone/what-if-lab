
/* WHAT IF LAB
   Advanced Interactive Experiments 10–19
   No external libraries required.
*/

(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  const TAU = 2 * Math.PI;

  const clamp = (x, a, b) =>
    Math.max(a, Math.min(b, x));

  const fmt = (n, d = 2) =>
    Number.isFinite(n)
      ? n.toLocaleString("en-US", {
          maximumFractionDigits: d
        })
      : "∞";

  const deg = x => x * Math.PI / 180;

  const P = {
    ink: "#e9f1ff",
    muted: "#92a8c4",
    cyan: "#72e3d6",
    blue: "#5aa9fa",
    violet: "#b1a4ff",
    gold: "#ffc66d",
    red: "#ff8592"
  };

  const knob = (
    key, label, min, max, step, value, unit
  ) => ({
    key, label, min, max, step, value, unit
  });

  const metric = (name, value) => [name, value];

  const labs = [

    /* 10 — PROJECTILE LAUNCHER */

    {
      id: "projectile-launch",
      title: "What if you could launch a projectile?",
      label: "Motion & Gravity",
      category: "physics",

      desc: "Fire a ball, adjust the launch angle and watch its trajectory.",

      action: "Launch projectile",

      knobs: [
        knob("v", "Launch speed", 10, 60, 1, 30, "m/s"),
        knob("a", "Launch angle", 10, 80, 1, 45, "°"),
        knob("g", "Gravity", 1.6, 20, .1, 9.8, "m/s²")
      ],

      presets: [
        ["Moon", {g: 1.6}],
        ["Earth", {g: 9.8}],
        ["High gravity", {g: 20}]
      ],

      formula: "R = v² sin(2θ)/g · H = v² sin²θ/(2g)",

      explain: "Horizontal velocity stays constant while gravity changes vertical velocity. At equal launch and landing heights, a 45° angle gives maximum range for a fixed launch speed.",

      note: "Ideal projectile motion: no air resistance, level ground and constant gravity.",

      calc: p => {
        let t = 2 * p.v * Math.sin(deg(p.a)) / p.g;

        return {
          t,
          r: p.v * Math.cos(deg(p.a)) * t,
          h: (p.v * Math.sin(deg(p.a))) ** 2 / (2 * p.g)
        };
      },

      stats: (p, s, q) => [
        metric("Range", fmt(q.r) + " m"),
        metric("Maximum height", fmt(q.h) + " m"),
        metric("Flight time", fmt(q.t) + " s"),
        metric("Time elapsed", fmt(Math.min(s.t, q.t)) + " s")
      ],

      duration: (p, q) => q.t,

      draw: (c, p, s, q) => {
        let k = Math.min(
          570 / Math.max(q.r, 1),
          204 / Math.max(q.h, 1)
        );

        let x = t =>
          44 + p.v * Math.cos(deg(p.a)) * t * k;

        let y = t =>
          263 - (
            p.v * Math.sin(deg(p.a)) * t -
            .5 * p.g * t * t
          ) * k;

        ground(c, 263);

        line(c, 44, 263, 44 + q.r * k, 263, P.muted);

        path(c, Array.from({length: 81}, (_, i) =>
          [x(q.t * i / 80), y(q.t * i / 80)]
        ), P.violet, 2, [6, 6]);

        let t = Math.min(s.t, q.t);

        path(c, Array.from({length: 61}, (_, i) =>
          [x(t * i / 60), y(t * i / 60)]
        ), P.cyan, 3);

        line(
          c, 44, 263,
          44 + 35 * Math.cos(deg(p.a)),
          263 - 35 * Math.sin(deg(p.a)),
          P.gold, 9
        );

        glow(c, x(t), y(t), 7, P.gold);

        label(c, "PREDICTED FLIGHT PATH", 20, 26);

        label(
          c, "Landing: " + fmt(q.r) + " m",
          620, 288, P.cyan, "right"
        );
      }
    },

    /* 11 — PLANET ORBIT */

    {
      id: "orbit-lab",
      title: "What if Earth changed its orbital speed?",
      label: "Orbital Mechanics",
      category: "space physics",

      desc: "Send a planet into a circular orbit, an ellipse or an escape trajectory.",

      action: "Release planet",

      knobs: [
        knob(
          "v", "Tangential speed",
          .35, 1.8, .01, 1, "× circular speed"
        )
      ],

      presets: [
        ["Circular", {v: 1}],
        ["Elliptical", {v: 1.2}],
        ["Escape", {v: 1.5}]
      ],

      formula: "vₑ = √(2GM/r) · a = r/(2 − (v/vc)²)",

      explain: "Orbital motion balances sideways velocity and inward gravity. Escape speed at the initial radius is √2 times circular speed. Below escape speed, an ideal point-mass orbit is bound.",

      note: "Two-body Newtonian model starting at 1 AU. The Sun is treated as a point mass. A close approach stops the numerical simulation.",

      calc: p => ({
        energy: p.v * p.v / 2 - 1,

        a: p.v < Math.SQRT2
          ? 1 / (2 - p.v * p.v)
          : Infinity
      }),

      stats: (p, s, q) => [
        metric("Initial speed", fmt(p.v * 29.78) + " km/s"),

        metric(
          "Trajectory",
          Math.abs(p.v - 1) < .005
            ? "Circular"
            : p.v >= Math.SQRT2
              ? "Unbound"
              : "Elliptical"
        ),

        metric(
          "Current distance",
          fmt(Math.hypot(s.x, s.y)) + " AU"
        ),

        metric(
          "Semi-major axis",
          Number.isFinite(q.a)
            ? fmt(q.a) + " AU"
            : "Not bound"
        )
      ],

      init: s => Object.assign(s, {
        x: 1, y: 0,
        vx: 0, vy: s.p.v,
        trail: [[1, 0]],
        tick: 0
      }),

      advance: (p, s, dt) => {
        let left = dt * 2.5;

        while (left > 1e-8) {

          let h = Math.min(left, .003);
          let r = Math.hypot(s.x, s.y);

          if (r < .035 || r > 50) {
            s.running = false;
            s.ended = true;
            break;
          }

          let ax = -s.x / r ** 3;
          let ay = -s.y / r ** 3;

          s.vx += ax * h / 2;
          s.vy += ay * h / 2;

          s.x += s.vx * h;
          s.y += s.vy * h;

          r = Math.hypot(s.x, s.y);

          s.vx -= s.x / r ** 3 * h / 2;
          s.vy -= s.y / r ** 3 * h / 2;

          left -= h;
          s.tick += h;

          if (s.tick > .035) {
            s.tick = 0;
            s.trail.push([s.x, s.y]);

            if (s.trail.length > 600) {
              s.trail.shift();
            }
          }
        }
      },

      draw: (c, p, s) => {

        let zoom = 118 / Math.max(
          1,
          Math.hypot(s.x, s.y) / 1.05,
          ...s.trail.map(a => Math.hypot(...a) / 1.05)
        );

        circle(c, 330, 150, zoom, null, "#334766");
        glow(c, 330, 150, 20, P.gold);

        path(
          c,
          s.trail.map(([x, y]) =>
            [330 + x * zoom, 150 - y * zoom]
          ),
          P.cyan, 2
        );

        let x = 330 + s.x * zoom;
        let y = 150 - s.y * zoom;

        glow(c, x, y, 8, P.blue);

        let v = Math.hypot(s.vx, s.vy) || 1;

        line(
          c, x, y,
          x + s.vx / v * 25,
          y - s.vy / v * 25,
          P.violet, 2
        );

        label(c, "ORBIT TRACE / 1 AU REFERENCE", 20, 26);
        label(c, "Adaptive zoom", 620, 288, P.muted, "right");
      }
    },

    /* 12 — ASTEROID IMPACT */

    {
      id: "asteroid-impact",
      title: "What if a giant asteroid struck a planet?",
      label: "Planetary Science",
      category: "space physics",

      desc: "Launch a hypothetical asteroid and compare its kinetic energy.",

      action: "Simulate impact",

      knobs: [
        knob("d", "Asteroid diameter", 10, 1000, 10, 100, "m"),
        knob("v", "Entry speed", 5, 40, 1, 20, "km/s"),
        knob("rho", "Bulk density", 1000, 8000, 100, 3000, "kg/m³")
      ],

      presets: [
        ["Small", {d: 20}],
        ["Large", {d: 500}],
        ["Fast", {v: 35}]
      ],

      formula: "m = ρπd³/6 · E = ½mv²",

      explain: "A spherical asteroid's mass scales with the cube of its diameter. Its kinetic energy scales with the square of its speed.",

      note: "Only incoming kinetic energy is calculated. The animation does not predict blast effects, atmospheric breakup or crater size.",

      calc: p => {
        let m = p.rho * Math.PI * p.d ** 3 / 6;
        let e = .5 * m * (p.v * 1000) ** 2;

        return {
          m, e,
          mt: e / 4.184e15
        };
      },

      stats: (p, s, q) => [
        metric("Mass", fmt(q.m / 1e6) + " million kg"),
        metric("Kinetic energy", q.e.toExponential(2) + " J"),
        metric("Energy equivalent", fmt(q.mt, 4) + " Mt TNT"),
        metric("Impact speed", fmt(p.v) + " km/s")
      ],

      duration: () => 3.6,

      draw: (c, p, s, q) => {

        let t = s.t;
        let phase = clamp(t / 2.1, 0, 1);
        let x = 100 + 230 * phase;
        let y = 55 + 190 * phase;
        let r = 7 + Math.sqrt(p.d / 1000) * 19;

        ground(c, 248);

        if (t < 2.1) {

          line(
            c,
            x - 65 * (.3 + phase),
            y - 52 * (.3 + phase),
            x, y, P.gold, 4
          );

          glow(c, x, y, r, P.gold);
          circle(c, x, y, r, "#8e8290", P.gold);

          circle(
            c, x - r * .25, y - r * .2,
            r * .25, "#655968"
          );

        } else {

          let a = clamp((t - 2.1) / 1.5, 0, 1);

          for (let i = 0; i < 3; i++) {
            c.globalAlpha =
              Math.max(0, 1 - a - i * .14) * .8;

            circle(
              c, 330, 245,
              Math.max(2, 10 + a * (80 + i * 28)),
              null, P.gold, 3
            );
          }

          c.globalAlpha = 1;

          glow(
            c, 330, 245,
            Math.max(2, 24 * (1 - a)), P.red
          );
        }

        label(c, "KINETIC ENERGY MODEL", 20, 26);

        label(
          c, fmt(q.mt, 3) + " Mt TNT equivalent",
          620, 288, P.gold, "right"
        );
      }
    },

    /* 13 — PENDULUM LAB */

    {
      id: "pendulum-lab",
      title: "What if a pendulum swung on the Moon?",
      label: "Oscillations",
      category: "physics space",

      desc: "Start a pendulum and compare the period under different gravity.",

      action: "Release pendulum",

      knobs: [
        knob("l", "Pendulum length", .25, 4, .05, 1.5, "m"),
        knob("g", "Gravity", 1.62, 24.79, .01, 9.81, "m/s²"),
        knob("a", "Release angle", 5, 15, 1, 12, "°")
      ],

      presets: [
        ["Moon", {g: 1.62}],
        ["Earth", {g: 9.81}],
        ["Jupiter", {g: 24.79}]
      ],

      formula: "T ≈ 2π√(L/g)",

      explain: "A longer pendulum swings more slowly. Stronger gravity decreases the period. At small release angles, the period is nearly independent of amplitude.",

      note: "Small-angle ideal pendulum approximation. No friction or air resistance.",

      calc: p => ({
        T: TAU * Math.sqrt(p.l / p.g)
      }),

      stats: (p, s, q) => [
        metric("Period", fmt(q.T, 3) + " s"),
        metric("Frequency", fmt(1 / q.T, 3) + " Hz"),
        metric("Completed cycles", fmt(Math.floor(s.t / q.T), 0)),

        metric(
          "Current angle",
          fmt(p.a * Math.cos(TAU * s.t / q.T)) + "°"
        )
      ],

      draw: (c, p, s, q) => {

        let a = deg(p.a) * Math.cos(TAU * s.t / q.T);

        let L = 90 + 110 * (p.l - .25) / 3.75;

        let x = 330 + L * Math.sin(a);
        let y = 55 + L * Math.cos(a);

        line(c, 260, 55, 400, 55, P.muted, 5);
        line(c, 330, 55, 330, 55 + L, P.muted, 1, [5, 5]);

        c.beginPath();

        c.arc(
          330, 55, L,
          Math.PI / 2 - deg(p.a),
          Math.PI / 2 + deg(p.a)
        );

        c.strokeStyle = P.violet;
        c.lineWidth = 2;
        c.stroke();

        line(c, 330, 55, x, y, P.ink, 3);

        glow(c, x, y, 15, P.cyan);
        circle(c, 330, 55, 5, P.gold);

        label(c, "SMALL-ANGLE OSCILLATION", 20, 26);

        label(
          c, "T = " + fmt(q.T, 3) + " s",
          620, 288, P.cyan, "right"
        );
      }
    },

    /* 14 — WAVE INTERFERENCE */

    {
      id: "wave-interference",
      title: "What if two waves collided?",
      label: "Wave Physics",
      category: "physics",

      desc: "Superpose two traveling waves and discover constructive and destructive interference.",

      action: "Animate waves",

      knobs: [
        knob("a", "Wave A amplitude", .2, 2, .1, 1, "units"),
        knob("b", "Wave B amplitude", .2, 2, .1, 1, "units"),
        knob("phase", "Phase difference", 0, 360, 5, 90, "°"),
        knob("f", "Frequency", .2, 2, .1, .5, "Hz")
      ],

      presets: [
        ["Constructive", {phase: 0, a: 1, b: 1}],
        ["Destructive", {phase: 180, a: 1, b: 1}],
        ["Quarter phase", {phase: 90}]
      ],

      formula: "Aᵣ = √(A² + B² + 2AB cosφ)",

      explain: "When two waves overlap, their displacements add. In-phase waves reinforce. Equal-amplitude waves in opposite phase cancel.",

      note: "Ideal linear superposition of waves with equal frequency and wavelength traveling in the same direction.",

      calc: p => ({
        a: Math.sqrt(Math.max(
          0,
          p.a * p.a +
          p.b * p.b +
          2 * p.a * p.b * Math.cos(deg(p.phase))
        ))
      }),

      stats: (p, s, q) => [
        metric("Resultant amplitude", fmt(q.a, 3) + " units"),
        metric("Phase difference", fmt(p.phase, 0) + "°"),
        metric("Frequency", fmt(p.f) + " Hz"),
        metric("Period", fmt(1 / p.f) + " s")
      ],

      draw: (c, p, s) => {

        for (let [i, y, color, name] of [
          [0, 67, P.blue, "WAVE A"],
          [1, 150, P.violet, "WAVE B"],
          [2, 233, P.cyan, "SUM"]
        ]) {

          line(c, 88, y, 620, y, "#344660");
          label(c, name, 17, y - 10, color);

          path(
            c,
            Array.from({length: 267}, (_, j) => {

              let x = j * 2 + 88;
              let z = TAU * (j / 90 - p.f * s.t);

              let a = p.a * Math.sin(z);
              let b = p.b * Math.sin(z + deg(p.phase));

              return [
                x,
                y - (i === 0 ? a : i === 1 ? b : a + b) * 10
              ];

            }),
            color, 2.5
          );
        }

        label(c, "LINEAR SUPERPOSITION", 20, 26);
      }
    },

    /* 15 — OPTICAL LENS */

    {
      id: "optical-lens",
      title: "What if you could bend light with a lens?",
      label: "Geometrical Optics",
      category: "physics",

      desc: "Move an object and adjust focal length to see real and virtual images.",

      action: "Send light pulses",

      knobs: [
        knob("u", "Object distance", 5, 60, 1, 35, "cm"),
        knob("f", "Focal length", 5, 30, 1, 15, "cm")
      ],

      presets: [
        ["Real image", {u: 35, f: 15}],
        ["At focus", {u: 15, f: 15}],
        ["Virtual image", {u: 10, f: 20}]
      ],

      formula: "1/f = 1/u + 1/v · m = −v/u",

      explain: "A converging lens bends parallel rays toward the focal point. An object outside the focal length forms a real, inverted image. Inside it, the image is virtual and upright.",

      note: "Thin ideal converging lens using the paraxial ray approximation. At the focal point emerging rays are parallel.",

      calc: p => ({
        v: p.u === p.f
          ? Infinity
          : p.u * p.f / (p.u - p.f),

        m: p.u === p.f
          ? Infinity
          : -p.f / (p.u - p.f)
      }),

      stats: (p, s, q) => [
        metric(
          "Image distance",
          Number.isFinite(q.v)
            ? fmt(q.v) + " cm"
            : "At infinity"
        ),

        metric(
          "Magnification",
          Number.isFinite(q.m)
            ? fmt(q.m) + "×"
            : "Not finite"
        ),

        metric(
          "Image type",
          p.u === p.f
            ? "At infinity"
            : p.u > p.f
              ? "Real / inverted"
              : "Virtual / upright"
        ),

        metric("Lens power", fmt(100 / p.f) + " D")
      ],

      draw: (c, p, s, q) => {

        let axis = 150;
        let mid = 330;

        let scale = Math.min(
          5,
          270 / Math.max(
            p.u, p.f,
            Number.isFinite(q.v) ? Math.abs(q.v) : p.u
          )
        );

        let height = Math.min(
          45,
          95 / Math.max(
            1,
            Number.isFinite(q.m) ? Math.abs(q.m) : 1
          )
        );

        let ox = mid - p.u * scale;
        let oy = axis - height;

        line(c, 15, axis, 645, axis, P.muted);

        c.beginPath();
        c.moveTo(mid, 36);
        c.quadraticCurveTo(mid + 35, axis, mid, 264);
        c.quadraticCurveTo(mid - 35, axis, mid, 36);

        c.fillStyle = "#23496b";
        c.fill();

        c.strokeStyle = P.blue;
        c.lineWidth = 2;
        c.stroke();

        for (let f of [-p.f, p.f]) {
          circle(c, mid + f * scale, axis, 4, P.gold);

          label(
            c, "F", mid + f * scale,
            axis + 19, P.gold, "center"
          );
        }

        arrow(c, ox, axis, ox, oy, P.cyan);

        let end = 645;

        let ry =
          oy + (end - mid) * height / (p.f * scale);

        let cy =
          axis + (end - mid) * height / (p.u * scale);

        path(
          c, [[ox, oy], [mid, oy], [end, ry]],
          P.gold, 2
        );

        path(
          c, [[ox, oy], [mid, axis], [end, cy]],
          P.violet, 2
        );

        if (Number.isFinite(q.v)) {

          let ix = mid + q.v * scale;
          let iy = axis - q.m * height;

          arrow(c, ix, axis, ix, iy, P.red);

          if (q.v < 0) {
            line(c, mid, oy, ix, iy, P.gold, 1, [5, 5]);
            line(c, mid, axis, ix, iy, P.violet, 1, [5, 5]);
          }
        }

        if (s.running || s.t > 0) {
          let z = (s.t * .7) % 1;

          for (let [yy, ex] of [[oy, ry], [axis, cy]]) {
            glow(
              c,
              mid + (end - mid) * z,
              yy + (ex - yy) * z,
              3, P.ink
            );
          }
        }

        label(c, "THIN LENS RAY DIAGRAM", 20, 26);
      }
    },

    /* 16 — DOPPLER EFFECT */

    {
      id: "doppler-lab",
      title: "What if a sound source moved faster?",
      label: "Acoustics",
      category: "physics",

      desc: "Move a sound source and watch wavefronts bunch up in front of it.",

      action: "Move sound source",

      knobs: [
        knob("v", "Source speed", 0, 300, 5, 100, "m/s"),
        knob("f", "Emitted frequency", 100, 1000, 5, 440, "Hz")
      ],

      presets: [
        ["Stationary", {v: 0}],
        ["Fast car", {v: 35}],
        ["Fast aircraft", {v: 250}]
      ],

      formula: "fₐ = fc/(c − vₛ) · fᵣ = fc/(c + vₛ)",

      explain: "A moving source compresses wavefronts ahead and spreads them behind. A stationary observer hears a higher frequency as the source approaches and a lower frequency as it recedes.",

      note: "Sound speed fixed at 343 m/s. Stationary observers, subsonic source and still air. Wavefront dimensions are visually rescaled.",

      calc: p => ({
        a: p.f * 343 / (343 - p.v),
        r: p.f * 343 / (343 + p.v)
      }),

      stats: (p, s, q) => [
        metric("Approaching frequency", fmt(q.a, 1) + " Hz"),
        metric("Receding frequency", fmt(q.r, 1) + " Hz"),
        metric("Mach number", fmt(p.v / 343, 3)),
        metric("Emitted frequency", fmt(p.f, 0) + " Hz")
      ],

      draw: (c, p, s) => {

        let v = p.v / 343 * 70;
        let phase = s.t % 6;
        let x = clamp(155 + v * (phase - 3), 22, 615);

        for (let i = 11; i >= 1; i--) {
          let age = i * .27 + (s.t % .27);
          let r = age * 70;
          let center = x - v * age;

          c.globalAlpha =
            clamp(1 - age / 3.4, .1, 1);

          circle(c, center, 150, r, null, P.blue, 1.7);
        }

        c.globalAlpha = 1;

        glow(c, x, 150, 10, P.gold);

        arrow(
          c, x, 150,
          Math.min(x + 50, 635), 150, P.gold
        );

        label(c, "RECEDING", 18, 270, P.violet);

        label(
          c, "APPROACHING", 642, 270,
          P.cyan, "right"
        );

        label(c, "MOVING WAVE SOURCE", 20, 26);
      }
    },

    /* 17 — SPRING PHYSICS */

    {
      id: "spring-lab",
      title: "What if a spring became twice as stiff?",
      label: "Mechanics",
      category: "physics",

      desc: "Release a spring-mounted mass and see how stiffness and mass affect oscillations.",

      action: "Release mass",

      knobs: [
        knob("m", "Mass", .5, 10, .1, 2, "kg"),
        knob("k", "Spring stiffness", 5, 100, 1, 25, "N/m"),
        knob("a", "Initial displacement", .05, .5, .01, .25, "m")
      ],

      presets: [
        ["Soft spring", {k: 10}],
        ["Stiff spring", {k: 80}],
        ["Heavy mass", {m: 8}]
      ],

      formula: "T = 2π√(m/k) · E = ½kA²",

      explain: "A stiffer spring increases the restoring force and shortens the period. A larger mass resists acceleration and increases the period.",

      note: "Ideal horizontal Hooke's-law spring, no friction or damping, released from rest.",

      calc: p => ({
        w: Math.sqrt(p.k / p.m),
        T: TAU * Math.sqrt(p.m / p.k),
        E: .5 * p.k * p.a * p.a
      }),

      stats: (p, s, q) => [
        metric("Period", fmt(q.T, 3) + " s"),
        metric("Total mechanical energy", fmt(q.E, 3) + " J"),

        metric(
          "Displacement",
          fmt(p.a * Math.cos(q.w * s.t), 3) + " m"
        ),

        metric("Maximum speed", fmt(q.w * p.a, 3) + " m/s")
      ],

      draw: (c, p, s, q) => {

        let x =
          350 + p.a * Math.cos(q.w * s.t) * 340;

        ground(c, 210);
        line(c, 60, 86, 60, 210, P.muted, 8);

        let pts = [[60, 150], [80, 150]];

        for (let i = 1; i <= 28; i++) {

          pts.push([
            80 + (x - 112) * i / 29,
            150 + (i % 2 ? 15 : -15)
          ]);
        }

        pts.push([x - 32, 150]);

        path(c, pts, P.violet, 3);

        c.fillStyle = P.blue;
        c.fillRect(x - 32, 118, 64, 64);

        label(
          c, fmt(p.m, 1) + " kg",
          x, 155, P.ink, "center"
        );

        line(c, 350, 92, 350, 215, P.muted, 1, [5, 5]);

        let pe = Math.cos(q.w * s.t) ** 2;

        bar(c, 92, 250, 200, pe, P.violet, "Potential");
        bar(c, 370, 250, 200, 1 - pe, P.cyan, "Kinetic");

        label(c, "ENERGY EXCHANGE", 20, 26);
      }
    },

    /* 18 — SOLAR ECLIPSE */

    {
      id: "eclipse-lab",
      title: "What if the Moon blocked the Sun?",
      label: "Astronomy",
      category: "space physics",

      desc: "Move the Moon across the solar disk and create partial, total or annular eclipses.",

      action: "Run eclipse transit",

      knobs: [
        knob("offset", "Moon position", -2, 2, .01, -2, "solar radii"),
        knob("r", "Apparent Moon size", .5, 1.3, .01, 1.05, "× Sun radius")
      ],

      presets: [
        ["Total", {offset: 0, r: 1.05}],
        ["Annular", {offset: 0, r: .8}],
        ["Partial", {offset: .9, r: 1.05}]
      ],

      formula: "Obscuration = overlapping disk area / solar disk area",

      explain: "An eclipse occurs when the Moon passes between the Sun and an observer. Apparent sizes and alignment determine whether the eclipse is partial, total or annular.",

      note: "Two-dimensional apparent disk geometry, not a prediction of eclipse dates or visibility. Never look at the real Sun without certified solar viewing protection.",

      calc: p => ({}),

      stats: (p, s) => {

        let d = Math.abs(eclipseOffset(p, s));
        let r = p.r;
        let f = overlap(d, r);

        return [
          metric("Solar disk obscured", fmt(f * 100, 2) + "%"),
          metric("Visible disk area", fmt((1 - f) * 100, 2) + "%"),

          metric(
            "Eclipse type",
            d >= 1 + r
              ? "None"
              : d <= Math.abs(1 - r)
                ? r >= 1 ? "Total" : "Annular"
                : "Partial"
          ),

          metric("Apparent Moon radius", fmt(r) + "× Sun")
        ];
      },

      duration: () => 8,

      draw: (c, p, s) => {

        let d = eclipseOffset(p, s);
        let x = 330 + d * 83;
        let r = p.r * 83;

        c.save();
        c.shadowColor = P.gold;
        c.shadowBlur = 30;

        circle(c, 330, 150, 83, "#ffba54");
        c.restore();

        circle(c, 330, 150, 78, "#ffd37a");

        c.save();
        c.beginPath();
        c.arc(330, 150, 83, 0, TAU);
        c.clip();

        circle(c, x, 150, r, "#0b1223");
        c.restore();

        circle(c, x, 150, r, null, "#53647e");

        label(c, "APPARENT SOLAR DISK", 20, 26);

        label(
          c,
          fmt(overlap(Math.abs(d), p.r) * 100, 2) + "% obscured",
          620, 288, P.gold, "right"
        );
      }
    },

    /* 19 — ELECTRIC CIRCUIT */

    {
      id: "circuit-lab",
      title: "What if you doubled the voltage?",
      label: "Electricity",
      category: "physics",

      desc: "Build a simple circuit, flip its switch and watch the current change.",

      action: "Close switch",

      knobs: [
        knob("v", "Battery voltage", 1, 24, .5, 9, "V"),
        knob("r", "Load resistance", 1, 100, 1, 10, "Ω")
      ],

      presets: [
        ["Low voltage", {v: 3, r: 10}],
        ["High resistance", {v: 9, r: 50}],
        ["High voltage", {v: 18, r: 10}]
      ],

      formula: "I = V/R · P = VI = V²/R",

      explain: "A closed circuit lets charge flow through the load. Increasing voltage raises current. Increasing resistance lowers it. The load converts electrical energy into heat or light.",

      note: "Ideal DC source and constant ohmic resistor. The glowing load is an illustrative indicator, not a real lamp model.",

      calc: p => ({
        i: p.v / p.r,
        power: p.v * p.v / p.r
      }),

      stats: (p, s, q) => [
        metric("Current", fmt(s.closed ? q.i : 0, 3) + " A"),

        metric(
          "Load power",
          fmt(s.closed ? q.power : 0, 3) + " W"
        ),

        metric("Switch", s.closed ? "Closed" : "Open"),
        metric("Resistance", fmt(p.r, 0) + " Ω")
      ],

      draw: (c, p, s, q) => {

        let active = s.closed;
        let col = active ? P.cyan : P.muted;

        path(c, [[135, 125], [135, 60], [280, 60]], col, 3);
        path(c, [[350, 60], [525, 60], [525, 125]], col, 3);

        path(
          c,
          [[525, 183], [525, 245], [135, 245], [135, 177]],
          col, 3
        );

        circle(c, 280, 60, 5, P.gold);
        circle(c, 350, 60, 5, P.gold);

        line(c, 280, 60, 350, active ? 60 : 30, P.gold, 4);

        line(c, 110, 137, 160, 137, P.ink, 4);
        line(c, 120, 162, 150, 162, P.ink, 4);

        line(c, 135, 125, 135, 137, col, 3);
        line(c, 135, 162, 135, 177, col, 3);

        if (active) {

          c.save();
          c.shadowColor = P.gold;
          c.shadowBlur = clamp(8 + q.power, 8, 45);

          circle(c, 525, 154, 29, "#ffbf59");
          c.restore();

        } else {

          circle(
            c, 525, 154, 29,
            "#263247", P.muted, 2
          );
        }

        path(
          c,
          [[512, 154], [519, 142], [530, 166], [538, 154]],
          active ? "#fff5dc" : P.muted,
          2
        );

        if (active) {

          let nodes = [
            [135, 60],
            [525, 60],
            [525, 245],
            [135, 245],
            [135, 60]
          ];

          let lens = [390, 185, 390, 185];
          let total = 1150;

          for (let i = 0; i < 12; i++) {

            let z = (
              i * total / 12 +
              s.t * (25 + Math.min(200, q.i * 30))
            ) % total;

            let j = 0;

            while (z > lens[j] && j < 3) {
              z -= lens[j++];
            }

            let a = nodes[j];
            let b = nodes[j + 1];
            let f = z / lens[j];

            if (
              j === 1 &&
              Math.abs(a[1] + (b[1] - a[1]) * f - 154) < 35
              ||
              j === 3 &&
              Math.abs(a[1] + (b[1] - a[1]) * f - 150) < 30
            ) continue;

            glow(
              c,
              a[0] + (b[0] - a[0]) * f,
              a[1] + (b[1] - a[1]) * f,
              3, P.cyan
            );
          }
        }

        label(c, "IDEAL DC CIRCUIT", 20, 26);
        label(c, fmt(p.v) + " V", 82, 155, P.ink, "center");
        label(c, fmt(p.r, 0) + " Ω", 595, 155, P.ink, "center");

        label(
          c,
          active ? "CURRENT FLOWING" : "OPEN CIRCUIT",
          330, 283, col, "center"
        );
      }
    }

  ];

  /* EXPERIMENT NUMBERING */

  labs.forEach((lab, i) => {
    lab.number = String(i + 10);
  });

  /* ECLIPSE MATHEMATICS */

  function eclipseOffset(p, s) {
    return s.started
      ? -2.5 + 5 * clamp(s.t / 8, 0, 1)
      : p.offset;
  }

  function overlap(d, r) {

    if (d >= 1 + r) return 0;

    if (d <= Math.abs(1 - r)) {
      return Math.min(1, r * r);
    }

    let a = Math.acos(
      clamp((d*d + 1 - r*r) / (2*d), -1, 1)
    );

    let b = Math.acos(
      clamp((d*d + r*r - 1) / (2*d*r), -1, 1)
    );

    return clamp(
      (
        a + r*r*b -
        .5 * Math.sqrt(Math.max(
          0,
          (-d + 1 + r) *
          (d + 1 - r) *
          (d - 1 + r) *
          (d + 1 + r)
        ))
      ) / Math.PI,
      0, 1
    );
  }

  /* CANVAS GRAPHICS ENGINE */

  function line(c, x, y, X, Y, color, w = 1, dash = []) {
    c.beginPath();
    c.setLineDash(dash);
    c.moveTo(x, y);
    c.lineTo(X, Y);
    c.lineWidth = w;
    c.strokeStyle = color;
    c.stroke();
    c.setLineDash([]);
  }

  function path(c, pts, color, w = 1, dash = []) {

    if (!pts.length) return;

    c.beginPath();
    c.setLineDash(dash);

    pts.forEach(([x, y], i) => {
      i ? c.lineTo(x, y) : c.moveTo(x, y);
    });

    c.lineWidth = w;
    c.strokeStyle = color;
    c.stroke();
    c.setLineDash([]);
  }

  function circle(c, x, y, r, fill, stroke, w = 1) {

    if (r <= 0) return;

    c.beginPath();
    c.arc(x, y, r, 0, TAU);

    if (fill) {
      c.fillStyle = fill;
      c.fill();
    }

    if (stroke) {
      c.strokeStyle = stroke;
      c.lineWidth = w;
      c.stroke();
    }
  }

  function glow(c, x, y, r, color) {

    if (r <= 0) return;

    c.save();
    c.shadowColor = color;
    c.shadowBlur = 14;
    circle(c, x, y, r, color);
    c.restore();
  }

  function label(c, t, x, y, color = P.muted, align = "left") {
    c.fillStyle = color;
    c.font = "12px system-ui, sans-serif";
    c.textAlign = align;
    c.fillText(t, x, y);
  }

  function ground(c, y) {
    c.fillStyle = "#182c41";
    c.fillRect(0, y, 660, 300 - y);
    line(c, 0, y, 660, y, "#55718b", 2);
  }

  function arrow(c, x, y, X, Y, color) {

    let a = Math.atan2(Y - y, X - x);

    line(c, x, y, X, Y, color, 2);

    path(c, [
      [
        X - 9 * Math.cos(a - .5),
        Y - 9 * Math.sin(a - .5)
      ],
      [X, Y],
      [
        X - 9 * Math.cos(a + .5),
        Y - 9 * Math.sin(a + .5)
      ]
    ], color, 2);
  }

  function bar(c, x, y, w, f, color, name) {

    label(c, name, x, y - 5, color);

    c.fillStyle = "#28374c";
    c.fillRect(x, y, w, 7);

    c.fillStyle = color;
    c.fillRect(x, y, w * clamp(f, 0, 1), 7);
  }

  /* SIMULATION STATE */

  function defaults(lab) {

    return Object.fromEntries(
      lab.knobs.map(k => [k.key, k.value])
    );
  }

  function state(lab, p) {

    let s = {
      p,
      t: 0,
      running: false,
      ended: false,
      started: false,
      closed: false
    };

    if (lab.init) lab.init(s);

    return s;
  }

  function draw(canvas, lab, p, s, q) {

    let c = canvas.getContext("2d");

    if (!c) return;

    c.save();

    c.setTransform(
      canvas.width / 660, 0,
      0, canvas.height / 300,
      0, 0
    );

    let bg = c.createLinearGradient(0, 0, 660, 300);

    bg.addColorStop(0, "#101d32");
    bg.addColorStop(1, "#080e1b");

    c.fillStyle = bg;
    c.fillRect(0, 0, 660, 300);

    for (let i = 0; i < 34; i++) {

      let x = (i * 173 + 29) % 660;
      let y = (i * 71 + 17) % 300;

      c.globalAlpha = .17 + (i % 4) * .06;

      circle(
        c, x, y,
        i % 7 === 0 ? 1.25 : .55,
        "#b4d0ff"
      );
    }

    c.globalAlpha = 1;

    lab.draw(c, p, s, q);

    c.restore();
  }

  /* ADVANCED EXPERIMENT STYLES */

  const css = `

    .card[hidden] {
      display: none !important;
    }

    .plus-art {
      display: block !important;
      aspect-ratio: 2.2;
      overflow: hidden;
      background: #101d32;
    }

    .plus-art canvas {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .plus-shell {
      margin-top: 24px;
    }

    .plus-scene {
      position: relative;
      overflow: hidden;
      background: #0b1423;
      border: 1px solid #263c55;
      border-radius: 16px;
      margin: 18px;
      align-self: start;
    }

    .plus-scene canvas {
      display: block;
      width: 100%;
      height: auto;
    }

    .plus-scene-head {
      padding: 12px 16px;
      color: #b0c7e5;
      font-size: 12px;
      letter-spacing: .09em;
      border-bottom: 1px solid #263c55;
    }

    .plus-live {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: #72e3d6;
      border-radius: 50%;
      margin-right: 8px;
    }

    .plus-controls {
      gap: 12px !important;
    }

    .plus-controls .control {
      padding: 14px !important;
    }

    .plus-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .plus-actions button {
      flex: 1;
    }

    .plus-presets {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .plus-presets button {
      font-size: 12px;
      padding: 8px 12px;
    }

    .plus-state {
      font-size: 12px;
      color: var(--muted);
      margin: 0;
    }

    .plus-science {
      margin: 28px 0;
      padding: 24px;
      border: 1px solid var(--border);
      border-radius: 18px;
      background: var(--panel);
    }

    .plus-science p {
      margin: 12px 0;
    }

    .plus-formula {
      overflow-wrap: anywhere;
      padding: 15px;
      background: var(--surface);
      border-left: 3px solid var(--accent);
      border-radius: 6px;
      color: var(--accent);
      font-weight: 650;
    }

    .plus-science .note {
      font-size: 13px;
      color: var(--muted);
    }

    .plus-shell .metric strong {
      font-size: clamp(20px, 2.5vw, 30px);
    }

    @media(max-width: 700px) {

      .plus-shell .workspace {
        grid-template-columns: 1fr;
        gap: 0;
      }

      .plus-scene {
        margin: 12px;
      }

      .plus-controls {
        padding: 12px !important;
      }

      .plus-shell .metrics {
        gap: 8px;
      }

      .plus-shell .metric {
        padding: 12px;
      }

      .plus-shell .metric strong {
        font-size: 18px;
      }

      .plus-science {
        padding: 16px;
      }
    }
  `;

  function installStyle() {

    if ($("plus-styles")) return;

    let tag = document.createElement("style");

    tag.id = "plus-styles";
    tag.textContent = css;

    document.head.append(tag);
  }

  /* AUTOMATIC HOMEPAGE CARDS */

  function addCards() {

    let grid = document.querySelector(
      "#experiments .cards"
    );

    if (!grid || grid.querySelector("[data-plus]")) return;

    for (let lab of labs) {

      let card = document.createElement("article");

      card.className = "card";
      card.dataset.plus = lab.id;
      card.dataset.category = lab.category;

      card.dataset.search = [
        lab.title,
        lab.label,
        lab.desc,
        lab.id
      ].join(" ");

      card.innerHTML = `

        <div class="plus-art" aria-hidden="true">

          <canvas width="660" height="300"></canvas>

        </div>

        <div class="card-content">

          <div class="tag">
            ${lab.label} · ${lab.number}
          </div>

          <h3>${lab.title}</h3>

          <p>${lab.desc}</p>

          <a class="explore"
            href="experiments.html?lab=${lab.id}">
            Run experiment →
          </a>

        </div>
      `;

      grid.append(card);

      let p = defaults(lab);
      let s = state(lab, p);

      if (lab.id === "projectile-launch") {
        s.t = lab.calc(p).t * .45;
      }

      if (lab.id === "eclipse-lab") {
        p.offset = .35;
      }

      if (lab.id === "orbit-lab") {

        s.trail = Array.from({length: 60}, (_, i) => [
          Math.cos(i / 60 * TAU),
          Math.sin(i / 60 * TAU)
        ]);
      }

      if (lab.id === "circuit-lab") {
        s.closed = true;
      }

      draw(
        card.querySelector("canvas"),
        lab, p, s, lab.calc(p)
      );
    }

    if (typeof filterCards === "function") {
      filterCards();
    }
  }

  /* ADVANCED EXPERIMENT PAGE */

  function render() {

    let page = $("experiment-page");
    let picker = $("lab-picker");

    if (!page || !picker) return;

    let id = new URLSearchParams(
      location.search
    ).get("lab");

    let lab = labs.find(l => l.id === id);

    if (!picker.querySelector("[data-plus-options]")) {

      let group = document.createElement("optgroup");

      group.label = "Advanced experiments";
      group.dataset.plusOptions = "";

      for (let l of labs) {

        let o = document.createElement("option");

        o.value = l.id;

        o.textContent = l.number + " — " + l.title;

        group.append(o);
      }

      picker.append(group);
    }

    if (!lab) return;

    let clean = picker.cloneNode(true);

    picker.replaceWith(clean);

    clean.value = lab.id;

    clean.addEventListener("change", () => {

      location.href = "experiments.html?lab=" +
        encodeURIComponent(clean.value);
    });

    document.title = lab.title + " | What If Lab";

    $("experiment-title").textContent = lab.title;

    $("experiment-description").textContent = lab.desc;

    $("experiment-label").textContent =
      "Experiment " + lab.number + " / " + lab.label;

    page.innerHTML = `

      <div class="plus-shell">

        <div class="lab">

          <div class="lab-header">

            <strong>Interactive laboratory</strong>

            <span class="tag">${lab.label}</span>

          </div>

          <div class="workspace">

            <div class="plus-scene">

              <div class="plus-scene-head">

                <span class="plus-live"></span>

                LIVE SCIENCE MODEL

              </div>

              <canvas
                id="plus-canvas"
                width="990"
                height="450"
                role="img"
                aria-label="${lab.label} simulation visualization">
              </canvas>

            </div>

            <div class="controls plus-controls">

              ${lab.knobs.map(k => `

                <div class="control">

                  <label for="plus-${k.key}">

                    ${k.label}

                    <output id="plus-out-${k.key}"></output>

                  </label>

                  <input
                    type="range"
                    id="plus-${k.key}"
                    min="${k.min}"
                    max="${k.max}"
                    step="${k.step}"
                    value="${k.value}">

                </div>

              `).join("")}

              <div class="plus-presets">

                ${lab.presets.map(([name], i) => `

                  <button
                    class="secondary"
                    type="button"
                    data-plus-preset="${i}">

                    ${name}

                  </button>

                `).join("")}

              </div>

              <div class="plus-actions">

                <button
                  type="button"
                  class="primary"
                  id="plus-play">

                  ${lab.action}

                </button>

                <button
                  type="button"
                  class="secondary"
                  id="plus-reset">

                  Reset

                </button>

              </div>

              <p class="plus-state"
                id="plus-status"
                aria-live="polite">

                Ready to experiment

              </p>

            </div>

          </div>

        </div>

        <div class="metrics" id="plus-results">

          ${Array.from({length: 4}, () => `

            <div class="metric">
              <small></small>
              <strong></strong>
            </div>

          `).join("")}

        </div>

        <article class="plus-science">

          <div class="eyebrow">
            The science behind it
          </div>

          <h2>Why does this happen?</h2>

          <p>${lab.explain}</p>

          <div class="plus-formula">
            ${lab.formula}
          </div>

          <p class="note">${lab.note}</p>

          <p class="note">
            Illustrations are schematic and may not be to scale.
          </p>

          <a href="index.html#experiments">
            ← Explore all experiments
          </a>

        </article>

      </div>
    `;

    /* LIVE INTERACTION ENGINE */

    let p = defaults(lab);
    let s = state(lab, p);
    let q = lab.calc(p);

    let raf = 0;
    let last = 0;
    let lastStats = 0;

    let canvas = $("plus-canvas");
    let play = $("plus-play");
    let status = $("plus-status");

    let reduced = matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function updateKnobs() {

      for (let k of lab.knobs) {

        $("plus-" + k.key).value = p[k.key];

        $("plus-out-" + k.key).textContent =
          fmt(p[k.key], 2) + " " + k.unit;
      }
    }

    function paint(stats = true) {

      draw(canvas, lab, p, s, q);

      if (stats) {

        let metrics = lab.stats(p, s, q);

        [...$("plus-results").children].forEach(
          (el, i) => {

            el.querySelector("small").textContent =
              metrics[i][0];

            el.querySelector("strong").textContent =
              metrics[i][1];
          }
        );
      }
    }

    function buttons() {

      play.textContent =
        lab.id === "circuit-lab"
          ? s.closed ? "Open switch" : "Close switch"
          : s.running
            ? "Pause"
            : s.ended
              ? "Run again"
              : s.started
                ? "Resume"
                : lab.action;

      status.textContent =
        lab.id === "circuit-lab"
          ? s.closed ? "Circuit closed" : "Circuit open"
          : s.running
            ? "Simulation running"
            : s.ended
              ? "Simulation complete"
              : s.started
                ? "Paused"
                : "Ready to experiment";
    }

    function stop() {

      cancelAnimationFrame(raf);

      s.running = false;
      last = 0;

      buttons();
    }

    function reset(change = false) {

      stop();

      if (!change) p = defaults(lab);

      s = state(lab, p);
      q = lab.calc(p);

      updateKnobs();
      paint();
      buttons();
    }

    function frame(now) {

      if (!s.running) return;

      let dt = last
        ? Math.min((now - last) / 1000, .05)
        : 0;

      last = now;
      s.t += dt;

      if (lab.advance) {
        lab.advance(p, s, dt);
      }

      let end = lab.duration
        ? lab.duration(p, q)
        : Infinity;

      if (s.t >= end) {

        s.t = end;
        s.running = false;
        s.ended = true;
      }

      let update =
        now - lastStats > 120 || !s.running;

      paint(update);

      if (update) lastStats = now;

      if (s.running) {

        raf = requestAnimationFrame(frame);

      } else {

        buttons();
      }
    }

    /* SLIDER CONTROLS */

    for (let k of lab.knobs) {

      $("plus-" + k.key).addEventListener(
        "input", e => {

          p[k.key] = Number(e.target.value);

          let closed = s.closed;

          reset(true);

          if (lab.id === "circuit-lab" && closed) {

            s.closed = true;

            paint();
            buttons();

            if (!reduced) {

              s.running = true;

              raf = requestAnimationFrame(frame);
            }
          }
        }
      );
    }

    /* PRESET CONTROLS */

    page.querySelectorAll("[data-plus-preset]")
      .forEach(btn => {

        btn.addEventListener("click", () => {

          Object.assign(
            p,
            lab.presets[Number(btn.dataset.plusPreset)][1]
          );

          reset(true);
        });
      });

    /* RESET BUTTON */

    $("plus-reset").addEventListener(
      "click", () => reset()
    );

    /* PLAY, PAUSE AND SWITCH */

    play.addEventListener("click", () => {

      if (lab.id === "circuit-lab") {

        if (s.closed) {

          s.closed = false;

          stop();
          paint();

        } else {

          s.closed = true;

          paint();
          buttons();

          if (!reduced) {

            s.running = true;
            last = 0;

            raf = requestAnimationFrame(frame);
          }
        }

        return;
      }

      if (s.running) {

        stop();
        return;
      }

      if (s.ended) {

        s = state(lab, p);
        q = lab.calc(p);
      }

      s.started = true;

      if (reduced) {

        s.t = lab.duration
          ? lab.duration(p, q) / 2
          : 1;

        if (lab.advance) {
          lab.advance(p, s, 1);
        }

        s.ended = true;

        paint();
        buttons();

        return;
      }

      s.running = true;
      last = 0;

      buttons();

      raf = requestAnimationFrame(frame);
    });

    updateKnobs();
    paint();
    buttons();
  }

  /* INITIALIZE EXPERIMENT PACK */

  function init() {

    installStyle();
    addCards();
    render();
  }

  if (document.readyState === "loading") {

    document.addEventListener(
      "DOMContentLoaded",
      init,
      {once: true}
    );

  } else {

    init();
  }

})();

/* END OF ADVANCED EXPERIMENT PACK */
