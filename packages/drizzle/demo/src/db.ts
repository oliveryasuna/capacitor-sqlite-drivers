import * as schema from './schema';
import type {CapacitorSqliteDatabase} from '../../src/driver';
import {CapacitorSQLite, SQLiteConnection} from '@capacitor-community/sqlite';
import {drizzle} from '@oliveryasuna/capacitor-sqlite-drizzle';
import {CapacitorSqliteManagerAdaptor} from '@oliveryasuna/capacitor-sqlite-core';
import {Capacitor} from '@capacitor/core';
import {DefaultLogger} from 'drizzle-orm';

const SQLITE: SQLiteConnection = (new SQLiteConnection(CapacitorSQLite));

// eslint-disable-next-line init-declarations -- Demo.
let db: CapacitorSqliteDatabase<typeof schema>;

const initDb = (async(): Promise<void> => {
  db = (await drizzle(
      (new CapacitorSqliteManagerAdaptor(SQLITE)),
      {
        database: 'drizzle',
        encrypted: false,
        mode: 'no-encryption',
        version: 1,
        readonly: false
      },
      Capacitor.getPlatform(),
      {
        schema: schema,
        logger: (new DefaultLogger())
      }
  ));
});

export {
  SQLITE,
  db,
  initDb
};
