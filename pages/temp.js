import React, { useState, useEffect } from "react"
import { firestore as db } from "firebase/firebase"

const Temp = () => {
  useEffect(async() => {
    // const posts = await db.collection("posts").get()
    // posts.docs.map((doc) => {
    //   let array = []
    //   const text = doc.data().text
    //             const temp = text
    //       temp = temp.replace(/<[^>]*>?/g, '')
    //       temp = temp.replace("&lt;", "<")
    //   temp = temp.replace("&gt;", ">")
    //   temp = temp.replace("&nbsp;", "")
    //       temp = temp.substr(0, 80)
    //   db.collection("posts").doc(doc.id).update({subtitle: temp})
    // })
    // const posts = await db.collection("posts").get()
    // posts.docs.map((doc) => {
    //   db.collection("posts").doc(doc.id).collection("lvc").doc("count").set({ likesCount: 0, viewsCount: 0, commentsCount: 0 })
    // })
  },[])
  return(<div></div>)
}

export default Temp