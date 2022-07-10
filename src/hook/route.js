import { useRouter } from "next/router";
import React from "react"
import useAuth from "./auth"
import { firestore as db } from "firebase/firebase";
//로그인이 되어있다면 세팅으로 이동
export function withPublic(Component) {
  return function WithPublic(props){
    const auth = useAuth();
    const router = useRouter();
    const pathname = router.pathname;
  
    if (auth.user) {
      db.collection("users").doc(auth.user.uid).set({
        roles: ["user"], name: auth.user.displayName, photo: auth.user.photoURL,
        phoneNumber: auth.user.phoneNumber, email: auth.user.email, emailVerified: auth.user.emailVerified
      })
      router.replace("/setting")
      return <div></div>
    }
    return <Component auth={auth} pathname={pathname} {...props} />
  }
}

//로그인이 안되있다면 로그인으로 이동.
export function withProtected(Component) {
  return function WithProtected(props){
    const auth = useAuth();
    const router = useRouter();
    const pathname = router.pathname;

    if (!auth.user) {
      router.replace("/login")
      return <div></div>
    }
    return <Component auth={auth} pathname={pathname} {...props} />
  }
}