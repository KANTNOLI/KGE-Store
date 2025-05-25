import { useParams } from "react-router";
import style from "./Apps.module.scss"
import { useCallback, useEffect, useState } from "react";
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

    console.log();

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
    const params = useParams();



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
            console.log(event.key);
        }

        window.addEventListener("storage", HandleTrackLStorage)
        return () => {
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

        console.log(Download);

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
                    {Download.refID == params.refID ?
                        <code className={style.downloadigPanelStart}>{`[${loadingState(55)}] 18% 32.2MB 21.2s`}</code> :
                        <button className={style.downloadBTN}>Download</button>}

                </div>
            </div>
            <div className={style.bodyApp}>1</div>
            <div className={style.footer}>1</div>
        </section>);
}

export default Apps;