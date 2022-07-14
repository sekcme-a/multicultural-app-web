import Router from "next/router"
import React, { useEffect, useState } from "react"


/*
Post가 활성화된 상태에선 뒷버튼을 누를때 url이 바뀌지 않고 post를 비활성화시키기 위함.
const [isOnPost, setIsOnPost] = useState()
preventRouterBackWhenOnPost(isOnPost, {handleIsOnPost(data){ setIsOnPost(data) }} )

이렇게 사용할 수 있음.

*/
export const preventRouterBackWhenOnPost = (isOnPost, {handleIsOnPost}) => {
    const mess =  'Are you sure that you want to leave?'
  const shouldWarn = true
  console.log("sadf")

  // Post
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
          handleIsOnPost(false)
          if(window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify("isOnPost=false"))
          }
          isWarned = false
          Router.events.emit('routeChangeError')
          Router.replace(Router.asPath, Router.asPath, { shallow: true });
          // eslint-disable-next-line no-throw-literal
          throw 'Abort route change. Please ignore this error.'
        }
      }
    }

    const beforeUnload = (e) => {
      e.preventDefault()
      if (shouldWarn && !isWarned) {
        const event = e || window.event
        event.returnValue = mess
        return mess
      }
      return null
    }

    Router.events.on('routeChangeStart', routeChangeStart)
    window.addEventListener('beforeunload', beforeUnload, {capture: true})
    Router.beforePopState(({ url }) => {
      if (Router.asPath !== url && shouldWarn && !isWarned) {
        isWarned = true
        if (!isOnPost) {
          return true
        } else{
          handleIsOnPost(false)
          if(window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify("isOnPost=false"))
          }
          isWarned = false
          window.history.pushState(null, '', url)
          Router.replace(Router.asPath, Router.asPath, { shallow: true });
          console.log("hererer")
          return false
        }
      }
      return true
    })

    return () => {
      Router.events.off('routeChangeStart', routeChangeStart)
      window.removeEventListener('beforeunload', beforeUnload , {capture: true})
      Router.beforePopState(() => {
        return true
      })
    }
  }, [mess, shouldWarn, isOnPost])
}