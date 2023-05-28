import { createContext, useContext, useMemo } from "react";
import useSWR from "swr";
import { API_URL } from "../utils/constants.js";
import { fetcher } from "../utils/fetcher.js";

export const NotificationsContext = createContext({
	notifications: [],
});

/** @param {import("react").PropsWithChildren} */
export function NotificationsProvider({ children }) {
	const { data: notifications } = useSWR(`${API_URL}/notificacoes`, fetcher, { refreshInterval: 60 * 1_000 });

	const value = useMemo(() => ({ notifications }), [notifications]);

	return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
	return useContext(NotificationsContext);
}
