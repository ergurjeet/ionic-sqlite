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

  private loadDB(){
    return this.platform.ready().then(() => {
      //(window as any).plugins.sqlDB.remove(this.options.name, 0);
      return this.sqlite.create(this.options);
    });
  }

  getArticles():Promise<any>{
    let query = "SELECT title FROM articles";
    return this.query(query, [])
      .then(data => {
        var items = [];
        for (var i = 0; i < data.rows.length; i++) {
          items.push(data.rows.item(i));
        }
        return items;
      });
  }

  public query(query, params: any[] = []){
    return this.loadDB()
      .then((db: SQLiteObject) => {
        return db.executeSql(query, params);
      })
      .then((data) => {
        console.log(JSON.stringify(data));
        return data;
      })
      .catch(e => {
        console.log('Database Error: '+JSON.stringify(e));
        return [];
      });
  }

}
