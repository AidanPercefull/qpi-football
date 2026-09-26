
(() => {

    if (
        window.__PERCERA_BRANDING_V3__
    ) {
        return;
    }

    window.__PERCERA_BRANDING_V3__ =
        true;


    function hexToRgb(hex) {

        const value =
            String(hex || "")
            .replace("#", "");


        if (
            !/^[0-9a-fA-F]{6}$/.test(
                value
            )
        ) {

            return {
                r: 11,
                g: 31,
                b: 59
            };
        }


        return {
            r: parseInt(
                value.slice(0, 2),
                16
            ),
            g: parseInt(
                value.slice(2, 4),
                16
            ),
            b: parseInt(
                value.slice(4, 6),
                16
            )
        };
    }


    function identifyTeam(hero) {

        const branding =
            window.PERCERA_TEAM_BRANDING
            || {};


        const text =
            String(
                hero.textContent || ""
            ).toLowerCase();


        return (
            Object.keys(
                branding
            )
            .sort(
                (a, b) =>
                    b.length
                    -
                    a.length
            )
            .find(
                name =>
                    text.includes(
                        name.toLowerCase()
                    )
            )
            ||
            null
        );
    }


    function applyBranding() {

        const hero =
            document.querySelector(
                ".team-detail-hero"
            );


        if (!hero) {
            return;
        }


        const team =
            identifyTeam(
                hero
            );


        if (!team) {
            return;
        }


        const info =
            window.PERCERA_TEAM_BRANDING[
                team
            ];


        if (!info) {
            return;
        }


        const rgb =
            hexToRgb(
                info.color
            );


        hero.style.setProperty(
            "--percera-team-rgb",
            `${rgb.r}, ${rgb.g}, ${rgb.b}`
        );


        hero.classList.toggle(
            "team-hero-strong-tint",
            !!info.coloredBackground
        );


        hero.classList.toggle(
            "team-hero-soft-tint",
            !info.coloredBackground
        );


        const watermark =
            hero.querySelector(
                ".team-detail-watermark"
            );


        if (watermark) {

            watermark.classList.toggle(
                "watermark-secondary",
                info.watermarkMode
                ===
                "secondary"
            );


            watermark.classList.toggle(
                "watermark-primary",
                info.watermarkMode
                !==
                "secondary"
            );


            watermark.classList.toggle(
                "watermark-needs-color",
                !!info.coloredBackground
            );
        }
    }


    function run() {

        applyBranding();
    }


    run();


    let tries = 0;


    const timer =
        setInterval(
            () => {

                tries += 1;

                run();


                if (
                    tries >= 60
                ) {

                    clearInterval(
                        timer
                    );
                }

            },
            100
        );


    document.addEventListener(
        "click",
        () => {

            setTimeout(
                run,
                30
            );

            setTimeout(
                run,
                150
            );
        },
        true
    );

})();
