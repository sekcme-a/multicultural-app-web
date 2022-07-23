import React, {useEffect, useState} from "react"
import styles from "styles/notification/alarm.module.css"
import useAuth from 'src/hook/auth'
import { firestore as db } from "firebase/firebase"
import NoticationHeader from "src/components/notification/NoticationHeader"
import MiniPostList from "src/components/main/MiniPostList"
import Skeleton from '@mui/material/Skeleton';  

const Alarm = () => {
  const { user, userrole, logout, setUserrole } = useAuth();
  const [importance, setImportance] = useState(5)
  const [list, setList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    if (user?.uid) {
      db.collection("users").doc(user.uid).get().then((doc) => {
        setImportance(doc.data().importance)
        if (importance !== 0) {
          const now = new Date()
          let temp = [];
          // const oneMonthAgo = new Date(now.setMonth(now.getMonth()-1))
          // console.log(now.getTime()>oneMonthAgo.getTime())
          // db.collection("posts").where("importance",">=",importance).where("createdAt",">=",oneMonthAgo)
          db.collection("posts").where("importance", ">=", importance).limit(30).get().then((querySnapShot) => {
            querySnapShot.forEach((doc) => {
              temp.push({
                id: doc.id,
                title: doc.data().title,
                thumbnail: doc.data().thumbnail,
                tag: doc.data().tag,
                category: doc.data().category,
                author: doc.data().author,
              })
            })
            setList(temp)
            setIsLoading(false)
          })
        }
      })
    } else {
      let temp = [];
      db.collection("posts").where("importance", ">=", importance).limit(30).get().then((querySnapShot) => {
        querySnapShot.forEach((doc) => {
          temp.push({
            id: doc.id,
            title: doc.data().title,
            thumbnail: doc.data().thumbnail,
            tag: doc.data().tag,
            category: doc.data().category,
            author: doc.data().author,
          })
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
      <MiniPostList data={list} />
    </div>
  )
}
export default Alarm