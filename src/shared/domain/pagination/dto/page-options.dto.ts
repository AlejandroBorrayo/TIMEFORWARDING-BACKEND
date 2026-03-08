
export class PageOptionsDto {
  readonly page: number = 1;
  readonly perpage: number = 10;

  get skip(): number {
    if (this.page && this.perpage) {
      return (this.page - 1) * this.perpage;
    }
    return 0
  }
}
