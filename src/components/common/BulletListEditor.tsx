import React, { useRef } from 'react';
import { Plus, X } from 'lucide-react';

interface BulletListEditorProps {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  categoryLabel?: string;
}

export const BulletListEditor: React.FC<BulletListEditorProps> = ({
  items,
  onChange,
  placeholder = 'Add a key point or accomplishment...',
  categoryLabel = 'item',
}) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Ensure there's always at least one input row for comfortable typing
  const currentItems = items.length === 0 ? [''] : items;

  const handleItemChange = (index: number, value: string) => {
    const updated = [...currentItems];
    updated[index] = value;
    onChange(updated);
  };

  const handleAddItem = (afterIndex?: number) => {
    const updated = [...currentItems];
    const insertAt = afterIndex !== undefined ? afterIndex + 1 : updated.length;
    updated.splice(insertAt, 0, '');
    onChange(updated);

    setTimeout(() => {
      inputsRef.current[insertAt]?.focus();
    }, 50);
  };

  const handleRemoveItem = (index: number) => {
    if (currentItems.length <= 1) {
      onChange(['']);
      return;
    }
    const updated = currentItems.filter((_, i) => i !== index);
    onChange(updated);

    const nextFocusIndex = Math.max(0, index - 1);
    setTimeout(() => {
      inputsRef.current[nextFocusIndex]?.focus();
    }, 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem(index);
    } else if (e.key === 'Backspace' && currentItems[index] === '' && currentItems.length > 1) {
      e.preventDefault();
      handleRemoveItem(index);
    }
  };

  return (
    <div className="bullet-editor">
      {currentItems.map((item, index) => (
        <div key={index} className="bullet-editor-row">
          <input
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            type="text"
            className="bullet-editor-input"
            value={item}
            onChange={(e) => handleItemChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            placeholder={placeholder}
          />
          {currentItems.length > 1 && (
            <button
              type="button"
              className="bullet-delete-btn"
              onClick={() => handleRemoveItem(index)}
              title="Remove item"
              aria-label="Remove item"
            >
              <X size={16} />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        className="bullet-add-btn"
        onClick={() => handleAddItem()}
      >
        <Plus size={14} />
        <span>Add another {categoryLabel}</span>
      </button>
    </div>
  );
};
