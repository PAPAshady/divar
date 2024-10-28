import { baseApiUrl, filesUrl } from "./constants.js";

const getAllSocials = async () => {
  const res = await fetch(`${baseApiUrl}social`);
  return await res.json();
};

const renderSocialsInLandingPage = (socialsArray) => {
  const socialsWrapper = document.getElementById("socialsWrapper");

  const allSocials = socialsArray
    .map(
      (social) =>
        `<a href="${social.link}" class="landing__footer-social-icon-wrapper">
            <img
            class="landing__footer-social-icon"
            src="${filesUrl}${social.icon.path}"
            alt="${social.name}">
        </a>`
    )
    .join("");
  socialsWrapper.insertAdjacentHTML("beforeend", allSocials);
};

export { getAllSocials, renderSocialsInLandingPage };
