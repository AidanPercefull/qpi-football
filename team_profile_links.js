
/* ==========================================================
   PERCERA QB ↔ TEAM PROFILE LINKS
   ========================================================== */

(() => {

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


    function openTeam(
        teamName
    ) {

        if (!teamName) {
            return;
        }


        if (
            typeof window.showPerceraTeam
            !==
            "function"
        ) {

            console.warn(
                "Percera team navigation unavailable."
            );

            return;
        }


        window.showPerceraTeam(
            teamName
        );
    }


    function makeInteractive(
        element,
        teamName
    ) {

        if (
            !element
            ||
            !teamName
        ) {
            return;
        }


        // Already wired.
        if (
            element.dataset
                .perceraTeamLinked
            ===
            teamName
        ) {
            return;
        }


        element.dataset
            .perceraTeamLinked =
            teamName;


        element.classList.add(
            "percera-team-link"
        );


        element.setAttribute(
            "role",
            "link"
        );


        element.setAttribute(
            "tabindex",
            "0"
        );


        element.setAttribute(
            "aria-label",
            `View ${teamName} team page`
        );


        element.addEventListener(
            "click",
            event => {

                event.preventDefault();

                openTeam(
                    teamName
                );
            }
        );


        element.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                    ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    openTeam(
                        teamName
                    );
                }
            }
        );
    }


    // -------------------------------------------------------
    // WIRE CURRENT QB PROFILE
    // -------------------------------------------------------

    function wireProfileTeamLinks() {

        const content =
            document.getElementById(
                "player-content"
            );


        if (!content) {
            return;
        }


        // ---------------------------------------------------
        // HERO TEAM ROW
        //
        // Current structure contains team logo + team name.
        // ---------------------------------------------------

        const teamRow =
            content.querySelector(
                ".profile-team-row"
            );


        let teamName = null;


        if (teamRow) {

            const teamText =
                teamRow.querySelector(
                    "span"
                );


            teamName =
                clean(
                    teamText
                    ?
                    teamText.textContent
                    :
                    teamRow.textContent
                );


            makeInteractive(
                teamRow,
                teamName
            );
        }


        // ---------------------------------------------------
        // LOWER TEAM CARD
        //
        // Production team card already stores the team name
        // in data-team.
        // ---------------------------------------------------

        const teamCard =
            content.querySelector(
                ".percera-team-card"
            );


        if (teamCard) {

            const cardTeam =
                clean(
                    teamCard.dataset.team
                );


            const cardHeader =
                teamCard.querySelector(
                    ".team-card-header"
                )
                ||
                teamCard;


            makeInteractive(
                cardHeader,
                cardTeam
            );
        }
    }


    // -------------------------------------------------------
    // PLAYER PROFILES RENDER DYNAMICALLY
    // -------------------------------------------------------

    const observer =
        new MutationObserver(
            () => {

                window.setTimeout(
                    wireProfileTeamLinks,
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

            window.setTimeout(
                wireProfileTeamLinks,
                50
            );

            window.setTimeout(
                wireProfileTeamLinks,
                150
            );
        },
        true
    );


    window.setTimeout(
        wireProfileTeamLinks,
        100
    );

})();


/* ==========================================================
   END PERCERA QB ↔ TEAM PROFILE LINKS
   ========================================================== */
