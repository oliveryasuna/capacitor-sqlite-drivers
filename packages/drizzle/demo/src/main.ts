import {Capacitor} from '@capacitor/core';
import {SplashScreen} from '@capacitor/splash-screen';
import {db, initDb} from './db';
import {sql} from 'drizzle-orm';
import {personTable} from './schema';

const __bootstrap = (async(): Promise<void> => {
  await initDb();

  await db.run(sql.raw('create table if not exists person (id integer primary key autoincrement, name text not null);'));

  const listEl: HTMLUListElement = document.querySelector<HTMLUListElement>('#list')!;
  const inputEl: HTMLInputElement = document.querySelector<HTMLInputElement>('#name')!;

  const __updateList = (async(): Promise<void> => {
    const rows = (await db
        .select({
          name: personTable.name
        })
        .from(personTable));

    console.log(JSON.stringify(rows));

    listEl.innerHTML = rows.map((row: {name: string}): string => `<li>${row.name}</li>`).join('');
  });

  void __updateList();

  document.querySelector<HTMLButtonElement>('#add')!.addEventListener(
      'click',
      ((): void => {
        const add = (async(): Promise<void> => {
          await db
              .insert(personTable)
              .values({name: inputEl.value});

          await __updateList();
        });

        void add();
      })
  );

  await SplashScreen.hide();
});

if(Capacitor.getPlatform() !== 'web') {
  void __bootstrap()
      .catch((err: unknown): void => {
        console.error(err);

        const containerEl: HTMLDivElement = document.createElement('div');

        containerEl.style.width = '100%';
        containerEl.style.height = '100%';
        containerEl.style.display = 'flex';
        containerEl.style.flexDirection = 'column';
        containerEl.style.alignItems = 'center';
        containerEl.style.justifyContent = 'center';
        containerEl.style.textAlign = 'center';

        containerEl.innerHTML = `
          <h1>A fatal error occurred.</h1>
          <p>Please restart the app.</p>
          <p>If the issue persists, please contact</p>
        `;

        void SplashScreen.hide();
      });
} else {
  void import('./web')
      .then((module: {init: ((bootstrapFn: (() => Promise<void>)) => Promise<void>)}): void => {
        void module.init(__bootstrap);
      });
}
