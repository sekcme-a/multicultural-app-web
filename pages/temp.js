import React, { useState, useEffect } from "react"
import { firestore as db } from "firebase/firebase"

const Temp = () => {
  useEffect(async() => {
    // const posts = await db.collection("posts").get()
    // posts.docs.map((doc) => {
    //   let array = []
    //   const title = doc.data().title.toLowerCase().split(" ")
    //   for (let j = 0; j<title.length; j++){
    //     for (let i = 1; i < title[j].length + 1; i++){
    //       array.push(title[j].substring(0,i))
    //     }
    //   }
    //   const tag = doc.data().tag.toLowerCase().replace(/^\s+|\s+$/gm,'').split("#")
    //   for (let j = 0; j<tag.length; j++){
    //     for (let i = 1; i < tag[j].length + 1; i++){
    //       array.push(tag[j].substring(0,i))
    //     }
    //   }
    //   db.collection("posts").doc(doc.id).update({ keyword: array })
    // })
  },[])
  return(<div></div>)
}

export default Temp