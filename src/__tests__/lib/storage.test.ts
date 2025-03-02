import { saveToLocalStorage, loadFromLocalStorage, generateShareableLink } from '../../lib/storage';
import { FlowchartData, Node } from '../../types';

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

  const mockNode: Node = {
    id: 'node1',
    type: 'rectangle',
    text: 'Node 1',
    position: { x: 100, y: 100 },
    style: {
      fill: '#ffffff',
      stroke: '#2A2A2A',
      strokeWidth: 1
    },
    width: 150,
    height: 80
  };

  const mockFlowchartData: FlowchartData = {
    nodes: [mockNode],
    connections: [],
    metadata: {
      title: 'Test Flowchart',
      createdAt: 1672531200000, // 2023-01-01T00:00:00.000Z
    }
  };

  it('should save and load data from localStorage', () => {
    saveToLocalStorage(mockFlowchartData);
    
    const loadedData = loadFromLocalStorage();
    
    // Verify basic structure but ignore metadata.updatedAt and metadata.version which are added by the implementation
    expect(loadedData).toMatchObject({
      nodes: mockFlowchartData.nodes,
      connections: mockFlowchartData.connections,
    });
    
    // Verify metadata exists but don't check specific values for updatedAt and version
    expect(loadedData).toHaveProperty('metadata');
    expect(loadedData?.metadata).toHaveProperty('updatedAt');
    expect(loadedData?.metadata).toHaveProperty('version');
    
    // Check that original metadata is preserved
    expect(loadedData?.metadata?.title).toBe(mockFlowchartData.metadata?.title);
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
    
    // Extract and parse the data from the link
    const encodedData = link.split('#data=')[1];
    const decodedData = JSON.parse(decodeURIComponent(encodedData));
    
    // Verify the data structure but ignore metadata.updatedAt and metadata.version
    expect(decodedData).toMatchObject({
      nodes: mockFlowchartData.nodes,
      connections: mockFlowchartData.connections,
    });
    
    // Verify metadata exists
    expect(decodedData).toHaveProperty('metadata');
    expect(decodedData.metadata).toHaveProperty('title', mockFlowchartData.metadata?.title);
  });
});