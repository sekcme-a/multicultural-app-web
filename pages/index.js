import Head from 'next/head'
import Image from 'next/image'
import React, { useEffect, useState } from "react"
import useAuth from 'src/hook/auth'
import { firestore } from "firebase/firebase"


export default function Home() {
  const [message, setMessage] = useState('')
  const { user, userrole, logout, setUserrole } = useAuth();

  useEffect(() => {
    document.addEventListener('message', ({data}) => {
      setMessage(data)
    })
  }, [])

  useEffect(() => {
    if (user) {
      firestore.collection("users").doc(user.uid).get().then((doc) => {
        setUserrole(doc.data()?.roles)
      })
    }
  },[user])
  return (
    <div>
      <Head>
        <title>한국다문화뉴스</title>
        <meta name="description" content="Korea Multicultural News" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <h3>Receive Message : {message}</h3>
      <h3>User : {user?.uid}</h3>
      <h3>User : {userrole}</h3>
      <button onClick={logout}>Logout</button> */}
    </div>
  )
}
