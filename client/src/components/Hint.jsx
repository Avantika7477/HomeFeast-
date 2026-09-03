import { cloneElement, isValidElement, useState } from "react";
import { createPortal } from "react-dom";

export default function Hint({ text, children }) {
  const [box, setBox] = useState(null);

  function show(event) {
    const el = event.currentTarget;
    const r = el.getBoundingClientRect();
    const width = Math.min(256, window.innerWidth - 24);
    let left = r.left + r.width / 2;
    left = Math.min(window.innerWidth - 12 - width / 2, Math.max(12 + width / 2, left));
    const preferBelow = r.bottom + 48 < window.innerHeight;
    setBox({
      top: preferBelow ? r.bottom + 8 : r.top - 8,
      left,
      width,
      place: preferBelow ? "below" : "above",
    });
  }

  function hide() {
    setBox(null);
  }

  const child = isValidElement(children)
    ? cloneElement(children, {
        onMouseEnter: (e) => {
          children.props.onMouseEnter?.(e);
          show(e);
        },
        onMouseLeave: (e) => {
          children.props.onMouseLeave?.(e);
          hide();
        },
        onFocus: (e) => {
          children.props.onFocus?.(e);
          show(e);
        },
        onBlur: (e) => {
          children.props.onBlur?.(e);
          hide();
        },
        onClick: (e) => {
          children.props.onClick?.(e);
          hide();
        },
      })
    : children;

  return (
    <>
      {child}
      {box &&
        createPortal(
          <span
            role="tooltip"
            className="pointer-events-none fixed z-[90] rounded-lg bg-ink px-2.5 py-1.5 text-center text-xs font-medium leading-snug text-white shadow-lg"
            style={{
              top: box.top,
              left: box.left,
              width: box.width,
              maxWidth: "min(16rem, calc(100vw - 1.5rem))",
              transform: `translate(-50%, ${box.place === "below" ? "0" : "-100%"})`,
            }}
          >
            {text}
          </span>,
          document.body
        )}
    </>
  );
}
