import React, { useState } from 'react'
import { StyleSheet, Text, Pressable, Alert } from 'react-native'
import FormInput from '../components/FormInput'
import { COLORS } from '../constants'
import { addCategory } from '../database/db'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootNavParamList } from '../types'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MotiView } from 'moti'

type Props = NativeStackScreenProps<RootNavParamList, 'AddCategory'>

const AddCategory: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('')

  const onSave = () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Please enter a category name')
      return
    }
    ;(async () => {
      try {
  await addCategory(name.trim())
  Alert.alert('Saved', `${name} saved.`)
  navigation.navigate('CategoryList')
      } catch (err: any) {
        console.warn('DB error', err)
        Alert.alert('Error', err?.message || 'Unable to save category')
      }
    })()
  }

  return (
    <SafeAreaView style={styles.container}>
      <MotiView
      from={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 50,
        delay: 150,
      }}
      >
        <Text style={styles.title}>Add Category</Text>

        <FormInput label="Name" value={name} placeholder="e.g. Snacks" onChangeText={setName} />

        <Pressable style={styles.saveButton} onPress={onSave}>
            <Text style={styles.saveText}>Save</Text>
        </Pressable>
      </MotiView>
    </SafeAreaView>
  )
}

export default AddCategory

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryDarkGrey,
    padding: 16,
  },
  title: {
    color: COLORS.primaryWhite,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  saveButton: {
    marginTop: 18,
    backgroundColor: COLORS.primaryColor,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveText: {
    color: COLORS.primaryWhite,
    fontWeight: '600',
    fontSize: 16,
  },
})
