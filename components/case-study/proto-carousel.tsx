"use client";

import {
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
  useEffect,
} from "react";

export interface CarouselSlide {
  image: string;
  alt: string;
  title: string;
  description: string;
}

interface Props {
  slides: CarouselSlide[];
  /** Optional id to scope CSS overrides (e.g. "design-system-carousel") */
  id?: string;
}

export function ProtoCarousel({ slides, id }: Props) {
  const [index, setIndex] = useState(0);
  const [windowHeight, setWindowHeight] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const goTo = useCallback(
    (i: number) => setIndex(Math.max(0, Math.min(slides.length - 1, i))),
    [slides.length]
  );
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx < -40) next();
    else if (dx > 40) prev();
    touchStartX.current = null;
  }

  const trackStyle = {
    display: "flex",
    transform: `translateX(-${index * 100}%)`,
    transition: "transform 0.45s cubic-bezier(0.25, 0.85, 0.3, 1)",
    willChange: "transform" as const,
  };

  const measureActiveSlide = useCallback(() => {
    const el = slideRefs.current[index];
    if (!el) return;
    const h = Math.round(el.getBoundingClientRect().height);
    if (h > 0) setWindowHeight(h);
  }, [index]);

  useLayoutEffect(() => {
    measureActiveSlide();
  }, [measureActiveSlide, slides]);

  useEffect(() => {
    const el = slideRefs.current[index];
    if (!el) return;
    const ro = new ResizeObserver(() => measureActiveSlide());
    ro.observe(el);
    return () => ro.disconnect();
  }, [index, measureActiveSlide]);

  useEffect(() => {
    function onResize() {
      measureActiveSlide();
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measureActiveSlide]);

  const windowStyle =
    windowHeight != null
      ? {
          height: `${windowHeight}px`,
          transition: "height 0.35s ease-out",
        }
      : undefined;

  return (
    <div className="proto-carousel" id={id}>
      <div className="proto-carousel-viewport">
        <div
          className="proto-carousel-window"
          style={windowStyle}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="proto-carousel-track" style={trackStyle}>
            {slides.map((slide, i) => (
              <div
                key={i}
                ref={(node) => {
                  slideRefs.current[i] = node;
                }}
                className="proto-carousel-slide"
                style={{ minWidth: "100%" }}
                aria-hidden={i !== index}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={slide.image} alt={slide.alt} draggable={false} />
                <div className="proto-carousel-caption">
                  <h3>{slide.title}</h3>
                  <p>{slide.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="proto-carousel-controls">
        <button
          className="proto-carousel-btn"
          onClick={prev}
          disabled={index === 0}
          aria-label="Previous slide"
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.5 15L7.5 10l5-5" />
          </svg>
        </button>

        <div className="proto-carousel-dots" role="tablist" aria-label="Slides">
          {slides.map((_, i) => (
            <button
              key={i}
              className="proto-carousel-dot"
              role="tab"
              aria-selected={i === index}
              aria-current={i === index ? "true" : undefined}
              aria-label={`Slide ${i + 1}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>

        <span className="proto-carousel-counter">
          {index + 1} / {slides.length}
        </span>

        <button
          className="proto-carousel-btn"
          onClick={next}
          disabled={index === slides.length - 1}
          aria-label="Next slide"
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7.5 5l5 5-5 5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
