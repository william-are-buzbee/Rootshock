import { ITEMS, keyName } from '../../content/items';
import type { Command, Game } from '../../sim/game';
import { DROP, icon, keyIcon } from './icons';

/* The HUD and the menus: messages, the name of what you look at, health, breath and battery, the rounds for a gun in
   hand; the inventory, a note, a keypad, the lift panel, the end. As few words as will do: the inventory is pictures,
   each named only while the pointer is on it. They show the game's state and turn clicks into commands for the sim;
   they decide nothing. */

const $ = (id: string) => document.getElementById(id)!;
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
/** the keypad's clear: a back-arrow with a cross in it */
const CLEAR = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6h12v12H9l-6-6zM12.5 9.5l5 5M17.5 9.5l-5 5"/></svg>';

export type Panel = 'inv' | 'note' | 'pad' | 'lift';

export class Panels {
  open: Panel | null = null;
  private promptText = '';
  private ammoText = '';
  private invHtml = '';

  constructor(private send: (c: Command) => void, private game: () => Game, private onClose: () => void) {
    $('invb').addEventListener('click', e => {
      const t = e.target as HTMLElement;
      const dr = t.closest<HTMLElement>('[data-d]'), pd = t.closest<HTMLElement>('[data-pt]'), tl = t.closest<HTMLElement>('[data-t]'), us = t.closest<HTMLElement>('[data-i]'), nt = t.closest<HTMLElement>('[data-n]');
      const wn = t.closest<HTMLElement>('[data-w]');
      if (dr) this.send({ type: 'drop', slot: +dr.dataset.d! });
      else if (pd) this.send({ type: 'putDown', tool: pd.dataset.pt! });
      else if (wn) this.send({ type: 'unwear', id: wn.dataset.w! });
      else if (tl) this.send({ type: 'light', tool: tl.dataset.t! });
      else if (us) this.send({ type: 'use', slot: +us.dataset.i! });
      else if (nt) { this.send({ type: 'read', key: nt.dataset.n! }); return; }
      else return;
      setTimeout(() => this.renderInv(), 30);
    });
    /* a right click puts it down */
    $('invb').addEventListener('contextmenu', e => {
      e.preventDefault();
      const [k, v] = ((e.target as HTMLElement).closest<HTMLElement>('[data-drop]')?.dataset.drop ?? '').split(':');
      if (k === 'd') this.send({ type: 'drop', slot: +v });
      else if (k === 'pt') this.send({ type: 'putDown', tool: v });
      else return;
      setTimeout(() => this.renderInv(), 30);
    });
    /* the name of what the pointer is on; by touch, of what was last tapped, until the next tap */
    $('invb').addEventListener('pointerover', e => this.tip((e.target as HTMLElement).closest<HTMLElement>('[data-name]')));
    $('invb').addEventListener('pointerout', e => {
      const from = (e.target as HTMLElement).closest('[data-name]');
      if (e.pointerType !== 'touch' && from && !from.contains(e.relatedTarget as Node | null)) this.tip(null);
    });
    $('invb').addEventListener('focusin', e => this.tip((e.target as HTMLElement).closest<HTMLElement>('[data-name]')));
    $('note').addEventListener('click', () => this.close());
    let h = '';
    for (const k of ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0']) h += '<button data-k="' + k + '"' + (k === 'C' ? ' aria-label="Clear">' + CLEAR : '>' + k) + '</button>';
    $('padk').innerHTML = h;
    $('padk').addEventListener('click', e => {
      const b = (e.target as HTMLElement).closest<HTMLElement>('[data-k]');
      if (b) this.send({ type: 'pad', key: b.dataset.k! });
    });
    $('liftb').addEventListener('click', e => {
      const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-f]');
      if (b && !b.disabled) { this.send({ type: 'lift', level: b.dataset.f! }); this.close(); }
    });
    /* played by touch, there is no Esc or Tab: a button says it */
    $('back').addEventListener('click', e => { e.stopPropagation(); if (this.open) this.close(); });
  }

  /** played by touch (touch.ts): what is said is said for it */
  touch = false;

  show(p: Panel): void {
    this.closeAll();
    this.open = p;
    $(p).classList.remove('hide');
    document.body.classList.add('panelled');
    if (p === 'inv') { this.invHtml = ''; this.renderInv(); }
    if (document.pointerLockElement) document.exitPointerLock();
  }
  close(): void {
    if (this.open === 'pad') this.send({ type: 'padClose' });
    this.closeAll();
    this.onClose();
  }
  private closeAll(): void {
    for (const id of ['inv', 'note', 'pad', 'lift']) $(id).classList.add('hide');
    document.body.classList.remove('panelled');
    this.open = null;
    this.tip(null);
  }

  /** what the name over the inventory is on */
  private tipped: string | null = null;
  private tip(el: HTMLElement | null): void {
    const t = $('tip');
    this.tipped = el?.dataset.name ?? null;
    t.classList.toggle('hide', !el);
    if (!el) return;
    t.textContent = el.dataset.name!;
    const r = el.getBoundingClientRect(), w = t.offsetWidth;
    t.style.left = Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width / 2 - w / 2)) + 'px';
    t.style.top = Math.max(8, r.top - t.offsetHeight - 6) + 'px';
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
  /** what you are looking at that can be used: its name, and the dot made bolder */
  prompt(text: string | null): void {
    const t = text ?? '';
    if (t === this.promptText) return;
    this.promptText = t;
    $('prompt').textContent = t;
    $('dot').classList.toggle('can', !!t);
  }
  status(g: Game, airFrac: number | null, hurtFx = 0): void {
    $('hp').style.width = g.hp + '%';
    $('batw').classList.toggle('hide', !g.light);
    $('bat').style.width = g.batt + '%';
    $('bat').style.opacity = g.lightOn ? '1' : '0.45';
    $('o2w').classList.toggle('hide', airFrac === null);
    if (airFrac !== null) $('o2').style.width = (airFrac * 100).toFixed(1) + '%';
    /* what is in your hand you can see; the rounds left for a gun you cannot */
    const w = g.weapon ? ITEMS[g.weapon].w : null, ammo = w?.gun ? String(g.inv.find(q => q.id === w.ammo)?.n ?? 0) : '';
    if (ammo !== this.ammoText) { this.ammoText = ammo; $('ammo').textContent = ammo; }
    if (!g.ended) $('vig').style.opacity = String(Math.max(hurtFx, g.hp < 35 ? (35 - g.hp) / 50 : 0)); // dead, it stays red
  }

  /* ---- the menus */
  /* What you carry, as pictures in boxes: your hands' slots, and under them, smaller, your lights, what you wear, the keys
     you know and the papers you have read. A click uses it (takes it in hand, eats it, switches to it, takes it off, reads
     it); the arrow in a slot's corner, or a right click, puts it down. */
  renderInv(): void {
    const g = this.game(), name = (n: string) => ' data-name="' + esc(n).replace(/"/g, '&quot;') + '"';
    const put = (drop: string) => '<button class="drop" data-' + drop.replace(':', '="') + '" aria-label="Put down">' + DROP + '</button>';
    let h = '<div class="slots">';
    for (let i = 0; i < g.cap; i++) {
      const s = g.inv[i];
      if (s) {
        h += '<div class="slot' + (g.weapon === s.id ? ' on' : '') + '" data-drop="d:' + i + '"' + name(ITEMS[s.id].n) + '><button class="use" data-i="' + i + '">' + icon(s.id) +
          (s.n > 1 ? '<em>' + s.n + '</em>' : '') + '</button>' + put('d:' + i) + '</div>';
      } else h += '<div class="slot empty"></div>';
    }
    h += '</div><div class="row">';
    const group = (cells: string[]) => { if (cells.length) h += '<div class="grp">' + cells.join('') + '</div>'; };
    group(g.tools.map(k => '<div class="slot sm' + (g.light === k ? ' on' : '') + (g.light === k && g.lightOn ? ' lit' : '') + '" data-drop="pt:' + k + '"' + name(ITEMS[k].n) +
      '><button class="use" data-t="' + k + '">' + icon(k) + '</button>' + put('pt:' + k) + '</div>'));
    group(g.worn.map(k => '<div class="slot sm"' + name(ITEMS[k].n) + '><button class="use" data-w="' + k + '">' + icon(k) + '</button></div>'));
    group(g.keys.map(k => '<div class="slot sm"' + name(keyName(k)) + '>' + keyIcon(k) + '</div>'));
    group(g.read.map(k => '<div class="slot sm"' + name(g.notes[k].t) + '><button class="use" data-n="' + k + '">' + icon('paper') + '</button></div>'));
    h += '</div>';
    /* drawn again only when it changes: drawn every frame, a button pressed for longer than a frame was gone before the
       press ended, and the click never landed */
    if (h === this.invHtml) return;
    this.invHtml = h;
    $('invb').innerHTML = h;
    /* the name stays over what it was on, if that is still there */
    const was = this.tipped;
    this.tip(was ? [...$('invb').querySelectorAll<HTMLElement>('[data-name]')].find(e => e.dataset.name === was) ?? null : null);
  }
  showNote(g: Game, key: string): void {
    const n = g.notes[key], art = $('notet');
    art.innerHTML = '<h2></h2><div></div>';
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
    let h = '';
    for (const l of levels) h += '<button data-f="' + l.id + '"' + (l.here ? ' disabled' : '') + '>' + esc(l.name) + '</button>';
    $('liftb').innerHTML = h;
    this.show('lift');
  }
  showEnd(win: boolean): void {
    /* the way out is told, as a paper would tell it; a death is only named */
    $('endh').textContent = win ? 'Surface' : 'Grafted';
    $('endp').textContent = !win ? ''
      : 'The lift climbs for a long time. When the doors open it is raining, and the rain is the first thing in nine days that has asked nothing of you. Six floors down, something green and something red go on disagreeing about who the station belongs to.';
    setTimeout(() => $('end').classList.remove('hide'), win ? 300 : 900);
    if (!win) $('vig').style.opacity = '1';
  }
}
