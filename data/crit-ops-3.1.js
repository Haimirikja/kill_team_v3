const CRITOPS = [
    {
        "name": "Secure",
        "missionAction": [
            {
                "name": "Secure",
                "cost": 1,
                "effects": [
                    [ "One objective marker the active operative controls is secured by your kill team until the enemy kill team secures that objective marker." ]
                ],
                "conditions": [
                    [ "An operative cannot perform this action during the first turning point, or while within control range of an enemy operative." ]
                ]
            }
        ],
        "victoryPoints": [
            "At the end of each turning point after the first:",
            "* If any objective markers are secured by your kill team, you score 1VP.",
            "* If more objective markers are secured by your kill team than your opponent's kill team, you score 1VP."
        ]
    },
    {
        "name": "Loot",
        "missionAction": [
            {
                "name": "Loot",
                "cost": 1,
                "effects": [
                    [ "One objective marker the active operative controls is looted." ]
                ],
                "conditions": [
                    [ "An operative cannot perform this action during the first turning point, while within control range of an enemy operative, or if that objective marker has already been looted during this turning point." ]
                ]
            }
        ],
        "victoryPoints": [
            "Whenever a friendly operative performs the Loot action, you score 1VP (to a maximum of 2VP per turning point)."
        ]
    },
    {
        "name": "Transmission",
        "missionAction": [
            {
                "name": "Initiate Transmission",
                "cost": 1,
                "effects": [
                    [ "One objective marker the active operative controls is transmitting until the start of the next turning point." ]
                ],
                "conditions": [
                    [ "An operative cannot perform this action during the first turning point, or while within control range of an enemy operative." ]
                ]
            }
        ],
        "victoryPoints": [
            "At the end of each turning point after the first:",
            "* If friendly operatives control any transmitting objective markers, you score 1VP.",
            "* If friendly operatives control more transmitting objective markers than enemy operatives do, you score 1VP."
        ]
    },
    {
        "name": "Orb",
        "missionAction": [
            {
                "name": "Move Orb",
                "cost": 1,
                "effects": [
                    [
                        "If the active operative controls the objective marker that has the Orb token, move that token as follows:",
                        "* If the centre objective marker has it, move it to either player's objective marker (your choice).",
                        "* If a player's objective marker has it, move it to the centre objective marker."
                    ]
                ],
                "conditions": [
                    [ "An operative cannot perform this action during the first turning point, while within control range of an enemy operative, or if it doesn't control the objective marker that has the Orb token." ]
                ]
            }
        ],
        "additionalRules": [
            "At the start of the battle, the centre objective marker has the Orb token."
        ],
        "victoryPoints": [
            "At the end of each turning point after the first, for each objective marker that friendly operatives control that doesn't have the Orb token, you score 1VP."
        ]
    },
    {
        "name": "Stake Claim",
        "additionalRules": [
            "* At the start of the Gambit step of each Strategy phase after the first, starting with the player with initiative, each player must select both one objective marker and one of the following claims for that turning point:",
            " ** Friendly operatives will control that objective marker at the end of this turning point.",
            " ** Enemy operatives won't contest that objective marker at the end of this turning point.",
            "* Each player cannot select each objective marker more than once per battle (so they must select each objective marker once during the battle)."
        ],
        "victoryPoints": [
            "If friendly operatives control more objective markers than enemy operatives do, you score 1VP.",
            "If your selected claim is true, you score 1VP."
        ]
    },
    {
        "name": "Energy Cells",
        "additionalRules": [
            "* Operatives can perform the Pick Up Marker action upon each objective marker in the following turning points:",
            " ** 2, but you must spend an additional 2AP (that action cannot be free and its AP cannot be reduced).",
            " ** 3, but you must spend an additional 1AP (that action cannot be free and its AP cannot be reduced).",
            " ** 4 (as normal).",
            "* Whenever an operative is carrying an objective marker, that operative cannot be removed and set up again more than 6\" away."
        ],
        "victoryPoints": [
            "At the end of each turning point, if friendly operatives control more objective markers than enemy operatives do, you score 1VP.",
            "At the end of the battle, for each objective marker friendly operatives are carrying, you score 1VP."
        ]
    },
    {
        "name": "Download",
        "missionAction": [
            {
                "name": "Download",
                "cost": 1,
                "effects": [
                    [ "One centre or opponent's objective marker the active operative controls is downloaded." ]
                ],
                "conditions": [
                    [ "An operative cannot perform this action during the first or second turning point, while within control range of an enemy operative, or if that objective marker has already been downloaded during the battle." ]
                ]
            }
        ],
        "victoryPoints": [
            "* At the end of each turning point after the first, if friendly operatives control more objective markers than enemy operatives do, you score 1VP. Ignore downloaded objective markers when determining this.",
            "* Whenever a friendly operative performs the Download action during the third turning point, you score 1VP.",
            "* Whenever a friendly operative performs the Download action during the fourth turning point, you score 2VP."
        ]
    },
    {
        "name": "Data",
        "missionAction": [
            {
                "name": "Compile Data",
                "cost": 1,
                "effects": [
                    [ "One objective marker the active operative controls gains 1 Data point. Use a dice as a token to keep track of Data points at that objective marker." ]
                ],
                "conditions": [
                    [ "An operative cannot perform this action during the first turning point, while within control range of an enemy operative, or if that objective marker has already gained a Data point during this turning point." ]
                ]
            },
            {
                "name": "Send Data",
                "cost": 1,
                "effects": [
                    [ "Remove all Data points from an objective marker the active operative controls." ]
                ],
                "conditions": [
                    [ "An operative cannot perform this action during the first, second or third turning point, while within control range of an enemy operative, or if that objective marker doesn't have any Data points to remove." ]
                ]
            }
        ],
        "victoryPoints": [
            "At the end of the second and third turning point, if friendly operatives have performed more Compile Data actions during that turning point than enemy operatives have, you score 1VP.",
            "Whenever a friendly operative performs the Send Data action, you score a number of VP equal to the number of Data points removed."
        ]
    },
    {
        "name": "Reboot",
        "missionAction": [
            {
                "name": "Reboot",
                "cost": 2,
                "effects": [
                    [ "One inert objective marker the active operative controls is no longer inert." ]
                ],
                "conditions": [
                    [ "An operative cannot perform this action during the first turning point, or while within control range of an enemy operative." ]
                ]
            }
        ],
        "additionalRules": [
            "* When setting up the battle, after setting up objective markers, number each objective marker 1-3.",
            "* At the start of the Gambit step of each Strategy phase, each player secretly selects one objective marker by putting a number of dice in their hand that matches that marker's number, then reveal simultaneously:",
            " ** If both players selected the same one, that objective marker is inert during this turning point.",
            " ** If not, the objective marker that neither player selected is inert during this turning point."
        ],
        "victoryPoints": [
            "* At the end of each turning point after the first, for each objective marker friendly operatives control, you score 1VP. Ignore inert objective markers when determining this."
        ]
    }
]