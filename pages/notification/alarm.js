import React, {useEffect, useState} from "react"
import styles from "styles/notification/alarm.module.css"
import useAuth from 'src/hook/auth'
import { firestore as db } from "firebase/firebase"
import NoticationHeader from "src/components/notification/NoticationHeader"
import ThumbnailPost from "src/components/main/ThumbnailPost"

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
                data: doc.data(),
              })
            })
            for (let i = 0; i < temp.length; i++){
              temp[i].data.createdAt = getDate(temp[i].data.createdAt)
            }
            console.log(temp)
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
            data: doc.data(),
          })
        })
        for (let i = 0; i < temp.length; i++){
          temp[i].data.createdAt = getDate(temp[i].data.createdAt)
        }
        console.log(temp)
        setList(temp)
        setIsLoading(false)
      })
    }
  }, [])
  const getDate = (d) => {
    const date = new Date(d.toMillis())
    if(date.getMonth()+1<10 && date.getDate()<10)
      return date.getFullYear() + ".0" + (date.getMonth() + 1) + ".0" + date.getDate() +" "+date.getHours()+":"+date.getMinutes()
    else if(date.getMonth()+1<10 && date.getDate()>=10)
      return date.getFullYear() + ".0" + (date.getMonth() + 1) + "." + date.getDate() +" "+date.getHours()+":"+date.getMinutes()
    else if(date.getMonth()+1>=10 && d.getDate()<10)
      return date.getFullYear() + "." + (date.getMonth() + 1) + ".0" + date.getDate() +" "+date.getHours()+":"+date.getMinutes()
    else if(date.getMonth()+1>=10 && date.getDate()>=10)
      return date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate() +" "+date.getHours()+":"+date.getMinutes()
  }

  return (
    <div className={styles.main_container}>
      <NoticationHeader loc="alarm" />
      {
        !isLoading && list.map((data, index) => {
          return(
            <ThumbnailPost data={data.data} key={index} id={data.id} />
          )
        })
      }
    </div>
  )
}
export default Alarm