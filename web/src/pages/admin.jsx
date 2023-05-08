import { Suspense, lazy, useEffect, useState } from "react";
import Nav from "react-bootstrap/Nav";
import { useSearchParams } from "react-router-dom";
import { Footer } from "../components/Footer.jsx";
import { NavBar } from "../components/NavBar.jsx";
import { Spinner } from "../components/Spinner.jsx";
import Mensagens from "../components/dashboard/Mensagens.jsx";

const Candidaturas = lazy(() => import("../components/dashboard/Candidaturas.jsx"));
const Ideias = lazy(() => import("../components/dashboard/Ideias.jsx"));
const Negocios = lazy(() => import("../components/dashboard/Negocios.jsx"));
const Vagas = lazy(() => import("../components/dashboard/Vagas.jsx"));
const Beneficios = lazy(() => import("../components/dashboard/Beneficios.jsx"));
const Reunioes = lazy(() => import("../components/dashboard/Reunioes.jsx"));
const Utilizadores = lazy(() => import("../components/dashboard/Utilizadores.jsx"));

const sections = [
	{ name: "Benefícios", link: "beneficios" },
	{ name: "Candidaturas", link: "candidaturas" },
	{ name: "Ideias", link: "ideias" },
	{ name: "Mensagens", link: "mensagens" },
	{ name: "Negócios", link: "negocios" },
	{ name: "Reuniões", link: "reunioes" },
	{ name: "Utilizadores", link: "utilizadores" },
	{ name: "Vagas", link: "vagas" },
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

			<main className="min-h-without-navbar d-flex bg-main">
				<div
					className="d-flex flex-column min-h-without-navbar flex-shrink-0 p-3 text-white"
					style={{ width: "18rem", backgroundColor: "#546beb" }}
				>
					<Nav className="nav-pills flex-column mb-auto">
						{sections.map(({ name, link }, idx) => (
							<button
								key={name}
								className="fw-bold text-decoration-none border-top-0 border-start-0 border-end-0 mb-3 bg-transparent pb-3 text-start text-white"
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
						<div className="min-h-screen-no-footer flex items-center justify-center p-5">
							<Spinner />
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
					) : section === "mensagens" ? (
						<Mensagens />
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
