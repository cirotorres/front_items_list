// src/components/ThemeToggle.jsx
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const body = document.body;
    if (dark) {
      body.classList.add("dark-mode");
      body.classList.remove("light-mode");
      localStorage.setItem("theme", "dark");
    } else {
      body.classList.add("light-mode");
      body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <div className="form-check form-switch d-flex align-items-center">
      <input
        className="form-check-input"
        type="checkbox"
        id="themeSwitch"
        checked={dark}
        onChange={() => setDark(!dark)}
      />
      <label className="form-check-label ms-2 mb-0" htmlFor="themeSwitch">
        {dark ? "🌙" : "☀️"}
      </label>
    </div>
  );
}
