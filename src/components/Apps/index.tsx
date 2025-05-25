import { useParams } from "react-router";
import style from "./Apps.module.scss"



function Apps() {

    const params = useParams();
    console.log(params.refID);

    return (<section className={style.body}>{params.refID}</section>);
}

export default Apps;