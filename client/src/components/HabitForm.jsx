import React, { useState } from 'react';

export default function HabitForm({ onAdd, disabled = false }) {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (!title.trim() || isSubmitting || disabled) return;
    
    setIsSubmitting(true);
    
    try {
      await onAdd(title.trim());
      setTitle('');
    } catch (error) {
      console.error('Failed to add habit:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  }

  const isDisabled = disabled || isSubmitting || !title.trim();

  return (
    <div style={{ display: 'flex', gap: 8, margin: '12px 0 8px' }}>
      <input
        className="input"
        placeholder="e.g., Read 20 minutes"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={disabled || isSubmitting}
        maxLength={100}
      />
      <button
        className="button primary"
        onClick={handleSubmit}
        disabled={isDisabled}
        style={{
          opacity: isDisabled ? 0.6 : 1,
          cursor: isDisabled ? 'not-allowed' : 'pointer'
        }}
      >
        {isSubmitting ? 'Adding...' : 'Add'}
      </button>
    </div>
  );
}