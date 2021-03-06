import style from "./App.module.css";
import Navbar from "./Navbar";
import { React, useState, useEffect } from "react";
import PhotoModal from "./PhotoModal/index";
import Form from "./Form";
import { useAuth0 } from "@auth0/auth0-react";
import MarkerMap from "../Map";
import usePins from "../../hooks/usePins";
import mockData from "../Map/mockLocations.json"; // importing mock locations for testing

import OutsideClickHandler from "react-outside-click-handler";

// const API_URL = "http://localhost:5500";
const API_URL = "https://gray2-2.herokuapp.com";

function App() {
   // gets the user information after authentication
   const { user, isLoading, isAuthenticated } = useAuth0();

   if (isLoading) <p>Loading...</p>;

   // Sets the style of the sidebar to show it
   const [form, setForm] = useState(false);
   const [modal, setModal] = useState(false);
   const [data, setData] = useState([]);
   const [error, setError] = useState("");
   const [locationsData, setLocationsData] = useState(false);
   const [userId, setUserId] = useState(0);
   const [formPlace, setFormPlace] = useState();
   const [temporaryPin, setTemporaryPin] = useState(false);
   const [pins, addNewPin, newPlaceId] = usePins(mockData);
   const [clickPlace, setClickPlace] = useState({ lng: 0, lat: 0 });
   const [rerender, setRerender] = useState(true);
   const [mapLoc, setMapLoc] = useState(false);

   //! the GET request
   useEffect(() => {
      async function getData() {
         const email = user.email;
         console.log(email);
         try {
            const response = await fetch(`${API_URL}/users/${user.email}`);
            const newData = await response.json();
            console.log("THIS IS THE DATA IN THE MOUNTED USEEFFECT", newData);
            if (newData.success === true) {
               setData(newData.payload);
               setUserId(newData.payload[0].user_id);
               setError("");
               console.log(`DAAAATTTTTAAAAA`, data);
            } else {
               console.log(response, error);

               setError("Fetch didn't work :(");
            }
         } catch (err) {
            console.log(err);
            setError(err.message);
         }
      }
      if (!isLoading) {
         getData().then(setRerender(false));
      } // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [user]);

   useEffect(() => {
      if (userId) {
         async function getLocationData() {
            try {
               const response = await fetch(`${API_URL}/location/${userId}`);
               const newData = await response.json();
               console.log(
                  "THIS IS THE LOCATION DATA IN THE USEEFFECT",
                  newData
               );
               if (newData.success === true) {
                  setLocationsData(newData.payload);
                  setError("");
               } else {
                  console.log(response, error);

                  setError("Fetch didn't work :(");
               }
            } catch (err) {
               console.log(err);
               setError(err.message);
            }
         }
         getLocationData().then(setRerender(false));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [userId, rerender]);

   // useEffect(() => {
   //    console.log(formPlace);
   // }, [formPlace]);

   return (
      <div className={style.app}>
         <Navbar
            className={style.navbar}
            isAuthenticated={isAuthenticated}
            setMapLoc={setMapLoc}
            setModal={setModal}
            data={data}
         />

         <div className={style.mapContainer}>
            <MarkerMap
               mapLoc={mapLoc}
               setData={setData}
               data={data}
               locationsData={locationsData}
               setModal={setModal}
               className={style.map}
               setForm={setForm}
               setFormPlace={setFormPlace}
               temporaryPin={temporaryPin}
               setTemporaryPin={setTemporaryPin}
               pins={pins}
               addNewPin={addNewPin}
               newPlaceId={newPlaceId}
               clickPlace={clickPlace}
               setClickPlace={setClickPlace}
               modal={modal}
            />
         </div>
         {modal ? (
            <OutsideClickHandler onOutsideClick={() => setModal(false)}>
               <PhotoModal photo={modal} setModal={setModal} data={data} />
            </OutsideClickHandler>
         ) : (
            <></>
         )}
         {form ? (
            <OutsideClickHandler onOutsideClick={() => setForm(false)}>
               <Form
                  setForm={setForm}
                  formPlace={formPlace}
                  setTemporaryPin={setTemporaryPin}
                  addNewPin={addNewPin}
                  clickPlace={clickPlace}
                  userId={userId}
                  setRerender={setRerender}
               />
            </OutsideClickHandler>
         ) : (
            <></>
         )}

         {/* // TODO: change to place
  //             setFormPlace={setFormPlace}
  //          />
  //       </div>
  //       {modal ? <PhotoModal photo={modal} setModal={setModal} /> : <></>}
  //       {form ? <Form setForm={setForm} formPlace={formPlace} /> : <></>}
*/}
      </div>
   );
}

export default App;
