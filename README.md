[![npm](https://img.shields.io/npm/v/@egomobile/log-filter.svg)](https://www.npmjs.com/package/@egomobile/log-filter)
[![last build](https://img.shields.io/github/workflow/status/egomobile/log-filter/Publish)](https://github.com/egomobile/log-filter/actions?query=workflow%3APublish)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/egomobile/log-filter/pulls)

# @egomobile/log-filter

> Extension for [js-log](https://github.com/egomobile/js-log) with utilities to handle [extended filters](https://www.npmjs.com/package/filtrex).

## Install

Execute the following command from your project folder, where your `package.json` file is stored:

```bash
npm install --save @egomobile/log-filter
```

The following modules are defined in [peerDependencies](https://nodejs.org/uk/blog/npm/peer-dependencies/) and have to be installed manually:

- [@egomobile/log](https://github.com/egomobile/js-log)

## Usage

### Quick example

```typescript
import log from "@egomobile/log";
import { withFilterExpression } from "@egomobile/log-filter";

// only warning or errors
const expression = 'severity == "warn" or severity == "error"';

log.use(withFilterExpression(expression));

// will log
log.warn("foo");
log.error("foo");

// will not log:
log("foo");
log.debug("foo");
log.info("foo");
log.trace("foo");
```

### Syntax

The syntax is described [here](https://github.com/m93a/filtrex#expressions).

### Constants

| Name        | Description                                                                                                        | Example                                                              |
| ----------- | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| `args`      | An array with all arguments, which were submitted to log function.                                                 | `"foo" in args`                                                      |
| `debug`     | Value of [LogType.Debug](https://egomobile.github.io/js-log/enums/LogType.html#Debug).                             | `type == debug`                                                      |
| `default`   | Value of [LogType.Default](https://egomobile.github.io/js-log/enums/LogType.html#Default).                         | `type == default`                                                    |
| `error`     | Value of [LogType.Error](https://egomobile.github.io/js-log/enums/LogType.html#Error).                             | `type == error`                                                      |
| `false`     | Value of [false](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean).        | `isDebug == false`                                                   |
| `info`      | Value of [LogType.Info](https://egomobile.github.io/js-log/enums/LogType.html#Info).                               | `type == info`                                                       |
| `isDebug`   | Indicates if `type` has value of [LogType.Debug](https://egomobile.github.io/js-log/enums/LogType.html#Debug).     | `isDebug and type == debug`                                          |
| `isDefault` | Indicates if `type` has value of [LogType.Default](https://egomobile.github.io/js-log/enums/LogType.html#Default). | `isDefault and type == default`                                      |
| `isError`   | Indicates if `type` has value of [LogType.Error](https://egomobile.github.io/js-log/enums/LogType.html#Error).     | `isError and type == error`                                          |
| `isInfo`    | Indicates if `type` has value of [LogType.Info](https://egomobile.github.io/js-log/enums/LogType.html#Info).       | `isInfo and type == info`                                            |
| `isTrace`   | Indicates if `type` has value of [LogType.Trace](https://egomobile.github.io/js-log/enums/LogType.html#Trace).     | `isTrace and type == trace`                                          |
| `isWarn`    | Indicates if `type` has value of [LogType.Warn](https://egomobile.github.io/js-log/enums/LogType.html#Warn).       | `isWarn and type == warn`                                            |
| `null`      | Value of [null](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null).            | `arg0 != null`                                                       |
| `severity`  | `type` as string in lower case characters.                                                                         | `severity in ("debug", "default", "error", "info", "trace", "warn")` |
| `trace`     | Value of [LogType.Trace](https://egomobile.github.io/js-log/enums/LogType.html#Trace).                             | `type == trace`                                                      |
| `true`      | Value of [true](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean).         | `isError == true`                                                    |
| `type`      | A value of [LogType](https://egomobile.github.io/js-log/enums/LogType.html).                                       | `type not in (debug, trace)`                                         |
| `undefined` | Value of [undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined).  | `arg0 != undefined`                                                  |
| `warn`      | Value of [LogType.Warn](https://egomobile.github.io/js-log/enums/LogType.html#Warn).                               | `type == warn`                                                       |

Additionally there will also dynamic constants be added, based on the number of arguments, which are submitted to a log function:

```typescript
// arg0 == "foo" and message0 == "foo"
// arg1 == 42 and message1 == "42"
// arg2 == false and message2 == "false"
// arg3 == null and message3 == ""
// arg4 == undefined and message4 == ""
log("foo", 42, false, null, undefined);
```

It is also possible to add extra constants:

```typescript
import log, { LogType } from "@egomobile/log";
import {
  IGetExtraLogFilterConstantsContext,
  LogFilterConstants,
  withFilterExpression,
} from "@egomobile/log-filter";

const expression =
  'foo == 42 and lowerMessage1 == "foo bar baz" and upperSeverity == "WARN" and error == undefined';

log.use(
  withFilterExpression(expression, {
    getExtraConstants: ({ type, args }: IGetExtraLogFilterConstantsContext) => {
      const extraConstants: LogFilterConstants = {
        // static value
        foo: 42,
        // functions will be handled as getters
        upperSeverity: () => LogType[type].toUpperCase(),
        // remove constant
        error: undefined,
      };

      // add extra and dynamic constants
      // lowerMessage<index + 1>
      // with lowercase values of items
      // of 'args'
      args.forEach((a, index) => {
        extraConstants[`lowerMessage${index + 1}`] = String(a).toLowerCase();
      });

      return extraConstants;
    },
  })
);

// should log
log.warn("FOO BAR BAZ");

// should not log
log("FOO BAR BAZ");
log.warn("FUH BAR BAZZ");
```

### Functions

| Name                                                                           | Description                                                                                                                                                                                 | Example                                                                                                  |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `concat(..args: any[])`                                                        | Handles a list of arguments as strings and concats them to one without using a separator.                                                                                                   | `concat("Tanja", " M.") == "Tanja M."`                                                                   |
| `day(useLocalTimeOrTimezone: boolean \| string)`                               | Returns the current day of the current month.                                                                                                                                               | `day() >= 1 and day() <= 31`                                                                             |
| `endOf(value: any, unit: string, useLocalTimeOrTimezone: boolean \| string)`   | Returns a value, which represents the end of a time area.                                                                                                                                   | `endOf(now(), "day") >= now()`                                                                           |
| `every(value: any, ...args: any[])`                                            | Handles a value as string and checks if all arguments are included.                                                                                                                         | `every("foo Bar Bazz", "foo", "Bar", "Baz")`                                                             |
| `hour(useLocalTimeOrTimezone: boolean \| string)`                              | Returns the current hour.                                                                                                                                                                   | `hour() >= 0 and hour() <= 23`                                                                           |
| `isFalsy(val: any)`                                                            | Checks if a value is [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy).                                                                                                      | `isFalsy(arg0)`                                                                                          |
| `isNil(val: any)`                                                              | Checks if a value is [null](https://developer.mozilla.org/en-US/docs/Glossary/null) or [undefined](https://developer.mozilla.org/en-US/docs/Glossary/undefined).                            | `isNil(arg0)`                                                                                            |
| `isNull(val: any)`                                                             | Checks if a value is [null](https://developer.mozilla.org/en-US/docs/Glossary/null).                                                                                                        | `isNull(arg0)`                                                                                           |
| `isoWeek(useLocalTimeOrTimezone: boolean \| string)`                           | Returns the current ISO week.                                                                                                                                                               | `isoWeek() >= 1 and isoWeek() <= 53`                                                                     |
| `isoWeekday(useLocalTimeOrTimezone: boolean \| string)`                        | Returns the current ISO weekday.                                                                                                                                                            | `isoWeekday() >= 1 and isoWeekday() <= 7`                                                                |
| `isTruthy(val: any)`                                                           | Checks if a value is [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy).                                                                                                    | `isTruthy(arg0)`                                                                                         |
| `isUndefined(val: any)`                                                        | Checks if a value is [undefined](https://developer.mozilla.org/en-US/docs/Glossary/undefined).                                                                                              | `isUndefined(arg0)`                                                                                      |
| `item(arr: any, key: any = 0)`                                                 | Returns the value of an array-like object.                                                                                                                                                  | `item(args, 1) == "foo"`                                                                                 |
| `join(seperator: any, ..args: any[])`                                          | Handles a list of arguments as strings and joins them to one, using a separator.                                                                                                            | `join(" + ", "MK", "TM") == "MK + TM"`                                                                   |
| `len(val: any)`                                                                | Returns the length of a value.                                                                                                                                                              | `len("foo") == 3 and len(args) >= 1`                                                                     |
| `log(val: any, returnValue: any = true)`                                       | [Logs](https://developer.mozilla.org/en-US/docs/Web/API/Console/log) a value.                                                                                                               | `log(args)`                                                                                              |
| `lower(val: any)`                                                              | Handles a value as string and converts its characters to lowercase.                                                                                                                         | `lower("FoO") == "foo"`                                                                                  |
| `ltrim(val: any)`                                                              | Handles a value as string and removes leading whitespace characters.                                                                                                                        | `ltrim(" foo ") == "foo "`                                                                               |
| `minute(useLocalTimeOrTimezone: boolean \| string)`                            | Returns the current minute.                                                                                                                                                                 | `minute() >= 0 and minute() <= 59`                                                                       |
| `month(useLocalTimeOrTimezone: boolean \| string)`                             | Returns the current month.                                                                                                                                                                  | `month() >= 1 and month() <= 12`                                                                         |
| `ms(useLocalTimeOrTimezone: boolean \| string)`                                | Returns the current milliseconds.                                                                                                                                                           | `ms() >= 0 and ms() <= 999`                                                                              |
| `now(useLocalTimeOrTimezone: boolean \| string)`                               | Returns the [UNIX timestamp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/valueOf) of the current time.                                            | `log(now())`                                                                                             |
| `regex(val: any, pattern: string, flags: string = "i")`                        | Handles a value as string and checks for a [regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp).                                   | `regex("Foo Bar Bazz", "(bar)")`                                                                         |
| `rtrim(val: any)`                                                              | Handles a value as string and removes ending whitespace characters.                                                                                                                         | `rtrim(" foo ") == " foo"`                                                                               |
| `second(useLocalTimeOrTimezone: boolean \| string)`                            | Returns the current second.                                                                                                                                                                 | `second() >= 0 and second() <= 59`                                                                       |
| `some(value: any, ...args: any[])`                                             | Handles a value as string and checks if a least one argument is included.                                                                                                                   | `some("bar FoO BAZZ", "FoO", "BAR", "baz")`                                                              |
| `startOf(value: any, unit: string, useLocalTimeOrTimezone: boolean \| string)` | Returns a value, which represents the start of a time area.                                                                                                                                 | `startOf(now(), "day") <= now()`                                                                         |
| `str(value: any)`                                                              | Converts a value to a string, which is not [null](https://developer.mozilla.org/en-US/docs/Glossary/null) and not [undefined](https://developer.mozilla.org/en-US/docs/Glossary/undefined). | `str(0) == "0"`                                                                                          |
| `trim(val: any)`                                                               | Handles a value as string and removes leading and ending whitespace characters.                                                                                                             | `trim(" foo ") == "foo"`                                                                                 |
| `typeOf(value: any)`                                                           | Returns the type of a value.                                                                                                                                                                | `log(typeOf(arg0)) and typeOf(args) == "array" and typeOf(null) == "null" and typeOf("foo") == "string"` |
| `upper(val: any)`                                                              | Handles a value as string and converts its characters to uppercase.                                                                                                                         | `upper("fOo") == "FOO"`                                                                                  |
| `year(useLocalTimeOrTimezone: boolean \| string)`                              | Returns the current year.                                                                                                                                                                   | `year() == 1979 and month() == 9 and day() == 5`                                                         |

It is possible, to add or remove functions:

```typescript
import log from "@egomobile/log";
import { withFilterExpression } from "@egomobile/log-filter";

const str = (val: any) => String(val);
const repeatStr = (val: any, count: number) => str(val).repeat(count);

const expression = 'repeatStr(arg0, 5) == "TM+MK TM+MK TM+MK TM+MK TM+MK "';

log.use(
  withFilterExpression(expression, {
    extraFunctions: {
      // new, custom function
      repeatStr,
      // overwrite existing function
      str,

      // remove these
      ltrim: undefined,
      rtrim: undefined,
    },
  })
);

// will log
log("TM+MK ");
// will not log
log("foo");
```

## Credits

The module makes use of:

- [Day.js](https://day.js.org/)
- [Filtrex](https://github.com/m93a/filtrex) by [Michal Grňo](https://github.com/m93a)

## Documentation

The API documentation can be found [here](https://egomobile.github.io/log-filter/).
