import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionReveal({
  children,
  className = "",
}: SectionRevealProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const elements = section.querySelectorAll(
      "[data-reveal]"
    );

    const ctx = gsap.context(() => {
      gsap.fromTo(
        elements,
        {
          opacity: 0,
          y: 80,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.12,
          ease: "power4.out",

          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            end: "top 30%",
            toggleActions:
              "play none none reverse",
          },
        }
      );
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className={className}
    >
      {children}
    </div>
  );
}