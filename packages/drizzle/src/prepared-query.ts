import type {PreparedQueryConfig} from 'drizzle-orm/sqlite-core';
import {type SQLiteExecuteMethod, SQLitePreparedQuery} from 'drizzle-orm/sqlite-core';
import {entityKind, fillPlaceholders, type Logger, type Query} from 'drizzle-orm';
import type {CapacitorSqliteConnection, CapacitorSqliteConnectionOptions, CapacitorSqliteManager} from '@oliveryasuna/capacitor-sqlite-core';

class CapacitorSqlitePreparedQuery<
    T extends PreparedQueryConfig = PreparedQueryConfig
> extends SQLitePreparedQuery<{type: 'async'; run: void; all: T['all']; get: T['get']; values: T['values']; execute: T['execute']}> {

  // Static properties
  //--------------------------------------------------

  public static override readonly [entityKind]: string = 'CapacitorSqlitePreparedQuery';

  // Properties
  //--------------------------------------------------

  private readonly __manager: CapacitorSqliteManager;

  private readonly __connection: CapacitorSqliteConnection;

  private readonly __connectionOptions: CapacitorSqliteConnectionOptions;

  private readonly __platform: string;

  private readonly __isResponseInArrayMode: boolean;

  private readonly __logger: Logger;

  // Constructor
  //--------------------------------------------------

  public constructor(
      manager: CapacitorSqliteManager,
      connection: CapacitorSqliteConnection,
      connectionOptions: CapacitorSqliteConnectionOptions,
      platform: string,
      query: Query,
      executeMethod: SQLiteExecuteMethod,
      isResponseInArrayMode: boolean,
      logger: Logger
  ) {
    super('async', executeMethod, query);

    this.__manager = manager;
    this.__connection = connection;
    this.__connectionOptions = connectionOptions;
    this.__platform = platform;
    this.__isResponseInArrayMode = isResponseInArrayMode;
    this.__logger = logger;
  }

  // Methods
  //--------------------------------------------------

  // SQLitePreparedQuery API
  //

  // Execute a query without a result set.
  // INSERT without RETURNING.
  // UPDATE without RETURNING.
  // DELETE without RETURNING.
  public override async run(placeholderValues?: Record<string, unknown>): Promise<void> {
    const params: unknown[] = fillPlaceholders(this.query.params, (placeholderValues ?? {}));

    this._logger.logQuery(this.query.sql, params);

    await this._connection.run(this.query.sql, params);

    await this._saveToStore();
  }

  // Execute a query and return all rows.
  // SELECT.
  // INSERT with RETURNING.
  // UPDATE with RETURNING.
  // DELETE with RETURNING.
  public override async all(placeholderValues?: Record<string, unknown>): Promise<unknown[]> {
    return this.values(placeholderValues);
  }

  // Execute a query and return the first row.
  // SELECT with LIMIT 1.
  // INSERT (1) with RETURNING.
  // UPDATE (1) with RETURNING.
  // DELETE (1) with RETURNING.
  public override async get(placeholderValues?: Record<string, unknown>): Promise<unknown> {
    return (await this.values(placeholderValues))[0];
  }

  public override async values(placeholderValues?: Record<string, unknown>): Promise<unknown[]> {
    const params: unknown[] = fillPlaceholders(this.query.params, (placeholderValues ?? {}));

    this._logger.logQuery(this.query.sql, params);

    const rows: unknown[] = ((await this._connection.query(this.query.sql, params)) ?? []);

    await this._saveToStore();

    return rows;
  }

  // @ts-expect-error: TS4113 because it is internal.
  public override isResponseInArrayMode(): boolean {
    return this._isResponseInArrayMode;
  }

  // Miscellaneous
  //

  protected async _saveToStore(): Promise<void> {
    if(this._platform !== 'web' || this._getCommand() === 'select') {
      return;
    }

    await this._manager.saveToStore(this._connectionOptions.database);
  }

  protected _getCommand(): string {
    return this.query.sql.substring(0, ((this.query.sql.indexOf(' ') !== -1) ? this.query.sql.indexOf(' ') : undefined)).toLowerCase();
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

  protected get _isResponseInArrayMode(): boolean {
    return this.__isResponseInArrayMode;
  }

  protected get _logger(): Logger {
    return this.__logger;
  }

}

export {
  CapacitorSqlitePreparedQuery
};
