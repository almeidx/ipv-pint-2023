import { useContext, useState, startTransition } from "react";
import { Footer } from "../components/Footer.jsx";
import { NavBar } from "../components/NavBar.jsx";
import { UserContext } from "../contexts/UserContext.jsx";
import { API_URL } from "../utils/constants.js";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import FormControl from "react-bootstrap/FormControl";
import FormLabel from "react-bootstrap/FormLabel";
import { MdOutlinePersonOutline, MdOutlineLogout } from "react-icons/md";
import { BsTrash } from "react-icons/bs";

export function Profile() {
	const { user, setUser } = useContext(UserContext);
	const [name, setName] = useState(user?.name ?? "");
	const [email, setEmail] = useState(user?.email ?? "");
	const [showSaveButton, setShowSaveButton] = useState(false);

	if (!user) {
		window.location.href = "/login";

		return null;
	}

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

	const firstName = user.name.split(" ")[0];

	return (
		<>
			<NavBar page="profile" />

			<main
				className="min-h-without-navbar py-5"
				style={{ backgroundImage: "url(/static/perfil-bg.jpg)", backgroundSize: "cover", position: "relative" }}
			>
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
					>
						<p className="mb-0">Guardar alterações?</p>

						<Button>Guardar</Button>
					</div>
				) : null}

				<Container style={{ backgroundColor: "rgba(48, 81, 122, 0.80)", borderRadius: "1.5rem" }}>
					<div className="d-flex justify-content-between align-items-center text-white">
						<h2>Olá, {firstName}!</h2>

						<div className="d-flex gap-2 flex-column align-items-center">
							<MdOutlinePersonOutline size={72} />

							<p>{user.tipoUtilizador.name}</p>
						</div>
					</div>

					<Container>
						<h3 className="text-white">Informações pessoais</h3>

						<FormLabel htmlFor="name" className="text-white h5">
							Nome
						</FormLabel>
						<FormControl
							type="text"
							id="name"
							value={name}
							className="w-25"
							onChange={(e) => handleProfileValueChange("name", e.target.value)}
						/>

						<FormLabel htmlFor="email" className="text-white h5 mt-3">
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
						<h3 className="text-white">Autenticação</h3>

						<Button className="bg-white text-black">Alterar palavra-passe</Button>
					</Container>

					<Container className="text-white mt-4 pb-4">
						<h3>Gerência de conta</h3>

						<p>Desativar a sua conta significa que pode recuperá-la a qualquer momento após realizar esta ação.</p>

						<div className="d-flex gap-2">
							<Button
								type="button"
								className="d-flex justify-content-center align-items-center bg-white text-black gap-2"
								onClick={() => {
									void window.open(API_URL + "/auth/logout", "_self");
									setUser(null);
								}}
							>
								<MdOutlineLogout size={18} />
								Terminar sessão
							</Button>

							<Button
								type="button"
								className="d-flex justify-content-center align-items-center bg-white text-black gap-2"
								onClick={() => {
									// setUser(null);
								}}
							>
								<BsTrash size={18} />
								Desativar conta
							</Button>
						</div>
					</Container>
				</Container>
			</main>

			<Footer />
		</>
	);
}
