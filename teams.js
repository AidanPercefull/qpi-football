
/* ==========================================================
   PERCERA TEAMS PRODUCT
   ========================================================== */

(() => {

    const teams =
        window.PERCERA_TEAM_PAGES
        ||
        {};


    const leaderboard =
        (
            window.CQI_LEADERBOARD
            ||
            window.QPI_LEADERBOARD
            ||
            {}
        ).quarterbacks
        ||
        [];



    // -------------------------------------------------------
    // CTSI — CONTEXTUAL TEAM STRENGTH INDEX
    // -------------------------------------------------------

    const ctsiRows =
        Array.isArray(
            window.PERCERA_CTSI
        )
            ? window.PERCERA_CTSI
            : [];


    const ctsiByTeam =
        new Map(
            ctsiRows.map(
                row => [
                    String(
                        row.team || ""
                    ).trim(),
                    row
                ]
            )
        );


    let teamSortKey =
        "team";


    let teamSortDirection =
        "asc";


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


    const homeView =
        document.getElementById(
            "home-view"
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
    ) {

        console.warn(
            "Percera teams prototype could not initialize."
        );

        return;
    }


    // -------------------------------------------------------
    // HELPERS
    // -------------------------------------------------------

    function clean(
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


    function score(
        player
    ) {

        const value =
            player
            ?
            (
                player.cqi
                ??
                player.qpi
            )
            :
            null;


        const n =
            Number(
                value
            );


        return Number.isFinite(n)
            ? n.toFixed(1)
            : "—";
    }


    // -------------------------------------------------------
    // HIGHEST-RANKED QUALIFYING CQI QB BY TEAM
    // -------------------------------------------------------

    const topQBByTeam =
        {};


    leaderboard.forEach(
        player => {

            const team =
                player.team;


            if (!team) {
                return;
            }


            if (
                !topQBByTeam[team]
                ||
                Number(player.rank)
                <
                Number(
                    topQBByTeam[team].rank
                )
            ) {

                topQBByTeam[
                    team
                ] = player;
            }
        }
    );


    // -------------------------------------------------------
    // CONFERENCES
    // -------------------------------------------------------

    const conferences =
        Array.from(
            new Set(
                Object
                    .values(
                        teams
                    )
                    .map(
                        team =>
                            team.conference
                    )
                    .filter(Boolean)
            )
        )
        .sort();


    // -------------------------------------------------------
    // CREATE TEAMS NAV BUTTON
    // -------------------------------------------------------

    document
        .querySelector(
            '[data-view="teams"]'
        )
        ?.remove();


    const teamsButton =
        document.createElement(
            "button"
        );


    teamsButton.className =
        "nav-button";


    teamsButton.dataset.view =
        "teams";


    teamsButton.textContent =
        "Teams";


    const methodologyButton =
        nav.querySelector(
            '[data-view="methodology"]'
        );


    if (methodologyButton) {

        nav.insertBefore(
            teamsButton,
            methodologyButton
        );

    } else {

        nav.appendChild(
            teamsButton
        );
    }


    // -------------------------------------------------------
    // CREATE TEAMS VIEW
    // -------------------------------------------------------

    document
        .getElementById(
            "teams-view"
        )
        ?.remove();


    const teamsView =
        document.createElement(
            "section"
        );


    teamsView.id =
        "teams-view";


    teamsView.className =
        "hidden";


    teamsView.innerHTML = `

        <div
            id="teams-directory"
        >

            <section
                class="teams-hero"
            >

                <div>

                    <span
                        class="teams-kicker"
                    >
                        2026 · Through Week 3
                    </span>

                    <h1>
                        Teams
                    </h1>

                    <p>
                        Team-level season context,
                        schedules and CQI quarterback
                        performance across the FBS.
                    </p>

                </div>


                <div
                    class="teams-count"
                >

                    <strong>
                        ${Object.keys(teams).length}
                    </strong>

                    <span>
                        FBS Teams
                    </span>

                </div>

            </section>


            <section
                class="teams-controls"
            >

                <input
                    id="teams-search"
                    type="text"
                    placeholder="Search team..."
                >


                <select
                    id="teams-conference"
                >

                    <option value="">
                        All Conferences
                    </option>

                    ${
                        conferences
                            .map(
                                conference => `
                                    <option
                                        value="${conference}"
                                    >
                                        ${conference}
                                    </option>
                                `
                            )
                            .join("")
                    }

                </select>

            </section>


            <div
                class="teams-table-wrap"
            >

                <table
                    class="teams-table"
                >

                    <thead>

                        <tr>

                            <th>
                                Team
                            </th>

                            <th>
                                Conference
                            </th>

                            <th>
                                Record
                            </th>

                            <th>
                                Next
                            </th>

                            <th>
                                Top CQI QB
                            </th>

                            <th>
                                CQI
                            </th>


                            <th
                                id="teams-ctsi-header"
                                class="teams-native-sortable"
                            >
                                <span class="teams-ctsi-heading">
                                    <span class="teams-ctsi-title">
                                        CTSI
                                    </span>

                                    <span class="teams-ctsi-subtitle">
                                        NEUTRAL FIELD
                                    </span>
                                </span>
                            </th>

                        </tr>

                    </thead>


                    <tbody
                        id="teams-table-body"
                    ></tbody>

                </table>

            </div>

        </div>


        <div
            id="team-detail"
            class="hidden"
        ></div>

    `;


    main.appendChild(
        teamsView
    );


    const directory =
        teamsView.querySelector(
            "#teams-directory"
        );


    const detail =
        teamsView.querySelector(
            "#team-detail"
        );


    const tbody =
        teamsView.querySelector(
            "#teams-table-body"
        );


    const searchInput =
        teamsView.querySelector(
            "#teams-search"
        );


    const conferenceSelect =
        teamsView.querySelector(
            "#teams-conference"
        );


    // -------------------------------------------------------
    // DIRECTORY DATA
    // -------------------------------------------------------

    const teamList =
        Object
            .values(
                teams
            )
            .sort(
                (a, b) =>
                    clean(
                        a.team
                    )
                    .localeCompare(
                        clean(
                            b.team
                        )
                    )
            );


    // -------------------------------------------------------
    // TEAM ROWS
    // -------------------------------------------------------


    // -------------------------------------------------------
    // CTSI DISPLAY
    // -------------------------------------------------------

    function signedCTSI(
        value
    ) {

        const number =
            Number(value);


        if (
            !Number.isFinite(
                number
            )
        ) {

            return "—";
        }


        return (
            number > 0
                ? "+"
                : ""
        )
        +
        number.toFixed(2);
    }


    function ctsiForTeam(
        teamName
    ) {

        return (
            ctsiByTeam.get(
                String(
                    teamName || ""
                ).trim()
            )
            ||
            null
        );
    }


    function ctsiCellHTML(
        teamName
    ) {

        const info =
            ctsiForTeam(
                teamName
            );


        if (!info) {

            return `
                <span class="teams-ctsi-empty">
                    —
                </span>
            `;
        }


        if (!info.eligible) {

            return `
                <span class="teams-ctsi-content">

                    <span class="teams-ctsi-value">
                        ${signedCTSI(
                            info.ctsi
                        )}
                    </span>

                    <span
                        class="teams-ctsi-provisional"
                        title="Provisional — fewer than two qualifying FBS games"
                    >
                        PROV.
                    </span>

                </span>
            `;
        }


        return `
            <span class="teams-ctsi-content">

                <span class="teams-ctsi-rank">
                    #${info.rank}
                </span>

                <span class="teams-ctsi-value">
                    ${signedCTSI(
                        info.ctsi
                    )}
                </span>

            </span>
        `;
    }


    // -------------------------------------------------------
    // NATIVE TEAM SORTING
    // -------------------------------------------------------

    function compareTeams(
        a,
        b
    ) {

        if (
            teamSortKey === "team"
        ) {

            const result =
                clean(
                    a.team
                )
                .localeCompare(
                    clean(
                        b.team
                    ),
                    undefined,
                    {
                        sensitivity:
                            "base",
                        numeric:
                            true
                    }
                );


            return (
                teamSortDirection
                ===
                "asc"
                    ? result
                    : -result
            );
        }


        if (
            teamSortKey === "ctsi"
        ) {

            const aInfo =
                ctsiForTeam(
                    a.team
                );

            const bInfo =
                ctsiForTeam(
                    b.team
                );


            const aValue =
                aInfo
                    ? Number(
                        aInfo.ctsi
                    )
                    : null;


            const bValue =
                bInfo
                    ? Number(
                        bInfo.ctsi
                    )
                    : null;


            // Missing ratings always appear last.

            if (
                aValue === null
                &&
                bValue === null
            ) {

                return clean(
                    a.team
                ).localeCompare(
                    clean(
                        b.team
                    )
                );
            }


            if (
                aValue === null
            ) {

                return 1;
            }


            if (
                bValue === null
            ) {

                return -1;
            }


            let result =
                aValue
                -
                bValue;


            if (
                result === 0
            ) {

                result =
                    clean(
                        a.team
                    )
                    .localeCompare(
                        clean(
                            b.team
                        )
                    );
            }


            return (
                teamSortDirection
                ===
                "asc"
                    ? result
                    : -result
            );
        }


        return 0;
    }


    function updateTeamSortIndicators() {

        const table =
            teamsView.querySelector(
                ".teams-table"
            );


        if (!table) {
            return;
        }


        const headers =
            Array.from(
                table.querySelectorAll(
                    "thead th"
                )
            );


        const teamHeader =
            headers[0];


        const ctsiHeader =
            teamsView.querySelector(
                "#teams-ctsi-header"
            );


        [
            teamHeader,
            ctsiHeader
        ]
        .forEach(
            header => {

                if (!header) {
                    return;
                }


                header.classList.remove(
                    "sort-active",
                    "sort-asc",
                    "sort-desc"
                );
            }
        );


        const activeHeader =
            teamSortKey === "team"
                ? teamHeader
                : ctsiHeader;


        if (!activeHeader) {
            return;
        }


        activeHeader.classList.add(
            "sort-active"
        );


        activeHeader.classList.add(
            teamSortDirection
            ===
            "asc"
                ? "sort-asc"
                : "sort-desc"
        );
    }


    function renderTeams() {

        const query =
            clean(
                searchInput.value
            )
            .toLowerCase();


        const conference =
            conferenceSelect.value;


        const filtered =
            teamList.filter(
                team => {

                    const matchesSearch =
                        !query
                        ||
                        clean(
                            team.team
                        )
                        .toLowerCase()
                        .includes(
                            query
                        );


                    const matchesConference =
                        !conference
                        ||
                        team.conference
                        ===
                        conference;


                    return (
                        matchesSearch
                        &&
                        matchesConference
                    );
                }
            );


        const ordered =
            [
                ...filtered
            ]
            .sort(
                compareTeams
            );


        tbody.innerHTML =
            ordered
            .map(
                team => {

                    const qb =
                        topQBByTeam[
                            team.team
                        ];


                    const next =
                        team.next_opponent
                        ?
                        `${
                            team.next_location
                            ||
                            ""
                        } ${
                            team.next_opponent
                        }`
                        .trim()
                        :
                        "—";


                    return `

                        <tr
                            class="team-directory-row"
                            data-team="${team.team}"
                        >

                            <td>

                                <div
                                    class="team-directory-name"
                                >

                                    ${
                                        team.logo
                                        ?
                                        `
                                            <img
                                                src="${team.logo}"
                                                alt="${team.team}"
                                            >
                                        `
                                        :
                                        ""
                                    }

                                    <strong>
                                        ${team.team}
                                    </strong>

                                </div>

                            </td>


                            <td>
                                ${team.conference || "—"}
                            </td>


                            <td
                                class="team-record-cell"
                            >
                                ${team.record || "—"}
                            </td>


                            <td>

                                <strong
                                    class="team-next-name"
                                >
                                    ${next}
                                </strong>

                                ${
                                    team.next_week
                                    ?
                                    `
                                        <span
                                            class="team-next-week"
                                        >
                                            Week ${team.next_week}
                                        </span>
                                    `
                                    :
                                    ""
                                }

                            </td>


                            <td>

                                ${
                                    qb
                                    ?
                                    `
                                        <strong>
                                            ${qb.player}
                                        </strong>

                                        <span
                                            class="team-qb-rank"
                                        >
                                            CQI #${qb.rank}
                                        </span>
                                    `
                                    :
                                    `<span class="teams-muted">—</span>`
                                }

                            </td>


                            <td
                                class="team-cqi-cell"
                            >

                                ${
                                    qb
                                    ?
                                    score(qb)
                                    :
                                    "—"
                                }

                            </td>

                        </tr>

                    `;
                }
            )
            .join("");


        // ---------------------------------------------------
        // CTSI CELLS
        // ---------------------------------------------------

        tbody
            .querySelectorAll(
                ".team-directory-row"
            )
            .forEach(
                row => {

                    const teamName =
                        row.dataset.team;


                    const cell =
                        document.createElement(
                            "td"
                        );


                    cell.className =
                        "teams-ctsi-cell";


                    cell.innerHTML =
                        ctsiCellHTML(
                            teamName
                        );


                    row.appendChild(
                        cell
                    );
                }
            );


        updateTeamSortIndicators();


        tbody
            .querySelectorAll(
                ".team-directory-row"
            )
            .forEach(
                row => {

                    row.addEventListener(
                        "click",
                        () => {

                            showTeam(
                                row.dataset.team
                            );
                        }
                    );
                }
            );
    }


    // -------------------------------------------------------
    // GAME ROW
    // -------------------------------------------------------

    function gameRow(
        game,
        completed
    ) {

        if (!game) {
            return "";
        }


        // ---------------------------------------------------
        // BYE WEEK
        // ---------------------------------------------------

        if (game.bye) {

            return `

                <div
                    class="
                        team-game-row
                        team-game-bye
                    "
                >

                    <span
                        class="team-game-week"
                    >
                        Week ${game.week}
                    </span>


                    <div
                        class="team-game-opponent"
                    >

                        <span
                            class="team-bye-mark"
                        >
                            BYE
                        </span>

                    </div>

                </div>

            `;
        }


        // ---------------------------------------------------
        // RESULT
        // ---------------------------------------------------

        let result = "";


        if (
            completed
            &&
            game.result
        ) {

            result = `

                <span
                    class="
                        team-game-result
                        ${
                            game.result === "W"
                            ?
                            "win"
                            :
                            (
                                game.result === "L"
                                ?
                                "loss"
                                :
                                ""
                            )
                        }
                    "
                >
                    ${game.result}
                </span>

            `;
        }


        const scoreText =
            (
                completed
                &&
                game.team_score !== null
                &&
                game.opponent_score !== null
            )
            ?
            `
                ${game.team_score}
                –
                ${game.opponent_score}
            `
            :
            "";


        return `

            <div
                class="team-game-row"
            >

                <span
                    class="team-game-week"
                >
                    Week ${game.week}
                </span>


                <div
                    class="team-game-opponent"
                >

                    ${result}


                    ${
                        game.opponent_logo
                        ?
                        `
                            <img
                                src="${game.opponent_logo}"
                                alt="${game.opponent}"
                                class="team-opponent-logo"
                            >
                        `
                        :
                        ""
                    }


                    <strong>
                        ${game.location}
                        ${game.opponent}
                    </strong>

                </div>


                ${
                    scoreText
                    ?
                    `
                        <strong
                            class="team-game-score"
                        >
                            ${scoreText}
                        </strong>
                    `
                    :
                    ""
                }

            </div>

        `;
    }


    // -------------------------------------------------------
    // TEAM DETAIL
    // -------------------------------------------------------

    function showTeam(
        teamName
    ) {

        const team =
            teams[
                teamName
            ];


        if (!team) {
            return;
        }


        const qb =
            topQBByTeam[
                teamName
            ];


        directory
            .classList
            .add(
                "hidden"
            );


        detail
            .classList
            .remove(
                "hidden"
            );


        detail.style.setProperty(
            "--team-detail-color",
            team.color
            ||
            "#174A9C"
        );


        const next =
            team.next_opponent
            ?
            `${
                team.next_location
                ||
                ""
            } ${
                team.next_opponent
            }`
            .trim()
            :
            "—";


        const nextOpponentLogo =
            (
                team.next_opponent
                &&
                teams[
                    team.next_opponent
                ]
            )
            ?
            teams[
                team.next_opponent
            ].logo
            :
            null;




        // PERCERA_SECONDARY_WATERMARK_V1


        const watermarkLogo =


            (


                window.PERCERA_SECONDARY_LOGOS


                &&


                window.PERCERA_SECONDARY_LOGOS[


                    teamName


                ]


            )


            ||


            team.logo


            ||


            null;



        detail.innerHTML = `

            <button
                type="button"
                class="team-back-button"
                id="team-back-button"
            >
                ← All teams
            </button>


            <section
                class="team-detail-hero"
            >

                ${
                    watermarkLogo
                    ?
                    `
                        <img
                            src="${watermarkLogo}"
                            alt=""
                            aria-hidden="true"
                            class="team-detail-watermark"
                            onload="
                                const ratio =
                                    this.naturalWidth /
                                    this.naturalHeight;

                                if (ratio >= 2.2) {
                                    this.classList.add(
                                        'watermark-wide'
                                    );
                                } else if (ratio <= 0.72) {
                                    this.classList.add(
                                        'watermark-tall'
                                    );
                                } else {
                                    this.classList.add(
                                        'watermark-compact'
                                    );
                                }
                            "
                        >
                    `
                    :
                    ""
                }



                <div
                    class="team-detail-brand"
                >

                    ${
                        team.logo
                        ?
                        `
                            <img
                                src="${team.logo}"
                                alt="${teamName}"
                            >
                        `
                        :
                        ""
                    }


                    <div>

                        <span>
                            ${team.conference || ""}
                        </span>

                        <h1>
                            ${teamName}
                        </h1>

                    </div>

                </div>


                <div
                    class="team-detail-facts"
                >

                    <article>

                        <span>
                            Record
                        </span>

                        <strong>
                            ${team.record || "—"}
                        </strong>

                    </article>


                    <article>

                        <span>
                            Next Opponent
                        </span>


                        <div
                            class="team-hero-next"
                        >

                            ${
                                nextOpponentLogo
                                ?
                                `
                                    <img
                                        src="${nextOpponentLogo}"
                                        alt="${team.next_opponent}"
                                        class="team-hero-next-logo"
                                    >
                                `
                                :
                                ""
                            }


                            <div>

                                <strong>
                                    ${next}
                                </strong>

                                ${
                                    team.next_week
                                    ?
                                    `
                                        <small>
                                            Week ${team.next_week}
                                        </small>
                                    `
                                    :
                                    ""
                                }

                            </div>

                        </div>

                    </article>

                </div>

            </section>


            <section
                class="team-detail-section"
            >

                <div
                    class="team-detail-heading"
                >

                    <span>
                        Quarterback
                    </span>

                    <h2>
                        CQI at ${teamName}
                    </h2>

                </div>


                ${
                    qb
                    ?
                    `

                        <article
                            class="team-qb-feature"
                        >

                            <div
                                class="team-qb-info"
                            >

                                ${
                                    qb.headshot_url
                                    ?
                                    `
                                        <div
                                            class="team-qb-image"
                                        >

                                            <img
                                                src="${qb.headshot_url}"
                                                alt="${qb.player}"
                                                ${
                                                    qb.team_logo
                                                    ?
                                                    `
                                                    onerror="
                                                        this.onerror=null;
                                                        this.src='${qb.team_logo}';
                                                        this.classList.add(
                                                            'fallback'
                                                        );
                                                    "
                                                    `
                                                    :
                                                    ""
                                                }
                                            >

                                        </div>
                                    `
                                    :
                                    ""
                                }


                                <div>

                                    <span
                                        class="team-qb-label"
                                    >
                                        Highest-ranked qualifying QB
                                    </span>

                                    <h3>
                                        ${qb.player}
                                    </h3>

                                    <p>
                                        CQI #${qb.rank}
                                    </p>

                                </div>

                            </div>


                            <div
                                class="team-qb-score"
                            >

                                <strong>
                                    ${score(qb)}
                                </strong>

                                <span>
                                    CQI
                                </span>

                            </div>


                            <button
                                type="button"
                                class="team-qb-profile-button"
                                id="team-qb-profile-button"
                            >
                                View QB Profile
                            </button>

                        </article>

                    `
                    :
                    `

                        <div
                            class="team-no-qb"
                        >
                            No quarterback currently meets
                            CQI publication eligibility.
                        </div>

                    `
                }

            </section>


            <section
                class="team-detail-section"
            >

                <div
                    class="team-detail-heading"
                >

                    <span>
                        2026 Season
                    </span>

                    <h2>
                        Schedule
                    </h2>

                </div>


                <div
                    class="team-schedule-grid"
                >

                    <article
                        class="team-schedule-card"
                    >

                        <h3>
                            Results
                        </h3>

                        ${
                            team.results
                            &&
                            team.results.length
                            ?
                            team.results
                                .map(
                                    game =>
                                        gameRow(
                                            game,
                                            true
                                        )
                                )
                                .join("")
                            :
                            `
                                <p
                                    class="teams-muted"
                                >
                                    No completed games.
                                </p>
                            `
                        }

                    </article>


                    <article
                        class="team-schedule-card"
                    >

                        <h3>
                            Up Next
                        </h3>

                        ${
                            team.upcoming
                            &&
                            team.upcoming.length
                            ?
                            team.upcoming
                                .map(
                                    game =>
                                        gameRow(
                                            game,
                                            false
                                        )
                                )
                                .join("")
                            :
                            `
                                <p
                                    class="teams-muted"
                                >
                                    No upcoming games found.
                                </p>
                            `
                        }

                    </article>

                </div>

            </section>

        `;


        detail
            .querySelector(
                "#team-back-button"
            )
            ?.addEventListener(
                "click",
                () => {

                    detail
                        .classList
                        .add(
                            "hidden"
                        );


                    directory
                        .classList
                        .remove(
                            "hidden"
                        );


                    window.scrollTo(
                        {
                            top: 0,
                            behavior: "instant"
                        }
                    );
                }
            );


        detail
            .querySelector(
                "#team-qb-profile-button"
            )
            ?.addEventListener(
                "click",
                () => {

                    if (
                        !qb
                        ||
                        !qb.slug
                        ||
                        typeof window.showPlayer
                        !==
                        "function"
                    ) {

                        return;
                    }


                    teamsView
                        .classList
                        .add(
                            "hidden"
                        );


                    setActiveNav(
                        "rankings"
                    );


                    window.showPlayer(
                        qb.slug
                    );
                }
            );


        window.scrollTo(
            {
                top: 0,
                behavior: "instant"
            }
        );
    }


    // -------------------------------------------------------
    // VIEW MANAGEMENT
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


    function showTeams() {

        if (homeView) {

            homeView
                .classList
                .add(
                    "hidden"
                );
        }


        if (rankingsView) {

            rankingsView
                .classList
                .add(
                    "hidden"
                );
        }


        if (playerView) {

            playerView
                .classList
                .add(
                    "hidden"
                );
        }


        if (methodologyView) {

            methodologyView
                .classList
                .add(
                    "hidden"
                );
        }


        teamsView
            .classList
            .remove(
                "hidden"
            );


        directory
            .classList
            .remove(
                "hidden"
            );


        detail
            .classList
            .add(
                "hidden"
            );


        setActiveNav(
            "teams"
        );


        window.scrollTo(
            {
                top: 0,
                behavior: "instant"
            }
        );
    }


    teamsButton.addEventListener(
        "click",
        showTeams
    );


    // Hide Teams whenever another top-nav item is selected.
    document
        .querySelectorAll(
            ".nav-button"
        )
        .forEach(
            button => {

                if (
                    button.dataset.view
                    ===
                    "teams"
                ) {

                    return;
                }


                button.addEventListener(
                    "click",
                    () => {

                        teamsView
                            .classList
                            .add(
                                "hidden"
                            );
                    }
                );
            }
        );


    // -------------------------------------------------------
    // TEAM DIRECTORY SORTING
    // -------------------------------------------------------

    const teamHeader =
        teamsView.querySelector(
            ".teams-table thead th:first-child"
        );


    const ctsiHeader =
        teamsView.querySelector(
            "#teams-ctsi-header"
        );


    if (teamHeader) {

        teamHeader.classList.add(
            "teams-native-sortable"
        );


        teamHeader.addEventListener(
            "click",
            () => {

                if (
                    teamSortKey
                    ===
                    "team"
                ) {

                    teamSortDirection =
                        teamSortDirection
                        ===
                        "asc"
                            ? "desc"
                            : "asc";

                } else {

                    teamSortKey =
                        "team";


                    teamSortDirection =
                        "asc";
                }


                renderTeams();
            }
        );
    }


    if (ctsiHeader) {

        ctsiHeader.addEventListener(
            "click",
            () => {

                if (
                    teamSortKey
                    ===
                    "ctsi"
                ) {

                    teamSortDirection =
                        teamSortDirection
                        ===
                        "desc"
                            ? "asc"
                            : "desc";

                } else {

                    teamSortKey =
                        "ctsi";


                    // First click:
                    // strongest → weakest.

                    teamSortDirection =
                        "desc";
                }


                renderTeams();
            }
        );
    }


    // -------------------------------------------------------
    // CONTROLS
    // -------------------------------------------------------

    searchInput.addEventListener(
        "input",
        renderTeams
    );


    conferenceSelect.addEventListener(
        "change",
        renderTeams
    );


    // -------------------------------------------------------
    // PUBLIC TEAM NAVIGATION
    //
    // Allows QB profile pages and other Percera surfaces
    // to navigate directly to a specific team page.
    // -------------------------------------------------------

    window.showPerceraTeam =
        function(teamName) {

            showTeams();

            showTeam(
                teamName
            );
        };


    // -------------------------------------------------------
    // INITIAL RENDER
    // -------------------------------------------------------

    renderTeams();

})();


/* ==========================================================
   END PERCERA TEAMS PRODUCT
   ========================================================== */
