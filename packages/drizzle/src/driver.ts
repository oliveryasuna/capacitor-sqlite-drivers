import {BaseSQLiteDatabase} from 'drizzle-orm/sqlite-core';
import type {CapacitorSqliteConnection, CapacitorSqliteConnectionOptions, CapacitorSqliteManager} from '@oliveryasuna/capacitor-sqlite-core';
import type {DrizzleConfig, Logger, RelationalSchemaConfig, TablesRelationalConfig} from 'drizzle-orm';
import {createTableRelationsHelpers, DefaultLogger, extractTablesRelationalConfig} from 'drizzle-orm';
import {CapacitorSqliteSession} from './session';
import {CapacitorSqliteDialect} from './dialect';

const __acquireConnection = (async(manager: CapacitorSqliteManager, connectionOptions: CapacitorSqliteConnectionOptions): Promise<CapacitorSqliteConnection> => {
  const isConnectionConsistent: (boolean | undefined) = (await manager.checkConnectionsConsistency());
  const isConnected: (boolean | undefined) = (await manager.isConnected(connectionOptions.database, connectionOptions.readonly));

  if(isConnectionConsistent && isConnected) {
    // Connection is consistent and already open.
    // Retrieve the connection.

    return manager.retrieveConnection(connectionOptions.database, connectionOptions.readonly);
  }

  // Connect is not consistent or not open.
  // Create a new connection.

  const connection: CapacitorSqliteConnection = (await manager.createConnection(
      connectionOptions.database,
      connectionOptions.encrypted,
      connectionOptions.mode,
      connectionOptions.version,
      connectionOptions.readonly
  ));

  await connection.open();

  return connection;
});

type CapacitorSqliteDatabase<TSchema extends Record<string, unknown> = Record<string, never>> = BaseSQLiteDatabase<'async', void, TSchema>;

const drizzle = (async <TSchema extends Record<string, unknown> = Record<string, never>>(
    manager: CapacitorSqliteManager,
    connectionOptions: CapacitorSqliteConnectionOptions,
    platform: string,
    config: DrizzleConfig<TSchema> = {}
): Promise<CapacitorSqliteDatabase<TSchema>> => {
  const dialect = (new CapacitorSqliteDialect({
    ...((config.casing !== undefined) && {casing: config.casing})
  }));

  let logger: (Logger | undefined) = undefined;

  if(config.logger === true) {
    logger = (new DefaultLogger());
  } else if(config.logger !== false) {
    logger = config.logger;
  }

  let schema: (RelationalSchemaConfig<TablesRelationalConfig> | undefined) = undefined;

  if(config.schema !== undefined) {
    type TablesConfig = {
      tables: TablesRelationalConfig;
      tableNamesMap: Record<string, string>;
    };

    const tablesConfig: TablesConfig = extractTablesRelationalConfig(config.schema, createTableRelationsHelpers);

    schema = {
      fullSchema: config.schema,
      schema: tablesConfig.tables,
      tableNamesMap: tablesConfig.tableNamesMap
    };
  }

  if(platform === 'web') {
    await manager.initWebStore();
  }

  const session = (new CapacitorSqliteSession(
      manager,
      (await __acquireConnection(manager, connectionOptions)),
      connectionOptions,
      platform,
      dialect,
      schema,
      {
        ...((logger !== undefined) && {logger: logger})
      }
  ));

  return (new BaseSQLiteDatabase('async', dialect, session, schema) as CapacitorSqliteDatabase<TSchema>);
});

export type {
  CapacitorSqliteDatabase
};
export {
  drizzle
};
