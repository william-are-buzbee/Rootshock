const $ = (id: string) => document.getElementById(id)!;

/** The page around the canvas: title, pause, the room name, the dev readout. */
export class Hud {
  private room = '';
  private roomTimer = 0;

  show(id: 'title' | 'pause' | 'hud', on: boolean): void {
    $(id).classList.toggle('hide', !on);
  }
  onClick(id: 'title' | 'pause', f: () => void): void {
    $(id).addEventListener('click', f);
  }

  /** fade the room's name in when you enter it, and out again */
  setRoom(name: string, level: string, dt: number): void {
    const el = $('roomn');
    if (name && name !== this.room) {
      this.room = name;
      el.innerHTML = '';
      el.append(name);
      const s = document.createElement('small');
      s.textContent = level;
      el.append(s);
      el.style.opacity = '1';
      this.roomTimer = 3;
    } else if (this.roomTimer > 0 && (this.roomTimer -= dt) <= 0) el.style.opacity = '0';
  }

  /** the breath bar: shown while it is not full */
  air(frac: number | null): void {
    $('o2w').classList.toggle('hide', frac === null);
    if (frac !== null) $('o2').style.width = (frac * 100).toFixed(1) + '%';
  }

  dev(text: string | null): void {
    const el = $('devtag');
    el.classList.toggle('hide', text === null);
    if (text !== null && el.textContent !== text) el.textContent = text;
  }
}
