import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, HostListener } from '@angular/core';

/*
todo: more ui, add some function drawing methods
*/

import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

type tuple = [number, number];

@Component({
    selector: 'c-graph',
    imports: [],
    templateUrl: './graph.component.html',
    styleUrl: './graph.component.scss'
})
export class GraphModule implements AfterViewInit, OnDestroy {
    constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

    @ViewChild('graphCanvas') graphCanvas!: ElementRef;
    private resizeObserver!: ResizeObserver;
    private ctx! : CanvasRenderingContext2D;

    private zoom_sensitivity = 0.001;
    private print_accuracy = 6;
    private scale_min = -14;
    private scale_max = 14;

    // rendering resolution
    private res : tuple = [0,0];
    // focus coords of graph, (width,height)/2 in pixel coords
    private center : tuple = [0,0];
    private base_center : tuple  = this.center;
    private shift : tuple = [0,0]; // required to maintain precision, resets on scroll
    // local axis scales
    private basescale : tuple = [5, 5];
    private zoomlevel = 1;
    private scale : tuple = this.basescale;

    private isdragging = false;

    toScreenCoords(pos : tuple) : tuple {
        const factor = this.res[0]*0.5;
        return [
            factor*(pos[0] - this.center[0])/this.scale[0] + this.res[0]/2, 
            -factor*(pos[1] - this.center[1])/this.scale[1] + this.res[1]/2
        ];
    }

    toScreenCoordsDelta(pos : tuple) : tuple {
        const factor = this.res[0]*0.5;
        return [
            factor*pos[0]/this.scale[0], 
            -factor*pos[1]/this.scale[1]
        ];
    }

    toGraphCoords(pos : tuple) : tuple {
        const factor = this.res[0]*0.5;
        return [
            this.scale[0]*(pos[0] - this.res[0]/2)/factor + this.center[0], 
            this.scale[1]*(-pos[1] + this.res[1]/2)/factor + this.center[1]
        ];
    }

    numberingStep(x : number) : tuple {
        const l = Math.log10(x);
        const r = Math.round(l);
        const k = l - r;
        const c = k < -1/6 ? 0.5 : (k < 1/6 ? 1 : 2);
        const step = c*Math.pow(10,r);
        return [step, c == 2 ? 4 : 5];
    };

    toAxisString(x : number, scale : number) : string {
        const precision = Math.max(Math.ceil(-Math.log10(scale)), this.print_accuracy);
        let str = x.toPrecision(precision);
        const eidx = str.indexOf('e');
        if (str.includes('.')){
            if (eidx == -1){
                while (str.at(str.length - 1) == '0'){
                    str = str.slice(0, -1);
                }
                if (str.at(str.length - 1) == '.'){
                    str = str.slice(0, -1);
                }
            } else {
                let before = str.slice(0, eidx);
                const after = str.slice(eidx);
                while (before.at(before.length - 1) == '0'){
                    before = before.slice(0, -1);
                }
                if (before.at(before.length - 1) == '.'){
                    before = before.slice(0, -1);
                }
                str = before + after;
            }
        }
        return str;
    }

    redraw() : void {
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fillRect(0,0,this.res[0],this.res[1]);

        const base_scale = 250;

        let step = [0,0];
        let minor = [0,0];
        [step[0], minor[0]] = this.numberingStep(this.scale[0]*base_scale/this.res[0]);
        [step[1], minor[1]] = this.numberingStep(this.scale[1]*this.res[1]*base_scale/(this.res[0]**2));

        const minorstep = this.toScreenCoordsDelta([step[0]/minor[0], step[1]/minor[1]]);

        const screenOrigin = this.toScreenCoords([0,0]);

        const bottomRight = this.toGraphCoords([0,this.res[1]]);
        const topLeft = this.toGraphCoords([this.res[0],0]);

        let istart = [Math.floor(bottomRight[0]/step[0]), Math.floor(bottomRight[1]/step[1])];
        let iend = [Math.ceil(topLeft[0]/step[0]), Math.ceil(topLeft[1]/step[1])];

        let n = Math.max(iend[0] - istart[0], iend[1] - istart[1])+2;

        // major ticks
        this.ctx.strokeStyle = "#000000";
        this.ctx.lineWidth = 0.5;
        let positions = [];
        this.ctx.beginPath();
        for (let i = 0; i < n; i++){
            const j = [i + istart[0], i + istart[1]]
            const graphcoord : tuple = [j[0]*step[0], j[1]*step[1]];
            const coord = this.toScreenCoords(graphcoord);
            positions.push({coord_idx:j, screen:coord});
            this.ctx.moveTo(coord[0], 0);
            this.ctx.lineTo(coord[0], this.res[1]);
            this.ctx.moveTo(0, coord[1]);
            this.ctx.lineTo(this.res[0], coord[1]);
        }
        this.ctx.stroke();

        this.ctx.strokeStyle = "#4d4d4dff";
        this.ctx.lineWidth = 0.25;
        // minor ticks
        positions.forEach((position) => {
            for (let i = 1; i < minor[0]; i++){
                this.ctx.moveTo(position.screen[0] + minorstep[0]*i, 0);
                this.ctx.lineTo(position.screen[0] + minorstep[0]*i, this.res[1]);
            }
            for (let i = 1; i < minor[1]; i++){
                this.ctx.moveTo(0, position.screen[1] + minorstep[1]*i);
                this.ctx.lineTo(this.res[0], position.screen[1] + minorstep[1]*i);
            }
        });
        this.ctx.stroke();

        // axies
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        if (true){
            this.ctx.moveTo(screenOrigin[0], 0);
            this.ctx.lineTo(screenOrigin[0], this.res[1]);
            this.ctx.moveTo(0, screenOrigin[1]);
            this.ctx.lineTo(this.res[0], screenOrigin[1]);
        }
        this.ctx.stroke();

        // axis numbers
        this.ctx.strokeStyle = "#FFFFFF";
        this.ctx.lineWidth = 4;
        this.ctx.fillStyle = "#000000";
        this.ctx.font = "11pt Arial"
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        positions.forEach((position) => {
            let text : [string,string] = [
                this.toAxisString(position.coord_idx[0]*step[0], this.scale[0]), 
                this.toAxisString(position.coord_idx[1]*step[1], this.scale[0])
            ];
            this.ctx.strokeText(text[0], position.screen[0], screenOrigin[1]);
            this.ctx.fillText(text[0], position.screen[0], screenOrigin[1]);
            this.ctx.strokeText(text[1], screenOrigin[0], position.screen[1]);
            this.ctx.fillText(text[1], screenOrigin[0], position.screen[1]);
        });
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent) {
        event.preventDefault();
        this.isdragging = true;
    }

    @HostListener('document:mouseup')
    onMouseUp() {
        this.isdragging = false;
    }

    // pan action
    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        if (this.isdragging){
            const delta = [2*event.movementX/this.res[0], -2*event.movementY/this.res[0]];

            this.shift = [this.shift[0] - delta[0], this.shift[1] - delta[1]];
            this.center = [this.base_center[0] + this.shift[0]*this.scale[0], this.base_center[1] + this.shift[1]*this.scale[1]];

            this.redraw();
        }
    }

    // zoom action
    @HostListener('wheel', ['$event'])
    onWheel(event: WheelEvent) {
        event.preventDefault();
        const delta = event.deltaY;

        const rect = this.graphCanvas.nativeElement.getBoundingClientRect();
        const mousepos : tuple = [event.clientX - rect.left, event.clientY - rect.top];

        const mousebefore = this.toGraphCoords(mousepos);

        // apply the clamping to the zoom level to avoid doing math on extreme numbers
        const maxzoom = (-this.scale_min*Math.log2(10) - Math.log2(Math.max(this.basescale[1], this.basescale[0])))/this.zoom_sensitivity;
        const minzoom = (-this.scale_max*Math.log2(10) - Math.log2(Math.min(this.basescale[1], this.basescale[0])))/this.zoom_sensitivity;

        this.zoomlevel = Math.max(Math.min(this.zoomlevel + delta, maxzoom), minzoom);

        this.scale = [this.basescale[0]*2**(this.zoomlevel*this.zoom_sensitivity), this.basescale[1]*2**(this.zoomlevel*this.zoom_sensitivity)];

        const mouseafter = this.toGraphCoords(mousepos);

        this.shift = [0,0];
        this.center = [this.center[0] - (mouseafter[0] - mousebefore[0]), this.center[1] - (mouseafter[1] - mousebefore[1])];
        this.base_center = this.center;

        this.redraw();
    }

    ngAfterViewInit() {
        if (!isPlatformBrowser(this.platformId)) return;

        this.resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                this.res = [width, height];
                this.graphCanvas.nativeElement.width = this.res[0];
                this.graphCanvas.nativeElement.height = this.res[1];
                this.redraw();
            }
        });
        this.resizeObserver.observe(this.graphCanvas.nativeElement);
        this.ctx = this.graphCanvas.nativeElement.getContext('2d');
    }

    ngOnDestroy() {
        if (!isPlatformBrowser(this.platformId)) return;

        this.resizeObserver.disconnect();
    }
}
