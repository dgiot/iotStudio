/**
 * @file Modal
 * @description
 * @author fex
 */
/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { ThemeProps } from '../theme';
import { LocaleProps } from '../locale';
export interface ModalProps extends ThemeProps, LocaleProps {
    className?: string;
    contentClassName?: string;
    size?: any;
    overlay?: boolean;
    onHide: (e: any) => void;
    closeOnEsc?: boolean;
    closeOnOutside?: boolean;
    container?: any;
    show?: boolean;
    disabled?: boolean;
    onExited?: () => void;
    onEntered?: () => void;
}
export interface ModalState {
}
export declare class Modal extends React.Component<ModalProps, ModalState> {
    static defaultProps: {
        container: HTMLElement;
        size: string;
        overlay: boolean;
    };
    isRootClosed: boolean;
    modalDom: HTMLElement;
    static Header: {
        new (props: (Omit<Omit<ThemeProps & LocaleProps & {
            className?: string | undefined;
            showCloseButton?: boolean | undefined;
            onClose?: (() => void) | undefined;
            children?: React.ReactNode;
        } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps) | Readonly<Omit<Omit<ThemeProps & LocaleProps & {
            className?: string | undefined;
            showCloseButton?: boolean | undefined;
            onClose?: (() => void) | undefined;
            children?: React.ReactNode;
        } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>): {
            render(): JSX.Element;
            context: any;
            setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Omit<Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<{}>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<Omit<Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Omit<Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Omit<Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Omit<Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Omit<Omit<ThemeProps & LocaleProps & {
            className?: string | undefined;
            showCloseButton?: boolean | undefined;
            onClose?: (() => void) | undefined;
            children?: React.ReactNode;
        } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Omit<Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<{}>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<Omit<Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Omit<Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Omit<Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Omit<Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<{
            new (props: (Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }) | Readonly<Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>): {
                render(): JSX.Element;
                context: any;
                setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<ThemeProps & LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
                forceUpdate(callback?: (() => void) | undefined): void;
                readonly props: Readonly<Omit<ThemeProps & LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }> & Readonly<{
                    children?: React.ReactNode;
                }>;
                state: Readonly<{}>;
                refs: {
                    [key: string]: React.ReactInstance;
                };
                componentDidMount?(): void;
                shouldComponentUpdate?(nextProps: Readonly<Omit<ThemeProps & LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, nextState: Readonly<{}>, nextContext: any): boolean;
                componentWillUnmount?(): void;
                componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<ThemeProps & LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, prevState: Readonly<{}>): any;
                componentDidUpdate?(prevProps: Readonly<Omit<ThemeProps & LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, prevState: Readonly<{}>, snapshot?: any): void;
                componentWillMount?(): void;
                UNSAFE_componentWillMount?(): void;
                componentWillReceiveProps?(nextProps: Readonly<Omit<ThemeProps & LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, nextContext: any): void;
                UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<ThemeProps & LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, nextContext: any): void;
                componentWillUpdate?(nextProps: Readonly<Omit<ThemeProps & LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, nextState: Readonly<{}>, nextContext: any): void;
                UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<ThemeProps & LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, nextState: Readonly<{}>, nextContext: any): void;
            };
            new (props: Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, context: any): {
                render(): JSX.Element;
                context: any;
                setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<ThemeProps & LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
                forceUpdate(callback?: (() => void) | undefined): void;
                readonly props: Readonly<Omit<ThemeProps & LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }> & Readonly<{
                    children?: React.ReactNode;
                }>;
                state: Readonly<{}>;
                refs: {
                    [key: string]: React.ReactInstance;
                };
                componentDidMount?(): void;
                shouldComponentUpdate?(nextProps: Readonly<Omit<ThemeProps & LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, nextState: Readonly<{}>, nextContext: any): boolean;
                componentWillUnmount?(): void;
                componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<ThemeProps & LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, prevState: Readonly<{}>): any;
                componentDidUpdate?(prevProps: Readonly<Omit<ThemeProps & LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, prevState: Readonly<{}>, snapshot?: any): void;
                componentWillMount?(): void;
                UNSAFE_componentWillMount?(): void;
                componentWillReceiveProps?(nextProps: Readonly<Omit<ThemeProps & LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, nextContext: any): void;
                UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<ThemeProps & LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, nextContext: any): void;
                componentWillUpdate?(nextProps: Readonly<Omit<ThemeProps & LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, nextState: Readonly<{}>, nextContext: any): void;
                UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<ThemeProps & LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, nextState: Readonly<{}>, nextContext: any): void;
            };
            displayName: string;
            contextType: React.Context<string>;
            ComposedComponent: React.ComponentType<({ classnames: cx, className, showCloseButton, onClose, children, classPrefix, translate: __, ...rest }: ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element>;
        } & import("hoist-non-react-statics").NonReactStatics<({ classnames: cx, className, showCloseButton, onClose, children, classPrefix, translate: __, ...rest }: ThemeProps & LocaleProps & {
            className?: string | undefined;
            showCloseButton?: boolean | undefined;
            onClose?: (() => void) | undefined;
            children?: React.ReactNode;
        } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element, {}> & {
            ComposedComponent: ({ classnames: cx, className, showCloseButton, onClose, children, classPrefix, translate: __, ...rest }: ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element;
        }>;
    } & import("hoist-non-react-statics").NonReactStatics<{
        new (props: (Omit<ThemeProps & LocaleProps & {
            className?: string | undefined;
            showCloseButton?: boolean | undefined;
            onClose?: (() => void) | undefined;
            children?: React.ReactNode;
        } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }) | Readonly<Omit<ThemeProps & LocaleProps & {
            className?: string | undefined;
            showCloseButton?: boolean | undefined;
            onClose?: (() => void) | undefined;
            children?: React.ReactNode;
        } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<{}>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Omit<ThemeProps & LocaleProps & {
            className?: string | undefined;
            showCloseButton?: boolean | undefined;
            onClose?: (() => void) | undefined;
            children?: React.ReactNode;
        } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<{}>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<({ classnames: cx, className, showCloseButton, onClose, children, classPrefix, translate: __, ...rest }: ThemeProps & LocaleProps & {
            className?: string | undefined;
            showCloseButton?: boolean | undefined;
            onClose?: (() => void) | undefined;
            children?: React.ReactNode;
        } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element>;
    } & import("hoist-non-react-statics").NonReactStatics<({ classnames: cx, className, showCloseButton, onClose, children, classPrefix, translate: __, ...rest }: ThemeProps & LocaleProps & {
        className?: string | undefined;
        showCloseButton?: boolean | undefined;
        onClose?: (() => void) | undefined;
        children?: React.ReactNode;
    } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element, {}> & {
        ComposedComponent: ({ classnames: cx, className, showCloseButton, onClose, children, classPrefix, translate: __, ...rest }: ThemeProps & LocaleProps & {
            className?: string | undefined;
            showCloseButton?: boolean | undefined;
            onClose?: (() => void) | undefined;
            children?: React.ReactNode;
        } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element;
    }, {}> & {
        ComposedComponent: {
            new (props: (Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }) | Readonly<Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>): {
                render(): JSX.Element;
                context: any;
                setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<ThemeProps & LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
                forceUpdate(callback?: (() => void) | undefined): void;
                readonly props: Readonly<Omit<ThemeProps & LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }> & Readonly<{
                    children?: React.ReactNode;
                }>;
                state: Readonly<{}>;
                refs: {
                    [key: string]: React.ReactInstance;
                };
                componentDidMount?(): void;
                shouldComponentUpdate?(nextProps: Readonly<Omit<ThemeProps & LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, nextState: Readonly<{}>, nextContext: any): boolean;
                componentWillUnmount?(): void;
                componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<ThemeProps & LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, prevState: Readonly<{}>): any;
                componentDidUpdate?(prevProps: Readonly<Omit<ThemeProps & LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, prevState: Readonly<{}>, snapshot?: any): void;
                componentWillMount?(): void;
                UNSAFE_componentWillMount?(): void;
                componentWillReceiveProps?(nextProps: Readonly<Omit<ThemeProps & LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, nextContext: any): void;
                UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<ThemeProps & LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, nextContext: any): void;
                componentWillUpdate?(nextProps: Readonly<Omit<ThemeProps & LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, nextState: Readonly<{}>, nextContext: any): void;
                UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<ThemeProps & LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, nextState: Readonly<{}>, nextContext: any): void;
            };
            new (props: Omit<ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }, context: any): {
                render(): JSX.Element;
                context: any;
                setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<ThemeProps & LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
                forceUpdate(callback?: (() => void) | undefined): void;
                readonly props: Readonly<Omit<ThemeProps & LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }> & Readonly<{
                    children?: React.ReactNode;
                }>;
                state: Readonly<{}>;
                refs: {
                    [key: string]: React.ReactInstance;
                };
                componentDidMount?(): void;
                shouldComponentUpdate?(nextProps: Readonly<Omit<ThemeProps & LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, nextState: Readonly<{}>, nextContext: any): boolean;
                componentWillUnmount?(): void;
                componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
                getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<ThemeProps & LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, prevState: Readonly<{}>): any;
                componentDidUpdate?(prevProps: Readonly<Omit<ThemeProps & LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, prevState: Readonly<{}>, snapshot?: any): void;
                componentWillMount?(): void;
                UNSAFE_componentWillMount?(): void;
                componentWillReceiveProps?(nextProps: Readonly<Omit<ThemeProps & LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, nextContext: any): void;
                UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<ThemeProps & LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, nextContext: any): void;
                componentWillUpdate?(nextProps: Readonly<Omit<ThemeProps & LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, nextState: Readonly<{}>, nextContext: any): void;
                UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<ThemeProps & LocaleProps & {
                    className?: string | undefined;
                    showCloseButton?: boolean | undefined;
                    onClose?: (() => void) | undefined;
                    children?: React.ReactNode;
                } & React.HTMLAttributes<HTMLDivElement>, keyof LocaleProps> & {
                    locale?: string | undefined;
                    translate?: ((str: string, ...args: any[]) => string) | undefined;
                }>, nextState: Readonly<{}>, nextContext: any): void;
            };
            displayName: string;
            contextType: React.Context<string>;
            ComposedComponent: React.ComponentType<({ classnames: cx, className, showCloseButton, onClose, children, classPrefix, translate: __, ...rest }: ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element>;
        } & import("hoist-non-react-statics").NonReactStatics<({ classnames: cx, className, showCloseButton, onClose, children, classPrefix, translate: __, ...rest }: ThemeProps & LocaleProps & {
            className?: string | undefined;
            showCloseButton?: boolean | undefined;
            onClose?: (() => void) | undefined;
            children?: React.ReactNode;
        } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element, {}> & {
            ComposedComponent: ({ classnames: cx, className, showCloseButton, onClose, children, classPrefix, translate: __, ...rest }: ThemeProps & LocaleProps & {
                className?: string | undefined;
                showCloseButton?: boolean | undefined;
                onClose?: (() => void) | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element;
        };
    };
    static Title: {
        new (props: (Omit<ThemeProps & {
            className?: string | undefined;
            children?: React.ReactNode;
        } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps) | Readonly<Omit<ThemeProps & {
            className?: string | undefined;
            children?: React.ReactNode;
        } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>): {
            render(): JSX.Element;
            context: any;
            setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<{}>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Omit<ThemeProps & {
            className?: string | undefined;
            children?: React.ReactNode;
        } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<{}>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<({ classnames: cx, className, children, classPrefix, ...rest }: ThemeProps & {
            className?: string | undefined;
            children?: React.ReactNode;
        } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element>;
    } & import("hoist-non-react-statics").NonReactStatics<({ classnames: cx, className, children, classPrefix, ...rest }: ThemeProps & {
        className?: string | undefined;
        children?: React.ReactNode;
    } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element, {}> & {
        ComposedComponent: ({ classnames: cx, className, children, classPrefix, ...rest }: ThemeProps & {
            className?: string | undefined;
            children?: React.ReactNode;
        } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element;
    };
    static Body: {
        new (props: (Omit<ThemeProps & {
            className?: string | undefined;
            children?: React.ReactNode;
        } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps) | Readonly<Omit<ThemeProps & {
            className?: string | undefined;
            children?: React.ReactNode;
        } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>): {
            render(): JSX.Element;
            context: any;
            setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<{}>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Omit<ThemeProps & {
            className?: string | undefined;
            children?: React.ReactNode;
        } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<{}>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<({ classnames: cx, className, children, classPrefix, ...rest }: ThemeProps & {
            className?: string | undefined;
            children?: React.ReactNode;
        } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element>;
    } & import("hoist-non-react-statics").NonReactStatics<({ classnames: cx, className, children, classPrefix, ...rest }: ThemeProps & {
        className?: string | undefined;
        children?: React.ReactNode;
    } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element, {}> & {
        ComposedComponent: ({ classnames: cx, className, children, classPrefix, ...rest }: ThemeProps & {
            className?: string | undefined;
            children?: React.ReactNode;
        } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element;
    };
    static Footer: {
        new (props: (Omit<ThemeProps & {
            className?: string | undefined;
            children?: React.ReactNode;
        } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps) | Readonly<Omit<ThemeProps & {
            className?: string | undefined;
            children?: React.ReactNode;
        } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>): {
            render(): JSX.Element;
            context: any;
            setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<{}>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Omit<ThemeProps & {
            className?: string | undefined;
            children?: React.ReactNode;
        } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<{}>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<ThemeProps & {
                className?: string | undefined;
                children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLDivElement>, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<({ classnames: cx, className, children, classPrefix, ...rest }: ThemeProps & {
            className?: string | undefined;
            children?: React.ReactNode;
        } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element>;
    } & import("hoist-non-react-statics").NonReactStatics<({ classnames: cx, className, children, classPrefix, ...rest }: ThemeProps & {
        className?: string | undefined;
        children?: React.ReactNode;
    } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element, {}> & {
        ComposedComponent: ({ classnames: cx, className, children, classPrefix, ...rest }: ThemeProps & {
            className?: string | undefined;
            children?: React.ReactNode;
        } & React.HTMLAttributes<HTMLDivElement>) => JSX.Element;
    };
    componentDidMount(): void;
    componentWillUnmount(): void;
    handleEnter: () => void;
    handleEntered: () => void;
    handleExited: () => void;
    modalRef: (ref: any) => void;
    handleRootClickCapture(e: MouseEvent): void;
    handleRootClick(e: MouseEvent): void;
    render(): JSX.Element;
}
declare const _default: {
    new (props: (Omit<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
        container: HTMLElement;
        size: string;
        overlay: boolean;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps) | Readonly<Omit<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
        container: HTMLElement;
        size: string;
        overlay: boolean;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Omit<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
        container: HTMLElement;
        size: string;
        overlay: boolean;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, keyof ThemeProps> & import("../theme").ThemeOutterProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Omit<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Omit<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Omit<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Omit<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Omit<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Omit<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Omit<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, keyof ThemeProps> & import("../theme").ThemeOutterProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<{
        new (props: (Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }) | Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<{}>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<{}>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof Modal>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof Modal, {}> & {
        ComposedComponent: typeof Modal;
    }>;
} & import("hoist-non-react-statics").NonReactStatics<{
    new (props: (Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
        container: HTMLElement;
        size: string;
        overlay: boolean;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }) | Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
        container: HTMLElement;
        size: string;
        overlay: boolean;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }>): {
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
        container: HTMLElement;
        size: string;
        overlay: boolean;
    }, never>> & {
        locale?: string | undefined;
        translate?: ((str: string, ...args: any[]) => string) | undefined;
    }, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType: React.Context<string>;
    ComposedComponent: React.ComponentType<typeof Modal>;
} & import("hoist-non-react-statics").NonReactStatics<typeof Modal, {}> & {
    ComposedComponent: typeof Modal;
}, {}> & {
    ComposedComponent: {
        new (props: (Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }) | Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }>): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<{}>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
            container: HTMLElement;
            size: string;
            overlay: boolean;
        }, never>> & {
            locale?: string | undefined;
            translate?: ((str: string, ...args: any[]) => string) | undefined;
        }, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<{}>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<Pick<Omit<ModalProps, keyof LocaleProps>, "classPrefix" | "classnames" | "className" | "theme" | "disabled" | "show" | "onHide" | "onEntered" | "onExited" | "closeOnEsc" | "contentClassName" | "closeOnOutside"> & Partial<Pick<Omit<ModalProps, keyof LocaleProps>, "overlay" | "size" | "container">> & Partial<Pick<{
                container: HTMLElement;
                size: string;
                overlay: boolean;
            }, never>> & {
                locale?: string | undefined;
                translate?: ((str: string, ...args: any[]) => string) | undefined;
            }>, nextState: Readonly<{}>, nextContext: any): void;
        };
        displayName: string;
        contextType: React.Context<string>;
        ComposedComponent: React.ComponentType<typeof Modal>;
    } & import("hoist-non-react-statics").NonReactStatics<typeof Modal, {}> & {
        ComposedComponent: typeof Modal;
    };
} & {
    Header: typeof Modal.Header;
    Title: typeof Modal.Title;
    Body: typeof Modal.Body;
    Footer: typeof Modal.Footer;
};
export default _default;
