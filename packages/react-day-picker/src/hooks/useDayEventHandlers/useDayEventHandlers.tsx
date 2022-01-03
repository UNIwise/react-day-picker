import React, { KeyboardEventHandler } from 'react';

import { useDayPicker } from 'contexts/DayPicker';
import { useFocusContext } from 'contexts/Focus';
import { useSelectMultiple } from 'contexts/SelectMultiple';
import { useSelectRange } from 'contexts/SelectRange';
import { useSelectSingle } from 'contexts/SelectSingle';
import { isDayPickerMultiple } from 'types/DayPickerMultiple';
import { isDayPickerRange } from 'types/DayPickerRange';
import { isDayPickerSingle } from 'types/DayPickerSingle';
import { ModifiersStatus } from 'types/Modifiers';

type EventHandlers =
  | 'onClick'
  | 'onFocus'
  | 'onBlur'
  | 'onKeyDown'
  | 'onKeyUp'
  | 'onMouseEnter'
  | 'onMouseLeave'
  | 'onTouchCancel'
  | 'onTouchEnd'
  | 'onTouchMove'
  | 'onTouchStart';

export type DayEventHandlers = Pick<
  React.HTMLProps<HTMLButtonElement>,
  EventHandlers
>;

/**
 * This hook returns details about the content to render in the day cell.
 *
 *
 * When a day cell is rendered in the table, DayPicker can either:
 *
 * - render nothing: when the day is outside the month or has matched the
 *   "hidden" modifier.
 * - render a button. When a selection mode is set, DayPicker renders a button
 *   to allow the focus and the selection. In case of `custom` selection
 *   mode, DayPicker expects a `onDayClick` prop to render a button.
 * - render a non-interactive element: when no selection mode is set, the day
 *   cell shouldn’t respond to any interaction. DayPicker should render a `div`
 *   or a `span`.
 *
 * ### Usage
 *
 * Use this hook to customize the behavior of the [[Day]] component. Create a
 * new `Day` component using this hook and pass it to the `components` prop.
 * The source of [[Day]] can be a good starting point.
 *
 */
export function useDayEventHandlers(
  date: Date,
  modifiersStatus: ModifiersStatus
): DayEventHandlers {
  const dayPicker = useDayPicker();
  const single = useSelectSingle();
  const multiple = useSelectMultiple();
  const range = useSelectRange();
  const {
    focusDayAfter,
    focusDayBefore,
    focusWeekAfter,
    focusWeekBefore,
    blur,
    focus,
    focusMonthBefore,
    focusMonthAfter,
    focusYearBefore,
    focusYearAfter,
    focusStartOfWeek,
    focusEndOfWeek
  } = useFocusContext();

  const onClick: React.MouseEventHandler = (e) => {
    if (isDayPickerSingle(dayPicker)) {
      single.onDayClick?.(date, modifiersStatus, e);
    } else if (isDayPickerMultiple(dayPicker)) {
      multiple.onDayClick?.(date, modifiersStatus, e);
    } else if (isDayPickerRange(dayPicker)) {
      range.onDayClick?.(date, modifiersStatus, e);
    }
    dayPicker.onDayClick?.(date, modifiersStatus, e);
  };

  const onFocus: React.FocusEventHandler = (e) => {
    focus(date);
    dayPicker.onDayFocus?.(date, modifiersStatus, e);
  };

  const onBlur: React.FocusEventHandler = (e) => {
    blur();
    dayPicker.onDayBlur?.(date, modifiersStatus, e);
  };

  const onMouseEnter: React.MouseEventHandler = (e) => {
    dayPicker.onDayMouseEnter?.(date, modifiersStatus, e);
  };
  const onMouseLeave: React.MouseEventHandler = (e) => {
    dayPicker.onDayMouseLeave?.(date, modifiersStatus, e);
  };
  const onTouchCancel: React.TouchEventHandler = (e) => {
    dayPicker.onDayTouchCancel?.(date, modifiersStatus, e);
  };
  const onTouchEnd: React.TouchEventHandler = (e) => {
    dayPicker.onDayTouchEnd?.(date, modifiersStatus, e);
  };
  const onTouchMove: React.TouchEventHandler = (e) => {
    dayPicker.onDayTouchMove?.(date, modifiersStatus, e);
  };
  const onTouchStart: React.TouchEventHandler = (e) => {
    dayPicker.onDayTouchStart?.(date, modifiersStatus, e);
  };

  const onKeyUp: React.KeyboardEventHandler = (e) => {
    dayPicker.onDayKeyUp?.(date, modifiersStatus, e);
  };

  const onKeyDown: KeyboardEventHandler = (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        e.stopPropagation();
        dayPicker.dir === 'rtl' ? focusDayAfter() : focusDayBefore();
        break;
      case 'ArrowRight':
        e.preventDefault();
        e.stopPropagation();
        dayPicker.dir === 'rtl' ? focusDayBefore() : focusDayAfter();
        break;
      case 'ArrowDown':
        e.preventDefault();
        e.stopPropagation();
        focusWeekAfter();
        break;
      case 'ArrowUp':
        e.preventDefault();
        e.stopPropagation();
        focusWeekBefore();
        break;
      case 'PageUp':
        e.preventDefault();
        e.stopPropagation();
        e.shiftKey ? focusYearBefore() : focusMonthBefore();
        break;
      case 'PageDown':
        e.preventDefault();
        e.stopPropagation();
        e.shiftKey ? focusYearAfter() : focusMonthAfter();
        break;
      case 'Home':
        e.preventDefault();
        e.stopPropagation();
        focusStartOfWeek();
        break;
      case 'End':
        e.preventDefault();
        e.stopPropagation();
        focusEndOfWeek();
        break;
    }
    dayPicker.onDayKeyDown?.(date, modifiersStatus, e);
  };

  const eventHandlers: DayEventHandlers = {
    onClick,
    onFocus,
    onBlur,
    onKeyDown,
    onKeyUp,
    onMouseEnter,
    onMouseLeave,
    onTouchCancel,
    onTouchEnd,
    onTouchMove,
    onTouchStart
  };

  return eventHandlers;
}
