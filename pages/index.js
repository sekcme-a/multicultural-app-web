import Head from 'next/head'
import Image from 'next/image'
import React, { useEffect, useState, useRef } from "react"
import useAuth from 'src/hook/auth'
import { firestore } from "firebase/firebase"
import MainNews from "src/components/main/MainNews"
import PostList from "src/components/main/PostList"
import SingletonRouter, { useRouter } from 'next/router'
import Router from 'next/router'

export default function Home(props) {
  const [message, setMessage] = useState('')
  const { user, userrole, logout, setUserrole } = useAuth();
  const [isPostSelected, setIsPostSelected] = useState()
  const [locationKeys, setLocationKeys] = useState([]);
  const [isOnPost, setIsOnPost] =useState()
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
    //     console.log(router)
    // router.
    //       router.beforePopState(({ as }) => {
    //         if (as !== router.asPath && !isOnPost) {
    //           // router.events.emit('routeChangeError');
    //           router.replace(router, router.asPath, { shallow: true });
    //           setIsOnPost(true)
    //           return false;
    //         }
    //         else {
    //           setIsOnPost(false)
    //           return true;
    //         }
    const routeChangeStart = url => {
      if (isOnPost) {
        console.log("here")
        setIsOnPost(false)
        throw new Router.Abort();
        throw err
      } else {
        return true;
      }
      // if (isOnPost) {
      //   // router.events.emit('routeChangeError');
      //   router.replace(router, router.asPath, { shallow: true });
      //   setIsOnPost(true)
      //   return true;
      // }
      // else {
      //   setIsOnPost(false)
      //   return true;
      // }
    };
    // Router.events.on("routeChangeStart", routeChangeStart)
    
    //   return () => {
    //   Router.events.off("routeChangeStart", routeChangeStart)
    // }
  },[])
  //   return () => {
  //       router.beforePopState(() => true);
  //   };
  // },[router])
    //   const mess =  'Are you sure that you want to leave?'
    //   // const shouldWarn = true

    // useEffect(() => {
    //   let isWarned = false
    //   const routeChangeStart = (url) => {
    //     if (Router.asPath !== url && isOnPost && !isWarned) {
    //       isWarned = true
    //       // if (window.confirm(mess)) {
    //         // Router.push(url)
    //       // } else {
    //         isWarned = false
    //         setIsOnPost(false)
    //         Router.events.emit('routeChangeError')
    //         Router.replace(Router.asPath, Router.asPath, { shallow: true });
    //         // eslint-disable-next-line no-throw-literal
    //         throw 'Abort route change. Please ignore this error.'
    //       // }
    //     }
    //   }

    //   const beforeUnload = (e) => {
    //     if (isOnPost && !isWarned) {
    //       const event = e || window.event
    //       event.returnValue = mess
    //       return mess
    //     }
    //     return null
    //   }

    //   Router.events.on('routeChangeStart', routeChangeStart)
    //   window.addEventListener('beforeunload', beforeUnload)
    //   Router.beforePopState(({ url }) => {
    //     if (Router.asPath !== url && isOnPost && !isWarned) {
    //       isWarned = true
    //       // if (window.confirm(mess)) {
    //       //   return true
    //       // } else {
    //         isWarned = false
    //         window.history.pushState(null, '', url)
    //         Router.replace(Router.asPath, Router.asPath, { shallow: true });
    //         return false
    //       // }
    //     }
    //     return true
    //   })

    //   return () => {
    //     Router.events.off('routeChangeStart', routeChangeStart)
    //     window.removeEventListener('beforeunload', beforeUnload)
    //     Router.beforePopState(() => {
    //       return true
    //     })
    //   }
    // }, [mess, isOnPost])
  
    const mess =  'Are you sure that you want to leave?'
    const shouldWarn = true

    useEffect(() => {
      let isWarned = false
      const routeChangeStart = (url) => {
        console.log(`url: ${url}`)
        console.log(`router.aspth: ${Router.pathname}`)
        if (Router.asPath !== url && shouldWarn && !isWarned) {
          isWarned = true
          if (!isOnPost) {
            Router.push(url)
          } else if(url===Router.asPath){
            setIsOnPost(false)
            if(window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify("isOnPost=false"))
            }
            console.log(isOnPost)
            isWarned = false
            Router.events.emit('routeChangeError')
            Router.replace(Router.asPath, Router.asPath, { shallow: true });
            // eslint-disable-next-line no-throw-literal
            throw 'Abort route change. Please ignore this error.'
          }
        }
      }

      const beforeUnload = (e) => {
        if (shouldWarn && !isWarned) {
          const event = e || window.event
          event.returnValue = mess
          return mess
        }
        return null
      }

      Router.events.on('routeChangeStart', routeChangeStart)
      window.addEventListener('beforeunload', beforeUnload)
      Router.beforePopState(({ url }) => {
        if (Router.asPath !== url && shouldWarn && !isWarned) {
          isWarned = true
          if (!isOnPost) {
            return true
          } else{
            setIsOnPost(false)
            if(window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify("isOnPost=false"))
            }
            isWarned = false
            window.history.pushState(null, '', url)
            Router.replace(Router.asPath, Router.asPath, { shallow: true });
            return false
          }
        }
        return true
      })

      return () => {
        Router.events.off('routeChangeStart', routeChangeStart)
        window.removeEventListener('beforeunload', beforeUnload)
        Router.beforePopState(() => {
          return true
        })
      }
    }, [mess, shouldWarn, isOnPost])
  
  const onPostClick = () => {
    setIsOnPost(true)
    if(window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify("isOnPost=true"))
    }
  }
  return (
    <div>
      <Head>
        <title>한국다문화뉴스</title>
        <meta name="description" content="Korea Multicultural News" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainNews />
      <div onClick={onPostClick}>testButton=openPost</div>
      <p>{`Post:${isOnPost}`}</p>
      <PostList isBottom={props.isBottom} category="posts" handleTouchStart={props.handleTouchStart} handleTouchEnd={props.handleTouchEnd} />
    </div>
  )
}
