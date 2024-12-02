import { categoriesIcons } from "./categories.js";
import {
  setUrlParam,
  removeUrlParam,
  getUrlParam,
  findParentElementByClassName,
} from "./sharedUtils.js";

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
      showActiveCategoryInSidebar(categoriesArray);

      // Attach event listener to updated subCategories in sidebar.
      sidebarSubCategoryClickHandler(categoriesArray);
    });
  });

  // close the sub categories menu when user clicks on back btn
  sidebarSubCategoriesMenuBackBtn.addEventListener("click", () => {
    const dynamicCategoryFiltersWrapper = document.getElementById(
      "sidebarDynamicCategoryFiltersWrapper"
    );
    // remove all dynamic categories filters if user click on back btn of category menu in sidebar.
    dynamicCategoryFiltersWrapper.innerHTML = "";
    removeUrlParam("categoryID");
    sidebarSubCategoriesSection.classList.remove("show");
    showActiveCategoryInSidebar(categoriesArray);
  });
};

const renderSubCategoriesInSideBar = (
  subCategoriesArray,
  allCategoriesArray
) => {
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

  // Attach event listener to updated nestedCategories in sidebar.
  sidebarNestedCategoryClickHandler(allCategoriesArray);
};

const sidebarSubCategoryClickHandler = (categoriesArray) => {
  const allSubCategoriesElements = document.querySelectorAll(
    ".sidebar__sub-category"
  );

  allSubCategoriesElements.forEach((subCategoryElement) => {
    subCategoryElement.addEventListener("click", () => {
      const subCategoryID = subCategoryElement.dataset.subCategoryId;
      setUrlParam("categoryID", subCategoryID);
      showActiveCategoryInSidebar(categoriesArray);
    });
  });
};

const sidebarNestedCategoryClickHandler = (categoriesArray) => {
  const allNestedCategories = document.querySelectorAll(
    ".sidebar__sub-category-nesetd-category"
  );

  allNestedCategories.forEach((nestedCategory) => {
    nestedCategory.addEventListener("click", (e) => {
      e.stopPropagation();
      const nestedCategoryID = nestedCategory.dataset.nestedCategoryId;
      setUrlParam("categoryID", nestedCategoryID);
      showActiveCategoryInSidebar(categoriesArray);
    });
  });
};

// This function checks if a specific category is selected.
// If a category is selected, it highlights the corresponding item in the sidebar as active.
const showActiveCategoryInSidebar = (categoriesArray) => {
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
    renderSubCategoriesInSideBar(
      currentMainCategory.subCategories,
      categoriesArray
    );

    sidebarSubCategoryClickHandler(categoriesArray);

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

    // find the current category filters and render them in the sidebar.
    const currentCategoryFilters = currentNestedCategory
      ? currentNestedCategory.filters
      : currentSubCategory
      ? currentSubCategory.filters
      : currentMainCategory.filters;

    renderCategoryFiltersInSidebar(currentCategoryFilters);
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

const sidebarSelectBoxesHandler = () => {
  const allSelectBoxes = document.querySelectorAll(".simple-select-box");
  allSelectBoxes.forEach((selectBox) => {
    const selectBoxParent = selectBox.parentElement;
    selectBox.firstElementChild.addEventListener("click", () => {
      selectBox.classList.toggle("active");
      selectBoxParent.style.overflow = "visible";
    });

    // close select box in case user clicks anywhere outside of select box.
    window.addEventListener("click", (e) => {
      if (!selectBox.contains(e.target)) {
        selectBoxParent.style.overflow = "hidden";
        selectBox.classList.remove("active");
      }
    });
  });
};

const renderCategoryFiltersInSidebar = (categoryFiltersArray) => {
  const categoryFiltersWrapper = document.getElementById(
    "sidebarDynamicCategoryFiltersWrapper"
  );

  categoryFiltersWrapper.innerHTML = "";
  const allFilterElements = categoryFiltersArray
    .map(
      (filter) =>
        `<div class="sidebar__filter-drop-down">
          <div class="sidebar__filter-drop-down-header">
            <div
              class="sidebar__filter-drop-down-header-title-and-icon"
            >
              <i
                class="fa fa-chevron-down sidebar__filter-drop-down-header-icon"
              ></i>
              <span class="sidebar__filter-drop-down-header-title"
                >${filter.name}</span
              >
            </div>
          </div>
          <div class="sidebar__filter-drop-down-body">

            ${
              filter.type === "selectbox"
                ? `<div class="simple-select-box" data-value="-1" data-filter-slug="${
                    filter.slug
                  }">
                  <button class="simple-select-box__open-btn">
                    <span
                      class="simple-select-box__placeholder"
                    >
                      انتخاب
                    </span>
                    <i
                      class="fa fa-chevron-down simple-select-box__arrow-down-icon"
                    ></i>
                  </button>
                  <div
                    class="simple-select-box__options-and-search-box-wrapper"
                  >
                    <ul class="simple-select-box__options-container">
                      ${filter.options
                        .map(
                          (option) =>
                            `<li
                              class="simple-select-box__option"
                              data-value="${option}"
                              onclick="selectBoxOptionClickHandler(this)"
                            >
                            <i
                              class="fa fa-check simple-select-box__option-check-icon"
                            ></i>
                            <span
                              class="simple-select-box__option-title"
                            >
                              ${option}
                            </span>
                          </li>`
                        )
                        .join("")}
                    </ul>
                    <div
                      class="simple-select-box__search-box${
                        filter.options.length > 4 ? " show" : ""
                      }"
                    >
                      <i
                        class="fa fa-search simple-select-box__search-box-icon"
                      ></i>
                      <input
                        type="text"
                        placeholder="جستجو"
                        class="simple-select-box__search-box-input"
                      />
                    </div>
                  </div>
                </div>`
                : ""
            }

            ${
              filter.type === "checkbox"
                ? `<div class="sidebar__post-status-filters">
                    <label class="sidebar__post-status-toggle-btn-wrapper">
                        <span class="sidebar__post-status-toggle-btn-label"
                          >${filter.name}</span
                        >
                        <div class="toggle-btn">
                          <input
                            class="toggle-btn__input"
                            type="checkbox"
                          />
                          <span
                            class="toggle-btn__input-ui toggle-btn__input-ui--small"
                          ></span>
                        </div>
                    </label>
                  </div>`
                : ""
            }

          </div>
        </div>`
    )
    .join("");

  categoryFiltersWrapper.insertAdjacentHTML("beforeend", allFilterElements);
  selectBoxSearchInputHandler(categoryFiltersArray);
};

const selectBoxOptionClickHandler = (element) => {
  const selectedValue = element.dataset.value;
  const selectBox = findParentElementByClassName(element, "simple-select-box");
  const selectBoxPlaceholder = selectBox.querySelector(
    ".simple-select-box__placeholder"
  );

  selectBox.querySelectorAll(".simple-select-box__option").forEach((option) => {
    option.classList.remove("active");
  });
  element.classList.add("active");
  selectBoxPlaceholder.textContent = selectedValue;
  selectBox.dataset.value = selectedValue;
  selectBox.parentElement.style.overflow = "hidden";
  selectBox.classList.remove("active");
};

// this function handles search feature for each select-box
const selectBoxSearchInputHandler = (filtersArray) => {
  const allSelectBoxSearchInputs = document.querySelectorAll(
    ".simple-select-box__search-box-input"
  );

  allSelectBoxSearchInputs.forEach((input) => {
    const selectBox = findParentElementByClassName(input, "simple-select-box");
    const selectBoxOptionsWrapper = selectBox.querySelector(
      ".simple-select-box__options-container"
    );
    const currentFilter = filtersArray.find(
      (filter) => filter.slug === selectBox.dataset.filterSlug
    );

    input.addEventListener("input", (e) => {
      const inputValue = e.target.value.trim().toLowerCase();
      const updatedSelectBoxOptions = currentFilter.options.filter((option) =>
        option.toLowerCase().includes(inputValue)
      );
      selectBoxOptionsWrapper.innerHTML = "";

      if (!updatedSelectBoxOptions.length) {
        selectBoxOptionsWrapper.innerHTML =
          '<li class="simple-select-box__option">موردی پیدا نشد :(</li>';
        return;
      }

      const updatedSelectBoxOptionElements = updatedSelectBoxOptions
        .map(
          (option) =>
            `<li
              class="simple-select-box__option"
              data-value="${option}"
              onclick="selectBoxOptionClickHandler(this)"
            >
              <i
                class="fa fa-check simple-select-box__option-check-icon"
              ></i>
              <span
                class="simple-select-box__option-title"
              >
                ${option}
              </span>
            </li>`
        )
        .join("");

      selectBoxOptionsWrapper.insertAdjacentHTML(
        "beforeend",
        updatedSelectBoxOptionElements
      );
    });
  });
};

export {
  renderCategoriesInSideBar,
  sidebarSubCategoryClickHandler,
  sidebarNestedCategoryClickHandler,
  showActiveCategoryInSidebar,
  sidebarAccordionsHandler,
  sidebarSelectBoxesHandler,
  selectBoxOptionClickHandler,
};
