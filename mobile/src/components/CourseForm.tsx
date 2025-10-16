import React from 'react';
import { View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

export const CourseForm = ({ formData, setFormData, onSubmit, onCancel, isEditing }: any) => (
  <View style={{ padding: 16 }}>
    <TextInput label="Titre" value={formData.title} onChangeText={text => setFormData({ ...formData, title: text })} style={{ marginBottom: 8 }} />
    <TextInput label="Description" value={formData.description} onChangeText={text => setFormData({ ...formData, description: text })} style={{ marginBottom: 8 }} />
    <TextInput label="Catégorie" value={formData.category} onChangeText={text => setFormData({ ...formData, category: text })} style={{ marginBottom: 8 }} />
    <TextInput label="Contenu" value={formData.content} onChangeText={text => setFormData({ ...formData, content: text })} style={{ marginBottom: 8 }} />
    <TextInput label="Image URL" value={formData.imageUrl} onChangeText={text => setFormData({ ...formData, imageUrl: text })} style={{ marginBottom: 8 }} />
    <Button mode="contained" onPress={onSubmit} style={{ marginBottom: 8 }}>{isEditing ? 'Modifier' : 'Créer'}</Button>
    <Button onPress={onCancel}>Annuler</Button>
  </View>
);
