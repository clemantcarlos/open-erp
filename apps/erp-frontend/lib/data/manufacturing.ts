export interface BOMEntry {
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  unitCost: number;
}

export interface ProcessStep {
  processId: string;
  processName: string;
  description: string;
  order: number;
}

export interface RoutingStep {
  processStepId: string;
  processName: string;
  costPerUnit: number;
  timeMinutes: number;
}

export interface CompositeProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  salePrice: number;
  emoji: string;
  bom: BOMEntry[];
  routing: RoutingStep[];
}

export interface ProductionOrder {
  id: string;
  compositeProductId: string;
  compositeProductName: string;
  quantityPlanned: number;
  quantityProduced: number;
  status: "planned" | "in_progress" | "completed" | "cancelled";
  scheduledDate: string;
  completedDate: string | null;
  notes: string;
}

export const processSteps: ProcessStep[] = [
  { processId: "P1", processName: "Preparación", description: "Preparar y medir ingredientes", order: 1 },
  { processId: "P2", processName: "Corte", description: "Cortar materiales a medida", order: 2 },
  { processId: "P3", processName: "Ensamblaje", description: "Unir componentes", order: 3 },
  { processId: "P4", processName: "Cocción", description: "Cocinar o procesar térmicamente", order: 4 },
  { processId: "P5", processName: "Soldadura", description: "Unir piezas por soldadura", order: 5 },
  { processId: "P6", processName: "Pintura", description: "Aplicar acabado superficial", order: 6 },
  { processId: "P7", processName: "Empaque", description: "Empaquetar producto final", order: 7 },
  { processId: "P8", processName: "Control de Calidad", description: "Inspección y verificación", order: 8 },
];

export const compositeProducts: CompositeProduct[] = [
  // === RESTAURANT ===
  {
    id: "CP-001",
    name: "Sandwich Club",
    sku: "REST-001",
    category: "Restaurante",
    unit: "unid",
    salePrice: 8.0,
    emoji: "🥪",
    bom: [
      { ingredientId: "5", ingredientName: "Pan Integral", quantity: 1, unit: "unid", unitCost: 2.5 },
      { ingredientId: "7", ingredientName: "Jamón Sliced", quantity: 2, unit: "unid", unitCost: 1.2 },
      { ingredientId: "8", ingredientName: "Queso Mozzarella", quantity: 1, unit: "unid", unitCost: 1.8 },
      { ingredientId: "I-001", ingredientName: "Lechuga", quantity: 1, unit: "hoja", unitCost: 0.3 },
    ],
    routing: [
      { processStepId: "P1", processName: "Preparación", costPerUnit: 0.5, timeMinutes: 2 },
      { processStepId: "P3", processName: "Ensamblaje", costPerUnit: 0.3, timeMinutes: 3 },
      { processStepId: "P7", processName: "Empaque", costPerUnit: 0.2, timeMinutes: 1 },
    ],
  },
  {
    id: "CP-002",
    name: "Cappuccino",
    sku: "REST-002",
    category: "Restaurante",
    unit: "unid",
    salePrice: 5.5,
    emoji: "☕",
    bom: [
      { ingredientId: "1", ingredientName: "Café Americano (500g)", quantity: 0.02, unit: "kg", unitCost: 0.5 },
      { ingredientId: "I-002", ingredientName: "Leche Entera", quantity: 0.2, unit: "L", unitCost: 0.3 },
      { ingredientId: "I-003", ingredientName: "Espumante", quantity: 0.03, unit: "L", unitCost: 0.15 },
    ],
    routing: [
      { processStepId: "P1", processName: "Preparación", costPerUnit: 0.2, timeMinutes: 1 },
      { processStepId: "P4", processName: "Cocción", costPerUnit: 0.4, timeMinutes: 3 },
    ],
  },
  {
    id: "CP-003",
    name: "Tiramisú",
    sku: "REST-003",
    category: "Restaurante",
    unit: "unid",
    salePrice: 5.0,
    emoji: "🍰",
    bom: [
      { ingredientId: "I-004", ingredientName: "Queso Mascarpone", quantity: 0.08, unit: "kg", unitCost: 1.5 },
      { ingredientId: "9", ingredientName: "Harina de Trigo (1kg)", quantity: 0.03, unit: "kg", unitCost: 0.06 },
      { ingredientId: "I-005", ingredientName: "Café Espresso", quantity: 0.05, unit: "L", unitCost: 0.2 },
      { ingredientId: "10", ingredientName: "Azúcar Refinada (1kg)", quantity: 0.02, unit: "kg", unitCost: 0.04 },
      { ingredientId: "I-006", ingredientName: "Cacao en Polvo", quantity: 0.01, unit: "kg", unitCost: 0.3 },
    ],
    routing: [
      { processStepId: "P1", processName: "Preparación", costPerUnit: 0.8, timeMinutes: 10 },
      { processStepId: "P3", processName: "Ensamblaje", costPerUnit: 0.5, timeMinutes: 8 },
      { processStepId: "P4", processName: "Cocción", costPerUnit: 0.3, timeMinutes: 0 },
    ],
  },
  // === INDUSTRIAL ===
  {
    id: "CP-101",
    name: "Widget A - Acero",
    sku: "IND-001",
    category: "Industrial",
    unit: "unid",
    salePrice: 25.0,
    emoji: "⚙️",
    bom: [
      { ingredientId: "I-101", ingredientName: "Placa Acero 304 (1m²)", quantity: 0.5, unit: "m²", unitCost: 8.0 },
      { ingredientId: "I-102", ingredientName: "Tornillo M8×20", quantity: 4, unit: "unid", unitCost: 0.15 },
      { ingredientId: "I-103", ingredientName: "Pintura Epóxica (1L)", quantity: 0.1, unit: "L", unitCost: 2.5 },
    ],
    routing: [
      { processStepId: "P2", processName: "Corte", costPerUnit: 1.5, timeMinutes: 5 },
      { processStepId: "P5", processName: "Soldadura", costPerUnit: 3.0, timeMinutes: 8 },
      { processStepId: "P6", processName: "Pintura", costPerUnit: 1.2, timeMinutes: 4 },
      { processStepId: "P8", processName: "Control de Calidad", costPerUnit: 0.8, timeMinutes: 3 },
    ],
  },
  {
    id: "CP-102",
    name: "Panel Solar 100W",
    sku: "IND-002",
    category: "Industrial",
    unit: "unid",
    salePrice: 120.0,
    emoji: "☀️",
    bom: [
      { ingredientId: "I-104", ingredientName: "Celda Solar Monocristalina", quantity: 36, unit: "unid", unitCost: 1.5 },
      { ingredientId: "I-105", ingredientName: "Marco Aluminio Anodizado", quantity: 1, unit: "unid", unitCost: 8.0 },
      { ingredientId: "I-106", ingredientName: "Cable Fotovoltaico (2m)", quantity: 1, unit: "unid", unitCost: 3.0 },
      { ingredientId: "I-107", ingredientName: "Vidrio Templado 3.2mm", quantity: 1, unit: "unid", unitCost: 12.0 },
    ],
    routing: [
      { processStepId: "P3", processName: "Ensamblaje", costPerUnit: 5.0, timeMinutes: 20 },
      { processStepId: "P5", processName: "Soldadura", costPerUnit: 4.0, timeMinutes: 15 },
      { processStepId: "P8", processName: "Control de Calidad", costPerUnit: 2.0, timeMinutes: 10 },
    ],
  },
  {
    id: "CP-103",
    name: "Motor Eléctrico 1HP",
    sku: "IND-003",
    category: "Industrial",
    unit: "unid",
    salePrice: 85.0,
    emoji: "🔧",
    bom: [
      { ingredientId: "I-108", ingredientName: "Bobinado Cobre (2kg)", quantity: 2, unit: "kg", unitCost: 15.0 },
      { ingredientId: "I-109", ingredientName: "Rodamiento 6205", quantity: 2, unit: "unid", unitCost: 4.5 },
      { ingredientId: "I-110", ingredientName: "Eje de Acero", quantity: 1, unit: "unid", unitCost: 6.0 },
      { ingredientId: "I-111", ingredientName: "Carcaza Hierro", quantity: 1, unit: "unid", unitCost: 8.0 },
    ],
    routing: [
      { processStepId: "P2", processName: "Corte", costPerUnit: 2.0, timeMinutes: 6 },
      { processStepId: "P5", processName: "Soldadura", costPerUnit: 4.0, timeMinutes: 12 },
      { processStepId: "P3", processName: "Ensamblaje", costPerUnit: 6.0, timeMinutes: 25 },
      { processStepId: "P6", processName: "Pintura", costPerUnit: 1.5, timeMinutes: 5 },
      { processStepId: "P8", processName: "Control de Calidad", costPerUnit: 3.0, timeMinutes: 15 },
    ],
  },
];

export const productionOrders: ProductionOrder[] = [
  { id: "PO-001", compositeProductId: "CP-001", compositeProductName: "Sandwich Club", quantityPlanned: 50, quantityProduced: 50, status: "completed", scheduledDate: "2026-06-22", completedDate: "2026-06-22", notes: "Pedido especial evento" },
  { id: "PO-002", compositeProductId: "CP-002", compositeProductName: "Cappuccino", quantityPlanned: 100, quantityProduced: 72, status: "in_progress", scheduledDate: "2026-06-23", completedDate: null, notes: "" },
  { id: "PO-003", compositeProductId: "CP-101", compositeProductName: "Widget A - Acero", quantityPlanned: 200, quantityProduced: 0, status: "planned", scheduledDate: "2026-06-25", completedDate: null, notes: "Orden mensual" },
  { id: "PO-004", compositeProductId: "CP-102", compositeProductName: "Panel Solar 100W", quantityPlanned: 50, quantityProduced: 50, status: "completed", scheduledDate: "2026-06-20", completedDate: "2026-06-21", notes: "Proyecto techo solar" },
  { id: "PO-005", compositeProductId: "CP-103", compositeProductName: "Motor Eléctrico 1HP", quantityPlanned: 30, quantityProduced: 12, status: "in_progress", scheduledDate: "2026-06-23", completedDate: null, notes: "Reposición stock mínimo" },
  { id: "PO-006", compositeProductId: "CP-003", compositeProductName: "Tiramisú", quantityPlanned: 25, quantityProduced: 0, status: "cancelled", scheduledDate: "2026-06-21", completedDate: null, notes: "Cancelado por falta de mascarpone" },
];

// Helpers
export function getMaterialCost(bom: BOMEntry[]): number {
  return bom.reduce((sum, entry) => sum + entry.quantity * entry.unitCost, 0);
}

export function getProcessCost(routing: RoutingStep[]): number {
  return routing.reduce((sum, step) => sum + step.costPerUnit, 0);
}

export function getUnitCost(product: CompositeProduct): number {
  return getMaterialCost(product.bom) + getProcessCost(product.routing);
}

export function getMargin(product: CompositeProduct): number {
  const cost = getUnitCost(product);
  return product.salePrice - cost;
}

export function getOrderTotalCost(order: ProductionOrder, product: CompositeProduct): number {
  const unitCost = getUnitCost(product);
  const qty = order.status === "completed" ? order.quantityProduced : order.quantityPlanned;
  return unitCost * qty;
}
