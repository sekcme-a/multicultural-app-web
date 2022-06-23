import { auth } from "firebase/firebase";
import { useEffect, useState } from "react";
import useAuth from "src/hook/auth";


export default function AuthStateChanged({ children }) {
  const { setUser } = useAuth();
  const[isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false)
    })
    //eslint-disable-next-line
  }, []);

  if (isLoading) {
    return <h1>loading...</h1>
  }

  return children;
}