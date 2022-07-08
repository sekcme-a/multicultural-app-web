import '../styles/globals.css'
import 'styles/loader.css'
import { AuthProvider } from "src/hook/auth"
import AuthStateChanged from 'src/layout/AuthStateChanged'
import React, { useEffect, useState, useRef } from "react"
import Header from "src/components/main/Header"
import Footer from "src/components/main/Footer"
import { useRouter } from "next/router"

function MyApp({ Component, pageProps }) {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [isBottom, setIsBottom] = useState(false)
  const [screenHeight, setScreenHeight] = useState()
  const [touchStartX, setTouchStartX] = useState()
  const [touchEndX,setTouchEndX] = useState()
  const [isSwipeToRight, setIsSwipeToRight] = useState(false)
  const [isSwipeToLeft, setIsSwipeToLeft] = useState(false)
  const router = useRouter()

  const onSelectedCategoryChange = (category) => {
    setSelectedCategory(category)
  }

  const onScroll = (e) => {
    if (e.target.scrollHeight - e.target.scrollTop > e.target.clientHeight-1 && e.target.scrollHeight - e.target.scrollTop < e.target.clientHeight+1) {
      setIsBottom(true)
    }else if(isBottom)
      setIsBottom(false)
  };
  const useWindowDimensions = () => {
    const hasWindow = typeof window !== "undefined"

    function getWindowDimensions() {
      const width = hasWindow ? window.innerWidth : null
      const height = hasWindow ? window.innerHeight : null
      return {
        width,
        height,
      }
    }

    const [windowDimensions, setWindowDimensions] = useState(
      getWindowDimensions()
    )

    useEffect(() => {
      if (hasWindow) {
        function handleResize() {
          setWindowDimensions(getWindowDimensions())
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
      }
    }, [hasWindow])

    return windowDimensions
  }

  // const onTouchStart = (e) => {
  //   console.log(e)
  //   setTouchStartX(e.targetTouches[0].clientX)
  // }
  // const onTouchEnd = (e) => {
  //   if (touchStartX - e.changedTouches[0].clientX > 120)
  //     setIsSwipe(true)
  // }
  const handleSwipeToRight = (swipe) => { setIsSwipeToRight(swipe) }
  const handleSwipeToLeft = (swipe) => {setIsSwipeToLeft(swipe)}
  const handleTouchStart = (x)=>{setTouchStartX(x)}
  const handleTouchEnd = (x) => { setTouchEndX(x) }
  useEffect(() => {
    if (touchStartX - touchEndX > 85) {
      setIsSwipeToRight(true)
    }
    console.log(touchEndX-touchStartX)
    if (touchEndX - touchStartX > 85){
      setIsSwipeToLeft(true)
    }
  }, [touchEndX])

  const { height, width } = useWindowDimensions()
  return (
    <AuthProvider>
      <AuthStateChanged>
        <Header handleChange={onSelectedCategoryChange} selectedCategory={selectedCategory} isSwipeToRight={isSwipeToRight}
          handleSwipeToRight={handleSwipeToRight} isSwipeToLeft={isSwipeToLeft} handleSwipeToLeft={handleSwipeToLeft} />
        <div className="body_container" onScroll={onScroll} style={{height: height}}>
          <Component {...pageProps} isBottom={isBottom} handleTouchStart={handleTouchStart} handleTouchEnd={handleTouchEnd} />
        </div>
        {!router.pathname.includes("rhksflwk") && <Footer />}
      </AuthStateChanged>
    </AuthProvider>
  )
}

export default MyApp
