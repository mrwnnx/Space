/// <reference types="@figma/plugin-typings" />

// ─── Types ───────────────────────────────────────────────────────────────────

interface ColorInfo {
  hex: string;
  opacity: number;
  type: string;
}

interface TypographyInfo {
  fontFamily: string;
  fontStyle: string;
  fontSize: number;
  lineHeight: string;
  letterSpacing: string;
  textContent: string;
}

interface LayoutInfo {
  mode: string;
  direction?: string;
  primaryAxisAlign?: string;
  counterAxisAlign?: string;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  itemSpacing?: number;
  wrap?: boolean;
}

interface NodeData {
  id: string;
  name: string;
  type: string;
  width: number;
  height: number;
  fills: ColorInfo[];
  strokes: ColorInfo[];
  opacity: number;
  cornerRadius?: number | string;
  layout?: LayoutInfo;
  typography?: TypographyInfo;
  children?: NodeData[];
}

interface SelectionData {
  hasSelection: boolean;
  nodeCount: number;
  nodes: NodeData[];
}

// ─── Color Helpers ────────────────────────────────────────────────────────────

function pad2(n: number): string {
  const s = n.toString(16);
  return s.length === 1 ? '0' + s : s;
}

function rgbToHex(color: RGB): string {
  return `#${pad2(Math.round(color.r * 255))}${pad2(Math.round(color.g * 255))}${pad2(Math.round(color.b * 255))}`;
}

function extractPaints(paints: ReadonlyArray<Paint> | typeof figma.mixed): ColorInfo[] {
  if (!paints || paints === figma.mixed) return [];
  return (paints as ReadonlyArray<Paint>)
    .filter((p) => p.visible !== false)
    .map((paint) => {
      if (paint.type === 'SOLID') {
        return {
          hex: rgbToHex(paint.color),
          opacity: paint.opacity !== undefined ? paint.opacity : 1,
          type: 'solid',
        };
      }
      return {
        hex: '',
        opacity: paint.opacity !== undefined ? paint.opacity : 1,
        type: paint.type.toLowerCase().replace('_', '-'),
      };
    });
}

// ─── Layout Extraction ────────────────────────────────────────────────────────

function extractLayout(node: FrameNode | ComponentNode | InstanceNode): LayoutInfo {
  const layout: LayoutInfo = { mode: node.layoutMode ?? 'NONE' };
  if (node.layoutMode !== 'NONE') {
    layout.direction = node.layoutMode;
    layout.primaryAxisAlign = node.primaryAxisAlignItems;
    layout.counterAxisAlign = node.counterAxisAlignItems;
    layout.paddingTop = node.paddingTop;
    layout.paddingRight = node.paddingRight;
    layout.paddingBottom = node.paddingBottom;
    layout.paddingLeft = node.paddingLeft;
    layout.itemSpacing = node.itemSpacing;
    layout.wrap = node.layoutWrap === 'WRAP';
  }
  return layout;
}

// ─── Typography Extraction ────────────────────────────────────────────────────

function extractTypography(node: TextNode): TypographyInfo {
  const fontName = node.fontName !== figma.mixed ? node.fontName : { family: 'Mixed', style: 'Mixed' };
  const fontSize = node.fontSize !== figma.mixed ? node.fontSize : 0;
  const lineHeight = node.lineHeight !== figma.mixed
    ? (node.lineHeight.unit === 'AUTO' ? 'auto' : `${(node.lineHeight as { value: number; unit: string }).value}${node.lineHeight.unit === 'PERCENT' ? '%' : 'px'}`)
    : 'mixed';
  const letterSpacing = node.letterSpacing !== figma.mixed
    ? `${node.letterSpacing.value}${node.letterSpacing.unit === 'PERCENT' ? '%' : 'px'}`
    : 'mixed';

  return {
    fontFamily: fontName.family,
    fontStyle: fontName.style,
    fontSize,
    lineHeight,
    letterSpacing,
    textContent: node.characters.slice(0, 100) + (node.characters.length > 100 ? '…' : ''),
  };
}

// ─── Node Extraction (recursive, max 3 levels) ────────────────────────────────

function extractNode(node: SceneNode, depth: number = 0): NodeData {
  const data: NodeData = {
    id: node.id,
    name: node.name,
    type: node.type,
    width: 'width' in node ? (node as LayoutMixin).width : 0,
    height: 'height' in node ? (node as LayoutMixin).height : 0,
    fills: 'fills' in node ? extractPaints((node as GeometryMixin).fills) : [],
    strokes: 'strokes' in node ? extractPaints((node as GeometryMixin).strokes) : [],
    opacity: 'opacity' in node ? (node as BlendMixin).opacity : 1,
  };

  if ('cornerRadius' in node) {
    const cr = (node as CornerMixin).cornerRadius;
    data.cornerRadius = cr === figma.mixed ? 'mixed' : cr;
  }

  if (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') {
    data.layout = extractLayout(node as FrameNode);
  }

  if (node.type === 'TEXT') {
    data.typography = extractTypography(node as TextNode);
  }

  if (depth < 2 && 'children' in node) {
    const container = node as ChildrenMixin;
    data.children = container.children
      .slice(0, 20) // cap at 20 children per level
      .map((child) => extractNode(child as SceneNode, depth + 1));
  }

  return data;
}

// ─── Selection Extraction ─────────────────────────────────────────────────────

function getSelectionData(): SelectionData {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    return { hasSelection: false, nodeCount: 0, nodes: [] };
  }
  return {
    hasSelection: true,
    nodeCount: selection.length,
    nodes: selection.map((node) => extractNode(node)),
  };
}

// ─── Message Handlers ─────────────────────────────────────────────────────────

figma.ui.onmessage = async (msg: { type: string; key?: string }) => {
  switch (msg.type) {
    case 'GET_SELECTION': {
      const data = getSelectionData();
      figma.ui.postMessage({ type: 'SELECTION_DATA', data });
      break;
    }

    case 'SAVE_API_KEY': {
      await figma.clientStorage.setAsync('anthropic_api_key', msg.key ?? '');
      figma.ui.postMessage({ type: 'API_KEY_SAVED' });
      break;
    }

    case 'GET_API_KEY': {
      const key = await figma.clientStorage.getAsync('anthropic_api_key');
      figma.ui.postMessage({ type: 'API_KEY_LOADED', key: key ?? '' });
      break;
    }

    case 'DELETE_API_KEY': {
      await figma.clientStorage.deleteAsync('anthropic_api_key');
      figma.ui.postMessage({ type: 'API_KEY_DELETED' });
      break;
    }

    case 'SAVE_FIGMA_TOKEN': {
      await figma.clientStorage.setAsync('figma_access_token', msg.key ?? '');
      figma.ui.postMessage({ type: 'FIGMA_TOKEN_SAVED' });
      break;
    }

    case 'GET_FIGMA_TOKEN': {
      const token = await figma.clientStorage.getAsync('figma_access_token');
      figma.ui.postMessage({ type: 'FIGMA_TOKEN_LOADED', key: token ?? '' });
      break;
    }

    case 'DELETE_FIGMA_TOKEN': {
      await figma.clientStorage.deleteAsync('figma_access_token');
      figma.ui.postMessage({ type: 'FIGMA_TOKEN_DELETED' });
      break;
    }

    case 'CLOSE': {
      figma.closePlugin();
      break;
    }
  }
};

// ─── Startup ──────────────────────────────────────────────────────────────────

figma.showUI(__html__, { width: 380, height: 620, title: 'Design Critique AI' });

// Notify UI when selection changes
figma.on('selectionchange', () => {
  const data = getSelectionData();
  figma.ui.postMessage({ type: 'SELECTION_CHANGED', data });
});

// Send initial selection on load
const initialData = getSelectionData();
figma.ui.postMessage({ type: 'SELECTION_DATA', data: initialData });
