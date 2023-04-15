import { Suspense, lazy, useEffect, useState } from "react";
import Nav from "react-bootstrap/Nav";
import { Footer } from "../components/Footer.jsx";
import { NavBar } from "../components/NavBar.jsx";
import { FaSpinner } from "react-icons/fa";

const Candidaturas = lazy(() => import("../components/dashboard/Candidaturas.jsx"));
const Ideias = lazy(() => import("../components/dashboard/Ideias.jsx"));
const Negocios = lazy(() => import("../components/dashboard/Negocios.jsx"));
const Vagas = lazy(() => import("../components/dashboard/Vagas.jsx"));
const Beneficios = lazy(() => import("../components/dashboard/Beneficios.jsx"));
const Reunioes = lazy(() => import("../components/dashboard/Reunioes.jsx"));
const Utilizadores = lazy(() => import("../components/dashboard/Utilizadores.jsx"));

const sections = ["Candidaturas", "Ideias", "Negócios", "Vagas", "Benefícios", "Reuniões", "Utilizadores"];

export function Admin() {
	const [section, setSection] = useState(sections[0]);

	useEffect(() => {
		const hash = window.location.hash;
		const sectionName = hash.slice(1);

		if (!sectionName || !isValidSection(sectionName)) {
			setSection(sections[0]);
		} else {
			setSection(sectionName);
		}
	}, []);

	return (
		<>
			<NavBar page="admin" />

			<main className="min-h-without-navbar d-flex" style={{ backgroundColor: "#c5cae9" }}>
				<div
					className="d-flex flex-column flex-shrink-0 p-3 text-white min-h-without-navbar"
					style={{ width: "18rem", backgroundColor: "#546beb" }}
				>
					<Nav className="nav-pills flex-column mb-auto">
						{sections.map((name, idx) => (
							<a
								href={"#" + name}
								key={name}
								className="mb-3 bg-transparent fw-bold text-white text-decoration-none pb-3"
								style={{ borderBottom: idx === sections.length - 1 ? "" : "1px solid lightgray" }}
							>
								{name}
							</a>
						))}
					</Nav>

					<hr />

					<div className="dropdown">
						<a
							href="#"
							className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
							id="dropdownUser1"
							data-bs-toggle="dropdown"
							aria-expanded="false"
						>
							<img src="https://github.com/mdo.png" alt="" width="32" height="32" className="rounded-circle me-2" />
							<strong>mdo</strong>
						</a>

						<ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
							<li>
								<a className="dropdown-item" href="#">
									New project...
								</a>
							</li>

							<li>
								<a className="dropdown-item" href="#">
									Settings
								</a>
							</li>

							<li>
								<a className="dropdown-item" href="#">
									Profile
								</a>
							</li>

							<li>
								<hr className="dropdown-divider" />
							</li>

							<li>
								<a className="dropdown-item" href="#">
									Sign out
								</a>
							</li>
						</ul>
					</div>
				</div>

				<Suspense
					fallback={
						<div className="min-h-screen-no-footer flex items-center justify-center">
							<FaSpinner className="h-auto w-60" />
						</div>
					}
				>
					{section === "Candidaturas" ? (
						<Candidaturas />
					) : section === "Ideias" ? (
						<Ideias />
					) : section === "Negócios" ? (
						<Negocios />
					) : section === "Vagas" ? (
						<Vagas />
					) : section === "Benefícios" ? (
						<Beneficios />
					) : section === "Reuniões" ? (
						<Reunioes />
					) : section === "Utilizadores" ? (
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
	return sections.includes(section);
}
