import '../styles/globals.css'
import 'styles/loader.css'
import { AuthProvider } from "src/hook/auth"
import AuthStateChanged from 'src/layout/AuthStateChanged'
import React, { useEffect, useState } from "react"
import Header from "src/components/main/Header"
import Body from "src/components/main/Body"

function MyApp({ Component, pageProps }) {
  const [selectedCategory, setSelectedCategory] = useState("")

  const onSelectedCategoryChange = (category) => {
    setSelectedCategory(category)
  }
  return (
    <AuthProvider>
      <AuthStateChanged>
        <Header handleChange={onSelectedCategoryChange} selectedCategory={selectedCategory} />
        <Component {...pageProps} />
        <Body selectedCategory={selectedCategory} />
      </AuthStateChanged>
    </AuthProvider>
  )
}

export default MyApp
