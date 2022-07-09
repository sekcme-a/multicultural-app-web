import Head from 'next/head'
import Image from 'next/image'
import React, { useEffect, useState, useRef } from "react"
import useAuth from 'src/hook/auth'
import { firestore } from "firebase/firebase"
import MainNews from "src/components/main/MainNews"
import PostList from "src/components/main/PostList"
import { useRouter } from 'next/router'

export default function Home(props) {
  const [message, setMessage] = useState('')
  const { user, userrole, logout, setUserrole } = useAuth();
  const [isPostSelected,setIsPostSelected] = useState(false)
  const router = useRouter()

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
  }, [user])

  useEffect(() => {
    console.log(router)
  },[router])

  
        {/* <h3>Receive Message : {message}</h3>
      <h3>User : {user?.uid}</h3>
      <h3>User : {userrole}</h3>
      <button onClick={logout}>Logout</button> */}
  return (
    <div>
      <Head>
        <title>한국다문화뉴스</title>
        <meta name="description" content="Korea Multicultural News" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainNews />
      <PostList isBottom={props.isBottom} category="posts" handleTouchStart={props.handleTouchStart} handleTouchEnd={props.handleTouchEnd} />
      {console.log(router.pathname)}
      {router.pathname===("/post/[slug]") && console.log("asdf")}
    </div>
  )
}
