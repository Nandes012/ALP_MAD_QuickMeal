import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { API_BASE_URL } from '@/constants/api';

interface Tool {
  id: string;
  tool_name: string;
  description?: string;
}

export default function AlatPage() {
  const router = useRouter();
  const { recipeId, name } = useLocalSearchParams();
  
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        if (!recipeId) {
          setError("Recipe ID not provided");
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}`);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();
        
        if (result?.success && result.data?.tools) {
          setTools(result.data.tools);
          setError(null);
        } else {
          setError("Failed to load tools");
        }
      } catch (err) {
        console.error("Error fetching tools:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch tools");
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, [recipeId]);

  let content: React.ReactNode;

  if (loading) {
    content = (
      <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 40 }}>
        <ActivityIndicator size="large" color="#9E5F3B" />
      </View>
    );
  } else if (error) {
    content = (
      <View style={styles.card}>
        <Text style={{ color: '#d32f2f', textAlign: 'center', fontSize: 16 }}>
          {error}
        </Text>
      </View>
    );
  } else {
    content = (
      <View style={styles.card}>
        <Text style={styles.infoText}>Peralatan yang harus kamu siapkan:</Text>
        {tools.length > 0 ? (
          tools.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={14} color="white" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemText}>{item.tool_name}</Text>
                {item.description && (
                  <Text style={styles.descriptionText}>{item.description}</Text>
                )}
              </View>
            </View>
          ))
        ) : (
          <Text style={{ color: '#999', textAlign: 'center', marginTop: 20 }}>
            Tidak ada alat tersedia
          </Text>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#5b2f20" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alat Masak {name}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {content}

        {/* Footer spacer */}
        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF8EF' 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 15 
  },
  backButton: {
    padding: 5
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#5b2f20',
    flex: 1,
    textAlign: 'center'
  },
  content: { 
    padding: 20 
  },
  card: { 
    backgroundColor: 'white', 
    borderRadius: 20, 
    padding: 20, 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoText: { 
    fontSize: 14, 
    color: '#9E5F3B', 
    marginBottom: 20, 
    fontWeight: '600' 
  },
  itemRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FDF7F2'
  },
  checkCircle: { 
    width: 22, 
    height: 22, 
    borderRadius: 11, 
    backgroundColor: '#9E5F3B', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 15 
  },
  itemText: { 
    fontSize: 15, 
    color: '#333',
    fontWeight: '500'
  },
  descriptionText: {
    fontSize: 12,
    color: '#9E5F3B',
    marginTop: 4,
    fontWeight: '400'
  }
});