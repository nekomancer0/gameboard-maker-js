# Boardmaker Lib

Create HTML checkerboard-like Board Games

## Use on the Browser

**jsdelivr**

```html
<script src="
https://cdn.jsdelivr.net/npm/boardmaker-lib@latest/dist/index.min.js
"></script>
```

## Example

```js
let board = new BoardMaker({
  width: 20, // 20 boxes as width
  height: 35, // 35 boxes as height
});

let item = board.getElement({ x: 1, y: 1 }); // <div class="item item-1"></div>

item.style.backgroundColor = "black";

let position = board.getPosition(item);

console.log(position.x, position.y); // {x: 1, y: 1}
```

## Don't forget to add style

**Here is the default one, please add it to one of your CSS files:**

```css
.context {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.context .col {
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
}
.context .col .item {
  border: 1px solid black;
  width: 27px;
  height: 27px;
  text-align: center;
}
```

_or, add it in your <head>_

```html
<style
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/boardmaker-lib@latest/dist/index.min.css"
></style>
```

## Example Tool

![alt text](https://i.imgur.com/tvUeNUU.png)
