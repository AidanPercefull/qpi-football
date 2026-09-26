
(() => {

    if (
        window.__PERCERA_CTSI_HOME_POLISH__
    ) {
        return;
    }

    window.__PERCERA_CTSI_HOME_POLISH__ =
        true;


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


    function polishCTSIHome() {

        const section =
            document.querySelector(
                ".percera-ctsi-home-explainer"
            );


        if (
            !section
            ||
            section.dataset.cqiCadence
            ===
            "1"
        ) {

            return false;
        }


        section.dataset.cqiCadence =
            "1";


        section.innerHTML = `

            <div
                class="ctsi-measures-heading"
            >

                <div>

                    <span
                        class="ctsi-measures-kicker"
                    >
                        CTSI
                    </span>


                    <h2>
                        What the model measures.
                    </h2>

                </div>


                <p
                    class="ctsi-measures-summary"
                >
                    Three signals used to estimate
                    current team strength in context.
                </p>

            </div>


            <div
                class="ctsi-measures-grid"
            >

                <article
                    class="ctsi-measure-card"
                >

                    <span
                        class="ctsi-measure-number"
                    >
                        01
                    </span>


                    <h3>
                        Opponent Context
                    </h3>


                    <p>
                        Team performance is interpreted
                        against the strength of the
                        competition that produced it.
                    </p>

                </article>


                <article
                    class="ctsi-measure-card"
                >

                    <span
                        class="ctsi-measure-number"
                    >
                        02
                    </span>


                    <h3>
                        Performance Strength
                    </h3>


                    <p>
                        CTSI evaluates how strongly a team
                        has actually performed rather than
                        reproducing polls, records or résumé
                        ordering.
                    </p>

                </article>


                <article
                    class="ctsi-measure-card"
                >

                    <span
                        class="ctsi-measure-number"
                    >
                        03
                    </span>


                    <h3>
                        Point-Scale Rating
                    </h3>


                    <p>
                        Rating gaps are calibrated to behave
                        approximately like expected
                        neutral-field scoring margins.
                    </p>

                </article>

            </div>


            <div
                class="ctsi-measures-footer"
            >

                <div>

                    <span>
                        CONTEXTUAL TEAM STRENGTH INDEX
                    </span>


                    <strong>
                        Team strength with the schedule
                        taken seriously.
                    </strong>

                </div>


                <button
                    type="button"
                    class="ctsi-measures-button"
                >
                    Explore CTSI rankings
                    <span>
                        →
                    </span>
                </button>

            </div>
        `;


        const button =
            section.querySelector(
                ".ctsi-measures-button"
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


    polishCTSIHome();


    // home.js may render after this script.
    let attempts = 0;


    const timer =
        setInterval(
            () => {

                attempts += 1;

                polishCTSIHome();


                if (
                    attempts >= 40
                ) {

                    clearInterval(
                        timer
                    );
                }

            },
            100
        );

})();
