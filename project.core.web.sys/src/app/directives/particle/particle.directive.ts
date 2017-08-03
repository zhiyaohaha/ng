import { NgModule, Directive, OnInit, Input, HostListener, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { DomRenderer } from './../../common/dom';

@Directive({
  selector: '[tParticle]',
  providers: [DomRenderer]
})
export class ParticleDirective implements OnInit, AfterViewInit {
  container: HTMLCanvasElement;
  particles: Particle[];
  ctx: any;
  width: any;
  height: any;
  defaultColor = 'rgba(255,255,255,.2)';
  isRunning: boolean;
  canvas: HTMLCanvasElement;
  @Input() size = 8;
  @Input() distance = 100;
  @Input() color: string[] | string;
  @Input() total = 80;
  @Input() backgroundColor = 'linear-gradient(to bottom,#115d8e 0, #347eff 100%)';
  @HostListener('window:resize') onResize() {
    this.reset();
  };
  constructor(private er: ElementRef,
    private domRenderer: DomRenderer,
    private renderer2: Renderer2) {
  }

  ngOnInit() {
    this.container = this.renderer2.createElement("canvas");
    this.ctx = this.container.getContext("2d");
    this.ctx.globalAlpha = .5;
  }

  ngAfterViewInit() {
    this.canvas = this.er.nativeElement;
    this.reset();
    this.renderer2.appendChild(this.canvas, this.container);
    const overlay = this.renderer2.createElement("div");
    this.domRenderer.css(overlay, {
      'position': 'absolute',
      'left': '0',
      'top': 0,
      'width': '100%',
      'height': '100%'
    });
    this.renderer2.appendChild(this.canvas, overlay);
    this.addParticle();
    this.drawParticle();
  }

  addParticle() {
    this.particles = [];
    for (var i = 0; i < this.total; i++) {
      const data = this.setParticleData();
      const vx = parseFloat((this.getRandom(-5, 5) / 20).toFixed(2));
      const vy = parseFloat((this.getRandom(-5, 5) / 20).toFixed(2));
      const arr = [data.x, data.y, data.r, vx, vy, this.selectColor()];
      const particle = new Particle(...arr);
      this.particles.push(particle);
    }
  }

  drawBackground() {
    this.ctx.save();
    const [width, height] = [this.container.width, this.container.height];
    const linearGradient = this.ctx.createLinearGradient(0, 0, width, height);
    linearGradient.addColorStop(0, 'gray');
    linearGradient.addColorStop(1, '#cf000d');
    this.ctx.fillStyle = linearGradient;
    this.ctx.fillRect(0, 0, width, height);
    this.ctx.restore();
  }

  drawLine(p1: Particle, p2: Particle) {
    this.ctx.strokeStyle = this.lineColor(p1, p2);
    this.ctx.beginPath();
    this.ctx.moveTo(p1['x'], p1['y']);
    this.ctx.lineTo(p2['x'], p2['y']);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  lineColor(p1, p2) {
    const linear = this.ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
    linear.addColorStop(0, p1.color);
    linear.addColorStop(1, p2.color);
    return linear;
  }

  drawParticle() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawBackground();
    for (const p of this.particles) {
      this.ctx.beginPath();
      this.ctx.fillStyle = p['color'];
      if (this.isRunning) {
        this.checkInView(p);
        p['x'] += p['vx'];
        p['y'] += p['vy'];
      }
      this.ctx.arc(p['x'], p['y'], p['r'], 0, 2 * Math.PI, true);
      this.ctx.closePath();
      this.ctx.fill();

      for (const p2 of this.particles) {
        const x = p['x'] - p2['x'];
        const y = p['y'] - p2['y'];
        const dist = Math.sqrt(x * x + y * y);
        if (p2 !== p && dist < this.distance) {
          this.drawLine(p, p2);
        }
      }
    }
    this.isRunning = true;
    if (window.requestAnimationFrame) {
      requestAnimationFrame(() => {
        this.drawParticle();
      });
    }
  }

  setParticleData() {
    return {
      x: Math.floor(Math.random() * this.width),
      y: Math.floor(Math.random() * this.height),
      r: Math.floor(this.size / 2)
    };
  }

  getRandom(max: number, min: number = 0): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  reset() {
    this.width = this.canvas.offsetWidth;
    this.height = this.canvas.offsetHeight;
    const { w, h } = { w: this.width, h: this.height };
    this.container.width = w;
    this.container.height = h;
    this.addParticle();
  }

  selectColor() {
    if (Array.isArray(this.color)) {
      return this.color[Math.floor(Math.random() * this.color.length)];
    }
    return this.defaultColor;
  }

  checkInView(p: Particle) {
    if (p['x'] <= 0 || p['x'] >= this.width) {
      p['vx'] = -p['vx'];
    }
    if (p['y'] <= 0 || p['y'] >= this.height) {
      p['vy'] = -p['vy'];
    }
  }

}


@NgModule({
  declarations: [ParticleDirective],
  exports: [ParticleDirective]
})

export class ParticleModule { }

export class Particle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  color: string;
  constructor(...args) {
    [this.x, this.y, this.r, this.vx, this.vy, this.color] = args;
  }
}