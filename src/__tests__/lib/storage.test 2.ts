import { saveToLocalStorage, loadFromLocalStorage, generateShareableLink } from '../../lib/storage';
import { FlowchartData } from '../../types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Storage utilities', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  const mockFlowchartData: FlowchartData = {
    id: 'test-id',
    name: 'Test Flowchart',
    nodes: [
      {
        id: 'node1',
        type: 'rectangle',
        text: 'Node 1',
        x: 100,
        y: 100,
        width: 150,
        height: 80,
        fill: '#ffffff',
        stroke: '#2A2A2A',
      },
    ],
    connectors: [],
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  };

  it('should save and load data from localStorage', () => {
    saveToLocalStorage(mockFlowchartData);
    
    const loadedData = loadFromLocalStorage();
    
    expect(loadedData).toEqual(mockFlowchartData);
  });

  it('should return null when loading from empty localStorage', () => {
    const loadedData = loadFromLocalStorage();
    
    expect(loadedData).toBeNull();
  });

  it('should generate a shareable link with encoded data', () => {
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        origin: 'https://example.com',
        pathname: '/',
      },
      writable: true,
    });
    
    const link = generateShareableLink(mockFlowchartData);
    
    expect(link).toContain('https://example.com/#data=');
    expect(link).toContain(encodeURIComponent(JSON.stringify(mockFlowchartData)));
  });
});