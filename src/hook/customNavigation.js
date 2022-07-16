import { createContext, useState, useEffect, useContext } from "react";

const naviContext = createContext();

export default function useNavi() {
  return useContext(naviContext)
}

export function NaviProvider(props) {
  const [isOnPost, setIsOnPost] = useState(false)
  const [touchStartX, setTouchStartX] = useState()
  const [touchStartY, setTouchStartY] = useState()
  const [touchEndX, setTouchEndX] = useState()
  const [touchEndY, setTouchEndY] = useState()
  const [isSwipeToLeft, setIsSwipeToLeft] = useState(false)
  const [isSwipeToRight, setIsSwipeToRight] = useState(false)
  const [history, setHistory] = useState([])
  const [showId, setShowId] = useState("")
  
  useEffect(() => {
    if (touchStartX - touchEndX > 75 && touchStartY - touchEndY < 23 && touchStartY - touchEndY > -23)
      setIsSwipeToRight(true)
    else if (touchEndX - touchStartX > 75 && touchStartY - touchEndY < 23 && touchStartY - touchEndY > -23)
      setIsSwipeToLeft(true)
    else if (isSwipeToLeft)
      setIsSwipeToLeft(false)
    else if (isSwipeToRight)
      setIsSwipeToRight(false)
  }, [touchEndX])

  
  const pushHistory = (id) => {
    const temp = history
    temp.push(id)
    setHistory(temp)
    setIsOnPost(true)
    console.log(`history: ${history}`)
  }

  const popHistory = () => {
    const temp = history
    temp.pop()
    setHistory(temp)
    if(history.length===0)
      setIsOnPost(false)
  }

  const clearHistory = () => {
    setHistory([])
    setIsOnPost(false)
  }

  useEffect(() => {
    console.log(`isOnPost: ${isOnPost}`) 
    console.log(`history: ${history}`)
    console.log(`isSwipeToRight: ${isSwipeToRight}`)
    console.log(`isSwipeToLeft: ${isSwipeToLeft}`)
  },[isSwipeToLeft,isSwipeToRight,history.length,isOnPost])

  const setTouchStartXY = (x, y) => {
    setTouchStartX(x)
    setTouchStartY(y)
  }
  const setTouchEndXY = (x, y) => {
    setTouchEndX(x)
    setTouchEndY(y)
  }


  const value = {
    isOnPost,
    isSwipeToLeft,
    isSwipeToRight,
    history,
    showId,
    setShowId,
    pushHistory,
    popHistory,
    clearHistory,
    setIsOnPost,
    setTouchStartXY,
    setTouchEndXY,
    setIsSwipeToLeft,
    setIsSwipeToRight,
  }
    
  return <naviContext.Provider value={value} {...props} />
}