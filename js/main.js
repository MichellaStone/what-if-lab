
/* ==========================================
   WHAT IF LAB
   Shared JavaScript System — Version 1.0
   ========================================== */

(function () {

  "use strict";

  const root = document.documentElement;

  /* 01. SAFE LOCAL STORAGE */

  function readPreference(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function savePreference(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Continue when storage is unavailable.
    }
  }

  /* 02. GLOBAL THEME SYSTEM */

  function setTheme(theme) {

    if (theme !== "light" && theme !== "dark") {
      theme = "dark";
    }

    root.setAttribute("data-theme", theme);

    savePreference("whatif-theme", theme);

    document.querySelectorAll(
      "[data-theme-toggle]"
    ).forEach(button => {

      button.setAttribute(
        "aria-pressed",
        String(theme === "light")
      );

      button.textContent = theme === "dark"
        ? "Light mode"
        : "Dark mode";

    });

  }

  function toggleTheme() {

    const current =
      root.getAttribute("data-theme");

    setTheme(
      current === "dark" ? "light" : "dark"
    );

  }

  /* 03. ANIMATION PREFERENCE */

  function setAnimations(enabled) {

    root.classList.toggle(
      "animation-disabled",
      !enabled
    );

    savePreference(
      "whatif-animations",
      enabled ? "on" : "off"
    );

    document.querySelectorAll(
      "[data-animation-toggle]"
    ).forEach(button => {

      button.setAttribute(
        "aria-pressed",
        String(enabled)
      );

      button.textContent = enabled
        ? "Disable effects"
        : "Enable effects";

    });

  }

  function toggleAnimations() {

    const disabled = root.classList.contains(
      "animation-disabled"
    );

    setAnimations(disabled);

  }

  /* 04. MOBILE NAVIGATION */

  function setupNavigation() {

    const menuButton = document.querySelector(
      "[data-menu-toggle]"
    );

    const menu = document.querySelector(
      "[data-mobile-menu]"
    );

    if (!menuButton || !menu) return;

    function setMenu(open) {

      menu.classList.toggle("is-open", open);

      menuButton.setAttribute(
        "aria-expanded",
        String(open)
      );

    }

    setMenu(false);

    menuButton.addEventListener("click", () => {

      setMenu(
        !menu.classList.contains("is-open")
      );

    });

    menu.querySelectorAll("a").forEach(link => {

      link.addEventListener("click", () => {
        setMenu(false);
      });

    });

    document.addEventListener("keydown", event => {

      if (event.key === "Escape") {

        if (menu.classList.contains("is-open")) {
          setMenu(false);
          menuButton.focus();
        }

      }

    });

  }

  /* 05. AUTOMATIC COPYRIGHT YEAR */

  function updateYear() {

    document.querySelectorAll(
      "#year, [data-current-year]"
    ).forEach(element => {

      element.textContent =
        new Date().getFullYear();

    });

  }

  /* 06. INITIALIZE WEBSITE */

  function initialize() {

    const savedTheme =
      readPreference("whatif-theme");

    setTheme(savedTheme || "dark");

    const savedAnimation =
      readPreference("whatif-animations");

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    setAnimations(
      savedAnimation === null
        ? !reducedMotion
        : savedAnimation === "on"
    );

    document.querySelectorAll(
      "[data-theme-toggle]"
    ).forEach(button => {

      button.addEventListener(
        "click", toggleTheme
      );

    });

    document.querySelectorAll(
      "[data-animation-toggle]"
    ).forEach(button => {

      button.addEventListener(
        "click", toggleAnimations
      );

    });

    setupNavigation();
    updateYear();

  }

  /* 07. SHARED WEBSITE API */

  window.WhatIfLab = {

    setTheme,
    toggleTheme,
    setAnimations,
    toggleAnimations

  };

  /* 08. START */

  if (document.readyState === "loading") {

    document.addEventListener(
      "DOMContentLoaded",
      initialize,
      { once: true }
    );

  } else {

    initialize();

  }

})();

/* END OF SHARED JAVASCRIPT SYSTEM */
