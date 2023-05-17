import { useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import FormGroup from "react-bootstrap/FormGroup";
import FormLabel from "react-bootstrap/FormLabel";
import FormControl from "react-bootstrap/FormControl";
import Modal from "react-bootstrap/Modal";
import { IoMdAdd } from "react-icons/io";
import { RiCloseFill, RiPencilLine } from "react-icons/ri";
import useSWR from "swr";
import { SearchBar } from "../../components/SearchBar.jsx";
import { Spinner } from "../../components/Spinner.jsx";
import { API_URL } from "../../utils/constants.js";
import { fetcher } from "../../utils/fetcher.js";
import { formatDate } from "../../utils/formatDate.js";

export default function Beneficios() {
	const [search, setSearch] = useState("");
	const [showEditModal, setShowEditModal] = useState(false);
	const { isLoading, data } = useSWR(`${API_URL}/beneficios?admin`, fetcher);
	const [vagaData, setVagaData] = useState(null);

	const filtered = useMemo(
		() =>
			(data ?? []).filter(
				({ content, shortContent, utilizador }) =>
					content.toLowerCase().includes(search.toLowerCase()) ||
					shortContent.toLowerCase().includes(search.toLowerCase()) ||
					utilizador.name.toLowerCase().includes(search.toLowerCase()),
			),
		[data, search],
	);

	async function handleSave() {}

	return (
		<Container className="py-4">
			<div className="d-flex justify-content-between mb-2">
				<h2>Benefícios</h2>
				<IoMdAdd size={40} />
			</div>

			<EditBeneficioModal
				show={showEditModal}
				onHide={() => setShowEditModal(false)}
				data={vagaData}
				onSave={handleSave}
			/>

			<SearchBar placeholder="Pesquise por benefícios..." onSearch={(value) => setSearch(value)} />

			<ListGroup>
				{isLoading ? (
					<Spinner />
				) : (
					filtered.map(({ id, dataValidade, content, shortContent, iconeBeneficio, utilizador }) => (
						<ListGroup.Item className="d-flex justify-content-between align-items-center" key={id}>
							<div className="d-flex gap-2">
								<img src={iconeBeneficio} height="65" width="65" className="me-2" />

								<div>
									<span className="fw-bold" style={{ fontSize: "1.1rem" }}>
										{id} - {shortContent}
									</span>

									<p className="mb-0">{content}</p>

									<p className="mb-0" style={{ fontSize: "0.85rem" }}>
										Valido até: {formatDate(new Date(dataValidade))} - Criado por: {utilizador.name} ({utilizador.id})
									</p>
								</div>
							</div>

							<div className="d-flex justify-content-center align-items-center gap-2">
								<Button
									className="border-0 bg-transparent p-0"
									onClick={() => {
										setVagaData({ id, dataValidade, content, shortContent, iconeBeneficio });
										setShowEditModal(true);
									}}
								>
									<RiPencilLine size={32} color="black" />
								</Button>

								<Button className="border-0 bg-transparent p-0">
									<RiCloseFill size={32} color="red" />
								</Button>
							</div>
						</ListGroup.Item>
					))
				)}
			</ListGroup>
		</Container>
	);
}

function EditBeneficioModal({ data, show, onHide, onSave }) {
	const [vagaData, setVagaData] = useState({});

	return (
		<Modal show={show} onHide={onHide} size="lg" aria-labelledby="edit-beneficio-modal" centered>
			<Modal.Header closeButton>
				<Modal.Title id="edit-beneficio-modal">Editar Beneficio</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<FormGroup className="mb-3">
					<FormLabel className="text-black" htmlFor="short-content-edit">
						Titulo
					</FormLabel>
					<FormControl
						id="short-content-edit"
						placeholder="Conteúdo curto"
						value={vagaData.shortContent ?? data?.shortContent}
						onChange={(e) => setVagaData((state) => ({ ...state, shortContent: e.target.value }))}
					/>
				</FormGroup>

				<FormGroup className="mb-3">
					<FormLabel className="text-black" htmlFor="content-edit">
						Conteúdo
					</FormLabel>
					<FormControl
						id="content-edit"
						placeholder="Conteúdo"
						onChange={(e) => setVagaData((state) => ({ ...state, content: e.target.value }))}
						value={vagaData.content ?? data?.content}
					/>
				</FormGroup>

				<FormGroup className="mb-3">
					<FormLabel className="text-black" htmlFor="data-validade-edit">
						Data de validade
					</FormLabel>
					<FormControl
						id="data-validade-edit"
						placeholder="Data de validade"
						onChange={(e) => setVagaData((state) => ({ ...state, dataValidade: e.target.value }))}
						value={vagaData.dataValidade ?? data?.dataValidade}
						type="date"
					/>
				</FormGroup>

				<FormGroup className="mb-3">
					<FormLabel className="text-black" htmlFor="icone-beneficio-edit">
						Ícone
					</FormLabel>
					<FormControl
						id="icone-beneficio-edit"
						placeholder="Ícone do benefício"
						onChange={(e) => setVagaData((state) => ({ ...state, iconeBeneficio: e.target.value }))}
						value={vagaData.iconeBeneficio ?? data?.iconeBeneficio}
					/>
				</FormGroup>
			</Modal.Body>

			<Modal.Footer>
				<Button onClick={() => onSave()} variant="success">
					Guardar
				</Button>

				<Button onClick={onHide}>Cancelar</Button>
			</Modal.Footer>
		</Modal>
	);
}
