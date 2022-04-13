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
import { createLogger, LogType } from '@egomobile/log';
import { withFilterExpression } from '..';

export interface ILogEntry {
    args: any[];
    time: Dayjs;
    type: LogType;
}

export function createLogWithFilter(...expressions: string[]) {
    const entries: ILogEntry[] = [];

    const log = createLogger();

    log.filter(withFilterExpression(expressions, {
        fallbackValue: false
    }));

    log.use((type, args) => {
        entries.push({
            args,
            time: dayJS.utc(),
            type
        });
    });

    return {
        entries,
        log
    };
}
