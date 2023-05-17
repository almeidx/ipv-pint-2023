import { useMemo, useState } from "react";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";
import { IoMdAdd } from "react-icons/io";
import { RiCloseFill, RiPencilLine } from "react-icons/ri";
import useSWR from "swr";
import { SearchBar } from "../../components/SearchBar.jsx";
import { Spinner } from "../../components/Spinner.jsx";
import { API_URL } from "../../utils/constants.js";
import { fetcher } from "../../utils/fetcher.js";

export default function Vagas() {
	const [search, setSearch] = useState("");
	const { isLoading, data } = useSWR(`${API_URL}/vagas?admin`, fetcher);

	const filtered = useMemo(
		() =>
			(data ?? []).filter(
				({ title, description }) =>
					title.toLowerCase().includes(search.toLowerCase()) ||
					description.toLowerCase().includes(search.toLowerCase()),
			),
		[data, search],
	);

	return (
		<Container className="py-4">
			<div className="d-flex justify-content-between mb-2">
				<h2>Vagas</h2>
				<IoMdAdd size={40} />
			</div>

			<SearchBar placeholder="Pesquise por vagas..." onSearch={(value) => setSearch(value)} />

			<ListGroup>
				{isLoading ? (
					<Spinner />
				) : filtered.length ? (
					filtered.map(({ id, title, description, status, icon, public: public_, amountSlots }) => (
						<ListGroup.Item className="d-flex justify-content-between align-items-center" key={`vaga-${id}`}>
							<div className="d-flex gap-2">
								<img src={icon} height="64" width="64" className="me-1" />

								<div>
									<span className="fw-bold text-wrap" style={{ fontSize: "1.1rem" }}>
										{id} - {title}
									</span>

									<p className="mb-0">{description || "Descrição"}</p>

									<p className="mb-0" style={{ fontSize: "0.85rem" }}>
										{statusToText(status)} - {public_ ? "Publica" : "Só para colaboradores"} - {amountSlots} vagas
									</p>
								</div>
							</div>

							<div className="d-flex justify-content-center align-items-center gap-2">
								<RiPencilLine size={32} />
								<RiCloseFill size={40} color="red" />
							</div>
						</ListGroup.Item>
					))
				) : (
					<p>{search ? "Não foi encontrada nenhuma vaga" : "Não há nenhuma vaga registada"}</p>
				)}
			</ListGroup>
		</Container>
	);
}

function CreateOrEditVagaModal({ show, onHide, data, onSave, isCreate }) {
	const [vagaData, setVagaData] = useState({});

	return (
		<Modal show={show} onHide={onHide} size="lg" aria-labelledby="manage-vaga-modal" centered>
			<Modal.Header closeButton>
				<Modal.Title id="manage-vaga-modal">{isCreate ? "Criar Vaga" : "Editar Vaga"}</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<FormGroup className="mb-3">
					<FormLabel className="text-black" htmlFor="title-edit">
						Titulo
					</FormLabel>
					<FormControl
						id="title-edit"
						placeholder="Título da vaga"
						value={vagaData.title ?? data?.title}
						onChange={(e) => setVagaData((state) => ({ ...state, title: e.target.value }))}
						required={isCreate}
					/>
				</FormGroup>

				<FormGroup className="mb-3">
					<FormLabel className="text-black" htmlFor="description-edit">
						Descrição
					</FormLabel>
					<FormControl
						id="description-edit"
						placeholder="Descrição da vaga"
						onChange={(e) => setVagaData((state) => ({ ...state, description: e.target.value }))}
						value={vagaData.description ?? data?.description}
						required={isCreate}
					/>
				</FormGroup>

				<FormGroup className="mb-3">
					<FormLabel className="text-black" htmlFor="icone-vaga-edit">
						Ícone
					</FormLabel>
					<FormControl
						id="icone-vaga-edit"
						placeholder="Ícone da vaga"
						onChange={(e) => setVagaData((state) => ({ ...state, icon: e.target.value }))}
						value={vagaData.icon ?? data?.icon}
						required={isCreate}
					/>
				</FormGroup>
			</Modal.Body>

			{/* missing amountSlots, public, status */}

			<Modal.Footer>
				<Button
					onClick={() => {
						onSave(vagaData);
						onHide();
					}}
					variant="success"
				>
					Guardar
				</Button>

				<Button onClick={onHide}>Cancelar</Button>
			</Modal.Footer>
		</Modal>
	);
}

/** @param {number} status */
function statusToText(status) {
	switch (status) {
		case 0:
			return "Aberta";
		case 1:
			return "Fechada";
		default:
			return "Desconhecido";
	}
}
