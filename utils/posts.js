import { baseApiUrl, filesUrl } from "./constants.js";
import {
  calculateRelativeTime,
  setLoader,
  removeLoader,
} from "./sharedUtils.js";

const getPosts = async () => {
  const urlParams = new URLSearchParams(location.search).toString();
  const res = await fetch(`${baseApiUrl}post/?${urlParams}`);
  return await res.json();
};

const renderPosts = (postsArray) => {
  const postsWrapper = document.getElementById("postsWrapper");
  const noPostsAlertBox = document.getElementById("noPostsAlertBox");

  postsWrapper.innerHTML = "";

  if (!postsArray.length) {
    noPostsAlertBox.classList.add("show");
    return;
  }
  noPostsAlertBox.classList.remove("show");

  const allPosts = postsArray
    .map(
      (post) =>
        `<a href="/pages/post.html?id=${post._id}" class="post">
            <div class="post__infos">
                <h2 class="post__title">${post.title}</h2>
                <div class="posts__prices-wrapper">
                    ${
                      post.price
                        ? `<span class="post__main-price"><span class="post__main-price-number">${post.price.toLocaleString()}</span> تومان</span>`
                        : !post.price || post.exchange
                        ? '<span class="post__salary-price">قیمت توافقی</span>'
                        : ""
                    }
                </div>
                <div class="post__location-and-time">
                    <div class="post__time-wrapper">
                        <i class="fa-regular fa-clock post__time-icon"></i>
                        <span class="post__time-text">
                            ${calculateRelativeTime(post.createdAt)}
                        </span>
                    </div>
                    <div class="post__location-wrapper">
                        <i class="fa-regular fa-location-dot post__location-icon"></i>
                        <span class="post__location-text">
                            ${post.city.slug}
                        </span>
                    </div>
                </div>
            </div>
            <div class="post__img-wrapper">
                <img
                    class="post__img"
                    src="${
                      post.pics.length
                        ? `${filesUrl}${post.pics[0].path}`
                        : "../public/images/posts/no-image.png"
                    }"
                    alt="${post.title}"
                    loading="lazy"
                />
            </div>
        </a>`
    )
    .join("");

  postsWrapper.insertAdjacentHTML("beforeend", allPosts);
};

const getAndRenderPosts = async () => {
  const postsLoader = document.getElementById("postsLoader");
  setLoader(postsLoader);
  const { data: postsInfos } = await getPosts();
  renderPosts(postsInfos.posts);
  removeLoader(postsLoader);
};

export { getPosts, renderPosts, getAndRenderPosts };
