interface Rect {
    top: number;
    left: number;
    bottom: number;
    right: number;
    width: number;
    height: number;
}
interface AnimationState {
    rect: Rect;
    target: HTMLElement;
}
export declare class AnimationManager {
    animating: boolean;
    animationCallbackId: any;
    states: Array<AnimationState>;
    capture(el: HTMLElement): void;
    animateAll(callback?: () => void): void;
    animate(target: HTMLElement, currentRect: Rect, toRect: Rect, duration: number): void;
}
declare const _default: AnimationManager;
export default _default;
