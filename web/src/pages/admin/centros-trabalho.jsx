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

const createCentroTrabalhoSchema = object().shape({
	name: string()
		.required("O nome é obrigatório")
		.min(3, "O nome tem de ter pelo menos 3 caracteres")
		.max(100, "O nome não pode ter mais de 100 caracteres"),
	location: string()
		.required("A localização é obrigatória")
		.min(3, "A localização tem de ter pelo menos 3 caracteres")
		.max(100, "A localização não pode ter mais de 100 caracteres"),
	postalCode: string()
		.required("O código postal é obrigatório")
		.matches(/^\d{4}-\d{3}?$/, "O código postal tem de estar no formato 0000-000"),
	address: string()
		.required("A morada é obrigatória")
		.min(3, "A morada tem de ter pelo menos 3 caracteres")
		.max(100, "A morada não pode ter mais de 100 caracteres"),
});

export default function CentrosTrabalho() {
	const { isLoading, mutate, data, error } = useSWR(`${API_URL}/centros-de-trabalho`, fetcher);
	const { showToast, showToastWithMessage, toastMessage, hide, toastType } = useToast();
	const [showCreateModal, setShowCreateModal] = useState(false);

	if (error) {
		return <AdminPageError error={error} />;
	}

	/** @param {{ name: string }} data */
	async function handleCreate(data) {
		try {
			const response = await fetch(`${API_URL}/centros-de-trabalho`, {
				credentials: "include",
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error("Something went wrong", { cause: response });
			}

			showToastWithMessage("Centro de Trabalho criado com sucesso");

			mutate();
		} catch (error) {
			console.error(error);

			showToastWithMessage("Ocorreu um erro ao criar o centro de trabalho", "error");
		}
	}

	/** @param {number} id */
	async function handleDelete(id) {
		try {
			const response = await fetch(`${API_URL}/centros-de-trabalho/${id}`, {
				credentials: "include",
				method: "DELETE",
			});

			if (!response.ok) {
				if (response.status === 403) {
					showToastWithMessage(
						"Esse centro de trabalho tem negócios associados, portanto não pode ser apagada",
						"error",
					);
					return;
				}

				throw new Error("Something went wrong", { cause: response });
			}

			showToastWithMessage("Centro de Trabalho eliminado com sucesso");

			mutate();
		} catch (error) {
			console.error(error);

			showToastWithMessage("Ocorreu um erro ao eliminar o centro de trabalho", "error");
		}
	}

	return (
		<Container className="py-4">
			<Toast hide={hide} show={showToast} message={toastMessage} type={toastType} />

			<CreateCentroTrabalhoModal
				show={showCreateModal}
				onHide={() => setShowCreateModal(false)}
				onSubmit={handleCreate}
			/>

			<div className="d-flex justify-content-between mb-2">
				<h2>Centros de Trabalho</h2>

				<Button className="border-0 bg-transparent p-0" onClick={() => setShowCreateModal(true)}>
					<IoMdAdd size={40} color="black" />
				</Button>
			</div>

			<ListGroup>
				{isLoading ? (
					<Spinner />
				) : (
					(data ?? []).map(({ id, name, location, postalCode, address }) => (
						<ListGroup.Item className="d-flex justify-content-between align-items-center" key={`area-${id}`}>
							<div>
								<span className="fw-bold text-wrap" style={{ fontSize: "1.1rem" }}>
									{name}
								</span>

								<p className="mb-0">{address}</p>

								<p className="mb-0">
									{location}, {postalCode}
								</p>

								<p className="mb-0" style={{ fontSize: "0.8rem" }}>
									ID: {id}
								</p>
							</div>

							<div className="d-flex justify-content-center align-items-center gap-2">
								<OverlayTrigger placement="top" overlay={<Tooltip>Apagar Centro</Tooltip>}>
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
function CreateCentroTrabalhoModal({ show, onHide, onSubmit }) {
	return (
		<Modal show={show} onHide={onHide} size="lg" aria-labelledby="criar-centro-trabalho-modal" centered>
			<Modal.Header closeButton>
				<Modal.Title id="criar-centro-trabalho-modal">Criar Centro de Trabalho</Modal.Title>
			</Modal.Header>

			<Formik validationSchema={createCentroTrabalhoSchema} initialValues={{ name: "" }} onSubmit={onSubmit}>
				{({ handleSubmit, handleChange, handleBlur, values, touched, errors }) => (
					<Form className="mb-3" onSubmit={handleSubmit} noValidate>
						<Modal.Body>
							<Form.Group className="mb-3">
								<Form.Label className="text-black" htmlFor="name">
									Nome
								</Form.Label>
								<Form.Control
									id="name"
									placeholder="Nome do centro de trabalho"
									value={values.name}
									onChange={handleChange}
									onBlur={handleBlur}
									isInvalid={touched.name && errors.name}
								/>
								<Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Label className="text-black" htmlFor="location">
									Localização
								</Form.Label>
								<Form.Control
									id="location"
									placeholder="Localização do centro de trabalho"
									value={values.location}
									onChange={handleChange}
									onBlur={handleBlur}
									isInvalid={touched.location && errors.location}
								/>
								<Form.Control.Feedback type="invalid">{errors.location}</Form.Control.Feedback>
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Label className="text-black" htmlFor="address">
									Morada
								</Form.Label>
								<Form.Control
									id="address"
									placeholder="Morada do centro de trabalho"
									value={values.address}
									onChange={handleChange}
									onBlur={handleBlur}
									isInvalid={touched.address && errors.address}
								/>
								<Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Label className="text-black" htmlFor="postalCode">
									Código Postal
								</Form.Label>
								<Form.Control
									id="postalCode"
									placeholder="Código Postal do centro de trabalho"
									value={values.postalCode}
									onChange={handleChange}
									onBlur={handleBlur}
									isInvalid={touched.postalCode && errors.postalCode}
								/>
								<Form.Control.Feedback type="invalid">{errors.postalCode}</Form.Control.Feedback>
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
