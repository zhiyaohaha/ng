import {NgModule} from "@angular/core";
import {ParticleDirective} from "./particle/particle.directive";
import {ClickStopDirective} from "./click-stop/click-stop.directive";
import { DebounceClickDirective } from "./debounce-click/debounce-click.directive";

@NgModule({
  declarations: [
    ParticleDirective,
    ClickStopDirective,
    DebounceClickDirective
  ],
  exports: [
    ParticleDirective,
    ClickStopDirective,
    DebounceClickDirective
  ]
})

export class DirectiveModule {
}
