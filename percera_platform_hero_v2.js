
(() => {

    if (
        window.__PERCERA_PLATFORM_HERO_V2__
    ) {
        return;
    }

    window.__PERCERA_PLATFORM_HERO_V2__ =
        true;


    // ========================================================
    // HELPERS
    // ========================================================

    function clean(value) {

        return String(
            value || ""
        )
        .replace(
            /\s+/g,
            " "
        )
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


    // ========================================================
    // FIND HOME HERO
    // ========================================================

    function findHero() {

        const home =
            document.querySelector(
                "#home-view"
            );

        if (!home) {
            return null;
        }


        const headings =
            Array.from(
                home.querySelectorAll(
                    "h1, h2"
                )
            );


        const heading =
            headings.find(
                node =>

                    clean(
                        node.textContent
                    )
                    .toLowerCase()
                    .includes(
                        "college football,"
                    )
            );


        if (!heading) {
            return null;
        }


        return (
            heading.closest(
                "section"
            )
            ||
            heading.parentElement
        );
    }


    // ========================================================
    // FIND SMALLEST CONTAINER CONTAINING PHRASES
    //
    // Used to locate old CQI player hero card without
    // depending on fragile class names.
    // ========================================================

    function smallestContainer(
        root,
        phrases
    ) {

        const candidates =
            Array.from(
                root.querySelectorAll(
                    "div, article, aside"
                )
            )
            .filter(
                node => {

                    const text =
                        clean(
                            node.textContent
                        );

                    return phrases.every(
                        phrase =>
                            text.includes(
                                phrase
                            )
                    );
                }
            );


        if (!candidates.length) {
            return null;
        }


        candidates.sort(
            (a, b) =>

                a.querySelectorAll("*").length
                -
                b.querySelectorAll("*").length
        );


        return candidates[0];
    }


    // ========================================================
    // REBUILD HERO
    // ========================================================

    function rebuildHero() {

        const hero =
            findHero();


        if (!hero) {
            return false;
        }


        hero.classList.add(
            "percera-platform-hero-v2"
        );


        // ----------------------------------------------------
        // Main headline
        // ----------------------------------------------------

        const headline =
            Array.from(
                hero.querySelectorAll(
                    "h1, h2"
                )
            )
            .find(
                node =>

                    clean(
                        node.textContent
                    )
                    .toLowerCase()
                    .includes(
                        "college football,"
                    )
            );


        if (headline) {

            headline.innerHTML = `
                College football,<br>
                in context.
            `;
        }


        // ----------------------------------------------------
        // Eyebrow
        // ----------------------------------------------------

        const eyebrow =
            hero.querySelector(
                ".eyebrow"
            );


        if (eyebrow) {

            eyebrow.textContent =
                "INDEPENDENT COLLEGE FOOTBALL ANALYTICS";
        }


        // ----------------------------------------------------
        // Intro paragraph
        // ----------------------------------------------------

        const paragraphs =
            Array.from(
                hero.querySelectorAll(
                    "p"
                )
            );


        const intro =
            paragraphs.find(
                p =>

                    clean(
                        p.textContent
                    )
                    .toLowerCase()
                    .includes(
                        "opponent-aware"
                    )
            );


        if (intro) {

            intro.textContent =
                (
                    "Percera turns college football performance "
                    +
                    "into transparent, opponent-aware analytics "
                    +
                    "for quarterbacks and teams."
                );
        }


        // ----------------------------------------------------
        // Old CTA buttons → Percera product CTAs
        // ----------------------------------------------------

        const buttons =
            Array.from(
                hero.querySelectorAll(
                    "button"
                )
            );


        if (buttons[0]) {

            const replacement =
                buttons[0].cloneNode(
                    false
                );


            replacement.textContent =
                "Explore Quarterbacks";


            replacement.addEventListener(
                "click",
                () => {

                    navigateTo(
                        "rankings"
                    );
                }
            );


            buttons[0].replaceWith(
                replacement
            );
        }


        if (buttons[1]) {

            const replacement =
                buttons[1].cloneNode(
                    false
                );


            replacement.textContent =
                "Explore Teams";


            replacement.addEventListener(
                "click",
                () => {

                    navigateTo(
                        "teams"
                    );
                }
            );


            buttons[1].replaceWith(
                replacement
            );
        }


        // ----------------------------------------------------
        // Footer/meta line
        // ----------------------------------------------------

        Array.from(
            hero.querySelectorAll(
                "small, span, div"
            )
        )
        .filter(
            node => {

                const text =
                    clean(
                        node.textContent
                    );

                return (
                    text.includes(
                        "CQI v1.1"
                    )
                    &&
                    text.includes(
                        "Through Week 3"
                    )
                    &&
                    text.length < 180
                );
            }
        )
        .forEach(
            node => {

                node.textContent =
                    (
                        "2026  ·  Through Week 3"
                        +
                        "  ·  Quarterbacks + Teams"
                    );
            }
        );


        // ====================================================
        // OLD RIGHT-HAND CQI FEATURE CARD
        // ====================================================

        let oldCard =
            smallestContainer(
                hero,
                [
                    "Contextual Quarterback Index",
                    "CURRENT NO. 1"
                ]
            );


        // Fallback if capitalization/text changed.
        if (!oldCard) {

            const cqiHeading =
                Array.from(
                    hero.querySelectorAll(
                        "h2, h3, strong"
                    )
                )
                .find(
                    node =>

                        clean(
                            node.textContent
                        )
                        ===
                        "Contextual Quarterback Index"
                );


            if (cqiHeading) {

                let node =
                    cqiHeading.parentElement;


                while (
                    node
                    &&
                    node.parentElement !== hero
                    &&
                    node.querySelectorAll("*").length < 80
                ) {

                    node =
                        node.parentElement;
                }


                oldCard = node;
            }
        }


        if (oldCard) {

            oldCard.classList.add(
                "percera-platform-model-card"
            );


            oldCard.innerHTML = `

                <div
                    class="platform-card-head"
                >

                    <span>
                        PERCERA ANALYTICS
                    </span>


                    <h2>
                        Two models.<br>
                        One context-first platform.
                    </h2>

                </div>


                <div
                    class="platform-model-list"
                >

                    <button
                        type="button"
                        class="platform-model-row"
                        data-platform-target="rankings"
                    >

                        <div>

                            <span
                                class="platform-model-code"
                            >
                                CQI
                            </span>


                            <strong>
                                Quarterbacks
                            </strong>


                            <small>
                                Contextual Quarterback Index
                            </small>

                        </div>


                        <span
                            class="platform-model-arrow"
                        >
                            →
                        </span>

                    </button>


                    <button
                        type="button"
                        class="platform-model-row"
                        data-platform-target="teams"
                    >

                        <div>

                            <span
                                class="platform-model-code"
                            >
                                CTSI
                            </span>


                            <strong>
                                Teams
                            </strong>


                            <small>
                                Contextual Team Strength Index
                            </small>

                        </div>


                        <span
                            class="platform-model-arrow"
                        >
                            →
                        </span>

                    </button>

                </div>


                <div
                    class="platform-card-foot"
                >
                    2026 · Through Week 3
                </div>
            `;


            oldCard
                .querySelectorAll(
                    "[data-platform-target]"
                )
                .forEach(
                    button => {

                        button.addEventListener(
                            "click",
                            () => {

                                navigateTo(
                                    button.dataset
                                        .platformTarget
                                );
                            }
                        );
                    }
                );
        }


        return true;
    }


    // ========================================================
    // REMOVE REDUNDANT CTSI FOOTER COMPLETELY
    // ========================================================

    function removeCTSIFooter() {

        document
            .querySelectorAll(
                ".ctsi-distinct-footer"
            )
            .forEach(
                node => {

                    node.remove();
                }
            );


        // Fallback if earlier markup is present but class
        // changed or was lost.

        const home =
            document.querySelector(
                "#home-view"
            );


        if (!home) {
            return;
        }


        Array.from(
            home.querySelectorAll(
                "section, div"
            )
        )
        .filter(
            node => {

                const text =
                    clean(
                        node.textContent
                    );


                return (
                    text.includes(
                        "One national scale."
                    )
                    &&
                    text.includes(
                        "Every opponent matters."
                    )
                    &&
                    text.includes(
                        "Explore CTSI"
                    )
                    &&
                    text.length < 250
                );
            }
        )
        .forEach(
            node => {

                node.remove();
            }
        );
    }


    // ========================================================
    // INIT
    // ========================================================

    function initialize() {

        rebuildHero();

        removeCTSIFooter();
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
