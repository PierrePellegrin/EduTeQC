import React from 'react';
import { Searchbar } from 'react-native-paper';

export const CourseSearchBar = ({ searchQuery, setSearchQuery }: any) => (
  <Searchbar
    placeholder="Rechercher un cours"
    value={searchQuery}
    onChangeText={setSearchQuery}
    style={{ margin: 8 }}
  />
);
