import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-playfair text-lg font-semibold">Contact</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="mailto:support@gyangita.com" className="text-sm hover:text-primary">
                  support@gyangita.com
                </a>
              </li>
              <li>
                <a href="tel:+919370922063" className="text-sm hover:text-primary">
                  +91 9370922063
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-playfair text-lg font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/browse">
                  <a className="text-sm hover:text-primary">Browse</a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="text-sm hover:text-primary">About Us</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-sm hover:text-primary">Contact Us</a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-playfair text-lg font-semibold">Credits</h3>
            <p className="mt-4 text-sm">
              API provided by{" "}
              <a
                href="https://github.com/vedicscriptures"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Pt. Prashant Tripathi & Team
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} GyanGita. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}