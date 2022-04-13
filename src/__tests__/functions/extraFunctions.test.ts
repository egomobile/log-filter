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

describe('extra filter functions', () => {
    it('should be able to handle extra filter functions', async () => {
        const expression = 'repeatStr(lower("tm+mk "), 5) == "TM+MK TM+MK TM+MK TM+MK TM+MK "';

        const { entries, log } = createLogWithFilter(expression, {
            extraFunctions: {
                repeatStr: (val: any, count: number) => String(val).repeat(count),
                // this should only demonstrate that it is possible to overwrite existing functions
                lower: (val: any) => String(val).toUpperCase()
            }
        });

        log();

        expect(entries.length).toBe(1);
    });
});
