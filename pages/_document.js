import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Inter&display=optional"
            rel="stylesheet"
          />
        </Head>
        <body className="h-full">
            <div className="container mx-auto">
              <Main />
          </div>
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument