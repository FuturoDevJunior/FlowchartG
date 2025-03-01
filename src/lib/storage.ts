import DOMPurify from 'dompurify';
import { FlowchartData } from '../types';

// Local storage key
const STORAGE_KEY = 'flowchart_saas_data';

// Sanitize data before storing
const sanitizeData = (data: unknown): unknown => {
  if (typeof data === 'string') {
    return DOMPurify.sanitize(data);
  }
  
  if (Array.isArray(data)) {
    return data.map(sanitizeData);
  }
  
  if (data !== null && typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        DOMPurify.sanitize(key),
        sanitizeData(value),
      ])
    );
  }
  
  return data;
};

export const saveToLocalStorage = (data: FlowchartData): void => {
  try {
    const sanitizedData = sanitizeData(data) as FlowchartData;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedData));
  } catch (error) {
    // In production, we would log this to a monitoring service
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('Error saving to localStorage:', error);
    }
  }
};

export const loadFromLocalStorage = (): FlowchartData | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    
    return JSON.parse(data) as FlowchartData;
  } catch (error) {
    // In production, we would log this to a monitoring service
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('Error loading from localStorage:', error);
    }
    return null;
  }
};

export const generateShareableLink = (data: FlowchartData): string => {
  try {
    const sanitizedData = sanitizeData(data) as FlowchartData;
    const compressedData = JSON.stringify(sanitizedData);
    const encodedData = encodeURIComponent(compressedData);
    
    // Create a hash-based URL
    return `${window.location.origin}${window.location.pathname}#data=${encodedData}`;
  } catch (error) {
    // In production, we would log this to a monitoring service
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('Error generating shareable link:', error);
    }
    return window.location.href;
  }
};

export const loadFromShareableLink = (): FlowchartData | null => {
  try {
    const hash = window.location.hash;
    if (!hash || !hash.includes('#data=')) return null;
    
    const encodedData = hash.replace('#data=', '');
    const decodedData = decodeURIComponent(encodedData);
    
    return JSON.parse(decodedData) as FlowchartData;
  } catch (error) {
    // In production, we would log this to a monitoring service
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('Error loading from shareable link:', error);
    }
    return null;
  }
};