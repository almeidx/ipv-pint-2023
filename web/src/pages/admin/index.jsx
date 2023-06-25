import { Suspense, lazy, useEffect, useState } from "react";
import Nav from "react-bootstrap/Nav";
import { useSearchParams } from "react-router-dom";
import { ErrorBase } from "../../components/ErrorBase.jsx";
import { Page } from "../../components/Page.jsx";
import { useUser } from "../../contexts/UserContext.jsx";
import { TipoUtilizadorEnum } from "../../utils/TipoUtilizadorEnum.js";
import { hasPermission, isColaborador } from "../../utils/permissions.js";

const AreasNegocio = lazy(() => import("./areas-negocio.jsx"));
const Beneficios = lazy(() => import("./beneficios.jsx"));
const Candidaturas = lazy(() => import("./candidaturas.jsx"));
const CentroTrabalho = lazy(() => import("./centros-trabalho.jsx"));
const Ideias = lazy(() => import("./ideias.jsx"));
const Mensagens = lazy(() => import("./mensagens.jsx"));
const Negocios = lazy(() => import("./negocios.jsx"));
const Reunioes = lazy(() => import("./reunioes.jsx"));
const TiposProjeto = lazy(() => import("./tipos-projeto.jsx"));
const Utilizadores = lazy(() => import("./utilizadores.jsx"));
const Vagas = lazy(() => import("./vagas.jsx"));

const sections = [
	{ name: "Áreas de Negócio", link: "areas-negocio", permission: TipoUtilizadorEnum.GestorNegocios },
	{ name: "Benefícios", link: "beneficios", permission: TipoUtilizadorEnum.GestorConteudos },
	{ name: "Candidaturas", link: "candidaturas", permission: TipoUtilizadorEnum.GestorRecursosHumanos },
	{ name: "Centros de Trabalho", link: "centros-trabalho", permission: TipoUtilizadorEnum.Administrador },
	{ name: "Ideias", link: "ideias", permission: TipoUtilizadorEnum.GestorIdeias },
	{ name: "Mensagens", link: "mensagens", permission: TipoUtilizadorEnum.GestorConteudos },
	{ name: "Oportunidades", link: "oportunidades", permission: TipoUtilizadorEnum.GestorNegocios },
	{
		name: "Reuniões",
		link: "reunioes",
		permission: [TipoUtilizadorEnum.GestorNegocios, TipoUtilizadorEnum.GestorRecursosHumanos],
	},
	{ name: "Tipos de Projeto", link: "tipos-projeto", permission: TipoUtilizadorEnum.GestorNegocios },
	{ name: "Utilizadores", link: "utilizadores", permission: TipoUtilizadorEnum.Administrador },
	{ name: "Vagas", link: "vagas", permission: TipoUtilizadorEnum.GestorRecursosHumanos },
];

export default function Admin() {
	const { user } = useUser();
	const [searchParams] = useSearchParams();
	const [section, setSection] = useState(sections[0].link);

	useEffect(() => {
		if (user) {
			const paramSection = searchParams.get("p");
			if (paramSection && isValidSection(paramSection) && hasPermission(user, paramSection)) {
				setSection(paramSection);
				return;
			}

			const section = sections.find(({ permission }) => hasPermission(user, permission));
			if (section) {
				history.pushState(null, null, `/admin?p=${section.link}`);
				setSection(section.link);
			}
		}
	}, [user]);

	if (!isColaborador(user)) {
		return <ErrorBase title="Não tem sessão iniciada ou não tem permissões de administrador" />;
	}

	return (
		<Page className="min-h-without-navbar d-flex bg-main">
			<div
				className="d-flex flex-column min-h-without-navbar flex-shrink-0 p-3 text-white"
				style={{ width: "18rem", backgroundColor: "#546beb" }}
			>
				<Nav className="nav-pills flex-column mb-auto">
					{sections.map(({ name, link, permission }, idx) =>
						hasPermission(user, permission) ? (
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
						) : null,
					)}
				</Nav>
			</div>

			<div className="w-100" style={{ height: "calc(100vh - 5rem)", overflowY: "scroll" }}>
				<Suspense fallback={<div className="min-h-screen-no-footer flex items-center justify-center p-5"> </div>}>
					{section === "areas-negocio" ? (
						<AreasNegocio />
					) : section === "beneficios" ? (
						<Beneficios />
					) : section === "candidaturas" ? (
						<Candidaturas />
					) : section === "centros-trabalho" ? (
						<CentroTrabalho />
					) : section === "ideias" ? (
						<Ideias />
					) : section === "mensagens" ? (
						<Mensagens />
					) : section === "oportunidades" ? (
						<Negocios />
					) : section === "reunioes" ? (
						<Reunioes />
					) : section === "tipos-projeto" ? (
						<TiposProjeto />
					) : section === "utilizadores" ? (
						<Utilizadores />
					) : section === "vagas" ? (
						<Vagas />
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
