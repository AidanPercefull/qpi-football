
(() => {

    if (
        window.__PERCERA_CTSI_REFINEMENT__
    ) {
        return;
    }

    window.__PERCERA_CTSI_REFINEMENT__ =
        true;


    // ========================================================
    // NAV HELPER
    // ========================================================

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
    // HOMEPAGE — DEDICATED CTSI EXPLAINER
    //
    // Current homepage already has CQI-focused explanatory
    // content. We add a CTSI section of similar weight so the
    // page no longer feels QB-first with CTSI merely mentioned.
    // ========================================================

    function addCTSIHomeSection() {

        const home =
            document.querySelector(
                "#home-view"
            );

        if (
            !home ||
            home.querySelector(
                ".percera-ctsi-home-explainer"
            )
        ) {
            return;
        }


        const section =
            document.createElement(
                "section"
            );

        section.className =
            "percera-ctsi-home-explainer";


        section.innerHTML = `
            <div class="ctsi-home-copy">

                <span class="eyebrow">
                    TEAM ANALYTICS
                </span>

                <h2>
                    Contextual Team Strength Index
                </h2>

                <p class="ctsi-home-lead">
                    CTSI measures how strong a college football
                    team has actually performed, adjusting game
                    results for the quality of the opponents faced.
                </p>


                <div class="ctsi-home-points">

                    <div class="ctsi-home-point">

                        <strong>
                            Opponent aware
                        </strong>

                        <span>
                            Beating or competing with a strong team
                            carries different information than doing
                            the same against a weak opponent.
                        </span>

                    </div>


                    <div class="ctsi-home-point">

                        <strong>
                            Performance over résumé
                        </strong>

                        <span>
                            CTSI is built to estimate team strength,
                            not replicate polls, playoff résumés or
                            win-loss ordering.
                        </span>

                    </div>


                    <div class="ctsi-home-point">

                        <strong>
                            Point-like scale
                        </strong>

                        <span>
                            The distance between two CTSI ratings is
                            calibrated to behave approximately like
                            an expected neutral-field scoring margin.
                        </span>

                    </div>

                </div>


                <button
                    type="button"
                    class="ctsi-home-button"
                >
                    Explore CTSI rankings
                    <span>→</span>
                </button>

            </div>


            <div class="ctsi-home-visual">

                <div class="ctsi-home-index">
                    CTSI
                </div>

                <div class="ctsi-home-scale">

                    <span>
                        TEAM STRENGTH
                    </span>

                    <strong>
                        Context matters.
                    </strong>

                    <p>
                        Every result is interpreted through the
                        strength of the competition that produced it.
                    </p>

                </div>

            </div>
        `;


        section
            .querySelector(
                ".ctsi-home-button"
            )
            .addEventListener(
                "click",
                () => navigateTo("teams")
            );


        // ----------------------------------------------------
        // Find the existing CQI explanatory section.
        //
        // We deliberately avoid the two-model cards we added
        // earlier and look for an existing section whose copy
        // talks about CQI but not CTSI.
        // ----------------------------------------------------

        const candidates =
            Array.from(
                home.querySelectorAll(
                    ":scope > section"
                )
            );


        const cqiSection =
            candidates.find(
                node => {

                    if (
                        node.classList.contains(
                            "percera-models-home"
                        )
                    ) {
                        return false;
                    }

                    const text =
                        String(
                            node.textContent || ""
                        )
                        .toUpperCase();

                    return (
                        text.includes("CQI")
                        &&
                        !text.includes("CTSI")
                    );
                }
            );


        if (cqiSection) {

            cqiSection.insertAdjacentElement(
                "afterend",
                section
            );

            return;
        }


        // Fallback:
        // place after the model-family cards.

        const modelSection =
            home.querySelector(
                ".percera-models-home"
            );


        if (modelSection) {

            modelSection.insertAdjacentElement(
                "afterend",
                section
            );

        } else {

            home.appendChild(
                section
            );
        }
    }


    // ========================================================
    // CTSI METHODOLOGY
    //
    // Match CQI's cadence:
    //
    //   intro
    //   what it measures
    //   component-style section
    //   opponent context
    //   how model was built
    //   weekly ratings
    //   what it is not
    //   technical methodology
    // ========================================================

    function refineCTSIMethodology() {

        const panel =
            document.querySelector(
                '.percera-method-panel[data-method="ctsi"]'
            );

        if (
            !panel ||
            panel.dataset.ctsiCadence === "1"
        ) {
            return;
        }


        panel.dataset.ctsiCadence =
            "1";


        panel.innerHTML = `

            <span class="eyebrow">
                CTSI
            </span>


            <h2>
                How CTSI Works
            </h2>


            <p class="method-intro">
                CTSI is an opponent-aware measure of observed
                college football team strength. It is designed
                to estimate how strong a team has performed,
                not simply rank teams by record or résumé.
            </p>


            <div class="method-section">

                <h3>
                    What CTSI measures
                </h3>

                <p>
                    CTSI evaluates team performance while accounting
                    for the quality of the competition faced.
                    Strong performances against strong opponents
                    provide different evidence than identical
                    performances against weaker opponents.
                </p>

            </div>


            <div class="method-section">

                <h3>
                    Team Performance
                </h3>

                <p>
                    CTSI combines game-level information into a
                    single estimate of overall team strength.
                    The public rating is expressed on a point-like
                    scale rather than an arbitrary 0–100 score.
                </p>


                <div class="method-pill-grid">

                    <div class="method-pill">

                        <strong>
                            Game efficiency
                        </strong>

                        <span>
                            How effectively a team performs across
                            its qualifying FBS games.
                        </span>

                    </div>


                    <div class="method-pill">

                        <strong>
                            Opponent strength
                        </strong>

                        <span>
                            Performance is interpreted relative to
                            the quality of the team on the other
                            side of the field.
                        </span>

                    </div>


                    <div class="method-pill">

                        <strong>
                            Relative strength
                        </strong>

                        <span>
                            Teams are placed on one national scale
                            so the difference between ratings is
                            directly comparable.
                        </span>

                    </div>


                    <div class="method-pill">

                        <strong>
                            Predictive validation
                        </strong>

                        <span>
                            The rating structure was tested against
                            future games rather than judged only by
                            how well it describes games already played.
                        </span>

                    </div>

                </div>

            </div>


            <div class="method-section">

                <h3>
                    Opponent Context
                </h3>

                <p>
                    CTSI does not treat every result as equally
                    informative. The strength of the opponent helps
                    determine what a team's performance says about
                    its underlying quality.
                </p>

                <p>
                    This is why two teams with similar records can
                    carry very different CTSI ratings.
                </p>

            </div>


            <div class="method-section">

                <h3>
                    How the model was built
                </h3>

                <p>
                    CTSI was developed using historical college
                    football game-performance data and evaluated
                    on future games that were not part of the
                    rating snapshot used to make the prediction.
                </p>

                <p>
                    The public scale was also checked for point
                    calibration. Historically, differences in CTSI
                    have tracked realized neutral-field scoring
                    margins closely enough to preserve the model's
                    native point-like interpretation.
                </p>

            </div>


            <div class="method-section">

                <h3>
                    Weekly ratings
                </h3>

                <p>
                    CTSI updates as new games add information about
                    both a team and the opponents already on its
                    schedule.
                </p>

                <p>
                    A team must have at least two qualifying FBS
                    games to receive a numbered national CTSI rank.
                    Teams below that threshold can still display a
                    rating, but are marked provisional.
                </p>

            </div>


            <div class="method-section">

                <h3>
                    What CTSI is not
                </h3>

                <p>
                    CTSI is not a poll, playoff résumé ranking,
                    recruiting rating or guarantee that the
                    higher-rated team will win an individual game.
                </p>

                <p>
                    It is a statistical estimate of current team
                    strength based on observed performance and
                    opponent context.
                </p>

            </div>


            <details class="technical-methodology">

                <summary>
                    Technical Methodology
                </summary>


                <div class="technical-content">

                    <h3>
                        Rating scale
                    </h3>

                    <p>
                        CTSI remains on the model's native
                        point-like scale. A rating gap can therefore
                        be interpreted approximately as the expected
                        neutral-field scoring difference between
                        two teams.
                    </p>


                    <h3>
                        Validation
                    </h3>

                    <p>
                        Historical evaluation compared rating
                        snapshots with future game outcomes.
                        The model was assessed for both predictive
                        usefulness and calibration of the rating
                        gap itself.
                    </p>


                    <h3>
                        Early-season reliability
                    </h3>

                    <p>
                        Ratings based on only one qualifying FBS
                        game are materially less reliable than
                        ratings supported by larger samples.
                        Percera therefore separates those teams
                        from the numbered national rankings.
                    </p>


                    <h3>
                        Current limitations
                    </h3>

                    <ul class="technical-list">

                        <li>
                            Early-season ratings can change quickly
                            as additional games provide more evidence.
                        </li>

                        <li>
                            CTSI summarizes overall team strength
                            and does not independently model every
                            injury, personnel change or matchup.
                        </li>

                        <li>
                            The public number is a neutral-field
                            rating and does not by itself include
                            home-field advantage.
                        </li>

                    </ul>

                </div>

            </details>
        `;
    }


    // ========================================================
    // INIT
    // ========================================================

    function initialize() {

        addCTSIHomeSection();

        refineCTSIMethodology();
    }


    initialize();


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
