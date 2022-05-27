import './App.css'
import './Responsive.css'
import BuyTicket from './components/BuyTicket'
import Dashboard from './components/Dashboard'
import Feedback from './components/Feedback'
import Notfound from './components/Notfound'
import Footer from './components/Footer'

import Navbar from './components/Navbar'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useGlobalContext } from './context'


function App() {
  const {loadModels} = useGlobalContext()

  useEffect(() => {
    loadModels()
  },[])
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={[<Navbar />, <BuyTicket />]} />
          <Route path='/dashboard' element={[<Navbar />, <Dashboard />]} />
          <Route path='/feedback' element={[<Navbar />, <Feedback />]} />
          <Route path='*' element={<Notfound />} />
        </Routes>
        <Footer></Footer>
      </BrowserRouter>
    </>
  )
}

export default App
