import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function useOnRouteChange(handleOnLoad) {
    const router = useRouter()
    useEffect(() => {
        router.events.on('routeChangeStart', handleOnLoad)
        return () => {
            router.events.off('routeChangeStart', handleOnLoad)
        }
    }, [])
}