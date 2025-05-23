import { useEffect, useState } from 'react'
import style from "./App.module.scss"

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log("WORK ", count);

  }, [count])


  return (
    <section className={style.body}>TEST {count}<button onClick={() => setCount(before => before + 1)}>CLICK</button> <img src="http://localhost:2403/10-04-24-03-0505/assets/img/test.jpg" alt="" /></section>
  )
}

export default App
