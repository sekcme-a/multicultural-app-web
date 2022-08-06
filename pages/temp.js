import React, { useState, useEffect } from "react"
import { firestore as db } from "firebase/firebase"

const Temp = () => {
  useEffect(async () => {
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
    //   db.collection("posts").doc(doc.id).update({createdAt: doc.data().createdAt})
    // })
    // db.collection("posts").doc("1014").get().then((doc) => {
    //   console.log(doc.data().createdAt)
    //   let date = new Date(doc.data().createdAt.toMillis())
    //   date.setMonth(date.getMonth() - 1);
    //   console.log(date)
    //   db.collection("posts").doc("1014").update({createdAt: date})
    // })
    // const posts = await db.collection("IxPo3iceKpbjoa88OAQJ").get()
    // posts.docs.map((doc) => {
    //   let date = new Date(doc.data().createdAt.toMillis())
    //   date.setMonth(date.getMonth() - 1);
    //   db.collection("IxPo3iceKpbjoa88OAQJ").doc(doc.id).update({ createdAt: date })
    //   console.log(date)
    // })
    // const posts2 = await db.collection("ZIzHgnMGWknoEZ4eBLhL").get()
    // posts2.docs.map((doc) => {
    //   let date = new Date(doc.data().createdAt.toMillis())
    //   date.setMonth(date.getMonth() - 1);
    //   db.collection("ZIzHgnMGWknoEZ4eBLhL").doc(doc.id).update({ createdAt: date })
    //   console.log(date)
    // })
    // const posts3 = await db.collection("YCQtxN58edXT675reMow").get()
    // posts3.docs.map((doc) => {
    //   let date = new Date(doc.data().createdAt.toMillis())
    //   date.setMonth(date.getMonth() - 1);
    //   db.collection("YCQtxN58edXT675reMow").doc(doc.id).update({ createdAt: date })
    //   console.log(date)
    // })
    // const posts4 = await db.collection("4v013k6tFs9QrfazN80i").get()
    // posts4.docs.map((doc) => {
    //   let date = new Date(doc.data().createdAt.toMillis())
    //   date.setMonth(date.getMonth() - 1);
    //   db.collection("4v013k6tFs9QrfazN80i").doc(doc.id).update({ createdAt: date })
    //   console.log(date)
    // })
    // const posts5 = await db.collection("1eiR5oPAeN8Zb6j2IHzP").get()
    // posts5.docs.map((doc) => {
    //   let date = new Date(doc.data().createdAt.toMillis())
    //   date.setMonth(date.getMonth() - 1);
    //   db.collection("1eiR5oPAeN8Zb6j2IHzP").doc(doc.id).update({ createdAt: date })
    //   console.log(date)
    // })
    // const posts6 = await db.collection("rjcNjelzuNLodIrH9ep0").get()
    // posts6.docs.map((doc) => {
    //   let date = new Date(doc.data().createdAt.toMillis())
    //   date.setMonth(date.getMonth() - 1);
    //   db.collection("rjcNjelzuNLodIrH9ep0").doc(doc.id).update({ createdAt: date })
    //   console.log(date)
    // })
      // update({ createdAt:  })
  },[])
  return(<div></div>)
}

export default Temp