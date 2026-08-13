import React, { useState } from 'react'
import FileUpload from './components/FileUpload'
import BarcodeScanner from './components/BarcodeScanner'
import ProductInfo from './components/ProductInfo'
import ExportControls from './components/ExportControls'
import { searchProductByBarcode, formatPrice } from './utils/excelHandler'

export default function App() {
  const [products, setProducts] = useState([])
  const [fileName, setFileName] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [scannedBarcode, setScannedBarcode] = useState(null)
  const [searchInput, setSearchInput] = useState('')

  const handleFileLoaded = (data, name) => {
    setProducts(data)
    setFileName(name)
    setSelectedProduct(null)
    setScannedBarcode(null)
  }

  const handleBarcodeScan = (barcode) => {
    setScannedBarcode(barcode)
    const product = searchProductByBarcode(barcode, products)

    if (product) {
      setSelectedProduct(product)
      setSearchInput('')
    } else {
      setSelectedProduct(null)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()

    if (!searchInput.trim()) return

    // 바코드로 검색
    let product = searchProductByBarcode(searchInput, products)

    // 제품명으로도 검색
    if (!product) {
      product = products.find(
        p =>
          p.코스트코_제품명 &&
          p.코스트코_제품명.toLowerCase().includes(searchInput.toLowerCase())
      )
    }

    if (product) {
      setSelectedProduct(product)
      setScannedBarcode(null)
    } else {
      setSelectedProduct(null)
      setScannedBarcode(null)
    }
  }

  const handlePriceUpdate = (updatedProducts) => {
    setProducts(updatedProducts)
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🛍️ 리셀 가격 관리 시스템</h1>
        <p>
          {fileName
            ? `📊 현재 상품 수: ${products.length}개 (${fileName})`
            : '엑셀 파일을 업로드하여 시작하세요'}
        </p>
      </div>

      {/* Step 1: 파일 업로드 */}
      <div className="main-content">
        <FileUpload onFileLoaded={handleFileLoaded} />

        {/* Step 2: 바코드 스캔 또는 검색 */}
        {products.length > 0 && (
          <div className="card">
            <h2>🔍 상품 검색</h2>

            <form onSubmit={handleSearchSubmit}>
              <div className="form-group">
                <label>바코드 또는 상품명으로 검색</label>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="바코드나 상품명 입력 후 엔터"
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                🔎 검색
              </button>
            </form>

            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                또는 아래에서 바코드 스캔기를 사용하세요 👇
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Step 3: 바코드 스캐너 또는 상품 정보 */}
      {products.length > 0 && (
        <div className="main-content">
          <BarcodeScanner
            onBarcodeScan={handleBarcodeScan}
            isActive={products.length > 0}
          />

          <ProductInfo
            product={selectedProduct}
            onPriceUpdate={handlePriceUpdate}
            fileName={fileName}
            products={products}
            scannedBarcode={scannedBarcode}
          />
        </div>
      )}

      {/* Step 4: 데이터 내보내기 */}
      {products.length > 0 && (
        <ExportControls products={products} fileName={fileName} />
      )}

      {/* 상품 목록 테이블 */}
      {products.length > 0 && (
        <div className="card">
          <h2>📋 전체 상품 목록</h2>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>제품명</th>
                  <th>바코드</th>
                  <th>카테고리</th>
                  <th>현재 가격</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr
                    key={index}
                    onClick={() => setSelectedProduct(product)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{product.no || '-'}</td>
                    <td>{product.코스트코_제품명 || '-'}</td>
                    <td>
                      <code style={{ backgroundColor: '#f5f5f5', padding: '4px 8px', borderRadius: '4px' }}>
                        {product.제품번호 || '-'}
                      </code>
                    </td>
                    <td>{product.카테고리 || '-'}</td>
                    <td style={{ fontWeight: 'bold', color: '#667eea' }}>
                      {product.판매가격 ? formatPrice(product.판매가격) : '미설정'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '40px', padding: '20px', color: '#999' }}>
        <p>💡 팁: 상품을 클릭하거나 바코드를 스캔하면 가격을 수정할 수 있습니다!</p>
        <p style={{ fontSize: '12px' }}>
          Made with ❤️ for faster reselling | v1.1.0
        </p>
      </div>
    </div>
  )
}
