import React, {useEffect, useState} from "react"
import { useRouter } from "next/router"
import { firestore as db } from "firebase/firebase"
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import styles from "styles/setting/alarm.module.css"
import Switch from '@mui/material/Switch';
const Alarm = () => {
  const router = useRouter()
  const [isAlarmOn, setIsAlarmOn] = useState(true)

  const onTitleClick = () => { router.back() }
  const onIsAlarmOnChange = (e) => {
    setIsAlarmOn(e.target.checked)
  }
  return(
    <div className={styles.main_container}>
      <div className={styles.title_container} onClick={onTitleClick}>
        <ArrowBackIosNewIcon style={{fontSize: "15px"}} />
        <p>알림 설정</p>
      </div>
      <div className={styles.input_container}>
        <div className={styles.switch_container}>
          <p>알람 켜짐</p>
          <Switch checked={isAlarmOn} onChange={onIsAlarmOnChange} inputProps={{ 'aria-label': 'controlled' }} />
        </div>
      </div>
    </div>
  )
}
export default Alarm