import { useState } from 'react'
import type { Product } from '../types'

type Props = { onSave: (p: Product) => Promise<void> }

export default function ProductForm({ onSave }: Props) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Product>({ name:'', category:'', quantity:0, minStock:0, supplier:'', supplierPrice:0, salePrice:0, competitorPrices:[], monthlyOutflow:0 })
  async function submit(e: React.FormEvent) { e.preventDefault(); await onSave(form); setOpen(false); setForm({ name:'', category:'', quantity:0, minStock:0, supplier:'', supplierPrice:0, salePrice:0, competitorPrices:[], monthlyOutflow:0 }) }
  if (!open) return <button className="goldButton" onClick={()=>setOpen(true)}>+ Novo Produto</button>
  return <div className="modalBack"><form className="modal" onSubmit={submit}><h2>Novo produto</h2>
    <div className="grid2">
      <input required placeholder="Nome" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
      <input required placeholder="Categoria" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}/>
      <input type="number" placeholder="Estoque atual" onChange={e=>setForm({...form,quantity:+e.target.value})}/>
      <input type="number" placeholder="Estoque mínimo" onChange={e=>setForm({...form,minStock:+e.target.value})}/>
      <input placeholder="Fornecedor" value={form.supplier} onChange={e=>setForm({...form,supplier:e.target.value})}/>
      <input type="number" step="0.01" placeholder="Preço fornecedor" onChange={e=>setForm({...form,supplierPrice:+e.target.value})}/>
      <input type="number" step="0.01" placeholder="Preço de venda" onChange={e=>setForm({...form,salePrice:+e.target.value})}/>
      <input type="number" placeholder="Saída média/mês" onChange={e=>setForm({...form,monthlyOutflow:+e.target.value})}/>
    </div><div className="actions"><button type="button" className="ghost" onClick={()=>setOpen(false)}>Cancelar</button><button className="goldButton">Salvar</button></div>
  </form></div>
}
