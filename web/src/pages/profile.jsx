import { AiFillEye } from "@react-icons/all-files/ai/AiFillEye";
import { AiFillEyeInvisible } from "@react-icons/all-files/ai/AiFillEyeInvisible";
import { BsTrash } from "@react-icons/all-files/bs/BsTrash";
import { MdOutlineLogout } from "@react-icons/all-files/md/MdOutlineLogout";
import { MdOutlinePersonOutline } from "@react-icons/all-files/md/MdOutlinePersonOutline";
import { Formik } from "formik";
import { startTransition, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import FormLabel from "react-bootstrap/FormLabel";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import { object, ref, string } from "yup";
import { ConfirmModal } from "../components/ConfirmModal.jsx";
import { Page } from "../components/Page.jsx";
import { Toast } from "../components/Toast.jsx";
import { useToast } from "../contexts/ToastContext.jsx";
import { useUser } from "../contexts/UserContext.jsx";
import { API_URL } from "../utils/constants.js";
import { formikButtonDisabled } from "../utils/formikButtonDisabled.js";

const changePasswordFormSchema = object().shape({
	passwordAtual: string().required("Password é obrigatória"),
	newPassword: string()
		.required("Password é obrigatória")
		.min(12, "Password deve ter pelo menos 12 caracteres")
		.max(128, "Password deve ter no máximo 128 caracteres")
		.matches(/[a-z]/, "Password deve ter pelo menos uma letra minúscula")
		.matches(/[A-Z]/, "Password deve ter pelo menos uma letra maiúscula")
		.matches(/[0-9]/, "Password deve ter pelo menos um número")
		.matches(/[^a-zA-Z0-9]/, "Password deve ter pelo menos um caracter especial")
		.notOneOf([ref("passwordAtual")], "Nova password deve ser diferente da atual"),
	confirmNewPassword: string()
		.required("Password é obrigatória")
		.oneOf([ref("newPassword")], "Passwords não coincidem"),
});

export default function Profile() {
	const { user, setUser } = useUser();
	const [name, setName] = useState(user?.name ?? "");
	const [email, setEmail] = useState(user?.email ?? "");
	const [showCvEditModal, setShowCvEditModal] = useState(false);
	const [showSaveButton, setShowSaveButton] = useState(false);
	const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [showDisableConfirmModal, setShowDisableConfirmModal] = useState(false);
	const { showToast, showToastWithMessage, toastMessage, hide } = useToast();

	const disabledEditing = user?.registrationType !== "email";

	useEffect(() => {
		setName(user?.name ?? "");
		setEmail(user?.email ?? "");
		setShowSaveButton(false);
	}, [user]);

	async function handleProfileValueChange(type, value) {
		switch (type) {
			case "name":
				setName(value);
				startTransition(() => setShowSaveButton(value !== user.name));
				break;

			case "cv": {
				try {
					const response = await fetch(`${API_URL}/utilizadores/@me`, {
						credentials: "include",
						method: "PATCH",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ cv: value }),
					});

					if (!response.ok) {
						throw new Error("Something went wrong", { cause: response });
					}

					showToastWithMessage("CV atualizado com sucesso");

					setUser({ ...user, cv: value });
				} catch (error) {
					console.error(error);

					showToastWithMessage("Ocorreu um erro ao atualizar o seu CV", "error");
				}

				break;
			}
		}
	}

	async function handleSave() {
		try {
			const response = await fetch(`${API_URL}/utilizadores/@me`, {
				credentials: "include",
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name }),
			});

			if (!response.ok) {
				throw new Error("Something went wrong", { cause: response });
			}

			showToastWithMessage("Nome atualizado com sucesso");

			setUser({ ...user, name });
		} catch (error) {
			console.error(error);

			showToastWithMessage("Ocorreu um erro ao atualizar o seu nome", "error");
		}
	}

	function handleLogout() {
		window.open(`${API_URL}/auth/logout`, "_self");
		setUser(null);
	}

	async function handleDisableAccount() {
		try {
			const response = await fetch(`${API_URL}/utilizadores/${user.id}/disable`, {
				credentials: "include",
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ disabled: true }),
			});

			if (!response.ok) {
				throw new Error("Something went wrong", { cause: response });
			}

			window.open(`${API_URL}/auth/logout`, "_self");
		} catch (error) {
			console.error(error);

			showToastWithMessage("Ocorreu um erro ao desativar a sua conta", "error");
		}
	}

	const firstName = user?.name.split(" ")[0];

	return (
		<Page className="min-h-without-navbar d-flex justify-content-center align-items-center position-relative py-5">
			<img
				src="/static/perfil-bg.jpg"
				className="position-absolute w-100 h-100 inset-0 -z-10 m-0 object-cover p-0"
				fetchpriority="high"
			/>

			<Toast hide={hide} show={showToast} message={toastMessage} />

			<CurriculumVitaeModal
				update={!!user?.cv}
				show={showCvEditModal}
				onSave={(filename) => handleProfileValueChange("cv", filename)}
				onHide={() => setShowCvEditModal(false)}
			/>

			<AlterarPasswordModal
				show={showPasswordChangeModal}
				onHide={() => setShowPasswordChangeModal(false)}
				showToastWithMessage={showToastWithMessage}
			/>

			<ConfirmModal
				onConfirm={handleLogout}
				onHide={() => setShowConfirmModal(false)}
				show={showConfirmModal}
				title="Terminar sessão"
				text="Pretende terminar a sua sessão?"
			/>

			<ConfirmModal
				onConfirm={handleDisableAccount}
				onHide={() => setShowDisableConfirmModal(false)}
				show={showDisableConfirmModal}
				title="Desativar conta"
				text="Tem a certeza que pretende desativar a sua conta? Pode reativá-la a qualquer momento."
			/>

			{user ? (
				<>
					{showSaveButton ? (
						<div
							className="d-flex justify-content-between align-items-center rounded-3 position-absolute start-50 translate-middle gap-2 bg-white px-3 py-2 text-black"
							style={{ bottom: "1rem", width: "24rem" }}
						>
							<p className="mb-0">Guardar alterações?</p>

							<Button variant="success" onClick={handleSave}>
								Guardar
							</Button>
						</div>
					) : null}

					<Container
						className="text-white"
						style={{ backgroundColor: "rgba(48, 81, 122, 0.80)", borderRadius: "1.5rem" }}
					>
						<Container>
							<div className="d-flex justify-content-between align-items-center text-white">
								<h2>Olá, {firstName}!</h2>

								<div className="d-flex flex-column align-items-center">
									<MdOutlinePersonOutline size={64} />
									<p className="mb-0">{user.tipoUtilizador.name}</p>
								</div>
							</div>

							<FormLabel htmlFor="name" className="h5">
								Nome
							</FormLabel>
							<FormControl
								type="text"
								id="name"
								value={name}
								className="w-25"
								onChange={(e) => handleProfileValueChange("name", e.target.value)}
								disabled={disabledEditing}
							/>

							<FormLabel htmlFor="email" className="h5 mt-3">
								Email
							</FormLabel>
							<FormControl
								type="text"
								id="email"
								value={email}
								className="w-25"
								onChange={(e) => handleProfileValueChange("email", e.target.value)}
								disabled
							/>

							<div className="d-flex flex-column w-fit">
								<FormLabel htmlFor="cv" className="h5 mt-3">
									Curriculum Vitae
								</FormLabel>

								<div className="d-flex gap-2">
									<Button variant="light" onClick={() => setShowCvEditModal(true)} type="button">
										{user.cv ? "Alterar" : "Adicionar"}
									</Button>

									{user.cv ? (
										<a
											className="btn btn-light"
											href={`${API_URL}/uploads/${user.cv}`}
											target="_blank"
											rel="external noopener noreferrer"
										>
											Ver atual
										</a>
									) : null}
								</div>
							</div>
						</Container>

						<hr />

						<Container>
							<h3>Autenticação</h3>

							<Button variant="light" onClick={() => setShowPasswordChangeModal(true)}>
								Alterar palavra-passe
							</Button>
						</Container>

						<Container className="mt-4 pb-4 text-white">
							<h3>Gerência de conta</h3>

							<p>Desativar a sua conta significa que pode recuperá-la a qualquer momento após realizar esta ação.</p>

							<div className="d-flex gap-2">
								<Button variant="light" onClick={() => setShowConfirmModal(true)}>
									<MdOutlineLogout size={18} className="mb-1 me-2" />
									Terminar sessão
								</Button>

								<Button variant="danger" onClick={() => setShowDisableConfirmModal(true)}>
									<BsTrash size={18} className="mb-1 me-2" />
									Desativar conta
								</Button>
							</div>
						</Container>
					</Container>
				</>
			) : (
				<Container className="d-flex justify-content-center align-items-center py-5">
					<div className="text-center">
						<p>Faça login para acessar o seu perfil</p>

						<Link to="/login" className="btn btn-light">
							Login
						</Link>
					</div>
				</Container>
			)}
		</Page>
	);
}

/** @param {import("react").PropsWithChildren<{ update: boolean; onHide(): void; show: boolean; onSave(content: string): void }>} props */
function CurriculumVitaeModal({ update, onSave, onHide, show }) {
	/** @param {import("react").ChangeEvent<FormControlElement>} event */
	async function handleSubmit(event) {
		const file = event.target.files[0];
		if (!file) return;

		const formData = new FormData();
		formData.append("file", file);

		const response = await fetch(`${API_URL}/uploads`, {
			method: "POST",
			body: formData,
		});

		if (!response.ok) {
			console.error(response);
			return;
		}

		const { fileName } = await response.json();

		onSave(fileName);
		onHide();
	}

	return (
		<Modal show={show} onHide={onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					{(update ? "Atualizar " : "Adicionar ") + "Curriculum Vitae"}
				</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<FormLabel htmlFor="cv">Ficheiro</FormLabel>

				<FormControl id="cv" type="file" accept="application/pdf" required onChange={(event) => handleSubmit(event)} />
			</Modal.Body>

			<Modal.Footer>
				<Button onClick={onHide} type="button">
					Cancelar
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

/**
 * @param {Object} props
 * @param {boolean} props.show
 * @param {() => void} props.onHide
 * @param {(message: string, type: "error" | "success") => void} props.showToastWithMessage
 */
function AlterarPasswordModal({ show, onHide, showToastWithMessage }) {
	/** @param {import("yup").InferType<typeof changePasswordFormSchema>} data */
	async function handleSubmit({ passwordAtual, newPassword }) {
		try {
			const response = await fetch(`${API_URL}/utilizadores/@me/password`, {
				credentials: "include",
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ passwordAtual, newPassword }),
			});

			if (!response.ok) {
				if (response.status === 401) {
					showToastWithMessage("A password atual está incorreta", "error");
					return;
				}

				throw new Error("Something went wrong", { cause: response });
			}

			window.open(`${API_URL}/auth/logout?r=login`, "_self");
		} catch (error) {
			console.error(error);

			showToastWithMessage("Ocorreu um erro ao alterar a palavra-passe", "error");
		}
	}

	return (
		<Modal show={show} onHide={onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">Alterar palavra-passe</Modal.Title>
			</Modal.Header>

			<Formik
				validationSchema={changePasswordFormSchema}
				initialValues={{ passwordAtual: "", newPassword: "", confirmNewPassword: "" }}
				onSubmit={handleSubmit}
			>
				{({ handleSubmit, handleChange, handleBlur, values, errors, touched }) => {
					const [showPassword, setShowPassword] = useState(false);

					return (
						<Form noValidate onSubmit={handleSubmit}>
							<Modal.Body>
								<Form.Group className="mb-3">
									<Form.Label htmlFor="passwordAtual">Palavra-passe atual</Form.Label>
									<InputGroup hasValidation>
										<Form.Control
											id="passwordAtual"
											type={showPassword ? "text" : "password"}
											value={values.passwordAtual}
											onChange={handleChange}
											isInvalid={touched.passwordAtual && !!errors.passwordAtual}
											onBlur={handleBlur}
										/>
										<InputGroup.Text>
											<Button
												className="d-flex justify-content-center align-items-center border-0 bg-transparent p-0"
												onClick={() => setShowPassword((state) => !state)}
											>
												{showPassword ? (
													<AiFillEyeInvisible color="black" size={20} />
												) : (
													<AiFillEye color="black" size={20} />
												)}
											</Button>
										</InputGroup.Text>
										<Form.Control.Feedback type="invalid">{errors.passwordAtual}</Form.Control.Feedback>
									</InputGroup>
								</Form.Group>

								<Form.Group className="mb-3">
									<Form.Label htmlFor="newPassword">Nova palavra-passe</Form.Label>
									<InputGroup hasValidation>
										<Form.Control
											id="newPassword"
											type={showPassword ? "text" : "password"}
											value={values.newPassword}
											onChange={handleChange}
											isInvalid={touched.newPassword && !!errors.newPassword}
											onBlur={handleBlur}
										/>
										<InputGroup.Text>
											<Button
												className="d-flex justify-content-center align-items-center border-0 bg-transparent p-0"
												onClick={() => setShowPassword((state) => !state)}
											>
												{showPassword ? (
													<AiFillEyeInvisible color="black" size={20} />
												) : (
													<AiFillEye color="black" size={20} />
												)}
											</Button>
										</InputGroup.Text>
										<Form.Control.Feedback type="invalid">{errors.newPassword}</Form.Control.Feedback>
									</InputGroup>
								</Form.Group>

								<Form.Group className="mb-3">
									<Form.Label htmlFor="confirmNewPassword">Confirmar nova palavra-passe</Form.Label>
									<InputGroup hasValidation>
										<Form.Control
											id="confirmNewPassword"
											type={showPassword ? "text" : "password"}
											value={values.confirmNewPassword}
											onChange={handleChange}
											isInvalid={touched.confirmNewPassword && !!errors.confirmNewPassword}
											onBlur={handleBlur}
										/>
										<InputGroup.Text>
											<Button
												className="d-flex justify-content-center align-items-center border-0 bg-transparent p-0"
												onClick={() => setShowPassword((state) => !state)}
											>
												{showPassword ? (
													<AiFillEyeInvisible color="black" size={20} />
												) : (
													<AiFillEye color="black" size={20} />
												)}
											</Button>
										</InputGroup.Text>
										<Form.Control.Feedback type="invalid">{errors.confirmNewPassword}</Form.Control.Feedback>
									</InputGroup>
								</Form.Group>
							</Modal.Body>

							<Modal.Footer>
								<Button
									onClick={handleSubmit}
									type="button"
									variant="success"
									disabled={formikButtonDisabled(errors, touched)}
								>
									Alterar
								</Button>

								<Button onClick={onHide} type="button">
									Cancelar
								</Button>
							</Modal.Footer>
						</Form>
					);
				}}
			</Formik>
		</Modal>
	);
}
