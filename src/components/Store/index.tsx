import { useParams } from "react-router";
import style from "./Store.module.scss"

function Store() {
    const params = useParams();
    console.log(params ? params : "no");


    return (
        <section className={style.body}>
            <div className={style.page}>
                asd123
            </div>

            <div className={style.page}>
                asd123
            </div>


            <div className={style.page}>
                asd123
            </div>
        </section>
    );
}

export default Store;