import type { AIInsight, Product } from '../types'

export function analyzeStock(products: Product[]): AIInsight[] {
  const insights: AIInsight[] = []
  for (const p of products) {
    const daily = p.monthlyOutflow / 30
    const daysLeft = daily > 0 ? p.quantity / daily : Infinity
    const margin = p.salePrice > 0 ? ((p.salePrice - p.supplierPrice) / p.salePrice) * 100 : 0
    const competitorAvg = p.competitorPrices.length
      ? p.competitorPrices.reduce((s, x) => s + x.price, 0) / p.competitorPrices.length
      : 0

    if (p.quantity <= p.minStock) {
      const target = Math.max(p.minStock * 2, Math.ceil(p.monthlyOutflow * 1.2))
      insights.push({ severity: p.quantity <= p.minStock * .4 ? 'critical' : 'warning', title: `Reposição: ${p.name}`, message: `Estoque atual ${p.quantity}. Sugestão de compra: ${Math.max(0, target - p.quantity)} unidades.`, productId: p.id })
    }
    if (daysLeft < 7) insights.push({ severity: 'critical', title: `Pode acabar em ${Math.ceil(daysLeft)} dias`, message: `${p.name} está com giro alto para o estoque atual.`, productId: p.id })
    if (margin < 20) insights.push({ severity: 'warning', title: `Margem baixa: ${p.name}`, message: `Margem estimada de ${margin.toFixed(1)}%. Revise custo ou preço de venda.`, productId: p.id })
    if (competitorAvg && p.salePrice < competitorAvg * .88) insights.push({ severity: 'info', title: `Preço abaixo do mercado`, message: `${p.name} está bem abaixo da média dos concorrentes (R$ ${competitorAvg.toFixed(2)}). Há espaço para testar aumento.`, productId: p.id })
  }
  if (!insights.length) insights.push({ severity: 'success', title: 'Estoque saudável', message: 'Nenhum alerta importante encontrado com os dados atuais.' })
  return insights.slice(0, 8)
}

export function answerStockQuestion(question: string, products: Product[]) {
  const q = question.toLowerCase()
  const totalCost = products.reduce((s,p)=>s+p.quantity*p.supplierPrice,0)
  const totalSale = products.reduce((s,p)=>s+p.quantity*p.salePrice,0)
  const low = products.filter(p=>p.quantity<=p.minStock)
  if (q.includes('comprar') || q.includes('repor')) return low.length ? `Hoje eu priorizaria ${low.slice(0,5).map(p=>p.name).join(', ')}. São ${low.length} produto(s) abaixo do estoque mínimo.` : 'Não há produtos abaixo do estoque mínimo agora.'
  if (q.includes('investido') || q.includes('custo')) return `O valor estimado investido no estoque é R$ ${totalCost.toLocaleString('pt-BR',{minimumFractionDigits:2})}.`
  if (q.includes('venda') || q.includes('fatur')) return `Se todo o estoque atual for vendido pelos preços cadastrados, o potencial bruto é R$ ${totalSale.toLocaleString('pt-BR',{minimumFractionDigits:2})}.`
  if (q.includes('lucro')) return `O lucro bruto potencial estimado do estoque atual é R$ ${(totalSale-totalCost).toLocaleString('pt-BR',{minimumFractionDigits:2})}.`
  return 'Posso responder sobre reposição, valor investido, potencial de venda e lucro. Conforme adicionarmos histórico de saídas, também farei previsões mais precisas.'
}
