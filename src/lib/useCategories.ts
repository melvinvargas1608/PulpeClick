import { useState, useEffect } from 'react';
import { supabaseClient } from './supabase-client';

export interface Category {
  id: string;
  name: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    supabaseClient
      .from('categories')
      .select('*')
      .order('name')
      .then(({ data }) => {
        if (data) setCategories(data);
      });
  }, []);

  return categories;
}
