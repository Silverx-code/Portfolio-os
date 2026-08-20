import Link from "next/link";

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-outline-variant bg-background/80 backdrop-blur-xl">
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-4 flex items-center justify-between">
        <Link href="/" className="font-sans font-bold text-headline-md text-on-surface">
          Portfolio
        </Link>
        <div className="hidden md:flex items-center gap-8 font-sans text-body-base text-on-surface-variant">
          <Link href="/#projects" className="hover:text-on-surface transition-colors">
            Projects
          </Link>
          <Link href="/#about" className="hover:text-on-surface transition-colors">
            About
          </Link>
          <Link href="/#contact" className="hover:text-on-surface transition-colors">
            Contact
          </Link>
        </div>
        <Link href="/#contact" className="btn-primary !py-2 !px-4">
          Hire Me
        </Link>
      </div>
    </nav>
  );
}
