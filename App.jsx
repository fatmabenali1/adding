import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Login'
import Home from './Home'
import SinUp from './SinUp'
import Product from './product'
function App() {
  return (
    <>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path='/register' element={<SinUp />} />
            <Route path='/login' element={<Login />} />
            <Route path='/home' element={<Home />} />
            <Route path='/products' element={<Product />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App