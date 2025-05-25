import { useRef } from 'react'
import style from "./App.module.scss"
import { Route, Routes } from 'react-router';
import Store from './components/Store';
import Apps from './components/Apps';

function App() {
  const window = useRef<HTMLDivElement>(null)


  return (
    <Routes>
      <Route
        path="/:refID?"
        element={
          <section ref={window} className={style.body}>
            <Store></Store>
            <Apps ></Apps>
          </section>
        }
      />
      <Route path="*" element={<p>Error</p>} />
    </Routes>

  )
}

export default App
