import { useMemo, useState } from 'react';
import { useContextItems } from '../hooks/useContextItems';
import { generateMarkdown } from '../services/markdownService';
import { SOURCE_TYPES, type ContextItem, type SourceType } from '../types/context';
import { t } from '../i18n';
import { formatDisplayDate } from '../utils/date';
import { formatTags, parseTags } from '../utils/tags';
import { truncateText } from '../utils/text';

type ToastKind = 'success' | 'error';

interface ToastState {
  kind: ToastKind;
  message: string;
}

const sourceTypeLabels: Record<SourceType, string> = {
  webpage: '網頁',
  article: '文章',
  documentation: '文件',
  issue: 'Issue / PR',
  code: '程式碼',
  note: '筆記',
  other: '其他',
};

const showLimitedText = (value: string): string => truncateText(value, 150);

const ContextItemCard = ({
  item,
  onDelete,
  onUpdate,
}: {
  item: ContextItem;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, patch: Partial<ContextItem>) => Promise<void>;
}) => {
  const [note, setNote] = useState(item.note ?? '');
  const [tags, setTags] = useState(formatTags(item.tags));
  const [sourceType, setSourceType] = useState<SourceType>(item.sourceType);

  const handleSave = async (): Promise<void> => {
    await onUpdate(item.id, {
      note: note.trim() || undefined,
      tags: parseTags(tags),
      sourceType,
    });
  };

  return (
    <article className="context-card">
      <div className="context-card__header">
        <div>
          <span className="source-pill">{sourceTypeLabels[item.sourceType]}</span>
          <h2 title={item.title}>{item.title || t.untitledPage}</h2>
        </div>
        <button className="icon-button" type="button" title={t.deleteItem} onClick={() => void onDelete(item.id)}>
          ×
        </button>
      </div>
      {item.url ? (
        <a href={item.url} target="_blank" rel="noreferrer" title={item.url}>
          {item.url}
        </a>
      ) : null}
      <time dateTime={item.createdAt}>{formatDisplayDate(item.createdAt)}</time>
      {item.selectedText ? <p className="quote-preview">{showLimitedText(item.selectedText)}</p> : null}
      <div className="card-fields">
        <label>
          {t.sourceTypeLabel}
          <select value={sourceType} onChange={(event) => setSourceType(event.target.value as SourceType)}>
            {SOURCE_TYPES.map((type) => (
              <option key={type} value={type}>
                {sourceTypeLabels[type]}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t.tags}
          <input value={tags} placeholder={t.tagsPlaceholder} onChange={(event) => setTags(event.target.value)} />
        </label>
        <label>
          {t.note}
          <textarea value={note} placeholder={t.notePlaceholder} onChange={(event) => setNote(event.target.value)} />
        </label>
        <button type="button" onClick={() => void handleSave()}>
          {t.saveDetails}
        </button>
      </div>
    </article>
  );
};

export const PopupApp = () => {
  const { items, isLoading, error, addCurrentPage, deleteItem, clearItems, updateItem } = useContextItems();
  const [toast, setToast] = useState<ToastState | null>(null);
  const markdown = useMemo(() => generateMarkdown(items), [items]);

  const showToast = (nextToast: ToastState): void => {
    setToast(nextToast);
    window.setTimeout(() => setToast(null), 2800);
  };

  const handleCopyMarkdown = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(markdown);
      showToast({ kind: 'success', message: t.markdownCopied });
    } catch {
      showToast({ kind: 'error', message: t.copyFailed });
    }
  };

  return (
    <main className="popup-shell">
      <header className="popup-header">
        <div>
          <p className="eyebrow">{t.appEyebrow}</p>
          <h1>{t.appTitle}</h1>
        </div>
        <span className="count-pill">{items.length}</span>
      </header>

      <section className="actions" aria-label="情境操作">
        <button type="button" className="primary-button" onClick={() => void addCurrentPage()}>
          {t.collectPage}
        </button>
        <button type="button" onClick={() => void handleCopyMarkdown()} disabled={items.length === 0}>
          {t.copyMarkdown}
        </button>
        <button type="button" onClick={() => void clearItems()} disabled={items.length === 0}>
          {t.clear}
        </button>
      </section>

      {error ? <div className="notice notice--error">{error}</div> : null}
      {toast ? <div className={`notice notice--${toast.kind}`}>{toast.message}</div> : null}

      <section className="content-list" aria-label="已收集情境">
        {isLoading ? <p className="empty-state">{t.loading}</p> : null}
        {!isLoading && items.length === 0 ? <p className="empty-state">{t.empty}</p> : null}
        {items.map((item) => (
          <ContextItemCard key={item.id} item={item} onDelete={deleteItem} onUpdate={updateItem} />
        ))}
      </section>
    </main>
  );
};
