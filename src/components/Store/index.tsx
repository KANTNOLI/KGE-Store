import { useParams } from "react-router";
import style from "./Store.module.scss"

function Store() {
    const params = useParams();
    console.log(params ? params : "no");


    return (
        <section className={style.style}>
            <div className={style.list}>
                asd
            </div>
        </section>
    );
}

export default Store;