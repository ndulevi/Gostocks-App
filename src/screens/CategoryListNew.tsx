import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Pressable, FlatList, Modal, Alert } from 'react-native'
import { COLORS } from '../constants'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootNavParamList } from '../types'
import { getCategories, deleteCategory, updateCategory } from '../database/db'
import FormInput from '../components/FormInput'
import { SafeAreaView } from 'react-native-safe-area-context'

type Category = { id: number; name: string }

type NavProp = NativeStackNavigationProp<RootNavParamList>

const Separator = () => <View style={styles.sep} />


const EmptyList: React.FC = () => (
  <View style={styles.emptyBox}>
    <Text style={styles.emptyText}>No items yet</Text>
  </View>
)

const CategoryListNew: React.FC = () => {
  const navigation = useNavigation<NavProp>()
  const isFocused = useIsFocused()
  const [items, setItems] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)

  const [editing, setEditing] = useState<Category | null>(null)
  const [editingName, setEditingName] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const rows: any = await getCategories()
      let entries: any[] = []

      if (!rows) {
        entries = []
      } else if (Array.isArray(rows)) {
        entries = rows
      } else if (rows && Array.isArray(rows._array)) {
        // some sqlite wrappers expose rows._array
        entries = rows._array
      } else if (rows && typeof rows.item === 'function' && typeof rows.length === 'number') {
        // rows.item(i) accessor (common shape)
        for (let i = 0; i < rows.length; i++) {
          try {
            const it = rows.item(i)
            if (it) entries.push(it)
          } catch {
            // ignore
          }
        }
      } else if (typeof rows === 'object') {
        // fallback: object -> values (may include metadata; will be filtered)
        entries = Object.values(rows)
      }

      // keep only objects that look like rows (have id or name)
      const good = entries.filter((e) => e && typeof e === 'object' && (e.id !== undefined || e.name !== undefined))
      const mapped: Category[] = good.map((r: any, idx: number) => ({ id: Number(r.id) || idx, name: r.name != null ? String(r.name) : '' }))

      // dedupe by id
      const seen = new Set<number>()
      const data: Category[] = mapped.filter((it) => {
        if (seen.has(it.id)) return false
        seen.add(it.id)
        return true
      })
      setItems(data)
    } catch (err) {
      console.warn('Load categories error', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isFocused) load()
  }, [isFocused])

  const onDelete = (id: number) => {
    Alert.alert('Delete', 'Are you sure you want to delete this category?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await deleteCategory(id)
        load()
      } }
    ])
  }

  const openEdit = (item: Category) => {
    setEditing(item)
    setEditingName(String(item.name ?? ''))
  }

  const saveEdit = async () => {
    if (!editing) return
    if (!editingName.trim()) {
      Alert.alert('Validation', 'Name cannot be empty')
      return
    }
    try {
      await updateCategory(editing.id, editingName.trim())
      setEditing(null)
      setEditingName('')
      load()
    } catch (err: any) {
      console.warn('Update error', err)
      Alert.alert('Error', err?.message || 'Unable to update category')
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.navigate('MainTab')} style={styles.backBtn}>
          <Text style={styles.backText}>Back to Home</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('AddCategory')} style={styles.addBtn}>
          <Text style={styles.addText}>+ Add</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>Categories</Text>

      <FlatList
        data={items}
        keyExtractor={(item, index) => (item.id !== undefined && item.id !== null ? String(item.id) : `cat-${index}`)}
        contentContainerStyle={styles.list}
        refreshing={loading}
        ListEmptyComponent={EmptyList}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Pressable onPress={() => openEdit(item)} style={styles.rowPressable}>
              <Text style={styles.name}>{String(item.name ?? '')}</Text>
            </Pressable>
            <View style={styles.actionsRow}>
              <Pressable onPress={() => openEdit(item)} style={styles.smallBtn}>
                <Text style={styles.smallBtnText}>Edit</Text>
              </Pressable>
              <Pressable onPress={() => onDelete(item.id)} style={[styles.smallBtn, styles.delBtn]}>
                <Text style={styles.smallBtnText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        )}
        ItemSeparatorComponent={Separator}
      />

      <Modal visible={!!editing} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Category</Text>
            <FormInput label="Name" value={editingName} onChangeText={setEditingName} />
            <View style={styles.modalActions}>
              <Pressable style={[styles.saveButton, styles.saveButtonMargin]} onPress={saveEdit}>
                <Text style={styles.saveText}>Save</Text>
              </Pressable>
              <Pressable style={[styles.saveButton, styles.cancelBtn]} onPress={() => setEditing(null)}>
                <Text style={styles.saveText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default CategoryListNew

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primaryDarkGrey },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, alignItems: 'center' },
  backBtn: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: COLORS.primaryGrey, borderRadius: 4, padding: 8, },
  backText: { color: COLORS.primaryWhite },
  addBtn: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: COLORS.primaryColor, borderRadius: 8 },
  addText: { color: COLORS.primaryWhite, fontWeight: '600' },
  title: { color: COLORS.primaryWhite, fontSize: 20, fontWeight: '700', paddingHorizontal: 16, marginBottom: 8 },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  row: { paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { color: COLORS.primaryWhite, fontSize: 16 },
  chev: { color: 'rgba(255,255,255,0.4)' },
  sep: { height: 1, backgroundColor: 'rgba(255,255,255,0.03)' },
  actionsRow: { flexDirection: 'row', alignItems: 'center' },
  smallBtn: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 8, marginLeft: 8 },
  delBtn: { backgroundColor: '#7a1a1a' },
  smallBtnText: { color: COLORS.primaryWhite },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  modalContent: { backgroundColor: COLORS.primaryDarkGrey, borderRadius: 12, padding: 16 },
  modalTitle: { color: COLORS.primaryWhite, fontSize: 18, fontWeight: '700', marginBottom: 8 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 },
  saveButton: { backgroundColor: COLORS.primaryColor, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  saveButtonMargin: { marginRight: 8 },
  rowPressable: { flex: 1 },
  emptyBox: { padding: 20, alignItems: 'center' },
  emptyText: { color: 'rgba(255,255,255,0.6)' },
  cancelBtn: { backgroundColor: 'rgba(255,255,255,0.08)' },
  saveText: { color: COLORS.primaryWhite, fontWeight: '700' },
})
