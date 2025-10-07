class CombatManager {
    #managers = [];

    constructor() {
        if (document.getElementById("KillOpManager")) this.#managers.push(new KillOpManager());
        if (document.getElementById("CritOpManager")) this.#managers.push(new CritOpManager());
        if (document.getElementById("TacOpManager")) this.#managers.push(new TacOpManager());
        const primaryButtons = [...document.querySelectorAll(".primarySet")];
        primaryButtons.forEach(button => {
            button.addEventListener('click', _ => {
                const name = button.getAttribute("for");
                this.#managers.forEach(manager => {
                    manager.primary = manager.name.toLowerCase() === name.toLowerCase() && !manager.primary;
                    manager.update();
                });
            });
        });
        const reset = document.getElementById("ResetManager");
        if (reset) reset.addEventListener('click', _ => {
            this.#managers.forEach(manager => {
                if (!(manager instanceof OpManager)) return;
                manager.reset();
            });
        });
    }
}
class OpManager {
    #name = "";
    #scored = 0;
    #primary = false;
    #mainElement = "";
    #scoredElement = null;
    #vpElement = null;
    #primaryElement = null;

    constructor({
        scored = 0,
        name = "",
        primary = false,
    } = {}) {
        this.name = name;
        if (!this.name) return undefined;
        const value = this.load();
        this.scored = value.scored ?? scored;
        this.primary = value.primary ?? primary;
        this.#mainElement = document.getElementById(`${this.name}OpManager`);
        this.#scoredElement = document.getElementById(`${this.name}Scored`);
        this.#vpElement = document.getElementById(`${this.name}OpVP`);
        this.#primaryElement = document.createElement("img");
        this.#primaryElement.id = `primary${this.name}`;
        this.#primaryElement.src = "images/icons/d6-0.png";
        this.#primaryElement.alt = 0;
        const addElement = document.getElementById(`Add${this.name}`);
        const removeElement = document.getElementById(`Remove${this.name}`);
        if (addElement) addElement.addEventListener('click', _ => { this.add(); });
        if (removeElement) removeElement.addEventListener('click', _ => { this.remove(); });
        this.update(false);
    }
    get name() { return this.#name; }
    get scored() { return this.#scored; }
    get primary() { return this.#primary; }
    get vp() { return this.calculateVP(); }
    get mainElement() { return this.#mainElement; }
    get scoredElement() { return this.#scoredElement; }
    get vpElement() { return this.#vpElement; }
    get primaryElement() { return this.#primaryElement; }
    set name(value) { this.#name = typeof value === 'string' ? value : undefined; }
    set scored(value) { this.#scored = !isNaN(value) && isFinite(value) && value > 0 ? parseInt(value) : 0; }
    set primary(value) { this.#primary = typeof value === 'boolean' ? value : false; }

    calculateVP = _ => {
        return this.scored;
    }
    add = _ => {
        if (this.vp < 6) this.scored += 1;
        this.update();
    }
    remove = _ => {
        if (this.scored > 0) this.scored -= 1;
        this.update();
    }
    update = (save = true) => {
        if (this.primary) {
            if (!document.getElementById(this.primaryElement.id)) this.mainElement.querySelector(".result")?.appendChild(this.primaryElement);
            switch(Math.ceil(this.vp / 2.0)) {
                case 1:
                    this.primaryElement.src = "images/icons/d6-1.png";
                    this.primaryElement.alt = 1;
                    break;
                case 2:
                    this.primaryElement.src = "images/icons/d6-2.png";
                    this.primaryElement.alt = 2;
                    break;
                case 3:
                    this.primaryElement.src = "images/icons/d6-3.png";
                    this.primaryElement.alt = 3;
                    break;
                default:
                    this.primaryElement.src = "images/icons/d6-0.png";
                    this.primaryElement.alt = 0;
                    break;
            }
        } else this.primaryElement.remove();
        this.scoredElement.innerText = this.scored;
        switch(this.vp) {
            case 1:
                this.vpElement.src = "images/icons/d6-1.png";
                this.vpElement.alt = 1;
                break;
            case 2:
                this.vpElement.src = "images/icons/d6-2.png";
                this.vpElement.alt = 2;
                break;
            case 3:
                this.vpElement.src = "images/icons/d6-3.png";
                this.vpElement.alt = 3;
                break;
            case 4:
                this.vpElement.src = "images/icons/d6-4.png";
                this.vpElement.alt = 4;
                break;
            case 5:
                this.vpElement.src = "images/icons/d6-5.png";
                this.vpElement.alt = 5;
                break;
            case 6:
                this.vpElement.src = "images/icons/d6-6.png";
                this.vpElement.alt = 6;
                break;
            default:
                this.vpElement.src = "images/icons/d6-0.png";
                this.vpElement.alt = 0;
                break;
        }
        if (save) this.save();
    }
    save = _ => {
        if (!localStorage) return false;
        const value = JSON.stringify({
            scored: this.scored,
            primary: this.primary,
        });
        localStorage.setItem(`kt-v3/combat-manager/${this.name}Op`, value);
        return true;
    }
    load = _ => {
        const empty = { scored: this.scored, primary: this.primary, };
        try{
            if (!localStorage) return 0;
            const value = JSON.parse(localStorage.getItem(`kt-v3/combat-manager/${this.name}Op`));
            if (!value) return empty;
            const scored = parseInt(value.scored);
            const primary = typeof value.primary === 'boolean' ? value.primary : false;
            return { scored: scored, primary: primary, };
        } catch(e) {
            console.error(e);
            return empty;
        }
    }
    reset = _ => {
        this.primary = false;
        this.scored = 0;
        if (localStorage) localStorage.removeItem(`kt-v3/combat-manager/${this.name}Op`);
        this.update(false);
        return true;
    }
}
class KillOpManager extends OpManager {
    #killTable = {
        5: [1,2,3,4,5],
        6: [1,2,4,5,6],
        7: [1,3,4,6,7],
        8: [2,3,5,6,8],
        9: [2,4,5,7,9],
        10: [2,4,6,8,10],
        11: [2,4,7,9,11],
        12: [2,5,7,10,12],
        13: [3,5,8,10,13],
        14: [3,6,8,11,14],
    };
    #size = 0;
    #sizeElement = null;
    
    constructor({
        kills = 0,
        size = 0,
        primary = false
    } = {}) {
        super({
            scored: kills,
            name: "Kill",
            primary: primary,
        });
        const value = this.load();
        this.scored = value.kills ?? this.scored;
        this.primary = value.primary ?? this.primary;
        this.size = size ? size : value.size;
        this.sizeElement = document.getElementById("KillTeamSize");
        if (this.sizeElement) {
            this.sizeElement.value = this.size;
            this.sizeElement.addEventListener('change', e => { this.onChangeSize(e); });
        }
        this.update(false);
    }
    get size() { return this.#size; }
    get sizeElement() { return this.#sizeElement; }
    set size(value) {
        value = parseInt(value);
        this.#size = !isNaN(value) && isFinite(value) && value > 0 ? value : 0;
    }
    set sizeElement(value) { this.#sizeElement = value instanceof HTMLElement ? value : null; }

    calculateVP = _ => {
        const ref = this.#killTable[this.size] ?? [];
        let grade = ref.filter(kills => kills <= this.scored).length;
        return grade;
    }
    add = _ => {
        if (this.scored < this.size) this.scored += 1;
        this.update();
    }
    onChangeSize = (e) => {
        const newSize = e.currentTarget ? parseInt(e.currentTarget.value) : 0;
        if (!isNaN(newSize) && isFinite(newSize) && newSize > 0) this.size = newSize;
        if (this.kills > this.size) this.kills = this.size;
        this.update();
    }
    save = _ => {
        try {
            if (!localStorage) throw "Missing localStorage";
            const value = JSON.stringify({
                kills: this.scored,
                size: this.size,
                primary: this.primary,
            });
            localStorage.setItem(`kt-v3/combat-manager/${this.name}Op`, value);
            return true;
        } catch(e) {
            console.error(e);
            return false
        }
    }
    load = _ => {
        const empty = { kills: this.scored, size: this.size, primary: this.primary, };
        try{
            if (!localStorage) throw "Missing localStorage";
            const value = JSON.parse(localStorage.getItem(`kt-v3/combat-manager/${this.name}Op`));
            if (!value) return empty;
            const scored = parseInt(value.kills);
            const size = parseInt(value.size);
            const primary = typeof value.primary === 'boolean' ? value.primary : false;
            return { kills: scored, size: size, primary: primary, };
        } catch(e) {
            console.error(e);
            return empty;
        }
    }
    reset = _ => {
        this.primary = false;
        this.scored = 0;
        this.sizeElement.value = null;
        if (localStorage) localStorage.removeItem(`kt-v3/combat-manager/${this.name}Op`);
        this.update(false);
        return true;
    }
}
class CritOpManager extends OpManager {
    constructor({ points = 0, primary = false, } = {}) {
        super({
            scored: points,
            name: "Crit",
            primary: primary,
        });
    }
}
class TacOpManager extends OpManager {
    constructor({ points = 0, primary = false, } = {}) {
        super({
            scored: points,
            name: "Tac",
            primary: primary,
        });
    }
}

window.onload = _ => {
    
    const combatManager = new CombatManager();

}
