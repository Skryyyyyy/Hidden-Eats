import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';

interface Collection {
  id: string;
  title: string;
  description: string;
  count: number;
  is_public: boolean;
}

const MOCK_COLLECTIONS: Collection[] = [
  {
    id: 'col-1',
    title: 'Late Night Secret Biryani Joints',
    description: 'Best midnight spots in Central District open past 2 AM.',
    count: 5,
    is_public: true,
  },
  {
    id: 'col-2',
    title: 'Work-Friendly Quiet Cafes',
    description: 'Great wifi, artisan coffee, and peaceful noise levels.',
    count: 3,
    is_public: true,
  },
  {
    id: 'col-3',
    title: 'Under ₹150 Hidden Gem Lunches',
    description: 'Incredible local meals that cost less than a cup of coffee.',
    count: 8,
    is_public: false,
  },
];

export default function CollectionsTab() {
  const [collections, setCollections] = useState<Collection[]>(MOCK_COLLECTIONS);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleCreateCollection = () => {
    if (!newTitle) return;
    const newCol: Collection = {
      id: `col-${Date.now()}`,
      title: newTitle,
      description: newDesc || 'Curated food list',
      count: 0,
      is_public: true,
    };
    setCollections([newCol, ...collections]);
    setNewTitle('');
    setNewDesc('');
    setShowModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Curated Collections</Text>
            <Text style={styles.subtitle}>Save & share your secret culinary lists</Text>
          </View>
          <TouchableOpacity style={styles.createButton} onPress={() => setShowModal(true)}>
            <Text style={styles.createButtonText}>+ New</Text>
          </TouchableOpacity>
        </View>

        {collections.map((col) => (
          <TouchableOpacity key={col.id} style={styles.card} activeOpacity={0.85}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{col.title}</Text>
              <Text style={styles.cardBadge}>{col.is_public ? '🌐 Public' : '🔒 Private'}</Text>
            </View>
            <Text style={styles.cardDesc}>{col.description}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.cardCount}>📍 {col.count} Restaurants</Text>
              <Text style={styles.shareText}>Share Link 🔗</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal for creating a new collection */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Collection</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Collection Title (e.g. Date Night Gems)"
              placeholderTextColor="#64748b"
              value={newTitle}
              onChangeText={setNewTitle}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Short Description"
              placeholderTextColor="#64748b"
              value={newDesc}
              onChangeText={setNewDesc}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelModalButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.cancelModalText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveModalButton}
                onPress={handleCreateCollection}
              >
                <Text style={styles.saveModalText}>Create Collection</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 2,
  },
  createButton: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 13,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
  },
  cardBadge: {
    fontSize: 11,
    color: '#f59e0b',
    fontWeight: '600',
  },
  cardDesc: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 10,
  },
  cardCount: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
  },
  shareText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 14,
    color: '#ffffff',
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  cancelModalButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  cancelModalText: {
    color: '#94a3b8',
    fontWeight: '600',
  },
  saveModalButton: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  saveModalText: {
    color: '#0f172a',
    fontWeight: '700',
  },
});
