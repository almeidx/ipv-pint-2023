import "../styles/Home.css";

import { NavBar } from "../components/NavBar.jsx";
import { Footer } from "../components/Footer.jsx";

export function Home() {
  return (
    <>
      <NavBar page="/" />

      <main className="min-h-without-navbar">abc</main>

      <Footer />
    </>
  );
}
