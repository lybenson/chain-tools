import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MultiTransfer from './pages/multi-transfer'
import Home from './pages/home'

function App() {

  return (
    <div className="App">
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
