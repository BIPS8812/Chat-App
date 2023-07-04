import './App.css'
import { Routes, Route } from 'react-router-dom'
import { HomePage, ChatPage } from './Pages'

const App = () => {
  return (
    <div className='App'>
      <Routes>
        <Route exact path='/auth' element={<HomePage />} />
        <Route exact path='/' element={<ChatPage />} />
      </Routes>
    </div>
  )
}

export default App
