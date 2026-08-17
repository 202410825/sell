import React, { useEffect, useState } from 'react'

export default function ProductInfo({ product, onSave }) {
  const [price, setPrice] = useState(product?.price ?? '')

  useEffect(() => {
    setPrice(product?.price ?? '')
  }, [product])

  if (!product) {
    return (
      <section className="card">
        <h2>📦 상품 정보</h2>
        <p>상품을 검색하거나 바코드를 스캔해주세요.</p>
      </section>
    )
  }

  return (
    <section className="card">
      <h2>📦 상품 정보</h2>
      <p>
        <strong>{product.name}</strong>
      </p>
      <p>브랜드: {product.brand}</p>
      <p>카테고리: {product.category}</p>
      <p>원산지: {product.origin}</p>
      <p>기존 가격: {product.price}원</p>

      <label className="price-input">
        새 가격
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </label>

      <button onClick={() => onSave(product.id, Number(price))}>
        💾 가격 저장
      </button>
    </section>
  )
}
