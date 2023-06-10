import { createContext, useContext, useMemo } from "react";
import useSWR from "swr";
import { API_URL } from "../utils/constants.js";
import { fetcher } from "../utils/fetcher.js";

export const NotificationsContext = createContext({
	notifications: [],
	mutate: () => {},
});

/** @param {import("react").PropsWithChildren} */
export function NotificationsProvider({ children }) {
	const { data: notifications, mutate } = useSWR(`${API_URL}/notificacoes`, fetcher, {
		refreshInterval: 2 * 60 * 1_000,
	}); // 2 min

	const value = useMemo(() => ({ notifications, mutate }), [notifications, mutate]);

	return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
	return useContext(NotificationsContext);
}
