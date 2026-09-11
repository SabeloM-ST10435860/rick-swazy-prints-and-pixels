
/* =========================================================
   RICK SWAZY PRINTS & PIXELS
   Main JavaScript
   Service Preselection + WhatsApp Enquiry Integration
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENT REFERENCES
       ===================================================== */

    const header = document.getElementById("siteHeader");
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");
    const navLinks = document.querySelectorAll(".nav-link");

    const revealElements = document.querySelectorAll(".reveal");

    const filterButtons = document.querySelectorAll(".filter-btn");
    const portfolioItems = document.querySelectorAll(".portfolio-item");

    /*
       Service links are used on both:
       - Homepage service cards
       - Detailed services page
    */
    const serviceLinks = document.querySelectorAll(
        ".service-select-link, .service-request"
    );

    const contactForm = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");
    const submitButton = document.getElementById("submitEnquiry");

    const serviceSelect = document.getElementById("service");

    const currentYear = document.getElementById("currentYear");

    const whatsappLink = document.getElementById("whatsappLink");

    const phoneLink = document.getElementById("phoneLink");


    /* =====================================================
       WHATSAPP BUSINESS NUMBER

       International format only.

       Do NOT include:
       +
       spaces
       brackets

       Current number:
       +27 71 238 8484

       WhatsApp format:
       27712388484
       ===================================================== */

    const whatsappNumber = "27712388484";


    /* =====================================================
       CURRENT YEAR
       ===================================================== */

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* =====================================================
       HEADER SHADOW WHILE SCROLLING
       ===================================================== */

    const updateHeader = () => {

        if (!header) {
            return;
        }

        if (window.scrollY > 15) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    };

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );

    updateHeader();


    /* =====================================================
       MOBILE MENU
       ===================================================== */

    const closeMenu = () => {

        if (!menuToggle || !mainNav) {
            return;
        }

        menuToggle.classList.remove("active");

        mainNav.classList.remove("open");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        document.body.classList.remove("menu-open");
    };


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
       CLOSE MOBILE MENU WHEN NAV LINK IS CLICKED
       ===================================================== */

    navLinks.forEach((link) => {

        link.addEventListener(
            "click",
            closeMenu
        );

    });


    /* =====================================================
       SERVICE CARD / SERVICE PAGE
       → CONTACT FORM PRESELECTION
       ===================================================== */

    /*
       When a user clicks a service button, save the
       selected service temporarily.

       This allows the service page to send the user
       back to the homepage/contact form with the
       correct service already selected.
    */

    serviceLinks.forEach((link) => {

        link.addEventListener(
            "click",
            () => {

                const selectedService =
                    link.dataset.service;

                if (!selectedService) {
                    return;
                }

                sessionStorage.setItem(
                    "selectedService",
                    selectedService
                );
            }
        );

    });


    /* =====================================================
       SELECT SERVICE FUNCTION
       ===================================================== */

    const selectService = (selectedService) => {

        if (!selectedService || !serviceSelect) {
            return;
        }

        serviceSelect.value = selectedService;

        /*
           Trigger a change event in case other
           JavaScript depends on the select field.
        */
        serviceSelect.dispatchEvent(
            new Event("change", {
                bubbles: true
            })
        );
    };


    /* =====================================================
       READ SAVED SERVICE
       ===================================================== */

    const savedService =
        sessionStorage.getItem("selectedService");

    if (savedService && serviceSelect) {

        selectService(savedService);

        /*
           Remove the saved service after applying it.
           This prevents an old selection from appearing
           the next time the contact form is opened.
        */

        sessionStorage.removeItem(
            "selectedService"
        );
    }


    /* =====================================================
       HIGHLIGHT CURRENT SECTION IN NAVIGATION
       ===================================================== */

    const sections =
        document.querySelectorAll(
            "main section[id]"
        );

    if ("IntersectionObserver" in window) {

        const sectionObserver =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach((entry) => {

                        if (entry.isIntersecting) {

                            navLinks.forEach((link) => {

                                /*
                                   Only compare hash links.

                                   This prevents links such as:
                                   services.html
                                   from incorrectly becoming active.
                                */

                                const href =
                                    link.getAttribute("href");

                                link.classList.toggle(
                                    "active",
                                    href ===
                                    `#${entry.target.id}`
                                );

                            });

                        }

                    });

                },
                {
                    rootMargin: "-35% 0px -55% 0px",
                    threshold: 0
                }
            );


        sections.forEach((section) => {
            sectionObserver.observe(section);
        });

    }


    /* =====================================================
       REVEAL ANIMATIONS
       ===================================================== */

    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "visible"
                            );

                            observer.unobserve(
                                entry.target
                            );
                        }

                    });

                },
                {
                    threshold: 0.12
                }
            );


        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });

    } else {

        /*
           Fallback for older browsers.
        */

        revealElements.forEach((element) => {

            element.classList.add(
                "visible"
            );

        });

    }


    /* =====================================================
       PORTFOLIO FILTERING
       ===================================================== */

    filterButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const filter =
                    button.dataset.filter;

                /*
                   Update active filter button.
                */

                filterButtons.forEach((btn) => {

                    btn.classList.remove(
                        "active"
                    );

                });

                button.classList.add(
                    "active"
                );


                /*
                   Show / hide portfolio items.
                */

                portfolioItems.forEach((item) => {

                    const category =
                        item.dataset.category;

                    const showItem =
                        filter === "all" ||
                        category === filter;

                    item.classList.toggle(
                        "hidden",
                        !showItem
                    );

                });

            }
        );

    });


    /* =====================================================
       WHATSAPP ENQUIRY FORM

       The form creates a formatted WhatsApp message.

       The customer still needs to press SEND inside
       WhatsApp.

       No database is required for this frontend version.
       ===================================================== */

    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                /* -----------------------------------------
                   GET FORM VALUES
                   ----------------------------------------- */

                const name =
                    document.getElementById("name")
                    ?.value
                    .trim();


                const email =
                    document.getElementById("email")
                    ?.value
                    .trim();


                const phone =
                    document.getElementById("phone")
                    ?.value
                    .trim();


                const service =
                    document.getElementById("service")
                    ?.value
                    .trim();


                const message =
                    document.getElementById("message")
                    ?.value
                    .trim();


                /* -----------------------------------------
                   VALIDATION
                   ----------------------------------------- */

                if (
                    !name ||
                    !email ||
                    !service ||
                    !message
                ) {

                    if (formStatus) {

                        formStatus.classList.add(
                            "error"
                        );

                        formStatus.textContent =
                            "Please complete all required fields.";

                    }

                    return;
                }


                /* -----------------------------------------
                   BASIC EMAIL VALIDATION
                   ----------------------------------------- */

                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (!emailPattern.test(email)) {

                    if (formStatus) {

                        formStatus.classList.add(
                            "error"
                        );

                        formStatus.textContent =
                            "Please enter a valid email address.";

                    }

                    return;
                }


                /* -----------------------------------------
                   OPTIONAL PHONE
                   ----------------------------------------- */

                const customerPhone =
                    phone || "Not provided";


                /* -----------------------------------------
                   CREATE WHATSAPP MESSAGE
                   ----------------------------------------- */

                const whatsappMessage =

`*NEW ENQUIRY — RICK SWAZY PRINTS & PIXELS*

Hello Rick Swazy Prints & Pixels,

I would like to enquire about your services.

*CUSTOMER DETAILS*
Name: ${name}
Email: ${email}
Phone / WhatsApp: ${customerPhone}

*SERVICE REQUIRED*
${service}

*PROJECT DETAILS*
${message}

Thank you.
I look forward to hearing from you.`;


                /* -----------------------------------------
                   ENCODE MESSAGE
                   ----------------------------------------- */

                const encodedMessage =
                    encodeURIComponent(
                        whatsappMessage
                    );


                /* -----------------------------------------
                   CREATE WHATSAPP URL
                   ----------------------------------------- */

                const whatsappURL =
                    `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;


                /* -----------------------------------------
                   UPDATE STATUS
                   ----------------------------------------- */

                if (formStatus) {

                    formStatus.classList.remove(
                        "error"
                    );

                    formStatus.textContent =
                        "Opening WhatsApp with your enquiry...";
                }


                /* -----------------------------------------
                   DISABLE BUTTON TEMPORARILY
                   ----------------------------------------- */

                if (submitButton) {

                    submitButton.disabled = true;

                    submitButton.textContent =
                        "Opening WhatsApp...";
                }


                /* -----------------------------------------
                   OPEN WHATSAPP
                   ----------------------------------------- */

                const whatsappWindow =
                    window.open(
                        whatsappURL,
                        "_blank"
                    );


                /* -----------------------------------------
                   FALLBACK

                   Some browsers may block the new tab.
                   ----------------------------------------- */

                if (!whatsappWindow) {

                    window.location.href =
                        whatsappURL;

                    return;
                }


                /* -----------------------------------------
                   RESET FORM

                   Reset after a short delay so that
                   the customer has time to see the
                   confirmation message.
                   ----------------------------------------- */

                setTimeout(() => {

                    contactForm.reset();

                    if (formStatus) {

                        formStatus.textContent =
                            "Your enquiry has been prepared in WhatsApp. Please press Send to submit it.";
                    }

                    if (submitButton) {

                        submitButton.disabled = false;

                        submitButton.textContent =
                            "Send Enquiry via WhatsApp";
                    }

                }, 1500);

            }
        );

    }


    /* =====================================================
       DIRECT WHATSAPP BUTTON
       ===================================================== */

    if (whatsappLink) {

        const defaultMessage =
            encodeURIComponent(
                "Hi Rick Swazy Prints & Pixels, I would like to enquire about your services."
            );


        whatsappLink.href =
            `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;


        whatsappLink.target =
            "_blank";


        whatsappLink.rel =
            "noopener noreferrer";
    }


    /* =====================================================
       PHONE / WHATSAPP CONTACT LINK
       ===================================================== */

    if (phoneLink) {

        const phoneMessage =
            encodeURIComponent(
                "Hi Rick Swazy Prints & Pixels, I would like to enquire about your services."
            );


        phoneLink.href =
            `https://wa.me/${whatsappNumber}?text=${phoneMessage}`;


        phoneLink.target =
            "_blank";


        phoneLink.rel =
            "noopener noreferrer";
    }

});

/* =====================================================
   OUR WORK — TIKTOK FILTER
===================================================== */

const workFilters = document.querySelectorAll(".work-filter");
const tiktokCards = document.querySelectorAll(".tiktok-card");

workFilters.forEach((filter) => {

    filter.addEventListener("click", () => {

        const selectedCategory = filter.dataset.workFilter;


        /* Update active button */

        workFilters.forEach((button) => {
            button.classList.remove("active");
        });

        filter.classList.add("active");


        /* Filter TikTok cards */

        tiktokCards.forEach((card) => {

            const categories = card.dataset.workCategory.split(" ");

            if (
                selectedCategory === "all" ||
                categories.includes(selectedCategory)
            ) {

                card.style.display = "";

                requestAnimationFrame(() => {
                    card.classList.remove("work-filter-hidden");
                });

            } else {

                card.classList.add("work-filter-hidden");

                setTimeout(() => {

                    if (card.classList.contains("work-filter-hidden")) {
                        card.style.display = "none";
                    }

                }, 250);

            }

        });

    });

});
