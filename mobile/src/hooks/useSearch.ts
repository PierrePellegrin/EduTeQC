import { useState, useMemo } from 'react';

/**
 * Hook générique pour filtrer une liste d'items selon une recherche
 * 
 * @param items - La liste d'items à filtrer
 * @param searchFields - Les champs à utiliser pour la recherche
 * @returns Un objet contenant la query, le setter et les items filtrés
 * 
 * @example
 * const { searchQuery, setSearchQuery, filteredItems } = useSearch(
 *   courses,
 *   ['title', 'description', 'category']
 * );
 */
export function useSearch<T extends Record<string, any>>(
  items: T[] | undefined,
  searchFields: (keyof T)[]
) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    if (!items) return [];
    if (!searchQuery.trim()) return items;

    const lowerQuery = searchQuery.toLowerCase();

    return items.filter((item) => {
      return searchFields.some((field) => {
        const value = item[field];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(lowerQuery);
      });
    });
  }, [items, searchQuery, searchFields]);

  return {
    searchQuery,
    setSearchQuery,
    filteredItems,
  };
}
