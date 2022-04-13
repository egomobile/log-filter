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

const values: any[] = [
    { value: 'foo', type: 'string' },
    { value: true, type: 'boolean' },
    { value: 42, type: 'number' },
    { value: {}, type: 'object' },
    { value: null, type: 'null' },
    { value: undefined, type: 'undefined' },
    { value: [], type: 'array' }
];

describe('typeOf() filter function', () => {
    it.each(values)('should be return matching type string', async ({ value, type }) => {
        const { entries, log } = createLogWithFilter(`typeOf(arg0) == ${JSON.stringify(type)}`);

        log(value);

        expect(entries.length).toBe(1);
    });
});
