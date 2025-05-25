import { useEffect, useRef } from 'react'
import style from "./App.module.scss"
import { Route, Routes } from 'react-router';
import Store from './components/Store';
import Apps from './components/Apps';

const KEY_LOAD_STATE = "KEY_LOAD_STATE"
const KEY_DOWNLOAD_APP = "KEY_DOWNLOAD_APP"


interface KeyLoadStateItf {
  refID: string,
  loaded: number,
  size: number,
}

interface KeyDownloadAppItf {
  download: string[]
}



function App() {
  const window = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initStore = async () => {
      const tempKEY_LOAD_STATE = localStorage.getItem(KEY_LOAD_STATE)
      const tempKEY_DOWNLOAD_APP = localStorage.getItem(KEY_DOWNLOAD_APP)

      if (!tempKEY_LOAD_STATE) {
        localStorage.setItem(KEY_LOAD_STATE, JSON.stringify({
          refID: "-1",
          loaded: -1,
          size: -1,
        }))
      }

      if (!tempKEY_DOWNLOAD_APP) {
        localStorage.setItem(KEY_DOWNLOAD_APP, JSON.stringify({
          download: []
        }))
      }


    }

    initStore()

  }, [])



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
