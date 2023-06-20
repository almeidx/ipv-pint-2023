import { createContext, useContext, useMemo, useRef, useState } from "react";

export const ToastContext = createContext({
	toastMessage: "",
	toastType: "success",
	showToast: false,
	hide: () => {},
	/**
	 * @param {string} _message
	 * @param {"success"|"error"} [_type="success"]
	 */
	showToastWithMessage: (_message, _type) => {},
});

/** @param {import("react").PropsWithChildren} props */
export function ToastProvider({ children }) {
	const [toastMessage, setToastMessage] = useState("");
	const [showToast, setShowToast] = useState(false);
	const [toastType, setToastType] = useState("success");
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

	function hide() {
		setShowToast(false);
	}

	/**
	 * @param {string} message
	 * @param {"success"|"error"} [type]
	 */
	function showToastWithMessage(message, type = "success") {
		setToastMessage(message);
		setToastType(type);
		toggleToast(true);
	}

	const value = useMemo(
		() => ({ toastMessage, showToast, hide, showToastWithMessage, toastType }),
		[toastMessage, showToast, hide, showToastWithMessage, toastType],
	);

	return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
	return useContext(ToastContext);
}
