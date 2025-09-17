class TacOp {
    #archetype = "";
    #archetypeID = "";
    #name = "";
    #reveal = [];
    #missionAction = null;
    #additionalRules = [];
    #victoryPoints = [];

    constructor({
        archetype = "",
        name = "",
        reveal = [],
        missionAction = [],
        additionalRules = [],
        victoryPoints = [],
    } = {}) {
        this.archetype = archetype;
        this.name = name;
        this.reveal = reveal;
        this.missionAction = missionAction;
        this.additionalRules = additionalRules;
        this.victoryPoints = victoryPoints;
    }

    get archetype() { return this.#archetype; }
    get archetypeID() { return this.#archetypeID; }
    get name() { return this.#name; }
    get reveal() { return this.#reveal; }
    get missionAction() { return this.#missionAction; }
    get additionalRules() { return this.#additionalRules; }
    get victoryPoints() { return this.#victoryPoints; }

    set archetype(value) {
        switch(value.toUpperCase()) {
            case "SEEK&DESTROY":
                this.#archetype = "SEEK & DESTROY";
                this.#archetypeID = "SEEK_DESTROY";
                break;
            case "SECURITY":
                this.#archetype = "SECURITY";
                this.#archetypeID = "SECURITY";
                break;
            case "INFILTRATION":
                this.#archetype = "INFILTRATION";
                this.#archetypeID = "INFILTRATION";
                break;
            case "RECON":
                this.#archetype = "RECON";
                this.#archetypeID = "RECON";
                break;
            default:
                this.#archetype = undefined;
                this.#archetype = undefined;
                break;
        }
    }
    set name(value) {
        this.#name = typeof value === 'string' ? value : "";
    }
    set reveal(rows) {
        this.#reveal = Array.isArray(rows) ? rows.filter(x => typeof x === 'string') : typeof rows === 'string' ? [rows] : [];
    }
    set missionAction(values) {
        this.#missionAction = Array.isArray(values) ? values.filter(x => x instanceof Action) : values instanceof Action ? [values] : [];
    }
    set additionalRules(rows) {
        this.#additionalRules = Array.isArray(rows) ? rows.filter(x => typeof x === 'string') : typeof rows === 'string' ? [rows] : [];
    }
    set victoryPoints(rows) {
        this.#victoryPoints = Array.isArray(rows) ? rows.filter(x => typeof x === 'string') : typeof rows === 'string' ? [rows] : [];
    }

    static parse = (object) => {
        if (!(object instanceof Object)) return undefined;
        return new TacOp({
            archetype: object.archetype,
            name: object.name,
            reveal: object.reveal,
            missionAction: object.missionAction?.map(x => Action.parse(x)),
            additionalRules: object.additionalRules,
            victoryPoints: object.victoryPoints,
        });
    }
    
    toHTML = _ => {
        const card = document.createElement("div");
        card.id = this.name.replace(/\s+/gi, "_").toLowerCase();
        card.classList.add("tacop");
        card.setAttribute("data-archtype", this.archetypeID);
        const header = document.createElement("header");
        const name = document.createElement("h1");
        name.innerText = this.name.toUpperCase();
        const archetype = document.createElement("h2");
        archetype.classList.add(this.archetype.toLowerCase().replace(/[^a-z]+/gim, "-"));
        archetype.innerText = `${this.archetype}`;
        header.append(name, archetype);
        const description = document.createElement("div");
        if (this.reveal.length) {
            const reveal = document.createElement("div");
            const title = document.createElement("h3");
            title.innerText = "REVEAL";
            const text = document.createElement("div");
            this.reveal.forEach(row => {
                const line = document.createElement("div");
                line.innerText = row;
                text.appendChild(line);
            });
            reveal.append(title, text);
            description.appendChild(reveal);
        }
        if (this.missionAction.length) {
            const action = document.createElement("div");
            const title = document.createElement("h3");
            title.innerText = "MISSION ACTION";
            action.appendChild(title);
            this.missionAction.forEach(a => action.appendChild(a.toHTML()));
            description.appendChild(action);
        }
        if (this.additionalRules.length) {
            const rules = document.createElement("div");
            const title = document.createElement("h3");
            title.innerText = "ADDITIONAL RULES";
            const text = document.createElement("div");
            this.additionalRules.forEach(row => {
                const line = document.createElement("div");
                line.innerText = row;
                text.appendChild(line);
            });
            rules.append(title, text);
            description.appendChild(rules);
        }
        if (this.victoryPoints.length) {
            const points = document.createElement("div");
            const title = document.createElement("h3");
            title.innerText = "VICTORY POINTS";
            const text = document.createElement("div");
            this.victoryPoints.forEach(row => {
                const line = document.createElement("div");
                line.innerText = row.replace(/^\* /gi, "• ");
                text.appendChild(line);
            });
            points.append(title, text);
            description.appendChild(points);
        }
        card.append(header, description);
        return card;
    }
}
class Action {
    #name = "";
    #cost = 0;
    #effects = [];
    #conditions = [];

    constructor({
        name = "",
        cost = 0,
        effects = [],
        conditions = [],
    } = {}) {
        this.name = name;
        this.cost = cost;
        this.effects = effects;
        this.conditions = conditions;
    }

    get name() { return this.#name; }
    get cost() { return this.#cost; }
    get effects() { return this.#effects; }
    get conditions() { return this.#conditions; }

    set name(value) {
        this.#name = typeof value === 'string' ? value : "";
    }
    set cost(value) {
        value = parseInt(value);
        this.#cost = !isNaN(value) && isFinite(value) && value > 0 ? value : 0;
    }
    set effects(values) {
        if (Array.isArray(values)) values.forEach(value => value = Array.isArray(value) ? value.filter(x => typeof x === 'string') : typeof value === 'string' ? [value] : []);
        else values = typeof values === 'string' ? [[values]] : [];
        this.#effects = values;
    }
    set conditions(values) {
        if (Array.isArray(values)) values.forEach(value => value = Array.isArray(value) ? value.filter(x => typeof x === 'string') : typeof value === 'string' ? [value] : []);
        else values = typeof values === 'string' ? [[values]] : [];
        this.#conditions = values;
    }

    static parse = (object) => {
        if (!(object instanceof Object)) return undefined;
        return new Action({
            name: object.name,
            cost: object.cost,
            effects: object.effects,
            conditions: object.conditions,
        });
    }

    toHTML = _ => {
        const action = document.createElement("div");
        action.classList.add("action");
        const header = document.createElement("header");
        const name = document.createElement("div");
        name.classList.add("name");
        name.innerText = this.name.toUpperCase();
        const cost = document.createElement("div");
        cost.innerText = `${this.cost} AP`
        header.append(name, cost);
        const description = document.createElement("div");
        this.effects.forEach(effect => {
            const block = document.createElement("div");
            block.classList.add("effect");
            effect.forEach(row => {
                const line = document.createElement("div");
                line.innerText = row.replace(/^\* /gi, "• ");
                block.appendChild(line);
            });
            description.appendChild(block);
        });
        this.conditions.forEach(condition => {
            const block = document.createElement("div");
            block.classList.add("condition");
            condition.forEach(row => {
                const line = document.createElement("div");
                line.innerText = row.replace(/^\* /gi, "• ");
                block.appendChild(line);
            });
            description.appendChild(block);
        });
        action.append(header, description);
        return action;
    }
}


function selectTacOp(tacopId = "") {
    if (![...document.querySelectorAll(".tacop.selected")].length) {
        let found = false;
        [...document.querySelectorAll(".tacop")].forEach(element => {
            if (element.id === tacopId) found = true;
            element.classList.toggle("not-selected", !(element.id === tacopId));
            element.classList.toggle("selected", element.id === tacopId);
        });
        if (found) {
            saveTacOp(tacopId);
            createResetButton();
        }
    }
}

function createResetButton() {
    const resetButton = document.createElement("div");
    resetButton.id = "ResetButton";
    resetButton.classList.add("button");
    resetButton.innerText = "Reset";
    resetButton.addEventListener('click', _ => resetTacOp());
    document.getElementById("Actions").innerHTML = null;
    document.getElementById("Actions").appendChild(resetButton);
}

function saveTacOp(id = "") {
    if (!localStorage) return;
    localStorage.setItem("kt-v3/tacop", id);
}
function loadTacOp() {
    if (!localStorage) return;
    const tacopId = localStorage.getItem("kt-v3/tacop");
    if (tacopId) selectTacOp(tacopId);
}
function resetTacOp() {
    [...document.querySelectorAll(".tacop")].forEach(element => {
        element.classList.remove("not-selected");
        element.classList.remove("selected");
    });
    if (!localStorage) return;
    localStorage.removeItem("kt-v3/tacop");
    document.getElementById("Actions").innerHTML = null;
}

window.onload = _ => {

    if (!location.host) {
    	TACOPS.forEach(tacop => {
            const opElement = TacOp.parse(tacop).toHTML();
            opElement.addEventListener('click', (e) => selectTacOp(e.currentTarget.id));
            document.getElementById("TacOps")?.appendChild(opElement);
        });
        loadTacOp();
    } else {
    	fetch("data/tac-ops-3.1.json")
        .then(response => {
            if (!response.ok) throw new Error(response.status);
            return response.json();
        })
        .then(TACOPS => {
            TACOPS.forEach(tacop => {
                const op = TacOp.parse(tacop);
                const opElement = op.toHTML();
                opElement.addEventListener('click', (e) => selectTacOp(e.currentTarget.id));
                document.getElementById("TacOps")?.appendChild(opElement);
            });
            loadTacOp();
            }
        );
    }

}