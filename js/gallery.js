/* =========================================================
RICK SWAZY PRINTS & PIXELS
Stage 2.1 — Gallery & Lightbox
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


/* =====================================================
   ELEMENTS
===================================================== */

const galleryItems =
    Array.from(
        document.querySelectorAll(".gallery-item")
    );

const filterButtons =
    document.querySelectorAll(".gallery-filter");

const lightbox =
    document.getElementById("galleryLightbox");

const lightboxImage =
    document.getElementById("lightboxImage");

const lightboxPlaceholder =
    document.getElementById("lightboxPlaceholder");

const lightboxTitle =
    document.getElementById("lightboxTitle");

const lightboxType =
    document.getElementById("lightboxType");

const closeButton =
    document.getElementById("lightboxClose");

const previousButton =
    document.getElementById("lightboxPrev");

const nextButton =
    document.getElementById("lightboxNext");


let visibleItems = [];

let currentIndex = 0;


/* =====================================================
   UPDATE VISIBLE ITEMS
===================================================== */

const updateVisibleItems = () => {

    visibleItems =
        galleryItems.filter(
            (item) =>
                !item.classList.contains("hidden")
        );

};


/* =====================================================
   FILTER GALLERY
===================================================== */

filterButtons.forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            const filter =
                button.dataset.galleryFilter;


            filterButtons.forEach((btn) => {

                btn.classList.remove("active");

            });


            button.classList.add("active");


            galleryItems.forEach((item) => {

                const category =
                    item.dataset.galleryCategory;


                const shouldShow =
                    filter === "all" ||
                    category === filter;


                item.classList.toggle(
                    "hidden",
                    !shouldShow
                );

            });


            updateVisibleItems();

        }
    );

});


/* =====================================================
   SHOW LIGHTBOX
===================================================== */

const openLightbox = (item) => {

    if (!lightbox) {
        return;
    }


    updateVisibleItems();


    currentIndex =
        visibleItems.indexOf(item);


    if (currentIndex < 0) {
        currentIndex = 0;
    }


    displayImage();


    lightbox.classList.add("open");

    lightbox.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "lightbox-open"
    );

};


/* =====================================================
   DISPLAY CURRENT IMAGE
===================================================== */

const displayImage = () => {

    const item =
        visibleItems[currentIndex];


    if (!item) {
        return;
    }


    const image =
        item.querySelector("img");


    const title =
        item.dataset.galleryTitle ||
        "Creative Project";


    const type =
        item.dataset.galleryType ||
        "PROJECT";


    if (lightboxTitle) {

        lightboxTitle.textContent =
            title;

    }


    if (lightboxType) {

        lightboxType.textContent =
            type;

    }


    if (image && image.src) {

        lightboxImage.src =
            image.src;

        lightboxImage.alt =
            image.alt || title;


        lightboxImage.style.display =
            "block";


        lightboxImage.onerror = () => {

            lightboxImage.style.display =
                "none";

            lightboxPlaceholder?.classList.add(
                "visible"
            );

        };


        lightboxPlaceholder?.classList.remove(
            "visible"
        );

    } else {

        lightboxImage.style.display =
            "none";

        lightboxPlaceholder?.classList.add(
            "visible"
        );

    }

};


/* =====================================================
   CLOSE LIGHTBOX
===================================================== */

const closeLightbox = () => {

    if (!lightbox) {
        return;
    }


    lightbox.classList.remove(
        "open"
    );


    lightbox.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "lightbox-open"
    );


    lightboxImage.src = "";

};


/* =====================================================
   NEXT IMAGE
===================================================== */

const showNext = () => {

    if (!visibleItems.length) {
        return;
    }


    currentIndex =
        (currentIndex + 1) %
        visibleItems.length;


    displayImage();

};


/* =====================================================
   PREVIOUS IMAGE
===================================================== */

const showPrevious = () => {

    if (!visibleItems.length) {
        return;
    }


    currentIndex =
        (currentIndex - 1 +
         visibleItems.length) %
        visibleItems.length;


    displayImage();

};


/* =====================================================
   CLICK GALLERY ITEM
===================================================== */

galleryItems.forEach((item) => {

    item.addEventListener(
        "click",
        () => {

            openLightbox(item);

        }
    );

});


/* =====================================================
   BUTTON EVENTS
===================================================== */

closeButton?.addEventListener(
    "click",
    closeLightbox
);


nextButton?.addEventListener(
    "click",
    showNext
);


previousButton?.addEventListener(
    "click",
    showPrevious
);


/* =====================================================
   CLICK OUTSIDE IMAGE TO CLOSE
===================================================== */

lightbox?.addEventListener(
    "click",
    (event) => {

        if (
            event.target === lightbox
        ) {

            closeLightbox();

        }

    }
);


/* =====================================================
   KEYBOARD CONTROLS
===================================================== */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            !lightbox ||
            !lightbox.classList.contains("open")
        ) {
            return;
        }


        if (event.key === "Escape") {

            closeLightbox();

        }


        if (event.key === "ArrowRight") {

            showNext();

        }


        if (event.key === "ArrowLeft") {

            showPrevious();

        }

    }
);


/* =====================================================
   PREVENT BODY SCROLL WHILE LIGHTBOX IS OPEN
===================================================== */

const style =
    document.createElement("style");


style.textContent = `

    body.lightbox-open {
        overflow: hidden;
    }

`;


document.head.appendChild(style);


/* =====================================================
   INITIALISE
===================================================== */

updateVisibleItems();

});
