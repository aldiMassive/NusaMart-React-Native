import { StyleSheet, View } from 'react-native'

import { palette } from '@/constants/design'

export function DefaultAvatar({ size = 40 }: { size?: number }) {
  const headSize = Math.round(size * 0.32)
  const bodyWidth = Math.round(size * 0.7)

  return (
    <View
      accessibilityLabel="Avatar default"
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2 },
      ]}>
      <View
        style={[
          styles.head,
          {
            top: size * 0.2,
            width: headSize,
            height: headSize,
            borderRadius: headSize / 2,
          },
        ]}
      />
      <View
        style={[
          styles.body,
          {
            bottom: -size * 0.1,
            width: bodyWidth,
            height: size * 0.44,
            borderTopLeftRadius: bodyWidth / 2,
            borderTopRightRadius: bodyWidth / 2,
          },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  avatar: {
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: palette.primarySoft,
    borderWidth: 1,
    borderColor: '#CDEBDF',
  },
  head: { position: 'absolute', backgroundColor: palette.primary },
  body: { position: 'absolute', backgroundColor: palette.primary },
})
