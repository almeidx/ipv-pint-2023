import { useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import FormLabel from "react-bootstrap/FormLabel";
import FormSelect from "react-bootstrap/FormSelect";
import FormGroup from "react-bootstrap/FormGroup";
import Modal from "react-bootstrap/Modal";
import ProgressBar from "react-bootstrap/ProgressBar";
import { BsCalendarDate } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import { RiCloseFill, RiPencilLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import useSWR from "swr";
import { SearchBar } from "../../components/SearchBar.jsx";
import { Spinner } from "../../components/Spinner.jsx";
import { API_URL } from "../../utils/constants.js";
import { fetcher } from "../../utils/fetcher.js";
import { formatDate } from "../../utils/formatDate.js";
import { Toast } from "../../components/Toast.jsx";
import { useToast } from "../../contexts/ToastContext.jsx";
import { useUser } from "../../contexts/UserContext.jsx";

export default function Negocios() {
	const { user } = useUser();
	const [search, setSearch] = useState("");
	const [showEditModal, setShowEditModal] = useState(false);
	const [negocioData, setNegocioData] = useState(null);
	const { isLoading, data, mutate } = useSWR(`${API_URL}/negocios?admin`, fetcher);
	const { showToast, showToastWithMessage, toastMessage, toggleToast } = useToast();

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

	// TODO: Edit & Delete

	async function handleEdit(data) {
		try {
			await fetch(`${API_URL}/negocios/${negocioData.id}`, {
				credentials: "include",
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			showToastWithMessage("Negócio editado com sucesso");

			mutate();
		} catch (error) {
			console.error(error);

			showToastWithMessage("Ocorreu um erro ao editar o negócio");
		}
	}

	async function handleDelete(id) {
		try {
			const response = await fetch(`${API_URL}/negocios/${id}`, {
				credentials: "include",
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Something went wrong", { cause: response });
			}

			showToastWithMessage("Mensagem eliminada com sucesso");

			mutate();
		} catch (error) {
			console.error(error);

			showToastWithMessage("Ocorreu um erro ao eliminar a mensagem");
		}
	}

	return (
		<Container className="py-4">
			<Toast hide={() => toggleToast(false)} showToast={showToast} toastMessage={toastMessage} />

			<div className="d-flex justify-content-between mb-2">
				<h2>Negócios</h2>

				<Link to="/negocios">
					<IoMdAdd size={40} color="black" />
				</Link>
			</div>

			<EditNegocioModal
				show={showEditModal}
				onHide={() => setShowEditModal(false)}
				onSave={handleEdit}
				data={negocioData}
				user={user}
			/>

			<SearchBar placeholder="Pesquise por negócios..." onSearch={(value) => setSearch(value)} />

			<ListGroup>
				{isLoading ? (
					<Spinner />
				) : filtered.length ? (
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
												<span className="fw-bold">Responsável:</span>{" "}
												{funcionarioResponsavel
													? `${funcionarioResponsavel.name} (${funcionarioResponsavel.email})`
													: "Não associado"}
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

											{centroTrabalho ? (
												<ul className="mb-0 ms-5">
													<li>{centroTrabalho.name}</li>
													<li>{centroTrabalho.location}</li>
													<li>{centroTrabalho.postalCode}</li>
													<li>{centroTrabalho.address}</li>
												</ul>
											) : (
												<p className="mb-0">Não associado</p>
											)}
										</div>

										<div className="d-flex col-sm justify-content-end align-items-start gap-2 pt-2">
											<Button className="border-0 bg-transparent p-0 pe-2" onClick={() => {}}>
												<BsCalendarDate size={32} color="black" />
											</Button>

											<Button
												className="border-0 bg-transparent p-0"
												onClick={() => {
													setNegocioData({ id, centroTrabalho, funcionarioResponsavel, estados });
													setShowEditModal(true);
												}}
											>
												<RiPencilLine size={32} color="black" />
											</Button>

											<Button onClick={() => handleDelete(id)} className="border-0 bg-transparent p-0">
												<RiCloseFill size={32} color="red" />
											</Button>
										</div>
									</div>

									<p className="mb-0 mt-2" style={{ fontSize: "0.85rem" }}>
										{formatDate(new Date(createdAt))}
									</p>
								</div>
							</ListGroup.Item>
						),
					)
				) : (
					<p>{search ? "Não foi encontrado nenhum negócio" : "Não há nenhum negócio registado"}</p>
				)}
			</ListGroup>
		</Container>
	);
}

/**
 * @param {Object} props
 * @param {boolean} props.show
 * @param {Object} props.data
 * @param {() => void} props.onHide
 * @param {(data: Object) => void} props.onSave
 * @param {{ name: string; id: number }} props.user
 */
function EditNegocioModal({ data, show, onHide, onSave, user }) {
	const [negocioData, setNegocioData] = useState({});
	const { data: centrosDeTrabalho } = useSWR(`${API_URL}/centros-de-trabalho`, fetcher);

	function onHideWrapper() {
		onHide();
		setNegocioData({});
	}

	return (
		<Modal show={show} onHide={onHideWrapper} size="lg" aria-labelledby="manage-negocio-modal" centered>
			<Modal.Header closeButton>
				<Modal.Title id="manage-negocio-modal">Editar Negócio</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<FormGroup className="mb-3">
					<FormLabel htmlFor="centro-de-trabalho-edit">Centro de Trabalho</FormLabel>

					<FormSelect
						id="centro-de-trabalho-edit"
						value={negocioData.centroTrabalho?.id ?? data?.centroTrabalho?.id}
						onChange={(e) => setNegocioData((state) => ({ ...state, centroTrabalho: { id: e.target.value } }))}
					>
						{(centrosDeTrabalho ?? []).map(({ id, name }) => (
							<option key={id} value={id}>
								{name}
							</option>
						))}
					</FormSelect>
				</FormGroup>

				<FormGroup className="d-flex flex-column">
					<FormLabel className="text-black" htmlFor="content-edit">
						Funcionário Responsável
						{negocioData.funcionarioResponsavel ?? data?.funcionarioResponsavel ? (
							<>
								:{" "}
								<span className="fw-bold">
									{negocioData.funcionarioResponsavel?.name ?? data.funcionarioResponsavel.name}
								</span>
							</>
						) : null}
					</FormLabel>

					{negocioData.funcionarioResponsavel ?? data?.funcionarioResponsavel ? null : (
						<Button
							className="w-fit"
							onClick={() => {
								setNegocioData((state) => ({ ...state, funcionarioResponsavel: { id: user.id, name: user.name } }));
							}}
						>
							Associar
						</Button>
					)}
				</FormGroup>
			</Modal.Body>

			<Modal.Footer>
				<Button
					onClick={() => {
						onSave(negocioData);
						onHide();
						setNegocioData({});
					}}
					variant="success"
				>
					Guardar
				</Button>

				<Button onClick={onHideWrapper}>Cancelar</Button>
			</Modal.Footer>
		</Modal>
	);
}

const estadosNames = [
	{ color: "#ff000000", name: "Em espera" },
	{ color: "#ff000025", name: "A validar" },
	{ color: "#ff000050", name: "Em desenvolvimento" },
	{ color: "#ff000075", name: "A finalizar" },
	{ color: "#ff0000", name: "Finalizado" },
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
