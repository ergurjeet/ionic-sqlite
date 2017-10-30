import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SqliteDbProvider } from '../../providers/sqlite-db';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{
  public items:Array<any> = [];
  constructor(public navCtrl: NavController, private dbProvider:SqliteDbProvider) {

  }

  ngOnInit(){
    this.dbProvider.getArticles().then((data) => {
      console.log(JSON.stringify(data));
      this.items = data;
    });
  }

}
