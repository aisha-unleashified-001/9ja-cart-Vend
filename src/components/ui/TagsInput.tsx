import { useState } from 'react';
import type { KeyboardEvent } from 'react';

interface TagsInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  className?: string;
}

export function TagsInput({ 
  tags, 
  onTagsChange, 
  placeholder = "Add tags...", 
  maxTags = 10,
  className = '' 
}: TagsInputProps) {
  const [inputValue, setInputValue] = useState('');

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < maxTags) {
      onTagsChange([...tags, trimmedTag]);
      setInputValue('');
    }
  };

  const removeTag = (indexToRemove: number) => {
    onTagsChange(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const handleInputBlur = () => {
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  };

  const canAddMore = tags.length < maxTags;

  return (
    <div className={className}>
      <div className="min-h-[42px] px-3 py-2 border border-border rounded-md bg-input focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent">
        <div className="flex flex-wrap gap-2">
          {/* Existing Tags */}
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-sm rounded-md"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="ml-1 text-primary/60 hover:text-primary focus:outline-none"
              >
                ×
              </button>
            </span>
          ))}
          
          {/* Input */}
          {canAddMore && (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleInputBlur}
              placeholder={tags.length === 0 ? placeholder : ''}
              className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-foreground placeholder-muted-foreground"
            />
          )}
        </div>
      </div>
      
      {/* Helper Text */}
      <div className="flex justify-between mt-1">
        <p className="text-xs text-muted-foreground">
          Press Enter or comma to add tags
        </p>
        <p className="text-xs text-muted-foreground">
          {tags.length}/{maxTags}
        </p>
      </div>
    </div>
  );
}