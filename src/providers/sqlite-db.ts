import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import 'rxjs/add/operator/map';

@Injectable()
export class SqliteDbProvider {
  public debug = true;
  private options:{name:string, location:string,createFromLocation:number} = {
    name: "data.db",
    location: 'default',
    createFromLocation:1
  };

  constructor(private platform: Platform, private sqlite: SQLite) { }

  private loadDB(){
    return new Promise((resolve, reject) => {
      this.platform.ready().then(() => {
        //(window as any).plugins.sqlDB.remove(this.options.name, 0);
        this.sqlite.create(this.options)
          .then((db: SQLiteObject) => {
            if(this.debug){
              console.log('DB opened successfully');
            }
            resolve(db);
          })
          .catch(e => {
            reject(e)
          });
      });
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
    if(this.debug){
      console.log('Got query request');
    }
    return this.loadDB()
      .then((db: SQLiteObject) => {
        if(this.debug){
          console.log('Got DB connection. Running query');
        }
        return db.executeSql(query, params)
          .then((data) => {
            if(this.debug){
              console.log(JSON.stringify(data));
            }
            return data;
          })
          .catch(e => {
            console.log('Query error:'+JSON.stringify(e));
            return [];
          });
      })
      .catch(e => {
        console.log('DB connection error:'+JSON.stringify(e));
        return [];
      });
  }

}
