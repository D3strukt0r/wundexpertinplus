import type {ReactNode} from 'react';

interface Props {
  children: ReactNode;
}

// Display heading shared by every desktop-style section (Leistungen, Ueber).
// `<em>` inside renders italic + green for the emphasised phrase.
export function SectionTitle({children}: Props) {
  return (
    <h2 className="font-serif font-normal text-4xl md:text-6xl leading-none tracking-normal m-0 [&_em]:italic [&_em]:text-green">
      {children}
    </h2>
  );
}
