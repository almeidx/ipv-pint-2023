import { Suspense, lazy, useEffect, useState } from "react";
import Nav from "react-bootstrap/Nav";
import { useSearchParams } from "react-router-dom";
import { ErrorBase } from "../../components/ErrorBase.jsx";
import { Page } from "../../components/Page.jsx";
import { Spinner } from "../../components/Spinner.jsx";
import { useUser } from "../../contexts/UserContext.jsx";
import { isAdmin } from "../../utils/permissions.js";

const Beneficios = lazy(() => import("./beneficios.jsx"));
const Candidaturas = lazy(() => import("./candidaturas.jsx"));
const Ideias = lazy(() => import("./ideias.jsx"));
const Mensagens = lazy(() => import("./mensagens.jsx"));
const Negocios = lazy(() => import("./negocios.jsx"));
const Reunioes = lazy(() => import("./reunioes.jsx"));
const Utilizadores = lazy(() => import("./utilizadores.jsx"));
const Vagas = lazy(() => import("./vagas.jsx"));

const sections = [
	{ name: "Benefícios", link: "beneficios" },
	{ name: "Candidaturas", link: "candidaturas" },
	{ name: "Ideias", link: "ideias" },
	{ name: "Mensagens", link: "mensagens" },
	{ name: "Oportunidades", link: "negocios" },
	{ name: "Reuniões", link: "reunioes" },
	{ name: "Utilizadores", link: "utilizadores" },
	{ name: "Vagas", link: "vagas" },
];

export default function Admin() {
	const { user } = useUser();
	const [searchParams] = useSearchParams();
	const [section, setSection] = useState(sections[0].link);

	useEffect(() => {
		const paramSection = searchParams.get("p");
		if (paramSection && isValidSection(paramSection)) {
			setSection(paramSection);
		}
	}, []);

	if (!isAdmin(user)) {
		return <ErrorBase title="Não tem sessão iniciada ou não tem permissões de administrador" />;
	}

	return (
		<Page className="min-h-without-navbar d-flex bg-main">
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

			<div className="w-100" style={{ height: "calc(100vh - 5rem)", overflowY: "scroll" }}>
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
			</div>
		</Page>
	);
}

/**
 * @param {string} section
 */
function isValidSection(section) {
	return sections.some(({ link }) => link === section);
}
