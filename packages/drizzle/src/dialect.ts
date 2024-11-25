import {SQLiteAsyncDialect} from 'drizzle-orm/sqlite-core';
import {entityKind} from 'drizzle-orm';

class CapacitorSqliteDialect extends SQLiteAsyncDialect {

  // Static properties
  //--------------------------------------------------

  public static override readonly [entityKind]: string = 'CapacitorSqliteDialect';

}

export {
  CapacitorSqliteDialect
};
