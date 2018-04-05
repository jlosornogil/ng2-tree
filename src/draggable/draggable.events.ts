import { ElementRef } from '@angular/core';
import { CapturedNode } from './captured-node';
import { CapturedFiles } from './captured-file';

export class NodeDraggableEvent {
  public constructor(public captured: CapturedNode, public target: ElementRef) {
  }
}

export class FileDraggableEvent {
  public constructor(public captured: CapturedFiles, public target: ElementRef) {
  }
}
