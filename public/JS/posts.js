import { getPosts, renderPosts } from "../../utils/posts.js";
import { getFromLocalStorage, removeLoader } from "../../utils/sharedUtils.js";
import { getAllCategories } from "../../utils/categories.js";
import {
  renderCategoriesInSideBar,
  sidebarSubCategoryClickHandler,
  sidebarNestedCategoryClickHandler,
  updateSidebarWithActiveCategory,
  sidebarAccordionsHandler,
} from "../../utils/sidebar.js";

window.sidebarSubCategoryClickHandler = sidebarSubCategoryClickHandler;
window.sidebarNestedCategoryClickHandler = sidebarNestedCategoryClickHandler;

const $ = document;
const postsWrapper = $.getElementById("postsWrapper");
const noPostsAlertBox = $.getElementById("noPostsAlertBox");
const sidebarCategoriesWrapper = $.getElementById("sidebarCategoriesWrapper");

window.addEventListener("load", async () => {
  const selectedCities = getFromLocalStorage("cities");
  const postsResponse = await getPosts(selectedCities[0].id);
  const categoriesResponse = await getAllCategories();
  renderPosts(postsResponse.data.posts, postsWrapper, noPostsAlertBox);
  renderCategoriesInSideBar(categoriesResponse.data.categories, sidebarCategoriesWrapper);
  updateSidebarWithActiveCategory(categoriesResponse.data.categories)
  sidebarAccordionsHandler()
  removeLoader();
});
