import { useMemo, useState } from 'react';
import { useContextItems } from '../hooks/useContextItems';
import { generateMarkdown } from '../services/markdownService';
import type { ContextItem } from '../types/context';
import { formatDisplayDate } from '../utils/date';
import { truncateText } from '../utils/text';

type ToastKind = 'success' | 'error';

interface ToastState {
  kind: ToastKind;
  message: string;
}

const showLimitedText = (value: string): string => truncateText(value, 150);

const ContextItemCard = ({
  item,
  onDelete,
}: {
  item: ContextItem;
  onDelete: (id: string) => Promise<void>;
}) => (
  <article className="context-card">
    <div className="context-card__header">
      <h2 title={item.title}>{item.title || 'Untitled Page'}</h2>
      <button className="icon-button" type="button" title="Delete item" onClick={() => void onDelete(item.id)}>
        ×
      </button>
    </div>
    <a href={item.url} target="_blank" rel="noreferrer" title={item.url}>
      {item.url}
    </a>
    <time dateTime={item.createdAt}>{formatDisplayDate(item.createdAt)}</time>
    {item.selectedText ? <p>{showLimitedText(item.selectedText)}</p> : null}
  </article>
);

export const PopupApp = () => {
  const { items, isLoading, error, addCurrentPage, deleteItem, clearItems } = useContextItems();
  const [toast, setToast] = useState<ToastState | null>(null);
  const markdown = useMemo(() => generateMarkdown(items), [items]);

  const showToast = (nextToast: ToastState): void => {
    setToast(nextToast);
    window.setTimeout(() => setToast(null), 2800);
  };

  const handleAddCurrentPage = async (): Promise<void> => {
    await addCurrentPage();
  };

  const handleDelete = async (id: string): Promise<void> => {
    await deleteItem(id);
  };

  const handleClear = async (): Promise<void> => {
    await clearItems();
  };

  const handleCopyMarkdown = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(markdown);
      showToast({ kind: 'success', message: 'Markdown copied.' });
    } catch {
      showToast({ kind: 'error', message: 'Copy failed.' });
    }
  };

  return (
    <main className="popup-shell">
      <header className="popup-header">
        <div>
          <p className="eyebrow">AI Developer Toolkit</p>
          <h1>Context Collector</h1>
        </div>
        <span className="count-pill">{items.length}</span>
      </header>

      <section className="actions" aria-label="Context actions">
        <button type="button" className="primary-button" onClick={() => void handleAddCurrentPage()}>
          Collect Page
        </button>
        <button type="button" onClick={() => void handleCopyMarkdown()} disabled={items.length === 0}>
          Copy Markdown
        </button>
        <button type="button" onClick={() => void handleClear()} disabled={items.length === 0}>
          Clear
        </button>
      </section>

      {error ? <div className="notice notice--error">{error}</div> : null}
      {toast ? <div className={`notice notice--${toast.kind}`}>{toast.message}</div> : null}

      <section className="content-list" aria-label="Collected context">
        {isLoading ? <p className="empty-state">Loading context...</p> : null}
        {!isLoading && items.length === 0 ? <p className="empty-state">No context collected yet.</p> : null}
        {items.map((item) => (
          <ContextItemCard key={item.id} item={item} onDelete={handleDelete} />
        ))}
      </section>
    </main>
  );
};
