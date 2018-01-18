import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { StatisticsRoutingModule } from "app/pages/statistics/statistics-routing.module";
import { StatisticsComponent } from "app/pages/statistics/statistics.component";

@NgModule({
    imports: [
        CommonModule,
        StatisticsRoutingModule,
    ],
    declarations: [StatisticsComponent],
    providers: [],
})
export class StatisticsModule {
}
