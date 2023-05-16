import "../styles/Login.css";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { API_URL } from "../utils/constants.js";
import { OrSeparator } from "./OrSeparator.jsx";
import { Facebook } from "./icons/Facebook.jsx";
import { Google } from "./icons/Google.jsx";

/** @param {import("react").PropsWithChildren<{ handleSubmit: SubmitEvent }>} props */
export function LoginContainer({ children, handleSubmit }) {
	return (
		<div className="login-cnt min-vw-100 min-vh-100">
			<Form onSubmit={handleSubmit} className="col-lg-3 col-sm-7 col-10 col-md-5 form d-flex flex-column">
				{children}
			</Form>
		</div>
	);
}

export function SocialButtons() {
	return (
		<div className="mt-4">
			<OrSeparator />

			<Button
				variant="light"
				type="button"
				className="col-8 rounded-5 d-flex justify-content-center align-items-center mx-auto mt-4 gap-2 p-2"
				onClick={() => {
					window.open(`${API_URL}/auth/google`, "_self");
				}}
			>
				<Google /> Continuar com Google
			</Button>

			<Button
				variant="light"
				type="button"
				className="col-8 rounded-5 d-flex justify-content-center align-items-center mx-auto mb-2 mt-3 gap-2 p-2"
				onClick={() => {
					window.open(`${API_URL}/auth/facebook`, "_self");
				}}
			>
				<Facebook /> Continuar com Facebook
			</Button>
		</div>
	);
}
