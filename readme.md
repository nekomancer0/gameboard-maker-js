# `BoardMaker`

The `BoardMaker` function creates and returns an instance of a dynamic grid board within a specified `HTMLDivElement` context. This board supports various operations like initializing the grid, manipulating elements, and handling custom events.

## Constructor

### `BoardMaker(context: HTMLDivElement, options: Options): BoardMaker`

Creates a new board within a given `HTMLDivElement` context using the specified options.

#### Parameters

- `context` (`HTMLDivElement`): The container element where the grid will be initialized.
- `options` (`Options`): Configuration options for the board, which include:
  - `width` (`number`): The number of columns in the grid.
  - `height` (`number`): The number of rows in the grid.

#### Returns

- `BoardMaker`: An instance of the `BoardMaker` class with several methods and properties for managing the grid.

## Properties

- `width` (`number`): The width (number of columns) of the grid.
- `height` (`number`): The height (number of rows) of the grid.
- `context` (`HTMLDivElement`): The HTML container for the grid.
- `elements` (`object`): Methods to manipulate the grid elements.
- `borders` (`object`): Methods to manipulate the grid borders.

## Methods

### `init(): this`

Initializes and populates the grid within the specified context. Clears any existing content and creates a grid based on the provided `width` and `height`.

#### Returns

- `this`: The current instance of `BoardMaker` for chaining purposes.

#### Example

```js
board.init();
```

### `on(eventName: string, listener: (...args: any[]) => void): void`

Adds an event listener for a specific event name.

**Parameters**

- eventName (string): The name of the event to listen for.
- listener (function): The callback function to execute when the event is triggered.

#### Example

```js
board.on("init", (context) => {
  console.log("Board initialized!", context);
});
```

### `getPositions(): Position[]`

Converts the current grid context into metadata, returning an array of positions for each element in the grid.

#### Returns

- `Position[]`: An array of positions representing each element in the grid with x and y.

#### Example

```javascript
const positions = board.getPositions();
console.log(positions);
```

### `getElement(position: Position): HTMLDivElement | null`

Gets an element from the grid at a specified position. Should only be called after the grid has been initialized with .init().

**Parameters**

- `position` (`Position`): The position of the desired element in the grid.

#### Returns

- `HTMLDivElement | null`: The HTML element at the specified position, or null if not found.

#### Example

```javascript
const element = board.getElement({ x: 1, y: 2 });
console.log(element);
```

### `getElements(): HTMLDivElement[]`

Retrieves all elements in the grid as an array of HTMLDivElement.

#### Returns

- `HTMLDivElement[]`: An array of all elements in the grid.

#### Example

```javascript
const elements = board.getElements();
console.log(elements);
```

### `elements.size(num: number): void`

Sets the border size for all elements in the grid.

**Parameters**

- `num` (`number`): The size of the borders.
  ####Example

```javascript
board.elements.size(2);
```

### `getPosition(item: HTMLDivElement): Position`

Gets the position of a specific item in the grid.

**Parameters**

- `item` (`HTMLDivElement`): The item whose position is to be determined.

#### Returns

- `Position`: The position of the item within the grid with x and y.

#### Example

```javascript
const position = board.getPosition(someItem);
console.log(position);
```

### `element(position: Position): object`

Gets the element at the specified position and provides methods to manipulate it.

**Parameters**
- position (Position): The position of the desired element.
- 
#### Returns
- `object`: An object with methods to manipulate the element:
- `borderColor(color: string)`: Sets the border color of the box.
- `color(color: string)`: Sets the background color of the box.
- `item (HTMLDivElement)`: The HTML element at the specified position.
- 
#### Example
```javascript

const elem = board.element({ x: 1, y: 2 });
elem.borderColor('red');
elem.color('blue');
```
### `borders.hide(): void`

Hides all borders of the grid elements.

#### Example
```javascript

board.borders.hide();
```

### `borders.show(): void`

Shows all borders of the grid elements.

#### Example
```javascript
board.borders.show();
```

### `borders.colorize(color: string): void`
Sets the border color for all elements in the grid.

**Parameters**
- `color` (`string`): The color to set for the borders.
- 
#### Example
```javascript

board.borders.colorize('red');
```

## Example Usage
```javascript

const container = document.getElementById('grid-container');
const options = { width: 5, height: 5 };
const board = new BoardMaker(container, options);

board.init();
board.on('init', (context) => console.log('Grid initialized!', context));
const elements = board.getElements();
console.log(elements);
```
