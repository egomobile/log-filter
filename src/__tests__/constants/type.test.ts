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

import { LogType } from '@egomobile/log';
import { createLogWithFilter } from '../_utils';

const types: LogType[] = [
    LogType.Debug,
    LogType.Error,
    LogType.Info,
    LogType.Trace,
    LogType.Warn
];

describe('type filter constant', () => {
    it.each(types)('should be the correct value', async (type) => {
        const method = LogType[type].toLowerCase();
        const expected = type;

        const { entries, log } = createLogWithFilter(`type == ${JSON.stringify(expected)}`);

        (log as any)[method]();

        expect(entries.length).toBe(1);
    });
});
