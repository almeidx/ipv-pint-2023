import { createContext, useEffect, useState } from "react";
import { API_URL } from "../utils/constants.js";
import Cookie from "js-cookie";

export const UserContext = createContext(null);

export function UserProvider({ children }) {
	const [user, setUser] = useState(null);

	useEffect(() => {
		fetch(API_URL + "/auth/user", {
			credentials: "include",
		}).then((res) => {
			if (!res.ok) {
				return;
			}

			res.json().then((data) => {
				console.log(data);

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
