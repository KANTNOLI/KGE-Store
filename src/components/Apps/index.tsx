import { useParams } from "react-router";
import style from "./Apps.module.scss"
import { useCallback, useEffect, useState, type ReactNode } from "react";
import axios from "axios";
interface preview {
    "img": string,
    "header": string,
    "price": number
}

interface apps {
    "refID": string,
    "preview": preview,
    "title": string,
    "desc1": string,
    "img": string[],
    "desc2": string,
}

const KEY_LOAD_STATE = "KEY_LOAD_STATE"
const KEY_DOWNLOAD_APP = "KEY_DOWNLOAD_APP"

interface KeyLoadStateItf {
    refID: string,
    type: 0 | 1 | 2,
    loaded: number,
    size: number,
}

interface KeyDownloadAppItf {
    [key: string]: boolean
}

const loadingState = (progress: number) => {
    const part = "=";
    const space = "   ";
    const load = Math.floor(progress / 10);

    return `${part.repeat(load)}${space.repeat(10 - load)}`;
};

function Apps() {
    const [Download, setDownload] = useState<KeyLoadStateItf>({
        refID: "-1",
        type: 0,
        loaded: -1,
        size: -1
    })
    const [Downloaded, setDownloaded] = useState<KeyDownloadAppItf>({})
    const [app, setApp] = useState<apps | null>(null)
    const [Timer, setTimer] = useState<number>(0)
    const params = useParams();

    const RenderDownloadPage = (sec: number): ReactNode => {
        const Size = Download.size
        const CountLoad = (Download.loaded / Download.size) * 100

        const startDownloadBTN =
            (<button
                onClick={() => {
                    setDownload({
                        refID: params.refID || "",
                        loaded: 10,
                        type: 1,
                        size: 100,
                    })
                    localStorage.setItem(KEY_LOAD_STATE, JSON.stringify({
                        refID: params.refID,
                        type: 1,
                        loaded: 0,
                        size: 0,
                    }))
                    setTimer(0)
                }} className={style.downloadBTN}>
                Download
            </button>)

        const loadigResult = <code className={style.downloadigPanelStart}>{`[${loadingState(CountLoad)}] ${Size}KB ${sec}s`}</code>
        const loadigAwait = <code className={style.downloadigPanelStart}>{`wait server response`}</code>

        if (Downloaded[params.refID || "ad"]) {
            return <button className={style.ready}>Uploaded</button>
        } else {

            if (Download.refID == params.refID) {
                switch (Download.type) {
                    case 1:
                        return loadigAwait
                    case 2:
                        return loadigResult
                    default:
                        return startDownloadBTN
                }
            }

            return startDownloadBTN
        }
    }

    useEffect(() => {
        const HandleTrackLStorage = (event: StorageEvent) => {
            switch (event.key) {
                case KEY_LOAD_STATE:
                    setDownload(JSON.parse(localStorage.getItem(KEY_LOAD_STATE) || "{}"))
                    break;
                case KEY_DOWNLOAD_APP:
                    setDownloaded(JSON.parse(localStorage.getItem(KEY_DOWNLOAD_APP) || "{}"))
                    break;
            }
        }

        const inter = setInterval(() => {
            setTimer(before => before + 1)
        }, 100);

        window.addEventListener("storage", HandleTrackLStorage)
        return () => {
            clearInterval(inter)
            window.removeEventListener("storage", HandleTrackLStorage)
        }
    }, [])


    useEffect(() => {
        axios.get(`http://localhost:2403/api/getApp?id=${params.refID}`).then((res) => {
            if (res.data.preview) {
                const temp = res.data as apps
                setApp(temp)
            } else {
                setApp(null)
            }
        })

        setDownloaded(JSON.parse(localStorage.getItem(KEY_DOWNLOAD_APP) || "{}"))

    }, [params, Download])




    return (app &&
        <section className={style.body}>
            <div className={style.header}>
                <div className={style.headerTop}>
                    <img className={style.headerImg} src={app.preview.img} alt="" />
                    <div>
                        <p className={style.headerHeaderTitle}>{app.title}</p>
                        <p className={style.headerHeaderPrice}>Price: {app.preview.price || "FREE"}</p>
                    </div>
                </div>
                <div className={style.downloadig}>
                    {RenderDownloadPage(Timer / 10)}
                </div>
            </div>
            <div className={style.bodyApp}>1</div>
            <div className={style.footer}>1</div>
        </section>);
}

export default Apps;