import {JeepSqlite} from 'jeep-sqlite/dist/components/jeep-sqlite';
import localforage from 'localforage';
import {SQLITE} from './db';

customElements.define('jeep-sqlite', JeepSqlite);

document.body.appendChild(document.createElement('jeep-sqlite'));

const init = (async(bootstrapFn: (() => Promise<void>)): Promise<void> => {
  await customElements.whenDefined('jeep-sqlite');
  await SQLITE.initWebStore();

  await bootstrapFn();

  ((): void => {
    const createUploadDbButton = ((): HTMLButtonElement => {
      const button: HTMLButtonElement = document.createElement('button');

      button.textContent = 'Upload DB';
      button.onclick = ((): void => {
        const input: HTMLInputElement = document.createElement('input');

        input.type = 'file';
        input.accept = 'db';
        input.onchange = (async(): Promise<void> => {
          const file: File = input.files![0]!;
          const data: Uint8Array = new Uint8Array(await file.arrayBuffer());

          const db: LocalForage = localforage.createInstance({
            name: 'jeepSqliteStore',
            storeName: 'databases'
          });

          await db.setItem('drizzle.db', data);
        });

        input.click();
      });

      return button;
    });
    const createDownloadDbButton = ((): HTMLButtonElement => {
      const button: HTMLButtonElement = document.createElement('button');

      button.textContent = 'Download DB';
      button.onclick = (async(): Promise<void> => {
        const db: LocalForage = localforage.createInstance({
          name: 'jeepSqliteStore',
          storeName: 'databases'
        });

        const data: Uint8Array = (await db.getItem<Uint8Array>('drizzle.db'))!;
        const blob: Blob = new Blob([data], {type: 'application/vnd.sqlite3'});

        const a: HTMLAnchorElement = document.createElement('a');

        a.href = URL.createObjectURL(blob);
        a.download = 'drizzle.db';

        a.click();
      });

      return button;
    });

    const uploadDbButton: HTMLButtonElement = createUploadDbButton();
    const downloadDbButton: HTMLButtonElement = createDownloadDbButton();

    const style: HTMLStyleElement = document.createElement('style');

    style.textContent = `
      #db-buttons-container {
        position: fixed;
        bottom: 0;
        right: 0;
        padding: 8px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
    `;

    document.head.appendChild(style);

    const container: HTMLElement = document.createElement('div');

    container.id = 'db-buttons-container';

    container.appendChild(uploadDbButton);
    container.appendChild(downloadDbButton);

    document.body.appendChild(container);
  })();
});

export {
  init
};
