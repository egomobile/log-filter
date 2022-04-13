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

import { createLogWithFilter } from '../_utils';

const values = [
    { value: null, expected: 0 },
    { value: undefined, expected: 0 },
    { value: false, expected: 0 },
    { value: '', expected: 0 },
    { value: 'foo', expected: 3 },
    { value: true, expected: undefined },
    { value: [1, 2, 3, 4], expected: 4 }
];

describe('len() filter function', () => {
    it.each(values)('should return the correct length', async ({ value, expected }) => {
        const { entries, log } = createLogWithFilter(`len(arg0) == ${JSON.stringify(expected)}`);

        log(value);

        expect(entries.length).toBe(1);
    });
});
