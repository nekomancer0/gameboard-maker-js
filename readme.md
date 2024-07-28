# Boardmaker Lib

Create HTML checkerboard-like Board Games

## Use on the Browser

**jsdelivr**

```code
https://cdn.jsdelivr.net/npm/boardmaker-lib@1.0.1-minified/dist/index.min.js
```

## Example

```js

let board = new BoardMaker({
    width: 20 // 20 boxes as width
    height: 35 // 35 boxes as height
    boxNames: ["wall", "empty"]
})

// Add data

board.addData({
    position: {
        x: // ...
        y: // ...
    },
    name: "..."
});

board.removeData({
    x: // ...
    y: // ...
});

// Metadatas are used to put style to the boxes and be recognisable.

// Populate your div element
board.init(context) // HTMLDivElement
```

## Example Tool

![alt text](https://i.imgur.com/tvUeNUU.png)
