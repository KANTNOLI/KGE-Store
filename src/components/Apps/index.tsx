import { useSearchParams } from "react-router";

import style from "./Apps.module.scss"
import { useEffect, useState, type ReactNode } from "react";
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
    "footer": string
}

const KEY_LOAD_STATE = "KEY_LOAD_STATE"
const KEY_DOWNLOAD_APP = "KEY_DOWNLOAD_APP"

interface KeyLoadStateItf {
    refID: string,
    type: 0 | 1 | 2 | 3,
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
    // Триггердля установки приложух
    const [Download, setDownload] = useState<KeyLoadStateItf>({
        refID: "-1",
        type: 0,
        loaded: -1,
        size: -1
    })
    // Обьект массива ключей, скаченных приложух, пока просто с данными true or null
    const [Downloaded, setDownloaded] = useState<KeyDownloadAppItf>({})
    // Описание приложения по Query строке 
    const [app, setApp] = useState<apps | null>(null)
    // Таймер дефолт
    const [Timer, setTimer] = useState<number>(0)

    const [searchParams] = useSearchParams();
    const refID: string | null = searchParams.get('refID') || null;

    const RenderDownloadPage = (sec: number): ReactNode => {
        const Size = Download.size
        const CountLoad = (Download.loaded / Download.size) * 100

        const startDownloadBTN =
            (<button
                onClick={() => {
                    setDownload({
                        refID: refID || "",
                        loaded: 10,
                        type: 1,
                        size: 100,
                    })
                    localStorage.setItem(KEY_LOAD_STATE, JSON.stringify({
                        refID: refID,
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

        // Если скачивали уже
        if (Downloaded[refID || ""]) {
            return <button className={style.ready}>Uploaded</button>
        } else {

            // проверка на открыто ли у нас точно та установка
            if (Download.refID == refID) {
                switch (Download.type) {
                    case 1:
                        // ждем ответа от сервера
                        return loadigAwait
                    case 2:
                        // начало скачивания
                        return loadigResult
                    default:
                        // начать установку 
                        return startDownloadBTN
                }
            }

            return startDownloadBTN
        }
    }

    useEffect(() => {
        const HandleTrackLStorage = (event: StorageEvent) => {
            // ждем обновление localstore и обновляем данные
            switch (event.key) {
                case KEY_LOAD_STATE:
                    setDownload(JSON.parse(localStorage.getItem(KEY_LOAD_STATE) || "{}"))
                    break;
                case KEY_DOWNLOAD_APP:
                    setDownloaded(JSON.parse(localStorage.getItem(KEY_DOWNLOAD_APP) || "{}"))
                    break;
            }
        }
        window.addEventListener("storage", HandleTrackLStorage)

        const inter = setInterval(() => {
            if (Download.type == 2) {
                setTimer(before => before + 1)
            } else {
                clearInterval(inter)
            }

        }, 100);

        return () => {
            clearInterval(inter)
            window.removeEventListener("storage", HandleTrackLStorage)
        }
    }, [])


    useEffect(() => {
        if (refID) {
            axios.get(`http://localhost:2403/api/getApp?id=${refID}`).then((res) => {
                if (res.data.preview) {
                    const temp = res.data as apps
                    setApp(temp)
                } else {
                    setApp(null)
                }
            })

            setDownloaded(JSON.parse(localStorage.getItem(KEY_DOWNLOAD_APP) || "{}"))
        }


    }, [searchParams, Download])



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
            <div className={style.bodyApp}>
                <p className={style.bodyDesc1}>{app.desc1}</p>
                {
                    app.img.map((src, id) =>
                        <div key={id} className={style.photo}>
                            <img src={src} alt="Error!" className={style.photoImg} />
                        </div>
                    )
                }
                <p className={style.bodyDesc2}>{app.desc2}</p>
            </div>
            <div className={style.footer}>
                <p>{app.footer}</p>
            </div>
        </section>);
}



export default Apps;