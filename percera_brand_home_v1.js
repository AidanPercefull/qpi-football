
(() => {

    if (
        window.__PERCERA_BRAND_HOME_V1__
    ) {
        return;
    }

    window.__PERCERA_BRAND_HOME_V1__ =
        true;


    // ========================================================
    // HELPERS
    // ========================================================

    function clean(value) {

        return String(
            value || ""
        )
        .replace(/\s+/g, " ")
        .trim();
    }


    function navigateTo(view) {

        const button =
            document.querySelector(
                `.nav-button[data-view="${view}"]`
            );

        if (button) {
            button.click();
        }
    }


    function sectionContaining(
        searchText
    ) {

        const home =
            document.querySelector(
                "#home-view"
            );

        if (!home) {
            return null;
        }


        const wanted =
            searchText.toLowerCase();


        return Array.from(
            home.querySelectorAll(
                "section"
            )
        ).find(
            section =>

                clean(
                    section.textContent
                )
                .toLowerCase()
                .includes(
                    wanted
                )
        ) || null;
    }


    // ========================================================
    // 1. MAKE THE TOP HERO PERCERA-FIRST
    // ========================================================

    function makeHeroPerceraFirst() {

        const home =
            document.querySelector(
                "#home-view"
            );

        if (!home) {
            return false;
        }


        const headings =
            Array.from(
                home.querySelectorAll(
                    "h1, h2"
                )
            );


        const heading =
            headings.find(
                element =>

                    clean(
                        element.textContent
                    )
                    .toLowerCase()
                    .includes(
                        "performance, in context"
                    )
            );


        if (!heading) {
            return false;
        }


        const hero =
            heading.closest(
                "section"
            )
            ||
            heading.parentElement;


        heading.textContent =
            "College football, in context.";


        // ---------------------------------------------
        // Hero eyebrow
        // ---------------------------------------------

        const eyebrow =
            hero.querySelector(
                ".eyebrow, [class*='kicker']"
            );


        if (eyebrow) {

            eyebrow.textContent =
                "PERCERA ANALYTICS";
        }


        // ---------------------------------------------
        // Replace hero introductory paragraph only.
        // Do not touch CQI feature cards inside hero.
        // ---------------------------------------------

        const paragraphs =
            Array.from(
                hero.querySelectorAll(
                    "p"
                )
            );


        if (
            paragraphs.length
        ) {

            paragraphs[0].textContent =
                (
                    "Transparent, opponent-aware college "
                    +
                    "football analytics for quarterbacks "
                    +
                    "and teams — built to make performance "
                    +
                    "easier to understand, compare and track."
                );
        }


        // ---------------------------------------------
        // If the hero says FLAGSHIP CQI,
        // reposition CQI as a featured Percera model.
        // ---------------------------------------------

        Array.from(
            hero.querySelectorAll(
                "*"
            )
        ).forEach(
            element => {

                const text =
                    clean(
                        element.textContent
                    );


                if (
                    text ===
                    "FLAGSHIP CQI"
                ) {

                    element.textContent =
                        "FEATURED MODEL · CQI";
                }
            }
        );


        hero.classList.add(
            "percera-brand-first-hero"
        );


        return true;
    }


    // ========================================================
    // 2. LOCATE CQI SECTION
    // ========================================================

    function findCQISection() {

        const candidates =
            Array.from(
                document.querySelectorAll(
                    "#home-view section"
                )
            );


        return candidates.find(
            section => {

                const text =
                    clean(
                        section.textContent
                    );


                return (
                    text.includes(
                        "What the model measures."
                    )
                    &&
                    text.includes(
                        "Passing Efficiency"
                    )
                    &&
                    text.includes(
                        "Sack Avoidance"
                    )
                    &&
                    text.includes(
                        "Rushing Value"
                    )
                );
            }
        ) || null;
    }


    // ========================================================
    // 3. BUILD CTSI VALIDATION
    // ========================================================

    function ensureCTSIValidation() {

        const home =
            document.querySelector(
                "#home-view"
            );


        const ctsi =
            home
            ? home.querySelector(
                ".percera-ctsi-home-explainer"
            )
            : null;


        if (
            !home
            ||
            !ctsi
        ) {

            return null;
        }


        let validation =
            home.querySelector(
                ".ctsi-validation-home"
            );


        if (validation) {
            return validation;
        }


        validation =
            document.createElement(
                "section"
            );


        validation.className =
            "ctsi-validation-home";


        validation.innerHTML = `

            <div
                class="ctsi-validation-copy"
            >

                <span>
                    HISTORICAL VALIDATION
                </span>


                <h2>
                    Separation that showed up
                    in future results.
                </h2>


                <p>
                    CTSI was tested on subsequent games,
                    not only on the performances used to
                    create each rating snapshot.
                    Higher-rated teams won more often,
                    and the signal strengthened as the
                    rating gap widened.
                </p>


                <button
                    type="button"
                    class="ctsi-validation-button"
                >
                    View team ratings
                    <span>→</span>
                </button>

            </div>


            <div
                class="ctsi-validation-results"
            >

                <article>

                    <span>
                        ALL HISTORICAL MATCHUPS
                    </span>


                    <strong>
                        68.7%
                    </strong>


                    <p>
                        won by the higher-rated
                        Percera team.
                    </p>

                </article>


                <article
                    class="featured"
                >

                    <span>
                        10+ POINT CTSI EDGE
                    </span>


                    <strong>
                        82.5%
                    </strong>


                    <p>
                        win rate when the higher-rated
                        team held at least a ten-point
                        neutral-field advantage.
                    </p>

                </article>

            </div>

        `;


        validation
            .querySelector(
                ".ctsi-validation-button"
            )
            .addEventListener(
                "click",
                () => {

                    navigateTo(
                        "teams"
                    );
                }
            );


        ctsi.insertAdjacentElement(
            "afterend",
            validation
        );


        return validation;
    }


    // ========================================================
    // 4. HOME ORDER
    //
    // HERO
    // PERCERA MODELS
    // CQI
    // CQI VALIDATION
    // CQI CTA
    // CTSI
    // CTSI VALIDATION
    // ========================================================

    function reorderHome() {

        const home =
            document.querySelector(
                "#home-view"
            );


        if (!home) {
            return false;
        }


        const models =
            home.querySelector(
                ".percera-models-home"
            );


        const cqi =
            findCQISection();


        const cqiValidation =
            sectionContaining(
                "Performance that carried forward."
            );


        const cqiCTA =
            sectionContaining(
                "See who CQI has at the top."
            );


        const ctsi =
            home.querySelector(
                ".percera-ctsi-home-explainer"
            );


        const ctsiValidation =
            ensureCTSIValidation();


        if (
            !models
            ||
            !cqi
            ||
            !ctsi
        ) {

            return false;
        }


        // ---------------------------------------------
        // Models stays before both model deep-dives.
        // ---------------------------------------------

        let cursor =
            models;


        cursor.insertAdjacentElement(
            "afterend",
            cqi
        );


        cursor = cqi;


        if (cqiValidation) {

            cursor.insertAdjacentElement(
                "afterend",
                cqiValidation
            );

            cursor =
                cqiValidation;
        }


        if (cqiCTA) {

            cursor.insertAdjacentElement(
                "afterend",
                cqiCTA
            );

            cursor =
                cqiCTA;
        }


        cursor.insertAdjacentElement(
            "afterend",
            ctsi
        );


        cursor = ctsi;


        if (ctsiValidation) {

            cursor.insertAdjacentElement(
                "afterend",
                ctsiValidation
            );
        }


        return true;
    }


    // ========================================================
    // INIT
    // ========================================================

    function initialize() {

        makeHeroPerceraFirst();

        ensureCTSIValidation();

        reorderHome();
    }


    initialize();


    let attempts = 0;


    const timer =
        setInterval(
            () => {

                attempts += 1;

                initialize();


                if (
                    attempts >= 50
                ) {

                    clearInterval(
                        timer
                    );
                }

            },
            100
        );

})();
