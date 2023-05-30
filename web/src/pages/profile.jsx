import { startTransition, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import FormControl from "react-bootstrap/FormControl";
import FormLabel from "react-bootstrap/FormLabel";
import Modal from "react-bootstrap/Modal";
import { BsTrash } from "react-icons/bs";
import { MdOutlineLogout, MdOutlinePersonOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import { Page } from "../components/Page.jsx";
import { Toast } from "../components/Toast.jsx";
import { useToast } from "../contexts/ToastContext.jsx";
import { useUser } from "../contexts/UserContext.jsx";
import { API_URL } from "../utils/constants.js";

export function Profile() {
	const { user, setUser } = useUser();
	const [name, setName] = useState(user?.name ?? "");
	const [email, setEmail] = useState(user?.email ?? "");
	const [showCvEditModal, setShowCvEditModal] = useState(false);
	const [showSaveButton, setShowSaveButton] = useState(false);
	const { showToast, showToastWithMessage, toastMessage, toggleToast } = useToast();

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

			case "email": {
				// TODO: Allow editing email

				break;
			}

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

					showToastWithMessage("Ocorreu um erro ao atualizar o seu CV");
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

			showToastWithMessage("Ocorreu um erro ao atualizar o seu nome");
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

			<Toast hide={() => toggleToast(false)} showToast={showToast} toastMessage={toastMessage} />

			<CurriculumVitaeModal
				update={!!user?.cv}
				show={showCvEditModal}
				onSave={(filename) => handleProfileValueChange("cv", filename)}
				onHide={() => setShowCvEditModal(false)}
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
								disabled={disabledEditing}
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
											rel="noreferrer"
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

							<Button variant="light">Alterar palavra-passe</Button>
						</Container>

						<Container className="mt-4 pb-4 text-white">
							<h3>Gerência de conta</h3>

							<p>Desativar a sua conta significa que pode recuperá-la a qualquer momento após realizar esta ação.</p>

							<div className="d-flex gap-2">
								<Button
									variant="light"
									onClick={() => {
										window.open(`${API_URL}/auth/logout`, "_self");
										setUser(null);
									}}
								>
									<MdOutlineLogout size={18} className="mb-1 me-2" />
									Terminar sessão
								</Button>

								<Button
									variant="danger"
									onClick={() => {
										// setUser(null);
									}}
								>
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
