import { BiTrash } from "@react-icons/all-files/bi/BiTrash";
import { IoMdAdd } from "@react-icons/all-files/io/IoMdAdd";
import { Formik } from "formik";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import useSWR from "swr";
import { object, string } from "yup";
import { AdminPageError } from "../../components/AdminPageError.jsx";
import { Spinner } from "../../components/Spinner.jsx";
import { Toast } from "../../components/Toast.jsx";
import { useToast } from "../../contexts/ToastContext.jsx";
import { API_URL } from "../../utils/constants.js";
import { fetcher } from "../../utils/fetcher.js";
import { formikButtonDisabled } from "../../utils/formikButtonDisabled.js";

const createAreaNegocioSchema = object().shape({
	name: string()
		.required("Campo obrigatório")
		.min(3, "O nome da área de negócio deve ter pelo menos 3 caracteres")
		.max(64, "O nome da área de negócio deve ter no máximo 64 caracteres"),
});

export default function AreasNegocio() {
	const { isLoading, mutate, data, error } = useSWR(`${API_URL}/areas-de-negocio`, fetcher);
	const { showToast, showToastWithMessage, toastMessage, hide, toastType } = useToast();
	const [showCreateModal, setShowCreateModal] = useState(false);

	if (error) {
		return <AdminPageError error={error} />;
	}

	/** @param {{ name: string }} data */
	async function handleCreate(data) {
		try {
			const response = await fetch(`${API_URL}/areas-de-negocio`, {
				credentials: "include",
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error("Something went wrong", { cause: response });
			}

			showToastWithMessage("Área de negócio criada com sucesso");

			mutate();
		} catch (error) {
			console.error(error);

			showToastWithMessage("Ocorreu um erro ao criar a área de negócio", "error");
		}
	}

	/** @param {number} id */
	async function handleDelete(id) {
		try {
			const response = await fetch(`${API_URL}/areas-de-negocio/${id}`, {
				credentials: "include",
				method: "DELETE",
			});

			if (!response.ok) {
				if (response.status === 403) {
					showToastWithMessage("Essa área de negócio tem negócios associados, portanto não pode ser apagada", "error");
					return;
				}

				throw new Error("Something went wrong", { cause: response });
			}

			showToastWithMessage("Área de negócio eliminada com sucesso");

			mutate();
		} catch (error) {
			console.error(error);

			showToastWithMessage("Ocorreu um erro ao eliminar a área de negócio", "error");
		}
	}

	return (
		<Container className="py-4">
			<Toast hide={hide} show={showToast} message={toastMessage} type={toastType} />

			<CreateAreaNegocioModal show={showCreateModal} onHide={() => setShowCreateModal(false)} onSubmit={handleCreate} />

			<div className="d-flex justify-content-between mb-2">
				<h2>Áreas de Negócio</h2>

				<Button className="border-0 bg-transparent p-0" onClick={() => setShowCreateModal(true)}>
					<IoMdAdd size={40} color="black" />
				</Button>
			</div>

			<ListGroup>
				{isLoading ? (
					<Spinner />
				) : (
					(data ?? []).map(({ id, name }) => (
						<ListGroup.Item className="d-flex justify-content-between align-items-center" key={`area-${id}`}>
							<div>
								<span className="fw-bold text-wrap" style={{ fontSize: "1.1rem" }}>
									{name}
								</span>

								<p className="mb-0" style={{ fontSize: "0.8rem" }}>
									ID: {id}
								</p>
							</div>

							<div className="d-flex justify-content-center align-items-center gap-2">
								<OverlayTrigger placement="top" overlay={<Tooltip>Apagar Área</Tooltip>}>
									<Button onClick={() => handleDelete(id)} className="border-0 bg-transparent p-0">
										<BiTrash size={32} color="red" />
									</Button>
								</OverlayTrigger>
							</div>
						</ListGroup.Item>
					))
				)}
			</ListGroup>
		</Container>
	);
}

/**
 * @param {Object} props
 * @param {boolean} props.show
 * @param {() => void} props.onHide
 * @param {(data: { name: string }) => void} props.onSubmit
 */
function CreateAreaNegocioModal({ show, onHide, onSubmit }) {
	return (
		<Modal show={show} onHide={onHide} size="lg" aria-labelledby="criar-area-negocio-modal" centered>
			<Modal.Header closeButton>
				<Modal.Title id="criar-area-negocio-modal">Criar Área de Negócio</Modal.Title>
			</Modal.Header>

			<Formik validationSchema={createAreaNegocioSchema} initialValues={{ name: "" }} onSubmit={onSubmit}>
				{({ handleSubmit, handleChange, handleBlur, values, touched, errors }) => (
					<Form className="mb-3" onSubmit={handleSubmit} noValidate>
						<Modal.Body>
							<Form.Group className="mb-3">
								<Form.Label className="text-black" htmlFor="name">
									Nome
								</Form.Label>
								<Form.Control
									id="name"
									placeholder="Nome da área de negócio"
									value={values.name}
									onChange={handleChange}
									onBlur={handleBlur}
									isInvalid={touched.name && errors.name}
								/>
								<Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
							</Form.Group>
						</Modal.Body>

						<Modal.Footer>
							<Button
								onClick={() => {
									handleSubmit();
									onHide();
								}}
								variant="success"
								disabled={formikButtonDisabled(errors, touched)}
							>
								Guardar
							</Button>

							<Button onClick={onHide}>Cancelar</Button>
						</Modal.Footer>
					</Form>
				)}
			</Formik>
		</Modal>
	);
}
