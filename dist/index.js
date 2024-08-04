var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
class BoardMaker extends EventTarget {
  constructor(options) {
    super();
    __publicField(this, "width");
    __publicField(this, "height");
    __publicField(this, "context");
    __publicField(this, "boxNames");
    __publicField(this, "options");
    __publicField(this, "metadatas", []);
    __publicField(this, "items", []);
    __publicField(this, "on", this.addEventListener);
    this.width = options.width;
    this.height = options.height;
    this.context = options.context;
    this.boxNames = options.boxNames;
    this.options = options;
  }
  /**
   *
   * @param {Metadata<T>} metadata
   */
  addData(metadata) {
    this.metadatas.push(metadata);
  }
  /**
   *
   * @param {Position} position
   */
  removeData(position) {
    this.metadatas = this.metadatas.filter(
      (m) => m.position.x !== position.x && m.position.y !== position.y
    );
    this.metadatas = this.metadatas.filter((m) => m.position.y !== null);
  }
  /**
   *
   * @param {Position} position
   * @returns {Metadata<T> | null}
   */
  getData(position) {
    for (let metadata of this.metadatas) {
      if (metadata.position.x === position.x && metadata.position.y === position.y)
        return metadata;
    }
    return null;
  }
  /**
   * @description Initialize and populate the grid, don't forget to add style.
   * @param {HTMLDivElement} context
   */
  init(context) {
    if (typeof context === "undefined") context = this.context;
    context.innerHTML = "";
    let items = [];
    for (let r = 1; r <= this.height; r++) {
      let col = document.createElement("div");
      col.classList.add("col");
      col.classList.add("col-".concat(r), "col-".concat(r));
      for (let i = 1; i <= this.width; i++) {
        let item = document.createElement("div");
        item.classList.add("item", "item-".concat(i));
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
          el.addEventListener("click", (ev) => {
            this.dispatchEvent(
              new CustomEvent("click", {
                detail: { element: i.el, position: i.position }
              })
            );
          });
        }
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
   * @description Overwrite and load a new JSON Board Data
   * @param {Metadata<T>[]} metadatas
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
   * @param position
   * @returns {HTMLDivElement | null}
   */
  getElement(position) {
    let context = this.context || document.querySelector(".context");
    let col = context.querySelector(".col-".concat(position.x));
    let item = col.querySelector(".item-".concat(position.y));
    return item;
  }
  /**
   *
   * @param {HTMLDivElement} item
   * @returns {Position}
   */
  getPosition(item) {
    let col = item.parentElement;
    let colClasses = col.className.split(" ");
    let colClassX = colClasses.at(-1);
    let x = parseInt(colClassX.split("-")[1]);
    let itemClasses = item.className.split(" ");
    let y = parseInt(
      itemClasses.find((c) => c.startsWith("item-")).split("-")[1]
    );
    return {
      x,
      y
    };
  }
}
