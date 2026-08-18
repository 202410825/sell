import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// PWA: 서비스 워커 등록 (오프라인에서도 앱 화면이 뜨도록)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('서비스 워커 등록 실패:', err)
    })
  })
}
