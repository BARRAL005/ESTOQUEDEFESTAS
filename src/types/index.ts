export type Product = {
  id?: string
  name: string
  category: string
  barcode?: string
  quantity: number
  minStock: number
  supplier: string
  supplierPrice: number
  salePrice: number
  competitorPrices: { name: string; price: number }[]
  monthlyOutflow: number
  updatedAt?: unknown
}

export type AIInsight = {
  severity: 'info' | 'warning' | 'critical' | 'success'
  title: string
  message: string
  productId?: string
}
