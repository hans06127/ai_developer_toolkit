import { useCallback, useEffect, useState } from 'react';
import {
  clearContextItems,
  deleteContextItem,
  getContextItems,
} from '../storage/contextStorage';
import { collectActiveTabContext } from '../services/contextService';
import type { ContextItem } from '../types/context';

interface UseContextItemsResult {
  items: ContextItem[];
  isLoading: boolean;
  error: string | null;
  addCurrentPage: () => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  clearItems: () => Promise<void>;
  reloadItems: () => Promise<void>;
}

const toErrorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error ? error.message : fallback;

export const useContextItems = (): UseContextItemsResult => {
  const [items, setItems] = useState<ContextItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reloadItems = useCallback(async () => {
    try {
      setError(null);
      setItems(await getContextItems());
    } catch (storageError) {
      setError(toErrorMessage(storageError, 'Unable to load saved context.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addCurrentPage = useCallback(async () => {
    try {
      setError(null);
      const item = await collectActiveTabContext();
      setItems((currentItems) => [item, ...currentItems]);
    } catch (collectionError) {
      setError(toErrorMessage(collectionError, 'Unable to collect the current page.'));
    }
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    try {
      setError(null);
      setItems(await deleteContextItem(id));
    } catch (deleteError) {
      setError(toErrorMessage(deleteError, 'Unable to delete this item.'));
    }
  }, []);

  const clearItems = useCallback(async () => {
    try {
      setError(null);
      await clearContextItems();
      setItems([]);
    } catch (clearError) {
      setError(toErrorMessage(clearError, 'Unable to clear saved context.'));
    }
  }, []);

  useEffect(() => {
    void reloadItems();
  }, [reloadItems]);

  return {
    items,
    isLoading,
    error,
    addCurrentPage,
    deleteItem,
    clearItems,
    reloadItems,
  };
};
