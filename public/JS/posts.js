import { getPosts, renderPosts } from "../../utils/posts.js";
import { removeLoader } from "../../utils/sharedUtils.js";
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
  const [postsResponse, categoriesResponse] = await Promise.all([
    getPosts(),
    getAllCategories(),
  ]);
  const categories = categoriesResponse.data.categories;
  const posts = postsResponse.data.posts;
  renderPosts(posts, postsWrapper, noPostsAlertBox);
  renderCategoriesInSideBar(categories, sidebarCategoriesWrapper);
  showActiveCategoryInSidebar(categories);
  sidebarAccordionsHandler();
  sidebarSelectBoxesHandler();
  removeLoader();
});
