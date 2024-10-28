import {
  getAllSocials,
  renderSocialsInLandingPage,
} from "../../utils/socials.js";
import { setCookie, getCookie, removeLoader } from "../../utils/sharedUtils.js";
import { getAllCities, renderCitiesInLandingPage } from "../../utils/cities.js";

window.setCookie = setCookie;

const $ = document;
const searchCityInput = $.getElementById("searchCityInput");
const searchDropDownWrapper = $.getElementById("searchDropDownWrapper");
const searchInputAndDropDownContainer = $.getElementById(
  "searchInputAndDropDownContainer"
);

function citySearchHandler(citiesArray) {
  const searchValue = searchCityInput.value.trim();

  if (!searchValue) {
    searchDropDownWrapper.classList.remove("show");
    return;
  }

  const foundedCities = citiesArray.filter((city) =>
    city.name.startsWith(searchValue)
  );

  searchDropDownWrapper.innerHTML = "";

  if (foundedCities.length) {
    const allCityElements = foundedCities
      .map(
        (city) =>
          `<li class="landing__search-drop-down-item">
            <a
            class="landing__search-drop-down-link"
            href="public/main.html?city=${city.name}"
            onclick="setCookie('city', '${city.name}')"
            >
              ${city.name}
            </a>
          </li>`
      )
      .join("");
    searchDropDownWrapper.insertAdjacentHTML("beforeend", allCityElements);
  } else {
    searchDropDownWrapper.insertAdjacentHTML(
      "beforeend",

      `<div class="landing__search-drop-down-no-results-box">
        <img
        class="landing__search-drop-down-no-results-img"
        src="public/images/index/no-results.svg"
        alt="نتیجه ای برای جستوجوی شما پیدا نشد">
        <p>نتیجه ای برای جستجوی شما پیدا نشد.</p>
      </div>`
    );
  }

  searchDropDownWrapper.classList.add("show");
}

window.addEventListener("load", async () => {
  const cityCookie = getCookie("city");

  if (cityCookie) {
    location.href = `public/main.html?city=${cityCookie}`;
    return;
  }

  const { data } = await getAllCities();
  const socialsData = await getAllSocials();
  const popularCities = data.cities.filter((city) => city.popular);
  renderSocialsInLandingPage(socialsData.data.socials);
  renderCitiesInLandingPage(popularCities);
  removeLoader();

  searchCityInput.addEventListener("keyup", () =>
    citySearchHandler(data.cities)
  );
});

// close search drop down if user clicks outside of search drop down
window.addEventListener("click", (e) => {
  if (!searchInputAndDropDownContainer.contains(e.target)) {
    searchDropDownWrapper.classList.remove("show");
  }
});
