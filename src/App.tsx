import { useEffect, useMemo, useState } from 'react'
import { Boxes, CircleDollarSign, TriangleAlert, TrendingUp, Sparkles, Search, PackagePlus, Truck, LineChart, Settings } from 'lucide-react'
import ProductForm from './components/ProductForm'
import { saveProduct, subscribeProducts } from './services/stock'
import { analyzeStock, answerStockQuestion } from './services/stockAI'
import type { Product } from './types'

const brl=(n:number)=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})

export default function App(){
 const [products,setProducts]=useState<Product[]>([]); const [q,setQ]=useState(''); const [answer,setAnswer]=useState('')
 useEffect(()=>{ let unsub=()=>{}; subscribeProducts(setProducts).then(fn=>unsub=fn); return()=>unsub() },[])
 const stats=useMemo(()=>({count:products.length,cost:products.reduce((s,p)=>s+p.quantity*p.supplierPrice,0),sale:products.reduce((s,p)=>s+p.quantity*p.salePrice,0),low:products.filter(p=>p.quantity<=p.minStock).length}),[products])
 const insights=useMemo(()=>analyzeStock(products),[products])
 async function add(p:Product){ await saveProduct(p) }
 return <div className="shell">
  <aside><img src="/pitstop-logo.png" className="logo"/><nav>
   <a className="active"><Boxes/>Dashboard</a><a><PackagePlus/>Produtos</a><a><Truck/>Fornecedores</a><a><CircleDollarSign/>Concorrentes</a><a><LineChart/>Relatórios</a><a><Sparkles/>Pit IA</a><a><Settings/>Configurações</a>
  </nav><div className="cloud">💾 <b>Modo local</b><span>Dados salvos neste navegador</span></div></aside>
  <main><header><div><h1>Controle de Estoque</h1><p>Produtos para festas • Pit Stop Cohab</p></div><ProductForm onSave={add}/></header>
   <section className="cards"><Card icon={<Boxes/>} title="Produtos" value={String(stats.count)}/><Card icon={<CircleDollarSign/>} title="Valor do estoque" value={brl(stats.cost)}/><Card icon={<TriangleAlert/>} title="Estoque baixo" value={String(stats.low)}/><Card icon={<TrendingUp/>} title="Potencial de venda" value={brl(stats.sale)}/><Card icon={<Sparkles/>} title="Lucro potencial" value={brl(stats.sale-stats.cost)}/></section>
   <section className="content"><div className="panel"><div className="panelHead"><h2>Produtos</h2><div className="search"><Search size={17}/><input placeholder="Buscar produto..." value={q} onChange={e=>setQ(e.target.value)}/></div></div>
    <table><thead><tr><th>Produto</th><th>Estoque</th><th>Fornecedor</th><th>Custo</th><th>Venda</th><th>Mercado</th><th>Status</th></tr></thead><tbody>{products.filter(p=>p.name.toLowerCase().includes(q.toLowerCase())).map(p=>{const avg=p.competitorPrices.length?p.competitorPrices.reduce((s,c)=>s+c.price,0)/p.competitorPrices.length:0;return <tr key={p.id||p.name}><td><b>{p.name}</b><small>{p.category}</small></td><td>{p.quantity}</td><td>{p.supplier}</td><td>{brl(p.supplierPrice)}</td><td>{brl(p.salePrice)}</td><td>{avg?brl(avg):'—'}</td><td><span className={p.quantity<=p.minStock?'badge bad':'badge good'}>{p.quantity<=p.minStock?'Repor':'OK'}</span></td></tr>})}</tbody></table>
   </div><div className="panel ai"><div className="aiTitle"><Sparkles/><div><h2>Pit IA</h2><p>Assistente inteligente do estoque</p></div></div>{insights.map((x,i)=><div className={'insight '+x.severity} key={i}><b>{x.title}</b><span>{x.message}</span></div>)}
    <div className="ask"><input placeholder="Ex.: O que preciso comprar hoje?" onKeyDown={e=>{if(e.key==='Enter'){const v=(e.target as HTMLInputElement).value;setAnswer(answerStockQuestion(v,products))}}}/><button onClick={()=>{const el=document.querySelector('.ask input') as HTMLInputElement;setAnswer(answerStockQuestion(el.value,products))}}>Perguntar</button></div>{answer&&<div className="answer">{answer}</div>}</div></section>
  </main></div>
}
function Card({icon,title,value}:{icon:React.ReactNode,title:string,value:string}){return <div className="card"><div className="cardIcon">{icon}</div><div><span>{title}</span><strong>{value}</strong></div></div>}
