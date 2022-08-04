import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
  
    return (
      <Html lang="kr">
        <Head>
            <meta charSet="UTF-8" />
            <link rel="icon" href="/favicon.ico" />
          
            <meta httpEquiv="X-UA-Compatible" content="IE=edge"></meta>
            <link rel="canonical" href="https://multicultural-news.netlify.app"></link>
            <meta name="robots" content="index,follow"></meta>
            <meta property="og:type" content="website"></meta>
            <meta property="og:image" content="https://multicultural-news.netlify.app/public/logo.png" />
            <meta property="og:url" content="https://multicultural-news.netlify.app"></meta>
            <meta name="keywords" content="한국다문화뉴스"/>
            
            <meta name="google-site-verification" content="bLFivCjbVcRRhfLlSY8tACo_lPHtIgUdWIMCNKuCH0g" />
          </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument