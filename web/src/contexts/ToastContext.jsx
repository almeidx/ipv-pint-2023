import { createContext, useContext, useMemo, useRef, useState } from "react";

export const ToastContext = createContext({
	toastMessage: "",
	/** @param {string} _message */
	setToastMessage: (_message) => {},
	showToast: false,
	/** @param {boolean} _state */
	toggleToast: (_state) => {},
});

/** @param {import("react").PropsWithChildren} props */
export function ToastProvider({ children }) {
	const [toastMessage, setToastMessage] = useState("");
	const [showToast, setShowToast] = useState(false);
	const timeoutRef = useRef(null);

	/** @param {boolean} state */
	function toggleToast(state) {
		setShowToast(state);

		if (state) {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			timeoutRef.current = setTimeout(() => {
				setShowToast(false);
				timeoutRef.current = null;
			}, 10_000);
		} else {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}
		}
	}

	const value = useMemo(
		() => ({ toastMessage, setToastMessage, showToast, toggleToast }),
		[toastMessage, setToastMessage, showToast, toggleToast],
	);

	return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
	return useContext(ToastContext);
}
