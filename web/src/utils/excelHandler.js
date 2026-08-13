import XLSX from 'xlsx'

/**
 * 엑셀 파일을 읽어서 JSON으로 변환
 */
export const readExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const data = XLSX.utils.sheet_to_json(worksheet)

        // 제품번호(바코드) 컬럼명 정규화
        const normalizedData = data.map(row => {
          const normalized = {}
          for (const key in row) {
            const normalizedKey = key.trim()
            normalized[normalizedKey] = row[key]
          }
          return normalized
        })

        resolve(normalizedData)
      } catch (error) {
        reject(new Error('엑셀 파일 읽기 실패: ' + error.message))
      }
    }

    reader.onerror = () => {
      reject(new Error('파일 읽기 중 오류 발생'))
    }

    reader.readAsBinaryString(file)
  })
}

/**
 * 바코드로 상품 검색
 */
export const searchProductByBarcode = (barcode, products) => {
  // 가능한 바코드 컬럼명들 (사용자가 사용할 수 있는 여러 형식)
  const barcodeColumns = [
    '제품번호',
    '제품번호(바코드)',
    'barcode',
    'Barcode',
    '바코드',
    'code'
  ]

  for (const product of products) {
    for (const column of barcodeColumns) {
      if (product[column] && String(product[column]).trim() === String(barcode).trim()) {
        return product
      }
    }
  }

  return null
}

/**
 * 엑셀 파일로 다운로드
 */
export const downloadExcel = (products, filename = '상품_가격.xlsx') => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(products)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, '상품목록')
    XLSX.writeFile(workbook, filename)
    return true
  } catch (error) {
    console.error('엑셀 다운로드 실패:', error)
    return false
  }
}

/**
 * Google Sheets URL에서 CSV 데이터 가져오기
 * 형식: https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit
 */
export const loadFromGoogleSheets = async (sheetId, sheetName = '시트1') => {
  try {
    // Google Sheets를 CSV로 내보내는 URL
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`
    
    const response = await fetch(csvUrl)
    if (!response.ok) throw new Error('Google Sheets 로드 실패')

    const csvText = await response.text()
    
    // CSV를 JSON으로 변환
    const lines = csvText.split('\n')
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
    
    const data = []
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue
      
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''))
      const row = {}
      
      headers.forEach((header, index) => {
        row[header] = values[index] || ''
      })
      
      data.push(row)
    }

    return data
  } catch (error) {
    throw new Error('Google Sheets 로드 실패: ' + error.message)
  }
}

/**
 * Google Sheets에 데이터 업로드 (Apps Script 이용)
 * 사전에 Google Apps Script를 배포해야 함
 */
export const uploadToGoogleSheets = async (products, appsScriptUrl, sheetName = '시트1') => {
  try {
    const response = await fetch(appsScriptUrl, {
      method: 'POST',
      body: JSON.stringify({
        data: products,
        sheetName: sheetName
      })
    })

    const result = await response.json()
    if (!result.success) throw new Error(result.error)
    
    return true
  } catch (error) {
    throw new Error('Google Sheets 업로드 실패: ' + error.message)
  }
}

/**
 * 가격 포맷팅 (숫자를 화폐 형식으로)
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(price)
}

/**
 * 컬럼명 목록 반환
 */
export const getColumnNames = (products) => {
  if (products.length === 0) return []
  return Object.keys(products[0])
}
