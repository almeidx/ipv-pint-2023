import Cookie from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from "../utils/constants.js";

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {string} registrationType
 * @property {Object} tipoUtilizador
 * @property {number} tipoUtilizador.id
 * @property {string} tipoUtilizador.name
 */

export const UserContext = createContext({
	user: {
		id: -1,
		name: "",
		email: "",
		registrationType: "",
		tipoUtilizador: {
			id: -1,
			name: "",
		},
	},
	setUser: (_user) => {},
});

/** @param {import("react").PropsWithChildren} */
export function UserProvider({ children }) {
	const [user, setUser] = useState(null);

	useEffect(() => {
		fetch(`${API_URL}/auth/user`, {
			credentials: "include",
		}).then((res) => {
			if (!res.ok) {
				return;
			}

			res.json().then((data) => {
				Cookie.set("connect.sid", data.cookie, {
					expires: 7,
				});

				setUser(data.user);
			});
		});
	}, []);

	return (
		<UserContext.Provider
			value={{
				user,
				setUser,
			}}
		>
			{children}
		</UserContext.Provider>
	);
}

export function useUser() {
	return useContext(UserContext);
}

export function useIsLoggedIn() {
	const { user } = useUser();

	return user !== null;
}
