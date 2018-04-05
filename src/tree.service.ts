import {
  NodeCollapsedEvent,
  NodeCreatedEvent,
  NodeExpandedEvent,
  NodeMovedEvent,
  NodeRemovedEvent,
  NodeRenamedEvent,
  NodeSelectedEvent,
  FilesDroppedEvent
} from './tree.events';
import { RenamableNode } from './tree.types';
import { Tree } from './tree';
import { TreeController } from './tree-controller';
import { Observable, Subject } from 'rxjs/Rx';
import { ElementRef, Inject, Injectable } from '@angular/core';
import { NodeDraggableService } from './draggable/node-draggable.service';
import { NodeDraggableEvent, FileDraggableEvent } from './draggable/draggable.events';
import { FileDraggableService } from './draggable/file-draggable.service';

@Injectable()
export class TreeService {
  public nodeMoved$: Subject<NodeMovedEvent> = new Subject<NodeMovedEvent>();
  public nodeRemoved$: Subject<NodeRemovedEvent> = new Subject<NodeRemovedEvent>();
  public nodeRenamed$: Subject<NodeRenamedEvent> = new Subject<NodeRenamedEvent>();
  public nodeCreated$: Subject<NodeCreatedEvent> = new Subject<NodeCreatedEvent>();
  public nodeSelected$: Subject<NodeSelectedEvent> = new Subject<NodeSelectedEvent>();
  public nodeExpanded$: Subject<NodeExpandedEvent> = new Subject<NodeExpandedEvent>();
  public nodeCollapsed$: Subject<NodeCollapsedEvent> = new Subject<NodeCollapsedEvent>();
  public filesDropped$: Subject<FilesDroppedEvent> = new Subject<FilesDroppedEvent>();

  private controllers: Map<string | number, TreeController> = new Map();

  public constructor(@Inject(NodeDraggableService) private nodeDraggableService: NodeDraggableService,
                    @Inject(FileDraggableService) private fileDraggableService: FileDraggableService) {
    this.nodeRemoved$.subscribe((e: NodeRemovedEvent) => e.node.removeItselfFromParent());
    this.fileDraggableService.draggableFileEvents$.subscribe((e: FileDraggableEvent) => this.fireFilesDropped(e.captured.fileList, e.captured.tree));
  }

  public unselectStream(tree: Tree): Observable<any> {
    return this.nodeSelected$.filter((e: NodeSelectedEvent) => tree !== e.node);
  }

  public fireNodeRemoved(tree: Tree): void {
    this.nodeRemoved$.next(new NodeRemovedEvent(tree, tree.positionInParent));
  }

  public fireNodeCreated(tree: Tree): void {
    this.nodeCreated$.next(new NodeCreatedEvent(tree));
  }

  public fireNodeSelected(tree: Tree): void {
    this.nodeSelected$.next(new NodeSelectedEvent(tree));
  }

  public fireNodeRenamed(oldValue: RenamableNode | string, tree: Tree): void {
    this.nodeRenamed$.next(new NodeRenamedEvent(tree, oldValue, tree.value));
  }

  public fireNodeMoved(tree: Tree, parent: Tree): void {
    this.nodeMoved$.next(new NodeMovedEvent(tree, parent));
  }

  public fireNodeSwitchFoldingType(tree: Tree): void {
    if (tree.isNodeExpanded()) {
      this.fireNodeExpanded(tree);
    } else if (tree.isNodeCollapsed()) {
      this.fireNodeCollapsed(tree);
    }
  }

  private fireNodeExpanded(tree: Tree): void {
    this.nodeExpanded$.next(new NodeExpandedEvent(tree));
  }

  private fireNodeCollapsed(tree: Tree): void {
    this.nodeCollapsed$.next(new NodeCollapsedEvent(tree));
  }

  private fireFilesDropped(files: FileList, tree: Tree): void {
    this.filesDropped$.next(new FilesDroppedEvent(files, tree));
  }

  public draggedStream(tree: Tree, element: ElementRef): Observable<NodeDraggableEvent> {
    return this.nodeDraggableService.draggableNodeEvents$
      .filter((e: NodeDraggableEvent) => e.target === element)
      .filter((e: NodeDraggableEvent) => !e.captured.tree.hasChild(tree));
  }

  public setController(id: string | number, controller: TreeController): void {
    this.controllers.set(id, controller);
  }

  public deleteController(id: string | number): void {
    if (this.controllers.has(id)) {
      this.controllers.delete(id);
    }
  }

  public getController(id: string | number): TreeController {
    if (this.controllers.has(id)) {
      return this.controllers.get(id);
    }

    return null;
  }

  public hasController(id: string | number): boolean {
    return this.controllers.has(id);
  }
}
