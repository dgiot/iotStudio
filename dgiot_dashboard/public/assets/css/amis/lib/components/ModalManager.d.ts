/**
 * @file ModalManager
 * @description
 * @author fex
 */
/// <reference types="react" />
interface ModalComponent extends React.Component<{
    onHide: (e: any) => void;
    disabled?: boolean;
    closeOnEsc?: boolean;
}> {
}
export declare function current(): number;
export declare function currentModal(): ModalComponent | void;
export declare function addModal(modal: ModalComponent): void;
export declare function removeModal(modal: ModalComponent): void;
export {};
