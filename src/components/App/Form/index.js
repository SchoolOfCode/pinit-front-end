//import { ColorLensOutlined } from "@mui/icons-material"; //! not used; commented out for netlify
import Axios from "axios";
import { React, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import style from "./Form.module.css";

const API_URL = "http://localhost:5500";
// const API_URL = "https://gray2-2.herokuapp.com";

export default function Form({
   setForm,
   setTemporaryPin,
   addNewPin,
   clickPlace,
   userId,
   setRerender,
}) {
   const [obj, setObj] = useState({});
   const [image, setImage] = useState();
   const [imageUrl, setImageUrl] = useState(false);
   const [data, setData] = useState(false);
   const [latlng, setLatLng] = useState(clickPlace);
   const [locid, setLocid] = useState(0);

   //Using useForm hook to add validation to the form in line with HTML standards.
   const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
   } = useForm();

   //Sets Data on submit of the form
   const onSubmit = async (data) => {
      console.log("This is the data", data);
      setData(data);
      setTemporaryPin(false);
      addNewPin(clickPlace);
      // setForm(false);
   };

   //When Data state is updated this func creates new location and returns with loc_id

   useEffect(() => {
      if (data) {
         async function formSubmit(user_id, latlng, API_URL) {
            const lat = latlng.lat;
            const lng = latlng.lng;
            const obj = { user_id: user_id, lat: lat, lng: lng };
            try {
               const response = await fetch(`${API_URL}/location`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(obj),
               });
               const result = await response.json();
               if (result.success === true) {
                  console.log("it's ya boiiiii", result.payload);
                  setLocid(result.payload[0].loc_id);
               } else {
                  console.log(response);
               }
            } catch (err) {
               console.log(err);
            }
         }
         formSubmit(userId, latlng, API_URL);
      }
   }, [data]);

   //When location Id is updated then we Upload image to Cloudinary and return a URL

   useEffect(() => {
      const uploadImage = () => {
         const formData = new FormData();
         formData.append("file", image);
         formData.append("upload_preset", "syfwteis");

         Axios.post(
            "https://api.cloudinary.com/v1_1/dansutton/image/upload",
            formData
         ).then((response) => {
            console.log(response.data.url);
            setImageUrl(response.data.url);
            return response.data.url;
         });
      };
      uploadImage();
   }, [locid]);

   //Once the image has been uploaded to Cloudinary, the data has the Image URL and the location data added

   useEffect(() => {
      if (imageUrl) {
         setObj({
            loc_id: locid,
            img_url: imageUrl,
            ...data,
         });
      }
   }, [imageUrl]);

   const [media, setMedia] = useState([]);
   const [error, setError] = useState("");

   console.log(media, error);

   console.log(watch("example")); // watch input value by passing the name of it
   // The POST request.

   //When the form Object is updated with Final data, the Object is posted to the database
   useEffect(() => {
      if (Object.keys(obj).length < 5) {
         return;
      } else {
         console.log("This is the data to be posted", obj);
         async function getMedia() {
            try {
               const response = await fetch(`${API_URL}/media`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(obj),
               });
               const result = await response.json();
               if (result.success === true) {
                  console.log(result);
                  setMedia(result.payload);
                  setError("");
               } else {
                  console.log(response);
                  setError("Fetch didn't work :(");
               }
            } catch (err) {
               console.log(err);
               setError(err.message);
            }
         }
         //reset states
         getMedia()
            .then(setImageUrl(false))
            .then(setImage(false))
            .then(setForm(false))
            .then(setRerender(true));
      }
   }, [obj]);

   //useEffect to close the Form after the response that has a value in image url is received

   // useEffect(() => {
   //    if (obj.title !== undefined) {
   //       setForm(false);
   //    } else {
   //       return;
   //    }
   // }, [obj.title]);

   console.log(obj);
   console.log(obj.title);
   //The callback function "register" passes the input into the useForm Hook.
   //"Required" adds validation to inputted data.

   return (
      <div className={style.sidebarContainer}>
         <form
            className={style.formContainer}
            onSubmit={handleSubmit(onSubmit)}>
            <input
               className={style.fileInput}
               type="file"
               placeholder="Image"
               onChange={(e) => {
                  setImage(e.target.files[0]);
               }}
            />
            <input
               placeholder="Title"
               type="text"
               {...register("title", {
                  required: true,
                  minLength: 1,
                  maxLength: 40,
               })}
            />
            <input
               placeholder="Place"
               type="text"
               {...register("place", {
                  required: true,
                  minLength: 1,
                  maxLength: 40,
               })}
            />
            <input
               className={style.formContainerTextarea}
               placeholder="Note"
               type="text"
               {...register("notes", {
                  required: true,
                  minLength: 1,
                  maxLength: 80,
               })}
            />
            {/* Errors will return when field validation fails  */}
            {errors.exampleRequired && <span>This field is required</span>}

            <input className={style.formContainerButton} type="submit" />
         </form>
      </div>
   );
}
