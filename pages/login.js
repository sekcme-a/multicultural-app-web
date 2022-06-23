import React from "react"
import { withPublic } from "src/hook/route";

const Login = ({auth}) => {
  const { user, loginWithGoogle, loginWithFacebook, error } = auth;
  return (
    <div>
      {error && <h1>{error}</h1>}
      <button onClick={loginWithGoogle}>Google</button>
      <button onClick={loginWithFacebook}>Facebook</button>
      <h1>{user?.uid}</h1>
    </div>
  )
}
export default withPublic(Login);