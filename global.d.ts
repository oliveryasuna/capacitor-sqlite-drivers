import '@total-typescript/ts-reset';

declare global {
  type AddPrefix<Obj extends Record<string, any>, Prefix extends string> = {
    [Key in (keyof Obj) as (Key extends string ? `${Prefix}${Key}` : never)]: Obj[Key];
  };
}
