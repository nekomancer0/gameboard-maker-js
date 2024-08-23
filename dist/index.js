function BoardMaker(context, options) {
    return new (class BoardMaker {
        width;
        height;
        context;
        options;
        events = new EventTarget();
        borderColor = "black";
        measure = "px";
        borderSize = 1;
        constructor(context, options) {
            this.width = options.width;
            this.height = options.height;
            this.context = context;
        }
        on(eventName, listener) {
            this.events.addEventListener(eventName, (...args) => {
                listener(args);
            });
        }
        emit(eventName, ...args) {
            this.events.dispatchEvent(new CustomEvent(eventName, { detail: args }));
        }
        /**
         * @description Initialize and populate the grid, don't forget to add style.
         * @param {HTMLDivElement | undefined} context
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
         * @returns {Position[]}
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
         * @param position
         * @returns {HTMLDivElement | null}
         */
        //@ts-ignore
        getElement(position) {
            let context = this.context;
            let col = context.querySelector(`.col-${position.x}`);
            let item = col.querySelector(`.item-${position.y}`);
            return item;
        }
        getElements() {
            let positions = this.getPositions();
            let elements = [];
            for (let pos of positions) {
                let el = this.getElement(pos);
                elements.push(el);
            }
            return elements;
        }
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
         *
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
    })(context, options);
}
