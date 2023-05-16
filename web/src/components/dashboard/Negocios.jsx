import { useMemo, useState } from "react";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import ProgressBar from "react-bootstrap/ProgressBar";
import { IoMdAdd } from "react-icons/io";
import { RiCloseFill, RiPencilLine } from "react-icons/ri";
import useSWR from "swr";
import { API_URL } from "../../utils/constants.js";
import { fetcher } from "../../utils/fetcher.js";
import { formatDate } from "../../utils/formatDate.js";
import { SearchBar } from "../SearchBar.jsx";
import { Spinner } from "../Spinner.jsx";

export default function Beneficios() {
	const [search, setSearch] = useState("");
	const { isLoading, data } = useSWR(`${API_URL}/negocios?admin`, fetcher);

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
		[data, search],
	);

	return (
		<Container className="py-4">
			<div className="d-flex justify-content-between mb-2">
				<h2>Negócios</h2>
				<IoMdAdd size={40} />
			</div>

			<SearchBar placeholder="Pesquise por negócios..." onSearch={(value) => setSearch(value)} />

			<ListGroup>
				{isLoading ? (
					<Spinner />
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
							<ListGroup.Item className="d-flex align-items-center" key={id}>
								<div className="col-12">
									<div className="d-flex align-items-center mb-2">
										<span className="fw-bold" style={{ fontSize: "1.2rem" }}>
											{id} - {title}: &nbsp;
										</span>

										{description}
									</div>

									<Progresso estados={estados ?? []} />

									<div className="row align-self-center mt-2">
										<div className="col-sm">
											<p className="mb-0">
												<span className="fw-bold">Cliente:</span> {cliente.name}
											</p>

											<p className="mb-0">
												<span className="fw-bold">Area:</span> {areaNegocio.name}
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
													<li key={`${id}-contacto-${idContacto}`}>
														<a
															className="text-black"
															href={`${contacto.type === 0 ? "mailto" : "tel"}:${contacto.value}`}
														>
															{contacto.value}
														</a>
													</li>
												))}
											</ul>
										</div>

										<div className="col-sm mb-0">
											<span className="fw-bold ms-5">Centro de Trabalho associado:</span>

											<ul className="mb-0 ms-5">
												<li>{centroTrabalho.name}</li>
												<li>{centroTrabalho.location}</li>
												<li>{centroTrabalho.postalCode}</li>
												<li>{centroTrabalho.address}</li>
											</ul>
										</div>

										<div className="d-flex col-sm justify-content-end align-items-top gap-2">
											<RiPencilLine size={32} />
											<RiCloseFill size={32} color="red" />
										</div>
									</div>

									<p className="mb-0 mt-2" style={{ fontSize: "0.85rem" }}>
										{formatDate(new Date(createdAt))}
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
		<ProgressBar className="w-100" style={{ height: "1.3rem" }}>
			{estadosNames.map(({ color, name }, index) => (
				// <OverlayTrigger
				// 	key={`overlay-${index}`}
				// 	placement="top"
				// 	overlay={
				// 		<Tooltip id={`tooltip-${index}`}>
				// 			{obj.get(index) ? new Date(obj.get(index)).toLocaleDateString() : new Date().toLocaleDateString()}
				// 		</Tooltip>
				// 	}
				// >
				<ProgressBar
					className="text-black"
					style={{ backgroundColor: color }}
					now={hasState(index) ? 20 : 0}
					key={index}
					label={name}
				/>
				// </OverlayTrigger>
			))}
		</ProgressBar>
	);
}
