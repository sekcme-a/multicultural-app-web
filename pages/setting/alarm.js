import React, {useEffect, useState} from "react"
import { useRouter } from "next/router"
import { firestore as db } from "firebase/firebase"
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import styles from "styles/setting/alarm.module.css"
import Switch from '@mui/material/Switch';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import Alert from "src/components/public/Alert"
import useAuth from "src/hook/auth";
import Skeleton from '@mui/material/Skeleton';
const Alarm = () => {
  const { user } = useAuth()
  const router = useRouter()
  const [isAlarmOn, setIsAlarmOn] = useState(true)
  const [isTimeOut, setIsTimeOut] = useState(false)
  const [importance, setImportance] = useState(100)
  const [isSoundOn, setIsSoundOn] = useState(true)
  const [isBreakingNewsOn, setIsBreakingNewsOn] = useState(true)
  const [alertText, setAlertText] = useState("")
  const [alertMode, setAlertMode] = useState("none")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const userData = await db.collection("users").doc(user.uid).get()
      if (userData.exists) {
        if (userData.data().importance === 0) {
          setIsAlarmOn(false)
          setIsLoading(false)
        } else {
          setImportance((userData.data().importance-1)*25)
          setIsSoundOn(userData.data().isSoundOn)
          setIsBreakingNewsOn(userData.data().isBreakingNewsOn)
          setIsLoading(false)
        }
      }
    }
    fetchData()
  },[])

  const onTitleClick = () => { router.back() }
  const onIsAlarmOnChange = (e) => {
    if (!isTimeOut) {
      setIsAlarmOn(e.target.checked)
      db.collection("users").doc(user.uid).update({importance: 0})
      setIsTimeOut(true)
      setTimeout(() => {
        setIsTimeOut(false)
      },2000)
    }
  }

    const marks = [
    {
      value: 0,
      label: '1',
    },
    {
      value: 25,
      label: '2',
    },
    {
      value: 50,
      label: '3',
    },
    {
      value: 75,
      label: '4',
    },
    {
      value: 100,
      label: '5',
    },
  ];
  const onImportanceChange = (e, value) => {
    setImportance(value)
  }
  const onIsSoundOnChange = (e) => {
    setIsSoundOn(e.target.checked)
  }
  const onIsBreakingNewsOnChange = (e) => {
    setIsBreakingNewsOn(e.target.checked)
  }
  const onSubmit = () => {
    const alarmHashMap = {
      importance: importance/25+1,
      isSoundOn: isSoundOn,
      isBreakingNewsOn: isBreakingNewsOn,
    }
    try {
        db.collection("users").doc(user.uid).update(alarmHashMap)
      setAlertText("알람설정이 변경되었습니다.")
      setAlertMode("success")
      setTimeout(() => {
        setAlertMode("none")
      },2500)

    } catch (e) {
      setAlertText("변경 실패")
      setAlertMode("error")
      setTimeout(() => {
        setAlertMode("none")
      },3000)
    }
  }
  if (isLoading)
    return (
      // <Skeleton animation="wave" variant="rectangular" width="100%" height={250} />
   <div className={styles.main_container}>
      <div className={styles.title_container} onClick={onTitleClick}>
        <Skeleton animation="wave" variant="text" width="100%" />
      </div>
      <div className={styles.switch_container}>
        <Skeleton animation="wave" variant="rectangle" width="100%" height="25px" />
      </div>
      <div className={styles.switch_container}>
        <Skeleton animation="wave" variant="text" width="100%" height="25px"/>
      </div>
      <div className={styles.switch_container}>
        <Skeleton animation="wave" variant="text" width="100%" height="25px"/>
      </div>
      <div className={styles.switch_container}>
        <Skeleton animation="wave" variant="text" width="100%" height="25px"/>
      </div>
      <div className={styles.switch_container}>
        <Skeleton animation="wave" variant="text" width="100%"  height="25px"/>
      </div>
    </div>
    )
  return(
    <div className={styles.main_container}>
      <div className={styles.title_container} onClick={onTitleClick}>
        <ArrowBackIosNewIcon style={{fontSize: "15px"}} />
        <p>알림 설정</p>
      </div>
      <div className={styles.input_container}>
        <div className={styles.switch_container}>
          <h4>{isAlarmOn ? "알림 켜짐" : "알림 꺼짐"}</h4>
          <Switch checked={isAlarmOn} onChange={onIsAlarmOnChange} inputProps={{ 'aria-label': 'controlled' }} />
        </div>
        {isAlarmOn ?
          <>
            <div className={styles.switch_container}>
              <h4>알림 중요도</h4>
              <p>높을수록 더 중요한 기사에만 알림을 받습니다.</p>
              <Slider
                aria-label="Custom marks"
                // defaultValue={5}
                step={25}
                marks={marks}
                value={importance}
                onChange={onImportanceChange}
              />
            </div>
            {/* <div className={styles.switch_container}>
              <h4>소리 및 진동</h4>
              <Switch checked={isSoundOn} onChange={onIsSoundOnChange} inputProps={{ 'aria-label': 'controlled' }} />
            </div> */}
            <div className={styles.switch_container}>
              <h4>속보 받기</h4>
             <Switch checked={isBreakingNewsOn} onChange={onIsBreakingNewsOnChange} inputProps={{ 'aria-label': 'controlled' }} />
            </div>
            <Button variant="contained" component="label" onClick={onSubmit} style={{marginTop:"15px", fontWeight:"bold"}}>
              적용
            </Button>
          </>
          :
          <div className={styles.alarm_off_container}>
            <NotificationsNoneIcon style={{ fontSize: "60px", color: "gray" }} />
            <p>알람을 켜서 뉴스 속보, 최신 기사들을 확인하세요!</p>
          </div>
        }
      </div>
      <Alert mode={alertMode} text={alertText} isShow={alertMode!=="none"} />
    </div>
  )
}
export default Alarm