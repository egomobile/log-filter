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

import dayJS, { Dayjs } from 'dayjs';

export function getTime(useLocalTimeOrTimeZone: boolean | string, time: any = dayJS.utc()): Dayjs {
    if (typeof useLocalTimeOrTimeZone === 'string') {
        return time.tz(useLocalTimeOrTimeZone || 'UTC');
    } else if (!!useLocalTimeOrTimeZone) {
        return time.local();
    } else {
        return time;
    }
}

export function isNil(val: unknown): val is (null | typeof undefined) {
    return typeof val === 'undefined' ||
        val === null;
}

export function toStringSafe(val: any): string {
    if (typeof val === 'string') {
        return val;
    }

    if (isNil(val)) {
        return '';
    }

    if (typeof val['toString'] === 'function') {
        return String(val.toString());
    }

    if (val instanceof Error) {
        return `[ERROR]: ${val.name}\n\n${val.message}\n\n${val.stack}`;
    }

    if (typeof val === 'object') {
        return JSON.stringify(val);
    }

    return String(val);
}
