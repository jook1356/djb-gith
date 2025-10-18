'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './Dropdown.module.scss';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  disabled?: boolean;
  divider?: boolean;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  searchable?: boolean;
  multiple?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'outlined' | 'filled';
  maxHeight?: number;
  error?: string;
  label?: string;
  required?: boolean;
  clearable?: boolean;
}

export function Dropdown({
  options,
  value,
  placeholder = '옵션을 선택하세요',
  onChange,
  disabled = false,
  searchable = false,
  multiple = false,
  size = 'medium',
  variant = 'default',
  maxHeight = 300,
  error,
  label,
  required = false,
  clearable = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(
    value ? (multiple ? value.split(',') : [value]) : []
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 드롭다운이 열릴 때 검색 입력에 포커스
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // 필터링된 옵션
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    option.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 선택 핸들러
  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue];
      setSelectedValues(newValues);
      onChange?.(newValues.join(','));
    } else {
      setSelectedValues([optionValue]);
      onChange?.(optionValue);
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  // 클리어 핸들러
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedValues([]);
    onChange?.('');
    setSearchQuery('');
  };

  // 키보드 네비게이션
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        if (!isOpen) {
          e.preventDefault();
          setIsOpen(true);
        } else if (focusedIndex >= 0) {
          e.preventDefault();
          const option = filteredOptions[focusedIndex];
          if (option && !option.disabled) {
            handleSelect(option.value);
          }
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchQuery('');
        break;
      case 'ArrowDown':
        e.preventDefault();
        setIsOpen(true);
        setFocusedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => (prev > 0 ? prev - 1 : 0));
        break;
    }
  };

  // 선택된 라벨 가져오기
  const getSelectedLabel = () => {
    if (selectedValues.length === 0) return placeholder;
    if (multiple) {
      return `${selectedValues.length}개 선택됨`;
    }
    const selected = options.find(opt => opt.value === selectedValues[0]);
    return selected?.label || placeholder;
  };

  const selectedOption = !multiple && selectedValues.length > 0
    ? options.find(opt => opt.value === selectedValues[0])
    : null;

  return (
    <div className={styles.dropdownWrapper}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      
      <div
        ref={dropdownRef}
        className={`
          ${styles.dropdown}
          ${styles[`dropdown-${size}`]}
          ${styles[`dropdown-${variant}`]}
          ${isOpen ? styles.open : ''}
          ${disabled ? styles.disabled : ''}
          ${error ? styles.error : ''}
        `}
      >
        <button
          type="button"
          className={styles.trigger}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <div className={styles.triggerContent}>
            {selectedOption?.icon && (
              <span className={styles.triggerIcon}>{selectedOption.icon}</span>
            )}
            <span className={`${styles.triggerText} ${selectedValues.length === 0 ? styles.placeholder : ''}`}>
              {getSelectedLabel()}
            </span>
          </div>
          
          <div className={styles.triggerActions}>
            {clearable && selectedValues.length > 0 && !disabled && (
              <button
                type="button"
                className={styles.clearButton}
                onClick={handleClear}
                aria-label="Clear selection"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            )}
            <svg
              className={styles.chevron}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M6 8L10 12L14 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </button>

        {isOpen && (
          <div
            className={styles.menu}
            style={{ maxHeight: `${maxHeight}px` }}
            role="listbox"
          >
            {searchable && (
              <div className={styles.searchWrapper}>
                <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="2"/>
                  <path d="M11 11L14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  className={styles.searchInput}
                  placeholder="검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            <div className={styles.optionsList}>
              {filteredOptions.length === 0 ? (
                <div className={styles.emptyState}>
                  <span>결과가 없습니다</span>
                </div>
              ) : (
                filteredOptions.map((option, index) => (
                  <React.Fragment key={option.value}>
                    {option.divider ? (
                      <div className={styles.divider} />
                    ) : (
                      <button
                        type="button"
                        className={`
                          ${styles.option}
                          ${selectedValues.includes(option.value) ? styles.selected : ''}
                          ${option.disabled ? styles.disabled : ''}
                          ${focusedIndex === index ? styles.focused : ''}
                        `}
                        onClick={() => !option.disabled && handleSelect(option.value)}
                        onMouseEnter={() => setFocusedIndex(index)}
                        disabled={option.disabled}
                        role="option"
                        aria-selected={selectedValues.includes(option.value)}
                      >
                        {multiple && (
                          <div className={styles.checkbox}>
                            <input
                              type="checkbox"
                              checked={selectedValues.includes(option.value)}
                              readOnly
                              tabIndex={-1}
                            />
                            <div className={styles.checkboxCustom}>
                              {selectedValues.includes(option.value) && (
                                <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                                  <path
                                    d="M1 5L4.5 8.5L11 1.5"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {option.icon && (
                          <span className={styles.optionIcon}>{option.icon}</span>
                        )}
                        
                        <div className={styles.optionContent}>
                          <span className={styles.optionLabel}>{option.label}</span>
                          {option.description && (
                            <span className={styles.optionDescription}>
                              {option.description}
                            </span>
                          )}
                        </div>

                        {!multiple && selectedValues.includes(option.value) && (
                          <svg className={styles.checkIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path
                              d="M3 8L6.5 11.5L13 4.5"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </button>
                    )}
                  </React.Fragment>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
}

