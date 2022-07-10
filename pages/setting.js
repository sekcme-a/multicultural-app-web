import React from "react"
import { withProtected, withPublic } from "src/hook/route";

const Setting = ({auth}) => {
  const { user, loginWithGoogle, loginWithFacebook, error } = auth;
  
  return (
    <div>
      setting
    </div>
  )
}
export default withProtected(Setting);