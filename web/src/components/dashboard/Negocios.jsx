import { useMemo, useState } from "react";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import ProgressBar from "react-bootstrap/ProgressBar";
import Tooltip from "react-bootstrap/Tooltip";
import { FaSpinner } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { RiCloseFill, RiPencilLine } from "react-icons/ri";
import useSWR from "swr";
import { API_URL } from "../../utils/constants.js";
import { fetcher } from "../../utils/fetcher.js";
import { SearchBar } from "../SearchBar.jsx";

export default function Beneficios() {
	const [search, setSearch] = useState("");
	const { isLoading, data } = useSWR(API_URL + "/negocios", fetcher);

	const filtered = useMemo(
		() =>
			(data ?? []).filter(
				({ title, description, criador, areaNegocio, cliente }) =>
					title.toLowerCase().includes(search.toLowerCase()) ||
					description.toLowerCase().includes(search.toLowerCase()) ||
					criador.name.toLowerCase().includes(search.toLowerCase()) ||
					areaNegocio.name.toLowerCase().includes(search.toLowerCase()) ||
					cliente.name.toLowerCase().includes(search.toLowerCase()),
			),
		[(data, search)],
	);

	const formatter = new Intl.DateTimeFormat("pt-PT", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",

		hour: "2-digit",
		minute: "2-digit",
	});

	return (
		<Container className="py-4">
			<div className="d-flex justify-content-between">
				<h2 className="mb-5">Negócios</h2>
				<IoMdAdd size={40} />
			</div>

			<SearchBar placeholder="Pesquise por negócios..." onSearch={(value) => setSearch(value)} />

			<ListGroup>
				{isLoading ? (
					<FaSpinner />
				) : (
					filtered.map(
						({
							id,
							description,
							title,
							cliente,
							areaNegocio,
							centroTrabalho,
							criador,
							funcionarioResponsavel,
							contactos,
							createdAt,
							estados,
						}) => (
							<ListGroup.Item className="d-flex  align-items-center" key={id}>
								<div className="col-12">
									<span className="fw-bold" style={{ fontSize: "1.2rem" }}>
										{id} - {title}: &nbsp;
									</span>

									{description}

									<Progresso estados={estados ?? []} />

									<div
										className="col-12 mt-2 "
										style={{
											display: "flex",
											justifyContent: "space-between",
											flexDirection: "row",
											position: "relative",
										}}
									>
										<div>
											<p className="mb-0">
												<span className="fw-bold">Cliente:</span>
												{cliente.name} - {areaNegocio.name}
											</p>

											<p className="mb-0">
												<span className="fw-bold">Criador:</span> {criador.name} ({criador.email})
											</p>
											<p className="mb-0">
												<span className="fw-bold">Responsável:</span> {funcionarioResponsavel.name} (
												{funcionarioResponsavel.email})
											</p>
											<span className="fw-bold">Contactos:</span>
											<ul className="mb-0">
												{contactos.map(({ idContacto, contacto }) => (
													<li key={idContacto}>
														<a
															style={{ color: "black", listStyle: "none" }}
															href={`${contacto.type === 0 ? "mailto" : "tel"}:${contacto.value}`}
														>
															{contacto.value}
														</a>
													</li>
												))}
											</ul>
										</div>

										<div
											className="mb-0"
											style={{
												minWidth: "20rem",
												position: "absolute",
												right: "30%",
											}}
										>
											<p className="mb-0">
												<span className="fw-bold">Centro de Trabalho:</span>
												<ul className="mb-0">
													<li>{centroTrabalho.name}</li>
													<li>{centroTrabalho.location}</li>
													<li>{centroTrabalho.postalCode}</li>
													<li>{centroTrabalho.address}</li>
												</ul>
											</p>
										</div>
										<div className="d-flex col-2	 gap-2 justify-content-center align-items-center">
											<RiPencilLine size={32} />
											<RiCloseFill size={32} />
										</div>
									</div>
									<p className="mb-0 mt-3" style={{ fontSize: "0.85rem" }}>
										{formatter.format(new Date(createdAt))}
									</p>
								</div>
							</ListGroup.Item>
						),
					)
				)}
			</ListGroup>
		</Container>
	);
}

const estadosNames = [
	{
		color: "#ff000000",
		name: "Em espera",
	},
	{
		color: "#ff000025",
		name: "A validar",
	},
	{
		color: "#ff000050",
		name: "Em desenvolvimento",
	},
	{
		color: "#ff000075",
		name: "A finalizar",
	},
	{
		color: "#ff0000",
		name: "Finalizado",
	},
];

function Progresso({ estados }) {
	const obj = new Map(estados.map((estado) => [estado.estado, estado.dataFinalizacao]));

	function hasState(estado) {
		if (!obj.size && estado === 1) return true;
		if (obj.has(estado)) return true;

		return false;
	}

	return (
		<ProgressBar style={{ height: "1.3rem", width: "100%" }}>
			{estadosNames.map(({ color, name }, index) => (
				<OverlayTrigger
					key={`overlay-${index}`}
					placement="top"
					overlay={
						<Tooltip id={`tooltip-${index}`}>
							{obj.get(index) ? new Date(obj.get(index)).toLocaleDateString() : new Date().toLocaleDateString()}
						</Tooltip>
					}
				>
					<ProgressBar
						style={{ backgroundColor: color, color: "black" }}
						now={hasState(index) ? 20 : 0}
						key={index}
						label={name}
					/>
				</OverlayTrigger>
			))}
		</ProgressBar>
	);
}
