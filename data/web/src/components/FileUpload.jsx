import React from 'react'
import { parseExcelFile } from '../utils/excelHandler'

export default function FileUpload({ onLoaded }) {
  const handleChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const products = await parseExcelFile(file)
      onLoaded(products)
    } catch (err) {
      alert('엑셀 파일을 읽는 중 오류가 발생했습니다: ' + err.message)
    }
  }

  return (
    <section className="card">
      <h2>📁 엑셀 파일 업로드</h2>
      <input type="file" accept=".xlsx,.xls" onChange={handleChange} />
    </section>
  )
}
