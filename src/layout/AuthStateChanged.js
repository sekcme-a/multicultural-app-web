import { auth } from "firebase/firebase";
import { useEffect, useState } from "react";
import useAuth from "src/hook/auth";


export default function AuthStateChanged({ children }) {
  const { setUser, setUserrole } = useAuth();
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
      setUserrole(null)
      setIsLoading(false)
    })
    //eslint-disable-next-line
  }, []);

  if (isLoading) {
    return <div></div>
  }

  return children;
}