import Quagga from 'quagga2'

/**
 * 바코드 스캐너 초기화
 */
export const initializeScanner = (videoElement, onDetected) => {
  Quagga.init(
    {
      inputStream: {
        name: 'Live',
        type: 'LiveStream',
        target: videoElement,
        constraints: {
          width: { min: 640 },
          height: { min: 480 },
          facingMode: 'environment'
        }
      },
      decoder: {
        readers: [
          'code_128_reader',
          'ean_reader',
          'ean_8_reader',
          'upc_reader',
          'upc_e_reader',
          'codabar_reader',
          'code_39_reader',
          'code_39_vin_reader',
          'code_93_reader',
          'i2of5_reader'
        ]
      },
      locate: true
    },
    (err) => {
      if (err) {
        console.error('Quagga 초기화 실패:', err)
        return false
      }

      Quagga.start()

      Quagga.onDetected((result) => {
        if (result.codeResult.code) {
          onDetected(result.codeResult.code)
        }
      })

      return true
    }
  )
}

/**
 * 바코드 스캐너 중지
 */
export const stopScanner = () => {
  Quagga.stop()
}

/**
 * 웹캠 접근 권한 확인
 */
export const checkCameraPermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    stream.getTracks().forEach(track => track.stop())
    return true
  } catch (error) {
    console.error('카메라 접근 실패:', error)
    return false
  }
}
