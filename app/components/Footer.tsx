import {NavLink} from 'react-router';

const FOOTER_NAV = [
  {
    title: 'Shop',
    links: [
      {label: 'All prints', to: '/collections/all'},
      {label: 'Shipping & returns', to: '/policies/shipping-policy'},
    ],
  },
  {
    title: 'Studio',
    links: [
      {label: 'About', to: '/studio'},
      {label: 'Contact', to: '/pages/contact'},
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="footer font-clash-grotesk mt-20">
      <div className="flex items-start justify-between gap-16 px-16 py-16">
        <div className="flex gap-24">
          {FOOTER_NAV.map((column) => (
            <nav
              key={column.title}
              className="flex flex-col gap-3"
              aria-label={column.title}
            >
              <p className="text-sm text-neutral-400">{column.title}</p>
              {column.links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  prefetch="intent"
                  className="link-underline w-fit text-base"
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          ))}
        </div>

        <Newsletter />
      </div>
    </footer>
  );
}

function Newsletter() {
  return (
    <div className="flex w-80 flex-col gap-3">
      <p className="text-sm">One letter per edition</p>
      <form className="footer-newsletter flex items-center gap-4">
        <label className="sr-only" htmlFor="footer-email">
          Email
        </label>
        <input
          className="footer-email text-base"
          id="footer-email"
          name="email"
          type="email"
          placeholder="Email"
          required
        />
        <button className="reset text-sm uppercase" type="submit">
          Join
        </button>
      </form>
      <p className="text-sm text-neutral-400">
        © {new Date().getFullYear()} Negatif Studio — Paris
      </p>
    </div>
  );
}
