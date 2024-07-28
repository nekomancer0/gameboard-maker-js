class EventEmitter {
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
    /**
       * @param {Options<T>} options
       */
    constructor(options) {
        super();
        /** @default undefined[] */
        this.metadatas = [];
        /** @default undefined[] */
        this.items = [];
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
        this.metadatas = this.metadatas.filter((m) => m.position !== position);
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
       * @param {HTMLElement | HTMLDivElement} [context]
       * @returns {void}
       */
    init(context) {
        if (typeof context === "undefined")
            context = this.context;
        context.innerHTML = "";
        let cols = [];
        let items = [];
        for (let i = 1; i <= this.width; i++) {
            let col = document.createElement("div");
            col.classList.add("col");
            col.classList.add(`col-${i}`);
            cols.push({ el: col, n: i });
        }
        for (let col of cols) {
            for (let i = 1; i <= this.height; i++) {
                let item = document.createElement("div");
                item.classList.add("item");
                item.classList.add(`item-${i}`);
                col.el.appendChild(item);
                items.push({ position: { x: col.n, y: i }, el: item });
            }
            context.appendChild(col.el);
        }
        this.metadatas.forEach((m) => {
            items.forEach((i) => {
                let isSame = i.position.x === m.position.x && i.position.y === m.position.y;
                if (isSame) {
                    i.el.classList.add(m.name);
                }
                i.el.addEventListener("click", (ev) => {
                    this.emit("click", this.getData(i.position), i.el);
                });
            });
        });
        this.items = items;
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
