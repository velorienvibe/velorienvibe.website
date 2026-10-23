/* =========================================================
   VELORIENVIBE
   Main JavaScript
   Navigation | Package Selection | Scroll Effects | Enquiry
========================================================= */

"use strict";


/* =========================================================
   1. ELEMENT REFERENCES
========================================================= */

const body = document.body;

const header = document.querySelector(".site-header");

const menuButton =
    document.getElementById("menuBtn") ||
    document.getElementById("menuToggle") ||
    document.querySelector(".menu-toggle");

const navigation =
    document.querySelector(".primary-navigation") ||
    document.getElementById("mobileMenu") ||
    document.querySelector(".nav-links");

const enquiryForm = document.getElementById("enquiry-form");

const formStatus = document.querySelector(".form-status");


/* =========================================================
   2. MOBILE NAVIGATION
========================================================= */

function closeMobileMenu() {
    if (!menuButton || !navigation) return;

    menuButton.setAttribute("aria-expanded", "false");

    navigation.classList.remove("is-open");
    navigation.classList.remove("active");
    navigation.classList.remove("open");

    body.classList.remove("menu-open");
}


function openMobileMenu() {
    if (!menuButton || !navigation) return;

    menuButton.setAttribute("aria-expanded", "true");

    navigation.classList.add("is-open");

    body.classList.add("menu-open");
}


function toggleMobileMenu() {
    if (!menuButton || !navigation) return;

    const isOpen =
        menuButton.getAttribute("aria-expanded") === "true";

    if (isOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}


if (menuButton && navigation) {
    menuButton.setAttribute("aria-expanded", "false");

    if (!menuButton.hasAttribute("aria-label")) {
        menuButton.setAttribute("aria-label", "Toggle navigation");
    }

    if (!navigation.id) {
        navigation.id = "primary-navigation";
    }

    menuButton.setAttribute("aria-controls", navigation.id);

    menuButton.addEventListener("click", toggleMobileMenu);


    // Close the menu after choosing a navigation link.

    navigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
    });


    // Close the menu when clicking outside it.

    document.addEventListener("click", (event) => {
        const clickedInsideNavigation =
            navigation.contains(event.target);

        const clickedMenuButton =
            menuButton.contains(event.target);

        if (
            !clickedInsideNavigation &&
            !clickedMenuButton
        ) {
            closeMobileMenu();
        }
    });


    // Escape closes the mobile menu.

    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            menuButton.getAttribute("aria-expanded") === "true"
        ) {
            closeMobileMenu();
            menuButton.focus();
        }
    });


    // Reset navigation when moving back to desktop width.

    window.addEventListener("resize", () => {
        if (window.innerWidth > 760) {
            closeMobileMenu();
        }
    });
}


/* =========================================================
   3. HEADER SCROLL EFFECT
========================================================= */

function updateHeader() {
    if (!header) return;

    if (window.scrollY > 30) {
        header.classList.add("is-scrolled");
    } else {
        header.classList.remove("is-scrolled");
    }
}


window.addEventListener("scroll", updateHeader, {
    passive: true
});

updateHeader();


/* =========================================================
   4. SMOOTH INTERNAL NAVIGATION
========================================================= */

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");

        if (!href || href === "#") {
            event.preventDefault();
            return;
        }

        const target = document.querySelector(href);

        if (!target) return;

        event.preventDefault();

        closeMobileMenu();

        target.scrollIntoView({
            behavior: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches
                ? "auto"
                : "smooth",
            block: "start"
        });

        // Update the address-bar fragment without a page jump.

        if (history.replaceState) {
            history.replaceState(null, "", href);
        }
    });
});


/* =========================================================
   5. SCROLL-REVEAL ANIMATIONS
========================================================= */

// Add the reveal class only when JavaScript is available.
// If animations are unsupported, content remains visible.

const revealElements = document.querySelectorAll(
    ".service-card, " +
    ".industry-card, " +
    ".portfolio-card, " +
    ".process-step, " +
    ".package-card, " +
    ".contact-point"
);


const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;


if ("IntersectionObserver" in window && !reducedMotion) {

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("is-visible");

                    observer.unobserve(entry.target);
                }

            });

        },
        {
            threshold: 0.10,
            rootMargin: "0px 0px -35px 0px"
        }
    );


    revealElements.forEach((element) => {

        element.classList.add("reveal-on-scroll");

        revealObserver.observe(element);

    });

}


/* =========================================================
   6. PACKAGE SELECTION
========================================================= */

// Package buttons can use:
// data-package="Basic"
// data-package="Premium"

function selectPackage(packageName) {

    if (!packageName) return;

    const packageSelect = document.querySelector(
        '#enquiry-form select[name="package"], ' +
        '#enquiry-form select[name="plan"], ' +
        '#enquiry-form select[name="websitePackage"], ' +
        '#enquiry-form select[name="websiteType"]'
    );


    if (packageSelect) {

        const options = Array.from(packageSelect.options);

        const matchingOption = options.find((option) => {

            const optionText = option.textContent
                .trim()
                .toLowerCase();

            const optionValue = option.value
                .trim()
                .toLowerCase();

            const requested = packageName
                .trim()
                .toLowerCase();

            return (
                optionText.includes(requested) ||
                optionValue.includes(requested)
            );

        });


        if (matchingOption) {

            packageSelect.value = matchingOption.value;

            packageSelect.dispatchEvent(
                new Event("change", { bubbles: true })
            );

        }

    }


    // Remember the selected package while the page is open.

    try {

        sessionStorage.setItem(
            "velorienvibe-selected-package",
            packageName
        );

    } catch (error) {

        // The site remains functional if storage is unavailable.

    }


    // Bring the customer to the enquiry form.

    const contactSection =
        document.getElementById("contact") ||
        document.getElementById("enquiry") ||
        document.querySelector(".contact-section");

    if (contactSection) {

        contactSection.scrollIntoView({
            behavior: reducedMotion ? "auto" : "smooth",
            block: "start"
        });

    }

}


// Support buttons using data-package.

document.querySelectorAll("[data-package]").forEach((button) => {

    button.addEventListener("click", (event) => {

        const packageName = button.dataset.package;

        if (!packageName) return;

        // Let ordinary links with their own destination work normally.

        if (
            button.tagName === "A" &&
            button.getAttribute("href") &&
            button.getAttribute("href") !== "#contact" &&
            button.getAttribute("href") !== "#enquiry"
        ) {
            return;
        }

        event.preventDefault();

        selectPackage(packageName);

    });

});


// Restore the selected package if the customer returns to the form.

try {

    const savedPackage = sessionStorage.getItem(
        "velorienvibe-selected-package"
    );

    if (savedPackage) {

        const packageSelect = document.querySelector(
            '#enquiry-form select[name="package"], ' +
            '#enquiry-form select[name="plan"], ' +
            '#enquiry-form select[name="websitePackage"], ' +
            '#enquiry-form select[name="websiteType"]'
        );

        if (packageSelect) {

            const matchingOption = Array.from(
                packageSelect.options
            ).find((option) => {

                const requested = savedPackage.toLowerCase();

                return (
                    option.textContent.trim().toLowerCase()
                        .includes(requested) ||
                    option.value.trim().toLowerCase()
                        .includes(requested)
                );

            });

            if (matchingOption) {
                packageSelect.value = matchingOption.value;
            }

        }

    }

} catch (error) {

    // Ignore storage restrictions.

}


/* =========================================================
   7. ENQUIRY FORM -> WHATSAPP
========================================================= */

const VELORIENVIBE_WHATSAPP = "919398159190";

if (enquiryForm) {
    enquiryForm.addEventListener("submit", (event) => {
        event.preventDefault();

        // Keep native required-field validation.
        if (!enquiryForm.checkValidity()) {
            enquiryForm.reportValidity();
            return;
        }

        const formData = new FormData(enquiryForm);
        const getValue = (name) => String(formData.get(name) || "").trim();

        const customerName = getValue("name");
        const businessName = getValue("business");
        const customerPhone = getValue("phone");
        const industry = getValue("industry");
        const packageName = getValue("package");
        const projectDetails = getValue("details");
        const selectedFeatures = formData.getAll("features")
            .map((feature) => String(feature).trim())
            .filter(Boolean);

        // Basic phone-number sanity check; accept spaces, +, brackets and hyphens.
        const phoneDigits = customerPhone.replace(/\D/g, "");
        if (phoneDigits.length < 10 || phoneDigits.length > 15) {
            const phoneInput = enquiryForm.querySelector('[name="phone"]');
            if (phoneInput) {
                phoneInput.setCustomValidity("Please enter a valid phone number with 10 to 15 digits.");
                phoneInput.reportValidity();
                phoneInput.addEventListener("input", () => phoneInput.setCustomValidity(""), { once: true });
                phoneInput.focus();
            }
            return;
        }

        const lines = [
            "Hello VelorienVibe team,",
            "",
            "I'd like to enquire about a website for my business. Please find my details below:",
            "",
            "BUSINESS DETAILS",
            `Name: ${customerName}`,
            `Business: ${businessName}`,
            `Contact number: ${customerPhone}`,
            `Industry: ${industry}`,
            "",
            "PROJECT REQUIREMENTS",
            `Preferred package: ${packageName}`,
            `Features required: ${selectedFeatures.length ? selectedFeatures.join(", ") : "To be discussed"}`,
            `Additional details: ${projectDetails || "None provided"}`,
            "",
            "Please let me know the next steps, estimated timeline, and final cost.",
            "",
            "Thank you."
        ];

        const message = lines.join("\n");
        const whatsappURL = `https://wa.me/${VELORIENVIBE_WHATSAPP}?text=${encodeURIComponent(message)}`;

        if (formStatus) {
            formStatus.textContent = "WhatsApp is opening with your enquiry prepared. Please review the message and press Send in WhatsApp to contact VelorienVibe.";
            formStatus.setAttribute("role", "status");
            formStatus.setAttribute("aria-live", "polite");
        }

        // Open in a new tab so the customer can return to the website.
        const whatsappWindow = window.open(whatsappURL, "_blank", "noopener,noreferrer");

        // If the browser blocks the new tab, continue in the current tab.
        if (!whatsappWindow) {
            window.location.href = whatsappURL;
        }
    });
}


/* =========================================================
   8. FOOTER YEAR
========================================================= */

const yearElements = document.querySelectorAll(
    "[data-current-year]"
);

yearElements.forEach((element) => {

    element.textContent = new Date().getFullYear();

});


/* =========================================================
   9. IMAGE FALLBACKS
========================================================= */

// If an actual <img> fails, hide the broken image instead of
// displaying a broken-image icon.
// CSS background images are handled separately.

document.querySelectorAll("img").forEach((image) => {

    image.addEventListener("error", () => {

        image.classList.add("image-unavailable");

        image.setAttribute("data-image-error", "true");

    });

});


/* =========================================================
   10. INITIALISATION
========================================================= */

document.documentElement.classList.add("js-ready");

console.info("VelorienVibe website scripts initialised.");
