import Head from 'next/head'
import Image from 'next/image'
import { signIn, useSession, signOut } from "next-auth/react";
import styles from '../styles/Home.module.css'
import React, { useEffect } from "react"

const Home = () => {
  const { data, status } = useSession();

  // useEffect(() => {
  //   if (data!=undefined) {
  //   console.log(data)
  //   console.log(data.user)
  //   }
  // },[data])
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <p>status: {status}</p>
        <p>{data?.user?.name}</p>
        {data?.user ? (
          <button type="button" onClick={() => signOut()}>
            Google Logout
          </button>
        ) : (
          <button type="button" onClick={() => signIn("google")}>
            Google Login
          </button>
        )} 
      </main>
    </div>
  )
}

export default Home