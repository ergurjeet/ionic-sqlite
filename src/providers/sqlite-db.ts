import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import 'rxjs/add/operator/map';

@Injectable()
export class SqliteDbProvider {
  private options:{name:string, location:string,createFromLocation:number} = {
    name: "data.db",
    location: 'default',
    createFromLocation:1
  };

  constructor(private platform: Platform, private sqlite: SQLite) { }

  getArticles():Promise<any>{
    let query = "SELECT title FROM articles";
    return this.query(query, [])
      .then(data => {
        var items = [];
        for (var i = 0; i < data.rows.length; i++) {
          items.push(data.rows.item(i));
        }
        return items;
      })
      .catch(e => {
        console.log('Database Error: '+JSON.stringify(e));
        return [];
      });
  }

  public query(query, params: any[] = []){
    return this.platform.ready()
      .then(() => {
        return this.sqlite.create(this.options);
      })
      .then((db: SQLiteObject) => {
        return db.executeSql(query, params);
      });
  }

  /**
   * Remove and copy database using an-rahulpandey/cordova-plugin-dbcopy plugin.
   * You can use this approach if setting createFromLocation:1 doesn't work for you.
   *
   * @param query
   * @param {any[]} params
   * @returns {Promise<any>}
   */
  public queryWithDBCopyPlugin(query, params: any[] = []){
    return this.platform.ready()
      .then(() => {
        return new Promise((resolve, reject) => {
          (window as any).plugins.sqlDB.remove(this.options.name, 0, (status) => {
            (window as any).plugins.sqlDB.copy(this.options.name, 0, (status) => {
              resolve(this.sqlite.create(this.options));
            }, (status) => {
              reject(status);
            });
          }, (status) => {
            reject(status);
          });
        });
      })
      .then((db: SQLiteObject) => {
        return db.executeSql(query, params);
      });
  }

}
