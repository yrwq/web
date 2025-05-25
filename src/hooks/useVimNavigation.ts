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
    // Don't handle events when in input fields
    if (shouldIgnoreEvent(e)) return;
    
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

    // Handle vim navigation keys
    switch (key) {
      case 'j':
        e.preventDefault();
        scrollableElement.scrollBy({
          top: scrollAmount * getCount(),
          behavior: 'smooth'
        });
        break;
      case 'k':
        e.preventDefault();
        scrollableElement.scrollBy({
          top: -scrollAmount * getCount(),
          behavior: 'smooth'
        });
        break;
      case 'g':
        e.preventDefault();
        scrollableElement.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        break;
      case 'G':
        e.preventDefault();
        scrollableElement.scrollTo({
          top: scrollableElement.scrollHeight,
          behavior: 'smooth'
        });
        break;
      case 'd':
        if (e.ctrlKey) {
          e.preventDefault();
          scrollableElement.scrollBy({
            top: scrollableElement.clientHeight * getCount(),
            behavior: 'smooth'
          });
        } else {
          e.preventDefault();
          scrollableElement.scrollBy({
            top: (scrollableElement.clientHeight / 2) * getCount(),
            behavior: 'smooth'
          });
        }
        break;
      case 'u':
        if (e.ctrlKey) {
          e.preventDefault();
          scrollableElement.scrollBy({
            top: -scrollableElement.clientHeight * getCount(),
            behavior: 'smooth'
          });
        } else {
          e.preventDefault();
          scrollableElement.scrollBy({
            top: -(scrollableElement.clientHeight / 2) * getCount(),
            behavior: 'smooth'
          });
        }
        break;
    }
  }, [getCount, shouldIgnoreEvent, getScrollableElement]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    // Don't handle events when in input fields
    if (shouldIgnoreEvent(e)) return;
  }, [shouldIgnoreEvent]);

  useEffect(() => {
    // Debug log to confirm hook is running
    console.log('Vim navigation hook initialized');
    
    // Add event listeners
    window.addEventListener('keydown', handleCommand);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleCommand);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleCommand, handleKeyUp]);

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