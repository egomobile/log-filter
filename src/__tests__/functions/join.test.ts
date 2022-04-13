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

describe('join() filter function', () => {
    it('should convert items to strings and join them to one using a separator', async () => {
        const args = [1, '2'];

        const sep = ' + ';
        const expected = args.join(sep);
        const argList = args.map(a => JSON.stringify(a)).join(',');

        const { entries, log } = createLogWithFilter(`join(${JSON.stringify(sep)}, ${argList}) == ${JSON.stringify(expected)}`);

        log('foo');

        expect(entries.length).toBe(1);
    });
});
