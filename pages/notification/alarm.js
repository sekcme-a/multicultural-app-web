import React, {useEffect, useState} from "react"
import styles from "styles/notification/alarm.module.css"
import useAuth from 'src/hook/auth'
import { firestore as db } from "firebase/firebase"
import NoticationHeader from "src/components/notification/NoticationHeader"
import MiniPostList from "src/components/main/MiniPostList"
import Skeleton from '@mui/material/Skeleton';  
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

const Alarm = () => {
  const { user, userrole, logout, setUserrole } = useAuth();
  const [importance, setImportance] = useState()
  const [list, setList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    if (user?.uid) {
      db.collection("users").doc(user.uid).get().then((doc) => {
        setImportance(doc.data().importance)
        let imp = doc.data().importance
        if (doc.data().importance !== 0) {
          const now = new Date()
          let temp = [];
          // db.collection("posts").where("importance", ">=", doc.data().importance).limit(10).get().then((querySnapShot) => {
          db.collection("posts").orderBy("createdAt","desc").limit(40).get().then((querySnapShot) => {
            querySnapShot.forEach((doc) => {
              console.log(doc.data().importance <= imp)
              console.log(doc.data().importance)
              console.log(imp)
              if (doc.data().importance <= imp) {
                temp.push({
                  id: doc.id,
                  title: doc.data().title,
                  thumbnail: doc.data().thumbnail,
                  tag: doc.data().tag,
                  category: doc.data().category,
                  author: doc.data().author,
                })
              }
            })
            setList(temp)
            setIsLoading(false)
          })
        } else
          setIsLoading(false)
      })
    } else {
      setImportance(3) 
      let imp = 3
      let temp = [];
      // db.collection("posts").where("importance", ">=", 3).limit(10).get().then((querySnapShot) => {
      db.collection("posts").orderBy("createdAt","desc").limit(40).get().then((querySnapShot) => {
        querySnapShot.forEach((doc) => {
          if (doc.data().importance <= imp) {
            temp.push({
              id: doc.id,
              title: doc.data().title,
              thumbnail: doc.data().thumbnail,
              tag: doc.data().tag,
              category: doc.data().category,
              author: doc.data().author,
            })
          }
        })
        setList(temp)
        setIsLoading(false)
      })
    }
  }, [])


  if (isLoading)
    return(
      <div>
        <NoticationHeader loc="alarm" />
        <Skeleton animation="wave" variant="text" width="100%-10px" height={70} style={{ margin: "0 10px 0 10px" }} />
        <Skeleton animation="wave" variant="text" width="100%-10px" height={70} style={{ margin: "0 10px 0 10px" }}  />
        <Skeleton animation="wave" variant="text" width="100%-10px" height={70} style={{ margin: "0 10px 0 10px" }}  />
        <Skeleton animation="wave" variant="text" width="100%-10px" height={70} style={{ margin: "0 10px 0 10px" }}  />
        <Skeleton animation="wave" variant="text" width="100%-10px" height={70} style={{ margin: "0 10px 0 10px" }}  />
        <Skeleton animation="wave" variant="text" width="100%-10px" height={70} style={{ margin: "0 10px 0 10px" }}  />
      </div>
    )

  return (
    <div className={styles.main_container}>
      <NoticationHeader loc="alarm" />
      {list.length===0 ?
        <div className={styles.alarm_off_container}>
          <NotificationsNoneIcon style={{ fontSize: "60px", color: "gray" }} />
          <p>알람을 켜서 뉴스 속보, 최신 기사들을 확인하세요!</p>
        </div>
        :
        <MiniPostList data={list} />
      }
    </div>
  )
}
export default Alarm