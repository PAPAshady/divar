import { getPosts, renderPosts } from "../../utils/posts.js";
import { getFromLocalStorage, removeLoader } from "../../utils/sharedUtils.js";
import { getAllCategories } from "../../utils/categories.js";
import {
  renderCategoriesInSideBar,
  showActiveCategoryInSidebar,
  sidebarAccordionsHandler,
  sidebarSelectBoxesHandler,
  selectBoxOptionClickHandler,
} from "../../utils/sidebar.js";

window.selectBoxOptionClickHandler = selectBoxOptionClickHandler;

const $ = document;
const postsWrapper = $.getElementById("postsWrapper");
const noPostsAlertBox = $.getElementById("noPostsAlertBox");
const sidebarCategoriesWrapper = $.getElementById("sidebarCategoriesWrapper");

window.addEventListener("load", async () => {
  const selectedCities = getFromLocalStorage("cities");
  const postsResponse = await getPosts(selectedCities[0].id);
  const categoriesResponse = await getAllCategories();
  const categories = categoriesResponse.data.categories;
  renderPosts(postsResponse.data.posts, postsWrapper, noPostsAlertBox);
  renderCategoriesInSideBar(categories, sidebarCategoriesWrapper);
  showActiveCategoryInSidebar(categories);
  sidebarAccordionsHandler();
  sidebarSelectBoxesHandler();
  removeLoader();
});
