import { createContext, useContext, useMemo, useRef } from "react";

export const DisableableButtonContext = createContext({
	/** @type {HTMLButtonElement} */
	buttonRef: null,
	disableButton: () => {},
});

/** @param {import("react").PropsWithChildren} props */
export function DisableableButtonProvider({ children }) {
	const timeoutRef = useRef(null);
	const buttonRef = useRef(null);

	function disableButton() {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		buttonRef.current.disabled = true;

		timeoutRef.current = setTimeout(() => {
			buttonRef.current.disabled = false;

			timeoutRef.current = null;
		}, 10_000);
	}

	const value = useMemo(() => ({ buttonRef, disableButton }), [buttonRef, disableButton]);

	return <DisableableButtonContext.Provider value={value}>{children}</DisableableButtonContext.Provider>;
}

export function useDisableableButton() {
	return useContext(DisableableButtonContext);
}
