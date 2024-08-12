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
       * @deprecated use getElement and getPosition to set custom classes instad.
       * @param {Metadata} metadata
       * @returns {void}
       */
    addData(metadata) {
        this.metadatas.push(metadata);
    }
    /**
       * @deprecated use getElement and getPosition to set custom classes instad.
       * @param {Position} position
       * @returns {void}
       */
    removeData(position) {
        this.metadatas = this.metadatas.filter((m) => m.position.x !== position.x && m.position.y !== position.y);
        this.metadatas = this.metadatas.filter((m) => m.position.y !== null);
    }
    /**
       * @deprecated use getElement and getPosition to set custom classes instad.
       * @param {Position} position
       * @returns {Metadata | null}
       */
    getData(position) {
        for (let metadata of this.metadatas) {
            if (metadata.position.x === position.x &&
                metadata.position.y === position.y)
                return metadata;
        }
        return null;
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
     * @description Overwrite and load a new JSON Board Data
       * @param {Metadata[]} metadatas
       * @returns {void}
       */
    //@ts-ignore
    loadJSON(metadatas) {
        this.metadatas = [];
        for (let metadata of metadatas) {
            this.addData(metadata);
        }
    }
    /**
     * @description Get a box with its position, possibly to edit it, add style or get its class list.
     * @description Only call at after .init();
       * @param {Position} position
       * @returns {HTMLDivElement | null}
       */
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
        let x = parseInt(parent.className.split(" ").at(1).split("-")[1]);
        let y = parseInt(item.className.split(" ").at(1).split("-")[1]);
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
