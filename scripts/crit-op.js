class CritOp {
    #name = "";
    #missionAction = null;
    #additionalRules = [];
    #victoryPoints = [];

    constructor({
        name = "",
        missionAction = [],
        additionalRules = [],
        victoryPoints = [],
    } = {}) {
        this.name = name;
        this.missionAction = missionAction;
        this.additionalRules = additionalRules;
        this.victoryPoints = victoryPoints;
    }

    get name() { return this.#name; }
    get missionAction() { return this.#missionAction; }
    get additionalRules() { return this.#additionalRules; }
    get victoryPoints() { return this.#victoryPoints; }

    set name(value) {
        this.#name = typeof value === 'string' ? value : "";
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
        return new CritOp({
            name: object.name,
            missionAction: object.missionAction?.map(x => Action.parse(x)),
            additionalRules: object.additionalRules,
            victoryPoints: object.victoryPoints,
        });
    }
    
    toHTML = _ => {
        const card = document.createElement("div");
        card.id = this.name.replace(/\s+/gi, "_").toLowerCase();
        card.classList.add("critop");
        card.classList.add("op");
        card.setAttribute("data-archtype", this.archetypeID);
        const header = document.createElement("header");
        const name = document.createElement("h1");
        name.innerText = this.name.toUpperCase();
        header.appendChild(name);
        const description = document.createElement("div");
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


function selectCritOp(critopId = "") {
    if (![...document.querySelectorAll(".critop.selected")].length) {
        let found = false;
        [...document.querySelectorAll(".critop")].forEach(element => {
            if (element.id === critopId) found = true;
            element.classList.toggle("not-selected", !(element.id === critopId));
            element.classList.toggle("selected", element.id === critopId);
        });
        if (found) {
            saveCritOp(critopId);
            createResetButton();
        }
    }
}

function createResetButton() {
    const resetButton = document.createElement("div");
    resetButton.id = "ResetButton";
    resetButton.classList.add("button");
    resetButton.innerText = "Reset";
    resetButton.addEventListener('click', _ => resetCritOp());
    document.getElementById("Actions").innerHTML = null;
    document.getElementById("Actions").appendChild(resetButton);
}

function saveCritOp(id = "") {
    if (!localStorage) return;
    localStorage.setItem("kt-v3/critop", id);
}
function loadCritOp() {
    if (!localStorage) return;
    const critopId = localStorage.getItem("kt-v3/critop");
    if (critopId) selectCritOp(critopId);
}
function resetCritOp() {
    [...document.querySelectorAll(".critop")].forEach(element => {
        element.classList.remove("not-selected");
        element.classList.remove("selected");
    });
    if (!localStorage) return;
    localStorage.removeItem("kt-v3/critop");
    document.getElementById("Actions").innerHTML = null;
}

window.onload = _ => {

    if (!location.host) {
    	CRITOPS.forEach(critop => {
            const opElement = CritOp.parse(critop).toHTML();
            opElement.addEventListener('click', (e) => selectCritOp(e.currentTarget.id));
            document.getElementById("CritOps")?.appendChild(opElement);
        });
        loadCritOp();
    } else {
    	fetch("data/crit-ops-3.1.json")
        .then(response => {
            if (!response.ok) throw new Error(response.status);
            return response.json();
        })
        .then(CRITOPS => {
            CRITOPS.forEach(critop => {
                const op = CritOp.parse(critop);
                const opElement = op.toHTML();
                opElement.addEventListener('click', (e) => selectCritOp(e.currentTarget.id));
                document.getElementById("CritOps")?.appendChild(opElement);
            });
            loadCritOp();
            }
        );
    }

}