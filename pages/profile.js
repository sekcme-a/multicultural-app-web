import React from "react"
import { withProtected } from "src/hook/route";

const Profile = ({ auth }) => {
  const { loginWithGoogle, userrole, logout } = auth
  return (
    <div>
      <h1></h1>{console.log(userrole)}
      <button onClick={logout}>Logout</button>
    </div>
  )
}
export default withProtected(Profile);