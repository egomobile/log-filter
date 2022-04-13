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

type GetTimeFunc = (useLocalTimeOrTimeZone: boolean | string, time?: Dayjs) => Dayjs;

export const now = dayJS('1979-09-05 23:09:19.079');

export const consoleLogs: {
    args: any[];
    method: string;
}[] = [];
const addConsoleLog = (method: keyof Console, args: any[]) => {
    consoleLogs.push({
        method,
        args
    });
};

console.error = (...args: any[]) => addConsoleLog('error', args);
console.log = (...args: any[]) => addConsoleLog('log', args);
console.trace = (...args: any[]) => addConsoleLog('trace', args);
console.warn = (...args: any[]) => addConsoleLog('warn', args);
console.debug = (...args: any[]) => addConsoleLog('debug', args);
console.info = (...args: any[]) => addConsoleLog('info', args);
console.clear = () => {
    consoleLogs.length = 0;
};

jest.mock('../utils/internal', () => {
    const oldModule = {
        ...jest.requireActual<any>('../utils/internal')
    };

    const getTimeOld: GetTimeFunc = oldModule['getTime'];
    const getTimeNew: GetTimeFunc = function (useLocalTimeOrTimeZone: boolean | string, time?: any): Dayjs {
        if (arguments.length < 2) {
            time = now.clone();  // use static mock time
        }

        return getTimeOld(useLocalTimeOrTimeZone, time);
    };

    return {
        ...oldModule,

        getTime: getTimeNew
    };
});