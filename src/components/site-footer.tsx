export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-8 font-mono text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
        <span>
          appsec<span className="text-primary">/</span>kb — conteúdo educacional
        </span>
        <span>100% estático · sem rastreamento · sem cookies</span>
      </div>
    </footer>
  );
}
