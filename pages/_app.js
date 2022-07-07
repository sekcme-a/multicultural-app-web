import '../styles/globals.css'
import 'styles/loader.css'
import { AuthProvider } from "src/hook/auth"
import AuthStateChanged from 'src/layout/AuthStateChanged'
import React, { useEffect, useState } from "react"
import Header from "src/components/main/Header"
import Footer from "src/components/main/Footer"
import { useRouter } from "next/router"

function MyApp({ Component, pageProps }) {
  const [selectedCategory, setSelectedCategory] = useState("")
  const router = useRouter()

  const onSelectedCategoryChange = (category) => {
    setSelectedCategory(category)
  }
  return (
    <AuthProvider>
      <AuthStateChanged>
        <Header handleChange={onSelectedCategoryChange} selectedCategory={selectedCategory} />
        <div className="body_container">
          <Component {...pageProps} />
        </div>
        {!router.pathname.includes("rhksflwk") && <Footer />}
      </AuthStateChanged>
    </AuthProvider>
  )
}

export default MyApp
