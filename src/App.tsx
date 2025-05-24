import { useEffect, useRef, useState } from 'react'
import style from "./App.module.scss"
import { Route, Routes } from 'react-router';
import axios from 'axios';
import Store from './components/Store';

function App() {
  const window = useRef<HTMLDivElement>(null)


  return (
    <Routes>
      <Route
        path="/:refID?"
        element={
          <section ref={window} className={style.body}>
            <Store></Store>
          </section>
        }
      />
      <Route path="*" element={<p>Error</p>} />
    </Routes>

  )
}

export default App
