import { baseApiUrl } from "./constants.js";

const getAllCities = async () => {
  const res = await fetch(`${baseApiUrl}location`);
  return await res.json();
};

const renderCitiesInLandingPage = (citiesArray) => {
  const wrapperElement = document.getElementById("popularCititesWrapper");
  const allPopularCities = citiesArray
    .map(
      (city) =>
        `<a
        class="landing__popular-cities-card"
        onclick="cityClickHandler(${city.id}, '${city.name}')"
        href="pages/posts.html?city=${city.id}">
            <h2 class="landing__popular-cities-text">${city.name}</h2>
        </a>`
    )
    .join("");
  wrapperElement.insertAdjacentHTML("beforeend", allPopularCities);
};

export { getAllCities, renderCitiesInLandingPage };
