import { Injectable, ElementRef } from '@angular/core';
import { Subject } from 'rxjs/Rx';
import { FileDraggableEvent } from './draggable.events';
import { CapturedFiles } from './captured-file';

@Injectable()
export class FileDraggableService {
  public draggableFileEvents$: Subject<FileDraggableEvent> = new Subject<FileDraggableEvent>();

  public fireFilesDragged(captured: CapturedFiles, target: ElementRef): void {
    this.draggableFileEvents$.next(new FileDraggableEvent(captured, target));
  }
}
