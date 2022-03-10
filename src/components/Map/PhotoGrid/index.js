import React, { useState, useEffect } from "react";
import style from "./photogrid.module.css";
import PhotoCard from "./PhotoCard";
import { get } from "react-hook-form";

const API_URL = "http://localhost:5500";
// const API_URL = "https://gray2-2.herokuapp.com";

function PhotoGrid({
   setData,
   data,
   setModal,
   setPhotoGridOpened,
   onPhotoGridClose,
   locImages,
}) {
   const [error, setError] = useState("");

   const [images, setImages] = useState(false);

   //! DELETE REQUEST
   async function deleteMedia(id) {
      try {
         const response = await fetch(`${API_URL}/media/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
         });
         const result = await response.json();
         if (result.success === true) {
            setError(`${id}`);
         } else {
            setError("");
         }
      } catch (err) {
         console.log(err);
         setError(err.message);
      }
   }

   //! GET IMAGES REQUEST & REFRESH ON DELETE
   useEffect(() => {
      async function getImages() {
         const response = await fetch(
            `http://localhost:5500/media/${locImages.loc_id}`
         );
         const data = await response.json();
         const payload = await data.payload;

         console.log("this is fetched images", payload);
         let result = await payload.reduce((unique, o) => {
            if (!unique.some((obj) => obj.media_id === o.media_id)) {
               unique.push(o);
            }
            return unique;
         }, []);

         setImages(result);
      }
      getImages();
   }, [locImages, error]);

   return (
      <div className={style.photoGridContainer}>
         {images ? (
            images.map((item, index) => {
               return (
                  <PhotoCard
                     key={item.media_id}
                     dataObj={images[index]}
                     setModal={setModal}
                     deleteMedia={deleteMedia}
                     id={item.media_id}
                  />
               );
            })
         ) : (
            <></>
         )}
      </div>
   );
}

export default PhotoGrid;
