import { categoriesIcons } from "./categories.js";
import { setUrlParam, removeUrlParam, getUrlParam } from "./sharedUtils.js";

const renderCategoriesInSideBar = (categoriesArray, wrapperElement) => {
  const sidebarSubCategoriesSection = document.getElementById(
    "sidebarSubCategoriesSection"
  );
  const sidebarSubCategoriesMenuBackBtn = document.getElementById(
    "sidebarSubCategoriesMenuBackBtn"
  );

  wrapperElement.innerHTML = "";
  const mainCategories = categoriesArray
    .map(
      (category) =>
        `<li
            class="sidebar__category"
            data-category-id="${category._id}"
        >
            <a href="Javascript:void(0)" class="sidebar__category-link">
              <i class="${
                categoriesIcons[category.slug]
              } sidebar__category-icon"></i>
              <span class="sidebar__category-title">${category.title}</span>
            </a>
        </li>`
    )
    .join("");
  wrapperElement.insertAdjacentHTML("beforeend", mainCategories);

  const mainCategoriesElements =
    document.querySelectorAll(".sidebar__category");

  mainCategoriesElements.forEach((categoryElement) => {
    categoryElement.addEventListener("click", () => {
      const selectedCategory = categoriesArray.find(
        (category) => category._id === categoryElement.dataset.categoryId
      );
      setUrlParam("categoryID", selectedCategory._id);
      location.reload();
    });
  });

  // close the sub categories menu when user clicks on back btn
  sidebarSubCategoriesMenuBackBtn.addEventListener("click", () => {
    removeUrlParam("categoryID");
    sidebarSubCategoriesSection.classList.remove("show");
    location.reload();
  });
};

const renderSubCategoriesInSideBar = (subCategoriesArray) => {
  const sidebarSubCategoriesWrapper = document.getElementById(
    "sidebarSubCategoriesWrapper"
  );
  const sidebarSubCategoriesSection = document.getElementById(
    "sidebarSubCategoriesSection"
  );

  sidebarSubCategoriesWrapper.innerHTML = "";
  const subCategoriesElements = subCategoriesArray
    .map(
      (subCategory) =>
        `<li
          class="sidebar__sub-category"
          data-sub-category-id="${subCategory._id}"
        >
          <a
            href="Javascript:void(0)"
            class="sidebar__sub-category-link"
            onclick="sidebarSubCategoryClickHandler(this, '${subCategory._id}')"
          >
            <span class="sidebar__sub-category-link-text"
              >${subCategory.title}</span
            >
          </a>
          <ul
            class="sidebar__sub-category-nesetd-categories-wrapper"
            id="nestedSubCategoriesWrapper"
          >
            ${subCategory.subCategories
              .map(
                (nestedCategory) =>
                  `<li
                    class="sidebar__sub-category-nesetd-category"
                    onclick="sidebarNestedCategoryClickHandler(this, '${nestedCategory._id}')"
                    data-nested-category-id="${nestedCategory._id}"
                  >
                    <a
                      href="Javascript:void(0)"
                      class="sidebar__sub-category-nesetd-category-link"
                      >${nestedCategory.title}</a
                    >
                  </li>`
              )
              .join("")}
          </ul>
        </li>`
    )
    .join("");

  sidebarSubCategoriesWrapper.insertAdjacentHTML(
    "beforeend",
    subCategoriesElements
  );
  sidebarSubCategoriesSection.classList.add("show");
};

const sidebarSubCategoryClickHandler = (element, subCategoryID) => {
  const allSubCategoriesElements = document.querySelectorAll(
    ".sidebar__sub-category"
  );

  allSubCategoriesElements.forEach((element) => {
    element.classList.remove("active");
  });

  // remove '.active' class from all nested categories elements in case user clicks on any sub category
  document
    .querySelectorAll(".sidebar__sub-category-nesetd-category")
    .forEach((nestedCategoryElem) =>
      nestedCategoryElem.classList.remove("active")
    );

  element.parentElement.classList.add("active");
  setUrlParam("categoryID", subCategoryID);
  location.reload();
};

const sidebarNestedCategoryClickHandler = (element, nestedCategoryID) => {
  const allNestedCategories = document.querySelectorAll(
    ".sidebar__sub-category-nesetd-category"
  );
  allNestedCategories.forEach((nestedCategoryElem) =>
    nestedCategoryElem.classList.remove("active")
  );
  element.classList.add("active");
  setUrlParam("categoryID", nestedCategoryID);
  location.reload();
};

// This function runs on every page load to check if a specific category is selected.
// If a category is selected, it highlights the corresponding item in the sidebar as active.
const updateSidebarWithActiveCategory = (categoriesArray) => {
  const sidebarSubCategoriesSectionTitle = document.getElementById(
    "sidebarSubCategoriesSectionTitle"
  );
  const currentCategoryID = getUrlParam("categoryID");

  // Check if 'currentCategoryID' exists.
  // If it doesn't exist, the user hasn't selected any category.
  // If it exists, the user has selected a category, but we need to determine which one.
  if (currentCategoryID) {
    const subCategories = categoriesArray.flatMap(
      (category) => category.subCategories
    );
    const nestedCategories = subCategories.flatMap(
      (subCategory) => subCategory.subCategories
    );

    const findCategoryById = (categoriesArray, categoryId) =>
      categoriesArray.find((category) => category._id === categoryId);

    let currentNestedCategory = null;
    let currentSubCategory = null;
    let currentMainCategory = findCategoryById(
      categoriesArray,
      currentCategoryID
    );

    // Check if the selected category is a main category.
    // If 'currentMainCategory' doesn't exist, the selected category might be a subcategory or a nested category.
    if (!currentMainCategory) {
      currentSubCategory = findCategoryById(subCategories, currentCategoryID);

      // Check if the selected category is a subcategory.
      // If 'currentSubCategory' doesn't exist, the selected category is a nested category.
      if (currentSubCategory) {
        currentMainCategory = findCategoryById(
          categoriesArray,
          currentSubCategory.parent
        );
      } else {
        // Find the current category (which is a nested category) among all nested categories.
        currentNestedCategory = findCategoryById(
          nestedCategories,
          currentCategoryID
        );

        // Find the subcategory that is the parent of the current nested category.
        currentSubCategory = findCategoryById(
          subCategories,
          currentNestedCategory.parent
        );

        // Find the main category that is the grandparent of the current nested category.
        currentMainCategory = findCategoryById(
          categoriesArray,
          currentSubCategory.parent
        );
      }
    }

    // Update the sidebar title to the main category's title.
    sidebarSubCategoriesSectionTitle.textContent = currentMainCategory.title;

    // Render the subcategories of the current main category in the sidebar.
    renderSubCategoriesInSideBar(currentMainCategory.subCategories);

    // Highlight the selected subcategory in the sidebar (if it exists).
    const currentSubCategoryElement = document.querySelector(
      `[data-sub-category-id="${currentSubCategory?._id}"]`
    );

    // Highlight the selected nested category in the sidebar (if it exists).
    const currentNestedCategoryElement = document.querySelector(
      `[data-nested-category-id="${currentNestedCategory?._id}"]`
    );

    // If the selected category is a subcategory, mark the corresponding element as active.
    currentSubCategoryElement?.classList.add("active");

    // If the selected category is a nested category, mark the corresponding element as active.
    currentNestedCategoryElement?.classList.add("active");
  }
};

const sidebarAccordionsHandler = () => {
  const allAccordions = document.querySelectorAll(".sidebar__filter-drop-down");

  allAccordions.forEach((accordion) => {
    accordion.firstElementChild.addEventListener("click", () => {
      const accordionBody = accordion.querySelector(
        ".sidebar__filter-drop-down-body"
      );
      accordion.classList.toggle("active");
      accordionBody.style.height = accordion.classList.contains("active")
        ? `${accordionBody.scrollHeight}px`
        : 0;
    });
  });
};

export {
  renderCategoriesInSideBar,
  sidebarSubCategoryClickHandler,
  sidebarNestedCategoryClickHandler,
  updateSidebarWithActiveCategory,
  sidebarAccordionsHandler,
};
