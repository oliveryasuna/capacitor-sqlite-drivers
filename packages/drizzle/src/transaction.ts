import type {TablesRelationalConfig} from 'drizzle-orm';
import {entityKind, type RelationalSchemaConfig, sql} from 'drizzle-orm';
import {SQLiteTransaction} from 'drizzle-orm/sqlite-core';
import type {CapacitorSqliteDialect} from './dialect';
import type {CapacitorSqliteSession} from './session';

class CapacitorSqliteTransaction<
    TFullSchema extends Record<string, unknown>,
    TSchema extends TablesRelationalConfig
> extends SQLiteTransaction<'async', void, TFullSchema, TSchema> {

  // Static fields
  //--------------------------------------------------

  public static override readonly [entityKind]: string = 'CapacitorSqliteTransaction';

  // Properties
  //--------------------------------------------------

  private readonly __dialect: CapacitorSqliteDialect;

  private readonly __session: CapacitorSqliteSession<TFullSchema, TSchema>;

  // Constructor
  //--------------------------------------------------

  public constructor(
      dialect: CapacitorSqliteDialect,
      session: CapacitorSqliteSession<TFullSchema, TSchema>,
      schema: (RelationalSchemaConfig<TSchema> | undefined),
      nestedIndex?: number
  ) {
    super('async', dialect, session, schema, nestedIndex);

    this.__dialect = dialect;
    this.__session = session;
  }

  // Methods
  //--------------------------------------------------

  // SQLiteTransaction API
  //

  public override async transaction<T>(transaction: ((tx: CapacitorSqliteTransaction<TFullSchema, TSchema>) => Promise<T>)): Promise<T> {
    const savepointName: string = `sp${this.nestedIndex + 1}`;

    const tx = (new CapacitorSqliteTransaction(this.__dialect, this.__session, this.schema, (this.nestedIndex + 1)));

    try {
      const result: T = (await transaction(tx));

      tx.run(sql.raw(`release savepoint ${savepointName}`));

      return result;
    } catch(err: unknown) {
      tx.run(sql.raw(`rollback to savepoint ${savepointName}`));

      throw err;
    }
  }

}

export {
  CapacitorSqliteTransaction
};
