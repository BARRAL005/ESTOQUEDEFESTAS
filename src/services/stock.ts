import type { Product } from '../types'

const fallbackKey = 'pitstop_products_demo'

const seed: Product[] = [
  { id: 'seed-1', name: 'Balão Metalizado Estrela', category: 'Balões', barcode: '7891234560033', quantity: 30, minStock: 80, supplier: 'Festa Brasil', supplierPrice: 8.5, salePrice: 11.49, competitorPrices: [{name:'Alegria Festas',price:11.99},{name:'Mundo das Festas',price:12.5},{name:'Casa da Festa',price:13.9}], monthlyOutflow: 160 },
  { id: 'seed-2', name: 'Copo Descartável 300ml', category: 'Descartáveis', barcode: '7891234560019', quantity: 28, minStock: 100, supplier: 'Atacado Central', supplierPrice: 3.2, salePrice: 5.79, competitorPrices: [{name:'Concorrente A',price:5.99},{name:'Concorrente B',price:6.49}], monthlyOutflow: 210 },
  { id: 'seed-3', name: 'Guardanapo Folha Dupla', category: 'Descartáveis', barcode: '7891234560040', quantity: 40, minStock: 100, supplier: 'Distribuidora Sul', supplierPrice: 2.1, salePrice: 4.49, competitorPrices: [{name:'Concorrente A',price:4.9}], monthlyOutflow: 95 },
]

export function readProducts(): Product[] {
  const saved = localStorage.getItem(fallbackKey)
  if (!saved) {
    localStorage.setItem(fallbackKey, JSON.stringify(seed))
    return seed
  }
  try { return JSON.parse(saved) } catch { return seed }
}

function writeProducts(products: Product[]) {
  localStorage.setItem(fallbackKey, JSON.stringify(products))
  window.dispatchEvent(new Event('pitstop-stock-updated'))
}

export async function subscribeProducts(cb: (items: Product[]) => void) {
  const emit = () => cb(readProducts())
  emit()
  window.addEventListener('storage', emit)
  window.addEventListener('pitstop-stock-updated', emit)
  return () => {
    window.removeEventListener('storage', emit)
    window.removeEventListener('pitstop-stock-updated', emit)
  }
}

export async function saveProduct(product: Product) {
  const items = readProducts()
  if (product.id) {
    writeProducts(items.map(p => p.id === product.id ? product : p))
  } else {
    writeProducts([...items, { ...product, id: crypto.randomUUID() }])
  }
}

export async function removeProduct(id: string) {
  writeProducts(readProducts().filter(p => p.id !== id))
}

export function resetDemoData() {
  writeProducts(seed)
}
