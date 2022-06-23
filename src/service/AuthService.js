import { auth, facebookAuthProvider, googleAuthProvider } from "firebase/firebase"

export const AuthService = {
  loginWithGoogle: async () => {
    const provider = googleAuthProvider;
    try {
      const userCred = await auth.signInWithPopup(provider);
      return {
        user: userCred.user
      };
    } catch (e) {
      return {
        error: e.message,
      }
    }
  },
  loginWithFacebook: async () => {
    const provider = facebookAuthProvider;
    try {
      const userCred = await auth.signInWithPopup(provider);
      return {
        user: userCred.user
      };
    } catch (e) {
      return {
        error: e.message,
      }
    }
  },
  logout: async () => {
    await auth.signOut();
  }
}

