class EventEmitter {
    /**
       * @private
       */
    _events;
    /**
       * @param {string} event
       * @param {(...args: any[] | undefined) => void} callback
       * @returns {this}
       */
    on(event, callback) {
        this._events = this._events || {};
        this._events[event] = this._events[event] || [];
        this._events[event].push(callback);
        return this;
    }
    /**
       * @param {string} event
       * @param {(...args: any[]) => this} callback
       * @returns {this}
       */
    removeListener(event, callback) {
        this._events = this._events || {};
        if (event in this._events === false)
            return;
        this._events[event].splice(this._events[event].indexOf(callback), 1);
        return this;
    }
    /**
       * @param {string} event
       * @param {...any[] | undefined} [args]
       * @returns {boolean}
       */
    emit(event, ...args) {
        this._events = this._events || {};
        if (event in this._events === false)
            return false;
        for (var i = 0; i < this._events[event].length; i++) {
            this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        return true;
    }
}
/** @extends EventEmitter */
class BoardMaker extends EventEmitter {
    width;
    height;
    context;
    boxNames;
    options;
    /** @default undefined[] */
    metadatas = [];
    /** @default undefined[] */
    items = [];
    /**
       * @param {Options<T>} options
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
       * @param {Metadata<T>} metadata
       * @returns {void}
       */
    addData(metadata) {
        this.metadatas.push(metadata);
    }
    /**
       * @param {Position} position
       * @returns {void}
       */
    removeData(position) {
        this.metadatas = this.metadatas.filter((m) => m.position.x !== position.x && m.position.y !== position.y);
        this.metadatas = this.metadatas.filter((m) => m.position.y !== null);
    }
    /**
       * @param {Position} position
       * @returns {Metadata<T> | null}
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
       * @param {HTMLElement | HTMLDivElement} [context]
       * @returns {void}
       */
    init(context) {
        if (typeof context === "undefined")
            context = this.context;
        context.innerHTML = "";
        let items = [];
        for (let r = 1; r <= this.height; r++) {
            let col = document.createElement("div");
            col.classList.add("col");
            col.classList.add(`col-${r}`, `col-${r}`);
            for (let i = 1; i <= this.width; i++) {
                let item = document.createElement("div");
                item.classList.add("item", `item-${i}`);
                items.push({ position: { x: r, y: i }, el: item });
                col.appendChild(item);
            }
            context.appendChild(col);
        }
        this.metadatas.forEach((m) => {
            items.forEach((i) => {
                if (i.position.x === m.position.x && i.position.y === m.position.y) {
                    let el = this.getElement({ x: i.position.x, y: i.position.y });
                    el.classList.add(m.name);
                }
                // el.addEventListener("click", (ev) => {
                //   this.emit("click", i);
                // });
            });
        });
        this.items = items;
    }
    /**
     * Useful to save the current board you just made.
       * @returns {Metadata<T>[]}
       */
    toJSON() {
        return this.metadatas;
    }
    /**
     * Overwrite and load a new JSON Board Data
       * @param {Metadata<T>[]} metadatas
       * @returns {void}
       */
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
        let context = this.context || document.querySelector(".context");
        let col = context.querySelector(`.col-${position.x}`);
        let item = col.querySelector(`.item-${position.y}`);
        return item;
    }
    /**
       * @param {HTMLDivElement} item
       * @returns {Position}
       */
    getPosition(item) {
        let col = item.parentElement;
        let colClasses = col.className.split(" ");
        let colClassX = colClasses.at(-1);
        let x = parseInt(colClassX.split("-")[1]);
        let itemClasses = item.className.split(" ");
        let y = parseInt(itemClasses.find((c) => c.startsWith("item-")).split("-")[1]);
        return {
            x,
            y,
        };
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
 * @property {Name} name
 * @template {string} Name
 */
/**
 * @typedef {Object} Options
 * @property {number} width
 * @property {number} height
 * @property {HTMLElement | HTMLDivElement} [context]
 * @property {T[]} boxNames
 * @template T
 */
