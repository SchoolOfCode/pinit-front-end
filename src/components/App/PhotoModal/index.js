import React from "react";
import style from "./PhotoModal.module.css";
import FadeIn from "react-fade-in";

function PhotoModal({ photo, setModal }) {
   return (
      <FadeIn>
         <div>
            <div className={style.modal}>
               <h2 className={style.close} onClick={() => setModal(false)}>
                  X
               </h2>
               <div className={style.modalContent}>
                  <img src={photo.img_url} alt="Modal Pic" />
                  <div className={style.overlay}>
                     <div className={style.text}>{photo.notes}</div>
                  </div>
               </div>
            </div>
         </div>
      </FadeIn>
   );
}

export default PhotoModal;
