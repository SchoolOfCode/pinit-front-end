import React from "react";
import style from "./photocard.module.css";

function PhotoCard({ key, dataObj, delFunc }) {
   // css to allow only a certain amount of char for the notes
   // returning data populated by the DummyData
   return (
      <div className={style.flipcard}>
         <div className={style.flipcardContainer}>
            <div className={style.flipcardFront}>
               <img
                  className={style.polaroidFrame}
                  src={require("../../../../img/photo-frame.png")}
                  alt="Polaroid Frame"
               />
               <div className={style.photoDiv}>
                  {" "}
                  <img
                     className={style.photo}
                     src={dataObj.aws_key}
                     alt={key}
                  />{" "}
               </div>
            </div>
            <div className={style.flipcardBack}>
               <button onClick={() => delFunc(dataObj.id)}>
                  Delete photograph #{dataObj.id}
               </button>
               <h1>{dataObj.media_title}</h1>
               <h2>
                  {dataObj.location} - {dataObj.date}
               </h2>
               <h3>{dataObj.media_descr}</h3>
            </div>
         </div>
      </div>
   );
}

export default PhotoCard;
