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

const renderMainCategoriesInSideBar = (categoriesArray, wrapperElement) => {
  wrapperElement.innerHTML = "";
  const allCategories = categoriesArray
    .map(
      (category) =>
        `<li class="sidebar__category">
            <a href="Javascript:void(0)" class="sidebar__category-link">
                <i class="${
                  categoriesIcons[category.slug]
                } sidebar__category-icon"></i>
                <span class="sidebar__category-title">${category.title}</span>
            </a>
        </li>`
    )
    .join("");
  wrapperElement.insertAdjacentHTML("beforeend", allCategories);
};

export { getAllCategories, renderMainCategoriesInSideBar };
