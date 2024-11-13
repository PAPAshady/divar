import { getPosts, renderPosts } from "../../utils/posts.js";
import { getFromLocalStorage, removeLoader } from "../../utils/sharedUtils.js";
import { getAllCategories, renderMainCategoriesInSideBar } from "../../utils/categories.js";

const $ = document;
const postsWrapper = $.getElementById("postsWrapper");
const noPostsAlertBox = $.getElementById("noPostsAlertBox");
const sidebarCategoriesWrapper = $.getElementById("sidebarCategoriesWrapper");

window.addEventListener("load", async () => {
  const selectedCities = getFromLocalStorage("cities");
  const postsResponse = await getPosts(selectedCities[0].id);
  const categoriesResponse = await getAllCategories();
  renderPosts(postsResponse.data.posts, postsWrapper, noPostsAlertBox);
  renderMainCategoriesInSideBar(categoriesResponse.data.categories, sidebarCategoriesWrapper);
  removeLoader();
});
