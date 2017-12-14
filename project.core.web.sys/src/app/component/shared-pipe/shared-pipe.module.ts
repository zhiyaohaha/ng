
import {NgModule} from "@angular/core";

import { LastdotPipe} from "../../common/pipe/lastdot.pipe";
import {BooleanToWordPipe} from "../../common/pipe/boolean-to-word.pipe";
import {StrToArrayPipe} from "../../common/pipe/str-to-array.pipe";
import {ErgodicJsonPipe} from "../../common/pipe/ergodic-json.pipe";

@NgModule({
  imports: [],
  declarations: [ LastdotPipe,BooleanToWordPipe, ErgodicJsonPipe, StrToArrayPipe],
  exports: [ LastdotPipe,BooleanToWordPipe, ErgodicJsonPipe, StrToArrayPipe]
})

export class SharedPipeModule {

}
