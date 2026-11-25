"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

const MAX_PULL = 38;
const DOWN_MS = 190;
const RELEASE_MS = 620;

// A hanging lamp pull-chain that swaps the site theme. The cord is sized in
// CSS (see `.theme-rope__cord`), and pulling the lamp down grows the cord by
// `MAX_PULL` before the theme is committed and the lamp springs back up.
const ThemeRope = () => {
  const [theme, setTheme] = useState("light");
  const [phase, setPhase] = useState("idle");
  const [pullOffset, setPullOffset] = useState(0);

  const themeRef = useRef("light");
  const busyRef = useRef(false);
  const startYRef = useRef(null);
  const draggedRef = useRef(false);
  const timersRef = useRef([]);

  useEffect(() => {
    const root = document.documentElement;
    const current = root.dataset.theme === "dark" ? "dark" : "light";
    themeRef.current = current;
    setTheme(current);

    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  const applyTheme = useCallback(() => {
    const next = themeRef.current === "light" ? "dark" : "light";
    themeRef.current = next;
    setTheme(next);

    if (typeof document !== "undefined") {
      document.documentElement.dataset.theme = next;
    }
    try {
      localStorage.setItem("theme", next);
    } catch (e) {
      // Private browsing can block storage — the toggle still works for the
      // current visit, it just won't be remembered on the next reload.
    }
  }, []);

  const handlePull = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    setPhase("down");
    setPullOffset(MAX_PULL);

    timersRef.current.push(
      window.setTimeout(() => {
        applyTheme();
        setPhase("release");
        setPullOffset(0);
      }, DOWN_MS),
      window.setTimeout(() => {
        setPhase("idle");
        busyRef.current = false;
      }, DOWN_MS + RELEASE_MS)
    );
  }, [applyTheme]);

  const handlePointerDown = (event) => {
    if (busyRef.current) return;
    startYRef.current = event.clientY;
    draggedRef.current = false;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (startYRef.current === null) return;
    const delta = Math.max(0, Math.min(event.clientY - startYRef.current, MAX_PULL));
    if (delta > 6) draggedRef.current = true;
    setPullOffset(delta);
  };

  const handlePointerUp = (event) => {
    if (startYRef.current === null) return;
    const delta = event.clientY - startYRef.current;
    startYRef.current = null;

    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setPullOffset(0);
    // A deliberate downward drag OR a plain click on the lamp both count as
    // a pull. Tiny accidental drags that end where they started are ignored.
    if (delta > 12 || !draggedRef.current) handlePull();
    draggedRef.current = false;
  };

  const handlePointerCancel = (event) => {
    startYRef.current = null;
    draggedRef.current = false;
    setPullOffset(0);
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  // Pointer-up handles mouse/touch; `detail === 0` covers keyboard activation.
  const handleClick = (event) => {
    if (event.detail === 0) handlePull();
  };

  const isDark = theme === "dark";

  return (
    <div
      className="theme-rope"
      data-phase={phase}
      style={{ "--rope-pull": `${pullOffset}px` }}
    >
      <div className="theme-rope__mount" aria-hidden="true" />
      <div className="theme-rope__cord" aria-hidden="true" />

      <button
        type="button"
        className="theme-rope__lamp"
        aria-label={isDark ? "Pull the lamp to switch to light mode" : "Pull the lamp to switch to dark mode"}
        aria-pressed={isDark}
        title="Pull the lamp to change theme"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onClick={handleClick}
      >
        <span className="theme-rope__cap" aria-hidden="true" />
        <svg className="theme-rope__shade" viewBox="0 0 64 48" aria-hidden="true">
          <path d="M22 4h20l14 34a3 3 0 0 1-3 4H11a3 3 0 0 1-3-4L22 4Z" fill="currentColor" />
          <path d="M20 4h24" stroke="var(--color-bg-alt)" strokeOpacity="0.4" strokeWidth="2" />
        </svg>
        <span className="theme-rope__bulb" aria-hidden="true" />
        <span className="theme-rope__pull" aria-hidden="true">PULL</span>
      </button>
    </div>
  );
};

export default ThemeRope;
