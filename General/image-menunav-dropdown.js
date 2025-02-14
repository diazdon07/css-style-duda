document.addEventListener("DOMContentLoaded", function () {
    let navmenus = document.querySelectorAll("a.unifiednav__item");

    // List of dropdown configurations (menu text + corresponding ID)
    let dropdowns = [
        { menu: "dropdown1", id: "1867198927" },
        { menu: "dropdown2", id: "1867198928" },
        { menu: "dropdown3", id: "1867198929" }
    ];

    let hideTimeouts = {}; // Store timeouts for each dropdown

    dropdowns.forEach(({ menu, id }) => {
        let targetElement = document.getElementById(id);

        if (targetElement) {
            targetElement.style.display = "none";
            targetElement.style.position = "fixed";

            hideTimeouts[id] = null; // Initialize timeout storage
        }
    });

    navmenus.forEach((nav) => {
        let span = nav.querySelector("span[data-link-text]");

        if (span) {
            let menuText = span.dataset.linkText.trim(); // Get the menu text
            let dropdownData = dropdowns.find(d => d.menu === menuText);

            if (dropdownData) {
                let targetElement = document.getElementById(dropdownData.id);

                if (targetElement) {
                    nav.addEventListener("mouseenter", function () {
                        clearTimeout(hideTimeouts[dropdownData.id]); // Cancel any pending hide event
                        targetElement.style.display = "block";
                    });

                    nav.addEventListener("mouseleave", function () {
                        hideTimeouts[dropdownData.id] = setTimeout(() => {
                            targetElement.style.display = "none";
                        }, 200);
                    });

                    targetElement.addEventListener("mouseenter", function () {
                        clearTimeout(hideTimeouts[dropdownData.id]); // Keep dropdown visible
                    });

                    targetElement.addEventListener("mouseleave", function () {
                        hideTimeouts[dropdownData.id] = setTimeout(() => {
                            targetElement.style.display = "none";
                        }, 200);
                    });
                }
            }
        }
    });
});
