
import React, {useEffect, useState} from "react"
import { withProtected, withPublic } from "src/hook/route";
import styles from "styles/setting/setting.module.css"
import { firestore as db } from "firebase/firebase";

const Setting = ({auth}) => {
  const { user, loginWithGoogle, loginWithFacebook, error, logout } = auth;
  useEffect(() => {
    // console.log(user.displayName)
  },[])
  return (
    <div className={styles.main_container}>
      <h1 className={styles.title_container}>계정</h1>
      <div className={styles.item_container}>
        <div className={styles.img_container}></div>
        <div className={styles.text_container}>
          <p className={styles.name}></p>
        </div>
      </div>

      <p className={styles.item_container} onClick={logout}>
        로그아웃
      </p>
    </div>
  )
}
export default withProtected(Setting);