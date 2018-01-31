import { Component, OnInit } from '@angular/core';
import { BaseService } from 'app/services/base.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  searchDOMS;
  filters;
  headers;
  datas;
  totals;
  
  currentPage = 0;
  pageSize = 10;

  search = [];
  id;
  constructor(
    private baseService: BaseService,
    private router: ActivatedRoute
  ) { }

  ngOnInit() {
    this.router.paramMap
    .subscribe(res => {
      this.id = res.get("id");
    });
    this.search.push({ key: "id", value: this.id});
    this.getLists();
  }

  getLists() {
    this.baseService.get("/api/Template/List/PhoneBookOperatRecord", { filters: JSON.stringify(this.search)})
    .subscribe(res => {
      console.log(res);
      if (res.code === "0") {
        if (res.data.total) {
          this.searchDOMS = res.data.data.filters;
          this.headers = res.data.data.fields;
          this.datas = res.data.data.bindData;
          this.totals = res.data.total;


          this.filters = [];
          res.data.data.filters.forEach(i => {
            this.filters.push({ "key": i.name, "value": i.value || "" });
          });
        }
      }
    });
  }

  onSearch($event){
    this.search = $event;
    this.search.push({ key: "id", value: this.id });
    this.getLists();
  }

  page($event) {
    console.log($event);
  }

}
