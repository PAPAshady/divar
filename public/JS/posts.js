import { getPosts, renderPosts } from "../../utils/posts.js";
import { getFromLocalStorage, removeLoader } from "../../utils/sharedUtils.js";

const $ = document;
const postsWrapper = $.getElementById("postsWrapper");
const noPostsAlertBox = $.getElementById("noPostsAlertBox");

window.addEventListener("load", async () => {
  const selectedCities = getFromLocalStorage("cities");
  const postsResponse = await getPosts(selectedCities[0].id);
  renderPosts(postsResponse.data.posts, postsWrapper, noPostsAlertBox);
  removeLoader();
});
