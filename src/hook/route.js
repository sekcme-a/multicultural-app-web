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
    // const haveData = await db.collection("users").doc(auth.user.uid).get()
    const haveData = 0;
    if (auth.user) {
      db.collection("users").doc(auth.user.uid).get().then((doc) => {
        if (!doc.exists && auth.user) {
          db.collection("users").doc(auth.user.uid).set({
            roles: ["user"], name: auth.user.displayName, photo: auth.user.photoURL,
            phoneNumber: auth.user.phoneNumber, email: auth.user.email, emailVerified: auth.user.emailVerified,
            importance: 5, bookmark: [], like: [], isSoundOn:true, isBreakingNewsOn: true
          })
          router.replace("/setting")
          return <div></div>
        } else if (auth.user) {
          router.replace("/setting")
          return <div></div>
        }
      })
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