const footerLinks = ["TERMS", "PRIVACY", "SUPPORT", "CONTACT"];

export default function VideoPageFooter() {
  return (
    <footer className="mt-auto border-t-4 border-slate-900 bg-white p-8">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-black font-bubbly tracking-wide text-comic-red brand-text">
            NadaSaku
          </span>
          <span className="text-sm font-bold text-slate-500">
            © 2024 NADASAKU STREAMING.
          </span>
        </div>

        <nav className="flex gap-8">
          {footerLinks.map((link) => (
            <a key={link} className="font-bold hover:text-comic-red transition-colors" href="#">
              {link}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
