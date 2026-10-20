import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { gsap } from "gsap";
import "./AccordionGallery.css";

interface GalleryItem {
  image: string;
  label?: string;
  link?: string;
  alt?: string;
}

interface AccordionGalleryProps {
  items?: GalleryItem[];
  defaultIndex?: number;
  accentColor?: string;
  overlayColor?: string;
  textColor?: string;
  height?: number;
  gap?: number;
  radius?: number;
  expandRatio?: number;
  orientation?: "horizontal" | "vertical";
  duration?: number;
  ease?: string;
  parallax?: number;
  tilt?: number;
  stagger?: number;
  trigger?: "hover" | "click";
  showLabels?: boolean;
  grayscale?: boolean;
  className?: string;
}

const DEFAULT_ITEMS: GalleryItem[] = [
  {
    image: "/images/mu.jpg",
    label: "Summit",
    link: "#",
    alt: "Summit",
  },
  {
    image: "/images/riverway.jpg",
    label: "Riverway",
    link: "#",
    alt: "Riverway",
  },
  {
    image: "/images/plains.jpg",
    label: "Plains",
    link: "#",
    alt: "Plains",
  },
  {
    image: "/images/cloudfield.jpg",
    label: "Cloudfield",
    link: "#",
    alt: "Cloudfield",
  },
  {
    image: "/images/misthaven.jpg",
    label: "Misthaven",
    link: "#",
    alt: "Misthaven",
  },
];

const AccordionGallery = ({
  items = DEFAULT_ITEMS,
  defaultIndex = 2,
  accentColor = "#ffffff",
  overlayColor = "#060010",
  textColor = "#ffffff",
  height = 520,
  gap = 10,
  radius = 12,
  expandRatio = 0.52,
  orientation = "horizontal",
  duration = 0.6,
  ease = "power3.out",
  parallax = 0.5,
  tilt = 8,
  stagger = 0.06,
  trigger = "hover",
  showLabels = true,
  grayscale = true,
  className = "",
}: AccordionGalleryProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const mediaRefs = useRef<(HTMLElement | null)[]>([]);
  const labelRefs = useRef<(HTMLElement | null)[]>([]);
  const barRefs = useRef<(HTMLElement | null)[]>([]);
  const textRefs = useRef<(HTMLElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const firstRunRef = useRef(true);
  const mediaSizeRef = useRef(320);

  const vertical = orientation === "vertical";
  const count = items.length;

  const [active, setActive] = useState(() =>
    count > 0
      ? Math.min(Math.max(defaultIndex, 0), count - 1)
      : 0
  );

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 520px)");

    const handler = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    setIsMobile(mql.matches);
    mql.addEventListener("change", handler);

    return () => {
      mql.removeEventListener("change", handler);
    };
  }, []);

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const applyLayout = useCallback(
    (animate: boolean) => {
      const panels = panelRefs.current;

      if (!panels.length || count === 0) {
        return;
      }

      const r = Math.min(Math.max(expandRatio, 0.2), 0.9);

      const grow =
        count > 1
          ? (r * (count - 1)) / (1 - r)
          : 1;

      const mediaSize = mediaSizeRef.current;

      tlRef.current?.kill();

      const dur =
        animate && !prefersReduced
          ? duration
          : 0;

      const tl = gsap.timeline();

      panels.forEach((panel, i) => {
        if (!panel) return;

        const isActive = i === active;

        const media = mediaRefs.current[i];
        const bar = barRefs.current[i];
        const text = textRefs.current[i];
        const label = labelRefs.current[i];

        const rot = isActive
          ? 0
          : i < active
            ? tilt
            : -tilt;

        const rotProp = vertical
          ? { rotateX: -rot }
          : { rotateY: rot };

        tl.to(
          panel,
          {
            flexGrow: isActive ? grow : 1,
            ...rotProp,
            duration: dur,
            ease,
          },
          0
        );

        if (media) {
          const drift = Math.max(
            -1.5,
            Math.min(1.5, active - i)
          );

          const shift =
            drift * parallax * mediaSize * 0.06;

          const gray = grayscale
            ? isActive
              ? 0
              : 1
            : 0;

          tl.to(
            media,
            {
              xPercent: -50,
              yPercent: -50,
              x: vertical
                ? 0
                : isActive
                  ? 0
                  : shift,
              y: vertical
                ? isActive
                  ? 0
                  : shift
                : 0,
              "--ag-gray": gray,
              "--ag-dim": isActive ? 0 : 0.35,
              duration: dur,
              ease,
            },
            0
          );
        }

        if (
          showLabels &&
          label &&
          bar &&
          text
        ) {
          const isVertLayout =
            vertical || isMobile;

          if (isActive) {
            tl.to(
              label,
              {
                rotation: 0,
                y: 0,
                x: 0,
                transformOrigin: "left bottom",
                duration: dur,
                ease,
              },
              0
            );

            tl.to(
              [bar, text],
              {
                opacity: 1,
                x: 0,
                duration: dur,
                ease,
                stagger: prefersReduced
                  ? 0
                  : stagger,
              },
              0
            );
          } else if (isVertLayout) {
            tl.to(
              label,
              {
                rotation: 0,
                y: 0,
                x: 0,
                transformOrigin: "left bottom",
                duration: dur,
                ease,
              },
              0
            );

            tl.to(
              [bar, text],
              {
                opacity: 1,
                x: 0,
                duration: dur,
                ease,
              },
              0
            );
          } else {
            tl.to(
              label,
              {
                rotation: -90,
                y: -20,
                x: 10,
                transformOrigin: "left bottom",
                duration: dur,
                ease,
              },
              0
            );

            tl.to(
              [bar, text],
              {
                opacity: 1,
                x: 0,
                duration: dur,
                ease,
              },
              0
            );
          }
        }
      });

      tlRef.current = tl;
    },
    [
      active,
      count,
      expandRatio,
      duration,
      ease,
      vertical,
      tilt,
      parallax,
      grayscale,
      showLabels,
      stagger,
      prefersReduced,
      isMobile,
    ]
  );

  useEffect(() => {
    const el = rootRef.current;

    if (!el || count === 0) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();

      const total = vertical
        ? rect.height
        : rect.width;

      const usable = Math.max(
        total - gap * (count - 1),
        120
      );

      const size = Math.max(
        140,
        usable *
          Math.min(
            Math.max(expandRatio, 0.2),
            0.9
          ) *
          1.22
      );

      mediaSizeRef.current = size;

      el.style.setProperty(
        "--ag-media-size",
        `${size}px`
      );

      applyLayout(!firstRunRef.current);
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);

    return () => {
      ro.disconnect();
    };
  }, [
    applyLayout,
    gap,
    count,
    expandRatio,
    vertical,
  ]);

  useEffect(() => {
    applyLayout(!firstRunRef.current);
    firstRunRef.current = false;
  }, [applyLayout]);

  useEffect(() => {
    return () => {
      tlRef.current?.kill();
    };
  }, []);

  const handleEnter = (i: number) => {
    if (trigger === "hover") {
      setActive(i);
    }
  };

  const handleClick = (
    i: number,
    e: MouseEvent<HTMLElement>
  ) => {
    if (trigger === "click" && i !== active) {
      e.preventDefault();
      setActive(i);
    }
  };

  const handleKeyDown = (
    i: number,
    e: KeyboardEvent<HTMLElement>
  ) => {
    if (count === 0) return;

    if (
      e.key === "ArrowRight" ||
      e.key === "ArrowDown"
    ) {
      e.preventDefault();

      setActive(
        (i + 1) % count
      );
    } else if (
      e.key === "ArrowLeft" ||
      e.key === "ArrowUp"
    ) {
      e.preventDefault();

      setActive(
        (i - 1 + count) % count
      );
    }
  };

  if (count === 0) {
    return null;
  }

  return (
    <div
      ref={rootRef}
      className={[
        "accordion-gallery",
        vertical
          ? "accordion-gallery--vertical"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        {
          "--ag-accent": accentColor,
          "--ag-overlay": overlayColor,
          "--ag-text": textColor,
          "--ag-gap": `${gap}px`,
          "--ag-radius": `${radius}px`,
          height: vertical
            ? `${Math.round(height * 1.6)}px`
            : `${height}px`,
        } as CSSProperties
      }
      role="list"
      aria-label="Image accordion gallery"
    >
      {items.map((item, i) => {
        const isActive = i === active;

        const Tag = item.link
          ? "a"
          : "div";

        return (
          <Tag
            key={i}
            ref={(el: HTMLElement | null) => {
              panelRefs.current[i] = el;
            }}
            className={[
              "ag-panel",
              isActive
                ? "ag-panel--active"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={{
              borderRadius: `${radius}px`,
            }}
            {...(item.link
              ? { href: item.link }
              : {})}
            onClick={(e) =>
              handleClick(i, e)
            }
            onMouseEnter={() =>
              handleEnter(i)
            }
            onFocus={() =>
              setActive(i)
            }
            onKeyDown={(e) =>
              handleKeyDown(i, e)
            }
            role="listitem"
            tabIndex={0}
            aria-current={
              isActive ? "true" : undefined
            }
            aria-label={
              item.label || item.alt
            }
          >
            <span className="ag-panel__frame">
              <span
                className="ag-panel__media"
                ref={(el) => {
                  mediaRefs.current[i] = el;
                }}
              >
                <img
                  src={item.image}
                  alt={
                    item.alt ||
                    item.label ||
                    ""
                  }
                  draggable={false}
                />
              </span>

              <span
                className="ag-panel__overlay"
                aria-hidden="true"
              />
            </span>

            {showLabels && (
              <span
                className="ag-panel__label"
                aria-hidden="true"
                ref={(el) => {
                  labelRefs.current[i] = el;
                }}
              >
                <span
                  className="ag-panel__bar"
                  ref={(el) => {
                    barRefs.current[i] = el;
                  }}
                />

                <span
                  className="ag-panel__text"
                  ref={(el) => {
                    textRefs.current[i] = el;
                  }}
                >
                  {item.label}
                </span>
              </span>
            )}
          </Tag>
        );
      })}
    </div>
  );
};

export default AccordionGallery;