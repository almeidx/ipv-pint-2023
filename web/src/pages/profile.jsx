import { startTransition, useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import FormControl from "react-bootstrap/FormControl";
import FormLabel from "react-bootstrap/FormLabel";
import { BsTrash } from "react-icons/bs";
import { MdOutlineLogout, MdOutlinePersonOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer.jsx";
import { NavBar } from "../components/NavBar.jsx";
import { UserContext } from "../contexts/UserContext.jsx";
import { API_URL } from "../utils/constants.js";

export function Profile() {
	const { user, setUser } = useContext(UserContext);
	const [name, setName] = useState(user?.name ?? "");
	const [email, setEmail] = useState(user?.email ?? "");
	const [showSaveButton, setShowSaveButton] = useState(false);

	function handleProfileValueChange(type, value) {
		if (type === "name") {
			setName(value);
			startTransition(() => {
				setShowSaveButton(value !== user.name);
			});
		} else if (type === "email") {
			setEmail(value);
			startTransition(() => {
				setShowSaveButton(value !== user.email);
			});
		}
	}

	function handleSave() {}

	const firstName = user?.name.split(" ")[0];

	return (
		<>
			<NavBar />

			<main
				className="min-h-without-navbar py-5 d-flex justify-content-center align-items-center"
				style={{ backgroundImage: "url(/static/perfil-bg.jpg)", backgroundSize: "cover", position: "relative" }}
			>
				{user ? (
					<>
						{showSaveButton ? (
							<div
								className="d-flex gap-2 justify-content-between align-items-center bg-white text-black px-3 py-2 rounded-3"
								style={{
									position: "absolute",
									bottom: "1rem",
									left: "50%",
									width: "24rem",
									transform: "translate(-50%, 0)",
								}}
								id-
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
								/>
							</Container>

							<hr />

							<Container>
								<h3>Autenticação</h3>

								<Button variant="light">Alterar palavra-passe</Button>
							</Container>

							<Container className="text-white mt-4 pb-4">
								<h3>Gerência de conta</h3>

								<p>Desativar a sua conta significa que pode recuperá-la a qualquer momento após realizar esta ação.</p>

								<div className="d-flex gap-2">
									<Button
										variant="light"
										onClick={() => {
											window.open(API_URL + "/auth/logout", "_self");
											setUser(null);
										}}
									>
										<MdOutlineLogout size={18} className="me-2 mb-1" />
										Terminar sessão
									</Button>

									<Button
										variant="danger"
										onClick={() => {
											// setUser(null);
										}}
									>
										<BsTrash size={18} className="me-2 mb-1" />
										Desativar conta
									</Button>
								</div>
							</Container>
						</Container>
					</>
				) : (
					<Container className="py-5 d-flex justify-content-center align-items-center">
						<div className="text-center">
							<p>Faça login para acessar o seu perfil</p>

							<Link to="/login" className="btn btn-light">
								Login
							</Link>
						</div>
					</Container>
				)}
			</main>

			<Footer />
		</>
	);
}
