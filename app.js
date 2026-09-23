
const leaderboardData = window.QPI_LEADERBOARD;
const playerData = window.QPI_PLAYERS;

const rankingsView =
    document.getElementById("rankings-view");

const playerView =
    document.getElementById("player-view");

const methodologyView =
    document.getElementById("methodology-view");

const tbody =
    document.querySelector("#leaderboard tbody");

const search =
    document.getElementById("search");


function formatMetric(value) {

    if (
        value === null
        || value === undefined
    ) {
        return "—";
    }

    return Number(value).toFixed(1);
}


function logoHTML(player, className="team-logo") {

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


function headshotHTML(player, className="player-headshot") {

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
        player.team_logo
        ? player.team_logo
        : "";


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


function renderTopThree() {

    const container =
        document.getElementById("top-three");

    if (!container) return;


    const leaders =
        leaderboardData.quarterbacks.slice(
            0,
            3
        );


    container.innerHTML =
        leaders.map(player => `

            <article
                class="leader-card"
                data-slug="${player.slug}"
                style="
                    --team-color:
                    ${player.team_color || "#2563eb"};
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
                            ${formatMetric(player.qpi)}
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
        .forEach(card => {

            card.addEventListener(
                "click",
                () => {
                    showPlayer(
                        card.dataset.slug
                    );
                }
            );

        });
}


function renderLeaderboard(players) {

    tbody.innerHTML = "";

    players.forEach(player => {

        const row =
            document.createElement("tr");


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
                    ? `<span class="sample-warning">
                        ${player.sample_flag}
                       </span>`
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
                ${formatMetric(player.qpi)}
            </td>


            <td class="metric-number">
                ${formatMetric(player.passing)}
            </td>


            <td class="metric-number">
                ${formatMetric(player.rushing)}
            </td>


            <td class="sample-text">
                ${player.sample}
            </td>

        `;


        row.addEventListener(
            "click",
            () => showPlayer(player.slug)
        );


        tbody.appendChild(row);
    });
}


function showPlayer(slug) {

    const player =
        playerData[slug];

    if (!player) return;


    rankingsView.classList.add(
        "hidden"
    );

    methodologyView.classList.add(
        "hidden"
    );

    playerView.classList.remove(
        "hidden"
    );


    const components = [

        [
            "Efficiency",
            player.components.efficiency
        ],

        [
            "Success",
            player.components.success
        ],

        [
            "TD Creation",
            player.components.td_creation
        ],

        [
            "Sack Avoidance",
            player.components.sack_avoidance
        ],

        [
            "INT Avoidance",
            player.components.int_avoidance
        ],

        [
            "Rushing",
            player.rushing
        ]

    ];


    document.getElementById(
        "player-content"
    ).innerHTML = `

        <div
            class="player-profile-hero"
            style="
                --team-color:
                ${player.team_color || "#2563eb"};
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
                    2026 · Through Week 3
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
                    · ${player.sample.full_attempts} attempts
                    · ${player.sample.context_games} CQI games

                    ${
                        player.sample.flag
                        ? `· ${player.sample.flag}`
                        : ""
                    }
                </p>

            </div>

        </div>


        <div class="score-row">

            <div class="score-card">

                <span>
                    CQI
                </span>

                <strong>
                    ${formatMetric(player.qpi)}
                </strong>

            </div>


            <div class="score-card">

                <span>
                    Passing
                </span>

                <strong>
                    ${formatMetric(player.passing)}
                </strong>

            </div>


            <div class="score-card">

                <span>
                    Rushing
                </span>

                <strong>
                    ${formatMetric(player.rushing)}
                </strong>

            </div>

        </div>


        <div class="component-grid">

            ${components.map(
                ([label, value]) => `

                <div class="component">

                    <div class="component-head">

                        <span>
                            ${label}
                        </span>

                        <strong>
                            ${formatMetric(value)}
                        </strong>

                    </div>

                    <div class="bar">

                        <div
                            class="bar-fill"
                            style="
                                width:${
                                    value !== null
                                    && value !== undefined

                                    ? Math.min(
                                        Number(value),
                                        100
                                      )

                                    : 0
                                }%
                            "
                        ></div>

                    </div>

                </div>

            `).join("")}

        </div>
    `;
}


search.addEventListener(
    "input",
    event => {

        const query =
            event.target.value
            .toLowerCase();

        const filtered =
            leaderboardData.quarterbacks
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


document
    .getElementById(
        "back-button"
    )
    .addEventListener(
        "click",
        () => {

            playerView.classList.add(
                "hidden"
            );

            methodologyView.classList.add(
                "hidden"
            );

            rankingsView.classList.remove(
                "hidden"
            );

        }
    );


document
    .querySelectorAll(
        ".nav-button"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".nav-button"
                    )
                    .forEach(
                        b =>
                            b.classList.remove(
                                "active"
                            )
                    );


                button.classList.add(
                    "active"
                );


                rankingsView.classList.add(
                    "hidden"
                );

                playerView.classList.add(
                    "hidden"
                );

                methodologyView.classList.add(
                    "hidden"
                );


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

            }
        );

    });


document
    .getElementById(
        "qb-count"
    )
    .textContent =
        leaderboardData
        .quarterbacks
        .length;


renderTopThree();

renderLeaderboard(
    leaderboardData.quarterbacks
);
