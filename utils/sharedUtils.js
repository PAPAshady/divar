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

const removeLoader = () => {
  document.getElementById("loader").classList.remove("show");
};

export {
  setCookie,
  removeCookie,
  getCookie,
  removeLoader,
  setToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
};