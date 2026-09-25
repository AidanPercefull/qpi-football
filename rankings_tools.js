
/* ==========================================================
   PERCERA RANKINGS TOOLS
   ========================================================== */

(() => {

    // -------------------------------------------------------
    // DATA
    // -------------------------------------------------------

    const data =
        window.CQI_LEADERBOARD
        ||
        window.QPI_LEADERBOARD;


    if (
        !data
        ||
        !Array.isArray(
            data.quarterbacks
        )
    ) {

        console.warn(
            "Percera rankings tools: leaderboard data missing."
        );

        return;
    }


    const allPlayers = [
        ...data.quarterbacks
    ];


    const controlsHost =
        document.querySelector(
            ".controls"
        );


    const leaderboard =
        document.getElementById(
            "leaderboard"
        );


    if (
        !controlsHost
        ||
        !leaderboard
        ||
        typeof renderLeaderboard !== "function"
    ) {

        console.warn(
            "Percera rankings tools: required page elements missing."
        );

        return;
    }


    // -------------------------------------------------------
    // REMOVE OLD SEARCH LISTENER SAFELY
    //
    // Clone the current search box.
    // This preserves its design/ID but removes the old
    // app.js input listener so filters do not fight it.
    // -------------------------------------------------------

    const oldSearch =
        document.getElementById(
            "search"
        );


    let searchInput = null;


    if (oldSearch) {

        searchInput =
            oldSearch.cloneNode(
                true
            );


        oldSearch.replaceWith(
            searchInput
        );
    }


    // -------------------------------------------------------
    // HELPERS
    // -------------------------------------------------------

    function numericValue(
        player,
        keys
    ) {

        for (const key of keys) {

            const value =
                player[
                    key
                ];


            if (
                value !== null
                &&
                value !== undefined
                &&
                value !== ""
                &&
                !Number.isNaN(
                    Number(value)
                )
            ) {

                return Number(
                    value
                );
            }
        }


        return null;
    }


    function currentMovement(
        player
    ) {

        const weekly =
            window.CQI_WEEKLY_HISTORY;


        if (
            !weekly
            ||
            !weekly.weeks
            ||
            weekly.latest_week === null
            ||
            weekly.latest_week === undefined
        ) {

            return null;
        }


        const latest =
            weekly.weeks[
                String(
                    weekly.latest_week
                )
            ] || [];


        const record =
            latest.find(
                row =>
                    row.player === player.player
                    &&
                    row.team === player.team
            );


        if (
            !record
            ||
            record.rank_change === null
            ||
            record.rank_change === undefined
        ) {

            return null;
        }


        return Number(
            record.rank_change
        );
    }


    function sampleStatus(
        player
    ) {

        const flag =
            String(
                player.sample_flag
                || ""
            )
            .toLowerCase();


        if (
            flag.includes(
                "limited"
            )
        ) {

            return "limited";
        }


        return "established";
    }


    function playerCQI(
        player
    ) {

        return numericValue(
            player,
            [
                "cqi",
                "qpi",
                "CQI",
                "QPI"
            ]
        );
    }


    function playerPassing(
        player
    ) {

        return numericValue(
            player,
            [
                "passing",
                "Passing"
            ]
        );
    }


    function playerRushing(
        player
    ) {

        return numericValue(
            player,
            [
                "rushing",
                "Rushing"
            ]
        );
    }


    // -------------------------------------------------------
    // BUILD TOOLBAR
    // -------------------------------------------------------

    const toolbar =
        document.createElement(
            "div"
        );


    toolbar.className =
        "rankings-toolbar";


    const teams = [

        ...new Set(

            allPlayers
            .map(
                player =>
                    player.team
            )
            .filter(
                Boolean
            )

        )

    ].sort(
        (a, b) =>
            String(a)
            .localeCompare(
                String(b)
            )
    );


    const conferenceValues = [

        ...new Set(

            allPlayers
            .map(
                player =>
                    player.conference
                    ||
                    player.Conference
            )
            .filter(
                Boolean
            )

        )

    ].sort();


    toolbar.innerHTML = `

        <div class="ranking-filter-group">

            <label for="rankings-sort">
                Sort
            </label>

            <select id="rankings-sort">

                <option value="rank">
                    CQI Rank
                </option>

                <option value="cqi">
                    CQI Score
                </option>

                <option value="passing">
                    Passing
                </option>

                <option value="rushing">
                    Rushing
                </option>

                <option value="movement">
                    Rank Movement
                </option>

            </select>

        </div>


        <div class="ranking-filter-group">

            <label for="rankings-team">
                Team
            </label>

            <select id="rankings-team">

                <option value="">
                    All Teams
                </option>

                ${
                    teams
                    .map(
                        team => `
                            <option
                                value="${team}"
                            >
                                ${team}
                            </option>
                        `
                    )
                    .join("")
                }

            </select>

        </div>


        ${
            conferenceValues.length
            ?
            `

            <div class="ranking-filter-group">

                <label for="rankings-conference">
                    Conference
                </label>

                <select id="rankings-conference">

                    <option value="">
                        All Conferences
                    </option>

                    ${
                        conferenceValues
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

            </div>

            `
            :
            ""
        }


        <div class="ranking-filter-group">

            <label for="rankings-sample">
                Sample
            </label>

            <select id="rankings-sample">

                <option value="">
                    All Samples
                </option>

                <option value="established">
                    Established
                </option>

                <option value="limited">
                    Limited Sample
                </option>

            </select>

        </div>


        <div class="ranking-filter-group">

            <label for="rankings-limit">
                Show
            </label>

            <select id="rankings-limit">

                <option value="all">
                    All
                </option>

                <option value="10">
                    Top 10
                </option>

                <option value="25">
                    Top 25
                </option>

                <option value="50">
                    Top 50
                </option>

            </select>

        </div>


        <button
            type="button"
            id="rankings-reset"
            class="rankings-reset"
        >
            Reset
        </button>

    `;


    // Put filters directly below the existing search box.
    controlsHost.appendChild(
        toolbar
    );


    // -------------------------------------------------------
    // RESULT COUNT
    // -------------------------------------------------------

    const summary =
        document.createElement(
            "div"
        );


    summary.className =
        "rankings-summary";


    leaderboard
        .parentElement
        .insertBefore(
            summary,
            leaderboard
                .parentElement
                .firstChild
        );


    // -------------------------------------------------------
    // REFERENCES
    // -------------------------------------------------------

    const sortSelect =
        document.getElementById(
            "rankings-sort"
        );


    const teamSelect =
        document.getElementById(
            "rankings-team"
        );


    const conferenceSelect =
        document.getElementById(
            "rankings-conference"
        );


    const sampleSelect =
        document.getElementById(
            "rankings-sample"
        );


    const limitSelect =
        document.getElementById(
            "rankings-limit"
        );


    const resetButton =
        document.getElementById(
            "rankings-reset"
        );


    // -------------------------------------------------------
    // FILTER + SORT
    // -------------------------------------------------------

    function updateRankings() {

        const query =
            searchInput
            ?
            searchInput.value
                .trim()
                .toLowerCase()
            :
            "";


        const selectedTeam =
            teamSelect.value;


        const selectedConference =
            conferenceSelect
            ?
            conferenceSelect.value
            :
            "";


        const selectedSample =
            sampleSelect.value;


        const selectedSort =
            sortSelect.value;


        const selectedLimit =
            limitSelect.value;


        let players =
            allPlayers.filter(
                player => {

                    // Search
                    const searchMatch =
                        !query
                        ||
                        String(
                            player.player
                            || ""
                        )
                        .toLowerCase()
                        .includes(
                            query
                        )
                        ||
                        String(
                            player.team
                            || ""
                        )
                        .toLowerCase()
                        .includes(
                            query
                        );


                    // Team
                    const teamMatch =
                        !selectedTeam
                        ||
                        player.team
                        ===
                        selectedTeam;


                    // Conference
                    const playerConference =
                        player.conference
                        ||
                        player.Conference
                        ||
                        "";


                    const conferenceMatch =
                        !selectedConference
                        ||
                        playerConference
                        ===
                        selectedConference;


                    // Sample
                    const sampleMatch =
                        !selectedSample
                        ||
                        sampleStatus(
                            player
                        )
                        ===
                        selectedSample;


                    return (
                        searchMatch
                        &&
                        teamMatch
                        &&
                        conferenceMatch
                        &&
                        sampleMatch
                    );
                }
            );


        // ---------------------------------------------------
        // SORT
        // ---------------------------------------------------

        players.sort(
            (a, b) => {

                if (
                    selectedSort
                    ===
                    "cqi"
                ) {

                    return (
                        (
                            playerCQI(b)
                            ?? -Infinity
                        )
                        -
                        (
                            playerCQI(a)
                            ?? -Infinity
                        )
                    );
                }


                if (
                    selectedSort
                    ===
                    "passing"
                ) {

                    return (
                        (
                            playerPassing(b)
                            ?? -Infinity
                        )
                        -
                        (
                            playerPassing(a)
                            ?? -Infinity
                        )
                    );
                }


                if (
                    selectedSort
                    ===
                    "rushing"
                ) {

                    return (
                        (
                            playerRushing(b)
                            ?? -Infinity
                        )
                        -
                        (
                            playerRushing(a)
                            ?? -Infinity
                        )
                    );
                }


                if (
                    selectedSort
                    ===
                    "movement"
                ) {

                    return (
                        (
                            currentMovement(b)
                            ?? -Infinity
                        )
                        -
                        (
                            currentMovement(a)
                            ?? -Infinity
                        )
                    );
                }


                // Default:
                // official CQI rank.
                return (
                    Number(
                        a.rank
                    )
                    -
                    Number(
                        b.rank
                    )
                );
            }
        );


        // ---------------------------------------------------
        // LIMIT
        //
        // "Top 10" means official CQI Top 10,
        // not merely first 10 filtered rows.
        // ---------------------------------------------------

        if (
            selectedLimit
            !==
            "all"
        ) {

            const maxRank =
                Number(
                    selectedLimit
                );


            players =
                players.filter(
                    player =>
                        Number(
                            player.rank
                        )
                        <=
                        maxRank
                );
        }


        // ---------------------------------------------------
        // RENDER
        // ---------------------------------------------------

        renderLeaderboard(
            players
        );


        summary.innerHTML = `

            <strong>
                ${players.length}
            </strong>

            <span>
                ${
                    players.length === 1
                    ?
                    "quarterback shown"
                    :
                    "quarterbacks shown"
                }
            </span>

            ${
                players.length
                !==
                allPlayers.length
                ?
                `
                    <small>
                        of ${allPlayers.length}
                    </small>
                `
                :
                ""
            }

        `;
    }


    // -------------------------------------------------------
    // EVENTS
    // -------------------------------------------------------

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            updateRankings
        );
    }


    [
        sortSelect,
        teamSelect,
        conferenceSelect,
        sampleSelect,
        limitSelect

    ]
    .filter(
        Boolean
    )
    .forEach(
        element => {

            element.addEventListener(
                "change",
                updateRankings
            );
        }
    );


    resetButton.addEventListener(
        "click",
        () => {

            if (searchInput) {
                searchInput.value = "";
            }


            sortSelect.value =
                "rank";


            teamSelect.value =
                "";


            if (conferenceSelect) {
                conferenceSelect.value = "";
            }


            sampleSelect.value =
                "";


            limitSelect.value =
                "all";


            updateRankings();
        }
    );


    // -------------------------------------------------------
    // FIRST RENDER
    // -------------------------------------------------------

    updateRankings();

})();


/* ==========================================================
   END PERCERA RANKINGS TOOLS
   ========================================================== */
