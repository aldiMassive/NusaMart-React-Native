import { Image } from 'expo-image'
import { useEffect, useState } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'

import { palette } from '@/constants/design'

export function BrandedSplash() {
  const [progress] = useState(() => new Animated.Value(0))

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 2750,
      useNativeDriver: false,
    }).start()
  }, [progress])

  return (
    <View style={styles.screen}>
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />
      <View style={styles.brand}>
        <Image
          source={require('@/assets/images/nusamart-logo.png')}
          style={styles.logo}
          contentFit="contain"
        />
        <Text style={styles.title}>NusaMart</Text>
        <Text style={styles.tagline}>Lebih Dekat, Lebih Lengkap</Text>
      </View>
      <View style={styles.loaderTrack}>
        <Animated.View
          style={[
            styles.loaderFill,
            {
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ['12%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFCF4',
    overflow: 'hidden',
  },
  glowTop: {
    position: 'absolute',
    top: '28%',
    left: -34,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#E3F7EB',
    opacity: 0.7,
  },
  glowBottom: {
    position: 'absolute',
    right: -48,
    bottom: '30%',
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: '#DDF6EC',
    opacity: 0.75,
  },
  brand: { alignItems: 'center', transform: [{ translateY: -14 }] },
  logo: { width: 126, height: 126 },
  title: {
    marginTop: 10,
    color: palette.ink,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '900',
    letterSpacing: -1,
  },
  tagline: {
    marginTop: 4,
    color: palette.muted,
    fontSize: 14,
    fontWeight: '500',
  },
  loaderTrack: {
    position: 'absolute',
    bottom: 76,
    width: 72,
    height: 4,
    borderRadius: 99,
    overflow: 'hidden',
    backgroundColor: '#CDE9DF',
  },
  loaderFill: {
    height: 4,
    borderRadius: 99,
    backgroundColor: palette.primary,
  },
})
