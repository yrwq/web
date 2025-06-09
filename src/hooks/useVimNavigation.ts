'use client';

import { useEffect, useState, useCallback } from 'react';

interface VimState {
  mode: 'normal' | 'visual';
  count: string;
  showStatus: boolean;
}

export const useVimNavigation = () => {
  const [state, setState] = useState<VimState>({
    mode: 'normal',
    count: '',
    showStatus: false
  });

  const getCount = useCallback(() => {
    const num = parseInt(state.count) || 1;
    setState(prev => ({ ...prev, count: '', showStatus: true }));
    return num;
  }, [state.count]);

  // Helper to check if we should ignore the event (when focus is in input elements)
  const shouldIgnoreEvent = useCallback((e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    const tagName = target.tagName.toLowerCase();
    return tagName === 'input' || 
           tagName === 'textarea' || 
           target.isContentEditable ||
           (target.getAttribute('role') === 'textbox');
  }, []);

  const getScrollableElement = useCallback(() => {
    // Target the main element which has overflow-auto
    return document.querySelector('main') as HTMLElement;
  }, []);

  const handleCommand = useCallback((e: KeyboardEvent) => {
    // Don't handle events when in input fields or when modifier keys are pressed
    if (shouldIgnoreEvent(e) || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
    
    const key = e.key;
    const scrollAmount = 50;
    const scrollableElement = getScrollableElement();
    
    if (!scrollableElement) {
      console.error('No scrollable element found');
      return;
    }

    // Handle numeric input for count
    if (key >= '0' && key <= '9') {
      e.preventDefault();
      setState(prev => ({
        ...prev,
        count: prev.count + key,
        showStatus: true
      }));
      return;
    }

    // Only handle vim navigation keys
    switch (key) {
      case 'j':
      case 'k':
      case 'g':
      case 'G':
      case 'd':
      case 'u':
        e.preventDefault();
        break;
      default:
        return; // Ignore all other keys
    }

    // Handle vim navigation keys
    switch (key) {
      case 'j':
        scrollableElement.scrollBy({
          top: scrollAmount * getCount(),
          behavior: 'smooth'
        });
        break;
      case 'k':
        scrollableElement.scrollBy({
          top: -scrollAmount * getCount(),
          behavior: 'smooth'
        });
        break;
      case 'g':
        scrollableElement.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        break;
      case 'G':
        scrollableElement.scrollTo({
          top: scrollableElement.scrollHeight,
          behavior: 'smooth'
        });
        break;
      case 'd':
        scrollableElement.scrollBy({
          top: (scrollableElement.clientHeight / 2) * getCount(),
          behavior: 'smooth'
        });
        break;
      case 'u':
        scrollableElement.scrollBy({
          top: -(scrollableElement.clientHeight / 2) * getCount(),
          behavior: 'smooth'
        });
        break;
    }
  }, [getCount, shouldIgnoreEvent, getScrollableElement]);

  useEffect(() => {
    // Debug log to confirm hook is running
    console.log('Vim navigation hook initialized');
    
    // Add event listener only for keydown
    window.addEventListener('keydown', handleCommand);

    return () => {
      window.removeEventListener('keydown', handleCommand);
    };
  }, [handleCommand]);

  useEffect(() => {
    if (state.showStatus) {
      const timer = setTimeout(() => {
        setState(prev => ({ ...prev, showStatus: false }));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.showStatus, state.count]);

  return {
    mode: state.mode,
    count: state.count,
    showStatus: state.showStatus
  };
};