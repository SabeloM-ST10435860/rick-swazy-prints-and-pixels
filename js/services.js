/* =========================================================
RICK SWAZY PRINTS & PIXELS
Stage 2.2 — Detailed Services
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   SERVICE REQUEST BUTTONS
===================================================== */

const serviceButtons =
    document.querySelectorAll(
        ".service-request"
    );


serviceButtons.forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            const selectedService =
                button.dataset.service;


            if (!selectedService) {
                return;
            }


            /*
             * Save the selected service.
             *
             * This allows the service to remain selected
             * even though the contact form is on another
             * page.
             */

            sessionStorage.setItem(
                "selectedService",
                selectedService
            );

        }
    );

});


/* =====================================================
   MOBILE MENU
===================================================== */

const menuToggle =
    document.getElementById("menuToggle");

const mainNav =
    document.getElementById("mainNav");


if (menuToggle && mainNav) {

    menuToggle.addEventListener(
        "click",
        () => {

            const isOpen =
                mainNav.classList.toggle("open");


            menuToggle.classList.toggle(
                "active",
                isOpen
            );


            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );


            document.body.classList.toggle(
                "menu-open",
                isOpen
            );

        }
    );

}


/* =====================================================
   CURRENT YEAR
===================================================== */

const currentYear =
    document.getElementById("currentYear");


if (currentYear) {

    currentYear.textContent =
        new Date().getFullYear();

}


});
