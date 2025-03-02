import DOMPurify from 'dompurify';
import { FlowchartData } from '../types';
import { APP_CONFIG } from '../config/appConfig';
import { debounceFlowchartData } from '../utils/helpers';

// Local storage key from application config
const STORAGE_KEY = APP_CONFIG.storage.localStorageKey;

// Version marker to ensure compatibility between saved data versions
const STORAGE_VERSION = APP_CONFIG.version;

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

/**
 * Save flowchart data to local storage
 */
export const saveToLocalStorage = (data: FlowchartData): void => {
  if (!APP_CONFIG.features.enableLocalStorage) return;
  
  try {
    // Add metadata if it doesn't exist
    const dataWithMetadata: FlowchartData = {
      ...data,
      metadata: {
        ...(data.metadata || {}),
        updatedAt: Date.now(),
        version: STORAGE_VERSION
      }
    };
    
    const sanitizedData = sanitizeData(dataWithMetadata) as FlowchartData;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedData));
  } catch (error) {
    // In production, we would log this to a monitoring service
    if (import.meta.env.DEV) {
      console.error('Error saving to localStorage:', error);
    }
  }
};

// Create a debounced save function using the specialized function
export const debouncedSave = debounceFlowchartData(
  saveToLocalStorage, 
  APP_CONFIG.performance.autoSaveDebounce
);

/**
 * Load flowchart data from local storage
 */
export const loadFromLocalStorage = (): FlowchartData | null => {
  if (!APP_CONFIG.features.enableLocalStorage) return null;
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    
    const parsedData = JSON.parse(data) as FlowchartData;
    
    // Check for version compatibility
    const dataVersion = parsedData.metadata?.version || '0.0.0';
    if (dataVersion !== STORAGE_VERSION && import.meta.env.DEV) {
      console.warn(`Data version mismatch: ${dataVersion} vs ${STORAGE_VERSION}`);
    }
    
    return parsedData;
  } catch (error) {
    // In production, we would log this to a monitoring service
    if (import.meta.env.DEV) {
      console.error('Error loading from localStorage:', error);
    }
    return null;
  }
};

/**
 * Generate a shareable link for the flowchart
 */
export const generateShareableLink = (data: FlowchartData): string => {
  if (!APP_CONFIG.features.enableSharing) {
    throw new Error('Sharing feature is disabled');
  }
  
  try {
    // Add metadata if it doesn't exist
    const dataWithMetadata: FlowchartData = {
      ...data,
      metadata: {
        ...(data.metadata || {}),
        updatedAt: Date.now(),
        version: STORAGE_VERSION
      }
    };
    
    const sanitizedData = sanitizeData(dataWithMetadata) as FlowchartData;
    const compressedData = JSON.stringify(sanitizedData);
    const encodedData = encodeURIComponent(compressedData);
    
    // Create a hash-based URL
    return `${window.location.origin}${window.location.pathname}#data=${encodedData}`;
  } catch (error) {
    // In production, we would log this to a monitoring service
    if (import.meta.env.DEV) {
      console.error('Error generating shareable link:', error);
    }
    return window.location.href;
  }
};

/**
 * Load flowchart data from a shareable link
 */
export const loadFromShareableLink = (): FlowchartData | null => {
  if (!APP_CONFIG.features.enableSharing) return null;
  
  try {
    const hash = window.location.hash;
    if (!hash || !hash.includes('#data=')) return null;
    
    const encodedData = hash.replace('#data=', '');
    const decodedData = decodeURIComponent(encodedData);
    
    return JSON.parse(decodedData) as FlowchartData;
  } catch (error) {
    // In production, we would log this to a monitoring service
    if (import.meta.env.DEV) {
      console.error('Error loading from shareable link:', error);
    }
    return null;
  }
};