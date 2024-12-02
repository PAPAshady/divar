import { setUrlParam, getUrlParam } from "../../utils/sharedUtils.js";
import { getAndRenderPosts } from "../../utils/posts.js";

const $ = document;
const globalSearchInput = $.getElementById("globalSearchInput");

// handle global seach input
const searchValue = getUrlParam("search");
if (searchValue) {
  globalSearchInput.value = searchValue;
}

globalSearchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    setUrlParam("search", e.target.value.trim());
    getAndRenderPosts();
  }
});
