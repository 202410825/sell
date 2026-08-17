import React from 'react'
import { exportExcelFile } from '../utils/excelHandler'

export default function ExportControls({ products }) {
  return (
    <section className="card">
      <h2>💾 데이터 내보내기</h2>
      <button disabled={!products.length} onClick={() => exportExcelFile(products)}>
        📥 Excel 다운로드
      </button>
    </section>
  )
}
