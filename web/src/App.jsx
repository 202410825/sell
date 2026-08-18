import React, { useMemo, useState } from 'react'
import FileUpload from './components/FileUpload'
import ProductInfo from './components/ProductInfo'
import ExportControls from './components/ExportControls'

export default function App() {
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  const selected = useMemo(
    () => products.find((p) => p.id === selectedId) ?? null,
    [products, selectedId]
  )

  const filtered = useMemo(() => {
    if (!query.trim()) return products
    const q = query.trim().toLowerCase()
    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        String(p.code ?? '').toLowerCase().includes(q)
    )
  }, [products, query])

  const handleSavePrice = (id, newPrice) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, price: newPrice } : p))
    )
  }

  return (
    <div className="app">
      <h1>🛍️ 가격 관리 시스템</h1>

      <FileUpload onLoaded={(p) => setProducts(p)} />

      <section className="card">
        <h2>🔍 상품 검색</h2>
        <input
          type="text"
          placeholder="상품명 또는 제품 코드 입력"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </section>

      <ProductInfo product={selected} onSave={handleSavePrice} />

      <ExportControls products={products} />

      <section className="card">
        <h2>📋 전체 상품 목록 ({filtered.length})</h2>
        {filtered.length === 0 ? (
          <p>표시할 상품이 없습니다. 엑셀 파일을 먼저 업로드해주세요.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>제품 코드</th>
                <th>상품명</th>
                <th>가격</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className={p.id === selectedId ? 'selected' : ''}
                >
                  <td>{p.code}</td>
                  <td>{p.name}</td>
                  <td>{p.price.toLocaleString()}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}
