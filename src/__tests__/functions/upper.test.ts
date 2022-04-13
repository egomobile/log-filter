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
    'Foo BAR buZZ',
    'Ich bin der Geist der stets verneint! Unde das mit Recht; denn alles was entsteht ist werth daß es zu Grunde geht; Drum besser wär\'s daß nichts entstünde. So ist denn alles was ihr Sünde, Zerstörung, kurz das Böse nennt, Mein eigentliches Element.'
];

describe('upper() filter function', () => {
    it.each(values)('should convert input value to upper chars', async (value) => {
        const expected = String(value).toUpperCase();

        const { entries, log } = createLogWithFilter(`upper(arg0) == ${JSON.stringify(expected)}`);

        log(value);

        expect(entries.length).toBe(1);
    });
});
