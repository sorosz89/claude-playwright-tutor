# Feature: Editing an existing todo

Not currently covered by `tests/`.

## Behavior

- Double-clicking a todo's label switches it into edit mode: the label is
  replaced by a text input pre-filled with the current title.
- Typing a new value and pressing Enter commits the new title; the item
  leaves edit mode and shows the new title.
- Editing a title does not change the item's completed/active state.

## Example

Given a single active todo titled "Buy milk"
When the user double-clicks it, clears the text, types "Buy oat milk", and presses Enter
Then the todo list shows exactly one item titled "Buy oat milk"
And the todo count still reads "1 item left"
