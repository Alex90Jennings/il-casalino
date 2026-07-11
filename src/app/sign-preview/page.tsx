import Image from "next/image";

/* Temporary preview route — outdoor sign mockup + measurement guide for the
   sign maker. Screenshot on desktop. Not linked anywhere.

   Scale: 32px = 1cm. Real sign is 30cm × 21cm. */
const CM = 32;
const W = 30 * CM; // 960  — 30 cm wide
const H = 21 * CM; // 672  — 21 cm high
const INSET = 2 * CM; // 64 — pin centres 2 cm from every edge
const PIN_D = 1 * CM; // 32 — Ø 1 cm support pins
const PAGE_BG = "#e9e6e1";

export default function SignPreviewPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center gap-20 bg-[#e9e6e1] py-20">
      {/* 1 — clean visual mockup */}
      <section className="flex flex-col items-center gap-5">
        <SectionLabel>Visual mockup</SectionLabel>
        <div className="relative" style={{ width: W, height: H }}>
          <Sign />
        </div>
      </section>

      {/* 2 — measurement / technical guide */}
      <section className="flex flex-col items-center gap-6">
        <SectionLabel>Measurement guide — centimetres</SectionLabel>
        <div className="px-44 pt-24 pb-28">
          <div className="relative" style={{ width: W, height: H }}>
            <Sign />
            <Guides />
          </div>
        </div>
        <p className="font-sans text-sm tracking-[0.08em] text-charcoal/70">
          Overall 30 × 21 cm · four Ø 1 cm support pins · pin centres inset 2 cm
          from every edge (26 cm × 17 cm apart)
        </p>
      </section>
    </main>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="font-sans text-[11px] uppercase tracking-[0.3em] text-stone">
      {children}
    </p>
  );
}

function Sign() {
  return (
    <div className="relative flex h-full w-full flex-col items-center rounded-2xl bg-white px-16 py-16 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.25)] ring-1 ring-black/5">
      {/* Ø 1 cm support pins — centres 2 cm from each edge */}
      <Pin cx={INSET} cy={INSET} />
      <Pin cx={W - INSET} cy={INSET} />
      <Pin cx={INSET} cy={H - INSET} />
      <Pin cx={W - INSET} cy={H - INSET} />

      {/* Top breathing space */}
      <div className="flex-[1.2]" />

      {/* Title */}
      <h1 className="font-serif text-[3.8rem] font-semibold uppercase leading-[1.05] tracking-[0.05em] text-charcoal whitespace-nowrap">
        Il Casino Casalino
      </h1>
      <p className="mt-3 font-serif text-[3.8rem] font-semibold uppercase leading-[1.05] tracking-[0.05em] text-charcoal">
        B&amp;B
      </p>

      {/* Logo */}
      <Image
        src="/logo.png"
        alt="Il Casino Casalino"
        width={150}
        height={150}
        className="mt-7 opacity-80"
        priority
      />

      {/* CIN pill */}
      <div className="mt-10 rounded-full border-4 border-stone/50 px-9 py-3">
        <span className="text-3xl font-semibold uppercase tracking-[0.22em] text-stone">
          CIN&nbsp;&nbsp;IT074008B400126364
        </span>
      </div>

      {/* Bottom split row */}
      <div className="mt-10 grid w-full grid-cols-2 gap-8 border-t-4 border-stone/25 pt-9">
        <div className="flex items-center justify-center gap-3 text-center">
          <GlobeIcon className="h-7 w-7 shrink-0 text-stone" />
          <span className="font-serif text-3xl font-semibold tracking-[0.04em] text-charcoal">
            www.ilcasinocasalino.com
          </span>
        </div>
        <div className="flex items-center justify-center gap-3 text-center">
          <PhoneIcon className="h-7 w-7 shrink-0 translate-y-[5px] text-stone" />
          <span className="font-serif text-3xl font-semibold tracking-[0.04em] text-charcoal">
            +39 327 775 5170
          </span>
        </div>
      </div>
    </div>
  );
}

function Pin({ cx, cy }: { cx: number; cy: number }) {
  return (
    <span
      className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-stone/40 shadow-inner ring-1 ring-stone/50"
      style={{ left: cx, top: cy, width: PIN_D, height: PIN_D }}
    />
  );
}

/* Technical dimension overlay — only rendered on the measurement guide. */
function Guides() {
  return (
    <>
      {/* dashed rectangle through the four pin centres (26 × 17 cm) */}
      <div
        className="absolute border border-dashed border-stone/50"
        style={{
          left: INSET,
          top: INSET,
          width: W - 2 * INSET,
          height: H - 2 * INSET,
        }}
      />

      {/* extension lines from the pin centres out to the 26 / 17 cm dimensions */}
      <Dash v style={{ left: INSET, top: H - INSET, height: 54 }} />
      <Dash v style={{ left: W - INSET, top: H - INSET, height: 54 }} />
      <Dash h style={{ left: W - INSET, top: INSET, width: 54 }} />
      <Dash h style={{ left: W - INSET, top: H - INSET, width: 54 }} />

      {/* overall size */}
      <HDim x={0} y={-54} w={W} label="30 cm" />
      <VDim x={-54} y={0} h={H} label="21 cm" />

      {/* pin-centre spans */}
      <HDim x={INSET} y={H + 54} w={W - 2 * INSET} label="26 cm" labelBelow />
      <VDim x={W + 54} y={INSET} h={H - 2 * INSET} label="17 cm" labelRight />

      {/* 2 cm pin-centre inset (representative, applies to every edge) */}
      <HDim x={0} y={-22} w={INSET} label="2 cm" labelBelow />
      <VDim x={-22} y={0} h={INSET} label="2 cm" labelRight />

      {/* Ø 1 cm pin diameter callout on the top-left pin */}
      <HDim x={INSET - PIN_D / 2} y={INSET} w={PIN_D} label="Ø 1 cm" />
    </>
  );
}

function Dash({
  v = false,
  h = false,
  style,
}: {
  v?: boolean;
  h?: boolean;
  style: React.CSSProperties;
}) {
  return (
    <div
      className={`absolute border-stone/40 ${v ? "border-l border-dashed" : ""} ${
        h ? "border-t border-dashed" : ""
      }`}
      style={style}
    />
  );
}

function HDim({
  x,
  y,
  w,
  label,
  labelBelow = false,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  labelBelow?: boolean;
}) {
  const labelPos = labelBelow ? { top: 6 } : { bottom: 6 };
  return (
    <div className="absolute flex items-center" style={{ left: x, top: y, width: w }}>
      <span className="absolute left-0 top-1/2 h-2.5 w-px -translate-y-1/2 bg-charcoal/50" />
      <span className="w-full border-t border-charcoal/50" />
      <span className="absolute right-0 top-1/2 h-2.5 w-px -translate-y-1/2 bg-charcoal/50" />
      <span
        className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 font-sans text-[13px] tracking-[0.18em] text-charcoal/80"
        style={{ backgroundColor: PAGE_BG, ...labelPos }}
      >
        {label}
      </span>
    </div>
  );
}

function VDim({
  x,
  y,
  h,
  label,
  labelRight = false,
}: {
  x: number;
  y: number;
  h: number;
  label: string;
  labelRight?: boolean;
}) {
  const labelPos = labelRight ? { left: 10 } : { right: 10 };
  return (
    <div
      className="absolute flex flex-col items-center"
      style={{ left: x, top: y, height: h }}
    >
      <span className="absolute top-0 left-1/2 h-px w-2.5 -translate-x-1/2 bg-charcoal/50" />
      <span className="h-full border-l border-charcoal/50" />
      <span className="absolute bottom-0 left-1/2 h-px w-2.5 -translate-x-1/2 bg-charcoal/50" />
      <span
        className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap px-1.5 font-sans text-[13px] tracking-[0.18em] text-charcoal/80"
        style={{ backgroundColor: PAGE_BG, ...labelPos }}
      >
        {label}
      </span>
    </div>
  );
}

function GlobeIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3Z" />
    </svg>
  );
}

function PhoneIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6.6 3.5 8.9 3.9a1 1 0 0 1 .8.7l1 3.3a1 1 0 0 1-.3 1L8.7 10.5a13 13 0 0 0 4.8 4.8l1.6-1.7a1 1 0 0 1 1-.3l3.3 1a1 1 0 0 1 .7.8l.4 2.3a1 1 0 0 1-1 1.2A15.5 15.5 0 0 1 5.3 4.5a1 1 0 0 1 1.3-1Z" />
    </svg>
  );
}
