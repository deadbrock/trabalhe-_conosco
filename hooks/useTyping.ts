import { useEffect } from "react";

export function useTyping() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".typing");
    const cleanups: Array<() => void> = [];

    elements.forEach((el) => {
      const fullText = el.dataset.text || el.textContent || "";
      let index = 0;
      el.textContent = "";

      const tick = () => {
        if (index <= fullText.length) {
          el.textContent = fullText.slice(0, index);
          index += 1;
        } else {
          index = 0;
          el.textContent = "";
        }
      };

      const interval = window.setInterval(tick, 60);
      cleanups.push(() => window.clearInterval(interval));
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, []);
}

