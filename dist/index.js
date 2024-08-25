class BoardMaker {
    width;
    height;
    context;
    /** @default EventTarget */
    events = new EventTarget();
    /** @default "black" */
    borderColor = "black";
    /** @default "px" */
    measure = "px";
    /** @default 1 */
    borderSize = 1;
    /**
       * @param {HTMLDivElement} context
       * @param {number} height
       * @param {number} width
       */
    constructor(context, height, width) {
        this.height = height;
        this.width = width;
        this.context = context;
    }
    /**
       * @param {string} eventName
       * @param {(...args: any[]) => void} listener
       * @returns {void}
       */
    on(eventName, listener) {
        this.events.addEventListener(eventName, (...args) => {
            listener(args);
        });
    }
    /**
       * @param {string} eventName
       * @param {...any} [args]
       * @returns {void}
       */
    emit(eventName, ...args) {
        this.events.dispatchEvent(new CustomEvent(eventName, { detail: args }));
    }
    /**
     * @description Initialize and populate the grid, don't forget to add style.
     * @param {HTMLDivElement | undefined} context
       * @returns {this}
       */
    init() {
        this.context.innerHTML = "";
        for (let r = 1; r <= this.height; r++) {
            let col = document.createElement("div");
            col.classList.add("col", `col-${r}`);
            for (let i = 1; i <= this.width; i++) {
                let item = document.createElement("div");
                item.classList.add("item", `item-${i}`);
                col.appendChild(item);
            }
            this.context.appendChild(col);
        }
        this.emit("init", this.context);
        return this;
    }
    /**
     * Convert your actual context grid board to metadata
       * @returns {BoardMaker.Position[]}
       */
    getPositions() {
        let ret = [];
        let cols = this.context.querySelectorAll(".col");
        cols.forEach((col) => {
            let items = col.querySelectorAll(".item");
            items.forEach((item) => {
                let position = this.getPosition(item);
                ret.push(position);
            });
        });
        return ret;
    }
    /**
     * @description Get a box with its position, possibly to edit it, add style or get its class list.
     * @description Only call at after .init();
       * @param {BoardMaker.Position} position
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
       * @returns {HTMLDivElement[]}
       */
    getElements() {
        let positions = this.getPositions();
        let elements = [];
        for (let pos of positions) {
            let el = this.getElement(pos);
            elements.push(el);
        }
        return elements;
    }
    /**
       * @returns {{ size: (num: number) => void; }}
       */
    elements() {
        let elements = this.getElements();
        return {
            /**
             * @default 1
             * @param num size of borders.
             */
            size: (num) => {
                elements.forEach((element) => {
                    element.style.border = `${num}${this.measure} solid ${this.borderColor}`;
                });
                this.borderSize = num;
            },
        };
    }
    /**
       * @param {HTMLDivElement} item
       * @returns {BoardMaker.Position}
       */
    getPosition(item) {
        let parent = item.parentElement;
        let yClasses = item.className.split(" ");
        let xClasses = parent.className.split(" ");
        let y = parseInt(yClasses[1].split("-")[1]);
        let x = parseInt(xClasses[1].split("-")[1]);
        return { x, y };
    }
    /**
       * @param {BoardMaker.Position} position
       * @returns {{ borderColor: (color: string) => void; color: (color: string) => void; item: HTMLDivElement; }}
       */
    element(position) {
        let item = this.getElement(position);
        return {
            /**
             *
             * @param color set color of the borders of the box
             */
            borderColor: (color) => {
                item.style.border = `${this.borderSize}${this.measure} solid ${color}`;
            },
            /**
             *
             * @param color set color of the box
             */
            color: (color) => {
                item.style.backgroundColor = `${this.borderSize}${this.measure} solid ${color}`;
            },
            item,
        };
    }
    /**
       * @returns {{ hide: () => void; show: () => void; colorize: (color: string) => void; }}
       */
    borders() {
        let elements = this.getElements();
        return {
            hide: () => {
                elements.forEach((element) => {
                    element.style.border = "1px solid transparent";
                });
            },
            show: () => {
                elements.forEach((element) => {
                    element.style.border = "1px solid black";
                });
            },
            colorize: (color) => {
                elements.forEach((element) => {
                    element.style.border = "1px solid " + color;
                });
                this.borderColor = color;
            },
        };
    }
}
