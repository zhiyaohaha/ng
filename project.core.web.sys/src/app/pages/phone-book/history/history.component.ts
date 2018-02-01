import {Component, OnInit} from "@angular/core";
import {BaseService} from "app/services/base.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: "app-history",
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.scss"]
})
export class HistoryComponent implements OnInit {

  searchDOMS;
  filters;
  headers;
  datas;
  totals;

  currentPage = 0;
  pageSize = 10;

  search: any = "";
  id;

  listparam = {
    index: 0,
    size: 10,
    filter: ""
  };

  constructor(private baseService: BaseService) {
  }

  ngOnInit() {
    this.getLists();
  }

  getLists() {
    if (typeof this.search !== "string") {
      this.search = JSON.stringify(this.search);
    }
    this.baseService.get("/api/Template/List/PhoneBookOperatRecord", this.listparam)
      .subscribe(res => {
        if (res.code === "0") {
          if (res.data.total) {
            this.datas = res.data.data.bindData;
            this.totals = res.data.total;

            if (!res.data.search) {
              this.searchDOMS = res.data.data.filters;
              this.headers = res.data.data.fields;
            }

            this.filters = [];
            res.data.data.filters.forEach(i => {
              this.filters.push({"key": i.name, "value": i.value || ""});
            });

          } else {
            this.totals = 0;
            this.datas = [];
          }
        }
      });
  }

  onSearch($event) {
    this.listparam.filter = $event;
    this.getLists();
  }

  page($event) {
    this.listparam.index = $event.activeIndex;
    this.listparam.size = $event.pageSize;
    this.getLists();
  }

}
