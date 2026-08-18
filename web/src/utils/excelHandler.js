import * as XLSX from 'xlsx'

// 엑셀 헤더 이름이 정확히 일치하지 않아도, 포함된 키워드로 필드를 추정합니다.
function detectField(header) {
  const h = String(header).trim()

  if (/가격|price/i.test(h)) return 'price'
  if (/제품명|상품명|품명|이름|name/i.test(h)) return 'name'
  if (/브랜드|brand/i.test(h)) return 'brand'
  if (/카테고리|분류|category/i.test(h)) return 'category'
  if (/원산지|origin/i.test(h)) return 'origin'
  if (/매대|위치/i.test(h)) return 'displayNo'
  if (/이미지/i.test(h)) return 'imageFolder'
  if (/바코드|제품번호|제품코드|품번|코드|barcode|code/i.test(h)) return 'code'
  if (/^no$|번호/i.test(h)) return 'no'

  return null
}

// "10,000원", "10000", " 10,500 " 등 다양한 표기에서 숫자만 추출
function parsePrice(value) {
  if (value === null || value === undefined || value === '') return 0
  const digitsOnly = String(value).replace(/[^0-9.-]/g, '')
  const num = Number(digitsOnly)
  return Number.isFinite(num) ? num : 0
}

export function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })

        const products = rows.map((row, idx) => {
          const product = { id: idx, raw: row, name: '', code: '', price: 0 }
          const keys = Object.keys(row)

          keys.forEach((key) => {
            const mappedKey = detectField(key)
            if (!mappedKey) return

            if (mappedKey === 'price') {
              product.price = parsePrice(row[key])
            } else {
              product[mappedKey] = row[key]
            }
          })

          // 가격 컬럼을 못 찾았거나 0으로 나온 경우,
          // 맨 마지막 컬럼 값을 가격으로 한 번 더 시도 (사용자 엑셀 구조 대응)
          if (!product.price) {
            const lastKey = keys[keys.length - 1]
            const fallback = parsePrice(row[lastKey])
            if (fallback) product.price = fallback
          }

          return product
        })

        resolve(products)
      } catch (err) {
        reject(err)
      }
    }

    reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'))
    reader.readAsArrayBuffer(file)
  })
}

export function exportExcelFile(products) {
  const exportRows = products.map((p) => {
    const row = { ...p.raw }
    // raw에 있던 가격 관련 컬럼들을 최신 가격으로 갱신
    Object.keys(row).forEach((key) => {
      if (detectField(key) === 'price') {
        row[key] = p.price
      }
    })
    return row
  })

  const worksheet = XLSX.utils.json_to_sheet(exportRows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Products')

  const today = new Date().toISOString().slice(0, 10)
  const filename = `상품_가격_${today}.xlsx`

  XLSX.writeFile(workbook, filename)
}
