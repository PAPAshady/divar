import { setCookie, getCookie } from "../../utils/shared.js";
import { getAllCities, renderCitiesInLandingPage } from "../../utils/cities.js";

window.setCookie = setCookie;

window.addEventListener("load", async () => {
  const cityCookie = getCookie("city");

  if (cityCookie) {
    location.href = `public/main.html?city=${cityCookie}`;
    return;
  }

  const { data } = await getAllCities();
  const popularCities = data.cities.filter((city) => city.popular);
  renderCitiesInLandingPage(popularCities);
});
