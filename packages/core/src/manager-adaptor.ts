import type {CapacitorSqliteConnection, CapacitorSqliteConnectionMode, CapacitorSqliteManager} from './capacitor-sqlite';
import type {ISQLiteConnection} from '@capacitor-community/sqlite';
import {CapacitorSqliteConnectionAdaptor} from './connection-adaptor';

class CapacitorSqliteManagerAdaptor implements CapacitorSqliteManager {

  // Properties
  //--------------------------------------------------

  private readonly __manager: ISQLiteConnection;

  // Constructor
  //--------------------------------------------------

  public constructor(manager: ISQLiteConnection) {
    this.__manager = manager;
  }

  // Methods
  //--------------------------------------------------

  // CapacitorSqliteConnection API
  //

  public async initWebStore(): Promise<void> {
    return this._manager.initWebStore();
  }

  public async saveToStore(databaseName: string): Promise<void> {
    return this._manager.saveToStore(databaseName);
  }

  public async createConnection(
      database: string,
      encrypted: boolean,
      mode: CapacitorSqliteConnectionMode,
      version: number,
      isReadonly: boolean
  ): Promise<CapacitorSqliteConnection> {
    return (new CapacitorSqliteConnectionAdaptor(await this._manager.createConnection(database, encrypted, mode, version, isReadonly)));
  }

  public async isConnected(databaseName: string, isReadonly: boolean): Promise<boolean | undefined> {
    return (await this._manager.isConnection(databaseName, isReadonly)).result;
  }

  public async retrieveConnection(databaseName: string, isReadonly: boolean): Promise<CapacitorSqliteConnection> {
    return (new CapacitorSqliteConnectionAdaptor(await this._manager.retrieveConnection(databaseName, isReadonly)));
  }

  public async closeConnection(databaseName: string, isReadonly: boolean): Promise<void> {
    return this._manager.closeConnection(databaseName, isReadonly);
  }

  public async checkConnectionsConsistency(): Promise<boolean | undefined> {
    return (await this._manager.checkConnectionsConsistency()).result;
  }

  // Getters/setters
  //--------------------------------------------------

  protected get _manager(): ISQLiteConnection {
    return this.__manager;
  }
}

export {
  CapacitorSqliteManagerAdaptor
};
