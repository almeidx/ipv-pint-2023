import { Footer } from "./Footer.jsx";
import { NavBar } from "./NavBar.jsx";

/** @param {import("react").PropsWithChildren<{ className?: string; page?: string }>} props */
export function Page({ className = "min-h-without-navbar bg-main pb-5", children, page }) {
	return (
		<>
			<NavBar page={page} />

			<main className={className}>{children}</main>

			<Footer />
		</>
	);
}
