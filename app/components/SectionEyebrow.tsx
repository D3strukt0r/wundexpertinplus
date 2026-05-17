import type {ReactNode} from 'react';

interface Props {
  children: ReactNode;
}

// Small uppercase tag that introduces each section ("02 — LEISTUNGEN").
export function SectionEyebrow({children}: Props) {
  return (
    <div className="text-xs tracking-eyebrow-widest uppercase text-green font-semibold mb-4.5">
      {children}
    </div>
  );
}
