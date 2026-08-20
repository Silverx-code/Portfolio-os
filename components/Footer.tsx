export default function Footer({
  github,
  linkedin,
  email,
}: {
  github?: string;
  linkedin?: string;
  email?: string;
}) {
  return (
    <footer className="border-t border-outline-variant mt-24">
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <span className="font-sans font-bold text-headline-md text-on-surface">Portfolio</span>
        <div className="flex items-center gap-6 font-sans text-body-base text-on-surface-variant">
          {github && (
            <a href={github} target="_blank" rel="noreferrer" className="hover:text-on-surface transition-colors">
              GitHub
            </a>
          )}
          {linkedin && (
            <a href={linkedin} target="_blank" rel="noreferrer" className="hover:text-on-surface transition-colors">
              LinkedIn
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`} className="hover:text-on-surface transition-colors">
              Email
            </a>
          )}
        </div>
        <span className="font-mono text-mono-label text-outline">
          © {new Date().getFullYear()} Portfolio OS. Engineered for performance.
        </span>
      </div>
    </footer>
  );
}
