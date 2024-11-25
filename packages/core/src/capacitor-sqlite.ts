/**
 * Similar to `capSQLiteChanges`.
 */
interface CapacitorSqliteChanges {
  changes?: number;
  lastId?: number;
  values?: unknown[];
}

type CapacitorSqliteReturnMode = ('no' | 'all');

/**
 * Similar to `ISQLiteDBConnection`.
 */
interface CapacitorSqliteConnection {
  // State
  //--------------------------------------------------

  open(): Promise<void>;

  // Transaction
  //--------------------------------------------------

  beginTransaction(): Promise<CapacitorSqliteChanges | undefined>;
  commitTransaction(): Promise<CapacitorSqliteChanges | undefined>;
  rollbackTransaction(): Promise<CapacitorSqliteChanges | undefined>;
  isTransactionActive(): Promise<boolean | undefined>;

  // Query
  //--------------------------------------------------

  execute(statements: string, isTransaction?: boolean, isSql92?: boolean): Promise<CapacitorSqliteChanges | undefined>;
  query(statement: string, values?: any[], isSql92?: boolean): Promise<unknown[] | undefined>;
  run(statement: string, values?: any[], isTransaction?: boolean, returnMode?: CapacitorSqliteReturnMode, isSql92?: boolean): Promise<CapacitorSqliteChanges | undefined>;
}

type CapacitorSqliteConnectionMode = ('no-encryption' | 'encryption' | 'secret' | 'decryption' | 'newsecret' | 'wrongsecret');

/**
 * Similar to `capConnectionOptions`.
 */
interface CapacitorSqliteConnectionOptions {
  database: string;
  encrypted: boolean;
  mode: CapacitorSqliteConnectionMode;
  version: number;
  readonly: boolean;
}

/**
 * Similar to `ISQLiteConnection`.
 */
interface CapacitorSqliteManager {
  // Store
  //--------------------------------------------------

  initWebStore(): Promise<void>;
  saveToStore(databaseName: string): Promise<void>;

  // Connection
  //--------------------------------------------------

  createConnection(databaseName: string, encrypted: boolean, mode: CapacitorSqliteConnectionMode, version: number, isReadonly: boolean): Promise<CapacitorSqliteConnection>;
  isConnected(databaseName: string, isReadonly: boolean): Promise<boolean | undefined>;
  retrieveConnection(databaseName: string, isReadonly: boolean): Promise<CapacitorSqliteConnection>;
  closeConnection(databaseName: string, isReadonly: boolean): Promise<void>;
  checkConnectionsConsistency(): Promise<boolean | undefined>;
}

export type {
  CapacitorSqliteChanges,
  CapacitorSqliteReturnMode,
  CapacitorSqliteConnection,
  CapacitorSqliteConnectionMode,
  CapacitorSqliteConnectionOptions,
  CapacitorSqliteManager
};
