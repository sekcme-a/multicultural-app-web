import React, {useEffect, useState} from "react"
import styles from "styles/alarm/alarm.module.css"
import useAuth from 'src/hook/auth'

const Alarm = () => {
  const { user, userrole, logout, setUserrole } = useAuth();
  useEffect(() => {
    console.log(user)
  },[])
  return (
    <div className={styles.main_container}>
    </div>
  )
}
export default Alarm