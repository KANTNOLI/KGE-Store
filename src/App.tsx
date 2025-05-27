import { useEffect, useRef } from 'react'
import style from "./App.module.scss"
import { Route, Routes } from 'react-router';
import Store from './components/Store';
import Apps from './components/Apps';

const KEY_LOAD_STATE = "KEY_LOAD_STATE"
const KEY_DOWNLOAD_APP = "KEY_DOWNLOAD_APP"


// interface KeyLoadStateItf {
//   refID: string,
//   loaded: number,
//   type: 0 | 1 | 2,
//   size: number,
// }

// //0 - off, 1 - need load, 2 - downloading, 3 - ready

// interface KeyDownloadAppItf {
//   [key: string]: boolean
// }




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
          type: 0,
          size: -1,
        }))
      }

      if (!tempKEY_DOWNLOAD_APP) {
        localStorage.setItem(KEY_DOWNLOAD_APP, JSON.stringify({ "01-99-99-99-2403": true }))
      }


    }

    initStore()

  }, [])



  return (
    <Routes>
      <Route
        path="/"
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
