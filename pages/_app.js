import '../styles/globals.css'
import 'styles/loader.css'
import { AuthProvider } from "src/hook/auth"
import AuthStateChanged from 'src/layout/AuthStateChanged'
import React, { useEffect, useState } from "react"
import Header from "src/components/main/Header"
import Footer from "src/components/main/Footer"

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
        <Footer />
      </AuthStateChanged>
    </AuthProvider>
  )
}

export default MyApp
