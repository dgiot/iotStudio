/**
 * 修改自 https://github.com/react-bootstrap/dom-helpers/blob/master/src/offset.ts
 */
/**
 * Returns the offset of a given element, including top and left positions, width and height.
 *
 * @param node the element
 */
export default function offset(node: HTMLElement): {
    top: number;
    left: number;
    height: number;
    width: number;
};
