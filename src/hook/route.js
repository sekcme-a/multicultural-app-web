import { useRouter } from "next/router";
import React from "react"
import useAuth from "./auth"

//로그인이 되어있다면 루트로 이동
export function withPublic(Component) {
  return function WithPublic(props){
    const auth = useAuth();
    const router = useRouter();

    if (auth.user) {
      router.replace("/")
      return <h1>loading...</h1>
    }
    return <Component auth={auth} {...props} />
  }
}

//로그인이 안되있다면 로그인으로 이동.
export function withProtected(Component) {
  return function WithProtected(props){
    const auth = useAuth();
    const router = useRouter();

    if (!auth.user) {
      router.replace("/login")
      return <h1>loading...</h1>
    }
    return <Component auth={auth} {...props} />
  }
}