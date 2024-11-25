import type {CapacitorSqliteChanges, CapacitorSqliteConnection, CapacitorSqliteReturnMode} from './capacitor-sqlite';
import type {ISQLiteDBConnection} from '@capacitor-community/sqlite';

class CapacitorSqliteConnectionAdaptor implements CapacitorSqliteConnection {

  // Properties
  //--------------------------------------------------

  private readonly __connection: ISQLiteDBConnection;

  // Constructors
  //--------------------------------------------------

  public constructor(connection: ISQLiteDBConnection) {
    this.__connection = connection;
  }

  // Methods
  //--------------------------------------------------

  // CapacitorSqliteConnection API
  //

  public async open(): Promise<void> {
    return this._connection.open();
  }

  public async beginTransaction(): Promise<CapacitorSqliteChanges | undefined> {
    return (await this._connection.beginTransaction()).changes;
  }

  public async commitTransaction(): Promise<CapacitorSqliteChanges | undefined> {
    return (await this._connection.commitTransaction()).changes;
  }

  public async rollbackTransaction(): Promise<CapacitorSqliteChanges | undefined> {
    return (await this._connection.rollbackTransaction()).changes;
  }

  public async isTransactionActive(): Promise<boolean | undefined> {
    return (await this._connection.isTransactionActive()).result;
  }

  public async execute(statements: string, isTransaction?: boolean, isSql92?: boolean): Promise<CapacitorSqliteChanges | undefined> {
    return (await this._connection.execute(statements, isTransaction, isSql92)).changes;
  }

  public async query(statement: string, values?: any[], isSql92?: boolean): Promise<unknown[] | undefined> {
    return (await this._connection.query(statement, values, isSql92)).values;
  }

  public async run(
      statement: string,
      values?: any[],
      transaction?: boolean,
      returnMode?: CapacitorSqliteReturnMode,
      isSql92?: boolean
  ): Promise<CapacitorSqliteChanges | undefined> {
    return (await this._connection.run(statement, values, transaction, returnMode, isSql92)).changes;
  }

  // Getters/setters
  //--------------------------------------------------

  protected get _connection(): ISQLiteDBConnection {
    return this.__connection;
  }

}

export {
  CapacitorSqliteConnectionAdaptor
};
