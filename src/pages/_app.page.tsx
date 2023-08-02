import { globalStyles } from '@/styles/global'
import type { AppProps } from 'next/app'

// outside App component to load it only once (it would load again if we would access a new page)
globalStyles()

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
