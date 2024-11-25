import type {Logger, Query, RelationalSchemaConfig, TablesRelationalConfig} from 'drizzle-orm';
import {entityKind, NoopLogger} from 'drizzle-orm';
import type {PreparedQueryConfig, SelectedFieldsOrdered, SQLiteExecuteMethod} from 'drizzle-orm/sqlite-core';
import {SQLiteSession} from 'drizzle-orm/sqlite-core';
import type {CapacitorSqliteDialect} from './dialect';
import type {CapacitorSqliteConnection, CapacitorSqliteConnectionOptions, CapacitorSqliteManager} from '@oliveryasuna/capacitor-sqlite-core';
import {CapacitorSqlitePreparedQuery} from './prepared-query';
import {CapacitorSqliteTransaction} from './transaction';

interface CapacitorSqliteSessionOptions {
  logger?: Logger;
}

class CapacitorSqliteSession<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends SQLiteSession<'async', void, TFullSchema, TSchema> {

  // Static properties
  //--------------------------------------------------

  public static override readonly [entityKind]: string = 'CapacitorSqliteSession';

  // Properties
  //--------------------------------------------------

  private readonly __manager: CapacitorSqliteManager;

  private readonly __connection: CapacitorSqliteConnection;

  private readonly __connectionOptions: CapacitorSqliteConnectionOptions;

  private readonly __platform: string;

  private readonly __dialect: CapacitorSqliteDialect;

  private readonly __schema: (RelationalSchemaConfig<TSchema> | undefined);

  private readonly __logger: Logger;

  // Constructor
  //--------------------------------------------------

  public constructor(
      manager: CapacitorSqliteManager,
      connection: CapacitorSqliteConnection,
      connectionOptions: CapacitorSqliteConnectionOptions,
      platform: string,
      dialect: CapacitorSqliteDialect,
      schema: (RelationalSchemaConfig<TSchema> | undefined),
      options: CapacitorSqliteSessionOptions = {}
  ) {
    super(dialect);

    this.__manager = manager;
    this.__connection = connection;
    this.__connectionOptions = connectionOptions;
    this.__platform = platform;
    this.__dialect = dialect;
    this.__schema = schema;
    this.__logger = (options.logger ?? (new NoopLogger()));
  }

  // Methods
  //--------------------------------------------------

  // SQLiteSession API
  //

  public override prepareQuery<T extends PreparedQueryConfig>(
      query: Query,
      _fields: (SelectedFieldsOrdered | undefined),
      executeMethod: SQLiteExecuteMethod,
      isResponseInArrayMode: boolean
  ): CapacitorSqlitePreparedQuery<T> {
    return (new CapacitorSqlitePreparedQuery(
        this._manager,
        this._connection,
        this._connectionOptions,
        this._platform,
        query,
        executeMethod,
        isResponseInArrayMode,
        this._logger
    ));
  }

  public override async transaction<T>(transaction: ((tx: CapacitorSqliteTransaction<TFullSchema, TSchema>) => Promise<T>)): Promise<T> {
    const tx = (new CapacitorSqliteTransaction(this._dialect, this, this._schema));

    await this._connection.beginTransaction();

    try {
      const result: T = (await transaction(tx));

      await this._connection.commitTransaction();

      if(this._platform === 'web') {
        await this._manager.saveToStore(this._connectionOptions.database);
      }

      return result;
    } catch(err: unknown) {
      await this._connection.rollbackTransaction();

      throw err;
    }
  }

  // Getters/setters
  //--------------------------------------------------

  protected get _manager(): CapacitorSqliteManager {
    return this.__manager;
  }

  protected get _connection(): CapacitorSqliteConnection {
    return this.__connection;
  }

  protected get _connectionOptions(): CapacitorSqliteConnectionOptions {
    return this.__connectionOptions;
  }

  protected get _platform(): string {
    return this.__platform;
  }

  protected get _dialect(): CapacitorSqliteDialect {
    return this.__dialect;
  }

  protected get _schema(): (RelationalSchemaConfig<TSchema> | undefined) {
    return this.__schema;
  }

  protected get _logger(): Logger {
    return this.__logger;
  }

}

export type {
  CapacitorSqliteSessionOptions
};
export {
  CapacitorSqliteSession
};
