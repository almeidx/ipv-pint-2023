import { useContext } from "react";
import { Footer } from "../components/Footer.jsx";
import { NavBar } from "../components/NavBar.jsx";
import { UserContext } from "../contexts/UserContext.jsx";
import { API_URL } from "../utils/constants.js";

export function Profile() {
	const { user, setUser } = useContext(UserContext);

	return (
		<>
			<NavBar page="profile" />

			<main className="min-h-without-navbar pb-5" style={{ backgroundColor: "#c5cae9" }}>
				{user ? (
					<>
						{JSON.stringify(user)}

						<button
							onClick={() => {
								void window.open(API_URL + "/auth/logout", "_self");
								setUser(null);
							}}
						>
							logout
						</button>
					</>
				) : (
					<p>not logged in</p>
				)}
			</main>

			<Footer />
		</>
	);
}
