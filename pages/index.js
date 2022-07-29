import Head from 'next/head'
import Image from 'next/image'
import React, { useEffect, useState, useRef } from "react"
import useAuth from 'src/hook/auth'
import { firestore } from "firebase/firebase"
import MainNews from "src/components/main/MainNews"
import PostList from "src/components/main/PostList"
import SingletonRouter, { useRouter } from 'next/router'
import Router from 'next/router'
import useBookmarkLike from 'src/hook/bookmarkLike'
import { firestore as db } from 'firebase/firebase'

export default function Home(props) {
  const { user, userrole, logout, setUserrole, token, setToken } = useAuth();
  const { setBookmarkList, setLikeList } = useBookmarkLike();
  const [isPostSelected, setIsPostSelected] = useState()
  const [locationKeys, setLocationKeys] = useState([]);
  const [isOnPost, setIsOnPost] = useState()
  const router = useRouter()

  const handleIsOnPost = (data) => {
    setIsOnPost(data)
  }

  useEffect(() => {
    if (user) {
      firestore.collection("users").doc(user.uid).get().then((doc) => {
        setUserrole(doc.data()?.roles)
        setBookmarkList(doc.data()?.bookmark)
        setLikeList(doc.data()?.like)
      })
    } else {
      setBookmarkList([])
      setLikeList([])
    }
  }, [user])

  useEffect(() => {
    document.addEventListener('message', ({data}) => {
      setToken(data)
      alert(data)
      if (user !== null) {
        db.collection("users").doc(user.uid).update({token: data})
      }
    })
    // return (
    //   window.removeEventListener('message',)
    // )
  }, [])

  useEffect(() => {
    if (token !== "" && user!==null) {
      db.collection("users").doc(user.uid).update({token: data})
    }
  },[])


  const onPostClick = () => {
    setIsOnPost(true)
    if(window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify("isOnPost=true"))
    }
  }
  return (
    <div style={{backgroundColor: "rgb(242, 242, 242)"}}>
      <Head>
        <title>한국다문화뉴스</title>
        <meta name="description" content="Korea Multicultural News" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainNews />
      <h4>{token}</h4>
      <h4>{props.token}</h4>
      <PostList isBottom={props.isBottom} category="posts" />
    </div>
  )
}
