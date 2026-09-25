
/* ==========================================================
   PERCERA FINAL LEADERBOARD SORTING
   ========================================================== */

(() => {

    const conferenceMap =
        {"Air Force": "Mountain West", "Akron": "Mid-American", "Alabama": "SEC", "App State": "Sun Belt", "Arizona": "Big 12", "Arizona State": "Big 12", "Arkansas": "SEC", "Arkansas State": "Sun Belt", "Army": "American Athletic", "Auburn": "SEC", "Ball State": "Mid-American", "Baylor": "Big 12", "Boise State": "Pac-12", "Boston College": "ACC", "Bowling Green": "Mid-American", "Buffalo": "Mid-American", "BYU": "Big 12", "California": "ACC", "Central Michigan": "Mid-American", "Charlotte": "American Athletic", "Cincinnati": "Big 12", "Clemson": "ACC", "Coastal Carolina": "Sun Belt", "Colorado": "Big 12", "Colorado State": "Pac-12", "Delaware": "Conference USA", "Duke": "ACC", "East Carolina": "American Athletic", "Eastern Michigan": "Mid-American", "Florida": "SEC", "Florida Atlantic": "American Athletic", "Florida International": "Conference USA", "Florida State": "ACC", "Fresno State": "Pac-12", "Georgia": "SEC", "Georgia Southern": "Sun Belt", "Georgia State": "Sun Belt", "Georgia Tech": "ACC", "Hawai'i": "Mountain West", "Houston": "Big 12", "Illinois": "Big Ten", "Indiana": "Big Ten", "Iowa": "Big Ten", "Iowa State": "Big 12", "Jacksonville State": "Conference USA", "James Madison": "Sun Belt", "Kansas": "Big 12", "Kansas State": "Big 12", "Kennesaw State": "Conference USA", "Kent State": "Mid-American", "Kentucky": "SEC", "Liberty": "Conference USA", "Louisiana": "Sun Belt", "Louisiana Tech": "Sun Belt", "Louisville": "ACC", "LSU": "SEC", "Marshall": "Sun Belt", "Maryland": "Big Ten", "Massachusetts": "Mid-American", "Memphis": "American Athletic", "Miami": "ACC", "Miami (OH)": "Mid-American", "Michigan": "Big Ten", "Michigan State": "Big Ten", "Middle Tennessee": "Conference USA", "Minnesota": "Big Ten", "Mississippi State": "SEC", "Missouri": "SEC", "Missouri State": "Conference USA", "Navy": "American Athletic", "NC State": "ACC", "Nebraska": "Big Ten", "Nevada": "Mountain West", "New Mexico": "Mountain West", "New Mexico State": "Conference USA", "North Carolina": "ACC", "North Dakota State": "Mountain West", "Northern Illinois": "Mountain West", "North Texas": "American Athletic", "Northwestern": "Big Ten", "Notre Dame": "FBS Independents", "Ohio": "Mid-American", "Ohio State": "Big Ten", "Oklahoma": "SEC", "Oklahoma State": "Big 12", "Old Dominion": "Sun Belt", "Ole Miss": "SEC", "Oregon": "Big Ten", "Oregon State": "Pac-12", "Penn State": "Big Ten", "Pittsburgh": "ACC", "Purdue": "Big Ten", "Rice": "American Athletic", "Rutgers": "Big Ten", "Sacramento State": "Mid-American", "Sam Houston": "Conference USA", "San Diego State": "Pac-12", "San José State": "Mountain West", "SMU": "ACC", "South Alabama": "Sun Belt", "South Carolina": "SEC", "Southern Miss": "Sun Belt", "South Florida": "American Athletic", "Stanford": "ACC", "Syracuse": "ACC", "TCU": "Big 12", "Temple": "American Athletic", "Tennessee": "SEC", "Texas": "SEC", "Texas A&M": "SEC", "Texas State": "Pac-12", "Texas Tech": "Big 12", "Toledo": "Mid-American", "Troy": "Sun Belt", "Tulane": "American Athletic", "Tulsa": "American Athletic", "UAB": "American Athletic", "UCF": "Big 12", "UCLA": "Big Ten", "UConn": "FBS Independents", "UL Monroe": "Sun Belt", "UNLV": "Mountain West", "USC": "Big Ten", "Utah": "Big 12", "Utah State": "Pac-12", "UTEP": "Mountain West", "UTSA": "American Athletic", "Vanderbilt": "SEC", "Virginia": "ACC", "Virginia Tech": "ACC", "Wake Forest": "ACC", "Washington": "Big Ten", "Washington State": "Pac-12", "Western Kentucky": "Conference USA", "Western Michigan": "Mid-American", "West Virginia": "Big 12", "Wisconsin": "Big Ten", "Wyoming": "Mountain West"};


    const rankingsData =
        window.CQI_LEADERBOARD
        ||
        window.QPI_LEADERBOARD;


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
            "Percera rankings tools could not initialize."
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

        console.warn(
            "Percera leaderboard or search box missing."
        );

        return;
    }


    // -------------------------------------------------------
    // REMOVE OLD SEARCH LISTENER
    //
    // Clone the existing input so the original app.js search
    // listener does not fight with conference + sorting.
    // -------------------------------------------------------

    const searchInput =
        oldSearch.cloneNode(
            true
        );


    oldSearch.replaceWith(
        searchInput
    );


    // -------------------------------------------------------
    // SORT STATE
    // -------------------------------------------------------

    let activeSortKey =
        "rank";


    let sortDirection =
        "asc";


    // -------------------------------------------------------
    // CONFERENCE LOOKUP
    // -------------------------------------------------------

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
            ""
        );
    }


    // -------------------------------------------------------
    // REMOVE ANY EXISTING CONFERENCE CONTROL
    //
    // Prevent duplicates if this script is loaded twice.
    // -------------------------------------------------------

    document
        .querySelectorAll(
            ".conference-filter-bar"
        )
        .forEach(
            node =>
                node.remove()
        );


    // -------------------------------------------------------
    // BUILD CONFERENCE FILTER
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
        </select>

    `;


    const controls =
        searchInput.parentElement;


    controls.appendChild(
        conferenceBar
    );


    const conferenceSelect =
        conferenceBar.querySelector(
            "select"
        );


    const conferences = [

        ...new Set(

            allPlayers
            .map(
                conferenceFor
            )
            .filter(
                Boolean
            )
        )

    ].sort();


    conferences.forEach(
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
    // HEADER NORMALIZATION
    // -------------------------------------------------------

    function normalizeHeader(
        text
    ) {

        return String(
            text || ""
        )
        .replace(
            /\s+/g,
            " "
        )
        .trim()
        .toLowerCase();
    }


    // -------------------------------------------------------
    // WHICH HEADERS ARE SORTABLE?
    // -------------------------------------------------------

    function sortKeyForHeader(
        label
    ) {

        const text =
            normalizeHeader(
                label
            );


        // Rank:
        // restores official CQI ranking order.
        if (
            text === "rank"
            ||
            text === "#"
        ) {

            return "rank";
        }


        // CQI deliberately NOT sortable.
        //
        // Sorting by CQI produces the same ordering as Rank.
        if (
            text === "cqi"
            ||
            text === "qpi"
        ) {

            return null;
        }


        // Pass Efficiency
        if (
            text.includes(
                "pass eff"
            )
            ||
            text.includes(
                "passing eff"
            )
            ||
            text === "efficiency"
            ||
            text === "pass efficiency"
            ||
            text === "passing efficiency"
        ) {

            return "pass-eff";
        }


        // Sack Avoidance
        if (
            text.includes(
                "sack avoidance"
            )
            ||
            text.includes(
                "sack avoid"
            )
        ) {

            return "sack";
        }


        // Rushing
        if (
            text === "rushing"
            ||
            text.includes(
                "rush"
            )
        ) {

            return "rushing";
        }


        // Rank movement
        if (
            text.includes(
                "movement"
            )
            ||
            text.includes(
                "change"
            )
        ) {

            return "movement";
        }


        return null;
    }


    // -------------------------------------------------------
    // READ A NUMBER DIRECTLY FROM A TABLE CELL
    // -------------------------------------------------------

    function numericCellValue(
        cell
    ) {

        if (!cell) {

            return null;
        }


        const raw =
            cell.textContent
            .trim()
            .replace(
                /,/g,
                ""
            );


        if (
            raw === ""
            ||
            raw === "—"
            ||
            raw === "-"
        ) {

            return null;
        }


        const match =
            raw.match(
                /[-+]?\d*\.?\d+/
            );


        if (!match) {

            return null;
        }


        const value =
            Number(
                match[0]
            );


        return Number.isFinite(
            value
        )
            ? value
            : null;
    }


    // -------------------------------------------------------
    // INITIALIZE SORTABLE HEADERS
    // -------------------------------------------------------

    const headers =
        Array.from(
            table.querySelectorAll(
                "thead th"
            )
        );


    const sortableHeaders =
        [];


    headers.forEach(
        (
            header,
            index
        ) => {

            const key =
                sortKeyForHeader(
                    header.textContent
                );


            // Remove stale classes from previous versions.
            header.classList.remove(
                "sortable-header",
                "sort-active",
                "sort-asc",
                "sort-desc"
            );


            delete header.dataset.sortKey;
            delete header.dataset.columnIndex;


            // Non-sortable columns get NOTHING.
            if (!key) {

                return;
            }


            header.dataset.sortKey =
                key;


            header.dataset.columnIndex =
                String(
                    index
                );


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
                        activeSortKey
                        === key
                    ) {

                        sortDirection =
                            sortDirection
                            === "asc"
                                ? "desc"
                                : "asc";

                    } else {

                        activeSortKey =
                            key;


                        // Official rank begins 1 → ...
                        //
                        // Performance metrics begin
                        // best → worst.
                        sortDirection =
                            key === "rank"
                                ? "asc"
                                : "desc";
                    }


                    applyFiltersAndSort();
                }
            );

        }
    );


    // -------------------------------------------------------
    // SORT THE ACTUAL RENDERED TABLE
    // -------------------------------------------------------

    function sortRenderedRows() {

        const activeHeader =
            sortableHeaders.find(
                header =>
                    header.dataset.sortKey
                    ===
                    activeSortKey
            );


        if (!activeHeader) {

            return;
        }


        const columnIndex =
            Number(
                activeHeader.dataset.columnIndex
            );


        const tbody =
            table.querySelector(
                "tbody"
            );


        const rows =
            Array.from(
                tbody.querySelectorAll(
                    "tr"
                )
            );


        rows.sort(
            (
                rowA,
                rowB
            ) => {

                const a =
                    numericCellValue(
                        rowA.children[
                            columnIndex
                        ]
                    );


                const b =
                    numericCellValue(
                        rowB.children[
                            columnIndex
                        ]
                    );


                // Missing values always stay at bottom.
                if (
                    a === null
                    &&
                    b === null
                ) {

                    return 0;
                }


                if (
                    a === null
                ) {

                    return 1;
                }


                if (
                    b === null
                ) {

                    return -1;
                }


                let result =
                    a - b;


                if (
                    sortDirection
                    === "desc"
                ) {

                    result *= -1;
                }


                return result;
            }
        );


        rows.forEach(
            row =>
                tbody.appendChild(
                    row
                )
        );
    }


    // -------------------------------------------------------
    // SORT INDICATORS
    //
    // IMPORTANT:
    //
    // NO inactive triangles.
    //
    // Only the ACTIVE column gets:
    //     ▲ ascending
    //     ▼ descending
    // -------------------------------------------------------

    function updateSortIndicators() {

        sortableHeaders.forEach(
            header => {

                header.classList.remove(
                    "sort-active",
                    "sort-asc",
                    "sort-desc"
                );


                if (
                    header.dataset.sortKey
                    === activeSortKey
                ) {

                    header.classList.add(
                        "sort-active"
                    );


                    header.classList.add(
                        sortDirection
                        === "asc"
                            ? "sort-asc"
                            : "sort-desc"
                    );
                }
            }
        );
    }


    // -------------------------------------------------------
    // SEARCH + CONFERENCE + SORT PIPELINE
    // -------------------------------------------------------

    function applyFiltersAndSort() {

        const query =
            searchInput.value
            .trim()
            .toLowerCase();


        const conference =
            conferenceSelect.value;


        const filtered =
            allPlayers.filter(
                player => {

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


                    const conferenceMatch =
                        !conference

                        ||

                        conferenceFor(
                            player
                        )
                        ===
                        conference;


                    return (
                        searchMatch
                        &&
                        conferenceMatch
                    );
                }
            );


        // Use existing site renderer.
        renderLeaderboard(
            filtered
        );


        // Then reorder visible rows.
        sortRenderedRows();


        // Finally show ONLY the active triangle.
        updateSortIndicators();
    }


    // -------------------------------------------------------
    // EVENTS
    // -------------------------------------------------------

    searchInput.addEventListener(
        "input",
        applyFiltersAndSort
    );


    conferenceSelect.addEventListener(
        "change",
        applyFiltersAndSort
    );


    // -------------------------------------------------------
    // INITIAL PAGE STATE
    // -------------------------------------------------------

    applyFiltersAndSort();

})();


/* ==========================================================
   END PERCERA FINAL LEADERBOARD SORTING
   ========================================================== */
