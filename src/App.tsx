import { useEffect } from 'react'
import style from "./App.module.scss"
import { Route, Routes } from 'react-router';
import axios from 'axios';
import Store from './components/Store';

function App() {
  // const [count, setCount] = useState(0)

  useEffect(() => {


    axios.get("http://localhost:2403/api/getStore").then((res) => {
      console.log(res.data);
    })
  }, [])



  return (
    <Routes>
      <Route
        path="/:id?"
        element={
          <section className={style.body}>
            <Store></Store>
          </section>
        }
      />
      <Route path="*" element={<p>Error</p>} />
    </Routes>

  )
}

export default App
