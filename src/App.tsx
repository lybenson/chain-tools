import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MultiTransfer from './pages/multi-transfer'
import Home from './pages/home'
import Header from './components/Header'

function App() {

  return (
    <div className="App">
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path="/multi-transfer" element={<MultiTransfer />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
