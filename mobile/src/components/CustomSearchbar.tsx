import React from 'react';
import { StyleSheet } from 'react-native';
import { Searchbar, SearchbarProps } from 'react-native-paper';

export const CustomSearchbar: React.FC<SearchbarProps> = (props) => {
  return (
    <Searchbar
      {...props}
      style={[styles.searchbar, props.style]}
      inputStyle={[styles.input, props.inputStyle]}
      iconColor={props.iconColor}
    />
  );
};

const styles = StyleSheet.create({
  searchbar: {
    elevation: 2,
    height: 40,
    justifyContent: 'center',
  },
  input: {
    fontSize: 14,
    paddingVertical: 0,
    minHeight: 0,
  },
});
