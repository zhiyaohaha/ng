import {NgModule} from "@angular/core";
import {ParticleDirective} from "./particle/particle.directive";
import {ClickStopDirective} from "./click-stop/click-stop.directive";

@NgModule({
  declarations: [ParticleDirective, ClickStopDirective],
  exports: [ParticleDirective, ClickStopDirective]
})

export class DirectiveModule {
}
