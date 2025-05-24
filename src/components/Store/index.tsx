import { Link, useParams } from "react-router";
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
    "desc": string,
    "img": string[]
}

interface props {
    windowWidth: number
}


function Store() {
    const params = useParams();
    console.log(params ? params : "no");
    const [apps, setApps] = useState<apps[]>([])
    const MainPanel = useRef<HTMLDivElement>(null)
    const DragPanel = useRef<HTMLDivElement>(null)

    const HandleDragActive = useCallback(
        (event: MouseEvent) => {
            document.body.style.cursor = "e-resize"
            document.body.addEventListener("mousemove", HandleDragMove)
        },
        [],
    )

    const HandleDragDisable = useCallback(
        (event: MouseEvent) => {
            document.body.style.cursor = "auto"
            document.body.removeEventListener("mousemove", HandleDragMove)
        },
        [],
    )

    const HandleDragMove = useCallback(
        (event: MouseEvent) => {
            if (event.clientX > 78 && event.clientX < 500) {
                if (MainPanel.current && DragPanel.current) {
                    MainPanel.current.style.width = `${event.clientX}px`
                    DragPanel.current.style.left = `${event.clientX}px`
                }
            }
        },
        [],
    )




    useEffect(() => {
        axios.get("http://localhost:2403/api/getStore").then((res) => {
            const temp = res.data as apps[]
            setApps(temp)
        })


        console.log(MainPanel.current?.offsetWidth);

        console.log(document.body.offsetWidth);

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