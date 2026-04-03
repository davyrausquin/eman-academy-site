"use client";

import { useState, useEffect, useRef, type FormEvent, type ReactNode } from "react";

/* ═══════════════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════════════ */

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll(".fade-up").forEach((child) =>
            child.classList.add("visible")
          );
          observer.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useScrollReveal();
  return (
    <section id={id} ref={ref} className={className}>
      {children}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════ */

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="fade-up mb-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-accent sm:text-xs">
      {children}
    </p>
  );
}

function SectionHeadline({
  white,
  blue,
}: {
  white: string;
  blue: string;
}) {
  return (
    <h2 className="fade-up fade-up-delay-1 font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-wide">
      {white}{" "}
      <span className="text-accent">{blue}</span>
    </h2>
  );
}

/* ═══════════════════════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════════════════════ */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const links = [
    { label: "Over Sam", href: "#over-sam" },
    { label: "Training", href: "#waarom" },
    { label: "Prijzen", href: "#prijzen" },
    { label: "Rapport", href: "/rapport" },
    { label: "Aanmelden", href: "#aanmelden" },
  ];

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0a0a0a]/90 shadow-[0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:h-20 sm:px-8">
          <a
            href="#"
            className="font-display text-xl tracking-[0.2em] text-white sm:text-2xl"
          >
            EMAN ACADEMY
          </a>

          {/* Desktop */}
          <div className="hidden items-center gap-8 lg:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[13px] font-medium uppercase tracking-[0.15em] text-white/60 transition-colors duration-300 hover:text-white"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#aanmelden"
              className="glow-navy ml-2 bg-navy px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.15em] text-white transition-all"
            >
              Boek proeftraining
            </a>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-[5px] lg:hidden"
            aria-label="Menu"
          >
            <span
              className={`block h-[2px] w-5 bg-white transition-all duration-300 ${
                menuOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-5 bg-white transition-all duration-300 ${
                menuOpen ? "scale-x-0 opacity-0" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-5 bg-white transition-all duration-300 ${
                menuOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center bg-[#0a0a0a]/98 backdrop-blur-xl transition-all duration-500 lg:hidden ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        {links.map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setMenuOpen(false)}
            className="py-4 font-display text-3xl tracking-[0.15em] text-white/80 transition-colors hover:text-white"
            style={{
              transitionDelay: menuOpen ? `${i * 80}ms` : "0ms",
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.4s ease, transform 0.4s ease, color 0.3s",
            }}
          >
            {l.label}
          </a>
        ))}
        <a
          href="#aanmelden"
          onClick={() => setMenuOpen(false)}
          className="glow-navy mt-8 bg-navy px-8 py-3 text-[13px] font-bold uppercase tracking-[0.15em] text-white"
          style={{
            transitionDelay: menuOpen ? "320ms" : "0ms",
            opacity: menuOpen ? 1 : 0,
            transform: menuOpen ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
          }}
        >
          Gratis proeftraining
        </a>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════════════ */

function Hero() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const base = "transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)]";
  const show = visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8";

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      {/* Background photo */}
      <div className="absolute inset-0">
        <img
          src="/hero-bg.jpeg"
          alt=""
          loading="eager"
          className="h-full w-full object-cover object-center"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0a0a] via-navy/80 to-[#0a0a0a]/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-5 text-center">
        <p
          className={`${base} mb-6 text-[11px] font-semibold uppercase tracking-[0.4em] text-white/50 sm:text-xs ${show}`}
          style={{ transitionDelay: "200ms" }}
        >
          Elite Jeugdvoetbal · Den Haag
        </p>

        <h1
          className={`${base} font-display text-[clamp(3.2rem,10vw,8rem)] leading-[0.95] tracking-wide drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)] ${show}`}
          style={{ transitionDelay: "400ms" }}
        >
          Echte training
          <br />
          <span className="text-accent">voelt zo.</span>
        </h1>

        <p
          className={`${base} mx-auto mt-6 max-w-lg text-[12px] font-medium uppercase tracking-[0.35em] text-white/45 sm:text-[13px] ${show}`}
          style={{ transitionDelay: "600ms" }}
        >
          Elite voetbaltraining in Den Haag · Max 5 spelers · Eén missie
        </p>

        <div
          className={`${base} mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center ${show}`}
          style={{ transitionDelay: "800ms" }}
        >
          <a
            href="#aanmelden"
            className="bg-white px-10 py-4 text-[13px] font-bold uppercase tracking-[0.2em] text-navy transition-all duration-300 hover:bg-white/90 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            Boek een proeftraining
          </a>
          <a
            href="#prijzen"
            className="group border border-white/20 px-8 py-4 text-[13px] font-medium uppercase tracking-[0.2em] text-white/70 transition-all duration-300 hover:border-white/40 hover:text-white"
          >
            Bekijk aanbod{" "}
            <span className="inline-block transition-transform duration-300 group-hover:translate-y-0.5">
              ↓
            </span>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex animate-bounce flex-col items-center gap-2">
          <div className="h-9 w-[22px] rounded-full border-[1.5px] border-white/20">
            <div className="mx-auto mt-2 h-2.5 w-[2px] rounded-full bg-white/40" />
          </div>
        </div>
      </div>

      {/* Bottom gradient — smooth transition to content */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SOCIAL PROOF BAR
   ═══════════════════════════════════════════════════════════ */

function SocialProofBar() {
  return (
    <Section className="border-y border-white/[0.04] bg-gradient-to-r from-navy/5 via-navy/10 to-navy/5 py-5">
      <div className="fade-up mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-3 gap-y-2 px-5 text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-white/35 sm:gap-x-6 sm:text-[11px]">
        <span>Nationaal Team Aruba</span>
        <span className="text-accent/40">◆</span>
        <span>UEFA C Gediplomeerd</span>
        <span className="text-accent/40">◆</span>
        <span>Max 5 Spelers</span>
        <span className="text-accent/40">◆</span>
        <span>Jaarrond Training</span>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════
   OVER SAM
   ═══════════════════════════════════════════════════════════ */

function OverSam() {
  const kwalificaties = [
    "International Aruba",
    "UEFA C · UEFA B (2026)",
    "Fitness A",
    "Max 5 spelers per groep",
  ];

  const cv = [
    { label: "Speler", value: "Nationaal team Aruba · SVV Scheveningen · Spartaan \u201920" },
    { label: "Coach", value: "JO-13-1 SVV Scheveningen (hoofdklasse) · Spartaan \u201920" },
    { label: "Diploma\u2019s", value: "UEFA C (behaald) · UEFA B (verwacht 2026) · Fitness A" },
  ];

  return (
    <Section id="over-sam" className="px-5 py-20 sm:px-8 sm:py-28 md:py-36">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[50%_1fr] md:gap-16 lg:gap-20">
        {/* Photo */}
        <div className="fade-up">
          <div className="relative aspect-[3/4]">
            <img
              src="/Sameman.jpeg"
              alt="Sam Eman — Hoofdtrainer Eman Academy"
              loading="lazy"
              className="h-full w-full object-cover object-center scale-90"
              style={{
                maskImage: "radial-gradient(ellipse 75% 75% at center, black 40%, transparent 100%)",
                WebkitMaskImage: "radial-gradient(ellipse 75% 75% at center, black 40%, transparent 100%)",
              }}
            />
            {/* Name overlay */}
            <div className="absolute inset-x-0 bottom-[10%] text-center">
              <p className="font-display text-3xl tracking-wide text-white sm:text-4xl">
                Sam Eman
              </p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
                Hoofdtrainer
              </p>
            </div>
          </div>
          {/* Caption */}
          <p className="-mt-4 text-center text-[12px] italic text-white/25">
            Hij staat rechts. De ander is ook gezellig, maar jouw kind wil bij Sam trainen.
          </p>
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center">
          <SectionLabel>Over de coach</SectionLabel>
          <h2 className="fade-up fade-up-delay-1 font-display text-[clamp(1.8rem,4.5vw,3rem)] leading-[1.05] tracking-wide">
            De coach achter{" "}
            <span className="text-accent">Eman Academy.</span>
          </h2>

          {/* Persoonlijk verhaal */}
          <div className="mt-8 space-y-5 text-[15px] leading-[1.75] text-white/50">
            <p className="fade-up fade-up-delay-2">
              Een jochie van 6 op een stoffig veldje in Aruba. Geen schoenen,
              geen trainingsschema, geen coach die zegt wat je moet doen. Gewoon
              een bal en de straat. Elke dag. Uren. Tot het donker werd en zijn
              moeder hem naar binnen riep. Dat was het begin van Sam Eman.
            </p>
            <p className="fade-up fade-up-delay-2">
              Van die straat groeide hij naar het nationaal team van Aruba.
              Niet omdat iemand hem ontdekte. Omdat hij niet stopte. Die honger
              — beter worden, elke dag, ook als niemand kijkt — dat zit in alles
              wat Sam doet. Op het veld. In de gym. In het leven.
            </p>
            <p className="fade-up fade-up-delay-3">
              Twee jaar geleden liet hij alles achter en stapte op een vliegtuig
              naar Nederland. Nieuw land. Andere taal. Andere cultuur. Koud.
              Maar Sam past zich niet aan — hij brengt mee wat hij heeft. De
              rauwheid van het straatvoetbal. De intensiteit van Zuid-Amerika.
              De mentaliteit dat je doorgaat als je lichaam zegt dat het genoeg is.
            </p>
            <p className="fade-up fade-up-delay-3">
              Waarom hij coacht? Niet voor het geld. Sam coacht omdat hij
              ziet wat de meeste trainers missen. Een kind dat talent heeft maar
              verdwijnt in een groep van 18. Een speler die harder wil maar niet
              de ruimte krijgt. Bij Sam krijg je die ruimte. Maximaal 5 spelers.
              60 minuten. Alles eruit.
            </p>
          </div>

          <blockquote className="fade-up fade-up-delay-4 mt-8 border-l-2 border-accent/30 pl-5 text-[16px] font-medium italic leading-relaxed text-white/70">
            &ldquo;Na een training bij Sam zijn je benen kapot, je hoofd leeg, en je
            hart vol. Wie terugkomt, wil het écht.&rdquo;
          </blockquote>

          {/* Kwalificaties */}
          <div className="fade-up fade-up-delay-4 mt-10 border-t border-white/[0.06] pt-8">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.35em] text-white/25">
              Track record
            </p>
            <div className="space-y-3">
              {cv.map((item) => (
                <div key={item.label} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
                  <span className="shrink-0 text-[12px] font-bold uppercase tracking-[0.15em] text-accent/60 sm:w-24">
                    {item.label}
                  </span>
                  <span className="text-[13px] leading-relaxed text-white/40">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="fade-up fade-up-delay-4 mt-6 flex flex-wrap gap-2">
            {kwalificaties.map((b) => (
              <span
                key={b}
                className="border border-accent/20 bg-accent/5 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent/70"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════
   WAAROM EMAN ACADEMY
   ═══════════════════════════════════════════════════════════ */

function Waarom() {
  const cards = [
    {
      num: "01",
      title: "Kleine groepen",
      body: "Maximaal 5 spelers per sessie. Geen verloren kids in een groep van 15. Elke minuut aandacht voor jouw kind.",
    },
    {
      num: "02",
      title: "Zuid-Amerikaanse mentaliteit",
      body: "Rauw, intensief, mentaal. Voetbal is meer dan techniek. Sam brengt een intensiteit die je nergens anders vindt in Den Haag.",
    },
    {
      num: "03",
      title: "Jaarrond training",
      body: "Geen seizoensgebonden blokken. Consistent trainen = consistent groeien. 52 weken per jaar beschikbaar.",
    },
    {
      num: "04",
      title: "Pad naar hoger niveau",
      body: "Voor spelers met professionele ambities. Als jij het wil, halen wij het eruit. Met een netwerk richting ADO, Sparta en Feyenoord.",
    },
  ];

  return (
    <Section id="waarom" className="px-5 py-20 sm:px-8 sm:py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <SectionLabel>Waarom Eman Academy</SectionLabel>
          <SectionHeadline
            white="Dit is geen voetbalschool. Dit is een"
            blue="ontwikkelingsprogramma."
          />
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 sm:mt-16 lg:gap-5">
          {cards.map((c, i) => (
            <div
              key={c.num}
              className={`fade-up fade-up-delay-${i + 1} card-lift group border border-white/[0.06] bg-card p-7 sm:p-8 hover:border-accent/30`}
            >
              <span className="font-display text-3xl tracking-wider text-accent/20 transition-colors duration-300 group-hover:text-accent/40">
                {c.num}
              </span>
              <h3 className="mt-3 font-display text-[22px] tracking-wide text-white sm:text-2xl">
                {c.title}
              </h3>
              <p className="mt-3 text-[14px] leading-[1.7] text-white/40">
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════
   HOE WERKT HET
   ═══════════════════════════════════════════════════════════ */

function HoeWerktHet() {
  const steps = [
    {
      num: "1",
      title: "Meld je aan",
      desc: "Vul het formulier in of stuur een WhatsApp. Duurt 30 seconden.",
    },
    {
      num: "2",
      title: "Proeftraining",
      desc: "Jouw kind traint één sessie mee voor €14,99. Zonder verplichtingen.",
    },
    {
      num: "3",
      title: "Start met trainen",
      desc: "Kies een pakket en begin met structureel beter worden.",
    },
  ];

  return (
    <Section className="border-y border-white/[0.04] bg-card/50 px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <SectionLabel>Hoe werkt het</SectionLabel>
        <h2 className="fade-up fade-up-delay-1 font-display text-[clamp(1.6rem,4vw,2.5rem)] tracking-wide">
          In 3 stappen aan de slag
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-3 sm:gap-6">
          {steps.map((s, i) => (
            <div key={s.num} className={`fade-up fade-up-delay-${i + 1}`}>
              <div className="mx-auto flex h-14 w-14 items-center justify-center border border-accent/20 bg-accent/5 font-display text-2xl text-accent">
                {s.num}
              </div>
              <h3 className="mt-4 font-display text-lg tracking-wide">
                {s.title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-white/40">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════
   PRIJZEN
   ═══════════════════════════════════════════════════════════ */

function Prijzen() {
  const [extraOpen, setExtraOpen] = useState(false);
  const [voorwaardenOpen, setVoorwaardenOpen] = useState(false);

  return (
    <Section id="prijzen" className="px-5 py-20 sm:px-8 sm:py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <SectionLabel>Aanbod &amp; Prijzen</SectionLabel>
          <SectionHeadline
            white="Train met de beste."
            blue="Kies hoe."
          />
        </div>

        {/* Proeftraining banner */}
        <div className="fade-up fade-up-delay-1 mx-auto mt-12 max-w-2xl border border-accent/20 bg-gradient-to-r from-navy/15 via-card to-navy/15 p-5 text-center sm:mt-14 sm:p-6">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-5">
            <div>
              <p className="text-[14px] font-medium text-white/60">
                Kom een keer langs. Voel wat echte training is.
              </p>
              <p className="mt-1 font-display text-2xl tracking-wide">
                Proeftraining — <span className="text-accent">€14,99</span>
              </p>
            </div>
            <a
              href="#aanmelden"
              className="glow-navy shrink-0 bg-navy px-6 py-3 text-[12px] font-bold uppercase tracking-[0.2em] text-white transition-all"
            >
              Boek proeftraining
            </a>
          </div>
        </div>

        {/* 3 plan cards: Flex | Jaarplan | Privé */}
        <div className="mt-10 grid gap-5 sm:mt-12 md:grid-cols-3 md:items-start">

          {/* FLEX (links) */}
          <div className="fade-up fade-up-delay-1 order-2 flex flex-col border border-white/[0.06] bg-card p-7 sm:p-8 md:order-1">
            <h3 className="font-display text-[22px] tracking-wide sm:text-2xl">
              FLEX
            </h3>
            <div className="mt-4">
              <span className="font-display text-[48px] leading-none tracking-wide sm:text-[52px]">
                €125
              </span>
              <span className="ml-1 text-[13px] text-white/30">/mnd</span>
            </div>

            <ul className="mt-6 flex-1 space-y-3">
              <li className="flex items-start gap-2.5 text-[14px] text-white/50">
                <span className="mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center bg-accent/10 text-[9px] text-accent">✓</span>
                Wekelijkse groepstraining
              </li>
              <li className="flex items-start gap-2.5 text-[14px] text-white/50">
                <span className="mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center bg-accent/10 text-[9px] text-accent">✓</span>
                Max 5 spelers per groep
              </li>
              <li className="flex items-start gap-2.5 text-[14px] text-white/50">
                <span className="mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center bg-accent/10 text-[9px] text-accent">✓</span>
                60 minuten per sessie
              </li>
              <li className="flex items-start gap-2.5 text-[14px] text-white/50">
                <span className="mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center bg-accent/10 text-[9px] text-accent">✓</span>
                Geen contract — maandelijks opzegbaar
              </li>
            </ul>

            <a
              href="#aanmelden"
              className="mt-8 block border border-white/10 py-3.5 text-center text-[12px] font-bold uppercase tracking-[0.2em] text-white/60 transition-all duration-300 hover:border-white/25 hover:text-white"
            >
              Start vandaag
            </a>
          </div>

          {/* JAARPLAN (midden — de focuskaart) */}
          <div className="fade-up fade-up-delay-2 order-1 relative flex flex-col border border-accent/30 bg-gradient-to-b from-navy/20 via-card to-card p-7 shadow-[0_0_40px_rgba(26,58,107,0.15)] sm:p-8 md:order-2 md:-mt-4 md:pb-10">
            <span className="absolute -top-px left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent" />
            <span className="mb-4 w-fit bg-accent/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
              Meest gekozen
            </span>
            <h3 className="font-display text-[22px] tracking-wide sm:text-2xl">
              JAARPLAN
            </h3>
            <div className="mt-4">
              <span className="font-display text-[52px] leading-none tracking-wide sm:text-[58px]">
                €99
              </span>
              <span className="ml-1 text-[13px] text-white/30">/mnd</span>
            </div>

            <ul className="mt-6 space-y-3">
              <li className="flex items-start gap-2.5 text-[14px] text-white/50">
                <span className="mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center bg-accent/10 text-[9px] text-accent">✓</span>
                Wekelijkse groepstraining
              </li>
              <li className="flex items-start gap-2.5 text-[14px] text-white/50">
                <span className="mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center bg-accent/10 text-[9px] text-accent">✓</span>
                Max 5 spelers per groep
              </li>
              <li className="flex items-start gap-2.5 text-[14px] text-white/50">
                <span className="mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center bg-accent/10 text-[9px] text-accent">✓</span>
                60 minuten per sessie
              </li>
            </ul>

            {/* Gear pakket — de grote USP */}
            <div className="mt-5 border border-accent/15 bg-accent/5 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent/70">
                Inclusief gear pakket
              </p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                <span className="text-[13px] font-medium text-white/60">Trainingsshirt</span>
                <span className="text-[13px] font-medium text-white/60">Trainingsbroek</span>
                <span className="text-[13px] font-medium text-white/60">Bidon</span>
              </div>
            </div>

            <div className="flex-1" />

            <a
              href="#aanmelden"
              className="glow-navy mt-8 block bg-navy py-4 text-center text-[13px] font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-navy-light"
            >
              Start vandaag
            </a>
          </div>

          {/* PRIVÉ 1-OP-1 (rechts) */}
          <div className="fade-up fade-up-delay-3 order-3 flex flex-col border border-white/[0.06] bg-card p-7 sm:p-8 md:order-3">
            <h3 className="font-display text-[22px] tracking-wide sm:text-2xl">
              PRIVÉ 1-OP-1
            </h3>
            <div className="mt-4">
              <span className="font-display text-[48px] leading-none tracking-wide sm:text-[52px]">
                €49
              </span>
              <span className="ml-1 text-[13px] text-white/30">/sessie</span>
            </div>

            <ul className="mt-6 flex-1 space-y-3">
              <li className="flex items-start gap-2.5 text-[14px] text-white/50">
                <span className="mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center bg-accent/10 text-[9px] text-accent">✓</span>
                Sam helemaal voor jou alleen
              </li>
              <li className="flex items-start gap-2.5 text-[14px] text-white/50">
                <span className="mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center bg-accent/10 text-[9px] text-accent">✓</span>
                60 minuten, volledig op maat
              </li>
              <li className="flex items-start gap-2.5 text-[14px] text-white/50">
                <span className="mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center bg-accent/10 text-[9px] text-accent">✓</span>
                Plan wanneer het jou uitkomt
              </li>
              <li className="flex items-start gap-2.5 text-[14px] text-white/50">
                <span className="mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center bg-accent/10 text-[9px] text-accent">✓</span>
                Geen abonnement nodig
              </li>
            </ul>

            <a
              href="#aanmelden"
              className="mt-8 block border border-white/10 py-3.5 text-center text-[12px] font-bold uppercase tracking-[0.2em] text-white/60 transition-all duration-300 hover:border-white/25 hover:text-white"
            >
              Plan een sessie
            </a>
          </div>

        </div>

        {/* Meer dan 1x per week */}
        <div className="fade-up mt-8 sm:mt-10">
          <button
            onClick={() => setExtraOpen(!extraOpen)}
            className="mx-auto flex items-center gap-2 text-[13px] font-medium text-white/30 transition-colors hover:text-white/50"
          >
            <span>Meer dan 1x per week trainen?</span>
            <span
              className="inline-block text-[10px] transition-transform duration-300"
              style={{ transform: extraOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              ▼
            </span>
          </button>
          <div
            className="mx-auto max-w-lg overflow-hidden text-center transition-all duration-500"
            style={{
              maxHeight: extraOpen ? "80px" : "0px",
              opacity: extraOpen ? 1 : 0,
            }}
          >
            <p className="pt-3 text-[13px] leading-relaxed text-white/35">
              Abonnees kunnen extra sessies bijboeken voor €25/sessie,
              op basis van beschikbaarheid.
            </p>
          </div>
        </div>

        {/* Voorwaarden accordion */}
        <div className="mt-4">
          <button
            onClick={() => setVoorwaardenOpen(!voorwaardenOpen)}
            className="mx-auto flex items-center gap-2 text-[12px] text-white/20 transition-colors hover:text-white/35"
          >
            <span>Voorwaarden</span>
            <span
              className="inline-block text-[9px] transition-transform duration-300"
              style={{ transform: voorwaardenOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              ▼
            </span>
          </button>
          <div
            className="mx-auto max-w-2xl overflow-hidden transition-all duration-500"
            style={{
              maxHeight: voorwaardenOpen ? "300px" : "0px",
              opacity: voorwaardenOpen ? 1 : 0,
            }}
          >
            <div className="space-y-3 pt-4 text-[11px] leading-relaxed text-white/20">
              <p>
                <span className="font-semibold text-white/30">Jaarplan:</span>{" "}
                12 maanden contract, maandelijkse betaling. Gear wordt uitgereikt na maand 2.
                Na 12 maanden loopt het abonnement door als Flex (€125/mnd) tenzij een nieuw
                jaarcontract wordt afgesloten.
              </p>
              <p>
                <span className="font-semibold text-white/30">Flex:</span>{" "}
                Opzeggen vóór de 15e van de maand = stopt einde volgende maand.
                Trainingsshirt verplicht na eerste maand (€35, apart te bestellen).
              </p>
              <p>
                <span className="font-semibold text-white/30">Alle trainingen:</span>{" "}
                Onder voorbehoud van beschikbaarheid.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════
   TESTIMONIAL PLACEHOLDER
   ═══════════════════════════════════════════════════════════ */

function Testimonials() {
  return (
    <Section className="border-y border-white/[0.04] bg-gradient-to-r from-navy/5 via-navy/8 to-navy/5 px-5 py-20 sm:px-8 sm:py-24">
      <div className="fade-up mx-auto max-w-2xl text-center">
        <span className="font-display text-6xl leading-none text-accent/15">
          &ldquo;
        </span>
        <p className="mt-2 text-[17px] italic leading-relaxed text-white/50 sm:text-lg">
          Mijn zoon kwam thuis en zei: &lsquo;Papa, dít is hoe training moet
          voelen.&rsquo; Sindsdien vraagt hij elke week wanneer de volgende
          sessie is.
        </p>
        <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-white/25">
          — Vader van speler, Den Haag
        </p>
        <span className="mt-2 inline-block font-display text-6xl leading-none text-accent/15">
          &rdquo;
        </span>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════
   AANMELDEN
   ═══════════════════════════════════════════════════════════ */

function Aanmelden() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputClass =
    "w-full border border-white/[0.08] bg-card px-4 py-3.5 text-[14px] text-white placeholder:text-white/20 transition-all duration-300 focus:border-accent/50 focus:bg-card-alt focus:outline-none";

  return (
    <Section id="aanmelden" className="px-5 py-20 sm:px-8 sm:py-28 md:py-36">
      <div className="mx-auto max-w-xl">
        <div className="text-center">
          <SectionLabel>Aanmelden</SectionLabel>
          <h2 className="fade-up fade-up-delay-1 font-display text-[clamp(2rem,5vw,3.5rem)] tracking-wide">
            Klaar om te beginnen?
          </h2>
          <p className="fade-up fade-up-delay-2 mt-3 text-[14px] text-white/35">
            Vul het formulier in en Sam neemt binnen 24 uur contact op.
            <br className="hidden sm:block" />{" "}
            Proeftraining voor slechts €14,99.
          </p>
        </div>

        {submitted ? (
          <div className="fade-up visible mt-14 border border-accent/30 bg-accent/5 p-8 text-center sm:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center bg-accent/15 font-display text-2xl text-accent">
              ✓
            </div>
            <p className="mt-5 font-display text-2xl tracking-wide">
              Aanmelding ontvangen!
            </p>
            <p className="mt-2 text-[14px] text-white/40">
              Sam neemt binnen 24 uur contact op via WhatsApp.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="fade-up fade-up-delay-2 mt-14 space-y-3.5">
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Naam ouder / verzorger"
                required
                className={inputClass}
              />
              <input
                type="text"
                placeholder="Naam kind"
                required
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Leeftijd kind"
                required
                className={inputClass}
              />
              <input
                type="text"
                placeholder="Huidige club"
                className={inputClass}
              />
            </div>
            <input
              type="tel"
              placeholder="WhatsApp nummer"
              required
              className={inputClass}
            />
            <select
              required
              className={`${inputClass} appearance-none`}
              defaultValue=""
            >
              <option value="" disabled>
                Waar heb je interesse in?
              </option>
              <option value="jaarplan">Jaarplan — €99/maand</option>
              <option value="flex">Flex — €125/maand</option>
              <option value="prive">Privé 1-op-1 — €49/sessie</option>
              <option value="proeftraining">
                Proeftraining — €14,99
              </option>
            </select>
            <button
              type="submit"
              className="glow-navy w-full bg-navy py-4 text-[13px] font-bold uppercase tracking-[0.2em] text-white transition-all"
            >
              Stuur aanmelding
            </button>

            <p className="fade-up mt-2 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-accent/40">
              ⚡ Beperkt aantal plekken beschikbaar
            </p>
          </form>
        )}

        <div className="fade-up mt-10 text-center">
          <p className="text-[12px] uppercase tracking-[0.2em] text-white/20">
            Of stuur direct een bericht
          </p>
          <a
            href="https://wa.me/31600000000"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-[14px] font-semibold text-accent underline decoration-accent/30 underline-offset-4 transition-colors hover:text-white hover:decoration-white/30"
          >
            WhatsApp Sam →
          </a>
        </div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════ */

function Footer() {
  return (
    <footer className="border-t border-white/[0.04] px-5 pb-6 pt-14 sm:px-8 sm:pt-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-5 text-center">
          {/* Logo */}
          <div>
            <span className="font-display text-4xl tracking-[0.2em] text-accent/20">
              EA
            </span>
            <p className="mt-1 font-display text-lg tracking-[0.25em] text-white">
              EMAN ACADEMY
            </p>
          </div>
          <p className="text-[13px] italic text-white/25">
            Echte training voelt zo.
          </p>
          <p className="text-[11px] uppercase tracking-[0.25em] text-white/15">
            Den Haag, Nederland
          </p>
          <a
            href="https://instagram.com/emanacademy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/25 transition-colors hover:text-white/50"
          >
            @emanacademy
          </a>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/[0.04] pt-6 text-[10px] uppercase tracking-[0.2em] text-white/15 sm:flex-row">
          <span>© 2026 Eman Academy</span>
          <span>Een Catalina Group onderneming</span>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <SocialProofBar />
      <OverSam />
      <Waarom />
      <HoeWerktHet />
      <Prijzen />
      <Testimonials />
      <Aanmelden />
      <Footer />
    </>
  );
}
