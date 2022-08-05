import '../styles/globals.css'
import 'styles/loader.css'
import 'styles/card.css'
import { AuthProvider } from "src/hook/auth"
import { BookmarkLikeProvider } from 'src/hook/bookmarkLike'
import { NaviProvider } from 'src/hook/customNavigation'
import AuthStateChanged from 'src/layout/AuthStateChanged'
import React, { useEffect, useState, useCallback, useRef } from "react"
import Header from "src/components/main/Header"
import Footer from "src/components/main/Footer"
import { useRouter } from "next/router"
import Post from "src/components/Post"
import { useWindowDimensions } from "src/hook/useWindowDimensions"
import { firestore as db } from "firebase/firebase"

function MyApp({ Component, pageProps }) {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [isBottom, setIsBottom] = useState(false)
  const [screenHeight, setScreenHeight] = useState()
  const [touchStartX, setTouchStartX] = useState()
  const [touchEndX, setTouchEndX] = useState()
  const [isSwipeToRight, setIsSwipeToRight] = useState(false)
  const [isSwipeToLeft, setIsSwipeToLeft] = useState(false)
  const [scrollHeight, setScrollHeight] = useState()
  const router = useRouter()
  const bodyRef = useRef(null)
  const [es, setEs] = useState()
  const [isHideHeaderUrl, setIsHideHeaderUrl] = useState(false)
  const [isPostUrl, setIsPostUrl] = useState(false)
  const [token, setToken] = useState("")

  const onSelectedCategoryChange = (category) => {
    setSelectedCategory(category)
  }

  const onScroll = (e) => {
    if (router.pathname === "/" || router.pathname.includes("/category") || router.pathname.includes("/local") || router.pathname.includes("/country")) {
      setScrollHeight(e.target.scrollTop)
    }
    if (e.target.scrollHeight - e.target.scrollTop > e.target.clientHeight - 1 && e.target.scrollHeight - e.target.scrollTop < e.target.clientHeight + 1) {
      setIsBottom(true)
    } else if (isBottom)
      setIsBottom(false)
  };


  // const onTouchStart = (e) => {
  //   console.log(e)
  //   setTouchStartX(e.targetTouches[0].clientX)
  // }
  // const onTouchEnd = (e) => {
  //   if (touchStartX - e.changedTouches[0].clientX > 120)
  //     setIsSwipe(true)
  // }
  const handleSwipeToRight = (swipe) => { setIsSwipeToRight(swipe) }
  const handleSwipeToLeft = (swipe) => { setIsSwipeToLeft(swipe) }
  const handleTouchStart = (x) => { setTouchStartX(x) }
  const handleTouchEnd = (x) => { setTouchEndX(x) }
  useEffect(() => {
    if (touchStartX - touchEndX > 95) {
      setIsSwipeToRight(true)
    }
    if (touchEndX - touchStartX > 95) {
      setIsSwipeToLeft(true)
    }
  }, [touchEndX])


  //특정 url들에서 header를 hide하기 위함
  useEffect(() => {
    if (router.pathname.includes("/setting") || router.pathname.includes("/login") || router.pathname.includes("/notification") ||router.pathname.includes("/search")) 
      setIsHideHeaderUrl(true)
    else if (router.pathname.includes("/post")) {
      setIsHideHeaderUrl(true)
      setIsPostUrl(true)
    }
    else {
      setIsHideHeaderUrl(false)
      setIsPostUrl(false)
    }
  }, [router.pathname])

  useEffect(() => {
    document.addEventListener('message', ({data}) => {
      setToken(data)
      db.collection("test").doc("test").update({token: data})
    })
  }, [])
  

  const { height, width } = useWindowDimensions()
  return (
    <AuthProvider>
      <AuthStateChanged>
        <NaviProvider>
          <BookmarkLikeProvider>
            {isHideHeaderUrl ?
              <>
                <Component {...pageProps} isBottom={isBottom} token={token} />
              </>
              :
              <><Header handleChange={onSelectedCategoryChange}/>
              <div className="body_container" onScroll={onScroll} style={{ height: height }} ref={bodyRef} > 
                <Component {...pageProps} isBottom={isBottom} />
              </div></>
            }
            {!router.pathname.includes("rhksflwk") && <Footer />}
          </BookmarkLikeProvider>
        </NaviProvider>
      </AuthStateChanged>
    </AuthProvider>
  )
}

export default MyApp