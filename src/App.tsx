import { useEffect, useState } from 'react'
import style from "./App.module.scss"
import { Route, Routes } from 'react-router';

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log("WORK ", count);

  }, [count])


  return (
    <Routes>
      <Route
        path="/"
        element={
          <section className={style.body}>
            куык
          </section>
        }
      />
      <Route path="*" element={<p>Error</p>} />
    </Routes>

  )
}

export default App
