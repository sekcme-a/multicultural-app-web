import '../styles/globals.css'
import 'styles/loader.css'
import { AuthProvider } from "src/hook/auth"
import AuthStateChanged from 'src/layout/AuthStateChanged'
import React, { useEffect, useState, useCallback, useRef } from "react"
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
  const [scrollHeight, setScrollHeight] = useState()
  const router = useRouter()
  const bodyRef = useRef(null)
  const [es, setEs] = useState()

  const onSelectedCategoryChange = (category) => {
    setSelectedCategory(category)
  }

  const onScroll = (e) => {
      if (router.pathname === "/" || router.pathname.includes("/category") || router.pathname.includes("/local") || router.pathname.includes("/country")) {
        setScrollHeight(e.target.scrollTop)
      }
    if (e.target.scrollHeight - e.target.scrollTop > e.target.clientHeight-1 && e.target.scrollHeight - e.target.scrollTop < e.target.clientHeight+1) {
      setIsBottom(true)
    }else if(isBottom)
      setIsBottom(false)
  };
  // useEffect(() => {
  //   window.addEventListener('scroll', handleScrollPos);
  //   if (router.pathname === "/" || router.pathname.includes("/category") || router.pathname.includes("/local") || router.pathname.includes("/country")) {
  //     window.scrollTo(0, 300)
  //   }
  //       const handleScrollPos = () => {
  //     //every time the window is scrolled, update the reference. This will not cause a re-render, meaning smooth uninterrupted scrolling.
  //         setScrollHeight(window.scrollY)
  //         console.log(scrollHeight)
  //   };
  //     return () => {
  //     //remove event listener on unmount
  //     window.removeEventListener('scroll', handleScrollPos);
  //   };
  // })

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
    if (touchStartX - touchEndX > 95) {
      setIsSwipeToRight(true)
    }
    if (touchEndX - touchStartX > 95){
      setIsSwipeToLeft(true)
    }
  }, [touchEndX])

  const { height, width } = useWindowDimensions()
  return (
    <AuthProvider>
      <AuthStateChanged>
        <Header handleChange={onSelectedCategoryChange} selectedCategory={selectedCategory} isSwipeToRight={isSwipeToRight}
          handleSwipeToRight={handleSwipeToRight} isSwipeToLeft={isSwipeToLeft} handleSwipeToLeft={handleSwipeToLeft} />
          <div className="body_container" onScroll={onScroll} style={{ height: height }} ref={bodyRef} > 
            <Component {...pageProps} isBottom={isBottom} handleTouchStart={handleTouchStart} handleSwipeToLeft={handleSwipeToLeft} handleTouchEnd={handleTouchEnd} isSwipeToLeft={isSwipeToLeft} />
          </div>
          {!router.pathname.includes("rhksflwk") && <Footer />}
      </AuthStateChanged>
    </AuthProvider>
  )
}

export default MyApp
