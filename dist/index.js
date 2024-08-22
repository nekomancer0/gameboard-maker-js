/** @extends EventTarget */
class BoardMaker extends EventTarget {
    width;
    height;
    context;
    boxNames;
    options;
    /** @default undefined[] */
    metadatas = [];
    /**
       * @param {Options} options
       */
    constructor(options) {
        super();
        this.width = options.width;
        this.height = options.height;
        this.context = options.context;
        this.boxNames = options.boxNames;
        this.options = options;
    }
    /**
     * @description Initialize and populate the grid, don't forget to add style.
       * @param {HTMLDivElement} [context]
       * @returns {void}
       */
    init(context) {
        if (typeof context === "undefined")
            context = this.context;
        context.innerHTML = "";
        for (let r = 1; r <= this.height; r++) {
            let col = document.createElement("div");
            col.classList.add("col", `col-${r}`);
            for (let i = 1; i <= this.width; i++) {
                let item = document.createElement("div");
                item.classList.add("item", `item-${i}`);
                col.appendChild(item);
                //@ts-ignore
                item.addEventListener("click", (ev) => {
                    this.dispatchEvent(new CustomEvent("click", { detail: { item: ev.target } }));
                });
                //@ts-ignore
                item.addEventListener("mouseover", (ev) => {
                    this.dispatchEvent(new CustomEvent("mouseover", { detail: { item: ev.target } }));
                });
            }
            context.appendChild(col);
            this.dispatchEvent(new CustomEvent("init", {
                detail: { context: this.context || context },
            }));
        }
    }
    /**
     * Useful to save the current board you just made.
       * @returns {Metadata[]}
       */
    toJSON() {
        return this.metadatas;
    }
    /**
     * Convert your actual context grid board to metadata
       * @returns {Metadata[]}
       */
    toMetadatas() {
        let ret = [];
        let cols = this.context.querySelectorAll(".col");
        cols.forEach((col) => {
            let items = col.querySelectorAll(".item");
            items.forEach((item) => {
                let position = this.getPosition(item);
                let name = item.className.split(" ").at(2);
                ret.push({
                    position,
                    //@ts-ignore
                    name: name,
                });
            });
        });
        return ret;
    }
    /**
       * @param {"click" | "init" | "hover"} event
       * @param {| ((...args: any[]) => void)
       *       | (() => void)
       *       | ((item: HTMLDivElement) => void)} callback
       * @returns {void}
       */
    on(event, callback) {
        this.addEventListener(event, (...args) => {
            callback(args[0]);
        });
    }
    /**
     * @description Get a box with its position, possibly to edit it, add style or get its class list.
     * @description Only call at after .init();
       * @param {Position} position
       * @returns {HTMLDivElement | null}
       */
    //@ts-ignore
    getElement(position) {
        let context = this.context;
        let col = context.querySelector(`.col-${position.x}`);
        let item = col.querySelector(`.item-${position.y}`);
        return item;
    }
    /**
       * @param {HTMLDivElement} item
       * @returns {Position}
       */
    getPosition(item) {
        let parent = item.parentElement;
        let yClasses = item.className.split(" ");
        let xClasses = parent.className.split(" ");
        let y = parseInt(yClasses[1].split("-")[1]);
        let x = parseInt(xClasses[1].split("-")[1]);
        return { x, y };
    }
}
/**
 * @typedef {Object} Position
 * @property {number} x
 * @property {number} y
 */
/**
 * @typedef {Object} Metadata
 * @property {Position} position
 * @property {string} name
 */
/**
 * @typedef {Object} Options
 * @property {number} width
 * @property {number} height
 * @property {HTMLDivElement} [context]
 * @property {string[]} [boxNames]
 */
