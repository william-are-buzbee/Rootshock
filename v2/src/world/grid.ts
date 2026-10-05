/* The query grid: the level's space in cells of CELL metres. Each cell holds what is there:
   ROCK (-1, the default), a room id (>= 0: open space, and whose), or a block (<= -2: solid built back into a room).
   Dense for now; it becomes chunked and sparse when whole levels need it (engine.md §4). */
export const CELL = 0.25;
export const ROCK = -1;
export const blockCell = (b: number): number => -2 - b;
export const cellBlock = (c: number): number => -2 - c;

export class Grid {
  readonly cells: Int16Array;
  constructor(
    /** world position of cell (0, 0, 0)'s low corner */
    readonly ox: number, readonly oy: number, readonly oz: number,
    readonly nx: number, readonly ny: number, readonly nz: number,
  ) {
    this.cells = new Int16Array(nx * ny * nz).fill(ROCK);
  }
  index(i: number, j: number, k: number): number {
    return (k * this.ny + j) * this.nx + i;
  }
  /** the cell at (i, j, k); outside the grid is rock */
  get(i: number, j: number, k: number): number {
    if (i < 0 || j < 0 || k < 0 || i >= this.nx || j >= this.ny || k >= this.nz) return ROCK;
    return this.cells[this.index(i, j, k)];
  }
  set(i: number, j: number, k: number, v: number): void {
    this.cells[this.index(i, j, k)] = v;
  }
  ci(x: number): number { return Math.floor((x - this.ox) / CELL); }
  cj(y: number): number { return Math.floor((y - this.oy) / CELL); }
  ck(z: number): number { return Math.floor((z - this.oz) / CELL); }
  at(x: number, y: number, z: number): number {
    return this.get(this.ci(x), this.cj(y), this.ck(z));
  }
  /** fill every cell whose centre lies inside the box */
  fill(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, v: number): void {
    const i0 = Math.max(0, Math.round((x0 - this.ox) / CELL)), i1 = Math.min(this.nx, Math.round((x1 - this.ox) / CELL));
    const j0 = Math.max(0, Math.round((y0 - this.oy) / CELL)), j1 = Math.min(this.ny, Math.round((y1 - this.oy) / CELL));
    const k0 = Math.max(0, Math.round((z0 - this.oz) / CELL)), k1 = Math.min(this.nz, Math.round((z1 - this.oz) / CELL));
    for (let k = k0; k < k1; k++) for (let j = j0; j < j1; j++) for (let i = i0; i < i1; i++) this.cells[this.index(i, j, k)] = v;
  }
}
