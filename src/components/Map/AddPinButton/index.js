import React from "react";
import { Popup } from "react-map-gl";
import pinbuttonstyle from "./addpinbutton.module.css";
import GeoSearch from "../GeoSearch";

export default function AddPinButton({
   handleShowPopup,
   addNewPin,
   clickPlace,
   setForm,
   isMapInteractive,
   setTemporaryPin,
}) {
   // return <button style={{ width: "100px", height: "100px" }}>PINIT</button>;

   return (
      <Popup
         maxWidth="150px"
         className={pinbuttonstyle.container}
         longitude={clickPlace.lng}
         latitude={clickPlace.lat}
         anchor="bottom-left"
         onClose={() => {
            handleShowPopup();
         }}>
         <div className={pinbuttonstyle.popupcontents}>
            <p className={pinbuttonstyle.text}>
               Would you like to add a memory?
            </p>
            <button
               className={pinbuttonstyle.pinbutton}
               onClick={() => {
                  addNewPin(clickPlace);
                  setForm(true);
                  setTemporaryPin(true);
                  handleShowPopup();
               }}>
               {" "}
               PINIT{" "}
            </button>
         </div>
      </Popup>
   );
}
