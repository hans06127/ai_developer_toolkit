import type { ContextItem } from '../types/context';

const STORAGE_KEY = 'contextItems';

const readStorage = <T>(key: string): Promise<T | undefined> =>
  new Promise((resolve, reject) => {
    chrome.storage.local.get(key, (result) => {
      const error = chrome.runtime.lastError;

      if (error) {
        reject(new Error(error.message));
        return;
      }

      resolve(result[key] as T | undefined);
    });
  });

const writeStorage = <T>(key: string, value: T): Promise<void> =>
  new Promise((resolve, reject) => {
    chrome.storage.local.set({ [key]: value }, () => {
      const error = chrome.runtime.lastError;

      if (error) {
        reject(new Error(error.message));
        return;
      }

      resolve();
    });
  });

export const getContextItems = async (): Promise<ContextItem[]> => {
  const items = await readStorage<ContextItem[]>(STORAGE_KEY);
  return Array.isArray(items) ? items : [];
};

export const saveContextItems = (items: ContextItem[]): Promise<void> =>
  writeStorage(STORAGE_KEY, items);

export const addContextItem = async (item: ContextItem): Promise<ContextItem[]> => {
  const items = await getContextItems();
  const nextItems = [item, ...items];
  await saveContextItems(nextItems);
  return nextItems;
};

export const deleteContextItem = async (id: string): Promise<ContextItem[]> => {
  const items = await getContextItems();
  const nextItems = items.filter((item) => item.id !== id);
  await saveContextItems(nextItems);
  return nextItems;
};

export const clearContextItems = (): Promise<void> => saveContextItems([]);
