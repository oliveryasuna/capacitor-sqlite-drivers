import {int, sqliteTable, text} from 'drizzle-orm/sqlite-core';

const personTable = sqliteTable(
    'person',
    {
      id: int().primaryKey({autoIncrement: true}),
      name: text().notNull()
    }
);

export {
  personTable
};
