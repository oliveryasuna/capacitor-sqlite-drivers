import type {SelectedFieldsOrdered} from 'drizzle-orm/operations';
import type {AnyColumn} from 'drizzle-orm/column';
import {Column} from 'drizzle-orm/column';
import type {DriverValueDecoder} from 'drizzle-orm/sql/sql';
import {SQL} from 'drizzle-orm/sql/sql';
import {is} from 'drizzle-orm/entity';
import {getTableName} from 'drizzle-orm/table';

type CustomResultMapper = ((rows: unknown[][], mapColumnValue?: ((value: unknown) => unknown)) => unknown);

// Copied from drizzle-orm/src/utils.ts and slightly modified.
// eslint-disable-next-line func-style -- Copied.
const mapResultRow = (<TResult>(columns: SelectedFieldsOrdered<AnyColumn>, row: unknown[], joinsNotNullableMap: Record<string, boolean> | undefined): TResult => {
  // Key -> nested object key, value -> table name if all fields in the nested object are from the same table, false otherwise
  const nullifyMap: Record<string, string | false> = {};

  const result = columns.reduce<Record<string, any>>(
      (result, {path, field}, columnIndex) => {
        let decoder: (DriverValueDecoder<unknown, unknown> | undefined) = undefined;
        if(is(field, Column)) {
          decoder = field;
        } else if(is(field, SQL)) {
          decoder = (field as any).decoder;
        } else {
          decoder = (field.sql as any).decoder;
        }
        let node = result;
        for(const [pathChunkIndex, pathChunk] of path.entries()) {
          if(pathChunkIndex < path.length - 1) {
            if(!(pathChunk in node)) {
              node[pathChunk] = {};
            }
            node = node[pathChunk];
          } else {
            const rawValue = row[columnIndex]!;
            // eslint-disable-next-line no-multi-assign -- Copied.
            const value = node[pathChunk] = rawValue === null ? null : (decoder as any).mapFromDriverValue(rawValue);

            if(joinsNotNullableMap && is(field, Column) && path.length === 2) {
              const objectName = path[0]!;
              if(!(objectName in nullifyMap)) {
                nullifyMap[objectName] = value === null ? getTableName(field.table) : false;
              } else if(
                  typeof nullifyMap[objectName] === 'string' && nullifyMap[objectName] !== getTableName(field.table)
              ) {
                nullifyMap[objectName] = false;
              }
            }
          }
        }
        return result;
      },
      {}
  );

  // Nullify all nested objects from nullifyMap that are nullable
  if(joinsNotNullableMap && Object.keys(nullifyMap).length > 0) {
    for(const [objectName, tableName] of Object.entries(nullifyMap)) {
      if(typeof tableName === 'string' && !joinsNotNullableMap[tableName]) {
        result[objectName] = null;
      }
    }
  }

  return result as TResult;
});

export type {
  CustomResultMapper
};
export {
  mapResultRow
};
