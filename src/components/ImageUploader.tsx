import React, { useState } from 'react'
import { View, Text, Pressable, Image, StyleSheet, Alert } from 'react-native'
import { launchImageLibrary, launchCamera, ImagePickerResponse, Asset } from 'react-native-image-picker'
import { Camera, Image as ImageIcon } from 'lucide-react-native'
import { MotiView } from 'moti'
import { COLORS } from '../constants'

type Props = {
  selected?: any
  onChange?: (img: any) => void
}


const ImageUploader: React.FC<Props> = ({ selected, onChange }) => {
  const [_loading, setLoading] = useState(false)
  const options = { mediaType: 'photo' as const }

  const openLibrary = async () => {
    setLoading(true)
    launchImageLibrary(options, (res: ImagePickerResponse) => {
      setLoading(false)
      if (res.didCancel) return
      if (res.errorCode) {
        Alert.alert('Error', res.errorMessage || 'Unable to pick image')
        return
      }
      const asset: Asset | undefined = res.assets && res.assets[0]
      if (asset) {
        onChange && onChange(asset.uri ?? asset)
      }
    })
  }

  const openCamera = async () => {
    setLoading(true)
    launchCamera(options, (res: ImagePickerResponse) => {
      setLoading(false)
      if (res.didCancel) return
      if (res.errorCode) {
        Alert.alert('Error', res.errorMessage || 'Unable to take photo')
        return
      }
      const asset: Asset | undefined = res.assets && res.assets[0]
      if (asset) {
        onChange && onChange(asset.uri ?? asset)
      }
    })
  }

  const renderPreview = () => {
    if (!selected) return (
      <View style={styles.empty}>
        <ImageIcon color={COLORS.primaryWhite} size={34} />
        <Text style={styles.emptyText}>No image selected</Text>
      </View>
    )

    const source = typeof selected === 'string' ? { uri: selected } : selected
    return (
      <Image source={source} style={styles.preview} />
    )
  }

  return (
    <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 240 }} style={styles.container}>
      <View style={styles.previewWrapper}>{renderPreview()}</View>

      <View style={styles.actions}>
        <Pressable style={styles.actionBtn} onPress={openLibrary}>
          <Text style={styles.actionText}>Choose from gallery</Text>
        </Pressable>

        <Pressable style={[styles.actionBtn, styles.secondary]} onPress={openCamera}>
          <Camera color={COLORS.primaryWhite} size={14} />
            <Text style={[styles.actionText, styles.actionTextWithIcon]}>Use camera</Text>
        </Pressable>
      </View>
    </MotiView>
  )
}

export default ImageUploader

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  previewWrapper: {
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.primaryGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  empty: {
    alignItems: 'center',
  },
  emptyText: {
    color: 'rgba(255,255,255,0.6)',
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: COLORS.primaryColor,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  secondary: {
    backgroundColor: COLORS.primaryGrey,
  },
  actionText: {
    color: COLORS.primaryWhite,
    fontWeight: '600',
  },
  actionTextWithIcon: {
    marginLeft: 8,
  },
})
