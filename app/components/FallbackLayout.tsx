interface FallbackLayoutProps {
  title: string;
  message: string;
}

export function FallbackLayout({title, message}: FallbackLayoutProps) {
  return (
    <main className="min-h-dvh grid place-items-center p-8 text-center">
      <div>
        <h1 className="font-serif font-normal text-6xl mb-2 text-green">{title}</h1>
        <p className="text-ink-soft m-0">{message}</p>
      </div>
    </main>
  );
}
