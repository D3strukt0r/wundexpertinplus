interface FallbackLayoutProps {
  title: string;
  message: string;
  // Dev-only error stack. The root ErrorBoundary only populates this under
  // `import.meta.env.DEV`, so production renders nothing here.
  stack?: string;
}

export function FallbackLayout({title, message, stack}: FallbackLayoutProps) {
  return (
    <main className="min-h-dvh grid place-items-center p-8 text-center">
      <div className="w-full max-w-3xl">
        <h1 className="font-serif text-6xl mb-2 text-primary">{title}</h1>
        <p className="text-muted-foreground m-0">{message}</p>
        {stack !== undefined && (
          <pre className="mt-6 max-h-96 w-full overflow-auto rounded-md border border-border bg-muted p-4 text-left text-sm text-muted-foreground">
            <code>{stack}</code>
          </pre>
        )}
      </div>
    </main>
  );
}
