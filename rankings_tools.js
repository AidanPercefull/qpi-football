
/* ==========================================================
   PERCERA CLEAN RANKINGS INTERACTIONS
   ========================================================== */

(() => {

    const conferenceMap =
        {"Air Force": "Mountain West", "Akron": "Mid-American", "Alabama": "SEC", "App State": "Sun Belt", "Arizona": "Big 12", "Arizona State": "Big 12", "Arkansas": "SEC", "Arkansas State": "Sun Belt", "Army": "American Athletic", "Auburn": "SEC", "Ball State": "Mid-American", "Baylor": "Big 12", "Boise State": "Pac-12", "Boston College": "ACC", "Bowling Green": "Mid-American", "Buffalo": "Mid-American", "BYU": "Big 12", "California": "ACC", "Central Michigan": "Mid-American", "Charlotte": "American Athletic", "Cincinnati": "Big 12", "Clemson": "ACC", "Coastal Carolina": "Sun Belt", "Colorado": "Big 12", "Colorado State": "Pac-12", "Delaware": "Conference USA", "Duke": "ACC", "East Carolina": "American Athletic", "Eastern Michigan": "Mid-American", "Florida": "SEC", "Florida Atlantic": "American Athletic", "Florida International": "Conference USA", "Florida State": "ACC", "Fresno State": "Pac-12", "Georgia": "SEC", "Georgia Southern": "Sun Belt", "Georgia State": "Sun Belt", "Georgia Tech": "ACC", "Hawai'i": "Mountain West", "Houston": "Big 12", "Illinois": "Big Ten", "Indiana": "Big Ten", "Iowa": "Big Ten", "Iowa State": "Big 12", "Jacksonville State": "Conference USA", "James Madison": "Sun Belt", "Kansas": "Big 12", "Kansas State": "Big 12", "Kennesaw State": "Conference USA", "Kent State": "Mid-American", "Kentucky": "SEC", "Liberty": "Conference USA", "Louisiana": "Sun Belt", "Louisiana Tech": "Sun Belt", "Louisville": "ACC", "LSU": "SEC", "Marshall": "Sun Belt", "Maryland": "Big Ten", "Massachusetts": "Mid-American", "Memphis": "American Athletic", "Miami": "ACC", "Miami (OH)": "Mid-American", "Michigan": "Big Ten", "Michigan State": "Big Ten", "Middle Tennessee": "Conference USA", "Minnesota": "Big Ten", "Mississippi State": "SEC", "Missouri": "SEC", "Missouri State": "Conference USA", "Navy": "American Athletic", "NC State": "ACC", "Nebraska": "Big Ten", "Nevada": "Mountain West", "New Mexico": "Mountain West", "New Mexico State": "Conference USA", "North Carolina": "ACC", "North Dakota State": "Mountain West", "Northern Illinois": "Mountain West", "North Texas": "American Athletic", "Northwestern": "Big Ten", "Notre Dame": "FBS Independents", "Ohio": "Mid-American", "Ohio State": "Big Ten", "Oklahoma": "SEC", "Oklahoma State": "Big 12", "Old Dominion": "Sun Belt", "Ole Miss": "SEC", "Oregon": "Big Ten", "Oregon State": "Pac-12", "Penn State": "Big Ten", "Pittsburgh": "ACC", "Purdue": "Big Ten", "Rice": "American Athletic", "Rutgers": "Big Ten", "Sacramento State": "Mid-American", "Sam Houston": "Conference USA", "San Diego State": "Pac-12", "San José State": "Mountain West", "SMU": "ACC", "South Alabama": "Sun Belt", "South Carolina": "SEC", "Southern Miss": "Sun Belt", "South Florida": "American Athletic", "Stanford": "ACC", "Syracuse": "ACC", "TCU": "Big 12", "Temple": "American Athletic", "Tennessee": "SEC", "Texas": "SEC", "Texas A&M": "SEC", "Texas State": "Pac-12", "Texas Tech": "Big 12", "Toledo": "Mid-American", "Troy": "Sun Belt", "Tulane": "American Athletic", "Tulsa": "American Athletic", "UAB": "American Athletic", "UCF": "Big 12", "UCLA": "Big Ten", "UConn": "FBS Independents", "UL Monroe": "Sun Belt", "UNLV": "Mountain West", "USC": "Big Ten", "Utah": "Big 12", "Utah State": "Pac-12", "UTEP": "Mountain West", "UTSA": "American Athletic", "Vanderbilt": "SEC", "Virginia": "ACC", "Virginia Tech": "ACC", "Wake Forest": "ACC", "Washington": "Big Ten", "Washington State": "Pac-12", "Western Kentucky": "Conference USA", "Western Michigan": "Mid-American", "West Virginia": "Big 12", "Wisconsin": "Big Ten", "Wyoming": "Mountain West"};


    const rankingsData =
        window.CQI_LEADERBOARD
        ||
        window.QPI_LEADERBOARD;


    const profiles =
        window.CQI_PLAYERS
        ||
        window.QPI_PLAYERS
        ||
        {};


    if (
        !rankingsData
        ||
        !Array.isArray(
            rankingsData.quarterbacks
        )
        ||
        typeof renderLeaderboard
            !== "function"
    ) {

        console.warn(
            "Percera rankings controls could not initialize."
        );

        return;
    }


    const allPlayers = [
        ...rankingsData.quarterbacks
    ];


    const table =
        document.getElementById(
            "leaderboard"
        );


    const oldSearch =
        document.getElementById(
            "search"
        );


    if (
        !table
        ||
        !oldSearch
    ) {
        return;
    }


    // -------------------------------------------------------
    // Replace search input with an identical clone.
    //
    // This removes the original standalone app.js listener
    // so search + conference + sorting all use one pipeline.
    // -------------------------------------------------------

    const searchInput =
        oldSearch.cloneNode(
            true
        );


    oldSearch.replaceWith(
        searchInput
    );


    // -------------------------------------------------------
    // STATE
    // -------------------------------------------------------

    let sortKey =
        "rank";


    let direction =
        "asc";


    // -------------------------------------------------------
    // VALUE HELPERS
    // -------------------------------------------------------

    function numberOrNull(
        value
    ) {

        if (
            value === null
            ||
            value === undefined
            ||
            value === ""
        ) {
            return null;
        }


        const n =
            Number(
                value
            );


        return Number.isFinite(n)
            ? n
            : null;
    }


    function profileFor(
        player
    ) {

        if (
            player.slug
            &&
            profiles[
                player.slug
            ]
        ) {

            return profiles[
                player.slug
            ];
        }


        return {};
    }


    function firstNumber(
        values
    ) {

        for (
            const value
            of values
        ) {

            const n =
                numberOrNull(
                    value
                );


            if (n !== null) {
                return n;
            }
        }


        return null;
    }


    function cqiValue(
        player
    ) {

        const profile =
            profileFor(
                player
            );


        return firstNumber([
            player.cqi,
            player.qpi,
            player.CQI,
            player.QPI,

            profile.cqi,
            profile.qpi,
            profile.CQI,
            profile.QPI
        ]);
    }


    function passingValue(
        player
    ) {

        const profile =
            profileFor(
                player
            );


        return firstNumber([
            player.passing,
            player.Passing,

            profile.passing,
            profile.Passing,

            profile.components
                ? profile.components.passing
                : null,

            profile.components
                ? profile.components.efficiency
                : null
        ]);
    }


    function rushingValue(
        player
    ) {

        const profile =
            profileFor(
                player
            );


        return firstNumber([
            player.rushing,
            player.Rushing,

            profile.rushing,
            profile.Rushing,

            profile.components
                ? profile.components.rushing
                : null
        ]);
    }


    function movementValue(
        player
    ) {

        const direct =
            firstNumber([
                player.rank_change,
                player.movement
            ]);


        if (
            direct !== null
        ) {
            return direct;
        }


        if (
            typeof latestMovementRecord
            === "function"
        ) {

            const record =
                latestMovementRecord(
                    player
                );


            if (record) {

                return firstNumber([
                    record.rank_change,
                    record.movement
                ]);
            }
        }


        return null;
    }


    function conferenceFor(
        player
    ) {

        return (
            player.conference
            ||
            player.Conference
            ||
            conferenceMap[
                player.team
            ]
            ||
            "Other"
        );
    }


    function valueFor(
        player,
        key
    ) {

        if (
            key === "rank"
        ) {

            return numberOrNull(
                player.rank
            );
        }


        if (
            key === "cqi"
        ) {

            return cqiValue(
                player
            );
        }


        if (
            key === "passing"
        ) {

            return passingValue(
                player
            );
        }


        if (
            key === "rushing"
        ) {

            return rushingValue(
                player
            );
        }


        if (
            key === "movement"
        ) {

            return movementValue(
                player
            );
        }


        return null;
    }


    // -------------------------------------------------------
    // CONFERENCE FILTER
    // -------------------------------------------------------

    const conferenceBar =
        document.createElement(
            "div"
        );


    conferenceBar.className =
        "conference-filter-bar";


    conferenceBar.innerHTML = `

        <label
            for="conference-filter"
        >
            Conference
        </label>

        <select
            id="conference-filter"
        >

            <option value="">
                All Conferences
            </option>

            $["ACC", "American Athletic", "Big 12", "Big Ten", "Conference USA", "FBS Independents", "Mid-American", "Mountain West", "Pac-12", "SEC", "Sun Belt"]
                .replace(
                    /^\[/,
                    ""
                )
                .replace(
                    /\]$/,
                    ""
                )

        </select>

    `;


    // Rebuild options safely rather than relying
    // on the string inserted above.
    const controls =
        searchInput.parentElement;


    controls.appendChild(
        conferenceBar
    );


    const conferenceSelect =
        conferenceBar.querySelector(
            "select"
        );


    conferenceSelect.innerHTML =
        '<option value="">All Conferences</option>';


    const conferenceNames =
        [
            ...new Set(
                allPlayers.map(
                    conferenceFor
                )
            )
        ]
        .filter(
            conference =>
                conference
                &&
                conference !== "Other"
        )
        .sort();


    conferenceNames.forEach(
        conference => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                conference;


            option.textContent =
                conference;


            conferenceSelect.appendChild(
                option
            );
        }
    );


    // -------------------------------------------------------
    // TABLE HEADER SORTING
    // -------------------------------------------------------

    const headers =
        Array.from(
            table.querySelectorAll(
                "thead th"
            )
        );


    function headerKey(
        text
    ) {

        const label =
            text
            .trim()
            .toLowerCase();


        if (
            label === "rank"
            ||
            label === "#"
        ) {
            return "rank";
        }


        if (
            label.includes("cqi")
            ||
            label.includes("qpi")
        ) {
            return "cqi";
        }


        if (
            label.includes(
                "passing"
            )
        ) {
            return "passing";
        }


        if (
            label.includes(
                "rushing"
            )
        ) {
            return "rushing";
        }


        if (
            label.includes(
                "movement"
            )
            ||
            label.includes(
                "change"
            )
        ) {
            return "movement";
        }


        return null;
    }


    const sortableHeaders = [];


    headers.forEach(
        header => {

            const key =
                headerKey(
                    header.textContent
                );


            if (!key) {
                return;
            }


            header.dataset.sortKey =
                key;


            header.classList.add(
                "sortable-header"
            );


            sortableHeaders.push(
                header
            );


            header.addEventListener(
                "click",
                () => {

                    if (
                        sortKey === key
                    ) {

                        direction =
                            direction === "asc"
                                ? "desc"
                                : "asc";

                    } else {

                        sortKey =
                            key;


                        // Rankings run 1 → 135.
                        // Performance metrics default high → low.
                        direction =
                            key === "rank"
                                ? "asc"
                                : "desc";
                    }


                    update();
                }
            );

        }
    );


    // -------------------------------------------------------
    // SORT INDICATORS
    // -------------------------------------------------------

    function updateHeaders() {

        sortableHeaders.forEach(
            header => {

                header.classList.remove(
                    "sort-active",
                    "sort-asc",
                    "sort-desc"
                );


                if (
                    header.dataset.sortKey
                    === sortKey
                ) {

                    header.classList.add(
                        "sort-active"
                    );


                    header.classList.add(
                        direction === "asc"
                            ? "sort-asc"
                            : "sort-desc"
                    );
                }
            }
        );
    }


    // -------------------------------------------------------
    // MAIN UPDATE PIPELINE
    // -------------------------------------------------------

    function update() {

        const query =
            searchInput.value
                .trim()
                .toLowerCase();


        const conference =
            conferenceSelect.value;


        let players =
            allPlayers.filter(
                player => {

                    const matchesSearch =
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


                    const matchesConference =
                        !conference
                        ||
                        conferenceFor(
                            player
                        )
                        ===
                        conference;


                    return (
                        matchesSearch
                        &&
                        matchesConference
                    );
                }
            );


        players.sort(
            (a, b) => {

                const av =
                    valueFor(
                        a,
                        sortKey
                    );


                const bv =
                    valueFor(
                        b,
                        sortKey
                    );


                // Missing metrics always go to bottom.
                if (
                    av === null
                    &&
                    bv === null
                ) {

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


                if (
                    av === null
                ) {
                    return 1;
                }


                if (
                    bv === null
                ) {
                    return -1;
                }


                let result =
                    av - bv;


                if (
                    direction === "desc"
                ) {
                    result *= -1;
                }


                // Stable tie break:
                // official CQI rank.
                if (
                    result === 0
                ) {

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


                return result;
            }
        );


        renderLeaderboard(
            players
        );


        updateHeaders();
    }


    // -------------------------------------------------------
    // EVENTS
    // -------------------------------------------------------

    searchInput.addEventListener(
        "input",
        update
    );


    conferenceSelect.addEventListener(
        "change",
        update
    );


    // -------------------------------------------------------
    // INITIAL STATE
    // -------------------------------------------------------

    update();

})();


/* ==========================================================
   END PERCERA CLEAN RANKINGS INTERACTIONS
   ========================================================== */
