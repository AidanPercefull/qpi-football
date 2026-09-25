
/* ==========================================================
   PERCERA PLAYER TEAM CARD
   ========================================================== */

(() => {

    const teamData =
        window.PERCERA_TEAM_CONTEXT
        ||
        {};


    // -------------------------------------------------------
    // HELPERS
    // -------------------------------------------------------

    function clean(text) {

        return String(
            text || ""
        )
        .replace(
            /\s+/g,
            " "
        )
        .trim();
    }


    // -------------------------------------------------------
    // CURRENT PLAYER TEAM
    // -------------------------------------------------------

    function getCurrentTeam() {

        const content =
            document.getElementById(
                "player-content"
            );


        if (!content) {
            return null;
        }


        // Current Percera player hero.
        const teamRow =
            content.querySelector(
                ".profile-team-row"
            );


        if (teamRow) {

            const span =
                teamRow.querySelector(
                    "span"
                );


            if (
                span
                &&
                clean(
                    span.textContent
                )
            ) {

                return clean(
                    span.textContent
                );
            }
        }


        // Fallback for future layout changes.
        const text =
            clean(
                content.textContent
            );


        for (
            const team
            of Object.keys(
                teamData
            )
        ) {

            if (
                text.includes(
                    team
                )
            ) {

                return team;
            }
        }


        return null;
    }


    // -------------------------------------------------------
    // CQI PROFILE INSERTION POINT
    //
    // Team information belongs after QB analysis.
    // -------------------------------------------------------

    function findCQIProfileSection() {

        const content =
            document.getElementById(
                "player-content"
            );


        if (!content) {
            return null;
        }


        const knownGrid =
            content.querySelector(
                ".component-grid"
            )
            ||
            content.querySelector(
                ".cqi-component-grid"
            )
            ||
            content.querySelector(
                ".profile-component-grid"
            );


        if (knownGrid) {

            let node =
                knownGrid;


            for (
                let i = 0;
                i < 5 && node;
                i++
            ) {

                const text =
                    clean(
                        node.textContent
                    )
                    .toLowerCase();


                if (
                    text.includes(
                        "cqi profile"
                    )
                    &&
                    text.includes(
                        "passing efficiency"
                    )
                    &&
                    text.includes(
                        "sack avoidance"
                    )
                    &&
                    text.includes(
                        "rushing"
                    )
                ) {

                    return node;
                }


                node =
                    node.parentElement;
            }


            return (
                knownGrid.parentElement
                ||
                knownGrid
            );
        }


        // Generic fallback.
        const candidates =
            Array.from(
                content.querySelectorAll(
                    "section, div"
                )
            )
            .filter(
                element => {

                    const text =
                        clean(
                            element.textContent
                        )
                        .toLowerCase();


                    return (
                        text.includes(
                            "cqi profile"
                        )
                        &&
                        text.includes(
                            "passing efficiency"
                        )
                        &&
                        text.includes(
                            "sack avoidance"
                        )
                        &&
                        text.includes(
                            "rushing"
                        )
                    );
                }
            );


        if (!candidates.length) {
            return null;
        }


        candidates.sort(
            (a, b) =>
                clean(
                    a.textContent
                ).length
                -
                clean(
                    b.textContent
                ).length
        );


        return candidates[0];
    }


    // -------------------------------------------------------
    // NEXT OPPONENT DISPLAY
    // -------------------------------------------------------

    function nextOpponentHTML(data) {

        if (!data.next_opponent) {

            return `
                <strong>—</strong>
            `;
        }


        const matchup =
            `${
                data.next_location || ""
            } ${
                data.next_opponent
            }`
            .trim();


        return `

            <strong>
                ${matchup}
            </strong>

            ${
                data.next_week
                ?
                `
                    <small>
                        Week ${data.next_week}
                    </small>
                `
                :
                ""
            }

        `;
    }


    // -------------------------------------------------------
    // RENDER
    // -------------------------------------------------------

    function renderTeamCard() {

        const content =
            document.getElementById(
                "player-content"
            );


        if (!content) {
            return;
        }


        const team =
            getCurrentTeam();


        if (!team) {
            return;
        }


        const data =
            teamData[
                team
            ];


        if (!data) {
            return;
        }


        const insertionPoint =
            findCQIProfileSection();


        if (!insertionPoint) {
            return;
        }


        const existing =
            content.querySelector(
                ".percera-team-card"
            );


        if (existing) {

            if (
                existing.dataset.team
                ===
                team
            ) {

                return;
            }


            existing.remove();
        }


        const card =
            document.createElement(
                "section"
            );


        card.className =
            "percera-team-card";


        card.dataset.team =
            team;


        card.style.setProperty(
            "--team-card-color",
            data.color
            ||
            "#C48B28"
        );


        card.innerHTML = `

            <div
                class="team-card-header"
            >

                ${
                    data.logo
                    ?
                    `
                        <img
                            src="${data.logo}"
                            alt="${team}"
                            class="team-card-logo"
                        >
                    `
                    :
                    ""
                }


                <div
                    class="team-card-identity"
                >

                    <h3>
                        ${team}
                    </h3>

                    ${
                        data.conference
                        ?
                        `
                            <span>
                                ${data.conference}
                            </span>
                        `
                        :
                        ""
                    }

                </div>

            </div>


            <div
                class="team-card-facts"
            >

                <div
                    class="team-card-fact"
                >

                    <span
                        class="team-card-label"
                    >
                        Record
                    </span>

                    <strong>
                        ${data.record || "—"}
                    </strong>

                </div>


                <div
                    class="team-card-fact"
                >

                    <span
                        class="team-card-label"
                    >
                        Next Opponent
                    </span>

                    ${nextOpponentHTML(
                        data
                    )}

                </div>

            </div>

        `;


        insertionPoint
            .insertAdjacentElement(
                "afterend",
                card
            );
    }


    // -------------------------------------------------------
    // PLAYER NAVIGATION
    // -------------------------------------------------------

    const observer =
        new MutationObserver(
            () => {

                setTimeout(
                    renderTeamCard,
                    20
                );
            }
        );


    observer.observe(
        document.body,
        {
            childList:
                true,

            subtree:
                true
        }
    );


    document.addEventListener(
        "click",
        () => {

            setTimeout(
                renderTeamCard,
                50
            );

            setTimeout(
                renderTeamCard,
                150
            );

        },
        true
    );


    setTimeout(
        renderTeamCard,
        100
    );

})();


/* ==========================================================
   END PERCERA PLAYER TEAM CARD
   ========================================================== */
