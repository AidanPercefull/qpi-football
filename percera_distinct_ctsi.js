
(() => {

    if (
        window.__PERCERA_DISTINCT_CTSI__
    ) {
        return;
    }

    window.__PERCERA_DISTINCT_CTSI__ =
        true;


    function normalize(
        value
    ) {

        return String(
            value || ""
        )
        .replace(
            /\s+/g,
            " "
        )
        .trim();
    }


    function navigateTo(
        view
    ) {

        const button =
            document.querySelector(
                `.nav-button[data-view="${view}"]`
            );

        if (button) {
            button.click();
        }
    }


    // ========================================================
    // FIND ORIGINAL CQI "WHAT THE MODEL MEASURES" SECTION
    // ========================================================

    function findCQIMeasuresSection() {

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
                    "h2, h3"
                )
            );


        for (
            const heading
            of headings
        ) {

            if (
                normalize(
                    heading.textContent
                ).toLowerCase()
                !==
                "what the model measures."
            ) {
                continue;
            }


            const section =
                heading.closest(
                    "section"
                );


            if (!section) {
                continue;
            }


            const text =
                normalize(
                    section.textContent
                );


            if (
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
            ) {

                return section;
            }
        }


        return null;
    }


    // ========================================================
    // REBUILD CTSI WITH ITS OWN VISUAL LANGUAGE
    // ========================================================

    function buildDistinctCTSI() {

        const section =
            document.querySelector(
                ".percera-ctsi-home-explainer"
            );


        if (!section) {
            return false;
        }


        if (
            section.dataset.distinctCtsi
            ===
            "1"
        ) {
            return true;
        }


        section.dataset.distinctCtsi =
            "1";


        section.innerHTML = `

            <div
                class="ctsi-distinct-head"
            >

                <div>

                    <span
                        class="ctsi-distinct-kicker"
                    >
                        CTSI
                    </span>


                    <h2>
                        How CTSI reads a team.
                    </h2>

                </div>


                <p>
                    Strength emerges from what a team did,
                    who it did it against and what that
                    performance implies nationally.
                </p>

            </div>


            <div
                class="ctsi-distinct-layout"
            >

                <article
                    class="
                        ctsi-distinct-card
                        ctsi-distinct-feature
                    "
                >

                    <div
                        class="ctsi-card-index"
                    >
                        01
                    </div>


                    <span
                        class="ctsi-card-label"
                    >
                        SCHEDULE CONTEXT
                    </span>


                    <h3>
                        Opponent strength changes
                        what a performance means.
                    </h3>


                    <p>
                        CTSI evaluates results through the
                        quality of the competition faced.
                        The same performance can provide
                        very different evidence depending
                        on the opponent that produced it.
                    </p>


                    <div
                        class="ctsi-feature-rule"
                    ></div>


                    <strong>
                        Context before résumé.
                    </strong>

                </article>


                <div
                    class="ctsi-distinct-side"
                >

                    <article
                        class="
                            ctsi-distinct-card
                            ctsi-distinct-secondary
                        "
                    >

                        <div
                            class="ctsi-card-index"
                        >
                            02
                        </div>


                        <div>

                            <span
                                class="ctsi-card-label"
                            >
                                PERFORMANCE
                            </span>


                            <h3>
                                How strong did the team
                                actually play?
                            </h3>


                            <p>
                                CTSI estimates underlying
                                team strength rather than
                                reproducing records, polls
                                or playoff résumé ordering.
                            </p>

                        </div>

                    </article>


                    <article
                        class="
                            ctsi-distinct-card
                            ctsi-distinct-secondary
                        "
                    >

                        <div
                            class="ctsi-card-index"
                        >
                            03
                        </div>


                        <div>

                            <span
                                class="ctsi-card-label"
                            >
                                RATING SCALE
                            </span>


                            <h3>
                                The gap has football meaning.
                            </h3>


                            <p>
                                CTSI remains on an
                                interpretable point-like scale,
                                with rating gaps calibrated
                                approximately to neutral-field
                                scoring margins.
                            </p>

                        </div>

                    </article>

                </div>

            </div>


            <div
                class="ctsi-distinct-footer"
            >

                <div>

                    <span>
                        CONTEXTUAL TEAM STRENGTH INDEX
                    </span>


                    <strong>
                        One national scale.
                        Every opponent matters.
                    </strong>

                </div>


                <button
                    type="button"
                    class="ctsi-distinct-button"
                >
                    Explore CTSI
                    <span>→</span>
                </button>

            </div>
        `;


        const button =
            section.querySelector(
                ".ctsi-distinct-button"
            );


        if (button) {

            button.addEventListener(
                "click",
                () => {

                    navigateTo(
                        "teams"
                    );
                }
            );
        }


        return true;
    }


    // ========================================================
    // HOME ORDER
    //
    // REQUIRED:
    //
    //   PERCERA MODELS
    //   CQI EXPLAINER
    //   CTSI EXPLAINER
    // ========================================================

    function fixHomeOrder() {

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
            findCQIMeasuresSection();


        const ctsi =
            home.querySelector(
                ".percera-ctsi-home-explainer"
            );


        if (
            !models
            ||
            !cqi
            ||
            !ctsi
        ) {

            return false;
        }


        // Move existing DOM nodes.
        // Nothing is cloned.

        models.insertAdjacentElement(
            "afterend",
            cqi
        );


        cqi.insertAdjacentElement(
            "afterend",
            ctsi
        );


        return true;
    }


    // ========================================================
    // WATERMARK TYPE
    //
    // Mark approved secondary art separately so CSS can make
    // it more visible than ordinary primary-logo watermarks.
    // ========================================================

    function decorateWatermark() {

        const watermark =
            document.querySelector(
                ".team-detail-watermark"
            );


        if (!watermark) {
            return;
        }


        const src =
            String(
                watermark.currentSrc
                ||
                watermark.src
                ||
                ""
            );


        const secondaries =
            Object.values(
                window.PERCERA_SECONDARY_LOGOS
                ||
                {}
            );


        const isSecondary =
            (
                src.includes(
                    "/secondary_logo_"
                )
                ||
                secondaries.some(
                    value =>
                        src === value
                )
            );


        watermark.classList.toggle(
            "watermark-secondary",
            isSecondary
        );


        watermark.classList.toggle(
            "watermark-primary",
            !isSecondary
        );
    }


    // ========================================================
    // INIT
    // ========================================================

    function initialize() {

        buildDistinctCTSI();

        fixHomeOrder();

        decorateWatermark();
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


    // Team page is rebuilt when another team is clicked.

    document.addEventListener(
        "click",
        () => {

            setTimeout(
                decorateWatermark,
                30
            );

            setTimeout(
                decorateWatermark,
                150
            );
        },
        true
    );


    window.addEventListener(
        "popstate",
        () => {

            setTimeout(
                initialize,
                50
            );
        }
    );

})();
