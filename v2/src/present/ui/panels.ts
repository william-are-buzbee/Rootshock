import { ITEMS, keyName } from '../../content/items';
import type { Command, Game } from '../../sim/game';

/* The HUD and the menus, as the first engine had them: messages, the use prompt, health, breath and battery, what is in
   hand; the inventory, a note, a keypad, the lift panel, the end. They show the game's state and turn clicks into
   commands for the sim; they decide nothing. */

const $ = (id: string) => document.getElementById(id)!;
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

export type Panel = 'inv' | 'note' | 'pad' | 'lift';

export class Panels {
  open: Panel | null = null;
  private promptText = '';
  private wpnText = '';

  constructor(private send: (c: Command) => void, private game: () => Game, private onClose: () => void) {
    $('invb').addEventListener('click', e => {
      const t = e.target as HTMLElement;
      const dr = t.closest<HTMLElement>('[data-d]'), tl = t.closest<HTMLElement>('[data-t]'), us = t.closest<HTMLElement>('[data-i]'), nt = t.closest<HTMLElement>('[data-n]');
      if (dr) this.send({ type: 'drop', slot: +dr.dataset.d! });
      else if (tl) this.send({ type: 'light', tool: tl.dataset.t! });
      else if (us) this.send({ type: 'use', slot: +us.dataset.i! });
      else if (nt) { this.send({ type: 'read', key: nt.dataset.n! }); return; }
      else return;
      setTimeout(() => this.renderInv(), 30);
    });
    $('note').addEventListener('click', () => this.close());
    let h = '';
    for (const k of ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0']) h += '<button data-k="' + k + '">' + (k === 'C' ? 'Clear' : k) + '</button>';
    $('padk').innerHTML = h;
    $('padk').addEventListener('click', e => {
      const b = (e.target as HTMLElement).closest<HTMLElement>('[data-k]');
      if (b) this.send({ type: 'pad', key: b.dataset.k! });
    });
    $('liftb').addEventListener('click', e => {
      const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-f]');
      if (b && !b.disabled) { this.send({ type: 'lift', level: b.dataset.f! }); this.close(); }
    });
  }

  show(p: Panel): void {
    this.closeAll();
    this.open = p;
    $(p).classList.remove('hide');
    if (p === 'inv') this.renderInv();
    if (document.pointerLockElement) document.exitPointerLock();
  }
  close(): void {
    if (this.open === 'pad') this.send({ type: 'padClose' });
    this.closeAll();
    this.onClose();
  }
  private closeAll(): void {
    for (const id of ['inv', 'note', 'pad', 'lift']) $(id).classList.add('hide');
    this.open = null;
  }

  /* ---- the HUD */
  say(text: string): void {
    const p = document.createElement('p'), box = $('msgs');
    p.textContent = text;
    box.appendChild(p);
    while (box.children.length > 4) box.removeChild(box.firstChild!);
    setTimeout(() => { p.style.opacity = '0'; }, 4800);
    setTimeout(() => p.remove(), 5900);
  }
  prompt(text: string | null): void {
    const t = text ?? '';
    if (t === this.promptText) return;
    this.promptText = t;
    const pr = $('prompt');
    pr.innerHTML = t ? '<kbd>E</kbd>' : '';
    if (t) pr.append(t);
  }
  status(g: Game, airFrac: number | null, crouch: boolean, hurtFx = 0): void {
    $('hp').style.width = g.hp + '%';
    $('batw').classList.toggle('hide', !g.light);
    $('bat').style.width = g.batt + '%';
    $('bat').style.opacity = g.lightOn ? '1' : '0.45';
    $('o2w').classList.toggle('hide', airFrac === null);
    if (airFrac !== null) $('o2').style.width = (airFrac * 100).toFixed(1) + '%';
    let name = g.weapon ? ITEMS[g.weapon].n : 'Bare hands';
    const w = g.weapon ? ITEMS[g.weapon].w : null;
    if (w?.gun) name += ' (' + (g.inv.find(q => q.id === w.ammo)?.n ?? 0) + ')';
    const wt = esc(name) + (crouch ? '<span>crouched</span>' : '') + (g.lightOn ? '<span>' + (g.light === 'flash' ? 'flashlight' : 'lantern') + '</span>' : '');
    if (wt !== this.wpnText) { this.wpnText = wt; $('wpn').innerHTML = wt; }
    if (!g.ended) $('vig').style.opacity = String(Math.max(hurtFx, g.hp < 35 ? (35 - g.hp) / 50 : 0)); // dead, it stays red
  }

  /* ---- the menus */
  renderInv(): void {
    const g = this.game();
    let h = '<h2>Carried <span>' + g.inv.length + ' of ' + g.cap + '</span></h2><div class="slots">';
    for (let i = 0; i < g.cap; i++) {
      const s = g.inv[i];
      if (s) {
        const it = ITEMS[s.id], on = g.weapon === s.id;
        h += '<div class="slot' + (on ? ' on' : '') + '"><button class="use" data-i="' + i + '"><b>' + esc(it.n) + '</b>' + (s.n > 1 ? '<em>×' + s.n + '</em>' : '') +
          '<small>' + esc(it.d ?? '') + (on ? ' In hand.' : '') + '</small></button><button class="drop" data-d="' + i + '">Put down</button></div>';
      } else h += '<div class="slot empty"></div>';
    }
    const worn = ["Prisoner's garb", ...g.worn.map(k => ITEMS[k].n)], keys = g.keys.map(keyName);
    h += '</div><div class="cols"><section><h3>Lights</h3>' +
      (g.tools.length ? g.tools.map(k => '<button data-t="' + k + '">' + esc(ITEMS[k].n) + (g.light === k ? (g.lightOn ? ' (on)' : ' (ready)') : '') + '</button>').join('') : '<p>None</p>') +
      '</section><section><h3>Worn</h3><p>' + worn.map(esc).join('<br>') + '</p></section><section><h3>Keys</h3><p>' + (keys.length ? keys.map(esc).join('<br>') : 'None') +
      '</p></section><section><h3>Papers</h3>' + (g.read.length ? g.read.map(k => '<button data-n="' + k + '">' + esc(g.notes[k].t) + '</button>').join('') : '<p>None</p>') +
      '</section></div><p class="hint">Click an item to use it or take it in hand. Tab closes.</p>';
    $('invb').innerHTML = h;
  }
  showNote(g: Game, key: string): void {
    const n = g.notes[key], art = $('notet');
    art.innerHTML = '<h2></h2><div></div><footer>E to put it down</footer>';
    art.firstElementChild!.textContent = n.t;
    art.children[1].textContent = n.b;
    this.show('note');
  }
  /** a wrong code stays on the display a moment (350 ms, as before) before it clears */
  private miss: { code: string; until: number } | null = null;
  renderPad(g: Game): void {
    const m = g.pad?.miss, now = performance.now();
    if (m && (!this.miss || this.miss.code !== m)) this.miss = { code: m, until: now + 350 };
    if (!m) this.miss = null;
    const show = this.miss && now < this.miss.until ? this.miss.code : g.pad?.typed ?? '';
    $('padd').textContent = (show + '····').slice(0, 4);
  }
  showLift(levels: { id: string; name: string; here: boolean }[]): void {
    let h = '<h2>Lift <span>Gen-1 running</span></h2>';
    for (const l of levels) h += '<button data-f="' + l.id + '"' + (l.here ? ' disabled' : '') + '>' + esc(l.name) + '</button>';
    $('liftb').innerHTML = h + '<p class="hint">Esc steps back.</p>';
    this.show('lift');
  }
  showEnd(g: Game, win: boolean, msg: string): void {
    const t = Math.floor(g.time), mm = Math.floor(t / 60), ss = ('0' + (t % 60)).slice(-2);
    $('endh').textContent = win ? 'Surface' : 'Grafted';
    $('endp').textContent = !win ? msg + ' Lowfield keeps what it is given.'
      : 'The lift climbs for a long time. When the doors open it is raining, and the rain is the first thing in nine days that has asked nothing of you. Six floors down, something green and something red go on disagreeing about who the station belongs to. ' +
        mm + ':' + ss + ' underground, ' + g.kills + ' put down, ' + g.read.length + ' of ' + Object.keys(g.notes).length + ' papers read.';
    setTimeout(() => $('end').classList.remove('hide'), win ? 300 : 900);
    if (!win) $('vig').style.opacity = '1';
  }
}
