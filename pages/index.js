import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, { useEffect, useState } from "react"

export default function Home() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    document.addEventListener('message', ({data}) => {
      setMessage(data)
    })

  }, [])
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h3>Receive Message : {message}</h3>
    </div>
  )
}
