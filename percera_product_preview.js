
(() => {

    if (
        window.__PERCERA_PRODUCT_PREVIEW_V1__
    ) {
        return;
    }

    window.__PERCERA_PRODUCT_PREVIEW_V1__ =
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
    // CTSI HEADER
    //
    // Remove NEUTRAL FIELD entirely.
    // CTSI itself becomes the active gold label.
    // ========================================================

    function fixCTSIHeader() {

        const header =
            document.querySelector(
                "#teams-ctsi-header"
            );

        if (!header) {
            return false;
        }


        // Remove old subtitle if present.
        header
            .querySelectorAll(
                ".teams-ctsi-subtitle"
            )
            .forEach(
                node => node.remove()
            );


        const title =
            header.querySelector(
                ".teams-ctsi-title"
            );


        if (title) {

            title.textContent =
                "CTSI";

        } else {

            // Preserve any arrow generated through CSS.
            header.textContent =
                "CTSI";
        }


        return true;
    }


    // ========================================================
    // METHODOLOGY
    //
    // Preserve the EXISTING methodology as CQI.
    // We are not rewriting the frozen CQI methodology here.
    //
    // CTSI gets its own product methodology panel.
    // ========================================================

    function buildMethodologyTabs() {

        const view =
            document.querySelector(
                "#methodology-view"
            );

        if (
            !view ||
            view.dataset.perceraTabs === "1"
        ) {
            return false;
        }


        view.dataset.perceraTabs =
            "1";


        // ---------------------------------------------
        // Preserve ALL existing methodology nodes.
        // ---------------------------------------------

        const existingNodes =
            Array.from(
                view.childNodes
            );


        const shell =
            document.createElement(
                "div"
            );

        shell.className =
            "percera-method-shell";


        const intro =
            document.createElement(
                "div"
            );

        intro.className =
            "percera-method-heading";

        intro.innerHTML = `
            <span class="eyebrow">
                PERCERA MODELS
            </span>

            <h2>
                Methodology
            </h2>

            <p>
                Explore how Percera evaluates quarterback
                performance and team strength.
            </p>
        `;


        const tabs =
            document.createElement(
                "div"
            );

        tabs.className =
            "percera-method-tabs";

        tabs.setAttribute(
            "role",
            "tablist"
        );


        const cqiButton =
            document.createElement(
                "button"
            );

        cqiButton.type =
            "button";

        cqiButton.className =
            "percera-method-tab active";

        cqiButton.textContent =
            "CQI";

        cqiButton.setAttribute(
            "role",
            "tab"
        );


        const ctsiButton =
            document.createElement(
                "button"
            );

        ctsiButton.type =
            "button";

        ctsiButton.className =
            "percera-method-tab";

        ctsiButton.textContent =
            "CTSI";

        ctsiButton.setAttribute(
            "role",
            "tab"
        );


        tabs.append(
            cqiButton,
            ctsiButton
        );


        // ---------------------------------------------
        // CQI PANEL
        //
        // Existing methodology is moved here unchanged.
        // ---------------------------------------------

        const cqiPanel =
            document.createElement(
                "div"
            );

        cqiPanel.className =
            "percera-method-panel active";

        cqiPanel.dataset.method =
            "cqi";


        existingNodes.forEach(
            node => {

                cqiPanel.appendChild(
                    node
                );
            }
        );


        // Hide the old top-level methodology heading,
        // if one exists, because our shared heading now
        // sits above the tabs.
        const oldHeading =
            cqiPanel.querySelector(
                ":scope > h2"
            );

        const oldIntro =
            cqiPanel.querySelector(
                ":scope > .method-intro"
            );

        if (oldHeading) {
            oldHeading.classList.add(
                "percera-old-method-heading"
            );
        }

        if (oldIntro) {
            oldIntro.classList.add(
                "percera-old-method-heading"
            );
        }


        // ---------------------------------------------
        // CTSI PANEL
        // ---------------------------------------------

        const ctsiPanel =
            document.createElement(
                "div"
            );

        ctsiPanel.className =
            "percera-method-panel";

        ctsiPanel.dataset.method =
            "ctsi";


        ctsiPanel.innerHTML = `
            <div class="percera-model-intro">

                <span class="percera-model-kicker">
                    CONTEXTUAL TEAM STRENGTH INDEX
                </span>

                <h2>
                    CTSI
                </h2>

                <p class="method-intro">
                    CTSI is Percera's team-strength rating.
                    It estimates how strong a team is on a
                    neutral field using opponent-aware game
                    performance rather than wins and losses alone.
                </p>

            </div>


            <div class="method-section">

                <h3>
                    What CTSI measures
                </h3>

                <p>
                    CTSI is designed to describe current team
                    strength. A positive rating represents a team
                    rated above the national reference point,
                    while a negative rating represents a team
                    rated below it.
                </p>

                <p>
                    The scale is intentionally interpretable in
                    football terms: differences between team
                    ratings are calibrated to behave approximately
                    like expected neutral-field scoring margins.
                </p>

            </div>


            <div class="method-grid percera-ctsi-pill-grid">

                <div class="method-pill">

                    <strong>
                        Opponent aware
                    </strong>

                    <span>
                        Game performance is evaluated in the
                        context of opponent strength rather than
                        treating every result as equally difficult.
                    </span>

                </div>


                <div class="method-pill">

                    <strong>
                        Performance based
                    </strong>

                    <span>
                        CTSI uses how teams actually perform in
                        games, not polls, recruiting rankings,
                        brand strength or résumé voting.
                    </span>

                </div>


                <div class="method-pill">

                    <strong>
                        Neutral-field scale
                    </strong>

                    <span>
                        Ratings are expressed on a point-like
                        neutral-field scale so the distance
                        between two teams has an intuitive meaning.
                    </span>

                </div>


                <div class="method-pill">

                    <strong>
                        Weekly snapshots
                    </strong>

                    <span>
                        Ratings update as new games provide
                        additional information about each team
                        and its opponents.
                    </span>

                </div>

            </div>


            <div class="method-section">

                <h3>
                    Early-season sample size
                </h3>

                <p>
                    Team ratings are less certain when only a
                    small number of qualifying FBS games have
                    been played. Percera therefore distinguishes
                    provisional early-season ratings from the
                    primary ranked set.
                </p>

                <p>
                    The current public leaderboard requires at
                    least two qualifying FBS games for a team to
                    receive a numbered CTSI rank. Teams below
                    that threshold may still display a rating,
                    but it is marked provisional.
                </p>

            </div>


            <div class="method-section">

                <h3>
                    What CTSI is not
                </h3>

                <p>
                    CTSI is not a poll, résumé ranking, playoff
                    selection metric or prediction that the
                    higher-rated team must win a particular game.
                    It is a statistical estimate of team strength.
                </p>

            </div>


            <details class="technical-methodology">

                <summary>
                    Technical Methodology
                </summary>

                <div class="technical-content">

                    <h3>
                        Rating construction
                    </h3>

                    <p>
                        CTSI combines team game-performance
                        information with opponent context to
                        estimate relative team strength. The
                        system is evaluated using future-game
                        performance so that the rating is judged
                        by whether it contains useful information
                        beyond the games already played.
                    </p>


                    <h3>
                        Point-scale calibration
                    </h3>

                    <p>
                        Historical backtesting shows that CTSI
                        rating gaps are close to a literal
                        point-margin interpretation. The public
                        rating therefore remains on that native
                        scale rather than being converted into
                        an arbitrary 0–100 score.
                    </p>


                    <h3>
                        Current limitations
                    </h3>

                    <ul class="technical-list">

                        <li>
                            Early-season estimates can move
                            substantially because teams have
                            played only a small number of games.
                        </li>

                        <li>
                            A team rating summarizes overall team
                            strength and does not isolate every
                            unit, player, injury or matchup effect.
                        </li>

                        <li>
                            A neutral-field rating does not by
                            itself include the location-specific
                            advantage of an individual matchup.
                        </li>

                    </ul>

                </div>

            </details>
        `;


        shell.append(
            intro,
            tabs,
            cqiPanel,
            ctsiPanel
        );


        view.appendChild(
            shell
        );


        function selectMethod(
            method
        ) {

            const isCQI =
                method === "cqi";


            cqiButton.classList.toggle(
                "active",
                isCQI
            );

            ctsiButton.classList.toggle(
                "active",
                !isCQI
            );

            cqiPanel.classList.toggle(
                "active",
                isCQI
            );

            ctsiPanel.classList.toggle(
                "active",
                !isCQI
            );
        }


        cqiButton.addEventListener(
            "click",
            () => selectMethod("cqi")
        );


        ctsiButton.addEventListener(
            "click",
            () => selectMethod("ctsi")
        );


        return true;
    }


    // ========================================================
    // HOME
    //
    // Add CTSI as a first-class Percera product without
    // deleting the existing homepage.
    // ========================================================

    function enhanceHome() {

        const home =
            document.querySelector(
                "#home-view"
            );

        if (
            !home ||
            home.dataset.perceraModels === "1"
        ) {
            return false;
        }


        home.dataset.perceraModels =
            "1";


        const section =
            document.createElement(
                "section"
            );

        section.className =
            "percera-models-home";


        section.innerHTML = `
            <div class="percera-models-home-head">

                <div>

                    <span class="eyebrow">
                        PERCERA MODELS
                    </span>

                    <h2>
                        Two views of college football.
                    </h2>

                    <p>
                        Percera evaluates both individual
                        quarterback performance and overall team
                        strength through separate contextual models.
                    </p>

                </div>

            </div>


            <div class="percera-model-card-grid">

                <article
                    class="percera-model-card"
                    data-target="rankings"
                >

                    <div class="percera-model-card-top">

                        <span class="percera-model-code">
                            CQI
                        </span>

                        <span class="percera-model-type">
                            QUARTERBACKS
                        </span>

                    </div>

                    <h3>
                        Contextual Quarterback Index
                    </h3>

                    <p>
                        Opponent-aware evaluation of college
                        quarterback performance, separating
                        passing and rushing production into a
                        consistent weekly framework.
                    </p>

                    <span class="percera-model-link">
                        Explore quarterbacks →
                    </span>

                </article>


                <article
                    class="percera-model-card"
                    data-target="teams"
                >

                    <div class="percera-model-card-top">

                        <span class="percera-model-code">
                            CTSI
                        </span>

                        <span class="percera-model-type">
                            TEAMS
                        </span>

                    </div>

                    <h3>
                        Contextual Team Strength Index
                    </h3>

                    <p>
                        Opponent-aware team-strength ratings on
                        an interpretable neutral-field scale,
                        updated as the season provides more
                        information.
                    </p>

                    <span class="percera-model-link">
                        Explore teams →
                    </span>

                </article>

            </div>
        `;


        /*
        Put the model section high enough on the homepage that
        Percera immediately reads as a multi-model analytics
        platform, but preserve the existing homepage content.
        */

        const firstExistingSection =
            home.querySelector(
                "section"
            );


        if (
            firstExistingSection &&
            firstExistingSection.nextSibling
        ) {

            firstExistingSection.parentNode
                .insertBefore(
                    section,
                    firstExistingSection.nextSibling
                );

        } else {

            home.appendChild(
                section
            );
        }


        section
            .querySelectorAll(
                ".percera-model-card"
            )
            .forEach(
                card => {

                    card.addEventListener(
                        "click",
                        () => {

                            navigateTo(
                                card.dataset.target
                            );
                        }
                    );
                }
            );


        return true;
    }


    // ========================================================
    // INITIALIZE
    // ========================================================

    function initialize() {

        fixCTSIHeader();

        buildMethodologyTabs();

        enhanceHome();
    }


    initialize();


    /*
    home.js / teams.js may construct surfaces after this script
    first executes. Poll briefly so we enhance the real surface
    once it exists without taking ownership of its renderer.
    */

    let attempts = 0;

    const timer =
        setInterval(
            () => {

                attempts += 1;

                initialize();

                if (attempts >= 40) {

                    clearInterval(
                        timer
                    );
                }

            },
            100
        );

})();
