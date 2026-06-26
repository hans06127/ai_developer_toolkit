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

const migrateContextItem = (item: Partial<ContextItem>): ContextItem => ({
  id: item.id ?? crypto.randomUUID(),
  title: item.title ?? '未命名頁面',
  url: item.url ?? '',
  selectedText: item.selectedText,
  note: item.note,
  sourceType: item.sourceType ?? 'webpage',
  tags: Array.isArray(item.tags) ? item.tags : [],
  createdAt: item.createdAt ?? new Date().toISOString(),
  updatedAt: item.updatedAt,
});

export const getContextItems = async (): Promise<ContextItem[]> => {
  const items = await readStorage<Partial<ContextItem>[]>(STORAGE_KEY);
  return Array.isArray(items) ? items.map(migrateContextItem) : [];
};

export const saveContextItems = (items: ContextItem[]): Promise<void> =>
  writeStorage(STORAGE_KEY, items);

export const addContextItem = async (item: ContextItem): Promise<ContextItem[]> => {
  const items = await getContextItems();
  const nextItems = [item, ...items];
  await saveContextItems(nextItems);
  return nextItems;
};

export const updateContextItem = async (id: string, patch: Partial<ContextItem>): Promise<ContextItem[]> => {
  const items = await getContextItems();
  const nextItems = items.map((item) =>
    item.id === id ? { ...item, ...patch, updatedAt: new Date().toISOString() } : item,
  );
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
