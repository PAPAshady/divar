import { baseApiUrl } from "./constants.js";

// since the server dose not provide dynamic icon for each category, this variable will do the job.
// with the 'slug' property of each category that comes from server, we can access each property of this object.
// I used Font-Awesome icons.
const categoriesIcons = {
  real_state: "fa-regular fa-city",
  vehicle_posts: "fa-regular fa-car",
  "electronic-devices": "fa-regular fa-mobile",
  appliances: "fa-regular fa-lamp",
  services: "fa-regular fa-brush",
  personal_items: "fa-regular fa-watch",
  hobbies: "fa-regular fa-dice",
  social: "fa-regular fa-users",
  equipments: "fa-regular fa-microphone",
  hiring: "fa-regular fa-briefcase",
};

const getAllCategories = async () => {
  const res = await fetch(`${baseApiUrl}category`);
  return await res.json();
};


export { getAllCategories, categoriesIcons };
