/**
 * 删减自 https://github.com/react-bootstrap/dom-helpers/blob/master/src/position.ts
 */
/**
 * Returns the relative position of a given element.
 *
 * @param node the element
 * @param offsetParent the offset parent
 */
export default function position(node: HTMLElement, offsetParent?: HTMLElement): {
    top: number;
    left: number;
    height: number;
    width: number;
};
