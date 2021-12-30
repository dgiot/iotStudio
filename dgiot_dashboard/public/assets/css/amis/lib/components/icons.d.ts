/**
 * @file Icon
 * @description
 * @author fex
 */
import React from 'react';
import CloseIcon from '../icons/close.svg';
import UnDoIcon from '../icons/undo.svg';
import ReDoIcon from '../icons/redo.svg';
import EnterIcon from '../icons/enter.svg';
import VolumeIcon from '../icons/volume.svg';
import MuteIcon from '../icons/mute.svg';
import PlayIcon from '../icons/play.svg';
import PauseIcon from '../icons/pause.svg';
import LeftArrowIcon from '../icons/left-arrow.svg';
import RightArrowIcon from '../icons/right-arrow.svg';
import CheckIcon from '../icons/check.svg';
import PlusIcon from '../icons/plus.svg';
import MinusIcon from '../icons/minus.svg';
import PencilIcon from '../icons/pencil.svg';
export declare const closeIcon: JSX.Element;
export declare const unDoIcon: JSX.Element;
export declare const reDoIcon: JSX.Element;
export declare const enterIcon: JSX.Element;
export declare const volumeIcon: JSX.Element;
export declare const muteIcon: JSX.Element;
export declare const playIcon: JSX.Element;
export declare const pauseIcon: JSX.Element;
export declare const leftArrowIcon: JSX.Element;
export declare const rightArrowIcon: JSX.Element;
export declare function getIcon(key: string): React.ReactType<{}>;
export declare function hasIcon(iconName: string): boolean;
export declare function registerIcon(key: string, component: React.ReactType<{}>): void;
export declare function Icon({ icon, className, ...rest }: {
    icon: string;
} & React.ComponentProps<any>): JSX.Element;
export { CloseIcon, UnDoIcon, ReDoIcon, EnterIcon, VolumeIcon, MuteIcon, PlayIcon, PauseIcon, LeftArrowIcon, RightArrowIcon, CheckIcon, PlusIcon, MinusIcon, PencilIcon };
