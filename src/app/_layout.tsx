import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { BrandedSplash } from '@/components/branded-splash'
import { palette } from '@/constants/design'

SplashScreen.preventAutoHideAsync()
SplashScreen.setOptions({ duration: 350, fade: true })

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 60_000, retry: 1 } },
      })
  )

  useEffect(() => {
    SplashScreen.hide()
    const timer = setTimeout(() => setShowSplash(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (showSplash) return <BrandedSplash />

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: palette.background },
            animation: 'slide_from_right',
          }}
        />
      </QueryClientProvider>
    </SafeAreaProvider>
  )
}
