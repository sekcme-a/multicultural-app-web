import { AuthService } from "src/service/AuthService";
import { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";

const authContext = createContext();

export default function useAuth() {
  return useContext(authContext)
}

export function AuthProvider(props) {
  const [user, setUser] = useState(null);
  const [userrole, setUserrole] = useState();
	const [error, setError] = useState("");
  const router = useRouter()
	const pathname = router.pathname;


	const loginWithGoogle = async () => {
    const { error, user } = await AuthService.loginWithGoogle();
		setUser(user ?? null)
		setError(error ?? "")
		setIsVir(true)
		setTemp(true)
  }

	const loginWithFacebook = async () => {
    const { error, user } = await AuthService.loginWithFacebook();
		setUser(user ?? null)
		setError(error ?? "")
		setIsVir(true)
  }

  const logout = async () => {
    await AuthService.logout();
		setUser(null);
		setUserrole(null)
  }
	const createUserWithEmailAndPassword = async (email, password) => {
		if (email && password) {
			const { error, user } = await AuthService.createUserWithEmailAndPassword(
				email,
				password
			);
			if (error) {
				setError({ [pathname]: error });
				return;
			}
			setUser(user ?? null);
			router.push(`/verify?email=${email}`);
		} else {
			setError({ [pathname]: "Email and password can not be empty" });
		}
	};

	const signInUserWithEmailAndPassword = async (email, password) => {
		if (email && password) {
			const { error, user } = await AuthService.signInUserWithEmailAndPassword(
				email,
				password
			);
			if (error) {
				setError({ [pathname]: error });
				return;
			}
			setUser(user ?? null);
			router.push("/");
		} else {
			setError({ [pathname]: "Email and password can not be empty" });
		}
	};
	const resetPassword = async (email) => {
		if (email) {
			const error = await AuthService.resetPassword(email);
			if (error) {
				setError({ [pathname]: error });
				return;
			}
			router.push(`/verify?email=${email}`);
		} else {
			setError({ [pathname]: "Email can not be empty" });
		}
	};

	const deleteAccount = async () => {
		const error = await AuthService.deleteAccount();
		setError({ [pathname]: error });
	};

	const updatePassword = async (confirmPassword, password) => {
		if (confirmPassword === password) {
			const error = await AuthService.updatePassword(password);
			setError({ [pathname]: error });
		} else {
			setError({ [pathname]: "password doesn't match!" });
		}
	};

	const value = {
		user,
		userrole,
		error,
    loginWithGoogle,
    loginWithFacebook,
		logout,
		setUser,
		setUserrole,
		createUserWithEmailAndPassword,
		signInUserWithEmailAndPassword,
		resetPassword,
		deleteAccount,
		updatePassword,
	};


  return <authContext.Provider value={value} {...props} />

}