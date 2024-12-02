const setCookie = (name, value, daysUntilExpire) => {
  const date = new Date();

  // if 'daysUntilExpire' is not undefined, the cookie will never expire
  daysUntilExpire
    ? date.setTime(date.getTime() + daysUntilExpire * 24 * 60 * 60 * 1000)
    : date.setFullYear(date.getFullYear() + 1000);

  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
};

const removeCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};

const getCookie = (name) => {
  const cookieArray = document.cookie.split("; ");
  const result = cookieArray
    .find((cookie) => {
      if (cookie.split("=")[0] === name) {
        return true;
      }
    })
    ?.split("=")[1];
  return result || null;
};

const setToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getFromLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

const removeFromLocalStorage = (key) => {
  localStorage.removeItem(key);
};

const removeLoader = (loaderElement) => loaderElement.classList.remove("show");

const setLoader = (loaderElement) => loaderElement.classList.add("show");

const calculateRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();

  const seconds = Math.floor((now - date) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Calculate differences with exact month and year handling
  const years = now.getFullYear() - date.getFullYear();
  const months = now.getMonth() - date.getMonth() + years * 12;

  const rtf = new Intl.RelativeTimeFormat("fa", { numeric: "auto" });

  if (years > 0) return rtf.format(-years, "year");
  if (months > 0) return rtf.format(-months, "month");
  if (days > 0) return rtf.format(-days, "day");
  if (hours > 0) return rtf.format(-hours, "hour");
  if (minutes > 0) return rtf.format(-minutes, "minute");
  if (seconds > 0) return rtf.format(-seconds, "second");

  return "چند لحظه پیش";
};

const getUrlParam = (key) => {
  const param = new URLSearchParams(location.search);
  return param.get(key);
};

const setUrlParam = (key, value) => {
  const param = new URLSearchParams(location.search);
  param.set(key, value);
  const searchString = param.toString();
  const newUrl = `${window.location.pathname}?${searchString}`;
  window.history.replaceState({}, "", newUrl);
};

const removeUrlParam = (key) => {
  const param = new URLSearchParams(location.search);
  param.delete(key);
  // check if any parameter exist
  const newUrl = param.toString()
    ? `${window.location.pathname}?${param}`
    : window.location.pathname;
  window.history.replaceState({}, "", newUrl);
};

const findParentElementByClassName = (element, className) => {
  while (!element.classList.contains(className)) {
    element = element.parentElement;
  }
  return element;
};

export {
  setCookie,
  removeCookie,
  getCookie,
  removeLoader,
  setLoader,
  setToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
  calculateRelativeTime,
  getUrlParam,
  setUrlParam,
  removeUrlParam,
  findParentElementByClassName,
};
