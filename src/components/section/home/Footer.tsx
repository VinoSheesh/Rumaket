export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm text-slate-500 sm:flex-row">
        <span>© {new Date().getFullYear()} Caretaker.</span>
        <span>Dibangun untuk keluarga &amp; perawat.</span>
      </div>
    </footer>
  );
}
