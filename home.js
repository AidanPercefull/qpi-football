
/* ==========================================================
   PERCERA HOMEPAGE
   ========================================================== */

(() => {

    const leaderboard =
        window.CQI_LEADERBOARD
        ||
        window.QPI_LEADERBOARD
        ||
        null;


    const rankingsView =
        document.getElementById(
            "rankings-view"
        );


    const playerView =
        document.getElementById(
            "player-view"
        );


    const methodologyView =
        document.getElementById(
            "methodology-view"
        );


    const main =
        document.querySelector(
            "main"
        );


    const nav =
        document.querySelector(
            ".site-header nav"
        )
        ||
        document.querySelector(
            "header nav"
        );


    if (
        !main
        ||
        !nav
        ||
        !rankingsView
        ||
        !methodologyView
    ) {

        console.warn(
            "Percera homepage prototype could not initialize."
        );

        return;
    }


    // -------------------------------------------------------
    // CLEAN OLD PROTOTYPE IF RERUN
    // -------------------------------------------------------

    document
        .getElementById(
            "home-view"
        )
        ?.remove();


    document
        .querySelector(
            '[data-view="home"]'
        )
        ?.remove();


    // -------------------------------------------------------
    // CURRENT CQI INFORMATION
    // -------------------------------------------------------

    const quarterbacks =
        (
            leaderboard
            &&
            Array.isArray(
                leaderboard.quarterbacks
            )
        )
        ?
        leaderboard.quarterbacks
        :
        [];


    const leader =
        quarterbacks.length
        ?
        quarterbacks[0]
        :
        null;


    function firstValue(
        ...values
    ) {

        for (
            const value
            of values
        ) {

            if (
                value !== null
                &&
                value !== undefined
                &&
                value !== ""
            ) {

                return value;
            }
        }


        return null;
    }


    function formatScore(
        value
    ) {

        const number =
            Number(
                value
            );


        if (
            !Number.isFinite(
                number
            )
        ) {

            return "—";
        }


        return number.toFixed(
            1
        );
    }


    const leaderName =
        leader
        ?
        firstValue(
            leader.player,
            leader.name,
            "Current leader"
        )
        :
        "Current leader";


    const leaderTeam =
        leader
        ?
        firstValue(
            leader.team,
            ""
        )
        :
        "";


    const leaderScore =
        leader
        ?
        firstValue(
            leader.cqi,
            leader.qpi,
            leader.score,
            leader["CQI v1.1"]
        )
        :
        null;


    const leaderLogo =
        leader
        ?
        firstValue(
            leader.team_logo,
            leader.logo
        )
        :
        null;


    const leaderHeadshot =
        leader
        ?
        firstValue(
            leader.headshot_url,
            leader.headshot
        )
        :
        null;


    const leaderColor =
        leader
        ?
        firstValue(
            leader.team_color,
            "#C48B28"
        )
        :
        "#C48B28";


    const leaderSlug =
        leader
        ?
        firstValue(
            leader.slug,
            null
        )
        :
        null;


    const qbCount =
        quarterbacks.length
        ||
        135;


    // -------------------------------------------------------
    // CREATE HOME NAV BUTTON
    // -------------------------------------------------------

    const homeButton =
        document.createElement(
            "button"
        );


    homeButton.className =
        "nav-button";


    homeButton.dataset.view =
        "home";


    homeButton.textContent =
        "Home";


    nav.insertBefore(
        homeButton,
        nav.firstChild
    );


    // -------------------------------------------------------
    // CREATE HOME VIEW
    // -------------------------------------------------------

    const homeView =
        document.createElement(
            "section"
        );


    homeView.id =
        "home-view";


    homeView.innerHTML = `

        <!-- =================================================
             HERO
             ================================================= -->

        <section
            class="percera-home-hero"
        >

            <div
                class="home-hero-copy"
            >

                <img
                    src="percera-wordmark-transparent.png"
                    alt="Percera"
                    class="home-hero-wordmark"
                >


                <div
                    class="home-eyebrow"
                >
                    Independent College Football Analytics
                </div>


                <h1>
                    Performance,
                    <br>
                    in context.
                </h1>


                <p
                    class="home-hero-description"
                >
                    Percera builds transparent,
                    testable college-football analytics.
                    CQI v1.1 starts with quarterbacks —
                    measuring the parts of current performance
                    that historically carried forward.
                </p>


                <div
                    class="home-actions"
                >

                    <button
                        type="button"
                        class="
                            home-action
                            home-action-primary
                        "
                        id="home-rankings-button"
                    >
                        Explore CQI Rankings
                    </button>


                    <button
                        type="button"
                        class="
                            home-action
                            home-action-secondary
                        "
                        id="home-methodology-button"
                    >
                        How CQI Works
                    </button>

                </div>


                <div
                    class="home-model-meta"
                >

                    <span>
                        CQI v1.1
                    </span>

                    <i></i>

                    <span>
                        2026 · Through Week 3
                    </span>

                    <i></i>

                    <span>
                        ${qbCount} ranked quarterbacks
                    </span>

                </div>

            </div>


            <!-- =============================================
                 FLAGSHIP PRODUCT / CURRENT LEADER
                 ============================================= -->

            <article
                class="home-cqi-feature"
                style="
                    --home-team-color:
                    ${leaderColor};
                "
            >

                <div
                    class="home-feature-top"
                >

                    <div>

                        <span
                            class="home-feature-kicker"
                        >
                            Flagship Model
                        </span>

                        <h2>
                            Contextual
                            <br>
                            Quarterback Index
                        </h2>

                    </div>


                    <div
                        class="home-version-mark"
                    >
                        CQI
                    </div>

                </div>


                <div
                    class="home-current-leader"
                >

                    <div
                        class="home-leader-visual"
                    >

                        ${
                            leaderHeadshot
                            ?
                            `
                                <img
                                    src="${leaderHeadshot}"
                                    alt="${leaderName}"
                                    class="home-leader-headshot"
                                    ${
                                        leaderLogo
                                        ?
                                        `
                                        onerror="
                                            this.onerror=null;
                                            this.src='${leaderLogo}';
                                            this.classList.add(
                                                'home-leader-fallback'
                                            );
                                        "
                                        `
                                        :
                                        ""
                                    }
                                >
                            `
                            :
                            (
                                leaderLogo
                                ?
                                `
                                    <img
                                        src="${leaderLogo}"
                                        alt="${leaderTeam}"
                                        class="
                                            home-leader-headshot
                                            home-leader-fallback
                                        "
                                    >
                                `
                                :
                                ""
                            )
                        }

                    </div>


                    <div
                        class="home-leader-info"
                    >

                        <span
                            class="home-leader-label"
                        >
                            Current No. 1
                        </span>


                        ${
                            leaderTeam
                            ?
                            `
                                <div
                                    class="home-leader-team"
                                >

                                    ${
                                        leaderLogo
                                        ?
                                        `
                                            <img
                                                src="${leaderLogo}"
                                                alt="${leaderTeam}"
                                            >
                                        `
                                        :
                                        ""
                                    }

                                    <span>
                                        ${leaderTeam}
                                    </span>

                                </div>
                            `
                            :
                            ""
                        }


                        <h3>
                            ${leaderName}
                        </h3>


                        <div
                            class="home-leader-score"
                        >

                            <strong>
                                ${formatScore(
                                    leaderScore
                                )}
                            </strong>

                            <span>
                                CQI
                            </span>

                        </div>


                        ${
                            leaderSlug
                            ?
                            `
                                <button
                                    type="button"
                                    id="home-leader-profile"
                                    class="home-profile-link"
                                >
                                    View profile →
                                </button>
                            `
                            :
                            ""
                        }

                    </div>

                </div>

            </article>

        </section>


        <!-- =================================================
             MODEL EXPLANATION
             ================================================= -->

        <section
            class="home-section"
        >

            <div
                class="home-section-heading"
            >

                <div>

                    <span
                        class="home-section-kicker"
                    >
                        CQI v1.1
                    </span>

                    <h2>
                        What the model measures.
                    </h2>

                </div>


                <p>
                    Three signals, each compared against
                    the historical CQI reference population.
                </p>

            </div>


            <div
                class="home-signal-grid"
            >

                <article
                    class="home-signal-card"
                >

                    <span
                        class="home-signal-number"
                    >
                        01
                    </span>

                    <h3>
                        Passing Efficiency
                    </h3>

                    <p>
                        Passing production adjusted for
                        the strength of the defenses faced.
                    </p>

                </article>


                <article
                    class="home-signal-card"
                >

                    <span
                        class="home-signal-number"
                    >
                        02
                    </span>

                    <h3>
                        Sack Avoidance
                    </h3>

                    <p>
                        Quarterback sack tendency estimated
                        in the context of the opposing pass
                        rushes faced.
                    </p>

                </article>


                <article
                    class="home-signal-card"
                >

                    <span
                        class="home-signal-number"
                    >
                        03
                    </span>

                    <h3>
                        Rushing Value
                    </h3>

                    <p>
                        Sustained quarterback rushing value
                        captured separately from passing
                        performance.
                    </p>

                </article>

            </div>

        </section>


        <!-- =================================================
             VALIDATION / CREDIBILITY
             ================================================= -->

        <section
            class="
                home-section
                home-validation
            "
        >

            <div
                class="home-validation-copy"
            >

                <span
                    class="home-section-kicker"
                >
                    Forward Validation
                </span>


                <h2>
                    Performance that carried forward.
                </h2>


                <p>
                    CQI was built around signals that
                    historically carried into subsequent
                    quarterback performance. In forward
                    testing, Top-25 CQI observations produced
                    above-expected performance at a strong
                    rate. The final v1.1 model was also frozen
                    before evaluation on the untouched 2022
                    holdout.
                </p>


                <button
                    type="button"
                    class="home-validation-link"
                    id="home-validation-methodology"
                >
                    See the validation methodology →
                </button>

            </div>


            <div
                class="home-validation-stat"
            >

                <span>
                    Top-25 Forward Performance
                </span>

                <strong>
                    73%
                </strong>

                <p>
                    produced above-expected
                    forward performance
                </p>

            </div>

        </section>


        <!-- =================================================
             BOTTOM CTA
             ================================================= -->

        <section
            class="home-bottom-cta"
        >

            <div>

                <span
                    class="home-section-kicker"
                >
                    Current Rankings
                </span>

                <h2>
                    See who CQI has at the top.
                </h2>

            </div>


            <button
                type="button"
                class="
                    home-action
                    home-action-primary
                "
                id="home-bottom-rankings"
            >
                View all ${qbCount} quarterbacks
            </button>

        </section>

    `;


    main.insertBefore(
        homeView,
        rankingsView
    );


    // -------------------------------------------------------
    // VIEW HELPERS
    // -------------------------------------------------------

    function setActiveNav(
        view
    ) {

        document
            .querySelectorAll(
                ".nav-button"
            )
            .forEach(
                button => {

                    button
                        .classList
                        .toggle(
                            "active",
                            button.dataset.view
                            ===
                            view
                        );
                }
            );
    }


    function hideAllViews() {

        homeView
            .classList
            .add(
                "hidden"
            );


        rankingsView
            .classList
            .add(
                "hidden"
            );


        if (playerView) {

            playerView
                .classList
                .add(
                    "hidden"
                );
        }


        methodologyView
            .classList
            .add(
                "hidden"
            );
    }


    function showHome() {

        hideAllViews();


        homeView
            .classList
            .remove(
                "hidden"
            );


        setActiveNav(
            "home"
        );


        window.scrollTo(
            {
                top: 0,
                behavior: "instant"
            }
        );
    }


    function showRankings() {

        hideAllViews();


        rankingsView
            .classList
            .remove(
                "hidden"
            );


        setActiveNav(
            "rankings"
        );


        window.scrollTo(
            {
                top: 0,
                behavior: "instant"
            }
        );
    }


    function showMethodology() {

        hideAllViews();


        methodologyView
            .classList
            .remove(
                "hidden"
            );


        setActiveNav(
            "methodology"
        );


        window.scrollTo(
            {
                top: 0,
                behavior: "instant"
            }
        );
    }


    // -------------------------------------------------------
    // NAVIGATION
    // -------------------------------------------------------

    homeButton.addEventListener(
        "click",
        showHome
    );


    document
        .querySelectorAll(
            '.nav-button[data-view="rankings"]'
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        // Runs after the site's original
                        // rankings navigation.
                        homeView
                            .classList
                            .add(
                                "hidden"
                            );
                    }
                );
            }
        );


    document
        .querySelectorAll(
            '.nav-button[data-view="methodology"]'
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        homeView
                            .classList
                            .add(
                                "hidden"
                            );
                    }
                );
            }
        );


    document
        .getElementById(
            "home-rankings-button"
        )
        ?.addEventListener(
            "click",
            showRankings
        );


    document
        .getElementById(
            "home-bottom-rankings"
        )
        ?.addEventListener(
            "click",
            showRankings
        );


    document
        .getElementById(
            "home-methodology-button"
        )
        ?.addEventListener(
            "click",
            showMethodology
        );


    document
        .getElementById(
            "home-validation-methodology"
        )
        ?.addEventListener(
            "click",
            showMethodology
        );


    // -------------------------------------------------------
    // CURRENT LEADER PROFILE
    // -------------------------------------------------------

    document
        .getElementById(
            "home-leader-profile"
        )
        ?.addEventListener(
            "click",
            () => {

                homeView
                    .classList
                    .add(
                        "hidden"
                    );


                if (
                    leaderSlug
                    &&
                    typeof window.showPlayer
                    ===
                    "function"
                ) {

                    window.showPlayer(
                        leaderSlug
                    );

                } else {

                    showRankings();
                }
            }
        );


    // -------------------------------------------------------
    // BRAND / WORDMARK RETURNS HOME
    // -------------------------------------------------------

    const brand =
        document.querySelector(
            ".site-header .brand"
        );


    if (brand) {

        brand.classList.add(
            "percera-home-brand-link"
        );


        brand.addEventListener(
            "click",
            showHome
        );
    }


    // -------------------------------------------------------
    // HOME IS INITIAL VIEW
    // -------------------------------------------------------

    showHome();

})();


/* ==========================================================
   END PERCERA HOMEPAGE
   ========================================================== */
