import { useParams } from "react-router";
import style from "./Apps.module.scss"



function Apps() {

    const params = useParams();
    console.log(params.refID);

    return (
        <section className={style.body}>
            <div className={style.header}></div>
            <div className={style.bodyApp}>1</div>
            <div className={style.footer}>1</div>
        </section>);
}

export default Apps;