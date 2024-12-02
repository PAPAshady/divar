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

window.addEventListener("load", async () => {
  const [postsResponse, categoriesResponse] = await Promise.all([
    getPosts(),
    getAllCategories(),
  ]);
  const categories = categoriesResponse.data.categories;
  const posts = postsResponse.data.posts;
  renderPosts(posts);
  renderCategoriesInSideBar(categories);
  showActiveCategoryInSidebar(categories);
  sidebarAccordionsHandler();
  sidebarSelectBoxesHandler();
  removeLoader();
});
