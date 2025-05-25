import { Link } from "react-router";
import style from "./Store.module.scss"
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
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
    loaded: number,
    type: 0 | 1 | 2,
    size: number,
}

interface KeyDownloadAppItf {
    [key: string]: boolean
}

function rand(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


const dispatchStorageEvent = (key: string, newValue: string | null) => {
    window.dispatchEvent(new StorageEvent('storage', {
        key,
        newValue,
        oldValue: localStorage.getItem(key),
        url: window.location.href,
        storageArea: localStorage
    }));
};

const originalSetItem = localStorage.setItem;
localStorage.setItem = function (key: string, value: string) {
    originalSetItem.call(this, key, value);
    dispatchStorageEvent(key, value);
};

function Store() {

    const [apps, setApps] = useState<apps[]>([])
    const MainPanel = useRef<HTMLDivElement>(null)
    const DragPanel = useRef<HTMLDivElement>(null)

    const HandleDragMove = useCallback(
        (event: MouseEvent) => {
            if (event.clientX > 78 && event.clientX < 800) {
                if (MainPanel.current && DragPanel.current) {
                    MainPanel.current.style.width = `${event.clientX}px`
                    DragPanel.current.style.left = `${event.clientX}px`
                }
            }
        },
        [],
    )
    const HandleDragActive = useCallback(
        () => {
            document.body.style.cursor = "e-resize"
            document.body.addEventListener("mousemove", HandleDragMove)
        },
        [HandleDragMove],
    )
    const HandleDragDisable = useCallback(
        () => {
            document.body.style.cursor = "default"
            document.body.removeEventListener("mousemove", HandleDragMove)
        },
        [HandleDragMove],
    )

    useEffect(() => {
        axios.get("http://localhost:2403/api/getAppList").then((res) => {
            const temp = res.data as apps[]
            setApps(temp)
        })

        // setInterval(() => {
        //     localStorage.setItem(KEY_LOAD_STATE, JSON.stringify({
        //         refID: "10-04-24-03-0505",
        //         type: 1,
        //         loaded: rand(100, 1000),
        //         size: 1000,
        //     }))
        // }, 1000);

    }, [])

    useEffect(() => {
        DragPanel.current?.addEventListener("mousedown", HandleDragActive)
        document.body.addEventListener("mouseup", HandleDragDisable)
        return () => {
            DragPanel.current?.removeEventListener("mousedown", HandleDragActive)
            document.body.removeEventListener("mouseup", HandleDragDisable)
        }
    }, [apps])

    return (
        <>
            <section ref={MainPanel} className={style.body}>
                {apps.map((app) =>
                    <Link key={app.refID} to={`/${app.refID}`} className={style.page}>
                        <img className={style.preview} src={app.preview.img} alt="preview" />
                        <div className={style.previewDiv}>
                            <p className={style.previewTitle}>{app.preview.header}</p>
                            <p className={style.previewPrice}>Price: {app.preview.price || "FREE"}</p>
                        </div>
                    </Link>
                )}

            </section>
            <p ref={DragPanel} className={style.dragPanel}></p>
        </>
    );
}

export default Store;