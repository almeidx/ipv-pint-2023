import "../styles/Login.css";

import Button from "react-bootstrap/Button";
import { API_URL } from "../utils/constants.js";
import { OrSeparator } from "./OrSeparator.jsx";
import { Facebook } from "./icons/Facebook.jsx";
import { Google } from "./icons/Google.jsx";

/** @param {import("react").PropsWithChildren} props */
export function LoginContainer({ children }) {
	return (
		<div className="min-vw-100 min-vh-100 position-relative d-grid" style={{ placeItems: "center" }}>
			<img
				src="/static/login-bg.jpeg"
				className="position-absolute w-100 h-100 inset-0 -z-10 m-0 object-cover p-0"
				fetchpriority="high"
			/>

			{children}
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
