import { Tree } from '../tree';

export class CapturedFiles {
  public constructor(private aFileList: FileList,
                      private aTree: Tree) {
  }

  public get fileList(): FileList {
    return this.aFileList;
  }

  public get tree(): Tree {
    return this.aTree;
  }
}
