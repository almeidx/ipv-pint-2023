import { useState } from "react";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import FormGroup from "react-bootstrap/FormGroup";
import FormLabel from "react-bootstrap/FormLabel";
import Modal from "react-bootstrap/Modal";
import { Multiselect } from "./Multiselect.jsx";

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {boolean} props.show
 * @param {() => void} props.onHide
 * @param {(data: Object) => void} props.onSave
 * @param {{ id: number; name: string }[]} props.utilizadores
 */
export function CreateReuniaoModal({ title, show, onHide, onSave, utilizadores }) {
	const [reuniaoData, setReuniaoData] = useState({});

	function onHideWrapper() {
		onHide();
		setReuniaoData({});
	}

	return (
		<Modal show={show} onHide={onHideWrapper} size="lg" aria-labelledby="manage-reuniao-modal" centered>
			<Modal.Header closeButton>
				<Modal.Title id="manage-reuniao-modal">{title}</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<FormGroup className="mb-3">
					<FormLabel className="text-black" htmlFor="title-edit">
						Titulo
					</FormLabel>
					<FormControl
						id="title-edit"
						placeholder="Título da reunião"
						value={reuniaoData.title}
						onChange={(e) => setReuniaoData((state) => ({ ...state, title: e.target.value }))}
						required
						max={100}
					/>
				</FormGroup>

				<FormGroup className="mb-3">
					<FormLabel className="text-black" htmlFor="description-edit">
						Descrição
					</FormLabel>
					<FormControl
						id="description-edit"
						placeholder="Descrição da reunião"
						value={reuniaoData.description}
						as="textarea"
						onChange={(e) => setReuniaoData((state) => ({ ...state, description: e.target.value }))}
						required
						max={1000}
					/>
				</FormGroup>

				<FormGroup className="mb-3">
					<FormLabel className="text-black" htmlFor="subject-edit">
						Assunto
					</FormLabel>
					<FormControl
						id="subject-edit"
						placeholder="Assunto da reunião"
						value={reuniaoData.subject}
						onChange={(e) => setReuniaoData((state) => ({ ...state, subject: e.target.value }))}
						required
						max={100}
					/>
				</FormGroup>

				<FormGroup className="mb-3">
					<FormLabel className="text-black" htmlFor="participants-edit">
						Participantes
					</FormLabel>
					<Multiselect
						options={(utilizadores ?? []).map(({ id, name }) => ({ label: name, value: id }))}
						onSelectOption={(utilizadores) => setReuniaoData((state) => ({ ...state, utilizadores }))}
					/>
				</FormGroup>

				<FormGroup className="mb-3">
					<FormLabel className="text-black" htmlFor="startTime-edit">
						Data de início
					</FormLabel>
					<FormControl
						id="startTime-edit"
						placeholder="Data de início da reunião"
						value={reuniaoData.startTime}
						onChange={(e) => setReuniaoData((state) => ({ ...state, startTime: e.target.value }))}
						required
						type="datetime-local"
						style={{ maxWidth: "18rem" }}
					/>
				</FormGroup>

				<FormGroup className="mb-3">
					<FormLabel className="text-black" htmlFor="duration-edit">
						Duração (em minutos)
					</FormLabel>
					<FormControl
						id="duration-edit"
						placeholder="Duração da reunião (em minutos)"
						value={reuniaoData.duration}
						onChange={(e) => setReuniaoData((state) => ({ ...state, duration: e.target.value }))}
						required
						type="number"
						min={1}
						style={{ maxWidth: "18rem" }}
					/>
				</FormGroup>
			</Modal.Body>

			<Modal.Footer>
				<Button
					onClick={() => {
						onSave(reuniaoData);
						onHide();
						setReuniaoData({});
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
