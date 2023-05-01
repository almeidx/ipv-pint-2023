import { Suspense, lazy, useEffect, useState } from "react";
import Nav from "react-bootstrap/Nav";
import { FaSpinner } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import { Footer } from "../components/Footer.jsx";
import { NavBar } from "../components/NavBar.jsx";

const Candidaturas = lazy(() => import("../components/dashboard/Candidaturas.jsx"));
const Ideias = lazy(() => import("../components/dashboard/Ideias.jsx"));
const Negocios = lazy(() => import("../components/dashboard/Negocios.jsx"));
const Vagas = lazy(() => import("../components/dashboard/Vagas.jsx"));
const Beneficios = lazy(() => import("../components/dashboard/Beneficios.jsx"));
const Reunioes = lazy(() => import("../components/dashboard/Reunioes.jsx"));
const Utilizadores = lazy(() => import("../components/dashboard/Utilizadores.jsx"));

const sections = [
	{ name: "Candidaturas", link: "candidaturas" },
	{ name: "Ideias", link: "ideias" },
	{ name: "Negócios", link: "negocios" },
	{ name: "Vagas", link: "vagas" },
	{ name: "Benefícios", link: "beneficios" },
	{ name: "Reuniões", link: "reunioes" },
	{ name: "Utilizadores", link: "utilizadores" },
];

export function Admin() {
	const [searchParams] = useSearchParams();
	const [section, setSection] = useState(sections[0].link);

	useEffect(() => {
		const paramSection = searchParams.get("p");
		if (paramSection && isValidSection(paramSection)) {
			setSection(paramSection);
		}
	}, []);

	return (
		<>
			<NavBar />

			<main className="min-h-without-navbar d-flex" style={{ backgroundColor: "#c5cae9" }}>
				<div
					className="d-flex flex-column flex-shrink-0 p-3 text-white min-h-without-navbar"
					style={{ width: "18rem", backgroundColor: "#546beb" }}
				>
					<Nav className="nav-pills flex-column mb-auto">
						{sections.map(({ name, link }, idx) => (
							<button
								key={name}
								className="mb-3 bg-transparent fw-bold text-white text-decoration-none pb-3 border-top-0 border-start-0 border-end-0 text-start"
								style={{ borderBottom: idx === sections.length - 1 ? "none" : "1px solid lightgray" }}
								type="button"
								onClick={() => {
									history.pushState(null, null, `/admin?p=${link}`);
									setSection(link);
								}}
							>
								{name}
							</button>
						))}
					</Nav>
				</div>

				<Suspense
					fallback={
						<div className="min-h-screen-no-footer flex items-center justify-center">
							<FaSpinner className="h-auto w-60" />
						</div>
					}
				>
					{section === "candidaturas" ? (
						<Candidaturas />
					) : section === "ideias" ? (
						<Ideias />
					) : section === "negocios" ? (
						<Negocios />
					) : section === "vagas" ? (
						<Vagas />
					) : section === "beneficios" ? (
						<Beneficios />
					) : section === "reunioes" ? (
						<Reunioes />
					) : section === "utilizadores" ? (
						<Utilizadores />
					) : null}
				</Suspense>
			</main>

			<Footer />
		</>
	);
}

/**
 * @param {string} section
 */
function isValidSection(section) {
	return sections.some(({ link }) => link === section);
}
