import { useCallback, useEffect, useState } from 'react';
import {
  clearContextItems,
  deleteContextItem,
  getContextItems,
  updateContextItem,
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
  updateItem: (id: string, patch: Partial<ContextItem>) => Promise<void>;
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
      setError(toErrorMessage(storageError, '無法載入已儲存的情境。'));
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
      setError(toErrorMessage(collectionError, '無法收集目前頁面。'));
    }
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    try {
      setError(null);
      setItems(await deleteContextItem(id));
    } catch (deleteError) {
      setError(toErrorMessage(deleteError, '無法刪除此項目。'));
    }
  }, []);

  const clearItems = useCallback(async () => {
    try {
      setError(null);
      await clearContextItems();
      setItems([]);
    } catch (clearError) {
      setError(toErrorMessage(clearError, '無法清空已儲存的情境。'));
    }
  }, []);

  const updateItem = useCallback(async (id: string, patch: Partial<ContextItem>) => {
    try {
      setError(null);
      setItems(await updateContextItem(id, patch));
    } catch (updateError) {
      setError(toErrorMessage(updateError, '無法更新此項目。'));
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
    updateItem,
    reloadItems,
  };
};
