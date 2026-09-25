
const leaderboardData =
    window.CQI_LEADERBOARD ||
    window.QPI_LEADERBOARD;

const playerData =
    window.CQI_PLAYERS ||
    window.QPI_PLAYERS;

const methodologyData =
    window.CQI_METHODOLOGY ||
    window.QPI_METHODOLOGY;


const rankingsView =
    document.getElementById("rankings-view");

const playerView =
    document.getElementById("player-view");

const methodologyView =
    document.getElementById("methodology-view");

const tbody =
    document.querySelector(
        "#leaderboard tbody"
    );

const search =
    document.getElementById("search");


function formatMetric(
    value,
    digits=1
) {

    if (
        value === null ||
        value === undefined ||
        Number.isNaN(Number(value))
    ) {
        return "—";
    }

    return Number(value)
        .toFixed(digits);
}


function logoHTML(
    player,
    className="team-logo"
) {

    if (!player.team_logo) {
        return "";
    }

    return `
        <img
            src="${player.team_logo}"
            class="${className}"
            alt="${player.team} logo"
        >
    `;
}


function headshotHTML(
    player,
    className="player-headshot"
) {

    if (!player.headshot_url) {

        return player.team_logo
            ? `
                <img
                    src="${player.team_logo}"
                    class="${className} fallback-logo"
                    alt="${player.team}"
                >
              `
            : "";
    }


    const fallback =
        player.team_logo || "";


    return `
        <img
            src="${player.headshot_url}"
            class="${className}"
            alt="${player.player || player.name}"
            onerror="
                ${
                    fallback
                    ? `this.onerror=null;
                       this.src='${fallback}';
                       this.classList.add('fallback-logo');`
                    : `this.style.display='none';`
                }
            "
        >
    `;
}


function updatePageChrome() {

    document.title =
        "Percera — CQI Quarterback Rankings";


    const heroEyebrow =
        document.querySelector(
            "#rankings-view .hero .eyebrow"
        );

    if (heroEyebrow) {

        heroEyebrow.textContent =
            `CQI v${leaderboardData.cqi_version} · ` +
            `${leaderboardData.season} THROUGH WEEK ` +
            `${leaderboardData.through_week}`;
    }


    const heroTitle =
        document.querySelector(
            "#rankings-view .hero h2"
        );

    if (heroTitle) {

        heroTitle.textContent =
            "Contextual Quarterback Index";
    }


    const heroParagraph =
        document.querySelector(
            "#rankings-view .hero p"
        );

    if (heroParagraph) {

        heroParagraph.textContent =
            "Quarterback performance through the traits " +
            "that historically carried forward.";
    }


    const tableHeader =
        document.querySelector(
            "#leaderboard thead tr"
        );

    if (tableHeader) {

        tableHeader.innerHTML = `
            <th>Rank</th>
            <th>Quarterback</th>
            <th>Team</th>
            <th>CQI</th>
            <th>Pass Eff.</th>
            <th>Sack Avoid.</th>
            <th>Rushing</th>
            <th>Sample</th>
        `;
    }
}


function renderTopThree() {

    const container =
        document.getElementById(
            "top-three"
        );

    if (!container) return;


    const leaders =
        leaderboardData
        .quarterbacks
        .slice(0, 3);


    container.innerHTML =
        leaders.map(
            player => `

            <article
                class="leader-card"
                data-slug="${player.slug}"
                style="
                    --team-color:
                    ${player.team_color || "#174ea6"};
                "
            >

                <div class="leader-visual">

                    ${headshotHTML(
                        player,
                        "leader-headshot"
                    )}

                </div>


                <div class="leader-info">

                    <div class="leader-card-rank">
                        ${player.rank}
                    </div>

                    <div class="label">
                        CQI #${player.rank}
                    </div>


                    <div class="leader-team-row">

                        ${logoHTML(
                            player,
                            "leader-team-logo"
                        )}

                        <span>
                            ${player.team}
                        </span>

                    </div>


                    <h3>
                        ${player.player}
                    </h3>


                    <div class="leader-card-score">

                        <strong>
                            ${formatMetric(
                                player.cqi
                            )}
                        </strong>

                        <span>
                            CQI
                        </span>

                    </div>

                </div>

            </article>

        `).join("");


    container
        .querySelectorAll(
            ".leader-card"
        )
        .forEach(
            card => {

                card.addEventListener(
                    "click",
                    () => showPlayer(
                        card.dataset.slug
                    )
                );

            }
        );
}


function renderLeaderboard(
    players
) {

    tbody.innerHTML = "";


    players.forEach(
        player => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    <span class="rank-number">
                        ${player.rank}
                    </span>
                </td>


                <td class="qb-cell">

                    <span class="qb-name">
                        ${player.player}
                    </span>

                    ${
                        player.sample_flag
                        ? `
                            <span class="sample-warning">
                                ${player.sample_flag}
                            </span>
                          `
                        : ""
                    }

                </td>


                <td class="team-cell">

                    <div class="team-table-wrap">

                        ${logoHTML(
                            player,
                            "table-team-logo"
                        )}

                        <span>
                            ${player.team}
                        </span>

                    </div>

                </td>


                <td class="qpi-score">
                    ${formatMetric(
                        player.cqi
                    )}
                </td>


                <td class="metric-number">
                    ${formatMetric(
                        player.efficiency_percentile
                    )}
                </td>


                <td class="metric-number">
                    ${formatMetric(
                        player.sack_percentile
                    )}
                </td>


                <td class="metric-number">
                    ${formatMetric(
                        player.rushing_percentile
                    )}
                </td>


                <td class="sample-text">
                    ${player.sample}
                </td>

            `;


            row.addEventListener(
                "click",
                () => showPlayer(
                    player.slug
                )
            );


            tbody.appendChild(
                row
            );
        }
    );
}


function componentCard(
    component
) {

    const pct =
        component.percentile !== null
        && component.percentile !== undefined

        ? Number(
            component.percentile
        )

        : 0;


    return `

        <div class="cqi-component-card">

            <div class="component-title-row">

                <span>
                    ${component.name}
                </span>

                <strong>
                    ${component.weight}%
                </strong>

            </div>


            <div class="component-percentile">

                ${formatMetric(
                    component.percentile
                )}

                <small>
                    HISTORICAL PERCENTILE
                </small>

            </div>


            <div class="component-bar">

                <div
                    class="component-bar-fill"
                    style="
                        width:${Math.max(
                            0,
                            Math.min(
                                pct,
                                100
                            )
                        )}%;
                    "
                ></div>

            </div>


            <div class="component-raw">
                ${component.raw_label}
            </div>

        </div>

    `;
}


function showPlayer(
    slug
) {

    const player =
        playerData[slug];

    if (!player) return;


    rankingsView
        .classList
        .add("hidden");

    methodologyView
        .classList
        .add("hidden");

    playerView
        .classList
        .remove("hidden");


    const efficiency =
        player.components.efficiency;

    const sacks =
        player.components.sack_avoidance;

    const rushing =
        player.components.rushing;


    document
        .getElementById(
            "player-content"
        )
        .innerHTML = `

        <div
            class="player-profile-hero"
            style="
                --team-color:
                ${player.team_color || "#174ea6"};
            "
        >

            <div class="profile-image-wrap">

                ${headshotHTML(
                    player,
                    "profile-headshot"
                )}

            </div>


            <div class="player-header">

                <span class="eyebrow">
                    CQI v1.1 · 2026 · THROUGH WEEK 3
                </span>


                <div class="profile-team-row">

                    ${
                        player.team_logo
                        ? `
                            <img
                                src="${player.team_logo}"
                                class="profile-team-logo"
                                alt="${player.team}"
                            >
                          `
                        : ""
                    }

                    <span>
                        ${player.team}
                    </span>

                </div>


                <h2>
                    ${player.name}
                </h2>


                <p>
                    CQI rank #${player.rank}
                    · ${player.sample}
                    ${
                        player.sample_flag
                        ? `· ${player.sample_flag}`
                        : ""
                    }
                </p>

            </div>

        </div>


        <div class="score-row cqi-score-row">

            <div class="score-card cqi-main-score">

                <span>
                    CQI
                </span>

                <strong>
                    ${formatMetric(
                        player.cqi
                    )}
                </strong>

            </div>


            <div class="score-card">

                <span>
                    PASSING EFFICIENCY
                </span>

                <strong>
                    ${formatMetric(
                        efficiency.percentile
                    )}
                </strong>

            </div>


            <div class="score-card">

                <span>
                    SACK AVOIDANCE
                </span>

                <strong>
                    ${formatMetric(
                        sacks.percentile
                    )}
                </strong>

            </div>


            <div class="score-card">

                <span>
                    RUSHING
                </span>

                <strong>
                    ${formatMetric(
                        rushing.percentile
                    )}
                </strong>

            </div>

        </div>


        <section class="player-explainer">

            <div class="explainer-kicker">
                WHY CQI RANKS HIM HERE
            </div>

            <div class="player-profile-label">
                ${player.profile_label || ""}
            </div>

            <p>
                ${player.why_cqi}
            </p>

        </section>


        <section class="player-component-section">

            <div class="section-heading-row">

                <div>

                    <span class="eyebrow">
                        CQI PROFILE
                    </span>

                    <h3>
                        Three dimensions.
                    </h3>

                </div>

                <p>
                    Each component is compared with the
                    historical CQI reference population.
                </p>

            </div>


            <div class="cqi-component-grid">

                ${componentCard(
                    efficiency
                )}

                ${componentCard(
                    sacks
                )}

                ${componentCard(
                    rushing
                )}

            </div>

        </section>

    `;


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function renderMethodology() {

    const m =
        methodologyData;


    methodologyView.innerHTML = `

        <span class="eyebrow">
            CQI v${m.version}
        </span>


        <h2>
            How CQI Works
        </h2>


        <p class="method-intro">
            ${m.purpose}
        </p>


        <div class="method-section">

            <h3>
                The formula
            </h3>


            <p>
                CQI v1.1 uses three components selected
                through historical forward testing.
            </p>


            <div class="method-pill-grid">

                <div class="method-pill">

                    <strong>
                        PASSING EFFICIENCY
                        <span class="formula-weight">
                            40%
                        </span>
                    </strong>

                    <span>
                        ${
                            m.components
                            .passing_efficiency
                            .description
                        }
                    </span>

                </div>


                <div class="method-pill">

                    <strong>
                        SACK AVOIDANCE
                        <span class="formula-weight">
                            35%
                        </span>
                    </strong>

                    <span>
                        ${
                            m.components
                            .sack_avoidance
                            .description
                        }
                    </span>

                </div>


                <div class="method-pill">

                    <strong>
                        RUSHING
                        <span class="formula-weight">
                            25%
                        </span>
                    </strong>

                    <span>
                        ${
                            m.components
                            .rushing
                            .description
                        }
                    </span>

                </div>

            </div>

        </div>


        <div class="method-section">

            <h3>
                What the CQI number means
            </h3>

            <p>
                ${m.score_scale}
            </p>

        </div>


        <div class="method-section">

            <h3>
                Validation
            </h3>

            <p>
                CQI was built to test whether a quarterback's
                current performance profile contained
                information about how he performed next.
            </p>


            <div class="validation-grid">

                <div class="validation-card">

                    <span>
                        DEVELOPMENT
                    </span>

                    <strong>
                        ${Number(
                            m.validation
                            .development_average_spearman
                        ).toFixed(3)}
                    </strong>

                    <p>
                        Average forward rank correlation
                        across the 2023–25 development seasons.
                    </p>

                </div>


                <div class="validation-card featured">

                    <span>
                        UNTOUCHED 2022
                    </span>

                    <strong>
                        ${Number(
                            m.validation
                            .untouched_2022_spearman
                        ).toFixed(3)}
                    </strong>

                    <p>
                        Frozen v1.1 performance on the
                        season held out from model selection.
                    </p>

                </div>


                <div class="validation-card">

                    <span>
                        V1.0 — SAME HOLDOUT
                    </span>

                    <strong>
                        ${Number(
                            m.validation
                            .v1_2022_spearman
                        ).toFixed(3)}
                    </strong>

                    <p>
                        CQI v1.0 on the same untouched
                        2022 evaluation.
                    </p>

                </div>

            </div>


            <p class="validation-note">
                ${m.validation.holdout_note}
            </p>

        </div>


        <div class="method-section">

            <h3>
                Qualification
            </h3>

            <p>
                Quarterbacks qualify beginning after Week 3
                with at least
                <strong>
                    ${m.qualification.minimum_attempts}
                    season passing attempts
                </strong>
                and
                <strong>
                    ${m.qualification.minimum_context_games}
                    CQI context games
                </strong>.
                ${m.qualification.limited_sample}
            </p>

        </div>


        <details class="technical-methodology">

            <summary>
                Technical notes & limitations
            </summary>


            <div class="technical-content">

                <h3>
                    Passing efficiency
                </h3>

                <p>
                    A two-way quarterback/pass-defense
                    ridge model is used to estimate
                    network-adjusted yards per attempt.
                    The frozen ridge penalty is α = 50.
                </p>


                <h3>
                    Sack avoidance
                </h3>

                <p>
                    Sack tendency is estimated with a
                    quarterback/defense logistic model.
                    The frozen regularization parameter
                    is C = 0.01.
                </p>


                <h3>
                    Public scale
                </h3>

                <p>
                    Current internal CQI scores are compared
                    with pooled qualifying historical
                    quarterback snapshots from 2023–25.
                    This keeps the public 0–100 scale anchored
                    across weeks rather than simply ranking
                    the current population.
                </p>


                <h3>
                    Limitations
                </h3>

                <ul class="technical-list">

                    ${m.limitations.map(
                        item => `
                            <li>${item}</li>
                        `
                    ).join("")}

                </ul>

            </div>

        </details>

    `;
}


if (search) {

    search.addEventListener(
        "input",
        event => {

            const query =
                event.target
                .value
                .toLowerCase();


            const filtered =
                leaderboardData
                .quarterbacks
                .filter(
                    player =>
                        player.player
                        .toLowerCase()
                        .includes(query)

                        ||

                        player.team
                        .toLowerCase()
                        .includes(query)
                );


            renderLeaderboard(
                filtered
            );
        }
    );
}


const backButton =
    document.getElementById(
        "back-button"
    );


if (backButton) {

    backButton.addEventListener(
        "click",
        () => {

            playerView
                .classList
                .add("hidden");

            methodologyView
                .classList
                .add("hidden");

            rankingsView
                .classList
                .remove("hidden");


            document
                .querySelectorAll(
                    ".nav-button"
                )
                .forEach(
                    button =>
                        button
                        .classList
                        .toggle(
                            "active",
                            button.dataset.view
                            === "rankings"
                        )
                );

        }
    );
}


document
    .querySelectorAll(
        ".nav-button"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".nav-button"
                        )
                        .forEach(
                            b =>
                                b.classList
                                .remove("active")
                        );


                    button
                        .classList
                        .add("active");


                    rankingsView
                        .classList
                        .add("hidden");

                    playerView
                        .classList
                        .add("hidden");

                    methodologyView
                        .classList
                        .add("hidden");


                    if (
                        button.dataset.view
                        === "rankings"
                    ) {

                        rankingsView
                            .classList
                            .remove("hidden");
                    }


                    if (
                        button.dataset.view
                        === "methodology"
                    ) {

                        methodologyView
                            .classList
                            .remove("hidden");
                    }


                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                }
            );

        }
    );


document
    .getElementById(
        "qb-count"
    )
    .textContent =
        leaderboardData
        .quarterbacks
        .length;


updatePageChrome();

renderMethodology();

renderTopThree();

renderLeaderboard(
    leaderboardData.quarterbacks
);
