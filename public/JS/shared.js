import {
  setUrlParam,
  getUrlParam,
  showModal,
  hideModal,
} from "../../utils/sharedUtils.js";
import { getAndRenderPosts } from "../../utils/posts.js";

const $ = document;
const globalSearchInput = $.getElementById("globalSearchInput");
const popularSearchesWrapper = $.getElementById("popularSearchesWrapper");

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

globalSearchInput.addEventListener("focus", () => {
  showModal(".header", "show-search-drop-down");
});

window.addEventListener("click", () => {
  const globalSearchInputWrapper = document.getElementById(
    "globalSearchInputAndPopularSearchesDropDownWrapper"
  );

  window.addEventListener("click", (e) => {
    if (!globalSearchInputWrapper.contains(e.target)) {
      hideModal(".header", "show-search-drop-down");
    }
  });
});

const popularSearchesArray = [
  "خودرو",
  "ساعت",
  "موبایل",
  "لباس",
  "جواهرات",
  "اکسسوری",
];

popularSearchesWrapper.innerHTML = "";

const allPopularSearches = popularSearchesArray
  .map(
    (popularSearchTag) =>
      `<a 
        class="header__popular-search-tag"
        href="Javascript:void(0)"
        onclick="popularSearchClickHandler('${popularSearchTag}')"
      >
        ${popularSearchTag}
      </a>`
  )
  .join("");

popularSearchesWrapper.insertAdjacentHTML("beforeend", allPopularSearches);

window.popularSearchClickHandler = (popularSearchTag) => {
  setUrlParam("search", popularSearchTag);
  getAndRenderPosts();
  hideModal(".header", "show-search-drop-down");
  globalSearchInput.value = popularSearchTag
};
