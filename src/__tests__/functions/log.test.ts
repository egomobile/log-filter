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

import { consoleLogs } from '../_mocks';
import { createLogWithFilter } from '../_utils';

const values = [
    null,
    undefined,
    'foo',
    42,
    true
];

describe('log() filter function', () => {
    it.each(values)('should log value', async (value) => {
        console.clear();

        const { log } = createLogWithFilter('log(arg0)');

        log(value);

        expect(consoleLogs.length).toBe(1);
        expect(consoleLogs[0].method).toBe('log');
        expect(consoleLogs[0].args.length).toBe(1);
        expect(consoleLogs[0].args[0]).toBe(value);
    });
});
