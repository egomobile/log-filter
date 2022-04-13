// This file is part of the @egomobile/log-filter distribution.
// Copyright (c) Next.e.GO Mobile SE, Aachen, Germany (https://e-go-mobile.com/)
//
// @egomobile/log-filter is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as
// published by the Free Software Foundation, version 3.
//
// @egomobile/log-filter is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
// Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.

// do this very first
import dayJS from 'dayjs';
import dayJS_isoWeek from 'dayjs/plugin/isoWeek';
import dayJS_timezone from 'dayjs/plugin/timezone';
import dayJS_utc from 'dayjs/plugin/utc';
dayJS.extend(dayJS_timezone);
dayJS.extend(dayJS_utc);
dayJS.extend(dayJS_isoWeek);

import { compileExpression } from 'filtrex';
import { LoggerFilter, LogType } from '@egomobile/log';
import { getTime, toStringSafe } from './utils/internal';
import type { Nilable, Optional } from './types/internal';

/**
 * A function, which returns extra constants.
 *
 * @returns {LogFilterConstants} The extra functions.
 */
export type GetExtraLogFilterConstantsFunc =
    (context: IGetExtraLogFilterConstantsContext) => Nilable<LogFilterConstants>;

/**
 * A context for a 'GetExtraLogFilterConstantsFunc' call.
 */
export interface IGetExtraLogFilterConstantsContext {
    /**
     * The arguments, submitted to the log function.
     */
    args: any[];
    /**
     * The current repository of constants.
     */
    constants: LogFilterConstants;
    /**
     * The type.
     */
    type: LogType;
}

/**
 * Log filter constants.
 */
export type LogFilterConstants = Record<string, any>;

/**
 * A repository of log filter functions.
 */
export type LogFilterFunctions = Record<string, Function>;

/**
 * A repository of log filter functions with overwrites.
 */
export type LogFilterFunctionsWithOverwrites = Record<string, Optional<Function>>;

/**
 * Custom options for 'withFilterExpression()' function.
 */
export interface IWithFilterExpressionOptions {
    /**
     * The behavior on how to connect the result of expressions.
     *
     * Default: 'or'
     */
    behavior?: Nilable<'and' | 'or'>;
    /**
     * The value to return, if no expression has been defined.
     *
     * Default: (true)
     */
    emptyValue?: any;
    /**
     * Extra functions to use.
     */
    extraFunctions?: Nilable<LogFilterFunctionsWithOverwrites>;
    /**
     * The value to return, if, whyever, the execution
     * of compiled filter expression fails.
     *
     * Default: (true)
     */
    fallbackValue?: any;
    /**
     * An optional function, which returns extra constants.
     */
    getExtraConstants?: Nilable<GetExtraLogFilterConstantsFunc>;
}

/**
 * Global and common filter functions.
 */
export const commonFilterFunctions: LogFilterFunctions = {
    /**
     * Handles a list of arguments as strings
     * and concats them to one without using a separator.
     *
     * @example
     * ```
     * concat("foo", "Bar", "buzz")  // "fooBarbuzz"
     * ```
     *
     * @param {any[]} [args] One or more argument.
     *
     * @returns {string} The arguments as concated string.
     */
    concat(...args: any[]): string {
        return args
            .map((a) => toStringSafe(a))
            .join('');
    },
    /**
     * Returns the current day of the current month.
     *
     * @param {any} [useLocalTimeOrTimeZone] If this is a string, a custom timezone is used.
     *                                       Otherwise the value indicates to use UTC or local time.
     *
     * @returns {number} The day.
     */
    day(useLocalTimeOrTimeZone: any = false): number {
        return getTime(useLocalTimeOrTimeZone).date();
    },
    /**
     * Moves a time value to an end of an area.
     *
     * @example
     * ```
     * endOf("1979-09-23 05:09:00")  // "1979-09-23 23:59:59"
     * endOf("1979-09-23 05:09:00", "hour")  // "1979-09-23 05:59:59"
     * endOf("1979-09-23 05:09:00", "month")  // "1979-09-30 23:59:59"
     * ```
     *
     * @param {any} value The time value.
     * @param {any} [unit] The custom unit.
     * @param {any} [useLocalTimeOrTimeZone] If this is a string, a custom timezone is used.
     *                                       Otherwise the value indicates to use UTC or local time.
     *
     * @returns {number} The number.
     */
    endOf(value: any, unit: any = 'day', useLocalTimeOrTimeZone: any = false): number {
        return getTime(useLocalTimeOrTimeZone, value).endOf(
            toStringSafe(unit).toLowerCase().trim() as any
        ).valueOf();
    },
    /**
     * Handles a value as string and checks if all arguments are included.
     *
     * @example
     * ```
     * // (true)
     * every("foo bar", "foo")
     * every("foo bar", "bar", "foo")
     *
     * // (false)
     * every("foo bar", "baz")
     * every("foo bar", "bar", "foo", "baz")
     * every("Foo", "foo")
     * every("baz", "bar")
     * ```
     *
     * @param {any} val The value to check.
     * @param {any[]} [args] The list of arguments.
     *
     * @returns {boolean} Every args is inside val or not.
     */
    every(val: any, ...args: any[]): boolean {
        const s = toStringSafe(val);

        return args
            .map((a) => toStringSafe(a))
            .every((x) => s.includes(x));
    },
    /**
     * Returns the current hour.
     *
     * @param {any} [useLocalTimeOrTimeZone] If this is a string, a custom timezone is used.
     *                                       Otherwise the value indicates to use UTC or local time.
     *
     * @returns {number} The hour.
     */
    hour(useLocalTimeOrTimeZone: any = false): number {
        return getTime(useLocalTimeOrTimeZone).hour();
    },
    /**
     * Checks if a value is falsy.
     *
     * @param {any} val The value to check.
     *
     * @returns {boolean} Is falsy or not.
     */
    isFalsy(val: any): boolean {
        return !val;
    },
    /**
     * Checks if a value is (null) or (undefined).
     *
     * @param {any} val The value to check.
     *
     * @returns {boolean} Is (null) / (undefined) or not.
     */
    isNil(val: any): val is (null | typeof undefined) {
        return typeof val === 'undefined' ||
            val === null;
    },
    /**
     * Checks if a value is (null).
     *
     * @param {any} val The value to check.
     *
     * @returns {boolean} Is (null) or not.
     */
    isNull(val: any): val is null {
        return val === null;
    },
    /**
     * Returns the current ISO week.
     *
     * @param {any} [useLocalTimeOrTimeZone] If this is a string, a custom timezone is used.
     *                                       Otherwise the value indicates to use UTC or local time.
     *
     * @returns {number} The ISO week.
     */
    isoWeek(useLocalTimeOrTimeZone: any = false): number {
        return getTime(useLocalTimeOrTimeZone).isoWeek();
    },
    /**
     * Returns the current ISO weekday.
     *
     * @param {any} [useLocalTimeOrTimeZone] If this is a string, a custom timezone is used.
     *                                       Otherwise the value indicates to use UTC or local time.
     *
     * @returns {number} The ISO weekday.
     */
    isoWeekday(useLocalTimeOrTimeZone: any = false): number {
        return getTime(useLocalTimeOrTimeZone).isoWeekday();
    },
    /**
     * Checks if a value is truthy.
     *
     * @param {any} val The value to check.
     *
     * @returns {boolean} Is truthy or not.
     */
    isTruthy(val: any): boolean {
        return !!val;
    },
    /**
     * Checks if a value is (undefined).
     *
     * @param {any} val The value to check.
     *
     * @returns {boolean} Is (undefined) or not.
     */
    isUndefined(val: any): val is (typeof undefined) {
        return typeof val === 'undefined';
    },
    /**
     * Returns the item from an array-like object.
     *
     * @example
     * ```
     * // get 1st item
     * item(args)
     * item(args, 0)
     *
     * item(args, 1)  // 2nd
     * item(args, -1)  // last
     * ```
     *
     * @param {any} arr The array like object.
     * @param {PropertyKey} key The key. Default: 0
     *
     * @returns {any} The value from key of array.
     */
    item(arr: any, key: PropertyKey = 0): any {
        let arrKey = key;
        if (typeof arrKey === 'number') {
            if (arrKey < 0) {
                arrKey = (arr ? arr.length : 0) + arrKey;
            }
        }

        return arr?.[arrKey];
    },
    /**
     * Handles a list of arguments as strings
     * and join them to one, using a separator.
     *
     * @example
     * ```
     * join(" + ", "foo", "Bar", "buzz")  // "foo + Bar + buzz"
     * ```
     *
     * @param {any} sep The separator to use.
     * @param {any[]} [args] One or more argument.
     *
     * @returns {string} The arguments as concated string.
     */
    join(sep: any, ...args: any[]): string {
        return args
            .map((a) => toStringSafe(a))
            .join(toStringSafe(sep));
    },
    /**
     * Returns the length of a value.
     *
     * @example
     * ```
     * len(0)  // 0
     * len(null)  // 0
     * len(undefined)  // 0
     * len(false)  // 0
     * len("foo")  // 3
     * len(args)
     * ```
     *
     * @param {any} val The value to check.
     *
     * @returns {number} The length.
     */
    len(val: any): number {
        if (!val) {
            return 0;
        }

        return val.length;
    },
    /**
     * Does a console.log() for a value.
     *
     * @example
     * ```
     * log(arg0)
     * log(type)
     * ```
     *
     * @param {any} val The value to log.
     * @param {any} [result] The custom result value. Default: (true)
     *
     * @returns {any} The result.
     */
    log(val: any, result: any = true): any {
        console.log(val);
        return result;
    },
    /**
     * Handles a value as a string and returns it in lower case chars.
     *
     * @example
     * ```
     * lower("HeLLo")  // "hello"
     * ```
     *
     * @param {any} val The input value.
     *
     * @returns {string} The output value.
     */
    lower(val: any): string {
        return toStringSafe(val).toLowerCase();
    },
    /**
     * Handles a value as a string and removes leading white chars.
     *
     * @example
     * ```
     * ltrim("  foo   ")  // "foo   "
     * ```
     *
     * @param {any} val The input value.
     *
     * @returns {string} The output value.
     */
    ltrim(val: any): string {
        return toStringSafe(val).trimStart();
    },
    /**
     * Returns the current minute.
     *
     * @param {any} [useLocalTimeOrTimeZone] If this is a string, a custom timezone is used.
     *                                       Otherwise the value indicates to use UTC or local time.
     *
     * @returns {number} The minute.
     */
    minute(useLocalTimeOrTimeZone: any = false): number {
        return getTime(useLocalTimeOrTimeZone).minute();
    },
    /**
     * Returns the current month.
     *
     * @param {any} [useLocalTimeOrTimeZone] If this is a string, a custom timezone is used.
     *                                       Otherwise the value indicates to use UTC or local time.
     *
     * @returns {number} The month.
     */
    month(useLocalTimeOrTimeZone: any = false): number {
        return getTime(useLocalTimeOrTimeZone).month() + 1;
    },
    /**
     * Returns the current millisecond.
     *
     * @param {any} [useLocalTimeOrTimeZone] If this is a string, a custom timezone is used.
     *                                       Otherwise the value indicates to use UTC or local time.
     *
     * @returns {number} The millisecond.
     */
    ms(useLocalTimeOrTimeZone: any = false): number {
        return getTime(useLocalTimeOrTimeZone).millisecond();
    },
    /**
     * This returns the number of milliseconds since the UNIX epoch.
     *
     * @param {any} [useLocalTimeOrTimeZone] If this is a string, a custom timezone is used.
     *                              Otherwise the value indicates to use UTC or local time.
     *
     * @returns {number} The number of milliseconds since theUNIX epoch.
     */
    now(useLocalTimeOrTimeZone: any = false): number {
        return getTime(useLocalTimeOrTimeZone).valueOf();
    },
    /**
     * Handles a value as string and checks if a regular expression matches.
     *
     * @example
     * ```
     * regex(message0, "^(foo|bar)")
     * ```
     *
     * @param {any} val The input value.
     * @param {any} pattern The pattern.
     * @param {any} [flags] The custom flags. Default: 'i'
     *
     * @returns {boolean} Value does match or not.
     */
    regex(val: any, pattern: any, flags: any = 'i'): boolean {
        const s = toStringSafe(val);
        const rx = new RegExp(toStringSafe(pattern), toStringSafe(flags) || undefined);

        return rx.test(s);
    },
    /**
     * Handles a value as a string and removes ending white chars.
     *
     * @example
     * ```
     * rtrim("  foo   ")  // "  foo"
     * ```
     *
     * @param {any} val The input value.
     *
     * @returns {string} The output value.
     */
    rtrim(val: any): string {
        return toStringSafe(val).trimEnd();
    },
    /**
     * Returns the current second.
     *
     * @param {any} [useLocalTimeOrTimeZone] If this is a string, a custom timezone is used.
     *                                       Otherwise the value indicates to use UTC or local time.
     *
     * @returns {number} The number.
     */
    second(useLocalTimeOrTimeZone: any = false): number {
        return getTime(useLocalTimeOrTimeZone).second();
    },
    /**
     * Handles a value as string and checks if any
     * argument is inside it.
     *
     * @example
     * ```
     * // (true)
     * some("foo bar", "foo")
     * some("foo bar", "bar", "foo")
     * some("foo bar", "bar", "foo", "baz")
     *
     * // (false)
     * some("foo bar", "baz")
     * some("Foo", "foo")
     * some("baz", "bar")
     * ```
     *
     * @param {any} val The value to check.
     * @param {any[]} [args] The list of arguments.
     *
     * @returns {boolean} Some item of args is inside val or not.
     */
    some(val: any, ...args: any[]): boolean {
        const s = toStringSafe(val);

        return args
            .map((a) => toStringSafe(a))
            .some((x) => s.includes(x));
    },
    /**
     * Moves a time value to a start of an area.
     *
     * @example
     * ```
     * startOf("1979-09-23 05:09:00")  // "1979-09-23 00:00:00"
     * startOf("1979-09-23 05:09:00", "hour")  // "1979-09-23 05:00:00"
     * startOf("1979-09-23 05:09:00", "month")  // "1979-09-01 00:00:00"
     * ```
     *
     * @param {any} value The time value.
     * @param {any} [unit] The custom unit.
     * @param {any} [useLocalTimeOrTimeZone] If this is a string, a custom timezone is used.
     *                                       Otherwise the value indicates to use UTC or local time.
     *
     * @returns {number} The number.
     */
    startOf(value: any, unit: any = 'day', useLocalTimeOrTimeZone: any = false): number {
        return getTime(useLocalTimeOrTimeZone, value).startOf(
            toStringSafe(unit).toLowerCase().trim() as any
        ).valueOf();
    },
    /**
     * Converts a value to a string.
     *
     * @example
     * ```
     * str(2)  // "2"
     * str(0)  // 2
     * str(null)  // ""
     * str(false)  // "false"
     * str(true)  // "true"
     * str("foo")  // "foo"
     * ```
     *
     * @param {any} val The input value.
     *
     * @returns {string} The output value.
     */
    str(val: any): string {
        return toStringSafe(val);
    },
    /**
     * Handles a value as a string and removes leading and ending white chars.
     *
     * @example
     * ```
     * trim("  foo   ")  // "foo"
     * ```
     *
     * @param {any} val The input value.
     *
     * @returns {string} The output value.
     */
    trim(val: any): string {
        return toStringSafe(val).trim();
    },
    /**
     * Returns the type of a value.
     *
     * @example
     * ```
     * typeOf(args)  // "array"
     * typeOf(0)  // "number"
     * typeOf(null)  // "null"
     * typeOf(undefined)  // "undefined"
     * typeOf(false)  // "boolean"
     * typeOf("foo")  // "string"
     * ```
     *
     * @param {any} val The input value.
     *
     * @returns {string} The output value.
     */
    typeOf(val: any): string {
        if (val === null) {
            return 'null';
        }
        if (Array.isArray(val)) {
            return 'array';
        }

        return typeof val;
    },
    /**
     * Handles a value as a string and returns it in upper case chars.
     *
     * @example
     * ```
     * upper("hEllO")  // "HELLO"
     * ```
     *
     * @param {any} val The input value.
     *
     * @returns {string} The output value.
     */
    upper(val: any): string {
        return toStringSafe(val).toUpperCase();
    },
    /**
     * Returns the current year.
     *
     * @param {any} [useLocalTimeOrTimeZone] If this is a string, a custom timezone is used.
     *                                       Otherwise the value indicates to use UTC or local time.
     *
     * @returns {number} The number.
     */
    year(useLocalTimeOrTimeZone: any = false): number {
        return getTime(useLocalTimeOrTimeZone).year();
    }
};

const validBehaviors = ['and', 'or'];

/**
 * Creates a new instance of a log filter, which uses Filterex.
 *
 * @example
 * ```
 * import log from '@egomobile/log'
 * import { withFilterExpression } from '@egomobile/log-filter'
 *
 * // only warning or errors
 * const expression = 'severity == "warn" or severity == "error"'
 *
 * log.use(withFilterExpression(expression))
 *
 * // will log:
 * log.warn('foo')
 * log.error('')
 *
 * // will not log:
 * log('foo')
 * log.debug('foo')
 * log.info('foo')
 * log.trace('foo')
 * ```
 *
 * @param {string} expression The expression to compile.
 * @param {Nilable<IWithFilterExpressionOptions>} [options] Custom options.
 *
 * @returns {LoggerFilter} The new instance.
 */
export function withFilterExpression(expression: string | string[], options?: Nilable<IWithFilterExpressionOptions>): LoggerFilter {
    const emptyValue: any = typeof options?.emptyValue === 'undefined' ? true : !!options?.emptyValue;
    const fallbackValue: any = typeof options?.fallbackValue === 'undefined' ? true : !!options?.fallbackValue;

    let behavior = options?.behavior ?? 'and';
    if (!behavior?.length) {
        behavior = 'or';
    }
    if (!validBehaviors.includes(behavior)) {
        throw new TypeError('options.behavior must be one of the following values: ' + validBehaviors.join());
    }

    let listOfExpressions: string[];
    if (typeof expression === 'string') {
        listOfExpressions = [expression];
    } else {
        listOfExpressions = expression;
    }

    if (listOfExpressions.some(expr => typeof expr !== 'string')) {
        throw new TypeError('all expressions must be of type string');
    }

    const getExtraConstants = options?.getExtraConstants || (() => null);
    if (typeof getExtraConstants !== 'function') {
        throw new TypeError('options.getExtraConstants must be of type function');
    }

    if (listOfExpressions.length) {
        const extraFunctions: LogFilterFunctionsWithOverwrites = {
            ...commonFilterFunctions,
            ...(options?.extraFunctions || {})
        };

        const compiledPredicates = listOfExpressions.map((expression) => compileExpression(expression, {
            extraFunctions: extraFunctions as LogFilterFunctions
        }));

        let predicate: (constants: LogFilterConstants) => boolean;
        if (behavior === 'and') {
            predicate = (constants) => compiledPredicates.every((cp) => !!cp(constants));
        } else {
            // default: or
            predicate = (constants) => compiledPredicates.some((cp) => !!cp(constants));
        }

        return (type, args) => {
            const constants: LogFilterConstants = {
                args,
                debug: LogType.Debug,
                default: LogType.Default,
                error: LogType.Error,
                false: false,
                info: LogType.Info,
                isDebug: type === LogType.Debug,
                isDefault: type === LogType.Default,
                isError: type === LogType.Error,
                isInfo: type === LogType.Info,
                isTrace: type === LogType.Trace,
                isWarn: type === LogType.Warn,
                null: null,
                severity: LogType[type].toLowerCase(),
                trace: LogType.Trace,
                true: true,
                type,
                undefined: undefined,
                warn: LogType.Warn
            };

            // add 'arg<INDEX>'
            // and 'message<INDEX>'
            // constants
            args.forEach((a, i) => {
                constants[`arg${i}`] = a;
                constants[`message${i}`] = toStringSafe(a);
            });

            const extraConstantContext: IGetExtraLogFilterConstantsContext = {
                args,
                constants,
                type
            };

            const extraConstants = getExtraConstants(extraConstantContext);
            if (extraConstants) {
                Object.entries(extraConstants).forEach(([name, value]) => {
                    constants[name] = typeof value === 'function' ?
                        value(extraConstantContext) :
                        value;
                });
            }

            try {
                return predicate(constants);
            } catch {
                return fallbackValue;
            }
        };
    } else {
        return () => emptyValue;  // filter is deactivated
    }
}
