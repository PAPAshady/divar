import { categoriesIcons } from "./categories.js";
import { setUrlParam, removeUrlParam } from "./sharedUtils.js";

const renderCategoriesInSideBar = (categoriesArray, wrapperElement) => {
  const sidebarSubCategoriesSection = document.getElementById(
    "sidebarSubCategoriesSection"
  );
  const sidebarSubCategoriesSectionTitle = document.getElementById(
    "sidebarSubCategoriesSectionTitle"
  );
  const sidebarSubCategoriesWrapper = document.getElementById(
    "sidebarSubCategoriesWrapper"
  );
  const sidebarSubCategoriesMenuBackBtn = document.getElementById(
    "sidebarSubCategoriesMenuBackBtn"
  );

  // render main categories in sidebar
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

  // render all sub categories and their nested categories when user clicks on a main category in sidebar
  const mainCategoriesElements =
    document.querySelectorAll(".sidebar__category");

  mainCategoriesElements.forEach((categoryElement) => {
    categoryElement.addEventListener("click", () => {
      const selectedCategory = categoriesArray.find(
        (category) => category._id === categoryElement.dataset.categoryId
      );
      setUrlParam("categoryID", selectedCategory._id);
      sidebarSubCategoriesSectionTitle.textContent = selectedCategory.title;
      sidebarSubCategoriesWrapper.innerHTML = "";
      const subCategoriesElements = selectedCategory.subCategories
        .map(
          (subCategory) =>
            `<li
                class="sidebar__sub-category"
                data-sub-category-id="${subCategory._id}"
            >
                <a
                  href="Javascript:void(0)"
                  class="sidebar__sub-category-link"
                  onclick="sidebarSubCategoryClickHandler(this, '${
                    subCategory._id
                  }')"
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
    });

    // close the sub categories menu when user clicks on back btn
    sidebarSubCategoriesMenuBackBtn.addEventListener("click", () => {
      removeUrlParam("categoryID");
      sidebarSubCategoriesSection.classList.remove("show");
    });
  });
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
};

export {
  renderCategoriesInSideBar,
  sidebarSubCategoryClickHandler,
  sidebarNestedCategoryClickHandler,
};
