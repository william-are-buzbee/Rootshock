(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=1/60,t=8,n=class{acc=0;alpha=0;advance(n){this.acc+=Math.max(0,n);let r=Math.floor(this.acc/e+1e-9);return r>t?(r=t,this.acc=0):this.acc=Math.max(0,this.acc-r*e),this.alpha=this.acc/e,r}},r=Math.PI,i=r*2,a=(e,t,n)=>e<t?t:e>n?n:e;function o(e,t){return((t-e+r)%i+i)%i-r}var s=(e,t,n)=>e+o(e,t)*n;function c(e){return typeof e==`number`?[(e>>16&255)/255,(e>>8&255)/255,(e&255)/255]:e}var l=(e,t)=>[e[0]*t,e[1]*t,e[2]*t],u=[0,0,0],d=class{s;constructor(e){this.s=typeof e==`number`?e>>>0:f(e)}next(){let e=this.s=this.s+1831565813>>>0;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}range(e,t){return t===void 0?this.next()*e:e+this.next()*(t-e)}int(e){return Math.floor(this.next()*e)}pick(e){return e[this.int(e.length)]}chance(e){return this.next()<e}state(){return this.s}restore(e){this.s=e>>>0}};function f(e){let t=2166136261;for(let n=0;n<e.length;n++)t=Math.imul(t^e.charCodeAt(n),16777619);return t>>>0}var p=(e,t,n,r,i,a=0)=>({base:e,modes:t,click:n,clickT:r,grit:a,build:i}),m=(e,t,n,r,i,a=1,o=0)=>({pattern:e,gloss:t,tight:n,metal:r,bump:i,wear:a,salt:o}),h={concrete:{n:`Concrete`,ring:p(110,[[1,1,.07],[2.1,.35,.04]],700,.05,`solid`),look:m(`cast`,.04,8,0,.35,1,1)},block:{n:`Painted block`,ring:p(150,[[1,1,.06],[2.4,.3,.03]],900,.04,`solid`),look:m(`block`,.12,14,0,.5)},plaster:{n:`Painted plaster`,ring:p(130,[[1,1,.05]],600,.04,`solid`),look:m(`plaster`,.2,12,0,.12)},tiles:{n:`Ceiling tiles`,ring:p(210,[[1,.6,.05]],420,.06,`hollow`),look:m(`tiles`,.03,8,0,.3)},glazed:{n:`Glazed tile`,ring:p(900,[[1,.5,.05],[2.7,.3,.03]],2600,.02,`solid`),look:m(`glazed`,.75,70,0,.25)},paving:{n:`Paving`,ring:p(120,[[1,1,.06],[2.6,.3,.03]],900,.04,`solid`,2),look:m(`flags`,.03,8,0,.45)},grating:{n:`Steel grating`,ring:p(380,[[1,1,.18],[2.76,.45,.12],[5.4,.25,.08],[8.93,.12,.05]],1300,.05,`grate`),look:m(`mesh`,.25,18,.6,.3)},steel:{n:`Steel`,ring:p(300,[[1,1,.3],[2.76,.5,.2],[5.4,.3,.12]],1500,.03,`sheet`),look:m(`plate`,.45,50,.85,.2)},rock:{n:`Rock`,ring:p(90,[[1,.6,.05]],1200,.02,`solid`,4),look:m(`rock`,.05,14,0,1,0)},wood:{n:`Wood`,ring:p(190,[[1,1,.12],[2.2,.25,.05]],500,.05,`hollow`),look:m(`boards`,.08,10,0,.3)},glass:{n:`Glass`,ring:p(1700,[[1,1,.35],[2.3,.4,.2]],4e3,.01,`sheet`),look:m(`none`,1,120,0,0,0)},shot:{n:`Shotcrete`,ring:p(100,[[1,1,.06],[2.1,.3,.035]],650,.05,`solid`,1),look:m(`shot`,.05,10,0,.8,1,1)},board:{n:`Plasterboard`,ring:p(170,[[1,1,.08],[2.3,.3,.04]],520,.04,`hollow`),look:m(`plaster`,.16,12,0,.1)},epoxy:{n:`Coated concrete`,ring:p(115,[[1,1,.06],[2.2,.3,.035]],1100,.035,`solid`),look:m(`epoxy`,.35,30,0,.15)},vinyl:{n:`Sheet vinyl`,ring:p(110,[[1,.8,.05]],520,.05,`solid`),look:m(`vinyl`,.25,22,0,.1)},carpet:{n:`Carpet tile`,ring:p(90,[[1,.3,.035]],300,.06,`solid`),look:m(`carpet`,0,8,0,.25)},terrazzo:{n:`Terrazzo`,ring:p(140,[[1,1,.06],[2.5,.35,.035]],1400,.03,`solid`),look:m(`terrazzo`,.55,45,0,.12)},stone:{n:`Limestone`,ring:p(160,[[1,1,.06],[2.6,.35,.03]],1300,.03,`solid`),look:m(`stone`,.22,24,0,.3)}},g=Object.keys(h),_={floor:`concrete`,wall:`concrete`,ceiling:`concrete`},v={floor:`grating`,wall:`concrete`,ceiling:`concrete`},y={floor:`rock`,wall:`rock`,ceiling:`rock`},b={floor:`paving`,wall:`plaster`,ceiling:`rock`},x={floor:`concrete`,wall:`steel`,ceiling:`steel`},S={floor:`concrete`,wall:`shot`,ceiling:`shot`},C=(1+Math.sqrt(5))/2/Math.hypot(1,(1+Math.sqrt(5))/2),w=Math.PI/2,T=[[`cyl`,[2.9,2.85,2.6],.065,.01,.065,.137,.04,0,Math.PI/2]];function E(e){switch(e){case`baton`:return[[`cyl`,1842720,.05,.55,.05,0,.03,0,w],[`cyl`,3816768,.06,.14,.06,-.2,.03,0,w]];case`adjwrench`:return[[`box`,12106944,.36,.03,.05,0,.015,0],[`box`,12106944,.08,.03,.12,.2,.015,0]];case`pistol`:return[[`box`,1842720,.2,.04,.05,0,.02,0],[`box`,1842720,.05,.04,.12,-.07,.02,.06]];case`shotgun`:return[[`box`,1842720,.7,.05,.06,0,.03,0],[`box`,5914676,.25,.06,.07,-.4,.03,0]];case`ammo9`:return[[`box`,9075242,.12,.06,.08,0,.03,0]];case`shells`:return[[`box`,11020832,.14,.07,.1,0,.035,0]];case`tacvest`:return[[`box`,2303788,.46,.14,.54,0,.07,0],[`box`,3817520,.12,.05,.14,-.1,.15,.1],[`box`,3817520,.12,.05,.14,.1,.15,.1]];case`goggles`:return[[`box`,2237994,.18,.05,.03,0,.03,0],[`cyl`,[2.2,2.5,2.6],.07,.03,.07,-.05,.03,.02,w],[`cyl`,[2.2,2.5,2.6],.07,.03,.07,.05,.03,.02,w]];case`rebreather`:return[[`box`,2763822,.26,.12,.2,0,.06,0],[`cyl`,13214247,.09,.2,.09,.08,.17,0,w],[`box`,1382427,.05,.05,.16,-.1,.14,.12]];case`surf`:return[[`box`,[2.3,2.85,2.5],.09,.006,.06,0,.006,0]];case`pipe`:return[[`cyl`,8027780,.06,.8,.06,0,.03,0,w]];case`wrench`:return[[`box`,9058858,.45,.035,.06,0,.02,0],[`box`,10133156,.1,.035,.13,.24,.02,0]];case`knife`:return[[`box`,2237994,.12,.025,.03,-.1,.015,0],[`box`,13159632,.22,.01,.045,.07,.01,0]];case`axe`:return[[`box`,8018484,.9,.04,.045,0,.02,0],[`box`,11020832,.14,.035,.24,.38,.0175,.06]];case`flash`:return[[`cyl`,2763822,.06,.2,.06,0,.035,0,w],[`cyl`,13214247,.075,.05,.075,.11,.04,0,w]];case`lantern`:return[[`cyl`,13214247,.14,.06,.14,0,.03,0],[`cyl`,[2.4,2.6,2.7],.11,.14,.11,0,.13,0],[`cyl`,13214247,.14,.05,.14,0,.225,0],[`box`,2763822,.16,.02,.02,0,.3,0]];case`batt`:return[[`cyl`,12088115,.045,.1,.045,0,.05,0],[`cyl`,2237994,.047,.04,.047,0,.03,0]];case`medkit`:return[[`box`,13949140,.32,.14,.22,0,.07,0],[`box`,11020832,.12,.01,.04,0,.145,0],[`box`,11020832,.04,.01,.12,0,.145,0]];case`bandage`:return[[`cyl`,14210248,.09,.07,.09,0,.035,0]];case`ration`:return[[`box`,9077880,.15,.03,.08,0,.015,0]];case`peaches`:return[[`cyl`,12106944,.09,.11,.09,0,.055,0],[`cyl`,14191146,.093,.06,.093,0,.055,0]];case`fuse`:return[[`cyl`,14209208,.07,.22,.07,0,.04,0,w],[`cyl`,12088115,.075,.04,.075,-.1,.04,0,w],[`cyl`,12088115,.075,.04,.075,.1,.04,0,w]];case`armor`:return[[`box`,2303788,.44,.12,.52,0,.06,0],[`box`,3754074,.3,.02,.1,0,.125,-.1]];case`hardhat`:return[[`ico`,13214247,.28,.2,.3,0,.08,0],[`box`,13214247,.2,.02,.12,0,.02,.17]];case`kit`:return[[`box`,3754074,.3,.12,.2,0,.06,0],[`cyl`,1711134,.2,.05,.2,0,.145,0],[`box`,13214247,.3,.02,.05,0,.125,0]];default:return[[`box`,[2.5,2.48,2.4],.2,.004,.28,0,.004,0]]}}var D=(e,t)=>Math.sin(e*12.9898+t*78.233)*43758.5453%1*Math.PI;function O(e){return e.on?e.on.yaw+w:e.yaw??(e.id===`flash`?w:D(e.x,e.z))}var k=e=>e.yaw??D(e.x,e.z)*.3;function A(e,t,n,r,i){let a=[],o=Math.cos(i),s=Math.sin(i);for(let[i,,c,l,u,d,f,p,m]of E(e)){let e=Math.cos(m??0),h=Math.sin(m??0),g=i===`ico`?C:1;for(let i of[-.5,.5])for(let m of[-.5,.5])for(let _ of[-.5,.5]){let v=i*c*g,y=m*l*g,b=_*u*g,x=v*e-y*h+d,S=v*h+y*e+f,C=b+p;a.push([t+x*o+C*s,n+S,r-x*s+C*o])}}return a}var j={fl:6973022,wl:9209982,st:9075274},ee={fl:5593180,wl:7369850,st:3754074},M={fl:5263956,wl:6974828,st:12098350},te={fl:5132370,wl:6711918,st:11031070},ne={fl:4867132,wl:5919304,st:5919304},re=[.8,.85,.9],ie=[0,0,0],ae={up:.03,down:.1,turn:.06,edge:.05},oe=class{rng;def;nolamp=new Set;goods=new Set;constructor(e,t,n={}){this.def={id:e,name:t,seed:n.seed??e,circuit:n.circuit??`MAIN`,...n.cards?{cards:!0}:{},rooms:[],blocks:[],props:[],colliders:[],surfaces:[],water:[],doors:[],platforms:[],lamps:[],signs:[],items:[],notes:[],mutants:[],uses:[],marks:{},start:{x:0,y:0,z:0,yaw:0}},this.rng=new d(this.def.seed)}room(e,t,n,r,i,a={}){let o=a.pal??j,s=a.light!==void 0,l=s&&a.light[0]+a.light[1]+a.light[2]===0,u={id:this.def.rooms.length,name:e,plain:!!a.plain,x0:Math.min(t,r),z0:Math.min(n,i),x1:Math.max(t,r),z1:Math.max(n,i),y0:a.y0??0,ht:a.ht??3.2,floor:c(o.fl),wall:c(o.wl),stripe:c(o.st),mat:{..._,...a.mat},lit:a.lit??(s&&l?`none`:`always`),lc:a.lc??(s?a.light:re),em:!!a.em,...a.batt?{batt:a.batt}:{},circuit:a.circuit??this.def.circuit,flick:!!a.flick,doorway:!!a.doorway,...a.part?{part:!0}:{},safe:!!a.safe,noroam:!!a.noroam,armed:!!a.armed,...a.zone?{zone:a.zone}:{},...a.sky===void 0?{}:{sky:c(a.sky)},...a.motes&&a.motes!==`dust`?{motes:a.motes}:{}};return this.def.rooms.push(u),a.nolamp&&this.nolamp.add(u.id),u}block(e,t,n,r,i,a,o,s=`concrete`){this.def.blocks.push({x0:Math.min(e,r),y0:Math.min(t,i),z0:Math.min(n,a),x1:Math.max(e,r),y1:Math.max(t,i),z1:Math.max(n,a),colour:c(o),mat:s})}steps(e,t,n,r,i,a,o,s,c){let l=s===`e`||s===`w`,u=s===`w`||s===`n`;for(let s=0;s<o;s++){let d=s/o,f=(s+1)/o,p=i+(a-i)*(s+1)/o,m=u?1-f:d,h=u?1-d:f;l?this.block(e+(n-e)*m,i,t,e+(n-e)*h,p,r,s%2?c:se(c,.94)):this.block(e,i,t+(r-t)*m,n,p,t+(r-t)*h,s%2?c:se(c,.94))}}prop(e,t,n,r,i,a,o,s={}){let l=this.floorAt(t,n),u=s.y??l,d=s.solid??(e!==`ico`&&i>=.3&&u-l<1.6),f={shape:e,x:t,y:u,z:n,sx:r,sy:i,sz:a,ry:s.ry??0,rz:s.rz??0,colour:c(o),glow:s.glow??1,solid:d||!!s.loose,loose:!!s.loose},p=s.mat??(s.loose?`wood`:void 0);return p&&(f.mat=p),s.services&&(f.services=!0),s.flush&&(f.flush=!0),s.pw&&(f.pw=s.pw,f.pc=s.pc??this.def.circuit),this.def.props.push(f),s.goods&&this.goods.add(f),f}box(e,t,n,r,i,a,o){return this.prop(`box`,e,t,n,r,i,a,o)}ramp(e,t,n,r,i,a,o,s){let c=o===`e`||o===`w`,l=o===`w`||o===`n`;this.surface(`floor`,e,t,n,r,(o,s)=>{let u=c?(o-e)/(n-e):(s-t)/(r-t);return i+(a-i)*(l?1-u:u)},Math.min(i,a),s,!0,.5,`concrete`)}cave(e,t,n,r,i,a={}){let o=a.y0??0,s=a.ht??4,u=a.floor??(()=>0),d=a.ceil??(()=>0),f=a.res??.5,p=1/0,m=-1/0;for(let e=n;e<=i+1e-9;e+=f)for(let n=t;n<=r+1e-9;n+=f)p=Math.min(p,u(n,e)),m=Math.max(m,d(n,e));let h=(e,t)=>(t?Math.ceil(e/.25):Math.floor(e/.25))*.25,g=h(o+p,!1),_=h(o+s+m,!0),v=a.pal??ne,b=this.room(e,t,n,r,i,{...a,pal:v,y0:g,ht:_-g,plain:!0,nolamp:a.nolamp??!0,mat:{...y,...a.mat}});return this.surface(`floor`,t,n,r,i,(e,t)=>o+u(e,t),g-.25,v.fl,!1,f,b.mat.floor),this.surface(`ceiling`,t,n,r,i,(e,t)=>o+s+d(e,t),_+.25,l(c(v.wl),.6),!1,f,b.mat.ceiling),b}surface(e,t,n,r,i,a,o,s,l,u,d){let f=Math.max(2,Math.round((r-t)/u)+1),p=Math.max(2,Math.round((i-n)/u)+1),m=[];u=Math.max((r-t)/(f-1),(i-n)/(p-1));for(let e=0;e<p;e++)for(let r=0;r<f;r++)m.push(a(t+r*u,n+e*u));let h={kind:e,x0:t,z0:n,x1:r,z1:i,res:u,nx:f,nz:p,h:m,base:o,colour:c(s),mat:d,sides:l};this.def.surfaces.push(h)}lattice(e,t,n,r,i,a,o,s,l,u,d,f,p){this.def.surfaces.push({kind:e,x0:t,z0:n,x1:r,z1:i,res:a,nx:o,nz:s,h:l,base:u,colour:c(d),mat:f,sides:!1,...p?{mask:p}:{}})}water(e,t,n,r,i){this.def.water.push({x0:e,z0:t,x1:n,z1:r,level:i})}door(e,t,n,r,i=2.4,a={}){let o=this.floorAt((e+n)/2,(t+r)/2),s={x0:e,y0:o,z0:t,x1:n,y1:o+i,z1:r,kind:`light`,alongX:n-e>r-t,open:!1,stuck:!1,seal:!1,vent:!1,lift:!1,circuit:this.def.circuit,mat:a.glass?`glass`:`steel`,...a};return this.def.doors.push(s),s}platform(e,t,n,r,i,a,o=12098350,s,l=`steel`){this.def.platforms.push({x0:e,z0:t,x1:n,z1:r,y0:i,y1:a,colour:c(o),mat:l,...s?{call:s}:{}})}collider(e,t,n,r,i,a){let o=a??this.floorAt(e,t);this.def.colliders.push({x0:e-n/2,y0:o,z0:t-i/2,x1:e+n/2,y1:o+r,z1:t+i/2})}camera(e,t,n,r,i){(this.def.cameras??=[]).push({x:e,y:t,z:n,yaw:r,...i})}speaker(e,t,n,r,i={}){(this.def.speakers??=[]).push({zone:e,x:t,y:n,z:r,...i})}lamp(e,t,n,r,i){this.def.lamps.push({x:e,y:t,z:n,r,colour:i})}sign(e,t,n,r,i,a=this.def.circuit){this.def.signs.push({text:e,x:t,y:n,z:r,yaw:i,circuit:a})}item(e,t,n,r,i=1,a){this.def.items.push({id:e,x:t,y:n,z:r,n:i,...a?{on:a}:{}})}note(e,t,n,r,i=!1){this.def.notes.push({key:e,x:t,y:n,z:r,...i?{bare:i}:{}})}mutant(e,t,n,r,i={}){this.def.mutants.push({type:e,x:t,y:n,z:r,opts:i})}use(e,t,n,r,i={}){this.def.uses.push({kind:e,x:t,y:n,z:r,opts:i})}mark(e,t,n,r,i){this.def.marks[e]={x:t,y:n,z:r,yaw:i}}fixture(e,t,n){(this.def.fixtures??=[]).push({x:e,y:t,z:n})}vent(e,t,n){(this.def.vents??=[]).push({x:e,y:t,z:n})}stain(e,t,n,r){(this.def.stains??=[]).push({x:e,y:t,z:n,r})}get level(){return this.def}start(e,t,n,r=this.floorAt(e,t)){this.def.start={x:e,y:r,z:t,yaw:n}}floorAt(e,t){let n=-1/0;for(let r of this.def.rooms)e>=r.x0&&e<r.x1&&t>=r.z0&&t<r.z1&&(n=Math.max(n,r.y0));for(let r of this.def.blocks)e>=r.x0&&e<r.x1&&t>=r.z0&&t<r.z1&&r.y1>n&&r.y0<=n+.01&&(n=r.y1);for(let r of this.def.surfaces){if(r.kind!==`floor`)continue;let i=ue(r,e,t);i!==null&&(n=Math.max(n,i))}return n===-1/0?0:n}finish(){for(let e of this.def.rooms){if(this.nolamp.has(e.id))continue;let t=e.lit===`none`,n=e.x1-e.x0,r=e.z1-e.z0;for(let i=e.z0+Math.min(3,r/2);i<e.z1;i+=6)for(let r=e.x0+Math.min(3,n/2);r<e.x1;r+=6)this.box(r,i,1.1,.06,.3,t?2763822:15265522,{y:le(e.y0+e.ht)-.07,glow:t?1:3,solid:!1})}for(let e of this.def.items)this.settle(e,e.id);for(let e of this.def.notes)e.bare||this.settle(e,`note`);return this.clear(),this.def}settle(e,t){let n=e.x,r=e.z,i=e.y+ae.up,a=-1/0,o=null,s=e=>e<=i&&e>a;for(let t of this.def.rooms)!t.doorway&&n>=t.x0&&n<t.x1&&r>=t.z0&&r<t.z1&&t.y0+t.ht>e.y&&s(t.y0)&&(a=t.y0,o=null);for(let e of this.def.blocks)n>=e.x0&&n<e.x1&&r>=e.z0&&r<e.z1&&s(e.y1)&&(a=e.y1,o=null);for(let e of this.def.surfaces){let t=e.kind===`floor`&&!e.hidden?ue(e,n,r):null;t!==null&&s(t)&&(a=t,o=null)}for(let e of this.def.props)e.shape!==`ico`&&!e.services&&Math.abs(Math.sin(e.rz))<.05&&de(e,n,r)&&s(e.y+e.sy)&&(a=e.y+e.sy,o=e);if(a<e.y-ae.down||(e.y=a,!o||e.on)||(e.yaw=o.ry+(o.sx>=o.sz?0:Math.PI/2)+D(n,r)*ae.turn,o.shape!==`box`))return;let c=Math.cos(o.ry),l=Math.sin(o.ry),u=1/0,d=-1/0,f=1/0,p=-1/0;for(let[i,,s]of A(t,n,a,r,e.yaw)){let e=i-o.x,t=s-o.z,n=e*c-t*l,r=e*l+t*c;u=Math.min(u,n),d=Math.max(d,n),f=Math.min(f,r),p=Math.max(p,r)}let m=(e,t,n)=>{let r=n-ae.edge;return t-e>2*r?-(e+t)/2:e<-r?-r-e:t>r?r-t:0},h=m(u,d,o.sx/2),g=m(f,p,o.sz/2);e.x+=h*c+g*l,e.z+=-h*l+g*c}clear(){if(!this.goods.size)return;let e=[...this.def.items.map(e=>A(e.id,e.x,e.y,e.z,O(e))),...this.def.notes.filter(e=>!e.bare).map(e=>A(`note`,e.x,e.y,e.z,k(e)))].map(pe),t=.002;this.def.props=this.def.props.filter(n=>{if(!this.goods.has(n))return!0;let r=pe(fe(n));return!e.some(e=>e[0]<r[3]-t&&e[3]>r[0]+t&&e[1]<r[4]-t&&e[4]>r[1]+t&&e[2]<r[5]-t&&e[5]>r[2]+t)})}};function se(e,t){return l(c(e),t)}var ce=.25,le=e=>Math.round(e/ce)*ce;function ue(e,t,n){if(t<e.x0||t>e.x1||n<e.z0||n>e.z1)return null;let r=Math.min((t-e.x0)/e.res,e.nx-1-1e-9),i=Math.min((n-e.z0)/e.res,e.nz-1-1e-9),a=Math.floor(r),o=Math.floor(i);if(e.mask&&!e.mask[o*(e.nx-1)+a])return null;let s=r-a,c=i-o,l=e.h,u=e.nx;return l[o*u+a]*(1-s)*(1-c)+l[o*u+a+1]*s*(1-c)+l[(o+1)*u+a]*(1-s)*c+l[(o+1)*u+a+1]*s*c}function de(e,t,n){let r=t-e.x,i=n-e.z,a=Math.cos(e.ry),o=Math.sin(e.ry),s=r*a-i*o,c=r*o+i*a;return e.shape===`box`?Math.abs(s)<=e.sx/2&&Math.abs(c)<=e.sz/2:(s/(e.sx/2))**2+(c/(e.sz/2))**2<=1}function fe(e){let t=[],n=Math.cos(e.ry),r=Math.sin(e.ry),i=Math.cos(e.rz),a=Math.sin(e.rz),o=e.shape===`ico`?C:1,s=e.y+e.sy/2*o;for(let c of[-.5,.5])for(let l of[-.5,.5])for(let u of[-.5,.5]){let d=c*e.sx*o,f=l*e.sy*o,p=u*e.sz*o;if(e.rz){let e=d*i-f*a;f=d*a+f*i,d=e}let m=d*n+p*r;p=-d*r+p*n,d=m,t.push([e.x+d,s+f,e.z+p])}return t}function pe(e){let t=[1/0,1/0,1/0,-1/0,-1/0,-1/0];for(let n of e)for(let e=0;e<3;e++)t[e]=Math.min(t[e],n[e]),t[e+3]=Math.max(t[e+3],n[e]);return t}function me(e,t,n,r,i,a=5987679){let o=i>r,s=e.floorAt(t,n);e.box(t,n,r,.05,i,a,{y:s+.71,solid:!1});for(let a of[-1,1])e.box(t+(o?0:a*(r/2-.08)),n+(o?a*(i/2-.08):0),o?r-.1:.06,.71,o?.06:i-.1,3356218,{y:s,solid:!1});e.collider(t,n,r,.76,i)}function he(e,t,n,r,i){let a=i>r,o=a?i:r,s=e.floorAt(t,n),c=e.rng;for(let a of[.1,.55,1,1.45,1.86])e.box(t,n,r,.04,i,4869456,{y:s+a,solid:!1});for(let o of[-1,1])e.box(t+(a?0:o*(r/2-.02)),n+(a?o*(i/2-.02):0),a?r:.04,1.9,a?.04:i,3816768,{y:s,solid:!1});for(let r of[.14,.59,1.04,1.49])for(let i=0;i<(o>2?3:2);i++){let i=c.range(-o/2+.3,o/2-.3),l=c.range(.15,.3);e.box(t+(a?0:i),n+(a?i:0),l,c.range(.14,.3),l,c.pick([7035452,5069414,8014388,6056778]),{y:s+r,solid:!1})}e.collider(t,n,r,1.9,i)}var ge=[6965812,3824234,5921338,7035452,4868690,8010282];function _e(e,t,n,r,i=!0){let a=e.rng;for(let o=0;o<r;o++){let r=a.range(.8,1.4),o=a.range(-.7,.7),s=a.range(-.7,.7);e.box(t+o,n+s,r,r,r,a.pick(ge),{ry:i?0:a.range(-.3,.3),solid:!0,loose:i}),a.chance(.4)&&e.box(t+o,n+s,r*.8,r*.8,r*.8,a.pick(ge),{y:e.floorAt(t+o,n+s)+r,ry:i?0:a.range(-.3,.3),solid:!0,loose:i})}}function ve(e,t,n,r){e.prop(`cyl`,t,n,.5,r,.5,5593180,{solid:!0})}function ye(){let e=new oe(`testbed`,`Test bed`);e.room(`Hall`,0,0,16,12,{ht:4,pal:j}),e.block(12,0,0,16,1,4,5922144),e.steps(10,0,12,2,0,1,4,`e`,5922144),e.block(2,0,9,4,.75,12,7035452),e.block(6,0,9,7,1.75,12,5593180),me(e,5,4,2,.95),he(e,.3,5,.5,2.4),ve(e,8,6,4),_e(e,13.5,9,3),e.room(`Service corridor`,16,5,24,7,{ht:2.4,pal:M,light:[.32,.33,.36]}),e.room(`Dark store`,24,2,32,10,{pal:te,light:ie}),_e(e,29,4,4),_e(e,27,8.5,2),e.room(`Crawlway`,-6,8.5,0,10,{ht:1.25,pal:M,light:[.3,.25,.18],nolamp:!0}),e.room(`Closet`,-10,6,-6,12,{ht:3,pal:M,light:[.5,.12,.08]}),e.room(`Passage`,7,12,9,13.75,{ht:2.6,pal:M,light:[.32,.33,.36],nolamp:!0}),e.room(``,7,13.75,9,14,{ht:2.4,pal:M,light:[.32,.33,.36],nolamp:!0}),e.room(`Passage`,7,14,9,16,{ht:2.6,pal:M,light:[.32,.33,.36],nolamp:!0}),e.door(7,13.75,9,14,2.4),e.room(`Lab`,0,16,16,34,{ht:6,pal:ee,light:[.62,.66,.7]}),e.block(0,0,26,5,2,34,5593180),e.ramp(1,18,3,26,0,2,`s`,6251110),e.block(10,0,28,16,3,34,5593180),e.platform(8,30,10,32,.2,3),e.room(`Pool`,6,18,12,24,{y0:-3,ht:3,pal:ee,light:[.4,.5,.55],nolamp:!0}),e.block(6,-3,18,7.5,-.5,24,4872796),e.water(6,18,12,24,-.15);for(let[t,n]of[[13,19],[14.3,19],[13,20.3],[14.3,21.6]])e.box(t,n,1.1,1.1,1.1,6965812,{loose:!0});e.box(13,19,.9,.9,.9,3824234,{y:1.1,loose:!0}),_e(e,3.5,31,2),e.room(`Tunnel`,16,20,18,22,{ht:2.6,pal:{fl:4867132,wl:5919304,st:5919304},light:[.12,.14,.12],nolamp:!0,plain:!0,mat:y});let t=e=>Math.max(0,(e-18)/14);e.cave(`Cave`,18,14,32,30,{ht:3,light:[.1,.17,.12],floor:(e,n)=>t(e)*1.2+.4*Math.sin(e*.9)*Math.sin(n*.7)*t(e),ceil:(e,t)=>1.6*Math.sin(Math.PI*(t-14)/16)+.3*Math.sin(e*1.3+t)});for(let[t,n,r]of[[24,18,1.2],[28,25,1.6],[21,27,.9]])e.prop(`ico`,t,n,r,r*.7,r,5919304,{solid:!0});return e.room(`Arena gate`,6,-2,8,0,{ht:3,pal:M,light:[.4,.42,.45],nolamp:!0}),e.room(`Arena`,-2,-18,18,-2,{ht:5,pal:ee,light:[.62,.64,.66]}),me(e,3.5,-3.4,2.4,.8),[`baton`,`pipe`,`wrench`,`axe`,`knife`].forEach((t,n)=>e.item(t,2.6+n*.45,.77,-3.4)),e.block(12,0,-18,18,3,-13,5593180),e.ramp(4,-18,12,-15.5,0,3,`e`,6251110),e.room(`Arena corridor`,18,-11,28,-9.4,{ht:3,pal:M,light:[.45,.46,.5]}),e.room(`Low bay`,-8,-14,-2,-6,{ht:2.2,pal:M,light:[.45,.42,.38]}),e.start(3,3,-r/2),e.finish()}var be=null;function xe(e,t){let n=new oe(e.id,e.name,{circuit:e.c,cards:e.cards});be={b:n,rng:n.rng,ladders:t,decks:[]}}var Se=()=>{if(!be)throw Error(`tiles: no level begun`);return be},N=(e,t)=>Se().rng.range(e,t),Ce=e=>Se().rng.pick(e),P=e=>c(e);function we(e,t,n,r={}){let i={lv:e,name:e.name,c:e.c,W:t,H:n,org:e.org??[0,0],y0:r.y0??0,li:r.li??0,wet:r.wet??0,deep:r.deep??0,ground:!!r.ground,g:new Uint8Array(t*n),rm:new Int16Array(t*n).fill(-1),nom:new Uint8Array(t*n),rooms:[],doors:new Map,above:null,below:null,hf:null,cf:null,hset:null,props:[],cols:[],lamps:[],cams:[],speakers:[],stains:[],elevs:[],stairs:[],flights:[],items:[],notes:[],muts:[],uses:[],marks:{},conn:new Set,water:[],thin:new Map};return Se().decks.push(i),i}function Te(e,t){if(e.W!==t.W||e.H!==t.H)throw Error(`Stacked layers must share one grid: `+e.name);e.above=t,t.below=e}function Ee(e,t){let n=e.below;for(;n&&!n.g[t];)n=n.below;return n}var F=[.8,.85,.9];function I(e,t,n,r,i,a,o={}){let s={id:e.rooms.length,name:t,x:n,y:r,w:i,h:a,ht:o.ht??3.2,dy:o.dy??0,fl:o.fl??7040618,wl:o.wl??8159098,st:o.st??5592405,lit:o.lit??`main`,lc:o.lc??F,em:!!o.em,...o.batt?{batt:o.batt}:{},c:o.c??e.c,flick:!!o.flick,open:!!o.open,hole:o.hole?String(o.hole):null,cave:!!o.cave,air:!!o.air,...o.sky===void 0?{}:{sky:o.sky},...o.motes?{motes:o.motes}:{},mat:{...o.cave?y:o.open?v:o.sky===void 0?_:b,...o.mat},nolamp:!!o.nolamp,noroam:!!o.noroam,safe:!!o.safe,armed:!!o.armed,...o.zone?{zone:o.zone}:{}};e.rooms.push(s);for(let t=r;t<r+a;t++)for(let r=n;r<n+i;r++)e.g[t*e.W+r]=1,e.rm[t*e.W+r]=s.id;return s}function L(e,t,n,r,i){if(r!==1&&i!==1)throw Error(`partition: one tile thick`);let a=r===1&&i>1?`x`:`z`;for(let o=n;o<n+i;o++)for(let n=t;n<t+r;n++)e.thin.set(o*e.W+n,a)}var De=.5,Oe=1.2,ke={full:[0,2.4],view:[.9,2.2],obs:[1.2,2.2],high:[2.2,2.8]};function R(e,t,n,r={}){let i=n*e.W+t;e.g[i]=1,e.rm[i]=-2,e.doors.set(i,{x:t,y:n,...r})}function z(e,t,n,r,i,a,o,s,c={}){let l=c.y??0,u=c.c===1||c.c!==0&&a>=.3&&l<1.6&&t!==`ico`;e.props.push({shape:t,x:n*2,z:r*2,y:l,sx:i,sy:a,sz:o,c:P(s),ry:c.ry??0,rz:c.rz??0,glow:c.glow??0,pw:c.pw?[P(c.pw[0]),P(c.pw[1])]:null,pc:c.pc??null,solid:u||!!c.loose,loose:!!c.loose,...c.mat?{mat:c.mat}:{},...c.flush?{flush:!0}:{},...c.goods?{goods:!0}:{},...c.lie?{lie:!0}:{}})}var B=(e,t,n,r,i,a,o,s)=>z(e,`box`,t,n,r,i,a,o,s);function Ae(e,t,n,r,i,a=.76){e.cols.push([t*2-r/2,n*2-i/2,t*2+r/2,n*2+i/2,0,a])}function je(e,t,n,r){z(e,`cyl`,t,n,.06,1.5,.06,2763822,{c:0}),B(e,t,n,.34,.22,.12,[2.95,2.9,2.65],{y:1.5,c:0}),B(e,t,n,.5,.05,.5,2763822,{c:0}),e.lamps.push({x:t*2,z:n*2,r,c:[.78,.74,.6],h:1.5})}function Me(e,t,n,r){e.stains.push({x:t*2,z:n*2,r})}function V(e,t,n,r,i=0,a=1){let o={id:t,x:n*2,z:r*2,y:i,n:a};return e.items.push(o),o}function Ne(e,t,n,r,i=0,a=!1){e.notes.push({key:t,x:n*2,z:r*2,y:i,...a?{bare:a}:{}})}function H(e,t,n,r,i={}){e.muts.push({type:t,x:n,z:r,o:i})}function Pe(e,t,n,r,i,a={}){e.uses.push({kind:t,x:n,z:r,y:i,o:a})}function Fe(e,t){return e[t]??(e[t]=new Float32Array((e.W+1)*(e.H+1)))}function Ie(e,t,n,r){if(!t)return 0;let i=e.W+1,o=a(n/2,0,e.W-1e-4),s=a(r/2,0,e.H-1e-4),c=Math.floor(o),l=Math.floor(s),u=o-c,d=s-l;return t[l*i+c]*(1-u)*(1-d)+t[l*i+c+1]*u*(1-d)+t[(l+1)*i+c]*(1-u)*d+t[(l+1)*i+c+1]*u*d}var Le=(e,t,n)=>Ie(e,e.hf,t,n);function Re(e,t,n,i,a,o){let s=Fe(e,`hf`),c=e.W+1,l=+!o.cave;for(let e=o.y+l;e<=o.y+o.h-l;e++)for(let u=o.x+l;u<=o.x+o.w-l;u++){let o=Math.hypot(u-t,e-n)/i;if(o<1){let t=Math.cos(o*r/2);s[e*c+u]+=a*t*t}}}function ze(e,t,n,i,a,o){let s=Fe(e,`cf`),c=e.W+1;for(let e=o.y;e<=o.y+o.h;e++)for(let l=o.x;l<=o.x+o.w;l++){let o=Math.hypot(l-t,e-n)/i;if(o<1){let t=Math.cos(o*r/2);s[e*c+l]+=a*t*t}}}function Be(e,t,n){let i=Fe(e,`cf`),a=e.W+1,o=t.w<t.h;for(let e=t.y;e<=t.y+t.h;e++)for(let s=t.x;s<=t.x+t.w;s++)i[e*a+s]+=n*Math.sin(r*(o?(s-t.x)/t.w:(e-t.y)/t.h))}function Ve(e,t,n,r){let i=Fe(e,`hf`),a=Fe(e,`cf`),o=e.W,s=o+1,c=(n,r)=>{let i=!1;for(let[a,s]of[[-1,-1],[0,-1],[-1,0],[0,0]]){let c=n+a,l=r+s;if(c<0||l<0||c>=o||l>=e.H)continue;let u=l*o+c;if(e.rm[u]===t.id&&(i=!0),e.g[u]&&!(e.rm[u]>=0&&e.rooms[e.rm[u]].cave))return!0}return!i};for(let e=t.y;e<=t.y+t.h;e++)for(let o=t.x;o<=t.x+t.w;o++)c(o,e)||(i[e*s+o]+=N(-n,n),a[e*s+o]+=N(-r,r))}var He={fl:4867132,wl:5919304,st:5919304};function Ue(e,t,n,r,i,a,o={}){return I(e,t,n,r,i,a,{...He,cave:1,ht:4,lit:`none`,nolamp:1,...o})}function We(e,t,n,r={}){let i=I(e,t,0,0,0,0,{...He,cave:1,ht:4,lit:`none`,nolamp:1,...r});i.shaped=!0;let a=Fe(e,`hf`),o=e.W+1,s=e.hset??=new Uint8Array(o*(e.H+1)),c=1e9,l=1e9,u=-1,d=-1;for(let t=0;t<e.H;t++)for(let r=0;r<e.W;r++){let f=t*e.W+r;if(e.g[f])continue;let p=n(r+.5,t+.5);if(p!==null){e.g[f]=1,e.rm[f]=i.id,c=Math.min(c,r),l=Math.min(l,t),u=Math.max(u,r),d=Math.max(d,t);for(let[e,i]of[[r,t],[r+1,t],[r,t+1],[r+1,t+1]]){let t=i*o+e;if(s[t])continue;let r=n(e,i);a[t]=r===null?p:r,s[t]=1}}}return i.x=c,i.y=l,i.w=u-c+1,i.h=d-l+1,i}var Ge=(e,t)=>.45*Math.sin(e*1.3+t*.7)+.3*Math.sin(t*1.9-e*.4);function Ke(e,t,n){let r=1e9,i=0;for(let o=0;o<e.length-1;o++){let s=e[o],c=e[o+1],l=c[0]-s[0],u=c[1]-s[1],d=a(((t-s[0])*l+(n-s[1])*u)/(l*l+u*u),0,1),f=Math.hypot(t-s[0]-l*d,n-s[1]-u*d);f<r&&(r=f,i=s[2]+(c[2]-s[2])*d)}return{d:r,h:i}}function qe(e,t,n,r,i={}){return We(e,t,(e,t)=>{let i=Ke(n,e,t);return i.d<r+Ge(e,t)*.6?i.h:null},i)}function Je(e,t,n,r,i,a,o,s={}){return We(e,t,(e,t)=>Math.hypot((e-n)/i,(t-r)/a)<1+Ge(e,t)/Math.max(i,a)?o(e,t):null,s)}function Ye(e,t,n,r,i,a){let o=Le(e,n*2,r*2)-.35;Re(e,n,r,i+1,-a,t),e.water.push([n-i-1,r-i-1,n+i+1,r+i+1,o])}function Xe(e,t,n,r,i,a,o=!1){let s=a===`e`||a===`w`,c=s?i:1,l=s?1:i;I(t,``,n,r,c,l,{hole:`st`,noroam:1,nolamp:1});for(let i=r;i<r+l;i++)for(let r=n;r<n+c;r++)e.nom[i*e.W+r]=1,t.nom[i*t.W+r]=1;e.stairs.push({tx:n,tz:r,len:i,dir:a,lo:e,hi:t,bare:o});let u=a===`w`||a===`n`,d=s?u?n:n+i-1:n,f=s||u?r:r+i-1,p=d+(s?u?-1:1:0),m=f+(s?0:u?-1:1);t.conn.add(m*t.W+p+`:`+(f*t.W+d))}function Ze(e,t,n,r,i,a,o,s,c,l=5922144){e.flights.push({tx:t,tz:n,w:r,h:i,y0:a,y1:o,n:c,dir:s,c:l})}function Qe(e,t,n,r,i,a,o,s=`Cargo elevator`){I(t,``,n,r,i,a,{hole:`el`,noroam:1,nolamp:1});for(let o=r;o<r+a;o++)for(let r=n;r<n+i;r++)e.nom[o*e.W+r]=1,t.nom[o*t.W+r]=1;e.elevs.push({tx:n,tz:r,w:i,h:a,lo:e,hi:t,c:o,name:s}),B(e,n+i/2,r+a/2,i*2,.01,a*2,12098350,{y:.012,c:0}),B(e,n+i/2,r+a/2,i*2-.4,.01,a*2-.4,2763822,{y:.016,c:0})}function $e(e,t,n,r,i,a,o,s,c={}){let l=Se().ladders[t],u=Math.floor(r)*e.W+Math.floor(n),d=e.rm[u]>=0?e.rooms[e.rm[u]]:null,f=s?d?d.ht:3.2:1.1,p=!!(l&&l.broken);if(Pe(e,`ladder`,n,r,s?1.2:.4,{id:t,up:+!!s,text:c.label}),e.marks[`ladder:`+t]=[i,a,o],!c.bare){for(let t of[-.25,.25])B(e,n+t/2,r,.06,f,.06,9075242,{c:0});for(let t=.3;t<f-.05;t+=.3)p&&t>1.2&&Se().rng.chance(.5)||B(e,n,r,.5,.04,.04,9075242,{y:t,c:0});if(s||B(e,n,r,1,.02,1,197637,{y:.014,c:0}),p)for(let t=0;t<5;t++)z(e,`ico`,n+N(-.4,.4),r+N(-.4,.4),N(.2,.5),N(.15,.35),N(.2,.5),Ce([5919304,4867132,7039588]),{c:0})}}function et(e,t,n,r,i,a,o=!1){Pe(e,`dive`,t,n,r,{to:i,label:a,...o?{under:1}:{}})}var tt={stone:5,glazed:4,board:3,plaster:3,block:2,concrete:1},nt=e=>!!e&&(e.cave||e.mat.wall===`shot`||e.mat.wall===`rock`);function rt(e,t,n,r){if(n.glass||n.vent||n.lift)return{slides:!1,lining:null};let i=t=>t>=0&&t<e.g.length&&!e.g[t],a=r?1:e.W,o=i(t+a)?1:i(t-a)?-1:1,s=it(e,t-(r?e.W:1)),c=it(e,t+(r?e.W:1)),l=e=>!e||e.open?-1:nt(e)?0:tt[e.mat.wall]??1,u=l(s)>=l(c)?s:c,d=e=>!e||e.open||nt(e)?`steel`:e.mat.wall===`stone`?`grand`:e.mat.wall===`glazed`?`clinic`:e.mat.wall===`board`||e.mat.floor===`carpet`?`office`:`steel`,f=n.stuck||(nt(s)||nt(c))&&d(u)===`steel`&&!(s?.open||c?.open);return{look:f?`shutter`:n.kind===`heavy`?`heavy`:d(u),side:o,slides:!f&&!n.seal&&i(t+o*a),lining:f||!u||u.open||nt(u)?null:u}}var it=(e,t)=>t>=0&&t<e.rm.length&&e.rm[t]>=0?e.rooms[e.rm[t]]:null,at={grand:[7229480,.16,`steel`],heavy:[3027510,.1,`steel`],steel:[3817285,.07,`steel`],office:[5130820,.06,`steel`],clinic:[10133668,.06,`steel`]};function ot(e,t,n,r,i=2,a=0,o=1){let s={c:0},c=(2-i)/2/2;if(r===`shutter`){for(let r of[0,1]){let i=r?1-c-.04/2:c+.04/2;B(e,n?t.x+i:t.x+.5,n?t.y+.5:t.y+i,n?.08:.24,2.4,n?.24:.08,3816768,{...s,mat:`steel`})}return}let[l,u,d]=at[r],f=u/2/2,p=.03/2/2,m=t.y*e.W+t.x,h=n?1:e.W,g=n?e.W:1;for(let r of[0,1]){let _=r?1-c+p:c-p,v=t=>{let n=m+t*h+(r?g:-g);return(i<2?e.thin.has(m+t*h):!e.g[m+t*h])&&!!e.g[n]&&!e.doors.has(n)},y=a-f<0&&!v(-1)?a:a-2*f,b=o+f>1&&!v(1)?o:o+2*f;for(let r of[a-f,o+f])r-f>=y-1e-9&&r+f<=b+1e-9&&B(e,n?t.x+r:t.x+_,n?t.y+_:t.y+r,n?u:.03,2.4+u,n?.03:u,l,{...s,mat:d});B(e,n?t.x+(y+b)/2:t.x+_,n?t.y+_:t.y+(y+b)/2,n?(b-y)*2:.03,u,n?.03:(b-y)*2,l,{...s,y:2.4,mat:d})}}function st(e,t,n,r,i){let a=t%e.W,o=Math.floor(t/e.W),s=n===`x`,c=(s?r<0?a:a+1:r<0?o:o+1)*2,l=(s?o:a)*2,u=l+2,d=(e,t)=>{let n=s?e:t,a=s?t:e,o=(n-c)*r;return o<-.01||o>.6||a<l||a>=u?[e,t]:s?[e-r*i,t]:[e,t-r*i]},f=e=>{[e.x,e.z]=d(e.x,e.z)},p=e=>{let[t,n]=d(e.x*2,e.z*2);e.x=t/2,e.z=n/2};e.props.forEach(f),e.items.forEach(f),e.notes.forEach(f),e.lamps.forEach(f),e.stains.forEach(f),e.uses.forEach(p),e.cams.forEach(p),e.muts.forEach(p);for(let t of e.cols){let[e,n]=d((t[0]+t[2])/2,(t[1]+t[3])/2),r=e-(t[0]+t[2])/2,i=n-(t[1]+t[3])/2;t[0]+=r,t[2]+=r,t[1]+=i,t[3]+=i}}function ct(e,t){let n=Math.cos(e.ry),r=Math.sin(e.ry),i=(i,a)=>t(e.x+i*n+a*r,e.z-i*r+a*n),a=e.sx/2,o=e.sz/2,s=(i(a,-o)+i(a,o)-(i(-a,-o)+i(-a,o)))/(4*a),c=1/0;for(let e=0;e<=4;e++)for(let t=0;t<=4;t++){let n=(e/2-1)*a,r=(t/2-1)*o;c=Math.min(c,i(n,r)-s*n)}return[c,Math.atan(s)]}var lt=e=>({pal:{fl:e.fl,wl:e.wl,st:e.st},lit:e.lit,lc:e.lc,em:e.em,batt:e.batt,circuit:e.c,flick:e.flick,nolamp:!0,plain:e.open||e.cave,safe:e.safe,noroam:e.noroam,armed:e.armed,zone:e.zone,...e.sky===void 0?{}:{sky:e.sky},motes:e.motes,mat:e.mat}),ut={fl:[.2,.21,.22],wl:[.27,.28,.3],st:[.22,.23,.25]},dt=.25;function ft(e,t){let{b:n,decks:i}=Se(),a=(e,t)=>e.org[0]+t*2,o=(e,t)=>e.org[1]+t*2,s=(e,t)=>e.org[0]+t,l=(e,t)=>e.org[1]+t,u=(e,t)=>e.rm[t]>=0?e.rooms[e.rm[t]]:null,d=(e,t,n)=>{let r=Math.floor(t/2),i=Math.floor(n/2);return r>=0&&i>=0&&r<e.W&&i<e.H?u(e,i*e.W+r)?.dy??0:0},f=(e,t,n)=>e.y0+Le(e,t,n)+d(e,t,n);i.sort((e,t)=>e.y0-t.y0);for(let e of i){for(let t of e.rooms){if(t.hole||t.shaped)continue;let r=lt(t),i=a(e,t.x),s=o(e,t.y),c=a(e,t.x+t.w),l=o(e,t.y+t.h);t.cave?n.cave(t.name,i,s,c,l,{...r,y0:e.y0,ht:t.ht,res:2,floor:(t,n)=>Ie(e,e.hf,t-e.org[0],n-e.org[1]),ceil:(t,n)=>Ie(e,e.hf,t-e.org[0],n-e.org[1])+Ie(e,e.cf,t-e.org[0],n-e.org[1])}):n.room(t.name,i,s,c,l,{...r,y0:e.y0+t.dy,ht:t.ht})}pt(n,e);for(let[t,r]of e.thin){let i=t%e.W,s=Math.floor(t/e.W),c=a(e,i),l=o(e,s),d=1.5/2,f=r===`x`?1:e.W;for(let i of[-1,1]){let a=u(e,t+i*f),o=a?e.y0+a.dy:0,s=a?.ht??0;if(a&&(a.hole||a.cave))continue;if(!a){let n=Ee(e,t+i*f),r=n&&u(n,t+i*f),c=u(e,t-i*f);if(!n||!r||r.hole||n.y0+r.dy+r.ht<=e.y0+.5)continue;a=r,o=e.y0,s=Math.min(n.y0+r.dy+r.ht,e.y0+(c?.ht??3.2))-e.y0}let p=i<0?0:1.25,m=i<0?d:2;u(e,t+i*f)===a&&st(e,t,r,i,d),n.room(a.name,r===`x`?c+p:c,r===`x`?l:l+p,r===`x`?c+m:c+2,r===`x`?l+2:l+m,{...lt(a),y0:o,ht:s,part:!0})}}if(e.wet||e.deep){let t=e.y0+(e.wet||Math.max(2.4,...e.rooms.map(e=>e.ht))+1);for(let r of e.rooms)!r.hole&&r.w>0&&n.water(a(e,r.x),o(e,r.y),a(e,r.x+r.w),o(e,r.y+r.h),t);for(let r of e.doors.values())n.water(a(e,r.x),o(e,r.y),a(e,r.x+1),o(e,r.y+1),t)}for(let[t,r,i,s,c]of e.water)n.water(a(e,t),o(e,r),a(e,i),o(e,s),e.y0+c);for(let[t,i]of e.doors){let s=a(e,i.x),l=o(e,i.y),d=s+1,p=l+1,m=t=>{let n=Ee(e,t),r=n&&u(n,t);return!!r&&!r.hole&&n.y0+r.dy+r.ht>e.y0+.5},h=t=>e.g[t]?!e.doors.has(t):!!i.glass&&m(t),g=h(t-e.W)&&h(t+e.W),_=i.kind===`heavy`?.36:i.vent?.12:.14,{look:v,side:y,slides:b,lining:S}=rt(e,t,i,g),C=e.thin.has(t),w=C?De:2,[T,E]=i.glass&&C?ke[i.glaze??`view`]:[0,2.4],D=v===`steel`||v===`office`,O=D?Oe:2,k=D&&(y??1)<0?0:2-O,A=k+O,j=g?s+k:s,ee=g?l:l+k,M=g?s+A:s+2,te=g?l+2:l+A,[ne,re,ie,ae]=C?g?[j,p-De/2,M,p+De/2]:[d-De/2,ee,d+De/2,te]:[j,ee,M,te],oe=(j+M)/2,se=(ee+te)/2;n.room(``,ne,re,ie,ae,{pal:{fl:0,wl:0,st:0},y0:e.y0+T,ht:E-T,doorway:!0,nolamp:!0,lit:`main`,circuit:e.c,part:C,mat:S?{floor:S.mat.floor,wall:S.mat.wall===`block`?`plaster`:S.mat.wall,ceiling:S.mat.wall===`block`?`plaster`:S.mat.wall}:x});let ce=n.level.rooms[n.level.rooms.length-1];S?(ce.floor=c(S.fl),ce.wall=c(S.wl),ce.stripe=ce.wall):(ce.floor=ut.fl,ce.wall=ut.wl,ce.stripe=ut.st);let le=i.c??``;if(!le){le=e.c;for(let n of[-e.W,e.W,-1,1]){let r=u(e,t+n);if(r){le=r.c;break}}}let ue=f(e,(i.x+.5)*2,(i.y+.5)*2);n.door(g?j:d-_/2,g?p-_/2:ee,g?M:d+_/2,g?p+_/2:te,2.4,{kind:i.kind??`light`,alongX:g,open:!!i.open,stuck:!!i.stuck,seal:!!i.seal,vent:!!i.vent,lift:!!i.lift,card:i.card,code:i.code,...i.failsafe?{failsafe:!0}:{},circuit:le,msg:i.msg,...i.glass?{glass:!0}:{},...v?{look:v,side:y}:{},...b?{slides:b}:{},...C?{depth:De}:{}}),v&&ot(e,i,g,v,w,k/2,A/2),n.level.doors[n.level.doors.length-1].y0=ue+T,n.level.doors[n.level.doors.length-1].y1=ue+E;let de=(2-w)/2;for(let[e,t]of i.sg??[]){let i=ue+2.74;t===`w`?n.sign(e,s+de-.03,i,se,-r/2,le):t===`e`?n.sign(e,s+2-de+.03,i,se,r/2,le):t===`n`?n.sign(e,oe,i,l+de-.03,r,le):n.sign(e,oe,i,l+2-de+.03,0,le)}}let t=(e,t)=>{let n=u(e,t);if(!n?.hole)return n;let r=t%e.W,i=Math.floor(t/e.W);return e.rooms.find(e=>!e.hole&&!e.shaped&&r>=e.x&&r<e.x+e.w&&i>=e.y&&i<e.y+e.h)??null},i=n=>{let r=Ee(e,n),i=r&&t(r,n);for(;r&&!i;)r=Ee(r,n),i=r&&t(r,n);return!!i&&r.y0+i.ht>e.y0+.01};if(e.below){let t=t=>{let n=u(e,t);return!e.g[t]||n&&(n.hole||n.air&&i(t))||e.ground&&!Ee(e,t)?null:n?.open?n.fl:-1},r=t=>{let n=u(e,t);return n?.open?n.mat.floor:`concrete`};for(let i=0;i<e.H;i++)for(let s=0;s<e.W;){let l=t(i*e.W+s),u=r(i*e.W+s);if(l===null){s++;continue}let d=1;for(;s+d<e.W&&t(i*e.W+s+d)===l&&r(i*e.W+s+d)===u;)d++;n.block(a(e,s),e.y0-dt,o(e,i),a(e,s+d),e.y0,o(e,i+1),l>=0?c(l):ut.fl,u),s+=d}}let d=t=>{for(let n=e.below;n;n=n.below){let r=n.g[t]?u(n,t):null;if(r&&!r.hole&&n.y0+r.dy+r.ht>e.y0+.5)return!0}return!1};for(let t=0;t<e.H;t++)for(let r=0;r<e.W;r++){let i=t*e.W+r,a=u(e,i);if(e.g[i]&&a&&a.open)for(let[o,c]of[[1,0],[-1,0],[0,1],[0,-1]]){let f=r+o,p=t+c,m=p*e.W+f,h=f>=0&&p>=0&&f<e.W&&p<e.H,g=(h&&e.g[m]?u(e,m):null)?.hole,_=h&&!e.g[m]&&d(m),v=g===`st`&&!e.conn.has(i+`:`+m);if(!_&&!v)continue;let y=.1,b=o&&o>0?(r+1)*2-y:r*2,x=o?o>0?(r+1)*2:r*2+y:(r+1)*2,S=c&&c>0?(t+1)*2-y:t*2,C=c?c>0?(t+1)*2:t*2+y:(t+1)*2,w=s(e,(b+x)/2),T=l(e,(S+C)/2),E=x-b,D=C-S;a.mat.floor===`terrazzo`?(n.box(w,T,E,1,D,[.55,.66,.7],{y:e.y0,solid:!0,mat:`glass`}),n.box(w,T,o?.07:E,.07,c?.07:D,6177828,{y:e.y0+1,solid:!1,mat:`steel`}),n.box(w,T,o?.14:E,.1,c?.14:D,5915174,{y:e.y0,solid:!1,mat:`steel`})):n.box(w,T,E,1,D,[.35,.33,.2],{y:e.y0,solid:!0})}}for(let t of e.rooms){if(t.nolamp||t.open||t.hole||t.cave||t.sky!==void 0||t.air)continue;let r=le(e.y0+t.dy+t.ht);for(let i=0;i<t.h;i++)for(let s=0;s<t.w;s++){if(s%3!=+(t.w>1)||i%3!=+(t.h>1))continue;let c=t.lit===`none`,l=t.w===2?t.x+1:t.x+s+.5,u=t.h===2?t.y+1:t.y+i+.5;n.box(a(e,l),o(e,u),1.1,.06,.3,c?2763822:15265522,{y:r-.07,glow:c?1:3,solid:!1}),c||n.fixture(a(e,l),r-.08,o(e,u))}let i=t.w>=t.h,s=i?t.w:t.h,c=Math.floor((i?t.h:t.w)/2),l=e=>e%3==1&&s>1?e===0?1:e-1:e;for(let u of s>=6?[0,s-1]:[s-1]){let s=i?l(u):c,d=i?c:l(u),f=a(e,t.x+s+.5),p=o(e,t.y+d+.5),m=r;n.box(f,p,.6,.03,.6,2763822,{y:m-.04,solid:!1});for(let e=0;e<4;e++)n.box(f+(i?0:-.21+e*.14),p+(i?-.21+e*.14:0),i?.54:.05,.02,i?.05:.54,5593180,{y:m-.06,solid:!1});n.vent(f,m-.05,p)}}for(let t of e.rooms){if(t.open||t.hole||t.cave||t.shaped||t.air||t.sky!==void 0||t.mat.ceiling!==`concrete`&&t.mat.ceiling!==`shot`||t.ht<3||t.ht>6||Math.max(t.w,t.h)<3)continue;let i=t.w>=t.h,s=t.id%2,c=le(e.y0+t.dy+t.ht),l=.5,u=(i?t.w:t.h)*2,d=i?a(e,t.x):o(e,t.y),f=n=>i?o(e,s?t.y+t.h:t.y)+(s?-n:n):a(e,s?t.x+t.w:t.x)+(s?-n:n),p=(e,t)=>i?[d+e,f(t)]:[f(t),d+e],m=(e,t,a,o)=>{let[s,d]=p(u/2,e);n.prop(`cyl`,s,d,t,u-.04,t,o,{y:c-a-(u-.04)/2,rz:r/2,ry:i?0:r/2,solid:!1,mat:`steel`,glow:l,services:!0})},[h,g]=p(u/2,.22);n.box(h,g,i?u-.04:.26,.05,i?.26:u-.04,7040624,{y:c-.3,solid:!1,mat:`steel`,glow:l,services:!0});let _=[4020804,8010282,9079428,4872810];m(.48,.11,.2,_[t.id%4]),m(.64,.07,.24,_[(t.id+1)%4]);for(let e=1;e<u/2;e++){let[t,r]=p(e*2,.22),[a,o]=p(e*2,.56);n.box(t,r,.02,.25,.02,3816768,{y:c-.25,solid:!1,glow:l,services:!0}),n.box(a,o,i?.03:.3,.03,i?.3:.03,3816768,{y:c-.15,solid:!1,glow:l,services:!0}),n.box(a,o,.02,.12,.02,3816768,{y:c-.15,solid:!1,glow:l,services:!0})}}for(let t of e.elevs)n.platform(a(e,t.tx),o(e,t.tz),a(e,t.tx+t.w),o(e,t.tz+t.h),t.lo.y0,t.hi.y0,4869973,{name:t.name,circuit:t.c});for(let t of e.stairs){let r=t.dir===`e`||t.dir===`w`,i=t.dir===`w`||t.dir===`n`,s=r?t.len:1,c=r?1:t.len,l=a(e,t.tx),u=o(e,t.tz),d=a(e,t.tx+s),f=o(e,t.tz+c),p=t.hi.y0-t.lo.y0;if(n.ramp(l,u,d,f,t.lo.y0,t.hi.y0,t.dir,5922144),n.level.surfaces[n.level.surfaces.length-1].hidden=!0,t.bare)continue;let m=t.len*4,h=t.len*2;for(let e=0;e<m;e++){let a=i?1-(e+.5)/m:(e+.5)/m,o=(e+1)/m*p;r?n.box(l+a*h,(u+f)/2,h/m,o,1.7,e%2?5922144:5527386,{y:t.lo.y0,solid:!1}):n.box((l+d)/2,u+a*h,1.7,o,h/m,e%2?5922144:5527386,{y:t.lo.y0,solid:!1})}}for(let t of e.flights)n.steps(a(e,t.tx),o(e,t.tz),a(e,t.tx+t.w),o(e,t.tz+t.h),e.y0+t.y0,e.y0+t.y1,t.n,t.dir,t.c);for(let t of e.props){let[r,i]=t.lie?ct(t,(t,n)=>f(e,t,n)):[f(e,t.x,t.z),t.rz];n.prop(t.shape,s(e,t.x),l(e,t.z),t.sx,t.sy,t.sz,t.c,{y:r+t.y,ry:t.ry,rz:i,glow:t.glow?3:1,solid:t.solid,loose:t.loose,mat:t.mat,flush:t.flush,goods:t.goods,...t.pw?{pw:t.pw,pc:t.pc??e.c}:{}})}for(let[t,r,i,a,o,c]of e.cols){let u=f(e,(t+i)/2,(r+a)/2);n.collider(s(e,(t+i)/2),l(e,(r+a)/2),i-t,c-o,a-r,u+o)}for(let t of e.items)n.item(t.id,s(e,t.x),f(e,t.x,t.z)+t.y,l(e,t.z),t.n,t.on);for(let t of e.lamps)n.lamp(s(e,t.x),f(e,t.x,t.z)+(t.h??1),l(e,t.z),t.r,t.c);for(let t of e.stains)n.stain(s(e,t.x),f(e,t.x,t.z),l(e,t.z),t.r);for(let t of e.cams)n.camera(a(e,t.x),f(e,t.x*2,t.z*2)+t.h,o(e,t.z),t.yaw,{fov:t.fov,range:t.range,circuit:t.c,zone:t.zone,...t.name?{name:t.name}:{}});for(let t of e.speakers)n.speaker(t.zone,a(e,t.x),f(e,t.x*2,t.z*2),o(e,t.z),t.pa?{pa:t.pa}:{});for(let t of e.notes)n.note(t.key,s(e,t.x),f(e,t.x,t.z)+t.y,l(e,t.z),t.bare);for(let t of e.muts){let r=({D:e,x:t,z:n,...r})=>({x:a(e,t),y:f(e,t*2,n*2),z:o(e,n),...r}),{at:i,...s}=Object.fromEntries(Object.entries(t.o).map(([e,t])=>[e,Array.isArray(t)&&t[0]?.D?t.map(r):t?.D?r(t):t])),c=i??{x:a(e,t.x),y:f(e,t.x*2,t.z*2),z:o(e,t.z)};n.mutant(t.type,c.x,c.y,c.z,s)}for(let t of e.uses)n.use(t.kind,a(e,t.x),f(e,t.x*2,t.z*2)+t.y,o(e,t.z),t.o);for(let[t,[r,i,s]]of Object.entries(e.marks))n.mark(t,a(e,r),f(e,r*2,i*2),o(e,i),s)}e&&n.start(a(i[0],e[0]),o(i[0],e[1]),e[2],t?f(t,e[0]*2,e[1]*2):void 0);let p=n.finish();return be=null,p}function pt(e,t){let n=t.rooms.filter(e=>e.shaped&&e.w>0);if(!n.length)return;let r=t.W,i=r+1,a=new Set(n.map(e=>e.id)),o=.25,s=1/0,u=1/0,d=-1/0,f=-1/0;for(let e of n)s=Math.min(s,e.x),u=Math.min(u,e.y),d=Math.max(d,e.x+e.w),f=Math.max(f,e.y+e.h);let p=d-s+1,m=f-u+1,h=Array((p-1)*(m-1)).fill(0),g=new Float32Array(p*m);for(let e=u;e<f;e++)for(let n=s;n<d;n++){let i=t.rm[e*r+n];if(a.has(i)){h[(e-u)*(p-1)+(n-s)]=1;for(let[r,a]of[[0,0],[1,0],[0,1],[1,1]]){let o=(e-u+a)*p+(n-s+r);g[o]=Math.max(g[o],t.rooms[i].ht)}}}let _=Fe(t,`hf`),v=Fe(t,`cf`),y=[],b=[];for(let e=0;e<m;e++)for(let n=0;n<p;n++){let r=(e+u)*i+n+s,a=t.y0+_[r];y.push(a),b.push(a+g[e*p+n]+v[r])}let x=1/0,S=-1/0;for(let i of n){let n=i.w,a=i.h,c=[],l=[];for(let e=i.y;e<i.y+i.h;e++)for(let n=i.x;n<i.x+i.w;n++){if(t.rm[e*r+n]!==i.id){c.push(0),l.push(0);continue}let a=[[0,0],[1,0],[0,1],[1,1]].map(([t,r])=>(e-u+r)*p+(n-s+t)),d=Math.min(...a.map(e=>y[e])),f=Math.max(...a.map(e=>b[e]));c.push(Math.floor((d-.01)/o)*o),l.push(Math.ceil((f+.01)/o)*o),x=Math.min(x,d),S=Math.max(S,f)}let d=Math.min(...c.filter((e,t)=>e<l[t])),f=Math.max(...l.filter((e,t)=>c[t]<e)),m=t.org[0]+i.x*2,h=t.org[1]+i.y*2,g=e.room(i.name,m,h,m+n*2,h+a*2,{pal:{fl:i.fl,wl:i.wl,st:i.st},lit:i.lit,lc:i.lc,em:i.em,circuit:i.c,flick:i.flick,nolamp:!0,plain:!0,safe:i.safe,noroam:i.noroam,armed:i.armed,zone:i.zone,y0:d,ht:f-d,motes:i.motes,mat:i.mat});g.cells={res:2,nx:n,nz:a,lo:c,hi:l}}let C=t.org[0]+s*2,w=t.org[1]+u*2,T=t.org[0]+d*2,E=t.org[1]+f*2,D=n[0];e.lattice(`floor`,C,w,T,E,2,p,m,y,Math.floor(x/o)*o-o,D.fl,D.mat.floor,h),e.lattice(`ceiling`,C,w,T,E,2,p,m,b,Math.ceil(S/o)*o+o,l(c(D.wl),.6),D.mat.ceiling,h)}var mt={fl:5263956,wl:6974828,st:12098350,mat:S},ht={fl:8090984,wl:10130824,st:4161387,mat:{floor:`carpet`,wall:`plaster`,ceiling:`plaster`}},gt={fl:10134429,wl:12174525,st:9187108,mat:{floor:`vinyl`,wall:`glazed`,ceiling:`tiles`}},_t={fl:5133662,wl:7369850,st:3754074,mat:{floor:`epoxy`,wall:`block`}},vt={fl:8682608,wl:9209982,st:9075274,mat:{floor:`terrazzo`,wall:`block`,ceiling:`tiles`}},yt={fl:4869976,wl:10131084,st:5925498,mat:{floor:`carpet`,wall:`board`,ceiling:`tiles`}},bt={fl:9076848,wl:10720894,st:8018480,mat:{floor:`terrazzo`,wall:`stone`,ceiling:`plaster`,upper:`plaster`}},xt={fl:4016688,wl:5925452,st:3103284,motes:`spores`,mat:{floor:`epoxy`,wall:`glazed`}},St={fl:4869198,wl:6185316,st:12098350,ht:8,em:1,mat:{...S,floor:`epoxy`}},Ct={open:1,ht:4,em:1,fl:5922144,wl:6185316,nolamp:1};function wt(e,t,n,r,i=8422540){let a=r?.95:2,o=r?2:.95;B(e,t,n,a,.32,o,3816770),B(e,t,n,a-.06,.12,o-.06,i,{y:.32,c:0}),B(e,t+(r?0:-.7/2),n+(r?-.7/2:0),r?.6:.32,.07,r?.32:.6,12895420,{y:.44,c:0})}function Tt(e,t,n,r,i,a=5987679){let o=i>r;B(e,t,n,r,.05,i,a,{y:.71,c:0});for(let a of[-1,1])B(e,t+(o?0:a*(r/2-.08)/2),n+(o?a*(i/2-.08)/2:0),o?r-.1:.06,.71,o?.06:i-.1,3356218,{c:0});Ae(e,t,n,r,i)}function Et(e,t,n,r,i,a={}){let o=i>r,s=o?i:r;for(let a of[.1,.55,1,1.45,1.86])B(e,t,n,r,.04,i,4869456,{y:a,c:0});for(let a of[-1,1])B(e,t+(o?0:a*(r/2-.02)/2),n+(o?a*(i/2-.02)/2:0),o?r:.04,1.9,o?.04:i,3816768,{c:0});if(!a.empty)for(let c of[.14,.59,1.04,1.49]){let l=s>2?4:3,u=(s-.2)/l;for(let d=0;d<l;d++){if(N(0,1)<.3)continue;let l=(-s/2+.1+u*(d+.5)+N(-.05,.05)*u)/2,f=Math.min(N(.15,.3),u*.8),p=Math.min(f,(o?r:i)-.08);z(e,a.jars?`cyl`:`box`,t+(o?0:l),n+(o?l:0),o?p:f,N(.14,.34),o?f:p,Ce(a.cols??[7035452,5069414,8014388,6056778]),{y:c,c:0,goods:!0})}}Ae(e,t,n,r,i,1.9)}function Dt(e,t,n,r,i,a={}){Tt(e,t,n,r,i,a.c),a.bare||(B(e,t,n,.5,.34,.06,2237994,{y:.76,c:0}),B(e,t,n+.02,.44,.28,.02,[.06,.12,.1],{y:.79,c:0,pw:[[.04,.05,.05],[2.2,2.75,2.5]]}))}var Ot={across:.6,along:-.8};function kt(e,t,n,r=1){wt(e,t,n,!0,13949140);let i=t+r*Ot.across/2,a=n+Ot.along/2;B(e,i,a,.05,1.7,.05,11054254,{c:0}),B(e,i,a,.14,.2,.08,13161688,{y:1.5,c:0})}function At(e,t,n,i){z(e,`cyl`,t,n,i,.01,i*N(.6,1),3803915,{y:.001,c:0,ry:N(r)}),Me(e,t,n,i*.5);for(let a=0;a<3;a++)z(e,`cyl`,t+N(-i,i)*.4,n+N(-i,i)*.4,i*N(.15,.4),.01,i*N(.15,.4),4525324,{y:.003+a*.002,c:0,ry:N(r)})}function jt(e,t,n,r){At(e,t,n,1.5);for(let i=0;i<r;i++)z(e,`ico`,t+N(-.3,.3),n+N(-.3,.3),N(.2,.5),N(.12,.3),N(.2,.5),Ce([7220008,5117462,9194052,13352872]),{c:0})}function Mt(e,t,n,r){for(let i=0;i<r;i++)z(e,`ico`,t+N(-.3,.3),n+N(-.3,.3),N(.3,.45),N(.45,.65),N(.3,.45),Ce([12167562,11049600,12890254]),{c:0})}function Nt(e,t,n,r,i){let a=(r,a,o,s,c,l)=>B(e,t+(i?r:a)/2,n+(i?a:r)/2,i?o:c,s,i?c:o,l,{c:0});At(e,t,n,1.2),a(0,0,.48,.2,.62,r),a(-.13,.62,.17,.15,.75,3158842),a(.14,.58,.17,.15,.7,3158842),a(.36,-.05,.12,.11,.6,r),z(e,`ico`,t+(i?0:-.45/2),n+(i?-.45/2:0),.24,.22,.26,10848888,{c:0})}function Pt(e,t,n,r,i,a){Nt(e,t,n,r,i),Pe(e,`body`,t,n,.3,a)}var Ft=[4155962,5208640,3103284,5929530,6982212,2771500];function It(e,t,n,r){for(let i=0;i<3;i++)z(e,`ico`,t+N(-.2,.2)*r,n+N(-.2,.2)*r,N(.5,1)*r,N(.4,.9)*r,N(.5,1)*r,Ce(Ft),{c:0,y:-N(0,.1)})}function Lt(e,t,n,r){z(e,`cyl`,t,n,.14,r,.14,3824176,{c:0,rz:N(-.1,.1)}),z(e,`ico`,t,n,N(.5,.9),N(.3,.5),N(.5,.9),Ce(Ft),{c:0,y:r-.1});for(let a=0;a<3;a++){let a=N(i);B(e,t+Math.cos(a)*.3/2,n-Math.sin(a)*.3/2,.7,.03,.2,Ce(Ft),{c:0,y:r*N(.3,.8),ry:a,rz:.4})}}function Rt(e,t,n,r,i){z(e,`cyl`,t,n,.12*r,.5*r,.12*r,13156512,{c:0}),z(e,`ico`,t,n,.6*r,.22*r,.6*r,i?[2.35,2.8,2.5]:Ce([10119754,9062980,11571296]),{c:0,y:.45*r})}function zt(e,t,n,i){B(e,t,n,i*N(.7,1.3),.02,i*N(.7,1.3),Ce([3099178,3822128,4476970,2767394,4868642]),{y:.002+N(.008),c:0,ry:N(r),lie:!0})}function Bt(e,t,n,r,a,o){z(e,`cyl`,t,n,.34,r,.34,4864812,{y:a,c:0});for(let o=0;o<6;o++){let s=N(i),c=N(.9,1.7);B(e,t+Math.cos(s)*c*.45/2,n-Math.sin(s)*c*.45/2,c,.07,.07,4207402,{y:a+r*.45+o*r*.09,c:0,ry:s,rz:.6})}if(o)for(let i=0;i<4;i++)z(e,`ico`,t+N(-.15,.15),n+N(-.15,.15),N(.3,.6),N(.3,.5),N(.3,.6),Ce([9194052,7220008,11568498]),{y:a+N(.3,r*.7),c:0})}function Vt(e,t,n,r){let i=Math.round(t.w*t.h*n);for(let n=0;n<i;n++){let n=t.x+N(.25,t.w-.25),i=t.y+N(.25,t.h-.25),a=Ht();if(a<.4)zt(e,n,i,N(1,2.6));else if(a<.62)It(e,n,i,N(.6,1.3));else if(a<.75)Lt(e,n,i,N(1,Math.min(t.ht-.6,3.4)));else if(a<.9)Rt(e,n,i,N(.6,2.2),r&&Ht()<.3);else{let n=Math.floor(N(4)),r=N(.8,2.4);B(e,n===0?t.x+.015:n===1?t.x+t.w-.015:t.x+N(.7,t.w-.7),n===2?t.y+.015:n===3?t.y+t.h-.015:t.y+N(.7,t.h-.7),n<2?.06:Math.min(r,1.2),N(1,t.ht-.4),n<2?Math.min(r,1.2):.06,Ce(Ft),{c:0,y:N(-.3,0)})}}if(r)for(let n=0;n<Math.max(1,Math.round(t.w*t.h/36));n++){let n=t.x+N(1,t.w-1),r=t.y+N(1,t.h-1);Rt(e,n,r,N(1.4,2.4),!0),e.lamps.push({x:n*2,z:r*2,r:N(5,8),c:[.1,.4,.2]})}}var Ht=()=>N(1);function Ut(e,t,n,r){for(let i=0,a=0;i<n&&a<n*20;a++){let n=t.x+N(t.w),a=t.y+N(t.h),o=Math.floor(a)*e.W+Math.floor(n);if(e.rm[o]!==t.id)continue;i++;let s=Ht();s<.35?zt(e,n,a,N(1,2.4)):s<.6?It(e,n,a,N(.6,1.3)):s<.85?Rt(e,n,a,N(.6,2),r&&Ht()<.4):z(e,`ico`,n,a,N(.6,1.4),N(.4,.9),N(.6,1.4),Ce([5919304,4867132,7039588]),{c:1}),r&&s>.6&&s<.85&&Ht()<.25&&e.lamps.push({x:n*2,z:a*2,r:N(4,7),c:[.1,.36,.2]})}}var Wt=[6965812,3824234,5921338,7035452,4868690,8010282];function Gt(e,t,n,r,i=1){for(let a=0;a<i;a++){let i=Ce(Wt);B(e,t,n,r?2.4:5.4,2.4,r?5.4:2.4,i,{y:a*2.4,c:+!a,mat:`steel`}),B(e,t,n,r?2.5:.1,2.2,r?.1:2.5,2763822,{y:a*2.4+.1,c:0})}}function Kt(e,t,n,i){let a=(r,a,o,s,c,l,u=0,d=!1)=>B(e,t+(i?r:a)/2,n+(i?a:r)/2,i?o:c,s,i?c:o,l,{y:u,c:+!!d,mat:`steel`});a(0,0,1.2,.9,2,13214247,.25,!0),a(0,-.3,1.1,.08,1.1,2763822,2,!1);for(let e of[-.5,.5])a(e,-.75,.07,1.1,.07,2763822,1.1),a(e,.2,.07,1.1,.07,2763822,1.1),a(e*.7,1.05,.1,2.4,.1,2763822,.1),a(e*.6,1.65,.12,.06,1.1,9079428,.15);for(let a of[-.55,.55])for(let o of[-.65,.65])z(e,`cyl`,t+(i?a:o)/2,n+(i?o:a)/2,.5,.3,.5,1382427,{y:.1,c:0,rz:r/2,ry:i?0:r/2})}function qt(e,t,n,r){z(e,`cyl`,t,n,.5,r-.14,.5,5593180,{c:1})}var Jt=[[2.9,2.2,2.15],[2.25,2.9,2.4]];function Yt(e,t,n,r,i,a={}){let o=i===`e`||i===`w`,s=i===`e`||i===`s`?.06:-.06;B(e,n,r,o?.14:.7,.9,o?.7:.14,4869973,{y:.9,c:0}),B(e,n+(o?s:0),r+(o?0:s),.1,.1,.1,[.2,.2,.2],{y:1.55,c:0,pw:[Jt[0],Jt[1]],pc:t}),Pe(e,`panel`,n+(o?s*3:0),r+(o?0:s*3),1.3,{c:t,...a})}function Xt(e,t,n,r,i,a,o,s={}){e.cams.push({x:t,z:n,h:r,yaw:i,fov:s.fov??1.6,range:s.range??18,c:a,zone:o,...s.name?{name:s.name}:{}})}function Zt(e,t,n,r,i,a,o={}){Pe(e,`watch`,t,n,r,{c:i,feeds:a,...o.dwell?{dwell:o.dwell}:{}})}function Qt(e,t,n,r,i){let a=r===`e`||r===`w`,o=r===`e`||r===`s`?1:-1;a?t+=o*.05/2:n+=o*.05/2,B(e,t,n,a?.1:.17,.17,a?.17:.1,11740702,{y:1.32,c:0}),B(e,t+(a?o*.026:0),n+(a?0:o*.026),a?.01:.07,.07,a?.07:.01,15262420,{y:1.37,c:0}),Pe(e,`call`,t+(a?o*.09:0),n+(a?0:o*.09),1.4,{zone:i,face:r})}function $t(e,t,n,r,i){e.speakers.push({zone:t,x:n,z:r,...i?{pa:i}:{}})}function en(e,t,n,r,i){let a=i===`e`||i===`w`,o=.4;B(e,t,n,a?.05:.7,.26,a?.7:.05,[.35,2.8,.9],{y:r,c:0}),e.lamps.push({x:(t+(i===`e`?o:i===`w`?-.4:0))*2,z:(n+(i===`s`?o:i===`n`?-.4:0))*2,r:2.6,c:[.05,.24,.1],h:r})}function tn(e,t,n,r,i,a){B(e,n,r,1.4,1.1,.8,4477530),B(e,n,r,1.1,.3,.6,3555914,{y:1.1,c:0}),z(e,`cyl`,n+.25,r,.16,.7,.16,2896696,{y:1.4,c:0}),B(e,n,r+.42*(a>r?1:-1)/2,.12,.12,.06,[.2,.2,.2],{y:.8,c:0,pw:[Jt[0],Jt[1]],pc:t}),Pe(e,`backup`,i,a,1,{c:t})}function nn(e,t,n,r,i){I(e,`Main lift`,t,n,2,2,{fl:4474698,wl:5527642,st:12098350,c:`LIFT`,noroam:1,safe:1}),R(e,r,i,{kind:`heavy`,c:`LIFT`,sg:[[`Lift`,i<n?`n`:i>n+1?`s`:r<t?`w`:`e`]]}),B(e,i<n||i>n+1?t+1:r<t?t+1.98:t+.02,i<n?n+1.98:i>n+1?n+.02:n+1,i<n||i>n+1?.5:.08,.4,i<n||i>n+1?.08:.5,2895667,{y:1.1,c:0}),Pe(e,`lift`,t+1,n+1,1.3),e.marks.lift=[t+1,n+1,0]}function rn(e,t,n,r,i,a,o,s=11774876){for(let s=0;s<i;s++)Xe(e,t,n+s,r,a,o,!0);let c=a*4,l=t.y0-e.y0,u=a*2/c,d=o===`n`,f=.005;for(let t=0;t<c;t++){let o=t<c-1?.02:0,p=d?1-(t+.5)/c:(t+.5)/c,m=(t+1)/c*l,h=r+p*a+(d?-1:1)*o/2/2,g={y:-.005,flush:!0};B(e,n+i/2,h,i*2,m+f,u+o,t%2?s:11116946,{...g,c:0});for(let t of[n-.075,n+i+.075]){B(e,t,h,.32,m+1.05+f,u+o,9406330,g);for(let n of[-1,1])B(e,t+n*.165/2,h,0,m+1.05+f,u+o,9406330,{...g,c:0})}}}var an=e=>({...e.mat,wall:`plaster`}),on={id:`upper`,name:`Upper station`,c:`OPS`,org:[-10,-30],cards:!0};function sn(e){xe(on,e);let t=on,n=we(t,140,48,{ground:!0}),i=we(t,140,48,{y0:-4.5}),a=(e,n)=>we(t,140,48,{y0:e,li:n}),o=a(5,1),s=a(10,2),c=a(15,3);Te(i,n),Te(n,o),Te(o,s),Te(s,c),nn(n,5,14,7,14),I(n,`Shaft station`,8,14,3,3,{...mt,c:`SEC`,em:1,safe:1}),R(n,11,15,{sg:[[`Goods inward`,`w`],[`Shaft station`,`e`]]}),I(o,`Surface cage`,5,14,2,2,{...vt,c:`LIFT`,nolamp:1,noroam:1,safe:1}),R(o,7,14,{kind:`heavy`,c:`LIFT`,lift:!0,sg:[[`Surface`,`e`]]}),I(n,`Goods inward`,12,15,8,5,{...mt,c:`SEC`,ht:4,em:1}),L(n,12,14,8,1),R(n,20,15,{sg:[[`Security`,`w`],[`Goods inward`,`e`]]}),B(n,16,19.4,3.6,.9,.7,4869973),H(n,`husk`,14,18.4,{post:1,yaw:r/2}),I(o,`Surface landing`,8,14,3,3,{...bt,c:`SEC`,ht:3.6,em:1}),R(o,11,15,{sg:[[`Checkpoint`,`w`],[`Surface`,`e`]]}),I(o,`Checkpoint`,12,15,8,6,{...vt,c:`SEC`,ht:4,em:1}),R(o,17,14,{sg:[[`Surface lift`,`n`],[`Lobby`,`s`]]}),B(o,15,16.6,.9,.95,4,6251110),B(o,15,17,1.1,1,1.6,3816768,{y:.95}),B(o,15,16.2,.7,.04,.5,4864556,{y:.95,c:0}),B(o,15,15.3,.1,1,1.2,9080460);for(let e of[18,19.1])B(o,15,e,.25,2.3,.25,9080460);B(o,15,18.55,.35,.25,2.45,9080460,{y:2.3,c:0});for(let e of[19.8,20.6])B(o,15,e,.9,1,.3,6251110),B(o,15.22,e+.2065,.05,.05,.6,9080460,{y:.9,ry:.5,c:0});B(o,17.5,19.5,.06,2.4,6,[.55,.66,.7],{mat:`glass`}),B(o,18.45,18,3.8,2.4,.06,[.55,.66,.7],{mat:`glass`}),Dt(o,18.8,20.3,2.4,.7,{bare:1}),B(o,18.8,19.7,.45,.45,.45,2895667);for(let e of[18.45,19.15])B(o,e,20.43,.6,.44,.08,2237994,{y:.76,c:0}),B(o,e,20.405,.52,.36,.02,[.04,.05,.05],{y:.84,c:0,pw:[[.04,.05,.05],[2.3,2.42,2.38]],pc:`SEC`});Zt(o,18.8,19.9,1.1,`SEC`,[`Lobby`,`Checkpoint`,`Surface landing`,`Shaft station`]),Xt(o,12.4,15.4,3.5,.79,`SEC`,`wing`,{name:`Checkpoint`}),Xt(o,10.6,16.6,3.1,-2.17,`SEC`,`wing`,{name:`Surface landing`}),Xt(n,10.6,14.4,2.8,-1.17,`SEC`,`wing`,{name:`Shaft station`}),B(o,12.4,17.5,.45,.42,2.6,6251110),B(o,12.15,20.2,.5,1.8,1.4,5661550),Pt(o,16.4,17.2,2896960,!0,{label:`Search the officer`,say:`A security officer. Whatever opened him did it from behind.`,keys:[`s`]});let l={...bt,c:`SEC`,ht:13,em:1,lc:[.92,.86,.74]};I(n,`Lobby`,1,1,19,12,l),I(n,`Lobby`,12,13,8,1,l),R(n,20,13,{sg:[[`Security`,`w`],[`Lobby`,`e`]]});let u={...Ct,ht:8,c:`SEC`,fl:bt.fl,wl:bt.wl,mat:{floor:`terrazzo`,wall:`stone`,upper:`plaster`,datum:3.2}};I(o,`Lobby gallery`,1,12,19,1,u),I(o,`Lobby gallery`,12,13,8,1,u),rn(n,o,9,6,4,6,`s`),B(n,10.5,7,38,.06,24,[.1,.1,.1],{y:12.94,c:0,pw:[[.08,.08,.09],[2.85,2.82,2.72]],pc:`SEC`}),B(n,11,3.2,3.4,1.1,3.4,10130308),B(n,11,3.2,3.6,.12,3.6,8222570,{y:1.1,c:0});for(let e of[-.25,.25])B(n,11+e/2,3.2,.42,2.1,.5,7035450,{y:1.22});B(n,11,3.2,1.2,1.7,.6,7035450,{y:3.3,c:0}),B(n,11,3.15,.55,.6,.55,7035450,{y:5,rz:.15,c:0}),B(n,11.4,3.2,.3,1.5,.3,7035450,{y:4.5,rz:-.5,c:0}),B(n,10.6,3.2,.3,1.3,.3,7035450,{y:3.4,rz:.2,c:0});for(let[e,t]of[[15.5,4],[15.5,8.5]]){B(n,e,t,1.8,.42,1,3813926);for(let[r,i,a,o]of[[0,-1.25,3.2,.9],[0,1.25,3.2,.9],[1.45,0,.9,2.6]])B(n,e+r,t+i,a,.45,o,5914164),B(n,e+r+(r?.17:0),t+i+(i>0?.17:i<0?-.17:0),r?.25:a,.9,r?o:.25,5125420,{c:0})}for(let[e,t]of[[2.2,1.6],[7,1.6],[18.6,1.6],[18.6,11]]){B(n,e,t,1.2,.8,1.2,7236194);for(let r=0;r<4;r++)z(n,`ico`,e+Math.cos(r*1.7)*.15,t+Math.sin(r*1.7)*.15,.2,.9+r*.2,.2,5917230,{y:.8,c:0})}B(n,4.5,11.3,10,1,.7,4862502),B(n,4.5,11.3,10.3,.16,.85,2763822,{y:1,c:0}),B(n,4.5,12.85,10,2.4,.3,3811872,{y:.2});for(let e of[1.1,1.7])B(n,4.5,12.7,10,.04,.35,2763822,{y:e,c:0});for(let e=0;e<22;e++)e*7%5!=0&&z(n,`cyl`,2.2+e*.22,12.72,.08,.3,.08,[[.35,.55,.3],[.6,.35,.15],[.7,.68,.6],[.3,.2,.15]][e%4],{y:1.14+e%2*.6,c:0});for(let e=0;e<6;e++)z(n,`cyl`,2.4+e*.8,10.4,.4,.75,.4,2895667);B(n,3.1,10.2,.4,.05,.25,5925456,{y:.01,ry:.6,c:0}),z(n,`cyl`,6.3,10.1,.08,.3,.08,3495216,{y:-.11,rz:1.5,c:0}),Xt(n,19.6,1.4,9,-.79,`SEC`,`wing`,{name:`Lobby`}),I(n,`Hazardous storage`,12,21,6,5,{...mt,c:`SEC`}),R(n,13,20,{kind:`heavy`,c:`OPS`,sg:[[`Hazard store`,`n`]]});for(let[e,t]of[[12.6,25.4],[13.3,25.5],[12.6,24.7],[17.4,21.4],[16.8,21.4]])z(n,`cyl`,e,t,.6,.9,.6,13214247);for(let e=0;e<3;e++)B(n,14.6+e*.6,21.03,.5,1.5,.12,13214247,{y:.4,c:0});Et(n,17.7,23.6,.5,2.2,{cols:[13214247,4014146]}),B(n,15.4,25.4,.8,.6,.6,3817520),V(n,`rebreather`,15.4,25.4,.6),V(n,`kit`,17.65,23.3,1.06),I(n,`Security corridor`,21,13,18,3,{..._t,c:`SEC`,ht:4.5,em:1,safe:1,armed:1,mat:an(_t)}),Yt(n,`SEC`,37.4,13.035,`s`,{cut:1,zone:`wing`}),B(n,37.4,13.02,.12,2.7,.08,2763822,{y:1.8,c:0}),z(n,`cyl`,37.3,13.05,.07,.6,.07,1908513,{y:.38,rz:.35,c:0}),z(n,`cyl`,37.5,13.05,.07,.45,.07,1908513,{y:.51,rz:-.3,c:0}),Pt(n,36.2,13.9,2896960,!1,{label:`Search the guard`,say:`A guard, days dead, bolt cutters still in his hand. Behind him the feed to the wing is cut clean through.`}),At(n,36.5,14.3,1.3),Ne(n,`cut`,36.9,14.4,.02),$t(n,`wing`,30,14.5,`CRIT`),Xt(n,21.4,13.3,3.9,r/2,`SEC`,`wing`),B(n,38.4,13.7,1.8,.75,.7,5987679,{ry:.5});let d={fl:5001808,wl:7305847,st:4161387,c:`ISO`,em:1,flick:1,safe:1,lc:[.3,.26,.2],batt:{colour:[.06,.065,.075],supply:`CELLS`,watch:`ISO`},mat:{floor:`vinyl`,wall:`block`}},f={...d,lc:[.5,.42,.32]};I(i,`Isolation suite`,26,4,7,7,{...d,ht:8}),I(i,`Isolation suite`,32,1,1,2,{...d,ht:8}),I(i,`Isolation suite`,31,3,2,1,{...d,ht:8});let p=(e,t,n,r,a,o,s=!1)=>{let c=r?t+3:t-1,l=r?t+.4:t+2.6,u=l+(r?Ot.across:-Ot.across)/2,d=n+1.5+Ot.along/2;return I(i,`Isolation room `+e,t,n,3,3,s?{...f,lc:[1.5,1.25,.88]}:f),L(i,c,n,1,3),R(i,c,n+o,{card:`s`,failsafe:!0,c:`ISO`,sg:[[`Isolation `+e,r?`e`:`w`]]}),R(i,c,n+a,{glass:!0,glaze:`obs`}),kt(i,l,n+1.5,r?1:-1),B(i,l+(r?.6:-.6),n+.45,.45,.5,.4,12106944),B(i,u,d,.22,.17,.13,14212312,{y:1.02,c:0}),B(i,u+(r?.06:-.06),d,.02,.07,.09,[.05,.06,.05],{y:1.08,c:0,pw:[[.05,.06,.05],[2.3,2.55,2.4]],pc:`ISO`}),{x:u,z:d}},m=p(1,22,3,!0,1,2);Pe(i,`pump`,m.x,m.z,1.1),Pe(i,`look`,m.x,m.z,1.55,{label:`Read the bag`,text:`MIDAZOLAM 100 mg in 100 mL sodium chloride 0.9%. Isolation 1. Hung 11/11, 23:10, M.O. Empty.`}),Pe(i,`look`,25.33,3.3,1.4,{label:`Press the intercom`,text:`Static, and nothing under it.`,sfx:`static`}),Ne(i,`intake`,23,3.45,.52),I(i,`Washroom`,22,7,3,2,f),R(i,23,6,{c:`SEC`});for(let e of[22.3,23.1])B(i,e,8.7,.5,.85,.6,13159632);B(i,24.5,7.5,1,2.1,1,9083540,{c:0});let h=p(2,34,2,!1,2,1,!0);Pe(i,`look`,h.x,h.z,1.55,{label:`Read the bag`,text:`MIDAZOLAM 100 mg in 100 mL sodium chloride 0.9%. Isolation 2. Hung 8/11, 22:50, M.O. Dry, days ago.`});for(let e=0;e<3;e++)B(i,35.1+e*.05,2.0025,.012,.32,.01,2762274,{y:1.15,c:0});for(let[e,t]of[[4.35,1.45],[4.55,1.62],[4.7,1.38],[4.45,1.8]])B(i,33.509,e,.006,.09,.07,5917246,{y:t,c:0});B(i,35.4,4.6,.45,.45,.45,6251110,{rz:r/2-.15,ry:.4}),B(i,35.6,2.1125,.6,.8,.45,6251110);for(let e of[.2,.5])B(i,35.6,2.2625,.5,.18,.4,6975088,{y:e,c:0});I(i,`Washroom`,34,6,3,2,f),R(i,35,5,{open:!0});for(let e of[6.3,7.1])B(i,36.7,e,.5,.85,.6,13159632);B(i,34.6,7.5,1,2.1,1,9083540,{c:0}),L(i,26,3,5,1),L(i,31,1,1,2);for(let[e,t]of[[3,26],[4,29]])I(i,`Isolation room `+e,t,1,2,2,f),R(i,t,3,{card:`s`,failsafe:!0,c:`ISO`,sg:[[`Isolation `+e,`s`]]}),kt(i,t+1,1.5),B(i,t+1.75,2.6,.45,.5,.4,12106944);B(i,28.5,10.84,5,.88,.6,5922400),B(i,28.5,10.83,5.1,.04,.66,9080460,{y:.88,c:0}),B(i,28.5,10.91,5,.7,.35,5922400,{y:1.6,c:0}),B(i,31.4,10.82,.8,1.9,.7,12106944),Tt(i,28.4,7.2,2.4,1.2,7035464);for(let[e,t]of[[28,6.65],[28.8,6.65],[28,7.75],[28.8,7.75]])B(i,e,t,.45,.45,.45,3816768);for(let[e,t]of[[26.4,7.6],[26.4,8.5]])z(i,`cyl`,e,t,.5,.5,.5,9071178),z(i,`ico`,e,t,.8,.5,.8,5917236,{y:.5,c:0});Xe(i,n,31,4,5,`s`),Xe(i,n,32,4,5,`s`),en(i,32.9875,4.6,3,`w`),V(i,`flash`,32.3,1.5,.02),I(n,`Nurses' station`,23,9,11,3,{...Ct,c:`SEC`,ht:3.5,safe:1,fl:5001808,wl:7305847}),R(n,28,12,{open:!0,sg:[[`Isolation`,`s`]]}),en(n,28.5,11.9875,2.5,`n`),Dt(n,25.5,11.6,1.8,.7,{bare:1}),B(n,25.5,11.7,.5,.34,.06,2237994,{y:.76,c:0}),B(n,25.5,11.68,.44,.28,.02,[.06,.12,.1],{y:.79,c:0,pw:[[.04,.05,.05],[2.2,2.75,2.5]],pc:`SEC`}),B(n,25.5,11,.45,.45,.45,2895667),B(n,30.5,11.7,1.6,.42,.4,4474956),B(n,31.4,11.99,1.7,1,.04,14869210,{y:1.15,c:0});for(let e=0;e<5;e++){let t=.7+e%3*.2;B(n,31.75-e%2*.075-t/4,11.9775,t,.03,.01,2767466,{y:1.9-e*.15,c:0})}Ne(n,`board`,31.4,11.975,1.5,!0),V(n,`batt`,25.9,11.6,.78),Ne(n,`duty`,25.1,11.55,.78),V(n,`baton`,30.2,11.7,.44),V(n,`ration`,30.8,11.7,.44),I(n,`Briefing room`,35,8,3,4,{...yt,c:`SEC`,ht:4}),R(n,36,12,{card:`s`,sg:[[`Briefing`,`s`]]}),I(n,`Briefing room`,35,3,7,5,{...yt,c:`SEC`,ht:4}),R(n,35,12,{seal:!0,glass:!0}),L(n,35,12,3,1),B(n,38.5,3.01,10,2.9,.04,14210244,{y:.9,c:0}),B(n,38.5,3.015,10.2,.12,.06,2763822,{y:3.8,c:0}),B(n,38.5,6.2,.5,.25,.6,2895667,{y:3.4,c:0}),B(n,38.5,6.2,.06,.35,.06,2895667,{y:3.65,c:0}),B(n,38.5,6.04,.16,.12,.04,[.05,.05,.05],{y:3.45,c:0,pw:[[.05,.05,.05],[2.9,2.85,2.7]],pc:`SEC`}),B(n,36.2,3.9,.6,1.1,.5,4864556),B(n,36.2,3.86,.7,.05,.6,3812386,{y:1.1,c:0});for(let[e,t]of[[4.8,0],[5.8,1],[6.8,2]])for(let[i,a]of[[36.3,0],[37,1],[37.7,2],[39.3,3],[40,4]]){let o=t*5+a;if(o===3||o===11){B(n,i,e+.2,.45,.45,.45,2895667,{ry:.4+o*.2,rz:r/2-.1});continue}B(n,i,e,.45,.45,.45,2895667,{ry:(o*7%5-2)*.05}),B(n,i,e+.1,.45,.5,.05,2895667,{y:.45,c:0})}for(let[e,t,r]of[[35.0075,4.3,!0],[35.0075,6.4,!0],[39.6,7.9925,!1]]){B(n,e,t,r?.03:2.2,1.4,r?2.2:.03,14210244,{y:1.2,c:0});for(let i=0;i<4;i++)B(n,e+(r?.01:(i-1.5)*.25),t+(r?(i-1.5)*.25:-.01),r?.02:.3,.6+i%2*.3,r?.3:.02,[3754074,9187108,4872762,9075274][i],{y:1.45,c:0})}for(let e of[39.9,40.95])B(n,e,7.55,1.9,.14,.7,4870720,{c:0});for(let[e,t]of[[39.2,7.1],[39.35,7.3],[41.6,7.05]])z(n,`cyl`,e,t,.08,.11,.08,9080460,{c:0});Tt(n,36.5,9.8,2.6,1.4,4864556),B(n,36.5,9.8,2.2,.01,1.1,14210244,{y:.76,c:0}),Et(n,41.7,5,.5,2.4,{cols:[5069414,8014388,9075274]}),Ne(n,`cams`,36.2,3.88,1.16),V(n,`batt`,40.6,7.55,.16,2),V(n,`ammo9`,35.5,11.5,.02),I(n,`Locker room`,21,17,8,9,{..._t,c:`SEC`,safe:1}),R(n,24,16,{sg:[[`Lockers`,`n`]]}),R(n,24,26,{c:`SEC`,sg:[[`Lockers`,`s`]]}),L(n,21,16,8,1);for(let e of[21,22,26,27,28])R(n,e,16,{seal:!0,glass:!0,glaze:`high`});for(let e of[19.5,22.5])for(let t of[22.4,26.6])B(n,t,e,5.6,2,1,5069414),B(n,t,e,5.64,.05,1.04,3818572,{y:2,c:0});for(let e of[22.4,26.6])for(let t of[18.2,21,23.8])B(n,e,t,4.4,.45,.4,7035464);for(let[e,t,r]of[[23.5,19.848,.9],[25.6,22.861,-1.1],[21.8,22.8705,1.3]])B(n,e,t,.5,1.8,.03,5661550,{y:.15,ry:r,c:0});Ne(n,`lockers`,26.2,21,.47),V(n,`bandage`,27.4,23.8,.47),B(n,23.1,25.4,1.6,.45,.4,7035464,{ry:.35}),At(n,24.5,25.2,1.1),I(n,`Infirmary`,30,17,8,4,{...gt,c:`SEC`,safe:1,ht:3.6}),R(n,33,16,{sg:[[`Infirmary`,`n`]]}),L(n,30,16,8,1);for(let e of[31,35,36])R(n,e,16,{seal:!0,glass:!0});for(let e of[30.6,31.9,33.2,34.5])kt(n,e,19.6);for(let e of[31.25,32.55,33.85]){B(n,e,19.6,.04,1.9,1.7,12174525,{y:.15,c:0}),B(n,e,19.6,.05,.04,1.8,10133668,{y:3.46,c:0});for(let t of[-.4,0,.4])B(n,e,19.6+t,.01,1.42,.01,10133668,{y:2.04,c:0})}B(n,34.2,18.7,.45,.45,.45,6251110),At(n,34.5,19.6,.8),B(n,35.25,17.8,.05,2.1,3.2,[.55,.66,.7],{mat:`glass`}),B(n,36.6,18,.8,.9,2,12174525),B(n,37.5,19.2,.6,.95,.5,9187108),B(n,30.35,17.3,.6,.9,.5,13159632),Et(n,31.8,17.3,1.8,.5,{cols:[13949140,12174525,9187108]}),Et(n,36.5625,20.875,1.8,.5,{cols:[13949140,12174525,9187108]}),V(n,`bandage`,36.25,20.875,1.04,2),V(n,`medkit`,36.8,20.875,1.04);let g={...vt,ht:9.5,em:1,lc:[.85,.8,.68]};for(let[e,t,r,i]of[[39,9,10,3],[39,16,10,5],[39,12,3,4],[46,12,3,4]])I(n,`Atrium`,e,t,r,i,g);I(n,`Security elevator`,43,13,2,2,{..._t,c:`SEC`,em:1,noroam:1}),R(n,42,14,{sg:[[`Security elevator`,`w`]]}),B(n,44.985,14,.06,.5,.4,2895667,{y:1.1,c:0}),Pe(n,`elev`,44.9,14,1.3,{c:`SEC`,to:`main`}),n.marks[`elev:main`]=[44,14,r/2],I(n,`Phase 2`,43,6,2,2,{...mt,lit:`none`,nolamp:1,noroam:1}),R(n,43,8,{kind:`heavy`,seal:!0,msg:`Welded shut. Stencilled across it: PHASE 2. NOT COMMISSIONED.`,sg:[[`Phase 2`,`s`]]}),Xe(n,o,46,11,6,`n`);let _={...Ct,ht:4.5,c:`OPS`,mat:{wall:`block`}};I(o,`Gallery`,39,9,10,2,_),I(o,`Gallery`,47,11,2,10,_),$t(n,`atrium`,46.7,19.6,`CRIT`),Xt(n,39.3,20.6,3.8,r,`OPS`,`atrium`),Mt(n,39.4,13.4,2),Mt(n,39.3,15.6,3),At(n,46.3,19.3,1.4),I(n,`Operations corridor`,42,21,3,6,{...vt,ht:4.5,em:1,mat:an(vt)}),$t(n,`ops`,43.5,25,`CRIT`),H(n,`husk`,43.5,24),H(n,`husk`,41,18.5),At(n,43,22.7,1.2);for(let[e,t,r,i,a]of[[`Office: operations`,37,22,{open:!0},!1],[`Office: chief of security`,46,22,{card:`o`},!0]])I(n,e,t,r,4,4,{...yt,c:`OPS`,lc:[.85,.78,.62],armed:a}),R(n,a?t-1:t+4,r+1,a?{...i,sg:[[`Chief of security`,`w`]]}:i),Dt(n,t+2,r+3.4,1.8,.7,{c:4864556}),B(n,t+2,r+2.7,.45,.45,.45,2895667),Et(n,a?t+3.7:t+.3,r+1.6,.5,1.8,{cols:[8014388,5069414,9075274]});Xt(n,49.6,25.6,2.8,-1.99,`OPS`,`ops`),Ne(n,`mgr`,38.7,25.35,.78),V(n,`batt`,39.4,25.4,.78),Ne(n,`chief`,47.7,25.35,.78),V(n,`ammo9`,48.4,25.4,.78),V(n,`medkit`,49.5,22.4,.02),I(n,`Maintenance`,46,27,4,5,{...mt,c:`OPS`}),R(n,45,28,{sg:[[`Maintenance`,`w`]]}),tn(n,`OPS`,49.3,29.5,48.7,29.5),Et(n,47.6,31.7,1.8,.5,{cols:[13214247,4014146]}),V(n,`kit`,47.6,31.7,1.06);let v={...vt,ht:4.5,em:1,lc:[.86,.82,.72],c:`HALL`};for(let[e,t,r,i]of[[16,27,8,12],[24,27,12,2],[24,37,12,2]])I(n,`Muster hall`,e,t,r,i,v);I(n,`Muster hall`,36,27,9,12,{...v,c:`EAST`}),I(n,`Muster court`,24,29,12,8,{...v,dy:-1.25,ht:9.75}),Ze(n,24,29,12,2,-1.25,0,`n`,5),Ze(n,24,35,12,2,-1.25,0,`s`,5);for(let e of[23.96,36.04])B(n,e,33,.06,1,16,[.55,.66,.7],{mat:`glass`}),B(n,e,33,.12,.06,16.1,5922144,{y:1,c:0});B(n,30,33,2.6,1.1,.5,2237994,{y:6.2,c:0});for(let e of[32.87,33.13])B(n,30,e,2.2,.7,.02,[.05,.04,.04],{y:6.4,c:0,pw:[[.05,.04,.04],[2.6,.5,.3]],pc:`HALL`});for(let e of[29.5,30.5])B(n,e,33,.04,2.45,.04,2763822,{y:7.3,c:0});for(let[e,t,r]of[[27,29.01,3754074],[33,29.01,9075274],[27,36.99,9075274],[33,36.99,3754074]])B(n,e,t,1.4,2.2,.04,r,{y:5.9,c:0});B(n,24.7,33,.6,1.1,.5,4864556),z(n,`cyl`,24.5,31.6,.05,2.2,.05,9079428,{c:0}),B(n,24.5,31.8,.03,.6,.9,3754074,{y:1.5,c:0}),Mt(n,31,32.2,3),Mt(n,28.4,33.8,2),At(n,29.5,33,1.6);for(let[e,t]of[[19.5,30.5],[19.5,35.5],[40.5,30.5],[40.5,35.5],[23.5,28.5],[36.5,28.5],[23.5,37.5],[36.5,37.5]])B(n,e,t,.9,4.5,.9,9209982),B(n,e,t,1,.3,1,5922144,{c:0});for(let e of[27.4,38.6])B(n,30.2,e,55.2,.01,.12,13214247,{y:.012,c:0});for(let e of[16.4,44])B(n,e,33,.12,.01,22.4,13214247,{y:.012,c:0});B(n,19.5,27.0125,3.2,1.6,.05,2896960,{y:1.1,c:0});for(let e=0;e<5;e++)B(n,18.81+e*.345,27.0275,.42,.56,.01,14210244,{y:1.5+e%2*.4,c:0});for(let e of[29.6,36.4])B(n,16.25,e,.4,.45,3,7035464);for(let e=0;e<4;e++)B(n,16.066,34.9+e*.3,.12,1.2,.55,3816768,{y:.003,rz:.12,c:0});for(let[e,t,i]of[[39,33,0],[42.5,31.4,.4],[42,35.2,-.3],[38,29.2,r/2]])B(n,e,t,.3,1.05,2.4,13214247,{ry:i}),B(n,e,t,.32,.12,2.42,2763822,{y:.6,ry:i,c:0});$t(n,`muster`,19.5,33,`CRIT`),Xt(n,24.1,33,7.6,r/2,`HALL`,`muster`,{name:`Muster court`}),Xt(n,44.7,27.3,4,-r/4,`EAST`,`ops`,{name:`East bays`}),I(n,`Electrical room`,10,31,5,4,{...mt,c:`OPS`,safe:1,armed:1}),R(n,15,32,{sg:[[`Electrical`,`e`]]}),Xt(n,14.6,31.3,2.8,-1.08,`HALL`,`muster`,{name:`Electrical room`}),B(n,10.01,32.5,.04,1.7,3.4,3816768,{y:.55,c:0});for(let[e,t]of[[`HALL`,31.6],[`EAST`,32.5]])Yt(n,e,10.055,t,`e`,{brk:1});B(n,10.04,33.4,.08,.5,.5,2895667,{y:1.1,c:0}),Pe(n,`look`,10.2,33.4,1.6,{label:`Read the panel schedule`,text:`Typed, under plastic. 1: MUSTER HALL WEST (AND COURT). 2: MUSTER HALL EAST (AND OPS STAIR). 3: SPARE. Below, in red: OPERATIONS AND SECURITY PA ARE CRITICAL LOADS. FED FROM THE UPS ROOM BEHIND OPERATIONS. NOT ON THIS BOARD.`}),B(n,12.5,31.2,4.4,2.2,.6,4869973);for(let[e,t]of[`HALL`,`EAST`,`CRIT`,`OPS`].entries())B(n,11.65+e*.6,31.36,.5,.3,.04,[.2,.2,.2],{y:1.5,c:0,pw:[[.2,.2,.2],[.4,2.6,.6]],pc:t});B(n,13.8,34.2,1.2,1.6,1,4477530),B(n,12.4,34.925,3.4,.08,.3,2763822,{y:2.8,c:0}),V(n,`batt`,11,34.4,.02),Pt(n,16.9,32.8,2896960,!0,{label:`Search the guard`,say:`A guard, a step short of the electrical room. REYES, on the name tape. Opened from the side, by something that kept going.`}),At(n,17.6,33.4,1.8),I(n,`Armory`,30,22,5,4,{..._t,c:`OPS`,armed:1}),Xt(n,30.4,22.4,2.8,.53,`HALL`,`muster`,{name:`Armory`}),R(n,32,26,{kind:`heavy`,code:1,c:`OPS`,sg:[[`Armory`,`s`]]}),Et(n,30.3,23.6,.5,3,{empty:1}),Et(n,34.7,23.6,.5,3,{empty:1}),B(n,32.5,22.5,.9,.7,.7,3817520);for(let e=0;e<6;e++)B(n,30.9+e*.62,24.6,.05,2.4,.05,2763822,{c:0});B(n,32.4,24.6,3.2,.05,.05,2763822,{y:2.4,c:0}),V(n,`pistol`,30.35,22.9,1.06),V(n,`ammo9`,30.35,23.5,1.06,2),V(n,`shotgun`,30.35,24.2,1.06),V(n,`shells`,34.65,23,1.06,2),V(n,`tacvest`,34.65,24,1.06),V(n,`surf`,32.5,22.5,.7),I(n,`Firing range`,16,40,14,4,{..._t,c:`OPS`,ht:3.4,armed:1}),R(n,17,39,{sg:[[`Range`,`n`]]}),Xt(n,16.4,40.4,3,1.24,`HALL`,`muster`,{name:`Firing range`}),B(n,19.6,41.5,.5,1,6,4474956);for(let e of[41,42,43])B(n,20.05,e,.9,1.8,.06,5922144);for(let e of[40.5,41.5,42.5])B(n,24.8,e,20,.06,.06,2763822,{y:3.1,c:0}),B(n,29.3,e,.06,1,.5,13156512,{y:1,c:0}),B(n,29.3,e,.06,.06,.06,2763822,{y:2,c:0});B(n,29.85,42,.3,3.2,8,3813926);for(let e of[21.5,23.5,25.5,27.5])B(n,e,42,.8,.05,8,5922144,{y:2.6,rz:.5,c:0});V(n,`ammo9`,19.6,41,1.02),I(n,`Duty office`,31,40,4,4,{...yt,c:`OPS`,lc:[.85,.78,.62]}),R(n,31,39,{sg:[[`Duty office`,`n`]]});for(let e of[33,34])R(n,e,39,{seal:!0,glass:!0});L(n,31,39,4,1),Dt(n,33.5,40.6,1.8,.7,{c:4864556}),B(n,33.5,41.3,.45,.45,.45,2895667),Et(n,34.7,42.6,.5,1.8,{cols:[8014388,5069414,9075274]}),V(n,`peaches`,33.1,40.6,.78),V(n,`bandage`,33.9,40.55,.78),Ne(n,`memo`,33.5,40.68,.78),Zt(n,33.5,41,1.1,`OPS`,[`Muster court`,`East bays`,`Electrical room`,`Armory`,`Firing range`,`Operations stair`],{dwell:5}),Pt(n,16.8,37.4,4866616,!1,{label:`Search the manager`,say:`DEPUTY DIRECTOR, OPERATIONS. She got as far as the range door. Her pass is still on its lanyard.`,keys:[`o`]}),I(n,`Operations stair`,37,40,3,6,{...vt,c:`EAST`,em:1,ht:9.5,armed:1}),R(n,38,39,{sg:[[`Operations`,`n`]]}),Xe(n,o,38,40,6,`s`),I(o,`Operations stair`,37,46,3,2,{...vt,c:`EAST`,em:1,ht:3.2,armed:1}),Xt(o,38.5,47.6,2.8,r,`EAST`,`ops`,{name:`Operations stair`}),R(o,36,46,{seal:!0,msg:`Bodies. Grown into the frame and into each other, floor to lintel, faces turned in. Something behind them is breathing.`});for(let e of[35.6,36.8,38])At(n,38.4+(e-36)*.15,e,1.1);Mt(n,37.3,38.3,3),Mt(n,39.6,37.6,2);for(let e of[41,43,44.6])Mt(n,37.45,e,2),Mt(n,39.6,e+.5,2);Mt(o,37.4,46.5,4),Mt(o,39.5,47.3,3),jt(o,37.6,47.2,3),H(o,`husk`,38.6,46.6,{post:1,yaw:r/2}),I(o,`Operations room`,24,38,12,9,{...yt,c:`CRIT`,ht:4,em:1,lc:[.7,.74,.8],noroam:1});for(let e=26;e<=33;e++)R(o,e,37,{seal:!0,glass:!0,c:`CRIT`});Tt(o,29.3,46.4,20,.7,3816768);for(let e=0;e<9;e++)B(o,24.7+e*1.15,46.985,2.1,1.2,.06,2237994,{y:1.1,c:0}),B(o,24.7+e*1.15,46.965,2,1.1,.02,[.05,.07,.08],{y:1.15,c:0,pw:[[.04,.05,.05],[2.2,2.5,2.75]],pc:`CRIT`});Mt(o,25,38.6,3),Mt(o,34.9,39,4),jt(o,26.5,41,3),jt(o,33.6,42.5,3),At(o,30,43,2.4),H(n,`skitter`,27.6,42),Mt(n,26.4,43.3,2),R(n,49,14,{card:`o`,c:`OPS`,sg:[[`Cargo`,`w`]]}),I(n,`Cargo link`,50,14,9,2,{...mt,c:`CARGO`,em:1}),R(n,59,14,{sg:[[`Cargo cavern`,`w`]]}),R(o,49,16,{sg:[[`Cargo control`,`w`]]}),I(o,`Cargo control`,50,12,9,7,{...yt,c:`CARGO`,ht:4}),Tt(o,58.3,15,.8,4,3816768),B(o,57.4,15,.45,.45,.45,2895667);for(let e of[14.2,15.8])B(o,58.4,e,.5,.3,.06,2237994,{y:.76,c:0,pw:[[.04,.05,.05],[2.2,2.5,2.75]],pc:`CARGO`});for(let e of[13,15,17])R(o,59,e,{seal:!0,glass:!0,c:`CARGO`});Pe(o,`look`,58.4,15,1.5,{label:`Look out over the bay`,text:`Thick glass, and the bay a long way down. Out on the rungs something glows, the colour of a healing burn.`}),ln(n,o,s,c);let y=[11038814,10117714,11565670,10512468];for(let e=0;e<9;e++){let t=24.7+e*1.15,n=45.75;B(o,t,n,.45,.35,.45,2895667),B(o,t,n,.55,.85,.45,y[e%4],{y:.35,rz:(e*7%5-2)*.06}),z(o,`ico`,t,45.83,.42,.4,.42,y[(e+1)%4],{y:1.15,c:0}),z(o,`ico`,t+(e%3-1)*.04,45.97,.36,.34,.24,14209216,{y:1.22,c:0}),z(o,`ico`,t+(e%3-1)*.04,46.015,.14,.14,.06,1380366,{y:1.26,c:0}),z(o,`ico`,t+.18,46.35,.26,.12,.2,y[(e+2)%4],{y:.76,c:0}),e<8&&B(o,t+.575,45.7,1.95,.16,.14,y[e%4],{y:.75+e%2*.12,c:0});let r=(30.7-t)*2,i=-11.299999999999997,a=Math.hypot(r,i);B(o,(t+30.7)/2,85.85/2,a,.16,.18,y[e%4],{y:.5+e%3*.1,ry:-Math.atan2(i,r),c:0})}for(let[e,t,n]of[[29.6,39.1,3],[32,39.4,3],[29.4,41.1,3],[31.8,41.6,2]]){for(let r=0;r<n;r++){let n=.14+r*7%5*.03;z(o,`ico`,e+Math.cos(r*2.3)*.12,t+Math.sin(r*2.3)*.1,n,n*.7,n,[2.75,2.36,2.2],{y:-n*.15,c:0})}o.lamps.push({x:e*2,z:t*2,r:4.5,c:[.5,.17,.1],h:.4})}H(n,`husk`,20.5,29),H(n,`husk`,38.5,37),Qt(n,22.5,16,`n`,`wing`),Qt(n,40.5,21,`n`,`atrium`),Qt(n,16,36,`e`,`muster`),Qt(n,42,25.5,`e`,`ops`);let b={Checkpoint:`wing`,Lobby:`wing`,"Lobby gallery":`wing`,"Goods inward":`wing`,"Surface landing":`wing`,"Hazardous storage":`wing`,"Security corridor":`wing`,"Nurses' station":`wing`,"Briefing room":`wing`,"Locker room":`wing`,Infirmary:`wing`,Atrium:`atrium`,"Security elevator":`atrium`,Gallery:`atrium`,"Muster hall":`muster`,"Muster court":`muster`,"Electrical room":`muster`,Armory:`muster`,"Firing range":`muster`,"Duty office":`muster`,"Operations corridor":`ops`,"Office: operations":`ops`,"Office: chief of security":`ops`,Maintenance:`ops`,"Operations stair":`ops`};for(let e of[...n.rooms,...o.rooms])b[e.name]&&(e.zone=e.name===`Muster hall`&&e.c===`EAST`?`ops`:b[e.name]);let x={need:`ISO`,once:!0},S={...x,pace:1.4};return H(n,`nightround`,30.5,10.3,{yaw:r,round:[{D:n,x:30.5,z:10.3,wait:600,...x},{D:i,x:31.6,z:3,wait:.3,...S},{D:i,x:32.4,z:3.5,tries:1,...S},{D:i,x:34.7,z:4,wait:1.2,take:!0,...S},{D:i,x:32.3,z:3,wait:.2,...S},{D:i,x:29.4,z:5.4,graft:!0,...S},{D:i,x:29.5,z:4.4,tries:1,look:.5,...S},{D:i,x:30,z:2,wait:2.2,about:!0,...S},{D:i,x:26.5,z:4.4,tries:1,look:.5,...S},{D:i,x:27,z:2,wait:2.2,about:!0,...S},{D:i,x:26,z:5.5,wait:3,tries:1,look:.5,...S},{D:i,x:23.6,z:4.4,wait:3,about:!0,...S},{D:n,x:31.5,z:10.2,wait:.2,...S},{D:n,x:28.5,z:13.6,wait:.5,...S},{D:n,x:36.5,z:13.6,tries:1},{D:n,x:37.2,z:14.4,wait:4},{D:n,x:28.5,z:13.4,wait:3},{D:n,x:18.5,z:11.5,wait:2},{D:n,x:13,z:6.5,wait:4},{D:n,x:16.5,z:3,wait:3},{D:n,x:22,z:14.5,wait:2}]}),H(n,`patient`,0,0,{at:{D:i,x:34.4,z:4.5},yaw:-r/2,state:`wait`,hide:{D:i,x:34.3,z:4.45}}),cn(i,n,o,s),ft([23.6,4.5,r/2],i)}function cn(e,t,n,r){let i={c:`SEC`,em:1,zone:`wing`},a=(e,t,n,r,i,a)=>{let o=i>r,s=o?i:r;for(let a of[.1,.55,1,1.45,1.86])B(e,t,n,r,.04,i,4869456,{y:a,c:0});for(let a of[-1,1])B(e,t+(o?0:a*(s/2-.02)/2),n+(o?a*(s/2-.02)/2:0),o?r:.04,1.9,o?.04:i,3816768,{c:0});[.14,.59,1.04,1.49].forEach((c,l)=>{for(let u=0;u<4;u++){if((u+l)%3==0)continue;let d=(-s/2+.1+(s-.2)/4*(u+.5))/2,f=.22,p=Math.min(.24,(o?r:i)-.08);B(e,t+(o?0:d),n+(o?d:0),o?p:f,.16+(u*3+l)%4*.04,o?f:p,a[(u+l)%a.length],{y:c,c:0,goods:!0})}}),Ae(e,t,n,r,i,1.9)},o=(e,t,n,r)=>{B(e,t,n,.45,.45,.45,r)},s=(e,t,n,r,i,a=-1)=>{B(e,t,n,i?.06:.5,.34,i?.5:.06,2237994,{y:r,c:0}),B(e,t+(i?a*.02:0),n+(i?0:a*.02),i?.02:.44,.28,i?.44:.02,[.04,.05,.05],{y:r+.03,c:0,pw:[[.04,.05,.05],[2.2,2.75,2.5]],pc:`SEC`})},c=(e,t,n)=>{B(e,t,n,1.2,.8,1.2,7236194);for(let r=0;r<4;r++)z(e,`ico`,t+Math.cos(r*1.7)*.15,n+Math.sin(r*1.7)*.15,.2,.9+r*.2,.2,5917230,{y:.8,c:0})},l={...yt,...i,ht:4,fl:6971992,wl:10721930,st:8018480,lc:[.92,.86,.74],mat:{floor:`carpet`,wall:`plaster`,ceiling:`tiles`}};I(t,`Check-in hall`,21,1,5,4,l),I(t,`Check-in hall`,20,2,1,2,{...l,mat:bt.mat}),B(t,22.6,2.9,.7,1.05,5.6,9076848,{mat:`stone`}),B(t,22.6,2.9,.8,.05,5.7,3813414,{y:1.05,c:0});for(let e of[2.2,3.6])s(t,22.72,e,1.1,!0,1),o(t,23.3,e,2895667);B(t,22.62,2.9,.3,.18,.26,12106944,{y:1.1,c:0});for(let e of[1.8,2.6,3.4,4.2])z(t,`cyl`,21.55,e,.06,.95,.06,9075274);B(t,25.8,2.9,.5,.9,5.6,5918792),B(t,25.995,2.9,.02,.9,2.4,14210244,{y:1.3,c:0}),V(t,`batt`,25.8,2.1,.9),L(t,21,5,5,1),R(t,23,5,{sg:[[`Screening`,`n`]]}),I(t,`Screening`,21,6,5,2,{...gt,...i}),R(t,24,8,{sg:[[`Isolation`,`n`],[`Screening`,`s`]]});for(let e of[21.8,25.2])B(t,e,6.5,2,.7,.8,12108989),B(t,e-.35,6.5,.5,.08,.6,14869210,{y:.7,c:0});Dt(t,23.1,7.55,1.2,.6,{bare:1}),s(t,23.1,7.68,.76,!1),o(t,23.1,7,2895667),V(t,`bandage`,22.88,7.55,.76);for(let n of[1,2])Xe(e,t,n,3,5,`s`,!0);for(let t=0;t<20;t++){let n=(t+1)/20*4.5,r=3+(t+.5)/20*5,i=10/20;B(e,1.92,r,3.68,n,i,t%2?11774876:11116946,{c:0,flush:!0}),B(e,2.92,r,.32,Math.min(n+1.05,4.5),i,9406330,{flush:!0})}let u=[.55,.66,.7];for(let[e,n,r,i]of[[3.03,5.5,.06,10],[2,2.97,4,.06]])B(t,e,n,r,1,i,u,{mat:`glass`}),B(t,e,n,r>1?r:.07,.07,i>1?i:.07,6177828,{y:1,c:0,mat:`steel`});c(t,3.7,4.2),c(t,3.7,6.2);let d={...i,ht:3.8,fl:4076586,wl:5914672,st:8018480,lc:[.95,.78,.55],mat:{floor:`stone`,wall:`wood`,ceiling:`plaster`}};I(e,`Retreat lounge`,3,1,7,8,d),I(e,`Retreat lounge`,1,1,2,1,d),I(e,`Retreat lounge`,1,2,2,6,{...d,ht:4.5,nolamp:1});for(let t of[3.2,6.4]){B(e,6.2,t,1.6,.4,.9,2761760);for(let n of[-1,1])B(e,6.2,t+n*.9,2.6,.45,.85,6961706),B(e,6.2,t+n*1.16,2.6,.9,.22,5910564,{c:0});B(e,7.6,t,.85,.45,.85,6961706),B(e,7.86,t,.22,.9,.85,5910564,{c:0})}B(e,6.2,1.15,3,.85,.5,4862502);for(let t of[5.9,6.1,6.6])z(e,`cyl`,t,1.15,.1,.28,.1,6965802,{y:.85,c:0});V(e,`peaches`,5.5,1.15,.85),B(e,6,8.985,6,1.6,.03,[.06,.06,.07],{y:.8,c:0,pw:[[.06,.06,.07],[2.75,2.82,2.92]],pc:`SEC`});for(let t of[4.515,5.5,6.5,7.485])B(e,t,8.965,.06,1.6,.02,3812386,{y:.8,c:0});for(let t of[.8,2.34])B(e,6,8.965,6,.06,.02,3812386,{y:t,c:0});L(e,10,1,1,4),I(e,`Humidor`,11,1,2,4,{...i,ht:3,fl:4863014,wl:9067066,st:5913124,lc:[.95,.8,.6],mat:{floor:`wood`,wall:`wood`,ceiling:`wood`}}),R(e,10,2,{sg:[[`Humidor`,`w`]]});for(let t of[1,3,4])R(e,10,t,{glass:!0,glaze:`full`});for(let t of[2,4])a(e,12.75,t,.5,2.6,[8014378,9071162,6961700,10521162]);for(let[t,n]of[[1.7,1.04],[2.3,.59],[3.8,1.49],[4.4,.14]])z(e,`ico`,12.7,t,.36,.22,.3,9079354,{y:n,c:0});Tt(e,11.6,3,.9,1.6,5914154),B(e,11.6,2.8,.25,.06,.18,8014378,{y:.76,c:0}),B(e,11.55,3.2,.22,.05,.16,9071162,{y:.76,c:0});let f={...i,ht:4,fl:10131082,wl:6982280,st:4156010,lc:[.8,.9,.95],mat:{floor:`stone`,wall:`glazed`,ceiling:`plaster`}};I(e,`Pool hall`,14,1,7,8,f),I(e,`Pool`,15,2,5,5,{...f,dy:-1.5,ht:5.5,fl:4885146,wl:3832458,mat:{floor:`glazed`,wall:`glazed`,ceiling:`plaster`},nolamp:1}),Ze(e,15,5,2,2,-1.5,0,`s`,6,10131082),e.water.push([15,2,20,7,-.25]);for(let t of[3,4.5])for(let n of[15.0075,19.9925])B(e,n,t,.03,.18,.3,[.1,.12,.12],{y:.5,c:0,pw:[[.1,.12,.12],[2.1,2.6,2.9]],pc:`SEC`});for(let t of[2.5,4.2,5.9])B(e,20.45,t,.7,.35,1.9,14210244);c(e,14.5,1.7),c(e,14.5,7.4),I(e,`Retreat plant`,1,10,7,2,{...mt,...i,noroam:1}),R(e,8,10,{sg:[[`Plant room`,`e`]]}),B(e,1.55,11,2,1.8,2.6,7040624,{mat:`steel`});for(let t of[4.4,5.6])z(e,`cyl`,t,10.4,1,1.8,1,9079428,{mat:`steel`});for(let t of[4.2,5.2])z(e,`cyl`,t,11.4,.7,.7,.7,4020804,{mat:`steel`});B(e,7,11.55,1.6,.9,.7,5918792),V(e,`adjwrench`,7,11.55,.9),I(e,`Retreat passage`,9,10,16,2,{...i,ht:3,fl:5922138,wl:9080456,st:4161387,mat:{floor:`vinyl`,wall:`plaster`}}),R(e,9,9,{sg:[[`Pool`,`n`],[`Lounge`,`s`]]}),R(e,17,9,{sg:[[`Pool`,`s`]]}),R(e,25,10,{c:`SEC`,sg:[[`Isolation`,`w`],[`Private`,`e`]]}),en(e,24.9875,10.5,2.5,`w`);let p={..._t,...i,ht:3.5,mat:an(_t)};I(n,`Upper corridor`,20,9,2,5,p),I(n,`Upper corridor`,22,9,17,2,p);let m={...mt,...i,ht:3.5,noroam:1};I(n,`Plant stair`,21,2,4,6,m),I(n,`Plant stair`,25,2,1,6,{...m,ht:7.5}),R(n,22,8,{sg:[[`Plant room`,`s`]]}),Xe(n,r,25,2,5,`n`),B(n,21.6,2.6,1,3.4,1,7040624,{mat:`steel`}),I(n,`Staff mess`,27,2,5,6,{...yt,...i,mat:{floor:`vinyl`,wall:`plaster`,ceiling:`tiles`}}),R(n,28,8,{sg:[[`Mess`,`s`]]});for(let e of[28.2,30.4])for(let t of[4.2,6.2]){Tt(n,e,t,1.6,.8,9080460);for(let r of[-1,1])o(n,e,t+r*.45,3816768)}B(n,28.5,2.2,4,.9,.6,9080460),B(n,31.5,2.25,.8,1.9,.7,12106944),z(n,`cyl`,27.7,2.2,.16,.24,.16,2763822,{y:.9,c:0}),V(n,`ration`,28.2,2.2,.9),I(n,`Administration`,33,2,5,6,{...yt,...i}),R(n,35,8,{sg:[[`Administration`,`s`]]});for(let e of[34.5,36.5])for(let t of[3.5,5.8])Dt(n,e,t,1.4,.7,{bare:1}),s(n,e,t+.1,.76,!1),o(n,e,t-.45,2895667);for(let e of[3,4,5])B(n,37.75,e,.5,1.3,.5,6251110);I(r,`Air plant`,21,0,5,2,{...mt,...i,ht:6,noroam:1}),Ze(r,21,0,4,2,0,3.5,`w`,16),B(r,25.5,.4,.9,2.2,.7,7040624,{mat:`steel`});let h={...i,em:0,air:1,dy:3.5,ht:2.4,noroam:1,fl:4869198,wl:4867648,st:4867648,mat:{floor:`grating`,wall:`shot`,ceiling:`shot`}};I(r,`Sky void`,1,1,19,12,h),I(r,`Sky void`,20,1,1,1,h);for(let e of[2.5,5.5,8.5,11.5,14.5,17.5])for(let t of[2.5,5.5,8.5,11.5])B(r,e,t,2.8,.4,2.8,3816510),B(r,e,t,2.6,.02,2.6,9080460,{y:.4,c:0});I(t,`Kitchen`,1,14,3,6,{...i,fl:6975082,wl:12106932,st:9187108,mat:{floor:`epoxy`,wall:`glazed`,ceiling:`tiles`}}),R(t,1,13,{sg:[[`Staff only`,`n`]]}),B(t,1.2,17,.6,.9,10,9080460,{mat:`steel`}),B(t,1.2,15.2,.56,.02,.9,1908513,{y:.9,c:0}),a(t,3.75,16,.5,3,[9080460,7035452,5069414,8014388]),B(t,3.3,19.4,.8,.6,.8,7035452),V(t,`ration`,1.2,18.6,.9,2),V(t,`peaches`,1.2,18,.9),I(t,`Service passage`,4,18,7,2,{...mt,...i}),R(t,11,18,{sg:[[`Goods inward`,`w`]]}),B(t,6,19.4,.8,1.6,.7,7040624,{mat:`steel`})}function ln(e,t,n,i){let a=Ue(e,`Cargo cavern`,60,8,65,14,{...St,ht:20,c:`CARGO`,lit:`main`,em:1,motes:`flesh`});Be(e,a,5),Ve(e,a,0,1.2);let o={...Ct,ht:5,c:`CARGO`,motes:`flesh`,mat:{wall:`shot`,ceiling:`shot`}};I(t,`Tier 1`,68,8,48,5,o),I(n,`Tier 2`,72,8,39,5,o),I(i,`Tier 3`,76,8,25,5,o),Qe(e,t,70,11,2,2,`CARGO`,`Cargo platform`),Qe(t,n,74,11,2,2,`CARGO`,`Cargo platform`),Qe(n,i,78,11,2,2,`CARGO`,`Cargo platform`);for(let t of[8.2,21.8])B(e,92.5,t,128,.5,.4,5922144,{y:17.4,c:0});B(e,90,15,1,.8,27.4,13214247,{y:17.6,c:0}),B(e,90,16.5,1.4,.6,1.4,2763822,{y:17,c:0}),B(e,90,16.5,.05,8.6,.05,2763822,{y:8.4,c:0}),B(e,90,16.5,.5,.4,.5,9075242,{y:8,c:0}),At(e,64,16,1.4),Gt(e,72,20,!1,2),Gt(e,80,20,!1,3),Gt(e,95,20.2,!1,2),Gt(e,104,19.4,!0,1),Gt(e,84,10,!1,1),Gt(e,98,9.6,!1,1),Gt(e,88,17.4,!0,2),Gt(e,110,17.6,!0,3),Kt(e,76,16.5,!0),Kt(e,101,16.8,!1),H(e,`husk`,80,14.6),H(e,`husk`,96,15.4);for(let[t,n,r]of[[114,12,4],[117,18,5],[119,10,3],[121,15,5],[123,20,4],[116,14.6,3]])Mt(e,t,n,r);jt(e,118,15.5,4),At(e,120,13,2),H(e,`worm`,117,16),H(e,`worm`,118,17),H(e,`worm`,116.5,17.4),H(e,`skitter`,121,12),H(e,`husk`,112,19,{post:1,yaw:-r/2}),Gt(t,92,9.6,!1,1);for(let[e,n]of[[85,10],[99,9],[108,11]])Mt(t,e,n,4);H(t,`skitter`,88,11),H(t,`skitter`,104,10);for(let[e,t]of[[76,9],[84,11],[90,9],[96,10.6],[103,9.4],[108,10]])Mt(n,e,t,5);jt(n,93,10,4),H(n,`skitter`,86,10),H(n,`skitter`,97,11),H(n,`skitter`,105,9.6),H(n,`grabber`,90,8.12,{yaw:0});for(let[e,t]of[[77,9],[80.6,11],[83,9.4],[86,10.8],[89,9],[92,11],[95,9.6],[98,10.6]])Mt(i,e,t,6);jt(i,88,10,5),jt(i,94,9.6,4),H(i,`skitter`,82,10),H(i,`skitter`,90,11.4),H(i,`skitter`,97,9);for(let[t,n,r]of[[66,19.5,3],[70,17.8,4],[73.5,19.6,5],[77,18.2,4]])Mt(e,t,n,r);for(let[r,a,o]of[[e,66.6,19.2],[e,70.5,18],[e,74,19.4],[t,85,10],[n,84,11],[n,90,9],[i,80.6,11],[i,86,10.8],[i,92,11]]){for(let e=0;e<5;e++)z(r,`ico`,a+(e-2)*.22,o+(e*7%3-1)*.25,.38,.3,.38,[2.6,.9,.55],{y:e%2?0:-.08,c:0});r.lamps.push({x:a*2,z:o*2,r:5.5,c:[.55,.18,.1],h:.5})}B(i,96,9.4,1.1,.6,1.1,7035452),V(i,`fuse`,96,9.4,.6),V(i,`batt`,95,10.4,.02,2),I(e,`Cargo office`,62,23,4,4,{...yt,c:`CARGO`}),R(e,63,22,{sg:[[`Cargo office`,`n`]]}),Dt(e,63.4,26.3,1.8,.7),Ne(e,`manifest`,63.1,26.25,.78),V(e,`batt`,63.75,26.3,.78),tn(e,`CARGO`,65.3,23.7,64.7,24.3),V(e,`bandage`,62.4,23.5,.02),I(e,`Vehicle bay`,68,23,6,4,{...mt,c:`CARGO`}),R(e,70,22,{sg:[[`Vehicles`,`n`]]}),Kt(e,69,25.3,!0),Kt(e,72.4,25.2,!0),V(e,`batt`,73.4,23.5,.02),V(e,`pipe`,71,26.6,.02),R(e,125,14,{sg:[[`Exhaust shaft`,`w`]]}),I(e,`Exhaust link`,126,14,6,2,{...mt,c:`CARGO`,em:1}),H(e,`grabber`,128.5,14.12,{yaw:0}),R(e,132,14,{sg:[[`Fan station`,`w`]]}),I(e,`Fan station`,133,12,5,6,{...mt,c:`CARGO`,ht:6,em:1}),z(e,`cyl`,135.6,14.6,4.4,.8,4.4,3883078,{y:5.2,c:0});for(let t=0;t<4;t++)B(e,135.6,14.6,4,.06,.5,5922144,{y:5.14,c:0,ry:t*r/4});$e(e,`B1`,136.6,16.6,135.6,16.4,r/2,!1)}var un={id:`main`,name:`Main level`,c:`RES`,org:[-10,-30]},dn=3.5;function fn(e){xe(un,e);let t=un,n=we(t,140,30),i=we(t,140,30,{y0:dn,li:1}),a=we(t,140,30,{y0:2*dn,li:2}),o=we(t,140,30,{y0:3*dn,li:3});Te(n,i),Te(i,a),Te(a,o),nn(n,5,14,7,14),I(n,`Shaft station`,8,14,3,3,{...mt,em:1,safe:1}),R(n,11,14,{sg:[[`The Commons`,`w`],[`Shaft station`,`e`]]}),$e(n,`A2`,8.5,16.6,9.4,15.6,r/2,!1),I(n,`Security elevator`,8,18,2,2,{..._t,c:`SEC`,em:1,noroam:1}),R(n,9,17,{sg:[[`Security elevator`,`n`]]}),B(n,9,19.985,.5,.4,.06,2895667,{y:1.1,c:0}),Pe(n,`elev`,9,19.9,1.3,{c:`SEC`,to:`upper`}),n.marks[`elev:upper`]=[9,18.8,0];let s={fl:9276028,wl:10855062,st:4161387,ht:20,sky:8825284,em:1,c:`RES`};I(n,`The Commons`,12,12,55,6,s);for(let e of[8,18])I(n,`The Commons`,12,e,2,4,s);let c={...s,air:1,ht:20-3*dn,fl:5591626,noroam:1,nolamp:1};for(let e of[8,18])I(o,`The Commons`,14,e,57,4,c);for(let e of[4,22])I(o,`The Square`,67,e,22,4,c);for(let e of[8,16])I(o,`The Square`,85,e,4,6,c);let l={...Ct,c:`RES`,fl:6973022,wl:9209982};for(let e of[12,16])I(i,`Gallery`,12,e,59,2,{...l,ht:3.4}),I(a,`Gallery`,12,e,55,2,{...l,ht:3.2});I(i,`Bridge`,50,14,1,2,{...l,ht:3.4}),I(a,`Bridge`,26,14,1,2,{...l,ht:3.2}),Xe(n,i,12,8,4,`s`),Xe(n,i,12,18,4,`n`),Xe(i,a,44,13,4,`e`),Xe(i,a,30,16,4,`w`);for(let e=0;e<6;e++){let t=22.5+8*e;qt(n,t,13.85,dn),qt(n,t,16.15,dn)}z(n,`cyl`,46,15,3.6,.5,3.6,9079428),z(n,`cyl`,46,15,3.3,.08,3.3,3812898,{y:.5,c:0}),Bt(n,46,15,5,.5,!0);for(let[e,t,r]of[[40,14.4,0],[52,15.6,0],[28,15.6,0],[64,14.4,0]])B(n,e,t,r?.45:1.8,.42,r?1.8:.45,6251110);for(let[e,t]of[[20,14.25],[36,15.75],[56,14.25],[64,15.75]])z(n,`cyl`,e,t,.12,3.3,.12,3816768),B(n,e,t,.5,.12,.5,15265522,{y:3.3,c:0,glow:1});B(n,58,15.2,1.8,.9,.1,5987679,{rz:.25,ry:1.2}),B(n,57.4,16.2,.6,.6,.6,7035452,{ry:.6}),At(n,57,15.4,2.4),At(n,34,14.6,1.6),At(n,70,15,1.4),jt(n,48,13.4,3),Mt(n,13,9,3),Mt(n,13,20.5,2),H(n,`bloat`,30,15),H(n,`husk`,20,13),H(n,`husk`,36,15.6),H(n,`husk`,52,13.2),H(n,`husk`,62,16),H(i,`husk`,25,12.6),H(i,`husk`,58,16.6),H(a,`husk`,40,12.6);let u={...ht,c:`RES`,lc:[.85,.78,.62]},d=[],f=(e,t,n,i,a,o)=>{let s=n?8:19,c=n?11:18,l=n?s+1.1:s+1.9,f=n?s+.3:s+2.7;I(e,`Residence `+a,t,s,7,3,{...u,fl:7628890,lit:o[1]===`worm`||o[1]===`nest`?`none`:`main`,...o[1]===`nest`?{motes:`flesh`}:{}}),R(e,t+i,c,o[0]),wt(e,t+.4,s+1.5,!0,d.length%3?6253432:8018512),Tt(e,t+3.5,s+1.5,1.4,.8,7035464),B(e,t+6.7,f,.45,1.9,.45,5919816),B(e,t+5.4,f,1.8,.45,.7,7036760),V(e,o[2],t+3.5,s+1.5,.78),d.push(a);let p=t+3.5+(o[1]===`post`?1.5:0);o[1]===`gore`?(jt(e,p,l,4),Nt(e,p+.4,l+.4,Ce([4871520,9080726,7040858]),!0),d.length%2&&H(e,`skitter`,p-1,l)):o[1]===`worm`?(H(e,`worm`,p-.6,l),H(e,`worm`,p+.6,l+.4),H(e,`worm`,p+1.4,l),Mt(e,t+1.6,f,2)):o[1]===`nest`?(Mt(e,p-.8,l,3),Mt(e,t+5,f,3),H(e,`skitter`,p+.6,l)):o[1]===`post`?H(e,`husk`,p,l,{post:1,yaw:n?r:0}):o[1]===`body`&&Pt(e,p+.4,l,Ce([4871520,7040858,8018512]),!0,{label:`Search the resident`,say:`A room card on a lanyard. Not for this flat.`,keys:[o[3]]})},p={"N1.2":[{open:!0},`clean`,`ration`],"N2.2":[{card:`N2.2`},`clean`,`medkit`],"N3.2":[{stuck:!0},`gore`,`bandage`],"N4.2":[{},`post`,`batt`],"N5.2":[{open:!0},`worm`,`batt`],"N6.2":[{card:`N6.2`},`body`,`ammo9`,`C7`],"N1.3":[{},`gore`,`batt`],"N2.3":[{open:!0},`nest`,`bandage`],"N3.3":[{},`body`,`ration`,`N2.2`],"N4.3":[{card:`N4.3`},`clean`,`shells`],"N5.3":[{},`body`,`batt`,`S3.2`],"N6.3":[{stuck:!0},`worm`,`knife`],"S1.2":[{},`gore`,`batt`],"S2.2":[{open:!0},`post`,`bandage`],"S3.2":[{card:`S3.2`},`clean`,`medkit`],"S4.2":[{stuck:!0},`nest`,`medkit`],"S5.2":[{},`clean`,`batt`],"S6.2":[{},`body`,`bandage`,`N6.2`],"S1.3":[{open:!0},`clean`,`ration`],"S2.3":[{},`gore`,`batt`],"S3.3":[{stuck:!0},`post`,`bandage`],"S4.3":[{},`nest`,`batt`],"S6.3":[{open:!0},`clean`,`peaches`]};for(let e=0;e<6;e++){let t=15+8*e;for(let r of[!0,!1]){let o=(r?`N`:`S`)+(e+1);p[o+`.2`]&&f(i,t,r,1,o+`.2`,p[o+`.2`]),p[o+`.3`]&&f(a,t,r,5,o+`.3`,p[o+`.3`]),gn(n,t,r,e,u)}}return I(a,`Director's residence`,47,19,7,3,{...ht,c:`RES`,fl:6181448,lc:[.85,.78,.62],noroam:1}),R(a,52,18,{sg:[[`Director`,`n`]]}),wt(a,47.4,20.5,!0,8018512),Tt(a,49.4,21.4,2,.8,4864556),Ne(a,`keeper`,49.4,21.35,.78),Mt(a,48.6,19.6,4),Mt(a,51,21.4,3),jt(a,50.4,20.2,5),H(a,`bloat`,52.8,20.6,{sit:1,yaw:-r/2}),H(a,`husk`,48.6,20.2,{post:1,yaw:-r/2}),H(a,`husk`,50.2,21.2,{post:1,yaw:-r/2}),H(a,`skitter`,49.6,19.6),pn(n,i,u,l,s),R(n,89,14,{sg:[[`Horticulture`,`w`],[`The Square`,`e`]]}),I(n,`Transit tunnel`,90,14,3,2,{...mt,c:`RES`,em:1}),R(n,93,14,{sg:[[`Airlock`,`w`]]}),I(n,`Airlock`,94,14,3,2,{...mt,c:`HORT`,em:1}),R(n,97,14,{sg:[[`Horticulture`,`w`]]}),_n(n,i),ft([9.6,16.1,r/2])}function pn(e,t,n,a,o){I(e,`The Square`,71,8,14,14,o),I(e,`The Square`,67,12,4,6,o),I(e,`The Square`,85,14,4,2,o);for(let[e,n,r,i]of[[71,8,14,2],[71,20,14,2],[71,10,2,10],[83,10,2,10]])I(t,`Ring`,e,n,r,i,{...a,ht:3.4});Xe(e,t,73,10,4,`n`),Xe(e,t,81,16,4,`s`),z(e,`cyl`,78,15,7.6,.6,7.6,9079428),z(e,`cyl`,78,15,7.2,.08,7.2,3812898,{y:.6,c:0}),z(e,`cyl`,78,15,.9,11,.9,4864812,{y:.6,c:1});for(let t=0;t<10;t++){let n=t/10*i+N(.3),r=N(2.4,4.2),a=N(4,9.5);B(e,78+Math.cos(n)*r*.45/2,15-Math.sin(n)*r*.45/2,r,.16,.16,4207402,{y:a,c:0,ry:n,rz:.5}),z(e,`ico`,78+Math.cos(n)*r*.9/2,15-Math.sin(n)*r*.9/2,N(1.2,2.2),N(.8,1.5),N(1.2,2.2),Ce([9194052,7220008,11568498,5208640]),{y:a+.6,c:0})}for(let t=0;t<7;t++){let t=N(i),n=N(2.6,4.4);B(e,78+Math.cos(t)*n*.5/2,15-Math.sin(t)*n*.5/2,n,.22,.3,3812898,{y:.02,c:0,ry:t})}for(let[t,n,r]of[[75.2,15,1],[80.8,15,1],[78,12.2,0],[78,17.8,0]])B(e,t,n,r?.45:1.8,.42,r?1.8:.45,6251110);for(let[t,n,r]of[[76.4,13.2,4],[79.6,16.9,3],[83,19,3],[72,9,2]])Mt(e,t,n,r);At(e,74,18.6,2),jt(e,82.6,10,3),H(e,`thresher`,78,10.5),H(e,`bloat`,80,19),H(e,`worm`,76.2,16.6),H(e,`worm`,79.8,13.4),H(e,`husk`,74.5,18,{post:1,yaw:r/2}),H(t,`skitter`,77,8.6),H(t,`skitter`,83.6,16);let s={y0:4,fy:7},c={y0:23,fy:22};gn(e,67,!0,7,n,{...s,dc:5}),gn(e,74,!0,6,n,{...s,dc:3}),gn(e,67,!1,7,n,{...c,dc:5}),gn(e,74,!1,6,n,{...c,dc:3});let l=(t,r,i,a,o,s,c,l,u)=>{I(e,t,r,i,a,o,{...n}),R(e,s,c,{sg:[[t.split(` `)[0],l]]}),u(r,i)};l(`Café`,81,4,7,3,82,7,`s`,(t,n)=>{for(let r of[1.6,4,6.2])Tt(e,t+r,n+1.6,1,1,9075290);B(e,t+3.5,n+.3,5,1,.6,7304056),V(e,`ration`,t+3,n+.3,1.02,2),At(e,t+5,n+2.4,1.2)}),l(`Barbershop`,81,23,7,3,82,22,`n`,(t,n)=>{for(let r=0;r<3;r++)B(e,t+1.5+r*2,n+2.4,.7,1,.7,8006186);B(e,t+3.5,n+2.985,6,1,.06,[.16,.2,.22],{y:1,c:0}),Nt(e,t+4,n+1.2,7040858,!1)}),l(`Kiosk`,67,8,3,3,70,10,`e`,(t,n)=>{B(e,t+2.2,n+1.5,.6,1,2.4,7035464),V(e,`peaches`,t+2.2,n+1,1.02),Et(e,t+.3,n+1.5,.5,2.4,{cols:[13214247,8014388]})}),l(`Florist`,67,19,3,3,70,19,`e`,(t,n)=>{for(let r=0;r<4;r++)z(e,`cyl`,t+.6+r%2*1.2,n+.8+Math.floor(r/2)*1.4,.5,.5,.5,7035464);Vt(e,{x:t,y:n,w:3,h:3,ht:3.2},.6,!0)}),l(`Transit office`,86,8,3,5,85,11,`w`,(t,n)=>{Dt(e,t+1.6,n+.6,1.8,.7),V(e,`batt`,t+2,n+.6,.78),Et(e,t+2.7,n+3,.5,2.4)}),l(`Lost property`,86,17,3,5,85,18,`w`,(t,n)=>{Et(e,t+2.7,n+2.4,.5,3,{cols:[5069414,7035452,9075306]}),V(e,`bandage`,t+1.2,n+1.4,.02)});for(let[e,r,i,a,o,s,c,l]of[[67,4,7,3,71,7,`C1`,[{},`clean`,`peaches`]],[74,4,7,3,79,7,`C2`,[{card:`C2`},`nest`,`medkit`]],[81,4,7,3,84,7,`C3`,[{open:!0},`body`,`bandage`,`N4.3`]],[67,23,7,3,71,22,`C4`,[{open:!0},`clean`,`ration`]],[74,23,7,3,79,22,`C5`,[{open:!0},`worm`,`peaches`]],[81,23,7,3,84,22,`C6`,[{},`worm`,`batt`]],[67,8,3,3,70,8,`C7`,[{card:`C7`},`clean`,`shells`]],[67,19,3,3,70,21,`C8`,[{},`clean`,`ration`]],[86,8,3,5,85,9,`C9`,[{},`gore`,`batt`]],[86,17,3,5,85,20,`C10`,[{},`post`,`bandage`]]])mn(t,e,r,i,a,o,s,c,l,n)}function mn(e,t,n,r,i,a,o,s,c,l){I(e,`Residence `+s,t,n,r,i,{...l,fl:7628890,lit:c[1]===`worm`||c[1]===`nest`?`none`:`main`,...c[1]===`nest`?{motes:`flesh`}:{}}),R(e,a,o,c[0]);let u=t+r/2,d=n+i/2,f=a<u?t+r-.6:t+.6,p=o<d?n+i-1.1:n+1.1,m=a<u?t+.4:t+r-.4,h=o<d?n+i-.35:n+.35;wt(e,f,p,!0,6253432),Tt(e,u,d,1.2,.8,7035464),V(e,c[2],u,d,.78),B(e,m,h,.45,1.9,.45,5919816);let g=u+(f<u?.9:-.9),_=d+(p<d?.7:-.7);c[1]===`gore`?(jt(e,g,_,4),Nt(e,g,_,Ce([4871520,9080726,7040858]),!0),H(e,`skitter`,g,d)):c[1]===`worm`?(H(e,`worm`,g-.5,_),H(e,`worm`,g+.5,_),H(e,`worm`,g,d)):c[1]===`nest`?(Mt(e,g,_,3),Mt(e,m,h-.3,2),H(e,`skitter`,g,d)):c[1]===`post`?H(e,`husk`,g,_,{post:1,yaw:Math.atan2(a-g,o-_)}):c[1]===`body`&&Pt(e,g,_,Ce([4871520,7040858,8018512]),!0,{label:`Search the resident`,say:`A room card on a lanyard. Not for this flat.`,keys:[c[3]]})}var hn={...ht.mat,floor:`vinyl`};function gn(e,t,n,i,a,o={}){let s=o.y0||(n?8:19),c=o.fy||(n?11:18),l=o.dc||3,u=n?`s`:`n`,d=n?s+.3:s+2.7,f=n?s+2.6:s+.4,p=s+1.5,m=(n,r={},i={})=>{I(e,n,t,s,7,3,{...a,...r}),R(e,t+l,c,{sg:[[n.split(` `)[0],u]],...i})};if(n)switch(i){case 0:m(`Canteen`,{mat:hn},{open:!0});for(let n of[-.6,.6])Tt(e,t+2.6,p+n,3.2,.8,9078136);B(e,t+6,d,1.8,1,.6,7304056),V(e,`peaches`,t+6,d,1.02,2),Ne(e,`diary`,t+2.6,p-.6,.78),At(e,t+4.4,f,2),At(e,t+1,p,1.4),H(e,`husk`,t+5.4,p+.6),H(e,`husk`,t+.8,p,{post:1,yaw:-r/2});break;case 1:m(`Kitchen`,{fl:9409682,wl:11120299,mat:{...hn,wall:`glazed`}},{stuck:!0}),B(e,t+3.5,d,6,.9,.6,8159622),B(e,t+6.5,p,.8,1.9,.7,11843770),V(e,`knife`,t+2.5,d,.92),V(e,`ration`,t+4.4,d,.92,2),H(e,`grabber`,t+3.5,s+.12,{yaw:0}),Mt(e,t+1,f,3);break;case 2:m(`Commissary`,{},{stuck:!0}),Et(e,t+2,d+.1,3,.5,{jars:1}),Et(e,t+5.5,d+.1,2.4,.5),V(e,`peaches`,t+5,p,.02);break;case 3:m(`Laundry`,{lit:`none`,mat:hn});for(let n=0;n<4;n++)B(e,t+1+n*1.4,d,.9,1,.8,12106944);H(e,`worm`,t+2,p),H(e,`worm`,t+3,p+.4),H(e,`worm`,t+5,p),Mt(e,t+6.2,f,3);break;case 4:m(`Chapel`);for(let n=0;n<3;n++)B(e,t+1.5+n*1.8,p+.2,1.4,.45,.5,5917244);B(e,t+3.5,d,1.6,1,.6,7035464),jt(e,t+5.6,f,3),Nt(e,t+5,p,4871520,!1);break;case 5:m(`Maintenance`,{...mt,c:`RES`,mat:_}),tn(e,`RES`,t+5.6,s+.7,t+5,s+1.3),Et(e,t+1.5,d+.1,2.4,.5),V(e,`batt`,t+1.2,d+.1,1.06,2),V(e,`bandage`,t+2.6,p,.02);break;case 6:m(`Post room`),Et(e,t+1.5,d+.1,2.4,.5,{cols:[12167562,9075306]}),Tt(e,t+4.5,p,2,.8),V(e,`batt`,t+4.5,p,.78);break;case 7:m(`Recreation`,{lit:`none`}),B(e,t+2.5,p,2.4,.8,1.3,3812898),B(e,t+2.5,p,2.3,.04,1.2,3103296,{y:.8,c:0}),B(e,t+5.6,d,2,.45,.8,5917252),B(e,t+6.4,f,.9,.5,.6,4870712),V(e,`goggles`,t+6.4,f,.5),V(e,`batt`,t+.6,d,.02),Pt(e,t+4.4,f,7040858,!1,{label:`Search the resident`,say:`Swimming trunks, a towel, a room card.`,keys:[`C2`]}),Mt(e,t+1,f,4),H(e,`skitter`,t+3.6,p),H(e,`skitter`,t+1.4,d+.4)}else switch(i){case 0:m(`Gymnasium`,{mat:hn}),B(e,t+2,p,3,.08,2,3820122,{c:0});for(let n=0;n<3;n++)z(e,`cyl`,t+5+n*.6,d,.4,.4,.4,2763822);H(e,`husk`,t+3.5,p,{post:1,yaw:0});break;case 1:m(`School room`);for(let n=0;n<3;n++)for(let r of[-.5,.5])Tt(e,t+1.6+n*1.8,p+r,1,.6,9075290);B(e,t+3.5,s+2.985,3,1.2,.06,2767404,{y:1,c:0}),Mt(e,t+6,f,3),H(e,`skitter`,t+5.5,p);break;case 2:m(`Library`,{lit:`none`});for(let n=0;n<3;n++)Et(e,t+1.2+n*2.3,d-.1,1.8,.5);Et(e,t+3.5,p+.2,3,.5);break;case 3:m(`Stores`,{...mt,c:`RES`,mat:_},{kind:`heavy`}),Et(e,t+1.5,d+.1,2.4,.5),Et(e,t+5.5,d+.1,2.4,.5),V(e,`ration`,t+3.5,d,.02,2),V(e,`batt`,t+3.5,p,.02);break;case 4:m(`Trauma centre`,{...gt,c:`RES`},{kind:`heavy`});for(let n=0;n<4;n++)kt(e,t+.6+n*1.5,s+1.9);Et(e,t+6.7,p,.5,2.6,{cols:[13949140,12174525,9187108,11056320]});for(let n of[p-.45,p,p+.45])V(e,`medkit`,t+6.65,n,1.06);V(e,`bandage`,t+6.65,p+.5,.61,2),Tt(e,t+5.4,f,.8,.7,11843770),Ne(e,`clinic`,t+5.4,f,.78);break;case 5:m(`Water room`,{...mt,c:`RES`,mat:_});for(let n of[1.6,5.4])z(e,`cyl`,t+n,p,2.2,2.6,2.2,3886423);B(e,t+3.5,p,6,.14,.14,4014146,{y:2.4,c:0});break;case 6:m(`Workshop`,{...mt,c:`RES`,mat:_}),Tt(e,t+3,d+.075,4,.9,5525578),V(e,`pipe`,t+3,p+.6,.02),V(e,`batt`,t+3.8,d+.075,.78);break;case 7:m(`Bar`,{},{open:!0}),B(e,t+3.5,p,5,1,.6,4864556);for(let n=0;n<4;n++)z(e,`cyl`,t+1.8+n*1.2,p-.7,.4,.7,.4,2763822);At(e,t+2,f,1.6),H(e,`husk`,t+5.6,d,{post:1,yaw:0})}}function _n(e,t){let n={...xt,c:`HORT`},i=I(e,`Security post`,98,12,4,6,{..._t,c:`HORT`,em:1});Dt(e,100.6,12.5,1.8,.7),Ne(e,`hsec`,100.2,12.45,.78),tn(e,`HORT`,101.3,16.6,100.7,17.2),Pt(e,99.4,16.4,2896960,!0,{label:`Search the guard`,say:`Horticulture had its own security. This one kept his pass.`,keys:[`h`]}),R(e,102,14,{card:`h`,sg:[[`Labs`,`w`],[`Security`,`e`]]});let a=I(e,`Cross passage`,103,6,1,18,{...n,em:1}),o=[[`Grow gallery north`,6,{}],[`Grow gallery`,13,{em:1}],[`Grow gallery south`,20,{lit:`none`}]].map(([t,r,i])=>I(e,t,104,r,13,4,{...n,ht:6,...i}));for(let t of o)for(let n of[.8,3.2]){B(e,110.5,t.y+n,22,.7,1.1,7301726),B(e,110.5,t.y+n,21.6,.06,.9,3023896,{y:.7,c:0});for(let r=0;r<14;r++)z(e,`ico`,105.3+r*.78+N(-.1,.1),t.y+n,N(.3,.7),N(.4,1.8),N(.3,.7),Ce([...Ft,9194052]),{y:.72,c:0})}let s=I(e,`Tissue lab`,106,1,6,4,{...n,fl:8226184,wl:10135708,flick:1});R(e,108,5,{sg:[[`Tissue lab`,`s`]]}),L(e,106,5,6,1);for(let t of[106,107,109,110,111])R(e,t,5,{seal:!0,glass:!0,glaze:`full`});L(e,113,5,4,1);for(let t of[115,116])R(e,t,5,{seal:!0,glass:!0});Tt(e,108,2.4,3,.8,11186869),Tt(e,111.4,3,.8,2,11186869);for(let t of[106.6,107.6])z(e,`cyl`,t,1.5,.8,2.2,.8,[.16,.3,.24],{c:1});Ne(e,`journal`,108,2.35,.78),V(e,`batt`,107.5,2.4,.78,2),I(e,`Director of research`,113,1,4,4,{...ht,c:`HORT`,fl:6181448,lc:[.85,.78,.62]}),R(e,114,5,{code:2,sg:[[`Dr. M. Holt`,`s`]]}),Dt(e,115,1.6,2,.8,{c:4864556}),Et(e,113.3,3,.5,2.4,{cols:[8014388,5069414,9075274]}),wt(e,116.6,3.4,!0,8018512),Ne(e,`holt`,114.6,1.55,.78),V(e,`batt`,115.35,1.6,.78,2),V(e,`medkit`,113.6,4.6,.02),I(e,`Seed vault`,106,25,5,4,{...mt,c:`HORT`}),R(e,108,24,{kind:`heavy`,sg:[[`Seed vault`,`n`]]}),Et(e,106.3,27,.5,3,{jars:1,cols:[6982212,13352872,9194052]}),Et(e,110.7,27,.5,3,{jars:1,cols:[6982212,13352872]}),V(e,`medkit`,108.5,28.5,.02),V(e,`kit`,110.65,26.6,1.06),I(e,`Infirmary`,112,25,4,4,{...gt,c:`HORT`}),R(e,113,24,{sg:[[`Infirmary`,`n`]]}),kt(e,112.4,26.8),Et(e,115.7,27.5,.5,2.4,{cols:[13949140,9187108]}),V(e,`medkit`,115.65,27.2,1.06),V(e,`bandage`,115.65,28,1.06,2);for(let t of[8,14,20])R(e,117,t,{open:t===14,sg:[[`Arboretum`,`w`]]});let c=Ue(e,`Arboretum`,118,6,15,15,{...xt,c:`HORT`,ht:16,lit:`always`,lc:[.5,.24,.4]});Re(e,122,17,4,1.6,c),Re(e,129,9.5,3.5,1.2,c),Re(e,128,17.5,3,1,c),ze(e,125,13,8,4,c),Ve(e,c,.15,1.5);for(let[t,n,r]of[[121.5,10,7],[126,15,9],[123,17.5,6.5],[130,11,7.5],[129.5,18,6],[120.5,13.6,5.5]])Bt(e,t,n,r,0,!0);H(e,`bloat`,127.6,13,{sit:1,yaw:-r/2,holt:1}),Ne(e,`last`,125.2,12.7,.03);for(let t=0;t<8;t++)B(e,127.4-N(0,1.4),13+N(-.6,.6),N(.8,2),.07,.07,Ce([7220008,4155962]),{y:N(-.04,0),c:0,ry:N(-.5,.5),rz:N(0,.2)});I(e,`Overlook stair`,104,11,6,1,{...n,ht:6.7,em:1}),Xe(e,t,104,11,6,`e`);let l={...n,em:1,lc:[.86,.82,.72],fl:9076848,wl:10135708,mat:{floor:`terrazzo`,wall:`plaster`,ceiling:`plaster`}};I(t,`Overlook passage`,110,11,8,1,{...l,ht:3.2}),I(t,`Arboretum balcony`,118,10,3,3,{...l,open:1,ht:4,nolamp:1,mat:{floor:`terrazzo`,wall:`shot`,ceiling:`shot`}});for(let e of[10.6,12.4])B(t,118.8,e,1.6,.45,.45,5914164);I(e,`Breach`,125,3,1,2,{...He,lit:`none`,nolamp:1,noroam:1}),R(e,125,5,{stuck:!0,sg:[[`Cave`,`s`]]}),$e(e,`CV`,125.5,3.5,125.5,4.4,r,!1,{bare:!0,label:`Crawl through the breach`});for(let t=0;t<6;t++)z(e,`ico`,125+(N(.1,.9)<.5?.08:.92),3+N(0,2),N(.3,.7),N(.2,.5),N(.3,.7),Ce(Ft),{c:0,y:N(0,1.6)});R(e,133,14,{sg:[[`Exhaust shaft`,`w`]]}),I(e,`Exhaust shaft`,134,12,4,6,{...mt,c:`HORT`,em:1}),$e(e,`B1`,136.6,12.6,135.6,13.4,r/2,!0),$e(e,`B2`,136.6,16.6,135.6,16.4,r/2,!1);for(let[t,n,r]of[[a,.7,!0],[o[0],.9,!0],[o[1],.6,!0],[o[2],1.1,!0],[c,1,!0],[s,.5,!1],[i,.12,!1]])Vt(e,t,n,r);for(let[t,n,i]of[[103.12,8,r/2],[103.12,21,r/2],[116.88,15.5,-r/2],[108.5,9.88,r]])H(e,`vine`,t,n,{yaw:i});H(e,`vine`,118.12,19,{yaw:r/2}),H(e,`vine`,133.88,14.6,{yaw:-r/2});for(let[t,n]of[[106,7],[110,8.4],[114,7.2],[107,21],[111,22.4],[115,21.4],[121,16],[124,19],[130,15]])H(e,`rootworm`,t,n)}var vn={id:`plant`,name:`Plant level`,c:`ENG`,org:[-10,-30]};function yn(e){xe(vn,e);let t=we(vn,140,30),n={...mt,c:`ENG`};nn(t,5,14,7,14),I(t,`Shaft station`,8,14,3,3,{...mt,em:1,safe:1}),R(t,11,14,{sg:[[`Engineering`,`w`],[`Shaft station`,`e`]]}),$e(t,`A2`,10.5,16.6,9.6,16.1,r/2,!0),$e(t,`A3`,8.5,16.6,9.4,15.6,r/2,!1);let i=I(t,`West corridor`,12,14,26,2,{...n,em:1});I(t,`East corridor`,38,14,26,2,{...n,em:1});let a=I(t,`Machine shop`,14,8,9,5,{...n,ht:4});R(t,18,13,{stuck:!0,sg:[[`Machine shop`,`s`]]}),Tt(t,15,10,.9,3.4,5525578),B(t,19,9,1.8,1.1,.9,4149576),z(t,`cyl`,19,9,.3,.5,.3,2897971,{y:1.1,c:0}),B(t,21.6,10.6,.9,1.3,1.8,4149576),Et(t,20.5,12.7,3,.5),V(t,`adjwrench`,15,9.4,.78),V(t,`fuse`,15,10.1,.78),Ne(t,`work`,15,10.7,.78),V(t,`batt`,20.5,12.65,1.06,2),Pt(t,18.4,11.4,6969908,!1,{label:`Search the engineer`,say:`Something has rooted through him. His card is still good.`,keys:[`e`]}),I(t,`Parts store`,24,8,6,5,n),R(t,26,13,{card:`e`,sg:[[`Parts`,`s`]]}),Et(t,24.3,10.4,.5,4),Et(t,29.7,10.4,.5,4),Et(t,26.8,8.3,3,.5),V(t,`kit`,24.35,9.6,1.06),V(t,`kit`,29.65,11.2,1.06),V(t,`batt`,26.8,8.35,1.06,3),V(t,`pipe`,26.8,10.6,.02),I(t,`Distribution`,31,8,8,5,n),R(t,34,13,{sg:[[`Distribution`,`s`]]}),[`OPS`,`CARGO`,`RES`,`HORT`,`HYD`].forEach((e,n)=>Yt(t,e,32.4+n*1.2,8.035,`s`)),B(t,34.8,8.5,6.4,.01,.9,12098350,{y:.012,c:0});for(let e of[31.6,38.4])B(t,e,10.6,.9,2,2.4,4869973);Ne(t,`route`,37,12.4,.02),I(t,`Chillers`,40,8,8,5,n),R(t,43,13,{sg:[[`Chillers`,`s`]]});for(let e=0;e<3;e++)B(t,41.4+e*2.6,10,2,2.2,3,5925490);B(t,44,8.05,7.6,.2,.2,4014146,{y:2.8,c:0}),I(t,`Backup plant`,49,8,5,5,n),R(t,51,13,{sg:[[`Backup plant`,`s`]]}),tn(t,`ENG`,50.2,8.6,50.2,9.3),tn(t,`ENG`,52.6,8.6,52.6,9.3),I(t,`Infirmary`,14,17,4,5,{...gt,c:`ENG`}),R(t,15,16,{sg:[[`Infirmary`,`n`]]}),kt(t,14.4,19),V(t,`bandage`,17.4,20.6,.02,2),V(t,`medkit`,16.4,21.4,.02),I(t,`Water treatment`,19,17,10,5,n),R(t,23,16,{sg:[[`Water`,`n`]]});for(let e of[21,25])z(t,`cyl`,e,19.6,2.4,3,2.4,3886423);for(let e of[18,20])B(t,28.2,e,1,1.6,1.4,4149576);B(t,24,21.965,9.6,.14,.14,4014146,{y:2.4,c:0}),I(t,`Control room`,30,17,7,5,n),R(t,33,16,{sg:[[`Control`,`n`]]}),Tt(t,33.5,21.2,5,.8);for(let e=0;e<5;e++)B(t,31.3+e*1.1,21.985,1,.7,.06,2237994,{y:1.2,c:0}),B(t,31.3+e*1.1,21.965,.9,.6,.02,[.05,.07,.08],{y:1.25,c:0,pw:[[.04,.05,.05],[2.3,2.6,2.75]]});V(t,`batt`,32.5,21.2,.78),I(t,`Locker room`,38,17,6,5,n),R(t,40,16,{sg:[[`Lockers`,`n`]]});for(let e=0;e<6;e++)B(t,38.6+e*.9,21.875,.8,1.9,.5,5068899);B(t,41,19.4,3,.42,.4,4474956),V(t,`hardhat`,41.6,19.4,.44),V(t,`bandage`,40.5,19.4,.44),Vt(t,i,.6,!0),Vt(t,a,.7,!0),H(t,`vine`,13.12,15.5,{yaw:r/2}),H(t,`vine`,17.5,12.88,{yaw:r}),H(t,`rootworm`,16,10.4),H(t,`rootworm`,20,11.2),H(t,`rootworm`,18.6,9.2),H(t,`rootworm`,22,14.6),H(t,`rootworm`,26,15.4),H(t,`husk`,46,14.6),H(t,`husk`,58,15.4,{post:1,yaw:-r/2}),R(t,64,14,{sg:[[`Generator hall`,`w`],[`Engineering`,`e`]]}),I(t,`Link corridor`,65,14,15,2,{...n,em:1}),R(t,80,14,{sg:[[`Gen-1`,`w`]]}),I(t,`Generator hall`,81,9,49,12,{...n,ht:16,em:1});let o=we(vn,140,30,{y0:5,li:1});Te(t,o),I(t,`Control stair`,72,16,8,1,{...n,ht:8.4,em:1}),Xe(t,o,73,16,6,`e`),I(o,`Control landing`,79,14,1,3,{...n,ht:3.4,em:1}),R(o,79,13,{sg:[[`Gen-1 control`,`s`]]}),I(o,`Gen-1 control`,72,9,8,4,{...yt,c:`ENG`,ht:3.4,lc:[.8,.84,.9]}),L(o,80,9,1,4);for(let e=9;e<=12;e++)R(o,80,e,{seal:!0,glass:!0,glaze:`full`,c:`ENG`});for(let e=0;e<3;e++)Dt(o,78.9,9.9+e*1.1,.8,1.9,{c:4869973}),B(o,78.2,9.9+e*1.1,.5,.45,.5,2895667);B(o,72.015,11,.06,1.6,5.6,2764854,{y:1});for(let e=0;e<6;e++)B(o,72.035,9.7+e*.52,.02,.1,.3,[.3,.05,.04],{y:1.4+e%3*.4,c:0,pw:[[.3,.05,.04],[2.2,2.9,2.3]],pc:`ENG`});B(t,119.5,15,22,5,9,4477530),B(t,119.5,15,20,1,8,3555914,{y:5,c:0});for(let e of[115,124])for(let n of[13,17])z(t,`cyl`,e,n,.9,6,.9,2896696,{y:6,c:0});for(let e of[-1,1])B(t,119.5,15+e*2.28,22.4,.04,.12,9075242,{y:2.4,c:0});B(t,119.5,15,24,.01,11,12098350,{y:.012,c:0}),B(t,113.6,15,.34,2,1.7,3817284),B(t,113.5,14.7,.06,.3,.2,1382427,{y:1.05,c:0}),B(t,113.48,15.3,.08,.4,.08,11020832,{y:1,c:0,rz:.5}),B(t,113.5,15,.06,.1,.1,[.3,.05,.04],{y:1.7,c:0,pw:[[2.9,2.15,2.1],[2.2,2.9,2.3]]}),B(t,113.1,15,.9,.01,1.9,12098350,{y:.013,c:0}),Pe(t,`fuse`,113.2,14.7,1.2),Pe(t,`breaker`,113.2,15.3,1.2);for(let e=86;e<=110;e+=6)for(let n of[9.6,20.4]){B(t,e,n,2.4,2.4,1.4,4147792),B(t,e,n,2,.3,1,2896696,{y:2.4,c:0});for(let r of[-.35,0,.35])z(t,`cyl`,e+r,n,.18,.5,.18,12106944,{y:2.7,c:0})}for(let[e,n]of[[9,1],[21,-1]])B(t,105.5,e+n*.15,98,.12,.6,5922144,{y:6,c:0}),B(t,105.5,e+n*.125,98,.5,.5,4014146,{y:9,c:0});for(let e of[9.1,20.9])B(t,105,e,96,.5,.4,5922144,{y:13.4,c:0});B(t,119.5,15,1.2,1,23.4,13214247,{y:13.6,c:0}),B(t,119.5,13.5,1.6,.8,1.6,2763822,{y:13,c:0}),B(t,119.5,13.5,.06,6.4,.06,2763822,{y:6.6,c:0}),B(t,119.5,13.5,.5,.4,.5,9075242,{y:6.3,c:0}),B(t,100,9.09,.8,1.9,.18,11020832),V(t,`axe`,100,9.6,.02),V(t,`batt`,90,19.5,.02),H(t,`husk`,92,12.6),H(t,`husk`,104,18.4),Vt(t,{x:125,y:9,w:5,h:12,ht:16},1.1,!0);for(let[e,n]of[[126,11],[128,17],[127,14.6],[124,19]])H(t,`rootworm`,e,n);H(t,`vine`,129.88,13,{yaw:-r/2}),R(t,130,14,{sg:[[`Exhaust shaft`,`w`]]});let s=I(t,`Exhaust link`,131,14,2,2,{...n,em:1});R(t,133,14);let c=I(t,`Exhaust shaft`,134,12,4,6,{...n,em:1});return $e(t,`B2`,136.6,12.6,135.6,13.4,r/2,!0),Vt(t,s,1.2,!0),Vt(t,c,1.2,!0),H(t,`rootworm`,135,16.4),ft([9.6,16.1,r/2])}var bn={id:`sump`,name:`The sump`,c:`HYD`,org:[-10,-30]},xn={id:`sumpdeep`,name:`The sump, drowned`,c:`DEEP`,org:[-10,-30]};function Sn(e){xe(bn,e);let t=we(bn,140,30,{wet:.9}),n={fl:2764592,wl:4870226,st:4870226,c:`HYD`,mat:S};nn(t,5,14,7,14),I(t,`Shaft station`,8,14,3,3,{...n,em:1,safe:1,nolamp:1}),R(t,11,14,{sg:[[`Sump`,`w`],[`Shaft station`,`e`]]}),je(t,10.4,14.4,6),$e(t,`A3`,10.5,16.6,9.6,16.1,r/2,!0),I(t,`Sump`,12,8,40,14,{...n,ht:6,em:1});for(let e=18;e<=46;e+=7)B(t,e,11.5,.4,1.4,6,4870226),B(t,e,18.5,.4,1.4,6,4870226),qt(t,e,15,6);for(let e of[8.075,21.925])B(t,32,e,79,.3,.3,4014146,{y:4.4,c:0});B(t,32,8.045,79,.18,.18,5914676,{y:3.6,c:0});for(let e=0;e<8;e++)B(t,N(14,50),N(9,21),N(.4,1.2),.12,N(.3,.9),Ce([3813408,4870226,2898492]),{y:.88,c:0,ry:N(r)});B(t,30.5,8.3,2.4,.06,1.2,2763822,{y:.88,c:0});for(let e=-1;e<=1;e++)B(t,30.5+e*.5,8.3,.08,.08,1.2,9075242,{y:.92,c:0});et(t,30.5,8.9,1,`sumpdeep`,`Dive: the intake grates`,!0),t.marks[`dive:sumpdeep`]=[30.5,9.6,r],H(t,`swimmer`,22,13),H(t,`swimmer`,36,17),H(t,`swimmer`,44,11),H(t,`swimmer`,28,20),I(t,`Pump station`,52,10,8,10,{...n,ht:8,em:1});for(let e of[11.5,13.8,16.2,18.5])z(t,`cyl`,58.4,e,1.4,2.4,1.4,3886423),B(t,57,e,1.6,1,1,4477530);B(t,59.925,15,.3,.3,9,5914676,{y:3,c:0}),Pe(t,`look`,56,15,1.2,{label:`Pump controls`,text:`Four pumps, all of them dead. The intake gauges read blocked: something below has grown into the grates. Even with power they would only cough.`}),B(t,56,15,.8,1.2,.6,3817284),I(t,`Pump control`,53,5,5,4,n),R(t,55,9,{sg:[[`Control`,`s`]]}),B(t,55.5,5.6,2.4,1,.7,4146248),B(t,55.5,5.6,.5,.34,.06,2237994,{y:1,c:0}),B(t,55.5,5.62,.44,.28,.02,[.06,.12,.1],{y:1.03,c:0,pw:[[.04,.05,.05],[2.2,2.75,2.5]]}),Ne(t,`hydro`,55,5.55,1.02),V(t,`lantern`,56,5.6,1.02),Et(t,53.3,7,.5,3),V(t,`wrench`,53.35,6.4,1.06),V(t,`batt`,53.35,7.6,1.06,2),I(t,`Filter room`,53,21,5,4,n),R(t,55,20,{sg:[[`Filters`,`n`]]});for(let e of[54,56.6])B(t,e,23.6,1.4,1.6,1,4149576);return H(t,`swimmer`,55,22.4),ft([9.6,16.1,r/2])}function Cn(e){xe(xn,e);let t=we(xn,140,30,{deep:1}),n={fl:1975848,wl:3686975,st:3686975,lit:`none`,nolamp:1,mat:S};I(t,`Intake gallery`,22,3,17,4,{...n,ht:3.6}),I(t,`Flooded link`,14,4,8,2,{...n,ht:2.6}),I(t,`Intake main`,39,4,13,2,{...n,ht:2.6});for(let e=0;e<4;e++){let n=24.5+e*4;B(t,n,3.075,1.6,1.6,.3,2898492,{c:0});for(let e=0;e<4;e++)z(t,`ico`,n+N(-.5,.5),3.05+N(0,.15),N(.6,1.1),N(.6,1.2),N(.5,.9),Ce([3099178,4864812,3822128,7220008]),{y:N(.2,1.4),c:0})}for(let e=0;e<8;e++)B(t,N(15,50),N(4.2,6.2),N(.3,.9),N(.2,.5),N(.3,.9),Ce([2898492,3813408,4870226]),{ry:N(r),c:0});return Pt(t,34.6,5.6,2896960,!0,{label:`Search the drowned sergeant`,say:`SGT. R. ALDANA. Four digits in grease pencil on the back of her hand.`,note:`code`}),et(t,30.5,5.8,1.6,`sump`,`Swim up: the intake grates`),t.marks[`dive:sump`]=[30.5,5.4,r],et(t,14.6,4.6,1.4,`cave`,`Swim on: the flooded link, toward the cave`),t.marks[`dive:cave`]=[15.4,4.6,-r/2],H(t,`swimmer`,26,5),H(t,`swimmer`,31,4),H(t,`swimmer`,37,5.6),H(t,`swimmer`,18,4.8),H(t,`swimmer`,46,4.6),ft([30.5,5.4,r])}var wn={id:`cave`,name:`The cave`,c:`CAVE`,org:[-10,-140]};function Tn(e){xe(wn,e);let t=we(wn,160,70),n={lit:`none`,fl:3815474,wl:4867388,st:4867388,motes:`spores`},r=e=>-40+a((e-55)/50,0,1)*14,i=qe(t,`Entry passage`,[[125.5,61,0],[122,53,-3],[118,47,-6],[114.5,43,-8]],1.6,{...n,ht:4}),o=Je(t,`Upper chamber`,112.5,40,7.5,5,()=>-8,{...n,ht:6});ze(t,112.5,40,7,6,o);let s=qe(t,`Spring branch`,[[118,37,-8],[126,30,-2],[134,24,6],[142,16,14],[150,10,22]],.9,{...n,ht:2.6}),c=qe(t,`Descent`,[[108,37,-8],[102,31,-14],[96,26,-21],[92,22,-29.6]],2,{...n,ht:5}),l=Je(t,`Great chamber`,80,15,25,9,r,{...n,ht:18,lit:`always`,lc:[.05,.12,.07]});ze(t,80,15,20,8,l);let u=qe(t,`Lower passage`,[[60,18,-38.6],[52,24,-46],[46,28.5,-58]],1.2,{...n,ht:2.8}),d=Je(t,`Lower chamber`,45,32.5,8.75,6,()=>-58,{...n,ht:6});ze(t,45,32.5,6,3,d);for(let[e,n,r]of[[i,.25,.8],[o,.3,1.5],[s,.2,.35],[c,.3,1],[l,.4,2],[u,.2,.35],[d,.25,1]])Ve(t,e,n,r);Ye(t,d,46,36.5,2.6,2.4),$e(t,`CV`,125.5,60.6,125.5,59.4,0,!0,{bare:!0,label:`Crawl back through the breach`}),et(t,46,34.3,1,`sumpdeep`,`Dive: the flooded link`,!0),t.marks[`dive:sumpdeep`]=[45,33.8,0],Pe(t,`look`,150,10.2,1.2,{label:`Examine the crack`,text:`The passage pinches to a crack you could put an arm through. Cold air comes down it, and the smell of grass. Not today.`});for(let e=0;e<14;e++){let n=N(.15,.9),r=(e%2?1:-1)*N(1.1,1.8),i=108+-16*n+r*.69,a=37+-15*n-r*.72,o=N(.8,1.8);z(t,`ico`,i,a,o*1.3,o,o*1.2,Ce([5919304,4867132,7039588]),{c:1,y:-.3})}for(let e=96,n=0;e>58;e-=.6,n++){let r=15+Math.sin(e*.21)*2.6+Math.sin(e*.07)*1.6;B(t,e,r,1.4,.03,1.3,1455164,{y:.004+n%3*.003,c:0,lie:!0})}for(let e=0;e<9;e++){let e=N(62,98),n=N(9,21),r=Math.floor(n)*t.W+Math.floor(e);t.rm[r]===l.id&&z(t,`cyl`,e,n,N(.6,1.2),N(14,20),N(.6,1.2),3820076,{c:1})}for(let e=0;e<12;e++){let e=N(62,98),n=N(9,21),r=N(2,4),i=N(1.4,3),a=N(2,4),o=Ce([3099178,3822128,5208640,7220008]);N(14,19),z(t,`ico`,e,n,r,i,a,o,{y:l.ht+Ie(t,t.cf,e*2,n*2)-C*i+.4,c:0})}for(let e=0;e<6;e++)Bt(t,N(64,96),N(10,20),N(6,10),0,!0);Ut(t,l,140,!0),Ut(t,o,24,!0),Ut(t,d,20,!0),Ut(t,i,16,!1),Ut(t,c,14,!1),Ut(t,u,10,!0),Ut(t,s,12,!1);for(let[e,n]of[[70,14],[78,18],[86,12],[92,17],[66,19],[74,10]])H(t,`rootworm`,e,n);return H(t,`rootworm`,112,41),H(t,`rootworm`,46,31),H(t,`skitter`,84,16),H(t,`skitter`,110,38),H(t,`skitter`,47,30),ft([125.5,59.4,0])}var En={A2:{broken:`The ladderway is collapsed below this landing. Rubble fills the shaft.`,ends:[`main`,`plant`]},CV:{say:`Through root and broken concrete, and the station ends. Rock, and the sound of water.`,ends:[`main`,`cave`]},A3:{say:`Down the main shaft, and the last rungs go into black water.`,ends:[`plant`,`sump`]},B2:{say:`Fifty metres down the exhaust shaft, into the warm.`,ends:[`main`,`plant`]},B1:{need:{power:`CARGO`,msg:`A fan door is sealed over the ladderway. Its release runs off the Cargo backup set.`},say:`The exhaust shaft, rung over rung against the draught.`,ends:[`upper`,`main`]}},Dn={levels:[{id:`upper`,name:`Upper station`,circuit:`OPS`,build:()=>sn(En)},{id:`main`,name:`Main level`,circuit:`RES`,build:()=>fn(En)},{id:`plant`,name:`Plant level`,circuit:`ENG`,build:()=>yn(En)},{id:`sump`,name:`The sump`,circuit:`HYD`,build:()=>Sn(En)},{id:`sumpdeep`,name:`The sump, drowned`,circuit:`DEEP`,build:()=>Cn(En)},{id:`cave`,name:`The cave`,circuit:`CAVE`,build:()=>Tn(En)}],circuits:{OPS:{on:!0,back:!0,tag:`upper station`},SEC:{on:!0,back:!1,broken:!0,feed:`OPS`,tag:`Security wing`},ISO:{on:!0,back:!1,tag:`Isolation suite backup set`},CELLS:{on:!0,back:!0,tag:`Isolation suite emergency cells`},HALL:{on:!0,back:!1,feed:`OPS`,tag:`Muster hall west`},EAST:{on:!0,back:!1,feed:`OPS`,tag:`Muster hall east`},CRIT:{on:!0,back:!1,feed:`OPS`,tag:`Operations, critical`},RES:{on:!0,back:!1,tag:`main level`},ENG:{on:!0,back:!1,tag:`plant level`},HYD:{on:!0,back:!1,broken:!0,tag:`the sump`},LIFT:{on:!0,back:!1},CARGO:{on:!1,back:!1,tag:`Cargo`},HORT:{on:!0,back:!0,tag:`Horticulture`},DEEP:{on:!1,back:!1},CAVE:{on:!1,back:!1}},ladders:En,main:!1,start:`upper`,intro:`The lights go out, and the lock on your door lets go.`,names:{upper:`Upper station`,main:`Main level`,plant:`Plant level`,sump:`The sump`,sumpdeep:`The sump, drowned`,cave:`The cave`}},U=.25,On=e=>-2-e,kn=512,An=(e,t,n)=>((e+kn)*1024+(t+kn))*1024+(n+kn),jn=class{chunks=new Map;lastKey=-1;last;chunk(e,t,n){let r=An(e,t,n);return r!==this.lastKey&&(this.lastKey=r,this.last=this.chunks.get(r)),this.last}get(e,t,n){let r=this.chunk(e>>4,t>>4,n>>4);return r?r[((n&15)*16+(t&15))*16+(e&15)]:-1}set(e,t,n,r){let i=this.chunk(e>>4,t>>4,n>>4);if(!i){if(r===-1)return;i=new Int16Array(4096).fill(-1),this.chunks.set(An(e>>4,t>>4,n>>4),i),this.lastKey=-1}i[((n&15)*16+(t&15))*16+(e&15)]=r}chunkCells(e,t,n){return this.chunks.get(An(e,t,n))}hasChunk(e,t,n){return this.chunks.has(An(e,t,n))}forEachChunk(e){for(let t of this.chunks.keys()){let n=t%1024-kn,r=Math.floor(t/1024)%1024-kn;e(Math.floor(t/1048576)-kn,r,n)}}get chunkCount(){return this.chunks.size}ci(e){return Math.floor(e/U)}at(e,t,n){return this.get(Math.floor(e/U),Math.floor(t/U),Math.floor(n/U))}fill(e,t,n,r,i,a,o){let s=Math.round(e/U),c=Math.round(r/U),l=Math.round(t/U),u=Math.round(i/U),d=Math.round(n/U),f=Math.round(a/U);for(let e=d;e<f;e++)for(let t=l;t<u;t++)for(let n=s;n<c;n++)this.set(n,t,e,o)}},Mn=(e,t,n)=>({x:e,z:t,hx:n,hz:n,round:!0}),Nn=(e,t,n,r)=>({x:e,z:t,hx:n,hz:r,round:!1});function Pn(e,t,n,r,i){if(e.round){let a=Math.min(Math.max(e.x,t),r),o=Math.min(Math.max(e.z,n),i);return(e.x-a)**2+(e.z-o)**2<e.hx*e.hx}return e.x-e.hx<r&&e.x+e.hx>t&&e.z-e.hz<i&&e.z+e.hz>n}var Fn=Array.from({length:8},(e,t)=>[Math.cos(t*Math.PI/4),Math.sin(t*Math.PI/4)]);function In(e){let t=[[e.x,e.z]];if(e.round)for(let[n,r]of Fn)t.push([e.x+n*e.hx,e.z+r*e.hx]);else for(let[n,r]of[[-1,-1],[1,-1],[1,1],[-1,1],[0,-1],[1,0],[0,1],[-1,0]])t.push([e.x+n*e.hx,e.z+r*e.hz]);return t}function Ln(e,t,n,r,i,a,o){let s=0,c=1,l=(e,t,n,r)=>{if(Math.abs(t)<1e-12)return e>n&&e<r;let i=(n-e)/t,a=(r-e)/t;return i>a&&([i,a]=[a,i]),i>s&&(s=i),a<c&&(c=a),s<=c};return!l(e,r,o.x0,o.x1)||!l(t,i,o.y0,o.y1)||!l(n,a,o.z0,o.z1)?1/0:s}var Rn=e=>typeof e==`function`?e:t=>t===e,zn=class{def;lo;hi;constructor(e){this.def=e,this.lo=Math.min(...e.h),this.hi=Math.max(...e.h)}has(e,t){let n=this.def;if(!n.mask)return!0;let r=Math.min(Math.max(Math.floor((e-n.x0)/n.res),0),n.nx-2),i=Math.min(Math.max(Math.floor((t-n.z0)/n.res),0),n.nz-2);return n.mask[i*(n.nx-1)+r]===1}heightAt(e,t){let n=this.def,r=Math.min(Math.max((e-n.x0)/n.res,0),n.nx-1-1e-9),i=Math.min(Math.max((t-n.z0)/n.res,0),n.nz-1-1e-9),a=Math.floor(r),o=Math.floor(i),s=r-a,c=i-o,l=n.h,u=n.nx;return l[o*u+a]*(1-s)*(1-c)+l[o*u+a+1]*s*(1-c)+l[(o+1)*u+a]*(1-s)*c+l[(o+1)*u+a+1]*s*c}extremeUnder(e){let t=this.def,n=t.kind===`floor`?-1/0:1/0;for(let[r,i]of In(e)){let e=Math.min(Math.max(r,t.x0),t.x1),a=Math.min(Math.max(i,t.z0),t.z1);if(t.mask&&!this.has(e,a))continue;let o=this.heightAt(e,a);n=t.kind===`floor`?Math.max(n,o):Math.min(n,o)}return n}},Bn=1e-6,Vn=class e{def;grid=new jn;rooms;blocks;surfaces;water;dyn=[];ids=0;boxes=new Map;static B=2;constructor(e){this.def=e,this.rooms=e.rooms,this.blocks=e.blocks,this.surfaces=e.surfaces.map(e=>new zn(e)),this.water=e.water;for(let t of e.rooms){let e=t.cells;if(!e){this.grid.fill(t.x0,t.y0,t.z0,t.x1,t.y0+t.ht,t.z1,t.id);continue}for(let n=0;n<e.nz;n++)for(let r=0;r<e.nx;r++){let i=n*e.nx+r;e.lo[i]<e.hi[i]&&this.grid.fill(t.x0+r*e.res,e.lo[i],t.z0+n*e.res,t.x0+(r+1)*e.res,e.hi[i],t.z0+(n+1)*e.res,t.id)}}e.blocks.forEach((e,t)=>this.grid.fill(e.x0,e.y0,e.z0,e.x1,e.y1,e.z1,On(t)));for(let t of e.props){if(!t.solid||t.loose)continue;let e=Math.abs(Math.cos(t.ry)),n=Math.abs(Math.sin(t.ry)),r=(t.sx*e+t.sz*n)/2,i=(t.sx*n+t.sz*e)/2;this.addBox({x0:t.x-r,y0:t.y,z0:t.z-i,x1:t.x+r,y1:t.y+t.sy,z1:t.z+i,...t.mat?{mat:t.mat}:{}})}for(let t of e.colliders)this.addBox(t)}bkey(e,t){return(t+32768)*65536+(e+32768)}addBox(t){let n=e.B;for(let e=Math.floor(t.z0/n);e<=Math.floor(t.z1/n);e++)for(let r=Math.floor(t.x0/n);r<=Math.floor(t.x1/n);r++){let n=this.bkey(r,e),i=this.boxes.get(n);i||this.boxes.set(n,i=[]),i.push(t)}}boxesNear(t,n){let r=e.B,i=Math.floor((t.z-t.hz)/r),a=Math.floor((t.z+t.hz)/r),o=Math.floor((t.x-t.hx)/r),s=Math.floor((t.x+t.hx)/r);if(i===a&&o===s){let e=this.boxes.get(this.bkey(o,i));if(e)for(let r of e)Pn(t,r.x0,r.z0,r.x1,r.z1)&&n(r);return}let c=new Set;for(let e=i;e<=a;e++)for(let r=o;r<=s;r++){let i=this.boxes.get(this.bkey(r,e));if(i)for(let e of i)c.has(e)||(c.add(e),Pn(t,e.x0,e.z0,e.x1,e.z1)&&n(e))}}dynNear(e,t,n){let r=t===null?null:typeof t==`function`?t:null,i=e.x-e.hx,a=e.x+e.hx,o=e.z-e.hz,s=e.z+e.hz;for(let c of this.dyn)c.x1<i||c.x0>a||c.z1<o||c.z0>s||(r?r(c):c===t)||Pn(e,c.x0,c.z0,c.x1,c.z1)&&n(c)}surfacesNear(e,t){for(let n of this.surfaces)Pn(e,n.def.x0,n.def.z0,n.def.x1,n.def.z1)&&t(n)}columns(e,t){for(let n=Math.floor((e.z-e.hz)/U);n<=Math.floor((e.z+e.hz)/U);n++)for(let r=Math.floor((e.x-e.hx)/U);r<=Math.floor((e.x+e.hx)/U);r++)Pn(e,r*.25,n*.25,(r+1)*.25,(n+1)*.25)&&t(r,n)}newId(){return++this.ids}forEachBox(e){let t=new Set;for(let n of this.boxes.values())for(let r of n)t.has(r)||(t.add(r),e(r))}solidAt(e,t,n){if(this.grid.at(e,t,n)<0)return!0;let r={x:e,z:n,hx:1e-4,hz:1e-4,round:!1};return this.overlap(r,t-1e-4,t+1e-4)!==null}overlap(e,t,n,r=null){let i=this.grid,a=Math.floor(t/U),o=Math.floor((n-Bn)/U),s=null;return this.columns(e,(e,t)=>{if(!s){for(let n=a;n<=o;n++)if(i.get(e,n,t)<0){s=`world`;return}}}),s||(this.boxesNear(e,e=>{e.y0<n&&e.y1>t&&(s=`world`)}),s)||(this.surfacesNear(e,r=>{if(s)return;let i=r.extremeUnder(e),a=r.def;(a.kind===`floor`?i>t+Bn&&a.base<n:i<n-Bn&&a.base>t)&&(s=`world`)}),s)||this.dynNear(e,r,e=>{!s&&e.y0<n&&e.y1>t&&(s=e)}),s}groundBelow(e,t,n=null){let r=this.grid,i=Math.floor(t/U+Bn)-1,a=-1/0;this.columns(e,(e,n)=>{if(!(r.get(e,i+1,n)<0&&(i+1)*.25<t-Bn)){for(let t=i,o=0;o<4096;t--,o++)if(r.get(e,t,n)<0){a=Math.max(a,(t+1)*U);return}}});let o=e=>{e<=t+Bn&&e>a&&(a=e)};return this.boxesNear(e,e=>o(e.y1)),this.dynNear(e,n,e=>o(e.y1)),this.surfacesNear(e,n=>{if(n.def.kind!==`floor`)return;let r=n.extremeUnder(e);r<=t+Bn&&r>a&&(a=r)}),a}ceilingAbove(e,t,n=null,r=1/0){let i=this.grid,a=Math.ceil(t/U-Bn),o=Math.min(4096,Math.ceil((r-t)/U)+1),s=1/0;this.columns(e,(e,t)=>{for(let n=a,r=0;r<o;n++,r++)if(i.get(e,n,t)<0){s=Math.min(s,n*U);return}});let c=e=>{e>=t-Bn&&e<s&&(s=e)};return this.boxesNear(e,e=>c(e.y0)),this.dynNear(e,n,e=>c(e.y0)),this.surfacesNear(e,n=>{if(n.def.kind!==`ceiling`)return;let r=n.extremeUnder(e);r>=t-Bn&&r<s&&(s=r)}),s}sweep(e,t,n,r,i,a=null){let o=t=>({...e,x:e.x+r*t,z:e.z+i*t}),s=Math.hypot(r,i),c=Math.max(.05,Math.min(e.hx,e.hz)*.5),l=Math.max(1,Math.ceil(s/c)),u=0;for(let e=1;e<=l;e++){let r=e/l;if(this.overlap(o(r),t,n,a)){let e=u,i=r;for(let r=0;r<8;r++){let r=(e+i)/2;this.overlap(o(r),t,n,a)?i=r:e=r}return e}u=r}return 1}pushOut(e,t,n,r=null){if(!this.overlap(e,t,n,r))return null;for(let i of[.02,.05,.1,.2,.35,.5,.75]){if(!this.overlap(e,t+i,n+i,r))return[0,i,0];for(let a=0;a<8;a++){let o=Math.cos(a*Math.PI/4)*i,s=Math.sin(a*Math.PI/4)*i;if(!this.overlap({...e,x:e.x+o,z:e.z+s},t,n,r))return[o,0,s]}}return null}raycast(t,n,r,i,a,o,s=null){let c=i-t,l=a-n,u=o-r,d=this.gridRay(t,n,r,c,l,u),f=e.B,p=Math.max(1,Math.ceil(Math.hypot(c,u)/(f/4))),m=new Set;for(let e=0;e<=p;e++){let i=t+c*e/p,a=r+u*e/p,o=this.boxes.get(this.bkey(Math.floor(i/f),Math.floor(a/f)));if(o)for(let e of o)m.has(e)||(m.add(e),d=Math.min(d,Ln(t,n,r,c,l,u,e)))}let h=Rn(s);for(let e of this.dyn)h(e)||(d=Math.min(d,Ln(t,n,r,c,l,u,e)));for(let e of this.surfaces)d=Math.min(d,this.surfaceRay(e,t,n,r,c,l,u,d));return Math.min(1,d)}gridClear(e,t,n,r,i,a){return this.gridRay(e,t,n,r-e,i-t,a-n)>=1}gridRay(e,t,n,r,i,a){let o=this.grid,s=[e/U,t/U,n/U],c=[r/U,i/U,a/U],l=s.map(Math.floor),u=c.map(Math.sign),d=c.map((e,t)=>e===0?1/0:((e>0?l[t]+1:l[t])-s[t])/e),f=c.map(e=>e===0?1/0:Math.abs(1/e));if(o.get(l[0],l[1],l[2])<0)return 0;for(let e=0;e<1e5;e++){let e=d[0]<d[1]?d[0]<d[2]?0:2:d[1]<d[2]?1:2,t=d[e];if(t>1)return 1/0;if(l[e]+=u[e],d[e]+=f[e],o.get(l[0],l[1],l[2])<0)return t}return 1/0}surfaceRay(e,t,n,r,i,a,o,s){let c=e.def,l=s=>{let l=t+i*s,u=r+o*s;if(l<c.x0||l>c.x1||u<c.z0||u>c.z1||!e.has(l,u))return!1;let d=n+a*s,f=e.heightAt(l,u);return c.kind===`floor`?d<f&&d>c.base:d>f&&d<c.base},u=Math.max(1,Math.ceil(Math.hypot(i,a,o)*Math.min(1,s)/.1)),d=0;for(let e=0;e<=u;e++){let t=e/u*Math.min(1,s);if(l(t)){if(e===0)return 0;let n=d,r=t;for(let e=0;e<10;e++){let e=(n+r)/2;l(e)?r=e:n=e}return r}d=t}return 1/0}waterAt(e,t){let n=-1/0;for(let r of this.water)e>=r.x0&&e<r.x1&&t>=r.z0&&t<r.z1&&r.level>n&&(n=r.level);return n}neighbours(e){let t=this.rooms[e],n=new Set,r=this.grid;for(let i of[t.y0+.3,t.y0+1.2])for(let a=t.x0+U/2;a<t.x1;a+=U)for(let o of[t.z0-U/2,t.z1+U/2]){let t=r.at(a,i,o);t>=0&&t!==e&&n.add(t)}for(let i of[t.y0+.3,t.y0+1.2])for(let a=t.z0+U/2;a<t.z1;a+=U)for(let o of[t.x0-U/2,t.x1+U/2]){let t=r.at(o,i,a);t>=0&&t!==e&&n.add(t)}return[...n]}roomAt(e,t,n){let r=this.grid.at(e,t,n);return r>=0?this.rooms[r]:null}solidMat(e,t,n,r,i,a){let o={x:e,z:n,hx:.06,hz:.06,round:!1},s=null,c=e=>{e.mat&&t>e.y0-.06&&t<e.y1+.06&&(s=e.mat)};if(this.boxesNear(o,c),this.dynNear(o,null,c),s)return s;let l=e-r,u=t-i,d=n-a,f=Math.hypot(l,u,d)||1,p=this.grid.at(e+l/f*.05,t+u/f*.05,n+d/f*.05);return p<=-2?this.blocks[-2-p].mat:this.roomAt(e-l/f*.15,t-u/f*.15,n-d/f*.15)?.mat.wall??`rock`}floorMat(e,t,n,r=null){if(r)return r.mat??`concrete`;let i={x:e,z:n,hx:1e-4,hz:1e-4,round:!1},a=null,o=e=>{e.mat&&Math.abs(e.y1-t)<.05&&(a=e.mat)};if(this.boxesNear(i,o),this.dynNear(i,null,o),a)return a;for(let r of this.surfaces){let i=r.def;if(!(i.kind!==`floor`||i.hidden||e<i.x0||e>i.x1||n<i.z0||n>i.z1||!r.has(e,n))&&Math.abs(r.heightAt(e,n)-t)<.25)return i.mat}return this.roomAt(e,t+.3,n)?.mat.floor??`concrete`}},Hn=2*U,Un=U/2,Wn=8,Gn=Wn*Wn*Wn,Kn={r2:9,base:.55,gain:1.3},qn={fade:.9,reach:4,way:.7},Jn={steps:4,up:3,full:.85,pow:1.2},Yn={reach:8,most:14,faint:.004},Xn=1024,Zn=(e,t,n)=>((e+Xn)*2048+(t+Xn))*2048+(n+Xn),Qn=(e,t,n)=>(n+1)*9+(t+1)*3+e+1,$n=1,er=2,tr=16,nr=class{w;slots;bpos;nb;pid;flags;room;pslot;n;sources=[];roomSource;doors;fixtures=new Map;slotOf=new Map;gateOf=new Map;constructor(e){this.w=e;let t=e.grid,n=[];t.forEachChunk((e,t,r)=>n.push([e,t,r]));for(let[e,t,r]of n)this.addSlot(e,t,r);for(let[e,t,r]of n)for(let n=-1;n<=0;n++)for(let i=-1;i<=0;i++)for(let a=-1;a<=0;a++)this.addSlot(e+a,t+i,r+n);let r=this.slots=this.slotOf.size;this.bpos=new Int32Array(r*3);for(let[e,t]of this.slotOf)this.bpos[t*3]=Math.floor(e/4194304)-Xn,this.bpos[t*3+1]=Math.floor(e/2048)%2048-Xn,this.bpos[t*3+2]=e%2048-Xn;this.nb=new Int32Array(r*27);for(let e=0;e<r;e++)for(let t=-1;t<=1;t++)for(let n=-1;n<=1;n++)for(let r=-1;r<=1;r++)this.nb[e*27+Qn(r,n,t)]=this.slotOf.get(Zn(this.bpos[e*3]+r,this.bpos[e*3+1]+n,this.bpos[e*3+2]+t))??-1;let i=new Uint8Array(r*Gn),a=new Uint8Array(r*Gn);for(let t of e.def.props)t.mat!==`glass`&&this.stamp(t,i,a);this.pid=new Int32Array(r*Gn).fill(-1),this.flags=new Uint8Array(r*Gn),this.room=new Int16Array(r*Gn).fill(-1);let o=0;for(let n=0;n<r;n++){let r=this.bpos[n*3],a=this.bpos[n*3+1],s=this.bpos[n*3+2],c=t.chunkCells(r,a,s);if(!c)continue;let l=r*16*U,u=a*16*U,d=s*16*U,f=16*U,p=e.surfaces.filter(e=>e.def.x1>=l&&e.def.x0<=l+f&&e.def.z1>=d&&e.def.z0<=d+f);for(let e=0;e<Gn;e++){let t=e&7,r=e>>3&7,a=e>>6,s=c[(2*a*16+2*r)*16+2*t];if(s<0||i[n*Gn+e])continue;if(p.length){let e=l+t*Hn+Un,n=u+r*Hn+Un,i=d+a*Hn+Un;if(p.some(t=>{let r=t.def;if(e<r.x0||e>r.x1||i<r.z0||i>r.z1||!t.has(e,i))return!1;let a=t.heightAt(e,i);return r.kind===`floor`?n<a&&n>r.base:n>a&&n<r.base}))continue}let f=n*Gn+e;this.pid[f]=o++,this.flags[f]=$n,this.room[f]=s}}this.n=o,this.pslot=new Int32Array(o);for(let e=0;e<r;e++){let n=t.chunkCells(this.bpos[e*3],this.bpos[e*3+1],this.bpos[e*3+2]);if(n)for(let t=0;t<Gn;t++){let r=e*Gn+t;if(!this.flags[r])continue;this.pslot[this.pid[r]]=e;let i=t&7,o=t>>3&7,s=t>>6;for(let e=0;e<3;e++){let t=this.step(r,e,1);if(t<0||!this.flags[t]||a[r]&1<<e)continue;let c=2*i+ +(e===0),l=2*o+ +(e===1);n[((2*s+ +(e===2))*16+l)*16+c]>=0&&(this.flags[r]|=er<<e)}}}e.def.doors.forEach((e,t)=>{if(e.glass)return;let n=e=>Math.floor((e-Un)/Hn),r=[e.x0,e.y0,e.z0],i=[e.x1,e.y1,e.z1];for(let a=n(e.z0)-1;a<=n(e.z1)+1;a++)for(let o=n(e.y0)-1;o<=n(e.y1)+1;o++)for(let s=n(e.x0)-1;s<=n(e.x1)+1;s++){let e=this.point(s,o,a);if(e<0)continue;let n=[s*Hn+Un,o*Hn+Un,a*Hn+Un];for(let a=0;a<3;a++){if(!(this.flags[e]&er<<a))continue;let o=Math.max(n[a],r[a])<Math.min(n[a]+Hn,i[a]);for(let e=0;e<3&&o;e++)e!==a&&(n[e]<r[e]||n[e]>i[e])&&(o=!1);o&&(this.flags[e]|=tr<<a,this.gateOf.set(e*3+a,t))}}}),this.roomSource=new Int32Array(e.rooms.length).fill(-1),this.doors=e.def.doors.map(()=>({src:new Int32Array,pts:new Int32Array,val:new Float32Array,dir:new Int8Array})),this.build()}stamp(e,t,n){let r=this.w;if(e.loose||e.glow>1||e.colour[0]>1.5||e.pw||Math.max(e.sx,e.sy,e.sz)<.12)return;let i=r.roomAt(e.x,e.y+e.sy/2,e.z);if(e.sy<.15&&i&&e.y+e.sy>i.y0+i.ht-.12)return;let a=Math.max(e.sx/2,.07),o=Math.max(e.sy/2,.07),s=Math.max(e.sz/2,.07),c=e.x,l=e.y+e.sy/2,u=e.z,d=Math.cos(e.ry),f=Math.sin(e.ry),p=Math.cos(e.rz),m=Math.sin(e.rz),h=[p*d/a,m/a,-p*f/a],g=[-m*d/o,p/o,m*f/o],_=[f/s,0,d/s],v=(t,n,r)=>e.shape===`box`?Math.abs(t)<=1&&Math.abs(n)<=1&&Math.abs(r)<=1:e.shape===`cyl`?t*t+r*r<=1&&Math.abs(n)<=1:t*t+n*n+r*r<=1,y=[0,1,2].map(e=>{let t=e===0?p*d:e===1?m:-p*f,n=e===0?-m*d:e===1?p:m*f,r=e===0?f:e===1?0:d;return Math.abs(t)*a+Math.abs(n)*o+Math.abs(r)*s}),b=(e,t)=>Math.floor((e-t-Un)/Hn)-1,x=(e,t)=>Math.ceil((e+t-Un)/Hn);for(let e=b(u,y[2]);e<=x(u,y[2]);e++)for(let r=b(l,y[1]);r<=x(l,y[1]);r++){let i=-1,a=NaN;for(let o=b(c,y[0]);o<=x(c,y[0]);o++){if(o>>3!==a&&(a=o>>3,i=this.slot(a,r>>3,e>>3)),i<0)continue;let s=i*Gn+((e&7)*Wn+(r&7))*Wn+(o&7),d=o*Hn+Un-c,f=r*Hn+Un-l,p=e*Hn+Un-u,m=h[0]*d+h[1]*f+h[2]*p,y=g[0]*d+g[1]*f+g[2]*p,b=_[0]*d+_[1]*f+_[2]*p;if(v(m,y,b)){t[s]=1;continue}for(let e=0;e<3;e++)for(let t=1;t<=3;t++){let r=t/4*Hn;if(v(m+h[e]*r,y+g[e]*r,b+_[e]*r)){n[s]|=1<<e;break}}}}}addSlot(e,t,n){let r=Zn(e,t,n);this.slotOf.has(r)||this.slotOf.set(r,this.slotOf.size)}point(e,t,n){let r=this.slotOf.get(Zn(e>>3,t>>3,n>>3));return r===void 0?-1:r*Gn+((n&7)*Wn+(t&7))*Wn+(e&7)}slot(e,t,n){return this.slotOf.get(Zn(e,t,n))??-1}step(e,t,n){let r=e>>9,i=e&511,a=i&7,o=i>>3&7,s=i>>6;return t===0?a+=n:t===1?o+=n:s+=n,this.local(r,a,o,s)}local(e,t,n,r){if(t<0||t>7||n<0||n>7||r<0||r>7){let i=t<0?-1:+(t>7),a=n<0?-1:+(n>7),o=r<0?-1:+(r>7);if(e=this.nb[e*27+Qn(i,a,o)],e<0)return-1;t-=i*Wn,n-=a*Wn,r-=o*Wn}return e*Gn+(r*Wn+n)*Wn+t}join(e,t,n){let r=n>0?e:this.step(e,t,-1);if(r<0)return-2;let i=this.flags[r];return i&er<<t?i&tr<<t?this.gateOf.get(r*3+t):-1:-2}vis=new Float32Array(1);visDoor=new Int32Array(1);reachL=new Int32Array(1);shine(e,t,n,r,i,a){let o=e=>Math.round((e-Un)/Hn),s=o(e),c=o(n),l=Math.floor((t-Un)/Hn),u=this.point(s,l,c);if((u<0||!this.flags[u])&&(l++,u=this.point(s,l,c)),u<0||!this.flags[u])return;let d=Math.ceil(r/Hn),f=2*d+1,p=f*f*f;this.vis.length<p&&(this.vis=new Float32Array(p),this.visDoor=new Int32Array(p),this.reachL=new Int32Array(p));let m=this.vis,h=this.visDoor,g=this.reachL;m.fill(0,0,p),g.fill(-1,0,p);let _=(e,t,n)=>((n+d)*f+(t+d))*f+(e+d);for(let e=c-d>>3;e<=c+d>>3;e++)for(let t=l-d>>3;t<=l+d>>3;t++)for(let n=s-d>>3;n<=s+d>>3;n++){let r=this.slot(n,t,e);if(!(r<0))for(let i=Math.max(c-d,e*Wn);i<=Math.min(c+d,e*Wn+7);i++)for(let e=Math.max(l-d,t*Wn);e<=Math.min(l+d,t*Wn+7);e++)for(let t=Math.max(s-d,n*Wn);t<=Math.min(s+d,n*Wn+7);t++){let n=r*Gn+((i&7)*Wn+(e&7))*Wn+(t&7);this.flags[n]&&(g[_(t-s,e-l,i-c)]=n)}}let v=[[1],[-1,1]],y=[[1],[-1]],b=[0,0,0],x=[0,0,0],S=[0,0,0];for(let r=0;r<=d;r++)for(let o=0;o<=d;o++)for(let u=0;u<=d;u++)for(let d of v[+!!r])for(let f of(i?y:v)[+!!o])for(let i of v[+!!u]){let p=d*r,v=f*o,y=i*u,C=_(p,v,y),w=g[C];if(w<0)continue;let T=(s+p)*Hn+Un,E=(l+v)*Hn+Un,D=(c+y)*Hn+Un,O=0,k=-1,A=0;if(!r&&!o&&!u)O=1;else{b[0]=r?Math.abs(T-e):0,b[1]=o?Math.abs(E-t):0,b[2]=u?Math.abs(D-n):0;let a=b[0]+b[1]+b[2];if(a<=0)continue;x[0]=d,x[1]=f,x[2]=i,S[0]=_(p-d,v,y),S[1]=_(p,v-f,y),S[2]=_(p,v,y-i);for(let e=0;e<3;e++){if(!b[e]||!m[S[e]])continue;let t=this.join(g[S[e]],e,x[e]),n=h[S[e]];if(t===-2||t>=0&&n>=0&&n!==t)continue;let r=b[e]/a*m[S[e]];O+=r,r>A&&(A=r,k=t>=0?t:n)}}O<=.01||(m[C]=O,h[C]=k,a(w,T,E,D,O,k))}}shading(){let e=Jn,t=new Float32Array(this.n),n=new Uint8Array(this.flags.length*6).fill(255),r=(t,i)=>{let a=t*6+i;if(n[a]!==255)return n[a];let o=0;return this.join(t,i>>1,i&1?-1:1)!==-2&&(o=Math.min(e.steps,1+r(this.step(t,i>>1,i&1?-1:1),i))),n[a]=o},i=5+e.up;for(let n=0;n<this.flags.length;n++){if(!this.flags[n])continue;let a=0;for(let t=0;t<6;t++)a+=r(n,t)/e.steps*(t===2?e.up:1);t[this.pid[n]]=Math.min(1,a/i/e.full)**e.pow}return t}glow(e,t,n,r,i){let a=[],o=[],s=[],c=this.openOf([e,t,n],[e,t+.1,n],[e,t+.3,n]);if(c){let[e,t,n]=c;this.shine(e,t,n,r,!1,(c,l,u,d,f,p)=>{let m=Math.sqrt((l-e)**2+(u-t)**2+(d-n)**2);if(p>=0||m>=r)return;let h=f*i(m);if(h<=1e-4)return;a.push(this.pid[c]),o.push(h);let g=m>.001?127/m:0;s.push(Math.round((e-l)*g),Math.round((t-u)*g),Math.round((n-d)*g))})}return{pts:Int32Array.from(a),val:Float32Array.from(o),dir:Int8Array.from(s)}}openOf(...e){return e.find(([e,t,n])=>this.w.grid.at(e,t,n)>=0)??null}build(){let e=this.w,t=this.n,n=e.rooms,r=this.room,i=new Set;for(let t of e.def.lamps){let n=e.roomAt(t.x,t.y,t.z)??e.roomAt(t.x,t.y+.1,t.z)??e.roomAt(t.x,t.y+1,t.z);n&&i.add(n.id)}for(let t of e.def.fixtures??[]){let n=e.roomAt(t.x,t.y-.3,t.z);if(!n||i.has(n.id)||n.doorway)continue;let r=this.fixtures.get(n.id);r||this.fixtures.set(n.id,r=[]),r.push(t)}let a=n.map(()=>[]);for(let e=0;e<this.flags.length;e++)this.flags[e]&&a[r[e]].push(e);let o=new Float64Array(this.flags.length).fill(1/0),s=new Int32Array(this.flags.length),c=new Int32Array(this.flags.length),l=new rr,u=n.map(()=>({pts:[],d:[],door:[],seed:[]})),d=new Float32Array(t),f=this.bpos,p=e=>f[(e>>9)*3]*Wn+(e&7),m=e=>f[(e>>9)*3+1]*Wn+(e>>3&7),h=e=>f[(e>>9)*3+2]*Wn+(e>>6&7),g=e=>!e.doorway;for(let e of n){if(!g(e))continue;let t=e.id,n=u[t],i=[];for(let e of a[t]){d[this.pid[e]]+=1;edge:for(let n=0;n<3;n++)for(let a=-1;a<=1;a+=2)if(this.join(e,n,a)!==-2&&r[this.step(e,n,a)]!==t){o[e]=0,s[e]=e,c[e]=-1,i.push(e),l.push(e,0);break edge}}for(;l.size;){let e=l.top,n=l.pop();if(e>o[n])continue;let a=s[n],u=p(a),d=m(a),f=h(a);for(let e=0;e<3;e++)for(let g=-1;g<=1;g+=2){let _=this.join(n,e,g);if(_===-2||_>=0&&c[n]>=0&&c[n]!==_)continue;let v=this.step(n,e,g);if(r[v]===t)continue;let y=p(v)-u,b=m(v)-d,x=h(v)-f,S=Math.sqrt(y*y+b*b+x*x)*Hn;S>qn.reach||S>=o[v]||(o[v]===1/0&&i.push(v),o[v]=S,s[v]=a,c[v]=_>=0?_:c[n],l.push(v,S))}}for(let e of i)r[e]!==t&&(n.pts.push(e),n.d.push(o[e]),n.door.push(c[e]),n.seed.push(s[e]),d[this.pid[e]]+=Math.exp(-o[e]/qn.fade)),o[e]=1/0}let _=this.shading(),v=new Float32Array(t),y=new Uint8Array(t),b=new Float32Array(t),x=new Float32Array(t),S=new Int32Array(t).fill(-1),C=new Float32Array(t*3),w=new Float32Array(t*3),T=new Map,E=new Map,D=new Int32Array(t),O=new Float32Array(t),k=new Int8Array(t*3),A=new Int32Array(this.slots),j=new Uint8Array(this.slots),ee=this.doors.map(()=>({src:[],pts:[],val:[],dir:[]})),M=(e,t)=>Math.max(-127,Math.min(127,Math.round(e/t*127))),te=(e,t,n)=>{let r=0,i=0;for(let e of n){if(v[e]>1e-4){D[r]=e,O[r]=v[e];for(let t=0;t<3;t++)k[r*3+t]=M(C[e*3+t],v[e]);r++;let t=this.pslot[e];j[t]||(j[t]=1,A[i++]=t)}v[e]=0,y[e]=0,b[e]=0,x[e]=0,S[e]=-1,C.fill(0,e*3,e*3+3),w.fill(0,e*3,e*3+3)}for(let e=0;e<i;e++)j[A[e]]=0;let a=this.sources.length,o=[],s=[],c=[],l=[];for(let[e,t]of T){if(t<=1e-4)continue;let n=Math.floor(e/4096),r=e%4096,i=E.get(e).map(e=>M(e,t));o.push(n),s.push(t),c.push(...i),l.push(r),ee[r].src.push(a),ee[r].pts.push(n),ee[r].val.push(t),ee[r].dir.push(...i)}T.clear(),E.clear(),this.sources.push({room:e,lamp:t,pts:D.slice(0,r),val:O.slice(0,r),dir:k.slice(0,r*3),slots:A.slice(0,i),gpts:Int32Array.from(o),gval:Float32Array.from(s),gdir:Int8Array.from(c),gdoor:Int32Array.from(l)})},ne=(e,t,n,r,i=0,a=0,o=0)=>{if(n<0)y[e]||(y[e]=1,r.push(e)),v[e]+=t,C[e*3]+=t*i,C[e*3+1]+=t*a,C[e*3+2]+=t*o;else{let r=e*4096+n,s=E.get(r)??[0,0,0];T.set(r,(T.get(r)??0)+t),s[0]+=t*i,s[1]+=t*a,s[2]+=t*o,E.set(r,s)}};for(let e of n){if(!g(e)||e.lit===`none`)continue;let t=e.id,n=this.fixtures.get(t),r=n?Kn.base:1,i=[];for(let e of a[t]){let t=this.pid[e];ne(t,r*_[t]/d[t],-1,i)}let o=u[t];for(let e=0;e<o.pts.length;e++){let t=o.pts[e],n=o.seed[e],a=this.pid[t],s=p(n)-p(t),c=m(n)-m(t),l=h(n)-h(t),u=Math.hypot(s,c,l),f=u>0?qn.way/u:0;ne(a,r*_[a]*Math.exp(-o.d[e]/qn.fade)/d[a],o.door[e],i,s*f,c*f,l*f)}if(n){let t=[];for(let r of n){let n=this.openOf([r.x,r.y-.1,r.z],[r.x,r.y-.3,r.z]);if(!n)continue;let[i,a,o]=n;this.shine(i,a,o,Math.min(Yn.most,Math.max(Yn.reach,a-e.y0+2)),!0,(e,n,r,s,c,l)=>{let u=n-i,d=a-r,f=s-o;if(d<=0)return;let p=u*u+d*d+f*f,m=Math.sqrt(p),h=d/m,g=c*h*h*h*Kn.r2/(Kn.r2+p);if(g<Yn.faint)return;let _=this.pid[e];b[_]||t.push(_),b[_]+=g,w[_*3]-=g*u/m,w[_*3+1]+=g*d/m,w[_*3+2]-=g*f/m,l>=0&&(S[_]<0||S[_]===l)&&(S[_]=l,x[_]+=g)})}for(let e of t){let t=Kn.gain*Math.min(b[e],1),n=x[e]/b[e],r=b[e],a=w[e*3]/r,o=w[e*3+1]/r,s=w[e*3+2]/r;ne(e,t*(1-n),-1,i,a,o,s),n>0&&ne(e,t*n,S[e],i,a,o,s)}}this.roomSource[t]=this.sources.length,te(t,-1,i)}e.def.lamps.forEach((e,t)=>{let n=this.openOf([e.x,e.y,e.z],[e.x,e.y+.1,e.z],[e.x,e.y+.3,e.z],[e.x,e.y+1,e.z]),r=[];if(n){let[t,i,a]=n,o=e.r;this.shine(t,i,a,o,!1,(e,n,s,c,l,u)=>{let d=Math.sqrt((n-t)**2+(s-i)**2+(c-a)**2),f=d>.001?1/d:0;d<o&&ne(this.pid[e],l*(1-d/o),u,r,(t-n)*f,(i-s)*f,(a-c)*f)})}te(-1,t,r)}),this.doors.forEach((e,t)=>{let n=ee[t];this.doors[t]={src:Int32Array.from(n.src),pts:Int32Array.from(n.pts),val:Float32Array.from(n.val),dir:Int8Array.from(n.dir)}})}},rr=class{k=[];v=[];get size(){return this.k.length}get top(){return this.v[0]}push(e,t){let n=this.k,r=this.v,i=n.length;for(n.push(e),r.push(t);i>0;){let e=i-1>>1;if(r[e]<=t)break;n[i]=n[e],r[i]=r[e],i=e}n[i]=e,r[i]=t}pop(){let e=this.k,t=this.v,n=e[0],r=e.pop(),i=t.pop(),a=e.length;if(a){let n=0;for(;;){let r=2*n+1;if(r>=a||(r+1<a&&t[r+1]<t[r]&&r++,t[r]>=i))break;e[n]=e[r],t[n]=t[r],n=r}e[n]=r,t[n]=i}return n}},ir=new WeakMap;function ar(e){let t=ir.get(e.def);return t||ir.set(e.def,t=new nr(e)),t}function or(e,t,n,r=0){let i=e[n];return i?(!i.on||i.broken?0:i.feed?r<8?or(e,t,i.feed,r+1):0:t?2:0)||+!!i.back:0}var sr=[1,.68,.45];function cr(e,t){if(e.lit===`always`)return e.lc;if(e.lit===`none`)return u;let n=t(e.circuit);if(n===2)return e.lc;if(n===0&&e.batt&&t(e.batt.watch)===0&&t(e.batt.supply)>0)return e.batt.colour;if(n!==1||!e.em)return u;let r=[e.lc[0]*sr[0],e.lc[1]*sr[1],e.lc[2]*sr[2]],i=Math.max(...r);return i>0?l(r,.4*Math.max(...e.lc)/i):u}var lr={colour:[1,.93,.78],gain:2.3,fall:.055,hot:[.91,.975],spill:[.76,.92],rim:.952,rimW:.007};function ur(e){let t=(t,n)=>{let r=Math.min(1,Math.max(0,(e-t)/(n-t)));return r*r*(3-2*r)},n=(e-lr.rim)/lr.rimW;return .65*t(lr.hot[0],lr.hot[1])+.42*t(lr.spill[0],lr.spill[1])+.12*Math.exp(-n*n)}var dr={colour:[1,.9,.76],gain:.16,hit:.3,reach:8,fall:.18},fr={colour:[.72,.92,1],gain:1.5,fall:.2},pr=6,mr=e=>e.kind===`body`||!!e.glass,hr=[];for(let e=0;e<3;e++)for(let t=0;t<8;t++)t&1<<e||hr.push([t,e]);var gr=e=>.3*e[0]+.59*e[1]+.11*e[2],_r=new Int32Array(8),vr=new Float64Array(8),yr=class{w;power;field;rooms=null;col=null;fcol=null;lit=[];flicks;open;dir=null;loose=new Map;dirty=new Set;epoch=0;constructor(e,t,n,r=[]){this.w=e,this.power=t,this.field=ar(e),this.open=Float32Array.from(e.def.doors,(e,t)=>n?n(t):+!!e.open),this.flicks=Uint8Array.from(this.field.sources,t=>t.room>=0&&e.rooms[t.room].flick?1:0),this.lights(r)}get fixtures(){return this.field.fixtures}colourOf(e){let t=this.field.sources[e];return t.room>=0?cr(this.w.rooms[t.room],this.power):this.w.def.lamps[t.lamp].colour}room(e){if(!this.rooms){let e=this.w,t=e.rooms.map(e=>cr(e,this.power));for(let n of e.rooms){if(!n.doorway)continue;let r=e.neighbours(n.id).filter(t=>!e.rooms[t].doorway);if(!r.length)continue;let i=[0,0,0];for(let e of r)for(let n=0;n<3;n++)i[n]+=t[e][n];t[n.id]=l(i,.8/r.length)}this.rooms=t}return this.rooms[e]??u}get colours(){if(!this.col){let e=this.field;this.col=new Float32Array(e.n*3),this.fcol=new Float32Array(e.n*3),this.lit=e.sources.map(()=>u),this.recolour(e.sources.map((e,t)=>t));for(let e of this.loose.values())this.add(e.pts,e.val,e.dir,e.c,1,!1)}return this.col}get flickers(){return this.colours,this.fcol}get directions(){if(!this.dir){this.colours;let e=this.field,t=this.open,n=this.dir=new Float32Array(e.n*3),r=(e,t,r,i,a)=>{for(let o=0;o<e.length;o++){let s=t[o]*i*(a?a(o):1)/127,c=e[o]*3;n[c]+=r[o*3]*s,n[c+1]+=r[o*3+1]*s,n[c+2]+=r[o*3+2]*s}};e.sources.forEach((e,n)=>{let i=gr(this.lit[n]);i&&(r(e.pts,e.val,e.dir,i),r(e.gpts,e.gval,e.gdir,i,n=>t[e.gdoor[n]]))});for(let e of this.loose.values())r(e.pts,e.val,e.dir,gr(e.c))}return this.dir}add(e,t,n,r,i,a,o){let s=this.col,c=this.fcol,l=this.dir,u=this.field,[d,f,p]=r,m=gr(r)/127;e.length&&this.epoch++;for(let r=0;r<e.length;r++){let h=t[r]*i*(o?o(r):1);if(!h)continue;let g=e[r]*3;if(s[g]+=d*h,s[g+1]+=f*h,s[g+2]+=p*h,a&&(c[g]+=d*h,c[g+1]+=f*h,c[g+2]+=p*h),l){let e=m*h;l[g]+=n[r*3]*e,l[g+1]+=n[r*3+1]*e,l[g+2]+=n[r*3+2]*e}this.dirty.add(u.pslot[e[r]])}}recolour(e){if(!this.col)return;let t=this.field,n=this.open;for(let r of e){let e=this.lit[r],i=this.colourOf(r),a=[i[0]-e[0],i[1]-e[1],i[2]-e[2]];if(this.lit[r]=i,!a[0]&&!a[1]&&!a[2])continue;let o=t.sources[r];this.add(o.pts,o.val,o.dir,a,1,!!this.flicks[r]),this.add(o.gpts,o.gval,o.gdir,a,1,!!this.flicks[r],e=>n[o.gdoor[e]])}}follow(e){let t=this.field;for(let n=0;n<this.open.length;n++){let r=e(n),i=r-this.open[n];if(i===0||Math.abs(i)<.001&&r>0&&r<1||(this.open[n]=r,!this.col))continue;this.epoch++;let a=t.doors[n],o=this.col,s=this.fcol,c=this.dir;for(let e=0;e<a.pts.length;e++){let n=a.src[e],r=this.lit[n],l=a.val[e]*i,d=a.pts[e],f=d*3;if(r!==u){if(o[f]+=r[0]*l,o[f+1]+=r[1]*l,o[f+2]+=r[2]*l,this.flicks[n]&&(s[f]+=r[0]*l,s[f+1]+=r[1]*l,s[f+2]+=r[2]*l),c){let t=gr(r)*l/127;c[f]+=a.dir[e*3]*t,c[f+1]+=a.dir[e*3+1]*t,c[f+2]+=a.dir[e*3+2]*t}this.dirty.add(t.pslot[d])}}}}lights(e){let t=new Map(e.map(e=>[e.key,e]));for(let[e,n]of this.loose){let r=t.get(e);if(r&&(Sr(r,n.L)||xr(r,n.L))){n.L=r,t.delete(e);continue}this.col&&this.add(n.pts,n.val,n.dir,n.c,-1,!1),this.loose.delete(e)}for(let e of t.values()){let t,n,r;if(e.kind===`flash`){let i=this.w.raycast(e.x,e.y,e.z,e.x+e.dx*dr.reach,e.y+e.dy*dr.reach,e.z+e.dz*dr.reach,mr);t=i<1?e.k*dr.gain/(1+dr.hit*(i*dr.reach)**2):0,n=dr.fall,r=dr.colour}else t=e.k*fr.gain,n=fr.fall,r=fr.colour;let{pts:i,val:a,dir:o}=t>0?this.field.glow(e.x,e.y,e.z,pr,e=>t/(1+n*e*e)):{pts:new Int32Array,val:new Float32Array,dir:new Int8Array},s={L:e,pts:i,val:a,dir:o,c:r};this.loose.set(e.key,s),this.col&&this.add(i,a,o,r,1,!1)}}get looseLights(){return[...this.loose.values()].map(e=>e.L)}changed(){let e=[...this.dirty];return this.dirty.clear(),e}atPoint(e,t,n){return this.blend(e,t,n,this.colours)}flickAt(e,t,n){return this.blend(e,t,n,this.flickers)}towards(e,t,n){let r=this.blend(e,t,n,this.directions),i=gr(this.atPoint(e,t,n));return i>1e-5?[r[0]/i,r[1]/i,r[2]/i]:[0,0,0]}seen(e,t,n){let r=[...this.atPoint(e,t,n)];for(let{L:i}of this.loose.values()){if(i.kind!==`flash`)continue;let a=e-i.x,o=t-i.y,s=n-i.z,c=Math.hypot(a,o,s);if(c<.001||c>30)continue;let l=i.k*lr.gain*ur((a*i.dx+o*i.dy+s*i.dz)/c)/(1+lr.fall*c*c);if(!(l<.005||this.w.raycast(i.x,i.y,i.z,e,t,n,mr)<.999))for(let e=0;e<3;e++)r[e]+=lr.colour[e]*l}return r}blend(e,t,n,r){let i=this.field,a=(e-Un)/Hn,o=(t-Un)/Hn,s=(n-Un)/Hn,c=Math.floor(a),l=Math.floor(o),u=Math.floor(s),d=a-c,f=o-l,p=s-u,m=i.slot(c>>3,l>>3,u>>3);if(m<0)return[0,0,0];let h=-1;for(let e=0;e<8;e++){let t=e&1,n=e>>1&1,r=e>>2;_r[e]=i.local(m,(c&7)+t,(l&7)+n,(u&7)+r),vr[e]=(t?d:1-d)*(n?f:1-f)*(r?p:1-p),_r[e]>=0&&i.flags[_r[e]]&&(h<0||vr[e]>vr[h])&&(h=e)}if(h<0)return[0,0,0];let g=1<<h;for(let e=0;e<3;e++)for(let[e,t]of hr){let n=e|1<<t;(g>>e&1)!=(g>>n&1)&&_r[e]>=0&&i.flags[_r[e]]&2<<t&&(g|=1<<e|1<<n)}let _=0,v=0,y=0,b=0;for(let e=0;e<8;e++){if(!(g>>e&1))continue;let t=i.pid[_r[e]]*3;_+=vr[e]*r[t],v+=vr[e]*r[t+1],y+=vr[e]*r[t+2],b+=vr[e]}return b>0?[_/b,v/b,y/b]:[0,0,0]}fitting(e,t){return e[+(this.power(t)>0)]}fittingIn(e,t,n){return this.fitting(e,t)}},br={move:.25,turn:.99},xr=(e,t)=>e.kind===t.kind&&e.k===t.k&&Math.hypot(e.x-t.x,e.y-t.y,e.z-t.z)<br.move&&e.dx*t.dx+e.dy*t.dy+e.dz*t.dz>br.turn,Sr=(e,t)=>e.kind===t.kind&&e.k===t.k&&e.x===t.x&&e.y===t.y&&e.z===t.z&&e.dx===t.dx&&e.dy===t.dy&&e.dz===t.dz,Cr=.3,wr=1,Tr=.5,Er=2.5,Dr=function(e){return e[e.Walk=0]=`Walk`,e[e.Drop=1]=`Drop`,e[e.Lift=2]=`Lift`,e}({}),Or=class{n=0;x;y;z;head;room;door;start;to;kind;lift;len;byRoom=new Map;cols=new Map;constructor(e,t){let n=this.n=e.length;this.x=new Float32Array(n),this.y=new Float32Array(n),this.z=new Float32Array(n),this.head=new Float32Array(n),this.room=new Int16Array(n),this.door=new Int16Array(n),e.forEach((e,t)=>{this.x[t]=e.x,this.y[t]=e.y,this.z[t]=e.z,this.head[t]=e.head,this.room[t]=e.room,this.door[t]=e.door;let n=kr(Math.floor(e.x/1),Math.floor(e.z/1)),r=this.cols.get(n);if(r||this.cols.set(n,r=[]),r.push(t),e.room>=0){let n=this.byRoom.get(e.room);n||this.byRoom.set(e.room,n=[]),n.push(t)}}),t.sort((e,t)=>e[0]-t[0]),this.start=new Int32Array(n+1),this.to=new Int32Array(t.length),this.kind=new Uint8Array(t.length),this.lift=new Int16Array(t.length),this.len=new Float32Array(t.length);let r=0;for(let e=0;e<n;e++)for(this.start[e]=r;r<t.length&&t[r][0]===e;)this.to[r]=t[r][1],this.kind[r]=t[r][2],this.lift[r]=t[r][3],this.len[r]=t[r][4],r++;this.start[n]=r}locate(e,t,n){let r=Math.floor(e/1),i=Math.floor(n/1),a=-1,o=1/0;for(let s=0;s<=1&&a<0;s++)for(let c=-s;c<=s;c++)for(let l=-s;l<=s;l++){let s=this.cols.get(kr(r+l,i+c));if(s)for(let r of s){let i=t-this.y[r];if(i<-.8||i>1.2)continue;let s=Math.hypot(this.x[r]-e,this.z[r]-n)+Math.abs(i)*2;s<o&&(o=s,a=r)}}return a}},kr=(e,t)=>(e+32768)*65536+(t+32768);function Ar(e,t,n){let r=e.dyn.map(e=>[e.y0,e.y1]);for(let t of e.dyn)t.y0=t.y1=-1e6;try{return jr(e,t,n)}finally{e.dyn.forEach((e,t)=>{e.y0=r[t][0],e.y1=r[t][1]})}}function jr(e,t,n){let r=1/0,i=-1/0,a=1/0,o=-1/0,s=1/0,c=-1/0;e.grid.forEachChunk((e,t,n)=>{r=Math.min(r,e*4),i=Math.max(i,e*4+4),a=Math.min(a,n*4),o=Math.max(o,n*4+4),s=Math.min(s,t*4),c=Math.max(c,t*4+4)});let l=[],u=new Map,d=e.grid,f=Math.floor(s/U)-1,p=Math.ceil(c/U);for(let n=Math.floor(a/1);n<Math.ceil(o/1);n++)for(let a=Math.floor(r/1);a<Math.ceil(i/1);a++){let r=(a+.5)*1,i=(n+.5)*1,o=Mn(r,i,Cr),s=[],c=[],m=Math.floor(r/U),h=Math.floor(i/U);for(let e=f;e<p;e++)d.get(m,e,h)<0&&d.get(m,e+1,h)>=0&&(s.push((e+1)*U),c.push(.3));for(let t of e.surfaces){let e=t.def;e.kind===`floor`&&r>=e.x0&&r<=e.x1&&i>=e.z0&&i<=e.z1&&t.has(r,i)&&(s.push(t.heightAt(r,i)),c.push(.8999999999999999))}let g=[];for(let[n,a]of s.entries()){let s=e.groundBelow(o,a+c[n]);if(s===-1/0||s<a-.3||e.overlap(o,s+.01,s+wr)||g.some(e=>Math.abs(l[e].y-s)<.4))continue;let u=e.ceilingAbove(o,s+.01)-s,d=e.roomAt(r,s+.5,i),f=-1;t.forEach((e,t)=>{let n=e.x1-e.x0>e.z1-e.z0,a=(e.x0+e.x1)/2,o=(e.z0+e.z1)/2,c=n?r>e.x0&&r<e.x1:Math.abs(r-a)<1,l=n?Math.abs(i-o)<1:i>e.z0&&i<e.z1;c&&l&&Math.abs(s-e.y0)<.6&&(f=t)}),g.push(l.length),l.push({x:r,y:s,z:i,head:u,room:d?d.id:-1,door:f})}g.length&&u.set(kr(a,n),g)}let m=(e,t)=>!!e&&e.some(e=>Math.abs(l[e].y-t)<=Tr),h=(t,n)=>{let r=Math.ceil(Math.hypot(n.x-t.x,n.z-t.z)/.1),i=t.y;for(let a=1;a<=r;a++){let o=Mn(t.x+(n.x-t.x)*a/r,t.z+(n.z-t.z)*a/r,Cr),s=e.groundBelow(o,i+Tr/2);if(s===-1/0||s<i-Tr/2||e.overlap(o,s+.01,s+wr))return!1;i=s}return Math.abs(i-n.y)<.1},g=[];for(let[t,n]of u){let r=Math.floor(t/65536)-32768,i=t%65536-32768;for(let[t,a]of[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){let o=u.get(kr(r+t,i+a));if(!o)continue;let s=t&&a;for(let c of n)for(let n of o){let o=l[c],d=l[n],f=d.y-o.y,p=Math.abs(f)>Tr&&Math.abs(f)<2*Tr*(s?Math.SQRT2:1)&&(f>0?h(o,d):h(d,o));if(!p&&(f>Tr||-f>Er||s&&Math.abs(f)>Tr))continue;let _=Math.max(o.y,d.y),v=(o.x+d.x)/2,y=(o.z+d.z)/2;e.overlap(Mn(v,y,Cr),_+.01,_+wr)||(!s||m(u.get(kr(r+t,i)),o.y)&&m(u.get(kr(r,i+a)),o.y))&&g.push([c,n,+(-f>Tr&&!p),-1,s?Math.SQRT2*1:1])}}}return n.forEach((e,t)=>{let n=[],r=[];l.forEach((t,i)=>{let a=t.x>e.x0&&t.x<e.x1&&t.z>e.z0&&t.z<e.z1;a&&Math.abs(t.y-e.y0)<.4&&n.push(i),t.x>e.x0-1.2&&t.x<e.x1+1.2&&t.z>e.z0-1.2&&t.z<e.z1+1.2&&!a&&Math.abs(t.y-e.y1)<.4&&r.push(i)});let i=Math.abs(e.y1-e.y0)+4;for(let e of n)for(let n of r)g.push([e,n,2,t,i]),g.push([n,e,2,t,i])}),new Or(l,g)}function Mr(e,t,n,r){if(t.blocked[r])return null;let i=e.kind[n];return i===2&&!t.lifts[e.lift[n]]?null:e.len[n]+(i===1?t.drop:0)+(t.enter?t.enter[r]:0)}function Nr(e,t,n,r,i=1/0){let a=r??new Float32Array(e.n);if(a.fill(1/0),t<0)return a;let o=Lr(e),s=Fr(e),{blocked:c,enter:l,lifts:u,drop:d}=n,f=e.kind,p=e.lift,m=e.len;for(s.size=0,a[t]=0,s.push(t,0);s.size;){let e=s.pop(),n=a[e];if(n>i)break;if(e!==t&&c[e])continue;let r=l?l[e]:0;for(let t=o.start[e];t<o.start[e+1];t++){let e=o.from[t],i=o.edge[t],c=f[i];if(c===2&&!u[p[i]])continue;let l=n+m[i]+r+(c===1?d:0);l<a[e]&&(a[e]=l,s.push(e,l))}}return a}var Pr=new WeakMap,Fr=e=>{let t=Pr.get(e);return t||Pr.set(e,t=new Rr(e.n)),t},Ir=new WeakMap;function Lr(e){let t=Ir.get(e);if(t)return t;let n=e.n,r=e.to.length,i=new Int32Array(n+1);for(let t=0;t<r;t++)i[e.to[t]+1]++;for(let e=0;e<n;e++)i[e+1]+=i[e];let a=i.slice(),o=i.slice(0,n),s=new Int32Array(r),c=new Int32Array(r);for(let t=0;t<n;t++)for(let n=e.start[t];n<e.start[t+1];n++){let r=e.to[n],i=o[r]++;s[i]=t,c[i]=n}return t={start:a,from:s,edge:c},Ir.set(e,t),t}var Rr=class{ids;keys;size=0;constructor(e){this.ids=new Int32Array(e*4+16),this.keys=new Float32Array(e*4+16)}push(e,t){if(this.size>=this.ids.length){let e=new Int32Array(this.ids.length*2),t=new Float32Array(this.ids.length*2);e.set(this.ids),t.set(this.keys),this.ids=e,this.keys=t}let n=this.size++;for(;n>0;){let e=n-1>>1;if(this.keys[e]<=t)break;this.ids[n]=this.ids[e],this.keys[n]=this.keys[e],n=e}this.ids[n]=e,this.keys[n]=t}pop(){let e=this.ids[0],t=this.ids[--this.size],n=this.keys[this.size],r=0;for(;;){let e=2*r+1;if(e>=this.size||(e+1<this.size&&this.keys[e+1]<this.keys[e]&&e++,this.keys[e]>=n))break;this.ids[r]=this.ids[e],this.keys[r]=this.keys[e],r=e}return this.ids[r]=t,this.keys[r]=n,e}},zr=.5,Br=.001;function Vr(e,t,n,r,i,a,o=75){let s={kind:`body`,id:e.newId(),x0:0,y0:0,z0:0,x1:0,y1:0,z1:0},c={x:t,y:n,z:r,vx:0,vz:0,vy:0,mass:o,carried:!1,r:i,h:a,ground:!0,on:null,dyn:s,skip:s,sync:()=>Hr(c),clear:(t,n,r)=>Wr(e,c,c.x+t,c.z+r,c.y+n)};return e.dyn.push(s),Hr(c),c}function Hr(e){let t=e.dyn;t.x0=e.x-e.r,t.x1=e.x+e.r,t.z0=e.z-e.r,t.z1=e.z+e.r,t.y0=e.y,t.y1=e.y+e.h}var Ur=(e,t=e.x,n=e.z)=>Mn(t,n,e.r);function Wr(e,t,n,r,i,a=t.h){return!e.overlap(Ur(t,n,r),i+Br,i+a,t.skip)}function Gr(e,t,n,r,i=zr){let a=null;return n&&(a=Kr(e,t,t.x+n,t.z,i)??a),r&&(a=Kr(e,t,t.x,t.z+r,i)??a),Hr(t),a}function Kr(e,t,n,r,i){let a=e.overlap(Ur(t,n,r),t.y+Br,t.y+t.h,t.skip);if(!a)return t.x=n,t.z=r,null;let o=e.groundBelow(Ur(t,n,r),t.y+i,t.skip);if(o>t.y&&Wr(e,t,n,r,o))return t.x=n,t.z=r,t.y=o,t.vy<0&&(t.vy=0),null;let s=e.sweep(Ur(t),t.y+Br,t.y+t.h,n-t.x,r-t.z,t.skip);return t.x+=(n-t.x)*s,t.z+=(r-t.z)*s,a}function qr(e,t,n,r=0){e.vx+=t,e.vz+=n,r&&(e.vy+=r,e.ground=!1)}function Jr(e,t,n,r=0){Number.isFinite(e.mass)&&qr(e,t/e.mass,n/e.mass,r/e.mass)}function Yr(e,t,n,r,i){let a=t-e.vx,o=n-e.vz,s=Math.hypot(a,o),c=r*i;s<=c?(e.vx=t,e.vz=n):(e.vx+=a/s*c,e.vz+=o/s*c)}function Xr(e,t,n,r,i,a,o){let s=t.x-e.x,c=t.z-e.z,l=Math.hypot(s,c);if(l<1e-6)return;s/=l,c/=l;let u=Math.max(n*s+r*c,i*s+a*c);if(u<=0)return;let d=Number.isFinite(t.mass)?Number.isFinite(e.mass)?u*e.mass/(e.mass+t.mass):u:0,f=t.vx*s+t.vz*c;if(f<d&&(t.vx+=(d-f)*s,t.vz+=(d-f)*c),t.carried=d>0,o){let t=e.vx*s+e.vz*c;e.vx+=(d-t)*s,e.vz+=(d-t)*c}}function Zr(e,t,n,r=zr){let i=t.vx*n,a=t.vz*n;if(!i&&!a)return{hit:null,slam:0};let o=t.x,s=t.z,c=Gr(e,t,i,a,r),l=0,u=0;return Math.abs(t.x-o)<Math.abs(i)-Br*.1&&(l=Math.abs(t.vx),t.vx=0),Math.abs(t.z-s)<Math.abs(a)-Br*.1&&(u=Math.abs(t.vz),t.vz=0),{hit:c,slam:Math.hypot(l,u)}}function Qr(e,t,n,r=20){let i={impact:0};t.vy-=r*n;let a=t.y+t.vy*n,o=Ur(t),s=e.groundBelow(o,t.y+Br,t.skip);a<=s||t.ground&&t.vy<=0&&t.y-s<=.55?(t.ground||(i.impact=-t.vy),a=s,t.vy=0,t.ground=!0):t.ground=!1;let c=e.ceilingAbove(o,t.y+t.h,t.skip,Math.max(t.y,a)+t.h+.5);return a+t.h>c&&(a=Math.max(s,c-t.h),t.vy>0&&(t.vy=0)),t.y=a,t.on=t.ground?$r(e,o,t.y,t.dyn):null,Hr(t),i}function $r(e,t,n,r){for(let i of e.dyn)if(i!==r&&i.kind!==`body`&&Math.abs(i.y1-n)<.01&&Pn(t,i.x0,i.z0,i.x1,i.z1))return i;return null}function ei(e,t){let n=e.pushOut(Ur(t),t.y+Br,t.y+t.h,t.skip);n&&(t.x+=n[0],t.y+=n[1],t.z+=n[2],Hr(t))}var ti={baton:{n:`Guard's baton`,d:`Rubber over a steel core, 1.1 kg. Better than your hands.`,w:{mass:1.1,type:`blunt`,len:.5}},pipe:{n:`Lead pipe`,d:`A metre of old plumbing, 2.4 kg. Slow. It ends arguments.`,w:{mass:2.4,type:`blunt`,len:.7}},wrench:{n:`Pipe wrench`,d:`Steel, 1.6 kg. Quicker than the pipe, lighter on arrival.`,w:{mass:1.6,type:`blunt`,len:.45}},adjwrench:{n:`Adjustable wrench`,d:`Chrome steel, 1.1 kg. An engineer's tool. Handy, not heavy.`,w:{mass:1.1,type:`blunt`,len:.4}},pistol:{n:`Service pistol`,d:`9 mm. One click, one round. Everything on the floor hears it.`,w:{gun:!0,dmg:36,range:32,cone:.985,ammo:`ammo9`,cd:.38,mass:.9}},shotgun:{n:`Shotgun`,d:`12 gauge. Ruinous up close, a suggestion at distance.`,w:{gun:!0,dmg:105,range:15,cone:.93,ammo:`shells`,cd:1.05,mass:3.2}},ammo9:{n:`9 mm rounds`,d:`Loose rounds for the pistol.`,stack:!0,per:12},shells:{n:`Shotgun shells`,d:`12 gauge.`,stack:!0,per:6},knife:{n:`Kitchen knife`,d:`200 g of edge. Fast. You have to stand very close.`,w:{mass:.2,type:`edge`,len:.25,shape:`thrust`}},axe:{n:`Fire axe`,d:`3.2 kg with an edge. Every swing is a commitment.`,w:{mass:3.2,type:`edge`,len:.9,shape:`chop`}},flash:{n:`Flashlight`,tool:!0},lantern:{n:`Dive lantern`,tool:!0},batt:{n:`Battery`,d:`A fresh cell. Fits the flashlight and the lantern.`,stack:!0},medkit:{n:`Trauma kit`,d:`Restores most of your health.`,heal:60},bandage:{n:`Bandage`,d:`Stops the bleeding.`,heal:25,stack:!0},ration:{n:`Ration bar`,d:`Dense, grey, edible.`,heal:8,stack:!0},peaches:{n:`Canned peaches`,d:`Syrup and all.`,heal:14,stack:!0},fuse:{n:`Main fuse`,d:`Ceramic cartridge fuse, heavy as a brick. Fits a generator bus.`},kit:{n:`Splice kit`,d:`Crimps, sleeves, a length of heavy cable. Mends one broken service connection.`},armor:{n:`Stab vest`,worn:!0},hardhat:{n:`Hard hat`,worn:!0},tacvest:{n:`Tactical vest`,worn:!0},goggles:{n:`Swim goggles`,worn:!0},rebreather:{n:`Rebreather`,worn:!0},surf:{n:`Surface lift pass`,key:`surf`},liftkey:{n:`Director's lift key`,key:`lift`}},ni={s:`Security keycard`,o:`Operations pass`,h:`Horticulture security pass`,e:`Engineering keycard`,surf:`Surface lift pass`,lift:`Director's lift key`},ri=e=>ni[e]??`Room card, Residence `+e;function ii(e){let t=e&&ti[e]?.w||{mass:.6,type:`fist`,len:0};if(t.gun)return{kind:`gun`,shape:`thrust`,time:.3,reach:0,stun:.5,dmg:t.dmg??0,mass:t.mass,gun:!0,range:t.range,cone:t.cone,ammo:t.ammo,cd:t.cd};let n=t.type===`edge`?14+9*t.mass:t.type===`fist`?5:12*t.mass**.85;return{kind:t.type??`blunt`,shape:t.shape??(t.type===`fist`?`thrust`:`side`),dmg:n,time:.3+.2*t.mass,reach:.8+(t.len??0),stun:.15+.2*t.mass,mass:t.mass}}var ai=(e,t)=>({intake:{t:`Isolation record, room 1`,b:`LOWFIELD STATION / SECURITY, MEDICAL ISOLATION

Room 1. Staff, own quarters sealed.
Isolated 6/11 by order of the Director of Operations. Possible exposure.
Bloods taken. Results: pending.
Sedate: midazolam infusion, titrate to effect, until cleared.

Doors on the fail-safe, off the suite's own set. Observe from the station.
Do not go in alone.

Signed: Sgt. R. Aldana, for the duty physician`},duty:{t:`Station log, isolation`,b:`8/11. Both bags changed. Orders stand: keep the two in Iso under. We don't know what they are, and the one who could tell us is not coming back.

9/11. Half the night shift did not come back from the muster hall. The ones who did keep doing their rounds, slower every night, and they do not talk.

11/11. Room 1's changed, 23:10. Nothing left for room 2. Okafor says he'll find a bag.

12/11. Okafor went down and did not come back up the stair. His light is still down there on the floor.

Room 2 is awake. Banging on the glass. We can't go down: one of ours is walking the night round again, and he isn't ours any more.`},board:{t:`The whiteboard`,b:`ISO / NIGHTS

Rm 1 + Rm 2: midazolam infusion. Titrate to RASS -4.
Obs hourly from the station. Bags 3-daily.
DO NOT WAKE. DO NOT GO IN ALONE.

Dr K. 6/11`},cut:{t:`On the floor by the cut`,b:`We cut it to blind the cameras.

Holding has its own set. Nobody is going down there to see how long it lasts.`},cams:{t:`Shift briefing, on the lectern`,b:`Camera coverage follows the power. Right now that is this floor and nothing else.

Reminder that Horticulture is not on our board and never was. They have their own post, their own passes and their own backup set. We send people down. We do not get to watch what happens to them.

The surface lift takes an Armory pass or the director's key. The director took his key home to floor 3 and has not been seen at a briefing since.`},lockers:{t:`Taped inside a locker door`,b:`Ops is still up there behind its glass. All of it. Grown into the chairs, still watching the screens. You can see it from the court if you look up, and it can see you.

Reyes swears the ops room is on the board in the electrical room at the west end of the hall. Screens off, it is blind: it cannot see the cameras or work the board. Reyes went to throw it. Nobody has checked the schedule. Nobody has been that far.

They keep switching things back on. They do not know why. It is a drill.`},memo:{t:`Staff memo: the Regimen`,b:`To all Lowfield staff,

The tissue Horticulture recovered from the aquifer core accepts any graft we give it and asks nothing in return. It began in the seed beds. It did not stay in the seed beds. Dr. Holt burned her hand in March. Many of you have seen her hand.

From Monday the Regimen is open to every member of staff, on a voluntary basis. One small graft. You will sleep less and need less. You will find the dark down here easier to bear.

We came to grow things where nothing grows. I see no reason to stop at wheat.

Operations, on behalf of Dr. Maren Holt`},mgr:{t:`Note to the chief of security`,b:`The Armory keypad was changed last week and I was not given the number. I am told Sgt. Aldana has it, on her person, and that Sgt. Aldana went down to Hydro on 6 to look at the flooding and has not come back up.

I would like it noted that the only surface passes on this station are inside that Armory.

I would also like it noted that the Armory is a heavy door, so the number is no use to anyone until Gen-1 is running.`},chief:{t:`Chief of security, unsent`,b:`Things I have signed for: thirty-one transfers from Holding to floor 4. Nothing has ever come back up.

Hazard store has the rebreathers. If anyone has to go after Aldana, that is what they will need, and that door is a heavy one too.

The ones on 3 have stopped being staff. They keep the Commons like a territory. They have started carrying their clutches up to Cargo and laying them on the high rungs, where nothing green can reach.`},manifest:{t:`Cargo manifest, bay 2`,b:`UPPER RUNG, BAY 2: one crate electrical spares for Engineering, incl. GEN-1 MAIN FUSE x1. Not yet sent down.

The platforms need power to move. The backup set in this office will do it. It will also wake every door on the floor, and I would think hard about that, because of what is on the rungs.

They do not like light. The small ones cannot open anything. The ones that walk can.

Stairs down are at the far end of bay 2.`},diary:{t:`A resident's diary`,b:`Eleven days without sleep and I have never felt better. Everyone at breakfast says the same. Nobody is eating much breakfast.

Pia keeps her arm under the blanket now. I watched it reach for the lamp while she was looking the other way, and then it turned the lamp off.

They pulled up everything green in the Commons last night. All of it, with their hands. The tree is the only thing they could not shift, and it has started to look like them.

The unmarked door past the trauma centre is the stair to Horticulture. We were never meant to notice it.`},clinic:{t:`Clinical notes, trauma centre`,b:`A cultivar that takes badly is not a failure of the rootstock. It is a failure of the scion.\n\nFour staff have taken badly. I have moved them where it is dark and they are calmer.\n\nThis ward is to be left exactly as it is. Nobody here is going to need it.\n\nOffice keypad, floor 4, since I no longer trust myself to remember what I no longer care about: ${t}.\n\nM. H.`},keeper:{t:`On the director's desk`,b:`I was going to take the surface lift. I had the key round my neck and my hand on the door.

Then I thought: up there I am a man who signed for thirty-one people. Down here they bring me things.

I have decided to stay. I find I am becoming easier to stay with.`},hsec:{t:`Horticulture security log`,b:`Nobody from upstairs comes through this post without one of our passes. That is the point of the post.

The beds stopped needing light in the spring. Then they stopped needing beds. It is in the grout. It is in the cable trays. It has gone down the west stair into Engineering and nobody down there has called up in a week.

It does not go up. Whatever the staff on 3 have become, they tear it out wherever it shows.

The hanging growth over the doorways is not growth. Hit the pod, not the tendrils.`},journal:{t:`Holt's lab journal`,b:`I was afraid for most of a year. Of the board, of the tissue, of what Operations kept signing for on my behalf.

Fear lives in a place. I know where, now. I went in through the orbit with a number eleven blade and a mirror, and I took it out. It was smaller than I expected.

I can no longer find any reason to have stopped at one graft, so I haven't.

It takes plants first. Then whatever lives on plants. Then whatever tends them.`},holt:{t:`Director of research, memorandum`,b:`Accessions are to be routed from Holding directly to the tissue lab. They are not to pass through the Commons. They are not to be given names in my hearing.

If Engineering complain again about roots in the switchgear, remind them who keeps the lights on for whom.`},last:{t:`A page left in the soil`,b:`I am going to sit in the arboretum. The light is good there, and I find I want very little else.

The ones upstairs think they are at war with the garden. They are the garden. They are the part of it that walks.

If you are one of mine: you were never a prisoner. You were stock. It is a better thing to be.

M.`},work:{t:`Work order 2217`,b:`GEN-1 MAIN FUSE: BLOWN (third time)

One spare on the bench in the machine shop. One more in a crate that never came down from Cargo.

Seat the fuse in the socket on the generator hall board, THEN throw the breaker. The breaker goes both ways.

Gen-1 feeds every floor through the board in Distribution. A closed switch takes power. An open one does not. Cargo was opened on purpose and should probably stay that way. Hydro's feed burned through when the bottom level flooded: it wants a splice kit, and even then you will only light the top half. Nothing lights what is under water.

Kits are in the parts store. The parts store is on my card.

The green stuff from the west stair is in the shop now. Do not walk under the hanging ones.`},route:{t:`Chalked on the floor, Distribution`,b:`1 OPS .... closed
2 CARGO .. OPEN (leave it)
3 RES .... closed
4 HORT ... closed
6 HYDRO .. BURNED

Each floor also has its own backup set. Half-light, sliding doors, card readers. No heavy doors. No lifts.`},hydro:{t:`Pump control, last entry`,b:`Lower level is gone. Both shafts are full to the hatch.

Aldana went down shaft A after the pump crew with a torch. Torches die under water. I told her. The dive lantern is on this desk because she would not take it.

If you have to go after her: shaft B in the filter room comes out much nearer the sluice than A does. On one breath, B is possible and A is not. With a rebreather either will do. The rebreathers are in the hazard store on 1, naturally.

You will not see your hand without goggles. Somebody in Recreation on 3 used to swim.

Light brings the swimmers.`},code:{t:`Written on Aldana's hand`,b:`ARMORY\n\n${e}`}});function oi(e,t){let n=String(1e3+e.int(9e3)),r=String(1e3+e.int(9e3));return{station:t,inv:[],cap:10,tools:[],keys:[],worn:[],weapon:null,notes:ai(n,r),read:[],code:n,code2:r,hp:100,batt:100,light:null,lightOn:!1,pad:null,ended:null,travel:null,time:0,noise:0,noiseI:0,noiseT:0,vis:1,once:[],kills:0,god:!1,events:[],commands:[]}}function si(e,t){let n=e.station;return n?or(n.circuits,n.main,t):2}var W=(e,t)=>{e.events.push({type:`say`,text:t})},ci=(e,t)=>{e.events.push({type:`log`,text:t})},G=(e,t,n,r,i,a)=>{e.events.push({type:`sfx`,name:t,x:n?.x,y:n?.y,z:n?.z,big:r,d:i,k:a})},li=(e,t)=>e.tools.includes(t)||e.inv.some(e=>e.id===t);function ui(e,t){let n=e.inv[t];--n.n<=0&&(e.inv.splice(t,1),e.weapon===n.id&&(e.weapon=null))}function di(e,t){e.keys.includes(t)||e.keys.push(t),W(e,ri(t)+`.`)}function fi(e,t,n=1){let r=ti[t];if(!r)return!1;if(r.key)return e.keys.includes(r.key)||e.keys.push(r.key),W(e,r.n+`.`),!0;if(r.per&&(n*=r.per),r.worn)return e.worn.includes(t)||e.worn.push(t),W(e,t===`goggles`?`Swim goggles. You will be able to see under water.`:t===`rebreather`?`Rebreather. Four times the air.`:r.n+`. You put it on.`),!0;if(r.tool)return e.tools.includes(t)||e.tools.push(t),e.light||=t,W(e,t===`flash`?`Flashlight. F switches it.`:`Dive lantern. A small circle of light all round you, and the only kind that works under water. F switches it.`),!0;let i=e.inv.find(e=>e.id===t);return i&&r.stack?(i.n+=n,W(e,r.n+(n>1?` ×`+n:``)+`.`),!0):e.inv.length>=e.cap?(W(e,`Your hands are full. Tab, and put something down.`),!1):(e.inv.push({id:t,n}),W(e,r.n+(n>1?` ×`+n:``)+`.`),r.w&&(!e.weapon||ii(t).dmg>ii(e.weapon).dmg)&&(e.weapon=t),!0)}function pi(e,t){e.notes[t]&&(e.read.includes(t)||e.read.push(t),e.events.push({type:`note`,key:t}),G(e,`paper`))}function mi(e,t,n){if(t&&li(e,t)&&e.light!==t&&(e.light=t,e.lightOn=!1),n&&li(e,`lantern`)&&(e.light=`lantern`),!((!e.light||!li(e,e.light))&&(e.light=li(e,`flash`)?`flash`:li(e,`lantern`)?`lantern`:null,!e.light))){if(!e.lightOn){if(e.light===`flash`&&n){W(e,`The flashlight is dead in the water.`),G(e,`deny`);return}if(e.batt<=0){let t=e.inv.findIndex(e=>e.id===`batt`);if(t<0){W(e,`No batteries.`);return}ui(e,t),e.batt=100}}e.lightOn=!e.lightOn,G(e,`take`)}}function hi(e,t,n){if(e.lightOn&&e.light===`flash`&&n&&(e.lightOn=!1,G(e,`deny`),W(e,`The flashlight goes under and dies. It is not sealed.`)),e.lightOn&&(e.batt-=t*100/(e.light===`flash`?270:420),e.batt<=0)){let t=e.inv.findIndex(e=>e.id===`batt`);t>=0?(ui(e,t),e.batt=100,W(e,`The light dies. You thumb in a fresh battery.`)):(e.batt=0,e.lightOn=!1,W(e,`The light is dead.`))}}function gi(e,t){let n=e.inv[t];if(!n)return;let r=ti[n.id];r.w?e.weapon=e.weapon===n.id?null:n.id:r.heal?e.hp>=100?W(e,`You are not hurt.`):(e.hp=Math.min(100,e.hp+r.heal),ui(e,t),G(e,`eat`)):n.id===`batt`?!li(e,`flash`)&&!li(e,`lantern`)?W(e,`Nothing to put it in.`):e.batt>90?W(e,`The light is still strong.`):(e.batt=100,ui(e,t),W(e,`Fresh battery.`)):r.worn?(ui(e,t),e.worn.includes(n.id)||e.worn.push(n.id),W(e,`You put the `+r.n.toLowerCase()+` on.`),G(e,`take`)):n.id===`fuse`?W(e,`It belongs in a generator.`):n.id===`kit`?W(e,`It mends a broken service connection. One of them.`):r.per&&W(e,`Ammunition. It needs the gun.`)}function _i(e,t){let n=e.worn.indexOf(t),r=ti[t];if(!(n<0||!r)){if(e.inv.length>=e.cap){W(e,`Your hands are full. Tab, and put something down.`);return}e.worn.splice(n,1),e.inv.push({id:t,n:1}),W(e,`You take the `+r.n.toLowerCase()+` off.`),G(e,`take`)}}function vi(e,t,n){e.once.includes(t)||(e.once.push(t),W(e,n))}function yi(e,t){e.noiseI=Math.max(e.noiseI,t),e.noiseT=.5}function bi(e,t,n,r){let i=1;e.worn.includes(`tacvest`)?i*=.55:e.worn.includes(`armor`)&&(i*=.7),e.worn.includes(`hardhat`)&&(i*=.9),xi(e,t*i,n,.45,!0,r)}function xi(e,t,n,r=.45,i=!0,a){e.ended||e.god||(e.hp-=t,i&&G(e,`hurt`),e.events.push({type:`hurt`,shake:r,from:a}),e.hp<=0&&(e.hp=0,Si(e,!1,n)))}function Si(e,t,n){e.ended||(e.ended={win:t,msg:n},e.events.push({type:`end`,win:t,msg:n}))}var Ci=2.2,wi=2.5,Ti=1.5,Ei=.2;function Di(e,t){let n={kind:`mover`,id:e.newId(),x0:t.x0,y0:t.y0,z0:t.z0,x1:t.x1,y1:t.y1,z1:t.z1,mat:t.mat,...t.glass?{glass:!0}:{}};e.dyn.push(n);let r={def:t,dyn:n,t:t.stuck?Oi:+!!t.open,open:t.open,unlocked:!1,hold:0,down:!1,drawing:0,pass:0,beep:0,beepOk:!1};return Object.assign(r.dyn,Li(r,r.t)),r}var Oi=.45;function ki(e){Object.assign(e.dyn,{y0:e.y-Ei,y1:e.y})}function Ai(e,t){let n={kind:`mover`,id:e.newId(),x0:t.x0,z0:t.z0,x1:t.x1,z1:t.z1,y0:t.y0-Ei,y1:t.y0,mat:t.mat};return e.dyn.push(n),{def:t,dyn:n,y:t.y0,target:0,wait:0,moving:!1,armed:!0}}function ji(e,t){e.target=t,e.moving=!0}var Mi=(e,t)=>e.x0<t.x1&&e.x1>t.x0&&e.y0<t.y1&&e.y1>t.y0&&e.z0<t.z1&&e.z1>t.z0,Ni=e=>!!(e.def.card||e.def.code)&&!e.unlocked||e.down;function Pi(e,t){return!e.def.failsafe||e.unlocked||t>0?!1:(e.unlocked=!0,!0)}function Fi(e,t){let n=Li(e,0);return t.some(e=>Mi(n,e.dyn))}function Ii(e,t,n,r,i){let a=e.def,o=!1;if(e.beep>0&&(e.beep=Math.max(0,e.beep-i)),e.pass>0&&(e.pass-=i)<=0&&e.open&&Ni(e)&&a.kind===`heavy`&&(Fi(e,t)?e.pass=.2:(e.open=!1,o=!0)),!(a.stuck||a.vent||a.seal||a.lift)){if(a.kind===`heavy`)r<2&&e.open&&!Fi(e,t)&&(e.open=!1,o=!0);else if(r>0){if(Ni(e))e.open&&e.pass<=0&&!Fi(e,t)&&(e.open=!1,o=!0);else{let r=(a.x0+a.x1)/2,s=(a.z0+a.z1)/2;n.some(e=>Math.hypot(e.x-r,e.z-s)<wi&&e.y<a.y1&&e.y>a.y0-1)?(e.open||(e.open=!0,o=!0),e.hold=2.2):e.open&&(e.hold-=i)<=0&&!Fi(e,t)&&(e.open=!1,o=!0)}}}let s=a.stuck?Oi:+!!e.open,c=e.t+Math.max(-2.2*i,Math.min(Ci*i,s-e.t));return c<e.t&&t.some(t=>Mi(Li(e,c),t.dyn))&&(c=e.t),e.t=c,Object.assign(e.dyn,Li(e,c)),o}function Li(e,t){let n=e.def;if(n.slides){let e=n.alongX?n.x1-n.x0:n.z1-n.z0,r=(n.side??1)*(e-.02)*t;return n.alongX?{x0:n.x0+r,z0:n.z0,x1:n.x1+r,z1:n.z1,y0:n.y0,y1:n.y1}:{x0:n.x0,z0:n.z0+r,x1:n.x1,z1:n.z1+r,y0:n.y0,y1:n.y1}}let r=(n.y1-n.y0-.02)*t;return{x0:n.x0,z0:n.z0,x1:n.x1,z1:n.z1,y0:n.y0+r,y1:n.y1+r}}function Ri(e,t,n){let r=e.def,i=t.filter(t=>t.on===e.dyn);if(!e.moving&&r.call)return null;if(!e.moving)return i.length||(e.armed=!0),e.wait=i.length&&e.armed?e.wait+n:0,e.wait>.8&&(e.target=+!e.target,e.moving=!0,e.wait=0,e.armed=!1),null;let a=e.target?r.y1:r.y0,o=Math.sign(a-e.y)*Ti*n;Math.abs(a-e.y)<=Math.abs(o)&&(o=a-e.y);let s={x0:r.x0,z0:r.z0,x1:r.x1,z1:r.z1,y0:e.y+o-Ei,y1:e.y+o};if(t.some(e=>!i.includes(e)&&Mi(s,e.dyn))||o>0&&i.some(e=>!e.clear(0,o,0)))return e.target=+!e.target,`moving`;e.y+=o,Object.assign(e.dyn,s);for(let e of i)e.y+=o,e.sync();return e.y===a?(e.moving=!1,e.armed=i.length===0,`arrived`):`moving`}var zi={crawl:1,hands:1.8,big:2.2},Bi=new WeakMap;function Vi(e){let t=e.world.def,n=Bi.get(t);n||Bi.set(t,n=Ar(e.world,e.doors.map(e=>e.def),e.platforms.map(e=>e.def)));let r=n.n,i=()=>new Float32Array(r).fill(1/0),a=new Int16Array(r).fill(-1);for(let t=0;t<r;t++)e.platforms.forEach((e,r)=>{let i=e.def;n.x[t]>i.x0&&n.x[t]<i.x1&&n.z[t]>i.z0&&n.z[t]<i.z1&&Math.abs(n.y[t]-i.y0)<.4&&(a[t]=r)});let o=e=>{let t=new Uint8Array(r);for(let i=0;i<r;i++)n.head[i]<e&&(t[i]=1);return t},s=e.doors.map(()=>[]);for(let e=0;e<r;e++)n.door[e]>=0&&s[n.door[e]].push(e);let c=t=>({tick:-1,R:{blocked:new Uint8Array(r),enter:t?new Float32Array(r):null,lifts:new Uint8Array(e.platforms.length),drop:t?0:.5}});return{nav:n,crawl:i(),hands:i(),big:i(),sound:i(),onLift:a,from:-1,turn:0,low:{crawl:o(zi.crawl),hands:o(zi.hands),big:o(zi.big)},doorSpots:s,rules:{crawl:c(!1),hands:c(!1),big:c(!1),sound:c(!0),staff:c(!1)},made:{}}}var Hi=e=>e.t>.9,Ui=(e,t)=>{let n=e.def;return n.kind===`light`&&!(n.stuck||n.vent||n.seal||n.lift)&&t>0&&!Ni(e)},Wi=e=>{let t=e.def;return t.seal||t.vent||t.lift||t.stuck||t.kind===`heavy`||Ni(e)},Gi=(e,t)=>{let n=t.def;return!!e.world.def.cards&&!!n.card&&!n.code&&!t.down&&!(n.seal||n.vent||n.lift||n.stuck)&&si(e.game,n.circuit)>=(n.kind===`heavy`?2:1)};function Ki(e,t,n,r=!1){return n===`big`?!1:Hi(t)||Ui(t,si(e.game,t.def.circuit))||r&&n===`hands`&&Gi(e,t)?!0:n===`crawl`?t.def.stuck:!Wi(t)}function qi(e,t,n){return!t.def.call||n===`hands`&&si(e.game,t.def.call.circuit)>0}function Ji(e,t,n,r=!1){let i=r&&n===`hands`,a=t.rules[i?`staff`:n];if(a.tick===e.tick)return a.R;let o=a.R;return o.blocked.set(t.low[n]),e.doors.forEach((r,a)=>{if(!Ki(e,r,n,i))for(let e of t.doorSpots[a])o.blocked[e]=1}),e.platforms.forEach((t,r)=>{o.lifts[r]=+!!qi(e,t,n)}),a.tick=e.tick,o}var Yi=new WeakMap;function Xi(e,t,n){let r=Yi.get(t);return r||Yi.set(t,r={}),r[n]??={blocked:t.low[n],enter:null,drop:.5,lifts:Uint8Array.from(e.platforms,e=>+(!e.def.call||n===`hands`))}}function Zi(e,t){let n=t.rules.sound.R,r=n.enter;return e.doors.forEach((e,n)=>{let i=e.t>.5?0:e.def.kind===`heavy`||e.def.seal?12:6;for(let e of t.doorSpots[n])r[e]=i}),n}var Qi={crawl:90,hands:90,big:90,sound:40},$i=[`crawl`,`hands`,`big`,`sound`];function ea(e,t,n){let r=String(t.from);if(n===`sound`){for(let t of e.doors)r+=t.t>.5?`1`:`0`;return r}let i=Ji(e,t,n);e.doors.forEach((e,n)=>{let a=t.doorSpots[n];r+=a.length&&i.blocked[a[0]]?`0`:`1`});for(let e of i.lifts)r+=e;return r}function ta(e,t){let n=e.player.body,r=t.nav.locate(n.x,n.y,n.z);if(r>=0&&(t.from=r),t.from<0)return;let i=$i[t.turn++%4],a=ea(e,t,i);t.made[i]!==a&&(t.made[i]=a,Nr(t.nav,t.from,i===`sound`?Zi(e,t):Ji(e,t,i),t[i],Qi[i]))}var na=new WeakMap;function ra(e,t){let n=Ji(e,t,`hands`,!0),r=String(t.from);for(let e of t.doorSpots)r+=e.length&&n.blocked[e[0]]?`0`:`1`;for(let e of n.lifts)r+=e;let i=na.get(t);return i||na.set(t,i={key:``,F:new Float32Array(t.nav.n)}),i.key!==r&&(i.key=r,Nr(t.nav,t.from,n,i.F,Qi.hands)),i.F}function ia(e,t){for(let n=0;n<4;n++)ta(e,t)}var aa={husk:{pts:{hipL:[-.11,.9,0,.12,10],hipR:[.11,.9,0,.12,10],kneeL:[-.11,.45,0,.08,5],kneeR:[.11,.45,0,.08,5],footL:[-.11,.08,.04,.08,3],footR:[.11,.08,.04,.08,3],belly:[0,1.18,.05,.13,14],shL:[-.27,1.46,0,.11,8],shR:[.3,1.48,0,.12,9],head:[-.02,1.66,0,.13,6],handL:[-.27,.78,0,.05,3],handR:[.3,.46,.02,.06,4]},rigid:[[`hipL`,`hipR`,`belly`,`shL`,`shR`,`head`]],sticks:[[`hipL`,`kneeL`],[`kneeL`,`footL`],[`hipR`,`kneeR`],[`kneeR`,`footR`],[`shL`,`handL`],[`shR`,`handR`]],apart:[[`kneeL`,`shL`,.72],[`kneeR`,`shR`,.72],[`kneeL`,`belly`,.6],[`kneeR`,`belly`,.6],[`hipL`,`footL`,.3],[`hipR`,`footR`,.3],[`kneeL`,`kneeR`,.6],[`footL`,`footR`,.6],[`handL`,`belly`,.4],[`handR`,`belly`,.3]],hinge:[[`hipL`,`kneeL`,`footL`,`hipL`,`hipR`,-1],[`hipR`,`kneeR`,`footR`,`hipL`,`hipR`,-1]],mid:[`hipL`,`hipR`,`belly`],core:[`hipL`,`hipR`,`shL`],tone:{kneeL:.5,kneeR:.5,footL:.5,footR:.5,handL:.6,handR:.6},hands:[[`handL`,`shL`],[`handR`,`shR`]],legs:[[`hipL`,`kneeL`,`footL`],[`hipR`,`kneeR`,`footR`]]},thresher:{pts:{hipL:[-.17,1,0,.13,28],hipR:[.17,1,0,.13,28],kneeL:[-.17,.48,.02,.09,13],kneeR:[.17,.48,.02,.09,13],footL:[-.17,.09,.06,.09,8],footR:[.17,.09,.06,.09,8],back:[0,1.55,-.2,.18,60],shL:[-.47,1.98,-.06,.12,12],shR:[.47,1.98,-.06,.12,12],head:[0,2.14,-.12,.14,10],elbL:[-.47,1.54,-.06,.07,8],elbR:[.47,1.54,-.06,.07,8],handL:[-.47,1,-.06,.07,6],handR:[.47,1,-.06,.07,6]},rigid:[[`hipL`,`hipR`,`back`,`shL`,`shR`,`head`]],sticks:[[`hipL`,`kneeL`],[`kneeL`,`footL`],[`hipR`,`kneeR`],[`kneeR`,`footR`],[`shL`,`elbL`],[`elbL`,`handL`],[`shR`,`elbR`],[`elbR`,`handR`]],apart:[[`kneeL`,`shL`,.72],[`kneeR`,`shR`,.72],[`kneeL`,`back`,.75],[`kneeR`,`back`,.75],[`hipL`,`footL`,.3],[`hipR`,`footR`,.3],[`kneeL`,`kneeR`,.6],[`footL`,`footR`,.6],[`shL`,`handL`,.45],[`shR`,`handR`,.45],[`handL`,`back`,.3],[`handR`,`back`,.3]],hinge:[[`hipL`,`kneeL`,`footL`,`hipL`,`hipR`,-1],[`hipR`,`kneeR`,`footR`,`hipL`,`hipR`,-1],[`shL`,`elbL`,`handL`,`shL`,`shR`,1],[`shR`,`elbR`,`handR`,`shL`,`shR`,1]],mid:[`hipL`,`hipR`,`back`],core:[`hipL`,`hipR`,`shL`],tone:{kneeL:.5,kneeR:.5,footL:.5,footR:.5,elbL:.6,elbR:.6,handL:.5,handR:.5},hands:[[`handL`,`shL`],[`handR`,`shR`]],legs:[[`hipL`,`kneeL`,`footL`],[`hipR`,`kneeR`,`footR`]]},skitter:{pts:{fl:[-.2,.55,.38,.13,5],fr:[.2,.55,.38,.13,5],bl:[-.2,.55,-.38,.13,5],top:[0,.66,0,.12,6],br:[.2,.55,-.38,.13,5],ml:[-.2,.55,0,.13,3],mr:[.2,.55,0,.13,3],head:[0,.57,.62,.15,4],f0:[-.56,.05,.38,.05,1.5],f1:[-.56,.05,0,.05,1.5],f2:[-.56,.05,-.38,.05,1.5],f3:[.56,.05,.38,.05,1.5],f4:[.56,.05,0,.05,1.5],f5:[.56,.05,-.38,.05,1.5]},rigid:[[`fl`,`fr`,`bl`,`top`,`br`,`ml`,`mr`,`head`]],sticks:[[`fl`,`f0`],[`ml`,`f1`],[`bl`,`f2`],[`fr`,`f3`],[`mr`,`f4`],[`br`,`f5`]],apart:[[`f0`,`top`,.75],[`f1`,`top`,.75],[`f2`,`top`,.75],[`f3`,`top`,.75],[`f4`,`top`,.75],[`f5`,`top`,.75],[`f0`,`f1`,.5],[`f1`,`f2`,.5],[`f3`,`f4`,.5],[`f4`,`f5`,.5]],mid:[`fl`,`fr`,`bl`,`br`],core:[`fl`,`fr`,`bl`],tone:{f0:.8,f1:.8,f2:.8,f3:.8,f4:.8,f5:.8}},worm:{pts:{head:[0,.22,.3,.15,4],s0:[0,.18,0,.18,5],s1:[0,.18,-.36,.17,4.5],s2:[0,.18,-.72,.15,4],s3:[0,.16,-1.08,.14,3.5],s4:[0,.14,-1.44,.12,2.5],s5:[0,.12,-1.8,.11,1.5]},rigid:[],sticks:[[`head`,`s0`],[`s0`,`s1`],[`s1`,`s2`],[`s2`,`s3`],[`s3`,`s4`],[`s4`,`s5`]],apart:[[`head`,`s1`,.75],[`s0`,`s2`,.75],[`s1`,`s3`,.75],[`s2`,`s4`,.75],[`s3`,`s5`,.75]],mid:[`s1`,`s2`],writhe:!0}};function oa(e,t){let n=Object.values(t).reduce((e,t)=>e+t[4],0);return Object.fromEntries(Object.entries(t).map(([t,r])=>[t,[r[0],r[1],r[2],r[3],r[4]*e/n]]))}aa.patient={...aa.husk,pts:oa(55,{...aa.husk.pts,hipL:[-.1,.9,0,.12,10],hipR:[.1,.9,0,.12,10],kneeL:[-.1,.45,0,.08,5],kneeR:[.1,.45,0,.08,5],footL:[-.1,.08,.04,.08,3],footR:[.1,.08,.04,.08,3],shL:[-.25,1.46,0,.11,8],shR:[.25,1.46,0,.11,8],head:[0,1.66,0,.13,6],handL:[-.25,.78,0,.05,3],handR:[.25,.78,0,.05,3]})};var sa=new Map;function ca(e){let t=sa.get(e);if(t)return t;let n=aa[e],r=Object.keys(n.pts),i={};r.forEach((e,t)=>{i[e]=t});let a=[],o=[],s=[];for(let e of r){let[t,r,i,c,l]=n.pts[e];a.push(t,r,i),o.push(c),s.push(l)}let c=(e,t)=>Math.hypot(a[e*3]-a[t*3],a[e*3+1]-a[t*3+1],a[e*3+2]-a[t*3+2]),l=[],u=[],d=(e,t)=>{l.push(e,t,c(e,t))};for(let e of n.rigid){let t=e.map(e=>i[e]),n=t.slice(0,4);for(let e=0;e<n.length;e++)for(let t=e+1;t<n.length;t++)d(n[e],n[t]);for(let e of t.slice(4))for(let t of n)d(e,t)}for(let[e,t]of n.sticks)d(i[e],i[t]);for(let[e,t,r]of n.apart)u.push(i[e],i[t],c(i[e],i[t])*r);let f=1/0,p=-1/0;for(let e=0;e<r.length;e++)f=Math.min(f,a[e*3+1]-o[e]),p=Math.max(p,a[e*3+1]+o[e]);let m=(n.hinge??[]).flatMap(([e,t,n,r,a,o])=>[i[e],i[t],i[n],i[r],i[a],o]),h=n.core?n.core.map(e=>i[e]):null,g=h?[0,1,2].map(e=>(a[h[0]*3+e]+a[h[1]*3+e]+a[h[2]*3+e])/3):[0,0,0];return t={names:r,at:i,rest:a,r:o,kg:s,w:s.map(e=>1/e),mass:s.reduce((e,t)=>e+t,0),sticks:l,apart:u,hinge:m,mid:n.mid.map(e=>i[e]),ht:p-f,core:h,frame0:h?Na(a,h):[],c0:g,tone:r.map(e=>n.tone?.[e]??1),hands:(n.hands??[]).map(([e,t])=>({hand:i[e],from:i[t],reach:c(i[e],i[t])})),writhe:!!n.writhe,legs:(n.legs??[]).map(([e,t,n])=>({hip:i[e],knee:i[t],foot:i[n],len:c(i[e],i[t])+c(i[t],i[n])}))},sa.set(e,t),t}var la={iters:8,gravity:10,tone:{start:.12,last:.45,alive:.06},air:.999,joint:.97,slack:.86,friction:1.2,sleep:{speed:.12,after:.5,most:8},budget:16,down:1,local:.35,spread:.6,grip:1.2,cling:2,most:8,shove:4,tip:1.2,slump:1.1,water:{drag:3,weight:.12},rub:.8,floored:!0,held:.2,stir:.03,thud:3.5,gap:.3};function ua(e,t,n,r,i,a,o,s){if(s){let e=-1.45,r=Math.cos(e),i=Math.sin(e),a=t*r-n*i,o=t*i+n*r;t=Math.max(a,0)+.15,n=o}let c=Math.cos(r),l=Math.sin(r);return[i+e*c+n*l,a+t,o-e*l+n*c]}function da(e,t,n=!1){let r=e.body;if(!r||!aa[e.model]||!Number.isFinite(r.mass))return null;let i=ca(e.model),a=i.names.length,o=[],s=[],c=e.down>0||e.rise>0;for(let t=0;t<a;t++)o.push(...ua(i.rest[t*3],i.rest[t*3+1],i.rest[t*3+2],e.yaw,r.x,r.y,r.z,c));return pa(e,i,o,s,t,c,n)}function fa(e){if(!e.body||!aa[e.model]||!Number.isFinite(e.body.mass))return null;let t=ca(e.model),n=[];for(let r=0;r<t.names.length;r++)n.push(...ua(t.rest[r*3],t.rest[r*3+1],t.rest[r*3+2],e.yaw,e.x,e.y,e.z,!0));return{kind:e.model,p:n,q:n.slice(),o:n.slice(),awake:!1,still:0,t:0,woke:0,heard:99,age:99}}function pa(t,n,r,i,a,o,s){let c=t.body,l=n.names.length,u=a&&a.v>0?a.ux:-Math.sin(t.yaw),d=a&&a.v>0?a.uz:-Math.cos(t.yaw),f=Math.hypot(u,d)||1;u/=f,d/=f;let p=a&&a.at&&a.v>0?la.local:0,m=c.vy,h=c.y;for(let e=0;e<l;e++)h=Math.min(h,r[e*3+1]-n.r[e]);let g=a?.way??{x:u,y:0,z:d},_=Math.hypot(g.x,g.y,g.z)||1,v=a?.v??0,y=c.vx-u*v,b=c.vz-d*v,x=s?v:Math.min(la.shove,v*Math.max(0,(g.x*u+g.z*d)/_));for(let e=0;e<l;e++){let t=(r[e*3+1]-h)/n.ht-.5,a=(o?0:la.slump*t)+x*(1-p)*(1+(o?0:la.tip*t));i.push(y+u*a,m,b+d*a)}if(p&&a?.at){let e=a.at,t=(s?v:Math.min(la.shove,v))*c.mass*p,o=[],u=0,d=1/0,f=0;for(let t=0;t<l;t++){let i=Math.hypot(r[t*3]-e.x,r[t*3+1]-e.y,r[t*3+2]-e.z);i<d&&(d=i,u=t);let a=Math.max(0,1-i/la.spread);o.push(a*a),f+=a*a*n.kg[t]}f<=0&&(o[u]=1,f=n.kg[u]);for(let e=0;e<l;e++){if(!o[e])continue;let n=Math.min(la.most,t*o[e]/f);i[e*3]+=g.x/_*n,i[e*3+1]+=g.y/_*n,i[e*3+2]+=g.z/_*n}}let S=r.map((t,n)=>t-i[n]*e),C=a?.at?Fa(n,r,a.at):void 0;return{kind:t.model,p:r,q:S,o:r.slice(),awake:!0,still:0,t:0,woke:0,heard:99,age:0,...C===void 0?{}:{wound:C}}}var ma=e=>e.kind===`body`;function ha(e){let t=ca(e.kind),n=0,r=0,i=1/0;for(let i of t.mid)n+=e.p[i*3],r+=e.p[i*3+2];for(let n=0;n<t.names.length;n++)i=Math.min(i,e.p[n*3+1]-t.r[n]);return{x:n/t.mid.length,y:i,z:r/t.mid.length}}function ga(e){let t=ca(e.kind),{p:n,o:r}=e,i=0;for(let e=0;e<t.names.length;e++){let a=e*3;i+=t.kg[e]*((n[a]-r[a])**2+(n[a+1]-r[a+1])**2+(n[a+2]-r[a+2])**2)}return Math.sqrt(i/t.mass)/Aa}function _a(e){let t=e.cast.filter(e=>e.rag);if(!t.length)return;let n=new Map(t.map(e=>[e.rag,e])),r=Ca(e),i=e.cast.filter(e=>!e.dead&&e.body).map(e=>e.body);i.push(e.player.body);for(let n of t){let t=n.rag;if(n.dead&&(n.px=n.x,n.py=n.y,n.pz=n.z),t.awake)continue;let a=ba(t);(r.some(e=>xa(a,e,.1))||i.some(e=>Sa(a,e)&&wa(t,e)))&&ya(t,e.tick)}let a=0;for(let e of t)e.rag.awake&&a++;for(;a>la.budget;){let e=null;for(let n of t)n.dead&&n.rag.awake&&n.rag.t>la.down&&(!e||n.rag.woke<e.woke)&&(e=n.rag);if(!e)break;va(e),a--}let o=t.filter(e=>e.rag.awake).map(e=>e.rag);for(let t of o)Ma(e,t,n.get(t));for(let e of o)for(let t of i)t!==n.get(e).body&&Ta(e,t);let s=new Map(t.map(e=>[e.rag,ba(e.rag)]));o.forEach((n,r)=>{let i=s.get(n);for(let a of t){let t=a.rag,c=o.indexOf(t);t!==n&&(c<0||c>r)&&xa(i,s.get(t))&&Ea(n,t,e.tick)}});for(let e of o)for(let t of r)Da(e,t);for(let n of t){let t=n.rag;if(!t.awake||(ja.has(t)&&Ua(e,t,!n.dead),!n.dead))continue;let r=ha(t);n.x=r.x,n.y=r.y,n.z=r.z}}function va(e){e.awake=!1;for(let t=0;t<e.p.length;t++)e.q[t]=e.o[t]=e.p[t]}function ya(e,t){e.awake||(e.awake=!0,e.still=0,e.t=0,e.woke=t)}function ba(e){let t=ca(e.kind),n={x0:1/0,y0:1/0,z0:1/0,x1:-1/0,y1:-1/0,z1:-1/0};for(let r=0;r<t.names.length;r++){let i=r*3,a=t.r[r];n.x0=Math.min(n.x0,e.p[i]-a),n.x1=Math.max(n.x1,e.p[i]+a),n.y0=Math.min(n.y0,e.p[i+1]-a),n.y1=Math.max(n.y1,e.p[i+1]+a),n.z0=Math.min(n.z0,e.p[i+2]-a),n.z1=Math.max(n.z1,e.p[i+2]+a)}return n}var xa=(e,t,n=0)=>e.x0<t.x1+n&&e.x1>t.x0-n&&e.y0<t.y1+n&&e.y1>t.y0-n&&e.z0<t.z1+n&&e.z1>t.z0-n,Sa=(e,t)=>e.x0<t.x+t.r&&e.x1>t.x-t.r&&e.y0<t.y+t.h&&e.y1>t.y&&e.z0<t.z+t.r&&e.z1>t.z-t.r;function Ca(e){let t=[];for(let n of e.doors)n.t!==(n.def.stuck?n.t:+!!n.open)&&t.push(n.dyn);for(let n of e.platforms)n.moving&&t.push(n.dyn);for(let n of e.loose.all)n.awake&&t.push(n.dyn);return t}function wa(e,t){let n=ca(e.kind),{p:r}=e;for(let e=0;e<n.names.length;e++){let i=e*3;if(!(r[i+1]+n.r[e]<t.y||r[i+1]-n.r[e]>t.y+t.h)&&Math.hypot(r[i]-t.x,r[i+2]-t.z)<t.r+n.r[e]-la.stir)return!0}return!1}function Ta(e,t){if(!Number.isFinite(t.mass))return;let n=ca(e.kind),r=t.mass/(t.mass+n.mass),{p:i}=e;for(let e=0;e<n.names.length;e++){let a=e*3,o=i[a+1];if(o+n.r[e]<t.y||o-n.r[e]>t.y+t.h)continue;let s=i[a]-t.x,c=i[a+2]-t.z,l=Math.hypot(s,c),u=t.r+n.r[e]-l;u<=0||l<1e-6||(i[a]+=s/l*u*r,i[a+2]+=c/l*u*r)}}function Ea(e,t,n){let r=ca(e.kind),i=ca(t.kind);for(let a=0;a<r.names.length;a++)for(let o=0;o<i.names.length;o++){let s=a*3,c=o*3,l=t.p[c]-e.p[s],u=t.p[c+1]-e.p[s+1],d=t.p[c+2]-e.p[s+2],f=r.r[a]+i.r[o],p=l*l+u*u+d*d;if(p>=f*f||p<1e-12)continue;let m=Math.sqrt(p),h=f-m;!t.awake&&h>la.stir&&ya(t,n);let g=r.w[a],_=ja.has(t)?i.w[o]:0,v=h/(m*(g+_));e.p[s]-=l*v*g,e.p[s+1]-=u*v*g,e.p[s+2]-=d*v*g,t.p[c]+=l*v*_,t.p[c+1]+=u*v*_,t.p[c+2]+=d*v*_;let y=l/m,b=u/m,x=d/m,S=e.p[s]-e.q[s]-(t.p[c]-t.q[c]),C=e.p[s+1]-e.q[s+1]-(t.p[c+1]-t.q[c+1]),w=e.p[s+2]-e.q[s+2]-(t.p[c+2]-t.q[c+2]),T=S*y+C*b+w*x;S-=y*T,C-=b*T,w-=x*T;let E=Math.hypot(S,C,w);if(E<1e-9)continue;let D=Math.min(1,la.rub*h/E)/(g+_);e.q[s]+=S*D*g,e.q[s+1]+=C*D*g,e.q[s+2]+=w*D*g,t.q[c]-=S*D*_,t.q[c+1]-=C*D*_,t.q[c+2]-=w*D*_}}function Da(e,t){let n=ca(e.kind),{p:r}=e;for(let i=0;i<n.names.length;i++){let a=i*3,o=n.r[i],s=[t.x1+o-r[a],r[a]-(t.x0-o),t.y1+o-r[a+1],r[a+1]-(t.y0-o),t.z1+o-r[a+2],r[a+2]-(t.z0-o)];if(s.some(e=>e<=0))continue;let c=0;for(let e of[1,2,4,5])s[e]<s[c]&&(c=e);let l=c>>1,u=c&1?-1:1;r[a+l]+=u*s[c],e.o[a+l]=r[a+l],ja.get(e).moved[i]=1}}function Oa(e,t,n,r,i){let a=ca(e.kind),o=a.names.length,s=[],c=Math.hypot(n.x,n.y,n.z)||1,l=0,u=0,d=1/0;for(let n=0;n<o;n++){let r=Math.hypot(e.p[n*3]-t.x,e.p[n*3+1]-t.y,e.p[n*3+2]-t.z),i=Math.max(0,1-r/la.spread);r<d&&(d=r,u=n),s.push(i*i),l+=i*i*a.kg[n]}l<=0&&(s[u]=1,l=a.kg[u]),ya(e,i),e.wound=u;let f=r*(1-la.local)/a.mass;for(let t=0;t<o;t++){let i=Math.min(la.most,f+r*la.local*s[t]/l)*Aa/c;e.q[t*3]-=n.x*i,e.q[t*3+1]-=n.y*i,e.q[t*3+2]-=n.z*i}}function ka(e,t,n,r=0){let i=ca(e.kind),a=n.x-t.x,o=n.y-t.y,s=n.z-t.z,c=a*a+o*o+s*s||1,l=null;for(let n=0;n<i.names.length;n++){let u=n*3,d=e.p[u],f=e.p[u+1],p=e.p[u+2],m=Math.max(0,Math.min(1,((d-t.x)*a+(f-t.y)*o+(p-t.z)*s)/c)),h=i.r[n]+r;Math.hypot(t.x+a*m-d,t.y+o*m-f,t.z+s*m-p)<h&&(!l||m<l.t)&&(l={t:m,at:{x:d,y:f,z:p}})}return l}var Aa=e,ja=new WeakMap;function Ma(e,t,n){let r=e.world,i=ca(t.kind),a=i.names.length,{p:o,q:s,o:c}=t,l=ja.get(t);l||ja.set(t,l={floor:new Float64Array(a),wet:new Uint8Array(a),press:new Float64Array(a),rubbed:new Float64Array(a),sink:new Float64Array(a),moved:new Uint8Array(a)});let{floor:u,wet:d,press:f,rubbed:p,sink:m}=l;l.moved.fill(0);for(let e=0;e<a;e++){let t=e*3,n=o[t],a=o[t+1],s=o[t+2],l=i.r[e];c[t]=n,c[t+1]=a,c[t+2]=s,u[e]=r.groundBelow(Nn(n,s,l*.6,l*.6),a-l*.4,ma),d[e]=+(r.waterAt(n,s)>a)}let h=la.gravity*Aa*Aa,g=0,_=0,v=0;for(let e=0;e<a;e++){let t=e*3,n=i.kg[e]/i.mass;g+=(o[t]-s[t])*n,_+=(o[t+1]-s[t+1])*n,v+=(o[t+2]-s[t+2])*n}for(let e=0;e<a;e++){let n=e*3,r=d[e]?la.air*(1-la.water.drag*Aa):la.air,i=t.limp?la.slack:la.joint,a=(g+(o[n]-s[n]-g)*i)*r,c=(_+(o[n+1]-s[n+1]-_)*i)*r,l=(v+(o[n+2]-s[n+2]-v)*i)*r;s[n]=o[n],s[n+1]=o[n+1],s[n+2]=o[n+2],o[n]+=a,o[n+1]+=c-h*(d[e]?la.water.weight:1),o[n+2]+=l,f[e]=0,p[e]=0,m[e]=-c/Aa}if(!n.dead&&n.body&&!t.limp){let e=0,t=0;for(let n of i.mid)e+=o[n*3],t+=o[n*3+2];let r=(n.body.x-e/i.mid.length)*la.held,s=(n.body.z-t/i.mid.length)*la.held;for(let e=0;e<a;e++)o[e*3]+=r,o[e*3+2]+=s}Pa(t,i,!n.dead&&!t.limp),t.limp||(za(e,t,i,n),Va(e,t,i,n));let y=i.sticks,b=i.apart,x=i.hinge,S=i.w;for(let e=0;e<la.iters;e++){for(let e=0;e<y.length;e+=3)Ga(o,S,y[e],y[e+1],y[e+2],!1);for(let e=0;e<b.length;e+=3)Ga(o,S,b[e],b[e+1],b[e+2],!0);for(let e=0;e<x.length;e+=6)Ka(o,S,x[e],x[e+1],x[e+2],x[e+3],x[e+4],x[e+5]);if(t.pin){let e=t.pin.i*3;o[e]=t.pin.x,o[e+1]=t.pin.y,o[e+2]=t.pin.z}for(let e=0;e<a;e++){let t=e*3,n=u[e]+i.r[e];if(o[t+1]>=n)continue;let r=n-o[t+1],a=o[t]-c[t],s=o[t+2]-c[t+2],l=Math.sqrt(a*a+s*s);f[e]+=r,o[t+1]=n;let d=Math.min(l,la.friction*f[e]-p[e]);l>0&&d>0&&(o[t]-=a/l*d,o[t+2]-=s/l*d,p[e]+=d)}}}function Na(e,[t,n,r]){let i=e[n*3]-e[t*3],a=e[n*3+1]-e[t*3+1],o=e[n*3+2]-e[t*3+2],s=Math.sqrt(i*i+a*a+o*o)||1;i/=s,a/=s,o/=s;let c=e[r*3]-e[t*3],l=e[r*3+1]-e[t*3+1],u=e[r*3+2]-e[t*3+2],d=a*u-o*l,f=o*c-i*u,p=i*l-a*c,m=Math.sqrt(d*d+f*f+p*p)||1;return d/=m,f/=m,p/=m,[i,a,o,f*o-p*a,p*i-d*o,d*a-f*i,d,f,p]}function Pa(e,t,n){if(!t.core)return;let r=la.tone,i=e.age??99,a=Math.max(0,1-i/r.last),o=Math.max(r.start*a*a,n?r.alive:0);if(o<=0)return;let{p:s}=e,c=Na(s,t.core),l=t.frame0,u=[0,1,2].map(e=>(s[t.core[0]*3+e]+s[t.core[1]*3+e]+s[t.core[2]*3+e])/3);for(let e=0;e<t.names.length;e++){let n=t.rest[e*3]-t.c0[0],r=t.rest[e*3+1]-t.c0[1],i=t.rest[e*3+2]-t.c0[2],a=n*l[0]+r*l[1]+i*l[2],d=n*l[3]+r*l[4]+i*l[5],f=n*l[6]+r*l[7]+i*l[8],p=o*t.tone[e],m=e*3;s[m]+=(u[0]+a*c[0]+d*c[3]+f*c[6]-s[m])*p,s[m+1]+=(u[1]+a*c[1]+d*c[4]+f*c[7]-s[m+1])*p,s[m+2]+=(u[2]+a*c[2]+d*c[5]+f*c[8]-s[m+2])*p}}function Fa(e,t,n){let r=0,i=1/0;for(let a=0;a<e.names.length;a++){let e=(t[a*3]-n.x)**2+(t[a*3+1]-n.y)**2+(t[a*3+2]-n.z)**2;e<i&&(i=e,r=a)}return r}var Ia={latency:.08,brace:{pull:.2,lean:.35,alive:.5},clutch:{pull:.15,from:.1,to:.7},guard:{pull:.25,time:.6},writhe:{amp:.12,hz:2.5,time:1.6},most:4};function La(e,t,n,r,i,a,o){let s=i-e.c0[0],c=a-e.c0[1],l=o-e.c0[2],u=s*n[0]+c*n[1]+l*n[2],d=s*n[3]+c*n[4]+l*n[5],f=s*n[6]+c*n[7]+l*n[8];return[r[0]+u*t[0]+d*t[3]+f*t[6],r[1]+u*t[1]+d*t[4]+f*t[7],r[2]+u*t[2]+d*t[5]+f*t[8]]}function Ra(e,t,n,r,i,a){let o=t*3,s=(n-e[o])*a,c=(r-e[o+1])*a,l=(i-e[o+2])*a,u=Math.sqrt(s*s+c*c+l*l),d=Ia.most*Aa,f=u>d?d/u:1;e[o]+=s*f,e[o+1]+=c*f,e[o+2]+=l*f}function za(e,t,n,r){let i=Ia,a=t.age??99,o=!r.dead,{p:s}=t;if((t.guard??0)>0&&(t.guard=Math.max(0,t.guard-Aa)),a<i.latency||(n.writhe&&!o&&a<i.writhe.time&&Ha(t,n,a),!n.core))return;let c=Na(s,n.core),l=n.frame0,u=La(n,c,l,[0,0,0],n.c0[0],n.c0[1]+1,n.c0[2]),d=La(n,c,l,[0,0,0],n.c0[0],n.c0[1],n.c0[2]+1),f=Math.hypot(u[0],u[2]),p=-1;if(!o&&t.wound!==void 0&&a>i.clutch.from&&a<i.clutch.to){let e=1/0,r=[0,1,2].map(e=>n.rest[t.wound*3+e]);n.hands.forEach((t,i)=>{let a=[0,1,2].map(e=>n.rest[t.from*3+e]),o=[0,1,2].map(e=>n.rest[t.hand*3+e]).map((e,t)=>e-a[t]),s=Math.max(0,Math.min(1,o.reduce((e,t,n)=>e+t*(r[n]-a[n]),0)/o.reduce((e,t)=>e+t*t,0)));if(Math.hypot(...[0,1,2].map(e=>a[e]+o[e]*s-r[e]))<.15)return;let c=Math.hypot(...[0,1,2].map(e=>a[e]-r[e]));c<e&&(e=c,p=i)})}let m=n.at.head??n.at.hd;n.hands.forEach((n,r)=>{if(o&&(t.guard??0)>0&&m!==void 0){let e=m*3;Ra(s,n.hand,s[e]+d[0]*.18,s[e+1]+d[1]*.18,s[e+2]+d[2]*.18,i.guard.pull)}else if(r===p){let e=t.wound*3,r=n.from*3,o=1-(a-i.clutch.from)/(i.clutch.to-i.clutch.from),c=s[e]-s[r],l=s[e+1]-s[r+1],u=s[e+2]-s[r+2],f=Math.hypot(c,l,u)||1;c=c/f+d[0]*.5,l=l/f+d[1]*.5,u=u/f+d[2]*.5;let p=Math.hypot(c,l,u)||1,m=n.reach;Ra(s,n.hand,s[r]+c/p*m,s[r+1]+l/p*m,s[r+2]+u/p*m,i.clutch.pull*o)}else if(o&&f>i.brace.lean&&a<i.brace.alive){let t=1-a/i.brace.alive,r=n.from*3,o=u[0]/f*.7,c=u[2]/f*.7,l=n.reach*.95,d=s[r]+o*l,p=s[r+1]-.7*l,m=s[r+2]+c*l,h=e.world.raycast(s[r],s[r+1],s[r+2],d,p,m,ma);Ra(s,n.hand,s[r]+(d-s[r])*h,s[r+1]+(p-s[r+1])*h,s[r+2]+(m-s[r+2])*h,i.brace.pull*t)}})}var Ba={slack:.12,lift:.12,time:.22,reach:.55,upright:.045,alive:.45,steps:2,give:1.5};function Va(e,t,n,r){let i=Ba,a=t.age??99,{p:o}=t;if(r.dead||!n.legs.length)return;if(a>i.alive){if(t.stride!==void 0&&a-Aa<=i.alive&&n.core){let e=La(n,Na(o,n.core),n.frame0,[0,0,0],n.c0[0],n.c0[1],n.c0[2]+1);for(let t of n.legs){let n=t.knee*3;o[n]+=e[0]*i.give*Aa,o[n+1]-=i.give*.5*Aa,o[n+2]+=e[2]*i.give*Aa}}t.stride=null;return}t.stride===void 0&&(t.stride=null);let s=i.steps,c=t.steps??0,l=0,u=0,d=0,f=0,p=0;for(let e=0;e<n.names.length;e++){let r=e*3,i=n.kg[e]/n.mass;l+=o[r]*i,u+=o[r+1]*i,d+=o[r+2]*i,f+=(o[r]-t.q[r])/Aa*i,p+=(o[r+2]-t.q[r+2])/Aa*i}let m=n.legs.map(e=>[o[e.foot*3],o[e.foot*3+1],o[e.foot*3+2]]),h=m.reduce((e,t)=>e+t[0],0)/m.length,g=m.reduce((e,t)=>e+t[2],0)/m.length,_=Math.min(...m.map(e=>e[1])),v=Math.max(.2,u-_),y=Math.sqrt(v/la.gravity),b=l+f*y,x=d+p*y,S=i.upright*(1-a/i.alive);for(let e=0;e<n.names.length;e++){let t=e*3,n=Math.max(0,(o[t+1]-_)/v);o[t]+=(h-l)*S*n,o[t+2]+=(g-d)*S*n}if(!t.stride&&c<s&&Math.hypot(b-h,x-g)>i.slack){let e=0,r=-1;n.legs.forEach((t,n)=>{let i=Math.hypot(m[n][0]-b,m[n][2]-x);i>r&&(r=i,e=n)});let a=n.legs[e],s=o[a.hip*3],c=o[a.hip*3+2],l=b-s,u=x-c,d=Math.hypot(l,u),f=a.len*i.reach;d>f&&(l*=f/d,u*=f/d),t.stride={leg:e,x0:m[e][0],z0:m[e][2],x1:s+l,z1:c+u,s:0}}let C=t.stride;if(!C)return;C.s=Math.min(1,C.s+Aa/i.time);let w=n.legs[C.leg],T=C.s*C.s*(3-2*C.s),E=C.x0+(C.x1-C.x0)*T,D=C.z0+(C.z1-C.z0)*T,O=n.r[w.foot],k=e.world.groundBelow(Nn(E,D,O*.6,O*.6),o[w.hip*3+1],ma);Ra(o,w.foot,E,k+O+i.lift*Math.sin(Math.PI*C.s),D,.5),C.s>=1&&(t.stride=null,t.steps=c+1)}function Ha(e,t,n){let r=Ia.writhe,{p:i}=e,a=t.names.length,o=1-n/r.time,s=r.hz*Math.PI*2,c=[],l=0,u=0;for(let e=0;e<a;e++){let d=Math.max(0,e-1)*3,f=Math.min(a-1,e+1)*3,p=i[f]-i[d],m=i[f+2]-i[d+2],h=Math.hypot(p,m)||1,g=r.amp*s*Math.cos(s*n)*Math.cos(Math.PI*e/(a-1))*o*Aa;c.push(-m/h*g,p/h*g),l+=c[e*2]*t.kg[e],u+=c[e*2+1]*t.kg[e]}l/=t.mass,u/=t.mass;for(let e=0;e<a;e++)i[e*3]+=c[e*2]-l,i[e*3+2]+=c[e*2+1]-u}function Ua(e,t,n){let r=e.world,i=ca(t.kind),a=i.names.length,{p:o,q:s,o:c}=t,l=ja.get(t),u=0,d=0,f=0,p=0,m=0,h=[];for(let e=0;e<a;e++){let t=e*3,n=l.sink[e];qa(r,o,c,e,i.r[e],l)&&(n>d&&(d=n,f=o[t],p=o[t+1],m=o[t+2]),s[t+1]=o[t+1],h.push(e)),u+=i.kg[e]*((o[t]-c[t])**2+(o[t+1]-c[t+1])**2+(o[t+2]-c[t+2])**2)}for(let e of h){let t=e*3,n=o[t]-s[t],r=o[t+2]-s[t+2],i=Math.hypot(n,r),a=i>0?Math.max(0,1-Math.max(0,la.friction*l.press[e]-l.rubbed[e])/i):0;s[t]=o[t]-n*a,s[t+2]=o[t+2]-r*a}ja.delete(t),t.t+=Aa,t.heard+=Aa,t.age=(t.age??99)+Aa,d>la.thud&&t.heard>la.gap&&(t.heard=0,G(e.game,`thud`,{x:f,y:p,z:m},i.mass>150)),t.still=Math.sqrt(u/i.mass)/Aa<la.sleep.speed?t.still+Aa:0,!n&&(t.still>la.sleep.after||t.t>la.sleep.most&&Wa(i,o,l.floor))&&va(t)}function Wa(e,t,n){for(let r=0;r<e.names.length;r++)if(t[r*3+1]-e.r[r]<=n[r]+.02)return!0;return!1}function Ga(e,t,n,r,i,a){let o=n*3,s=r*3,c=e[s]-e[o],l=e[s+1]-e[o+1],u=e[s+2]-e[o+2],d=Math.sqrt(c*c+l*l+u*u);if(d<1e-9||a&&d>=i)return;let f=t[n],p=t[r],m=(d-i)/(d*(f+p));e[o]+=c*m*f,e[o+1]+=l*m*f,e[o+2]+=u*m*f,e[s]-=c*m*p,e[s+1]-=l*m*p,e[s+2]-=u*m*p}function Ka(e,t,n,r,i,a,o,s){let c=n*3,l=r*3,u=i*3,d=a*3,f=o*3,p=e[l]-e[c],m=e[l+1]-e[c+1],h=e[l+2]-e[c+2],g=e[f]-e[d],_=e[f+1]-e[d+1],v=e[f+2]-e[d+2],y=m*v-h*_,b=h*g-p*v,x=p*_-m*g,S=Math.sqrt(y*y+b*b+x*x);if(S<1e-9)return;y/=S,b/=S,x/=S;let C=((e[u]-e[l])*y+(e[u+1]-e[l+1])*b+(e[u+2]-e[l+2])*x)*s;if(C>=0)return;let w=t[r],T=t[i],E=C*s*w/(w+T),D=C*s*T/(w+T);e[u]-=y*D,e[u+1]-=b*D,e[u+2]-=x*D,e[l]+=y*E,e[l+1]+=b*E,e[l+2]+=x*E}function qa(e,t,n,r,i,a){let o=r*3,s=i*.6,c=n[o],l=n[o+2],u=a.press,d=t[o+1],f=!1,p=Nn(c,l,s,s),m=a.moved[r]?e.groundBelow(p,n[o+1]-i*.4,ma):a.floor[r];if(d-i<=m+1e-4)u[r]+=Math.max(0,m+i-d),d=m+i,f=!0;else if(d>n[o+1]){let t=e.ceilingAbove(p,n[o+1]+i*.4,ma,d+i+.05);d+i>t&&(d=Math.max(m+i,t-i))}let h=t[o],g=t[o+2],_=0,v=!1,y=!1;if(h!==c&&e.overlap(Nn(h,l,s,s),d-i*.4,d+i*.8,ma)&&(_+=Math.abs(h-c),h=c,v=!0),g!==l&&e.overlap(Nn(h,g,s,s),d-i*.4,d+i*.8,ma)&&(_+=Math.abs(g-l),g=l,y=!0),_>0&&!f){let e=d-n[o+1],t=v?0:h-c,r=y?0:g-l,i=Math.hypot(t,e,r);if(i>0){let a=Math.max(0,1-Math.min(la.grip*_,la.cling*la.gravity*Aa*Aa)/i);d=n[o+1]+e*a,h=c+t*a,g=l+r*a}}if(h!==c||g!==l){let t=e.groundBelow(Nn(h,g,s,s),d-i*.4,ma);d-i<=t+1e-4&&(u[r]+=Math.max(0,t+i-d),d=t+i,f=!0)}return t[o]=h,t[o+1]=d,t[o+2]=g,f}var Ja=e=>Math.cos(e*Math.PI/180),Ya={husk:{wind:.55,strike:.12,rec:.5,miss:.85,cd:.3,turn:10,lock:.7,creep:1.8,start:.85,reach:1,arc:Ja(55),lunge:.3,dmg:20,poise:20,shove:110,armour:{wind:0,strike:12},tell:`heave`},skitter:{wind:.5,strike:.1,rec:.4,miss:.7,cd:.45,turn:6,lock:.6,creep:0,start:.75,reach:.75,arc:Ja(35),lunge:.5,dmg:22,poise:18,shove:120,armour:{wind:10,strike:14},tell:`skit`},bigSkitter:{wind:.7,strike:.15,rec:.7,miss:1.1,cd:.6,turn:5,lock:.6,creep:0,start:1.1,reach:1.1,arc:Ja(45),lunge:.6,dmg:45,poise:34,shove:220,armour:{wind:18,strike:28},tell:`skit`,big:!0},thresher:{wind:.6,strike:.15,rec:.9,miss:1.3,cd:.4,turn:6,lock:.65,creep:1,start:.7,reach:.9,arc:Ja(70),lunge:.25,dmg:45,poise:45,shove:360,armour:{wind:30,strike:60},tell:`growl`,big:!0,wide:!0},worm:{wind:.3,strike:.08,rec:.25,miss:.4,cd:1,turn:8,lock:.5,creep:0,start:.7,reach:.75,arc:Ja(60),lunge:.15,dmg:12,poise:8,shove:30,armour:{wind:0,strike:0},tell:`rasp`},swimmer:{wind:.3,strike:.08,rec:.25,miss:.4,cd:.9,turn:8,lock:.5,creep:0,start:.7,reach:.75,arc:Ja(60),lunge:.2,dmg:15,poise:10,shove:30,armour:{wind:0,strike:0},tell:`rasp`}},Xa={you:30,husk:25,skitter:20,bigSkitter:40,worm:12,swimmer:12,thresher:70,bloat:1e9,other:30,calm:1,regain:.5};function Za(e,t,n,r){if(n<=0)return{r:`none`,left:e};let i=e-n;return i<=0?{r:`stagger`,left:t}:{r:n>r?`flinch`:`none`,left:i}}function Qa(e,t,n,r){return n<Xa.calm?e:Math.min(t,e+t*Xa.regain*r)}var $a={head:11,least:.6,most:1.8},eo=e=>Math.min($a.most,Math.max($a.least,1+e/$a.head)),to={you:70,arm:1.5,most:7},no={min:3,dmg:4,poise:6},ro={min:10,dmg:6,poise:8},io={dv:4.5,time:1,rise:.6,more:1.5},ao={dv:7,up:.45},oo={guard:25},so={poise:1.1};function co(e,t){return{poise:e===`fist`?4:e===`edge`?9*t:12*t,lunge:1+.6*t,miss:.15+.12*t}}var lo={you:.7,push:2.5,pace:.3},uo={from:.2,to:.6},fo={side:{from:40*Math.PI/180,to:-40*Math.PI/180,tilt:-8*Math.PI/180,near:1},chop:{from:50*Math.PI/180,to:-40*Math.PI/180,tilt:Math.PI/2,near:1},thrust:{from:0,to:0,tilt:0,near:.35}};function po(e,t,n){let r=Math.cos(n),i=Math.sin(n),a={x:-Math.sin(t)*r,y:i,z:-Math.cos(t)*r},o={x:Math.cos(t),y:0,z:-Math.sin(t)},s={x:o.y*a.z-o.z*a.y,y:o.z*a.x-o.x*a.z,z:o.x*a.y-o.y*a.x};return{p:{x:e.x-s.x*.25,y:e.y-s.y*.25,z:e.z-s.z*.25},f:a,r:o,u:s}}function mo(e,t,n,r,i=1){let a=fo[t];if(t===`thrust`){let t=n*i*(a.near+(1-a.near)*r);return{x:e.p.x+e.f.x*t,y:e.p.y+e.f.y*t,z:e.p.z+e.f.z*t}}let o=a.from+(a.to-a.from)*r,s=Math.cos(a.tilt),c=Math.sin(a.tilt),l={x:e.r.x*s+e.u.x*c,y:e.r.y*s+e.u.y*c,z:e.r.z*s+e.u.z*c},u=Math.cos(o),d=Math.sin(o),f=n*i;return{x:e.p.x+(e.f.x*u+l.x*d)*f,y:e.p.y+(e.f.y*u+l.y*d)*f,z:e.p.z+(e.f.z*u+l.z*d)*f}}var ho=e=>Math.min(1,Math.max(0,(e-uo.from)/(uo.to-uo.from)));function go(e,t,n,r,i,a,o){let s=t.x-e.x,c=t.z-e.z,l=e.x-n,u=e.z-r,d=s*s+c*c,f=2*(l*s+u*c),p=l*l+u*u-i*i,m;if(p<=0)m=0;else{if(d<1e-12)return null;let e=f*f-4*d*p;if(e<0||(m=(-f-Math.sqrt(e))/(2*d),m<0||m>1))return null}let h=e.y+(t.y-e.y)*m;return h>=a&&h<=o?m:null}var _o=1.8,vo=1.62,yo=.95,bo=.32,xo=6.3,So=.3,Co=1.3,wo=1.7,To=30,Eo=.05,Do=24,Oo=2,ko=e=>e.includes(`rebreather`)?150:35;function Ao(e,t,n,r,i){let a=Vr(e,t,n,r,bo,_o,75);return a.skip=a.dyn,{body:a,yaw:i,pitch:0,crouch:!1,wantStand:!1,moved:0,impact:0,water:`dry`,air:35,airMax:35,under:!1,slow:0,load:0,slam:0,thrown:!1,pace:1,down:!1,running:!1,jumped:!1,stepD:0,fly:!1}}var jo=e=>e.crouch?yo:vo;function Mo(e){return To*(e.water===`swimming`?.25:e.water===`wading`?.5:e.body.ground?1:.33)*Math.max(.5,1-Eo*e.load)}function No(e,t,n,r){let i=t.body;if(t.yaw+=n.yaw,t.pitch=a(t.pitch+n.pitch,-1.45,1.45),t.fly)return Po(t,n,r);ei(e,i);let o=e.waterAt(i.x,i.z),s=o-i.y;t.water=s>Co?`swimming`:s>So?`wading`:`dry`;let c=t.water===`swimming`;c?(t.crouch=!1,t.wantStand=!1):n.crouch&&(t.crouch?t.wantStand=!0:(t.crouch=!0,t.wantStand=!1)),t.down&&!c&&(t.crouch=!0,t.wantStand=!0),t.crouch&&t.wantStand&&!t.down&&Wr(e,i,i.x,i.z,i.y,1.8)&&(t.crouch=!1,t.wantStand=!1),t.jumped=!1,!c&&!t.down&&n.jump&&i.ground&&(!t.crouch||Wr(e,i,i.x,i.z,i.y,1.8))&&(t.jumped=!0,i.vy=xo,i.ground=!1,t.crouch=!1,t.wantStand=!1),i.h=t.crouch?1:_o;let l=a(n.forward,-1,1),u=a(n.strafe,-1,1),d=Math.hypot(l,u),f=n.run&&!t.crouch&&l>0&&t.water===`dry`,p=c?2.4:t.water===`wading`?2.2:t.crouch?1.6:f?5.6:3.2;t.running=f&&d>0,t.slow>0&&(t.slow-=r,p*=.35),p*=t.pace;let m=i.x,h=i.z;i.carried=!1;let g=0,_=0;if(d>0){let e=-Math.sin(t.yaw),n=-Math.cos(t.yaw),r=Math.cos(t.yaw),i=-Math.sin(t.yaw),a=p/Math.max(1,d);g=(e*l+r*u)*a,_=(n*l+i*u)*a}let v=Math.hypot(i.vx,i.vz)>p+.5;t.thrown=v,Yr(i,g,_,v?i.ground||t.water!==`dry`?Do:Oo:Mo(t),r);let y={dx:i.vx*r,dz:i.vz*r,speed:Math.hypot(i.vx,i.vz),wx:g,wz:_},{hit:b,slam:x}=Zr(e,i,r,c?wo:zr);if(t.slam=x,t.moved=Math.hypot(i.x-m,i.z-h),c){let c=e.ceilingAbove(Ur(i),i.y+i.h,i.skip,o)<=o,l=n.rise?2:n.sink?-2:c?0:a((s-Co-.05)*3,-1,1);i.vy+=(l-i.vy)*Math.min(1,r*6),t.impact=Qr(e,i,r,0).impact}else t.impact=Qr(e,i,r).impact;return t.under=i.y+jo(t)<e.waterAt(i.x,i.z),t.air=t.under?Math.max(0,t.air-r):Math.min(t.airMax,t.air+r*40),{stride:y,hit:b}}function Po(e,t,n){let r=e.body,i=t.run?18:7,o=a(t.forward,-1,1),s=a(t.strafe,-1,1);return r.x+=(-Math.sin(e.yaw)*o+Math.cos(e.yaw)*s)*i*n,r.z+=(-Math.cos(e.yaw)*o-Math.sin(e.yaw)*s)*i*n,r.y+=(+!!t.rise-!!t.sink)*i*n,r.vx=r.vz=r.vy=0,r.ground=!1,r.on=null,r.sync(),e.moved=0,e.impact=0,e.jumped=!1,e.running=!1,e.water=`dry`,e.under=!1,e.air=e.airMax,e.crouch=!1,{stride:{dx:0,dz:0,speed:0,wx:0,wz:0},hit:null}}var Fo=()=>({chg:-1,full:!1,go:!1,swing:null,line:null,rec:0,stop:0,gcd:0,kick:0,muzzle:0,held:!1,buf:0,poise:Xa.you,calm:99,stag:0,down:0,rise:0,side:1}),Io=.2,Lo=e,Ro=e=>e.player.water!==`dry`,zo=(e,t)=>(t.time+.15)*(Ro(e)?1.3:1),Bo=e=>co(e.kind,e.mass),Vo=e=>{let t=e.hands;return t.rec>0||t.stag>0||!!t.swing?.done},Ho=e=>{let t=e.hands;return t.down>0?0:t.stag>0||t.rise>0?lo.pace:1},Uo=e=>e.hands.down>0||e.hands.rise>0;function Wo(e,t){let n=e.hands,r=e.game,i=ii(r.weapon),a=Bo(i);n.gcd>0&&(n.gcd-=Lo),n.kick>0&&(n.kick=Math.max(0,n.kick-Lo*5)),n.muzzle>0&&(n.muzzle-=Lo),n.rec>0&&(n.rec-=Lo),n.stag>0&&(n.stag=Math.max(0,n.stag-Lo)),n.down>0?(n.down=Math.max(0,n.down-Lo),n.down===0&&(n.rise=io.rise)):n.rise>0&&(n.rise=Math.max(0,n.rise-Lo)),n.buf>0&&(n.buf-=Lo),n.calm+=Lo,n.poise=Qa(n.poise,Xa.you,n.calm,Lo);let o=t.attack&&!n.held,s=!t.attack&&n.held;if(n.held=t.attack,i.gun){n.chg=-1,n.swing=null,o&&n.stag<=0&&!Uo(e)&&os(e,i);return}let c=!n.swing&&n.chg<0&&n.rec<=0&&n.stag<=0&&!Uo(e);o&&!c&&(n.buf=Io),c&&(o||n.buf>0)&&(n.chg=0,n.full=!1,n.go=!t.attack,n.buf=0),n.chg>=0&&(n.chg+=Lo,s&&(n.go=!0),n.chg>=zo(e,i)&&!n.full&&(n.full=!0,n.go||G(r,`load`)),n.full&&n.go&&(n.chg=-1,n.full=!1,n.go=!1,n.swing={t:0,dur:(.2+.05*i.mass)*(Ro(e)?1.3:1),a:0,done:!1},n.line={yaw:e.player.yaw,pitch:e.player.pitch},G(r,`swing`)));let l=n.swing;if(l){n.stop>0?n.stop-=Lo:l.t+=Lo;let t=Math.min(1,l.t/l.dur);if(!l.done){let n=ho(t),r=n>l.a?ns(e,i,l.a,n):`none`;l.a=n,(r!==`none`||t>=uo.to)&&(l.done=!0,l.missed=r!==`hit`,r===`glance`&&(l.glance=t),r===`hit`&&(l.struck=t),Go(e,a))}t>=1&&(n.swing=null,n.line=null,l.missed&&(n.rec=a.miss))}}function Go(e,t){let n=e.hands.line;n&&e.player.body.ground&&qr(e.player.body,-Math.sin(n.yaw)*t.lunge,-Math.cos(n.yaw)*t.lunge)}function Ko(e,t,n,r=0){let i=e.hands,a=e.game,o=e.player.body;if(a.ended)return`none`;if(i.calm=0,i.down>0)return`down already`;let s=Za(i.poise,Xa.you,Math.max(0,t-(i.rise>0?oo.guard:0)),0);if(i.poise=s.left,s.r!==`stagger`)return s.r===`flinch`?`shrugged off`:`none`;if(r>=io.dv){if(i.down=io.time,i.rise=0,i.stag=0,n){let t={x:Math.cos(e.player.yaw),z:-Math.sin(e.player.yaw)};i.side=(o.x-n.x)*t.x+(o.z-n.z)*t.z>=0?1:-1}return r>=ao.dv&&qr(o,0,0,ao.up*r),G(a,`reel`),G(a,`land`,void 0,!1,0,1),a.events.push({type:`shake`,k:.6}),r>=ao.dv?`thrown`:`down`}if(i.stag=lo.you,G(a,`reel`),a.events.push({type:`shake`,k:.35}),n){let e=o.x-n.x,t=o.z-n.z,r=Math.hypot(e,t)||1;qr(o,e/r*lo.push,t/r*lo.push)}return`stagger`}var qo=e=>e.kind===`body`;function Jo(e){let t=e.player,n=t.body,r=Math.cos(t.pitch);return{ex:n.x,ey:n.y+jo(t),ez:n.z,fx:-Math.sin(t.yaw)*r,fy:Math.sin(t.pitch),fz:-Math.cos(t.yaw)*r}}var Yo={out:.12,r:.42,y0:.35,y1:2.55},Xo=e=>({x:e.x+Math.sin(e.yaw)*Yo.out,z:e.z+Math.cos(e.yaw)*Yo.out});function Zo(e){let t=e.player,n=t.body,r=e.hands.line??t;return po({x:n.x,y:n.y+jo(t),z:n.z},r.yaw,r.pitch)}var Qo=(e,t)=>t.reach/Math.max(.6,Math.cos((e.hands.line??e.player).pitch));function $o(e,t=16){if(!e.hands.swing||e.hands.swing.done)return null;let n=ii(e.game.weapon),r=Zo(e),i=Qo(e,n),a=[];for(let e=0;e<=t;e++)a.push(mo(r,n.shape,i,e/t));return a}var es=(e,t,n)=>({x:e.x+(t.x-e.x)*n,y:e.y+(t.y-e.y)*n,z:e.z+(t.z-e.z)*n}),ts=(e,t,n)=>e.world.raycast(t.x,t.y,t.z,n.x,n.y,n.z,qo);function ns(e,t,n,r){let i=e.game,a=e.player.body,o=Zo(e),s=Qo(e,t),c=t.shape,l=Math.max(1,Math.ceil((r-n)*8));for(let u=0;u<l;u++){let d=n+(r-n)*u/l,f=n+(r-n)*(u+1)/l,p=null,m=2,h=null,g=null,_=null,v=mo(o,c,s,d),y=mo(o,c,s,f),b=mo(o,c,s,f,.5);for(let n of e.cast)n.dead&&n.rag&&(rs(e,t,n,v,y,o)||rs(e,t,n,b,y,o,y.x-v.x,y.y-v.y,y.z-v.z));for(let t of[.5,.75,1]){let n=mo(o,c,s,d,t),r=mo(o,c,s,f,t);for(let t of e.cast){if(t.dead)continue;let i=Xo(t),a=t.model===`grabber`?go(n,r,i.x,i.z,Yo.r,t.y+Yo.y0,t.y+Yo.y1):go(n,r,t.x,t.z,t.r+.08,t.y,t.y+(t.body?.h??1));if(a===null||a>=m)continue;let s=es(n,r,a);ts(e,o.p,s)<1||(m=a,p=t,h=s,g=n,_=r)}}let x=ts(e,v,y),S=ts(e,o.p,y),C=x<1?es(v,y,x):S<1?es(o.p,y,S):null,w=!C||C.y<a.y+.3?2:x<1?x:1;if(p&&h&&g&&_&&m<=w)return is(e,t,p,g,_,h),`hit`;if(C&&w<=1){G(i,`blow`,C),yi(i,8),as(e,.8);let n=Ko(e,Bo(t).poise*so.poise,{x:C.x,z:C.z});return ci(i,`${e.game.weapon??`fists`} glanced off the wall  → ${n}  (poise ${(Bo(t).poise*so.poise).toFixed(0)}, ${e.hands.poise.toFixed(0)}/30 left)`),`glance`}}return`none`}function rs(e,t,n,r,i,a,o=i.x-r.x,s=i.y-r.y,c=i.z-r.z){let l=e.hands.swing;if(!l||l.knocked?.includes(n.id))return!1;let u=ka(n.rag,r,i,.05);if(!u||ts(e,a.p,u.at)<1)return!1;(l.knocked??=[]).push(n.id);let d=e.player.body,f=e.hands.line??e.player,p=-Math.sin(f.yaw),m=-Math.cos(f.yaw),h=Math.hypot(o,s,c)||1,g={x:p+o/h,y:s/h,z:m+c/h};return Oa(n.rag,u.at,g,to.you*(t.mass+to.arm)*eo(d.vx*p+d.vz*m),e.tick),G(e.game,`hit`,u.at),!0}function is(e,t,n,r,i,a){let o=e.player.body,s=e.hands.line??e.player,c=-Math.sin(s.yaw),l=-Math.cos(s.yaw),u=o.vx*c+o.vz*l,d=n.fixed?0:-((n.x-n.px)*c+(n.z-n.pz)*l)/Lo,f=Math.hypot(i.x-r.x,i.y-r.y,i.z-r.z)||1,p=c+(i.x-r.x)/f,m=l+(i.z-r.z)/f,h=Math.hypot(p,m);h<.1&&(p=c,m=l,h=1),cl(e,n,{dmg:t.dmg,poise:Bo(t).poise,shove:to.you*(t.mass+to.arm),dir:{x:p/h,z:m/h},by:e.game.weapon??`fists`,at:a,way:{x:i.x-r.x,y:i.y-r.y,z:i.z-r.z}},eo(u+d)),yi(e.game,10),as(e,1)}function as(e,t){e.hands.stop=.035+.035*t,e.game.events.push({type:`impact`,k:t})}function os(e,t){let n=e.hands,r=e.game;if(n.gcd>0)return;if(e.player.under){W(r,`It will not fire under water.`),n.gcd=.5;return}let i=r.inv.findIndex(e=>e.id===t.ammo);if(i<0){G(r,`deny`),W(r,`Empty.`),n.gcd=.5;return}ui(r,i);let o=t.dmg>50,s=t.range??20;n.gcd=t.cd??.5,n.kick=1,n.muzzle=.06,G(r,o?`boom`:`shot`),yi(r,36),r.events.push({type:`shake`,k:o?.3:.12});let c=Jo(e),l=null,u=1e9,d=0;for(let n of e.cast){if(n.dead)continue;let r=n.x-c.ex,i=n.z-c.ez,o=Math.hypot(r,i);if(o>s)continue;let f=n.model===`grabber`?a(c.ey+c.fy/(Math.hypot(c.fx,c.fz)||1)*o,n.y+Yo.y0,n.y+Yo.y1):n.y+Math.min(.9,(n.body?.h??1)*.6),p=f-c.ey;(r*c.fx+p*c.fy+i*c.fz)/Math.hypot(r,p,i)<(t.cone??.98)&&o>n.r+.8||e.world.raycast(c.ex,c.ey,c.ez,n.x,f,n.z,qo)<1||o<u&&(u=o,l=n,d=f)}l&&cl(e,l,{dmg:t.dmg*(o?a(1.2-u/s,.25,1):1),poise:o?60:22,shove:o?300:40,by:r.weapon??`gun`,at:{x:l.x,y:d,z:l.z},way:{x:c.fx,y:c.fy,z:c.fz}},1);let f={x:c.ex,y:c.ey,z:c.ez},p={x:c.ex+c.fx*s,y:c.ey+c.fy*s,z:c.ez+c.fz*s},m=e.world.raycast(f.x,f.y,f.z,p.x,p.y,p.z,qo),h={x:f.x+(p.x-f.x)*m,y:f.y+(p.y-f.y)*m,z:f.z+(p.z-f.z)*m},g=null;for(let t of e.cast){if(!t.rag)continue;let e=ka(t.rag,f,h);e&&(!g||e.t<g.t)&&(g={m:t,...e})}g&&Oa(g.m.rag,g.at,{x:c.fx,y:c.fy,z:c.fz},o?300:40,e.tick)}var ss={husk:{hp:75,r:.38,cr:.34,mass:1.2,kg:80,acc:18,h:1.8,opens:!0},nightround:{ai:`husk`,model:`husk`,hp:75,r:.38,cr:.34,mass:1.2,kg:80,acc:14,h:1.8,opens:!0,torch:!0},skitter:{hp:60,r:.5,cr:.4,mass:1,kg:45,acc:40,h:.9,low:!0},bloat:{hp:600,r:1,cr:.9,mass:8,kg:1/0,acc:3,h:2.4,noDoors:!0,solid:!0},thresher:{hp:150,r:.6,cr:.5,mass:2.5,kg:220,acc:10,h:2.1,solid:!0,noDoors:!0},worm:{hp:40,r:.35,cr:.3,mass:1,kg:25,acc:8,h:.6,low:!0},rootworm:{ai:`worm`,model:`worm`,green:!0,hp:40,r:.35,cr:.3,mass:1,kg:25,acc:8,h:.6,low:!0},swimmer:{ai:`swimmer`,model:`worm`,hp:40,r:.35,cr:.3,mass:1,kg:25,acc:10,h:.6,swim:!0},grabber:{hp:30,r:.4,cr:0,mass:1,kg:1/0,acc:0,h:0,fixed:!0},patient:{hp:20,r:.3,cr:.28,mass:1,kg:55,acc:6,h:1.75},vine:{ai:`grabber`,model:`grabber`,green:!0,hp:30,r:.4,cr:0,mass:1,kg:1/0,acc:0,h:0,fixed:!0}},cs={husk:`It beat you the way a person would. Patiently, and with both hands.`,skitter:`It folded itself over you, one limb at a time.`,worm:`They only ever wanted to hold you.`,thresher:`It opened, and you went in.`,swimmer:`The water closed over the last of the light.`,grabber:`The doorway closed its hands.`,bloat:`It sat on you. It did not seem to notice.`,patient:``},K=e;function ls(e,t){return t.filter(e=>ss[e.type]).map((t,n)=>us(e,t,n))}function us(e,t,n){let r=(t,n)=>e.rng.range(t,n);{let a=ss[t.type],o=t.opts,s=a.fixed?null:Vr(e.world,t.x,t.y,t.z,a.cr,a.h,a.kg),c=e.world.roomAt(t.x,t.y+.5,t.z)?.id??-1;return{id:n,type:t.type,ai:a.ai??t.type,model:a.model??t.type,green:!!a.green,body:s,x:t.x,y:t.y,z:t.z,px:t.x,py:t.y,pz:t.z,yaw:o.yaw??r(i),state:t.opts.state??`idle`,st:0,cd:0,stun:0,hp:a.hp,max:a.hp,mass:a.mass,r:a.r,walker:a.noDoors?`big`:a.opens?`hands`:`crawl`,opens:!!a.opens,low:!!a.low,noDoors:!!a.noDoors,fixed:!!a.fixed,swim:!!a.swim,solid:!!a.solid,post:!!o.post,sit:!!o.sit,holt:!!o.holt,big:!!o.big,hx:t.x,hz:t.z,room:c,cards:!!e.world.def.cards&&!!a.opens&&!!e.world.rooms[c]?.zone,door:-1,round:t.opts.round??null,beat:0,lap:0,peered:99,torch:!!a.torch,hide:t.opts.hide??null,drag:-1,trail:0,graft:0,grafted:!1,wt:r(1,5),wm:0,wx:0,wz:0,tk:0,lost:0,bt:0,burst:!1,flee:0,ct:r(6,14),cdir:0,tgt:!1,grab:0,tense:0,blow:null,dest:-1,F:null,stk:0,fled:!1,side:0,ride:null,spot:-1,mv:0,d:99,dp:99,dy:0,los:!1,losAt:-99,hit:0,poise:fs(t.type,a.ai,!!o.big),pmax:fs(t.type,a.ai,!!o.big),calm:99,reel:0,pat:0,down:0,rise:0,acc:a.acc,drove:!1,ph:r(9),dead:!1,gone:0,rag:null,away:!1,still:0}}}function ds(e,t,n,r,i,a={}){if(!ss[t])return null;let o=us(e,{type:t,x:n,y:r,z:i,opts:a},e.cast.length);return o.yaw=Math.atan2(e.player.body.x-n,e.player.body.z-i),e.cast.push(o),e.fields||(e.fields=Vi(e),ia(e,e.fields)),o.ai===`husk`||o.ai===`skitter`?(o.state=`hunt`,o.lost=0):o.ai===`thresher`&&(o.state=`pursue`,o.st=1e9),o}function fs(e,t,n){let r=Xa;return(t??e)===`skitter`&&n?Xa.bigSkitter:r[e]??r[t??``]??Xa.other}var ps=e=>e.cast.filter(e=>!e.dead&&e.body).map(e=>e.body),ms=e=>e.cast.filter(e=>!e.dead&&e.body&&!e.noDoors).map(e=>e.body),hs=e=>e.kind===`body`||!!e.glass;function gs(e,t){if(e.tick-t.losAt<6)return t.los;t.losAt=e.tick;let n=e.player.body,r=t.fixed?2:Math.min(1.6,(t.body?.h??1)*.85);return t.los=e.world.raycast(t.x,t.y+r,t.z,n.x,n.y+jo(e.player)*.9,n.z,hs)>=1,t.los}var _s=(e,t,n)=>t.d<n*e.game.vis&&gs(e,t);function vs(e,t){let n=e.game;return n.noise<=0||!e.fields?!1:t.spot>=0?e.fields.sound[t.spot]<n.noise:t.d<n.noise*.5}function ys(e,t){let n=e.player,r=n.body,i=Math.cos(n.pitch),a=-Math.sin(n.yaw)*i,o=Math.sin(n.pitch),s=-Math.cos(n.yaw)*i,c=t.x-r.x,l=t.y+.3-(r.y+jo(n)),u=t.z-r.z,d=Math.hypot(c,l,u)||1;return(c*a+l*o+u*s)/d>.82&&gs(e,t)}function bs(e,t,n,r,i=t.acc){let a=t.body,o=e.player.body,s=Math.hypot(n,r),c=Math.hypot(a.vx,a.vz)>s+.5;a.carried||Yr(a,n,r,c?al:i,K);let l=a.vx,u=a.vz,d=a.x,f=a.z,p=Zr(e.world,a,K);p.hit===o.dyn?Xr(a,o,l,u,n,r,c):c&&p.hit&&(p.hit===`world`||p.hit.kind!==`body`)&&p.slam>no.min&&dl(e,t,p.slam-no.min,no),t.x=a.x,t.z=a.z,t.drove=!0;let m=Math.hypot(a.x-d,a.z-f);return t.mv=m/K>.2?m/K:0,{...p,moved:m,pre:Math.hypot(l,u)*K}}function xs(e,t,n,r,i){let a=t.body;if(!a)return!1;let o=n-a.x,c=r-a.z,l=Math.hypot(o,c);if(l<.05)return bs(e,t,0,0),!0;o/=l,c/=l,t.yaw=s(t.yaw,Math.atan2(o,c),Math.min(1,K*8));let u=e.player.body,d=Math.hypot(a.vx,a.vz),f=d*d/(2*Math.max(1,t.acc)),p=i*K+f,m=a.x+o*p,h=a.z+c*p,g=Math.hypot(m-u.x,h-u.z);if(Math.abs(t.dy)<1.5&&g<t.r+.3&&g<t.dp)return bs(e,t,0,0),!0;let _=Math.min(i,Math.sqrt(2*Math.max(1,t.acc)*l)),v=bs(e,t,o*_,c*_);if(v.hit&&v.hit!==u.dyn&&v.moved<v.pre*.3&&v.pre>.001){let n=Math.max(v.pre,_*K*.5);t.side||=e.rng.chance(.5)?1:-1;for(let r of[t.side,-t.side]){let s=a.x,l=a.z;if(Gr(e.world,a,c*n*r,-o*n*r),Math.hypot(a.x-s,a.z-l)>=n*.3)return t.side=r,t.x=a.x,t.z=a.z,t.mv=i,!1}return!1}return t.side=0,!0}function Ss(e,t,n){return n.t>.9||t.walker===`crawl`&&n.def.stuck?`go`:Ui(n,si(e.game,n.def.circuit))?`wait`:t.cards&&Gi(e,n)?(n.open||(n.open=!0,G(e.game,`take`,{x:(n.def.x0+n.def.x1)/2,y:n.def.y0+1.2,z:(n.def.z0+n.def.z1)/2})),n.pass=Math.max(n.pass,2.5),`wait`):t.opens&&!Wi(n)?(n.open||(n.open=!0,n.hold=3,G(e.game,`door`,{x:(n.def.x0+n.def.x1)/2,y:n.def.y0,z:(n.def.z0+n.def.z1)/2})),`wait`):`no`}function Cs(e,t,n,r,i){let a=e.fields;if(!a||!t.body)return!1;if(t.ride)return Ts(e,t,a);let o=a.nav,s=t.spot;if(s<0)return!1;let c=Ji(e,a,t.walker,t.cards),l=i?n[s]:1/0,u=-1,d=-1;if(i&&!Number.isFinite(l))return!1;for(let e=o.start[s];e<o.start[s+1];e++){let t=o.to[e],r=n[t];if(!Number.isFinite(r))continue;let a=Mr(o,c,e,t);if(a===null)continue;let s=i?r:r+a;(i?s>l:s<l)&&(l=s,u=t,d=e)}if(u<0)return!1;if(o.kind[d]===Dr.Lift)return t.ride={lift:o.lift[d],up:o.y[u]>o.y[s],to:u,t:0},Ts(e,t,a);let f=o.door[u];if(f>=0){let n=Ss(e,t,e.doors[f]);if(n===`no`)return!1;if(n===`wait`)return t.mv=0,!0}let p=a.onLift[u];if(p>=0&&a.onLift[s]!==p){let n=e.platforms[p];if(n.moving||n.y>n.def.y0+.01)return ws(e,t,p,0),t.mv=0,!0}return xs(e,t,o.x[u],o.z[u],r)}function ws(e,t,n,r){let i=e.platforms[n],a=i.def.call;!a||!t.opens||i.moving||si(e.game,a.circuit)<=0||Math.abs(i.y-(r?i.def.y1:i.def.y0))<.01||(ji(i,r),G(e.game,`door`,{x:(i.def.x0+i.def.x1)/2,y:i.y,z:(i.def.z0+i.def.z1)/2}))}function Ts(e,t,n){let r=t.ride,i=e.platforms[r.lift],a=i.def,o=t.body,s=n.nav,c=+!r.up,l=+!!r.up,u=l?a.y1:a.y0,d=e=>!i.moving&&Math.abs(i.y-(e?a.y1:a.y0))<.01;if(r.t+=K,r.t>25)return t.ride=null,!1;let f=s.locate(o.x,o.y,o.z);if(f===r.to||f>=0&&Math.abs(s.y[f]-u)<.4&&n.onLift[f]!==r.lift&&o.on!==i.dyn)return t.ride=null,!0;if(o.on===i.dyn){if(d(l))return xs(e,t,s.x[r.to],s.z[r.to],1.8);let n=(a.x0+a.x1)/2,c=(a.z0+a.z1)/2;return Math.hypot(o.x-n,o.z-c)>.25?xs(e,t,n,c,1.8):(i.moving||ws(e,t,r.lift,l),t.mv=0,!0)}return d(c)?xs(e,t,(a.x0+a.x1)/2,(a.z0+a.z1)/2,1.8):(ws(e,t,r.lift,c),t.mv=0,!0)}function Es(e,t,n,r){let i=e.player.body;return t.dp<7&&Math.abs(t.dy)<1&&gs(e,t)&&!(r[t.spot]>t.dp*1.3+1.5)?xs(e,t,i.x,i.z,n):Cs(e,t,r,n,!1)}function Ds(e,t,n,r){let i=e.player.body;if(e.fields&&Cs(e,t,r??e.fields.crawl,n,!0))return!0;let a=t.x-i.x,o=t.z-i.z,s=Math.hypot(a,o)||1;return xs(e,t,t.x+a/s*2,t.z+o/s*2,n)}function Os(e,t,n){let r=bs(e,t,Math.sin(t.cdir)*n,Math.cos(t.cdir)*n,ks);return t.yaw=t.cdir,r.hit&&r.hit!==e.player.body.dyn&&(r.slam>1||r.moved<r.pre*.6)?(r.slam>no.min&&dl(e,t,r.slam-no.min,no),!1):!0}var ks=16;function As(e,t){let n=e.world.rooms[t.room];if(!n){t.wx=t.hx,t.wz=t.hz;return}let r=Math.min(t.r+.3,(n.x1-n.x0)/2,(n.z1-n.z0)/2);t.wx=e.rng.range(n.x0+r,n.x1-r),t.wz=e.rng.range(n.z0+r,n.z1-r)}var js=new WeakMap;function Ms(e,t){let n=e.fields;if(!n||t.spot<0){t.wt=3;return}if(js.get(e)===e.tick){t.wt=.05;return}js.set(e,e.tick);let r=zs(e);if(!Ls(e,t.x,t.y+.5,t.z)){let n=Bs(e,t,r);if(n<0){t.wt=3;return}if(t.F=Ns(e,t,n),!Number.isFinite(t.F[t.spot])){t.wt=3;return}t.dest=n;return}if(!r.length){t.wt=5;return}let i=e.rng.pick(r),a=n.nav.byRoom.get(i)??[];if(!a.length){t.wt=.5;return}let o=e.rng.pick(a);if(t.F=Ns(e,t,o),!t.F||!Number.isFinite(t.F[t.spot])){t.wt=e.rng.range(1,3);return}t.dest=o}function Ns(e,t,n){let r=e.fields;return Nr(r.nav,n,Xi(e,r,t.walker),t.F??void 0)}function Ps(e,t){t.F=e.fields&&t.dest>=0?Ns(e,t,t.dest):null}var Fs=e=>e.lighting??=pu(e),Is=.02,Ls=(e,t,n,r)=>Math.max(...Fs(e).seen(t,n,r))>Is;function Rs(e,t){return Math.max(...Fs(e).room(t))>Is}function zs(e){return Hs(e).filter(t=>Rs(e,t))}function Bs(e,t,n){let r=e.fields,i=Nr(r.nav,t.spot,Ji(e,r,t.walker,t.cards)),a=-1;for(let e of n)for(let t of r.nav.byRoom.get(e)??[])i[t]<(a<0?1/0:i[a])&&(a=t);return a}var Vs=new WeakMap;function Hs(e){let t=Vs.get(e.world);return t||(t=e.world.rooms.filter(e=>!e.safe&&!e.noroam&&!e.armed&&!e.doorway&&(e.x1-e.x0)*(e.z1-e.z0)>=16).map(e=>e.id),Vs.set(e.world,t)),t}function Us(e,t,n){if(t.wt>0){t.wt-=K;return}if(t.dest<0){Ms(e,t);return}if(t.spot===t.dest||t.F&&t.spot>=0&&t.F[t.spot]<1.2){t.dest=-1,t.wt=e.rng.range(3,10);return}Cs(e,t,t.F,n,!1)?t.stk=0:(t.stk+=K,t.stk>1.5&&(t.stk=0,t.dest=-1,t.ride=null,t.wt=e.rng.range(1,3)))}function Ws(e,t,n,r,i=0,a=0){let o=e.player.body;if(!t.fixed&&o.y-t.y>1.4)return;let s=o.x-t.x,c=o.z-t.z,l=Math.hypot(s,c)||1,u=s/l,d=c/l,f=eo(-(o.vx*u+o.vz*d))*(e.hands.down>0?io.more:1);bi(e.game,n*f,cs[t.ai],{x:t.x,z:t.z});let p=a||i*f/o.mass,m=Ko(e,r*f,{x:t.x,z:t.z},p);ci(e.game,`${t.type} → you  ${(n*f).toFixed(0)} dmg  ×${f.toFixed(2)}  shove ${p.toFixed(1)} m/s  → ${m}  (poise ${(r*f).toFixed(0)}, ${e.hands.poise.toFixed(0)}/30 left)`),i&&Jr(o,u*i*f,d*i*f)}var Gs=(e,t,n,r=!1)=>G(e.game,n,t,r),Ks={ring:2.4,near:4,patience:3};function qs(e){let t=-1,n=3.2;for(let r of e.cast){if(r.dead||r.ai!==`husk`||r.state!==`hunt`||Math.abs(r.dy)>1.5)continue;let e=r.blow?-1:r.dp;e<n&&(n=e,t=r.id)}return t}function Js(e,t){return e.front>=0&&e.front!==t.id&&!Vo(e)&&t.pat<Ks.patience&&t.dp<Ks.near}function Ys(e,t,n){let r=e.player.body,i=t.dp||1,a=(t.x-r.x)/i,o=(t.z-r.z)/i,s=t.id%2?.35:-.35,c=Math.cos(s),l=Math.sin(s);xs(e,t,r.x+(a*c-o*l)*n,r.z+(a*l+o*c)*n,1.3),oc(e,t,8)}function Xs(e){switch(e.ai){case`husk`:return Ya.husk;case`skitter`:return e.big?Ya.bigSkitter:Ya.skitter;case`thresher`:return Ya.thresher;case`worm`:return Ya.worm;case`swimmer`:return Ya.swimmer;default:return null}}function Zs(e){let t=e.blow,n=Xs(e);if(!t||!n)return null;let r=t.ph===`wind`?n.wind:t.ph===`strike`?n.strike:t.hit?n.rec:n.miss;return{ph:t.ph,q:Math.min(1,t.t/r)}}var Qs=.6,$s=e=>e.kind===`body`;function ec(e,t,n){let r=Math.acos(n.arc),i=t.r+n.reach*.8,a=t.y+1;for(let n of[-r,r]){let r=t.yaw+n;if(e.world.raycast(t.x,a,t.z,t.x+Math.sin(r)*i,a,t.z+Math.cos(r)*i,$s)<1)return!0}return!1}var tc=120,nc=(e,t)=>e.dp<e.r+t.start&&Math.abs(e.dy)<1.2;function rc(e,t,n){let r=e.player.body,i=r.x-t.x,a=r.z-t.z,o=Math.hypot(i,a);return o>t.r+n.reach||Math.abs(r.y-t.y)>1.4?!1:o<t.r||(i*Math.sin(t.yaw)+a*Math.cos(t.yaw))/o>=n.arc}function ic(e,t,n,r){t.blow=r===void 0?{ph:`wind`,t:0,hit:!1}:{ph:`wind`,t:0,hit:!1,at:r},Gs(e,t,n.tell,n.big)}function ac(e,t){let n=t.blow,r=Xs(t);if(!n||!r)return!1;n.t+=K;let i=n.at===void 0?null:e.cast[n.at];if(i)return n.ph!==`after`&&(t.yaw=s(t.yaw,Math.atan2(i.x-t.x,i.z-t.z),Math.min(1,K*r.turn))),n.ph===`wind`&&n.t>=r.wind?(n.ph=`strike`,n.t=0,Gs(e,t,`swing`,r.big)):n.ph===`strike`&&n.t>=r.strike?(n.hit=!0,Oc(e,i),n.ph=`after`,n.t=0):n.ph===`after`&&n.t>=r.rec&&(t.blow=null),!0;switch(n.ph){case`wind`:if(n.t<r.wind*r.lock&&(oc(e,t,r.turn),r.creep&&t.body&&!nc(t,r)&&bs(e,t,Math.sin(t.yaw)*r.creep,Math.cos(t.yaw)*r.creep)),n.t>=r.wind){if(r.wide&&ec(e,t,r)){n.ph=`after`,n.t=0,n.hit=!1,G(e.game,`blow`,{x:t.x,y:t.y+1,z:t.z}),Gs(e,t,`thud`,!0),t.reel=Qs,t.stun=Math.max(t.stun,Qs);break}n.ph=`strike`,n.t=0,Gs(e,t,`swing`,r.big)}break;case`strike`:t.body&&t.dp>t.r+.3&&bs(e,t,Math.sin(t.yaw)*(r.lunge/r.strike),Math.cos(t.yaw)*(r.lunge/r.strike),tc),!n.hit&&rc(e,t,r)&&(n.hit=!0,Ws(e,t,r.dmg,r.poise,r.shove)),n.t>=r.strike&&(n.hit||Gs(e,t,`whiff`,r.big),n.ph=`after`,n.t=0);break;case`after`:n.t>=(n.hit?r.rec:r.miss)&&(t.blow=null,t.cd=r.cd)}return!0}var oc=(e,t,n)=>{let r=e.player.body;t.yaw=s(t.yaw,Math.atan2(r.x-t.x,r.z-t.z),Math.min(1,K*n))},sc=(e,t,n)=>e.rng.range(t,n);function cc(e,t){let n=e.player.body;return(t.d<2.5||((n.x-t.x)*Math.sin(t.yaw)+(n.z-t.z)*Math.cos(t.yaw))/(t.dp||1)>-.2)&&_s(e,t,15)||vs(e,t)?lc(e,t):!1}function lc(e,t){if(t.round&&!qc(e,t)){if(t.peered<Gc.again||t.state===`round`&&Kc(e,t))return!1;let n=Jc(e,t);return t.state=`peer`,t.st=Gc.look,t.wx=n.x,t.wz=n.z,t.peered=0,t.wt=0,!0}return t.state=`hunt`,t.lost=0,t.post=!1,t.dest=-1,Gs(e,t,`moan`),!0}var uc={time:[14,20],reach:6,pace:1.2,see:18,look:[1.5,3]},dc={see:14,near:2.5,every:30,look:2,pace:1.4},fc=e=>({x:(e.def.x0+e.def.x1)/2,y:e.def.y0+1.2,z:(e.def.z0+e.def.z1)/2});function pc(e,t){let n=t.def;return!t.open||n.open||n.stuck||n.vent||n.seal||n.lift||n.glass||t.pass>0?!1:n.kind===`heavy`||si(e.game,n.circuit)<=0}function mc(e,t){if(!t.cards||t.post||t.spot<0||(e.tick+t.id)%dc.every||!e.fields)return!1;let n=Math.min(1.6,(t.body?.h??1)*.85);for(let r=0;r<e.doors.length;r++){let i=e.doors[r];if(!pc(e,i)||e.cast.some(e=>e.door===r&&e.state===`shut`&&!e.dead))continue;let a=fc(i),o=a.x-t.x,s=a.z-t.z,c=Math.hypot(o,s);if(c<dc.near||c>dc.see||Math.abs(a.y-1.2-t.y)>2.5||(o*Math.sin(t.yaw)+s*Math.cos(t.yaw))/(c||1)<.35||!Ls(e,a.x,a.y,a.z)||e.world.raycast(t.x,t.y+n,t.z,a.x,a.y,a.z,hs)<.97)continue;let l=1.3,u=i.def,d=u.alongX?Math.sign(t.z-a.z)||1:Math.sign(t.x-a.x)||1,f=e.fields.nav.locate(a.x+(u.alongX?0:d*l),a.y-1.2,a.z+(u.alongX?d*l:0));if(f<0)continue;let p=Ns(e,t,f);if(Number.isFinite(p[t.spot]))return t.state=`shut`,t.door=r,t.dest=f,t.F=p,t.st=dc.look,t.stk=0,Gs(e,t,`mutter`),!0}return!1}function hc(e,t){let n=e.fields.nav,r=[];for(let e=0;e<n.n;e++)Math.abs(n.y[e]-t.y)<1&&Math.hypot(n.x[e]-t.wx,n.z[e]-t.wz)<uc.reach&&Math.hypot(n.x[e]-t.x,n.z[e]-t.z)>1.5&&r.push(e);return r.length?r[Math.floor(e.rng.range(0,r.length))]:-1}var gc=e=>!e.dead&&e.ai===`husk`&&(e.state===`idle`||e.state===`round`||e.state===`lurk`||e.state===`answer`)&&e.spot>=0,_c={pace:2.6,caught:3.4,see:16};function vc(e,t,n,r){gc(t)&&(t.state!==`answer`||t.dest!==n)&&r[t.spot]>2.5&&(Gs(e,t,`mutter`),t.state=`answer`,t.post=!1,t.dest=n,t.F=Float32Array.from(r),t.wt=0,t.stk=0)}function yc(e,t){let n=Math.min(1.6,(t.body?.h??1)*.85);for(let r of e.cast)if(!(r===t||r.dead||r.state!==`answer`||!r.body||Math.hypot(r.body.vx,r.body.vz)<_c.pace*.8)&&!(Math.hypot(r.x-t.x,r.z-t.z)>_c.see)&&e.world.raycast(t.x,t.y+n,t.z,r.x,r.y+n,r.z,hs)>=1)return!0;return!1}var bc={pace:1,hunt:3,look:2.5,sweep:.55,into:.5,about:1.5,swing:1.1,beep:.8,pitch:.14,roused:4.5};function xc(e,t){let n=-1,r=2.6;return e.doors.forEach((e,i)=>{if(e.def.glass)return;let a=fc(e),o=Math.hypot(a.x-t.x,a.z-t.z);o<r&&Math.abs(e.def.y0-t.y)<1&&(r=o,n=i)}),n}function Sc(e,t,n){let r=e.doors[n],i=fc(r);if(!r.def.card||si(e.game,r.def.circuit)<=0)return!1;let a=t.cards&&Gi(e,r);return r.beep=Cc,r.beepOk=a,G(e.game,a?`take`:`deny`,i),a&&(r.open=!0,r.pass=Math.max(r.pass,2.5+(t.round?.[t.beat%t.round.length].look??0))),a}var Cc=.8,wc=(e,t,n)=>(!n.need||si(e.game,n.need)>0)&&(!n.once||t.lap===0);function Tc(e,t){let n=t.round,r=e.fields;if(!r||t.spot<0||!n.length)return;let i=n[t.beat%n.length],a=()=>{t.beat=(t.beat+1)%n.length,t.beat===0&&t.lap++,t.dest=-1,t.wt=0,t.st=0};if(t.wt>0){let n=i.tries?xc(e,i):-1;if(i.graft&&t.graft>0)Nc(e,t);else if(n>=0){let r=fc(e.doors[n]),i=Math.atan2(r.x-t.x,r.z-t.z),a=t.st<=0&&e.doors[n].open?Math.sin(t.ph*bc.swing*1.6)*bc.into:0;t.yaw=s(t.yaw,i+a,Math.min(1,K*4))}else t.yaw=i.about?s(t.yaw,t.wm+Math.sin(t.ph*bc.swing*.8)*bc.about,Math.min(1,K*2.5)):s(t.yaw,t.wm+Math.sin(t.ph*bc.swing)*bc.sweep,Math.min(1,K*3));if((t.wt-=K)>0)return;if(i.take){let n=t.drag<0?Dc(e,t):void 0;if(n&&t.st>0){t.st--,ic(e,t,Ya.husk,n.id),t.wt=t.st>0?Ec.gap:Ec.grab;return}if(n){kc(e,t,n),t.wt=i.wait??bc.look;return}}if(t.st>0&&n>=0){t.st--,Sc(e,t,n)?(t.st=0,t.wt=i.look??bc.beep):t.wt=bc.beep;return}a();return}if(t.dest<0){if(!wc(e,t,i)){a();return}let n=r.nav.locate(i.x,i.y,i.z);if(n<0){a();return}if(js.get(e)===e.tick)return;if(js.set(e,e.tick),t.F=Ns(e,t,n),!Number.isFinite(t.F[t.spot])){a();return}t.dest=n,t.stk=0}if(t.spot===t.dest||t.F[t.spot]<.9){t.dest=-1,t.wm=t.yaw,t.st=i.take?Ec.blows:i.tries??0,t.wt=i.tries?i.wait??bc.beep:i.take?Ec.first:i.wait??bc.look,i.graft&&Mc(e,t),t.wt<=0&&a();return}Cs(e,t,t.F,i.pace??bc.pace,!1)?t.stk=0:(t.stk+=K)>4&&a()}var Ec={blows:2,first:.6,gap:.5,grab:.9},Dc=(e,t)=>e.cast.find(e=>!e.dead&&e.ai===`patient`&&e.state!==`dragged`&&Math.hypot(e.x-t.x,e.z-t.z)<4&&Math.abs(e.y-t.y)<1);function Oc(e,t){G(e.game,`struck`,{x:t.x,y:t.y+.8,z:t.z}),t.hit=1,t.reel=.5;let n=e.pools.find(e=>!e.kind&&Math.hypot(e.x-t.x,e.z-t.z)<.6);n?n.r=Math.min(1.4,n.r+.5):e.pools.push({x:t.x,y:t.y,z:t.z,r:.8})}function kc(e,t,n){t.yaw=Math.atan2(n.x-t.x,n.z-t.z),t.wm=t.yaw,G(e.game,`taken`,{x:n.x,y:n.y+1,z:n.z}),Ac(e,n),n.state=`dragged`,t.drag=n.id,t.trail=0}function Ac(e,t){if(t.down=1e9,t.rise=0,t.rag||=da(t,null,!0),t.rag&&(t.rag.limp=!0,t.rag.woke=e.tick),t.body){let n=e.world.dyn.indexOf(t.body.dyn);n>=0&&e.world.dyn.splice(n,1)}}var jc={time:6,after:1.5,jerk:[.25,.7],J:45};function Mc(e,t){let n=e.cast[t.drag];if(t.drag=-1,!n||n.dead)return;n.state=`out`,n.grafted=!0,n.rag&&(n.rag.pin=null);let r=n.rag?ha(n.rag):{x:n.x,y:n.y,z:n.z};t.wx=r.x,t.wz=r.z,t.st=.4,t.graft=jc.time,t.wt=jc.time+jc.after,G(e.game,`graft`,{x:r.x,y:r.y+.3,z:r.z})}function Nc(e,t){t.yaw=s(t.yaw,Math.atan2(t.wx-t.x,t.wz-t.z),Math.min(1,K*4));let n=e.cast.find(e=>e.grafted&&e.state===`out`&&Math.hypot(e.x-t.wx,e.z-t.wz)<2);if(!n?.rag||(Ic(e,n,.3),(t.st-=K)>0))return;t.st=e.rng.range(jc.jerk[0],jc.jerk[1]);let r=ca(n.rag.kind),i=Math.floor(e.rng.range(0,r.names.length-.001)),a=n.rag.p;Oa(n.rag,{x:a[i*3],y:a[i*3+1],z:a[i*3+2]},{x:e.rng.range(-.4,.4),y:1,z:e.rng.range(-.4,.4)},jc.J,e.tick)}var Pc=e=>e.cast.some(e=>e.graft>0),Fc={pool:1.9,most:220,smear:.55};function Ic(e,t,n){let r=t.rag?ha(t.rag):{x:t.x,y:t.y,z:t.z},i=e.pools.find(e=>!e.kind&&Math.hypot(e.x-r.x,e.z-r.z)<.7);i?i.r=Math.min(Fc.pool,i.r+n*K):e.pools.length<Fc.most&&e.pools.push({x:r.x,y:t.y,z:r.z,r:.3})}function Lc(e,t,n,r,i){e.pools.length<Fc.most&&e.pools.push({x:t,y:n,z:r,r:1,kind:`smear`,yaw:i})}function Rc(e,t){let n=e.opening;if(!t.round||!t.torch||!n||n.phase===`done`||e.game.ended||e.game.god)return!1;let r=e.player.body;return t.yaw=Math.atan2(r.x-t.x,r.z-t.z),G(e.game,`taken`,{x:r.x,y:r.y+1,z:r.z}),Si(e.game,!1,`Its hand closes on your ankle, and where it touches you, you go slack. You are still awake when it starts to drag you.`),!0}var zc={hand:[.3,-.3,.42]};function Bc(e,t){let n=e.cast.find(e=>e.drag===t.id&&!e.dead);if(!n||!t.body)return;let r=Math.sin(n.yaw),i=Math.cos(n.yaw),[a,o,s]=zc.hand,c=n.x+a*i+o*r,l=n.z-a*r+o*i;t.rag&&(t.rag.pin={i:ca(t.model).at.footR,x:c,y:n.y+s,z:l},t.rag.awake=!0,t.rag.still=0),Vc(e,t),(t.trail+=Math.hypot(n.x-n.px,n.z-n.pz))>=Fc.smear&&(t.trail=0,Lc(e,t.x,t.y,t.z,n.yaw))}function Vc(e,t){let n=t.body,r=e.world.dyn.indexOf(n.dyn);if(r>=0&&e.world.dyn.splice(r,1),t.rag){let e=ha(t.rag);n.x=t.x=e.x,n.z=t.z=e.z,n.y=t.y=Math.max(e.y,t.y-.5)}n.vy=0,n.vx=n.vz=0,n.sync()}var Hc={every:[.55,.95],loud:40,least:2.5,warn:2.8};function Uc(e,t){let n=e.player.body;e.doors.some(e=>e.t>.3&&!e.def.glass&&!e.def.open&&Math.hypot((e.def.x0+e.def.x1)/2-t.x,(e.def.z0+e.def.z1)/2-t.z)<3)&&(t.state===`wait`||t.state===`bang`||t.state===`warn`)&&(t.state=`hide`);let r=(e,n,r=3)=>{t.yaw=s(t.yaw,Math.atan2(e-t.x,n-t.z),Math.min(1,K*r))},i=n=>!n||Math.hypot(n.x-t.x,n.z-t.z)<.25||(xs(e,t,n.x,n.z,1.3),t.mv=1.3,!1);switch(t.state){case`bang`:{if(r(n.x,n.z),t.st+=K,t.tense&&t.st>Hc.least){t.state=`warn`,t.st=Hc.warn;break}if((t.wt-=K)>0)break;t.wt=e.rng.range(Hc.every[0],Hc.every[1]);let i={x:t.x+Math.sin(t.yaw)*.5,y:t.y+1.4,z:t.z+Math.cos(t.yaw)*.5};G(e.game,`bang`,i),Wc(e,i.x,t.y,i.z,Hc.loud)&&(t.tense=1);break}case`warn`:r(n.x,n.z),(t.st-=K)<=0&&(t.state=`hide`);break;case`hide`:{if(!i(t.hide))break;let n=e.doors.find(e=>!e.def.glass&&!e.def.open&&Math.hypot((e.def.x0+e.def.x1)/2-t.x,(e.def.z0+e.def.z1)/2-t.z)<4);n&&r((n.def.x0+n.def.x1)/2,(n.def.z0+n.def.z1)/2,2);break}case`dragged`:Bc(e,t);break;case`out`:Vc(e,t),Ic(e,t,.012)}}function Wc(e,t,n,r,i){let a=e.fields;if(!a)return!1;let o=a.nav.locate(t,n,r);if(o<0)return!1;let s=Nr(a.nav,o,Zi(e,a),void 0,i),c=!1;for(let a of e.cast)a.dead||a.stun>0||a.spot<0||a.ai!==`husk`||!(s[a.spot]<i)||(a.state===`round`&&a.wt>0&&a.st<=0?(a.wt>bc.roused&&(a.wt=bc.roused,a.wm=Math.atan2(t-a.x,r-a.z)),c=!0):a.state===`idle`&&!a.round&&Math.abs(n-a.y)<1.5&&(Gs(e,a,`mutter`),a.state=`search`,a.st=sc(e,uc.time[0],uc.time[1]),a.dest=-1,a.wx=t,a.wz=r,a.wt=0,a.post=!1));return c}var Gc={look:5,off:.55,again:25,near:6,ahead:6};function Kc(e,t){let n=t.round,r=e.player.body;for(let i=0;i<Gc.ahead;i++){let a=n[(t.beat+i)%n.length];if(!a.tries||i===0&&t.dest<0&&t.st<=0&&t.wt>0)continue;let o=xc(e,a);if(o>=0&&Math.hypot((e.doors[o].def.x0+e.doors[o].def.x1)/2-r.x,(e.doors[o].def.z0+e.doors[o].def.z1)/2-r.z)<Gc.near)return!0}return!1}function qc(e,t){let n=e.fields;return!n||t.spot<0||n.from<0?!1:Number.isFinite(n.hands[t.spot])?!0:t.cards&&t.walker===`hands`?Number.isFinite(ra(e,n)[t.spot]):Number.isFinite(Nr(n.nav,n.from,Ji(e,n,t.walker,t.cards),void 0,90)[t.spot])}function Jc(e,t){let n=e.player.body,r=null,i=4;for(let a of e.doors){let e=a.def;if(!e.glass||Math.abs(e.y0-t.y)>1.5)continue;let o=(e.x0+e.x1)/2,s=(e.z0+e.z1)/2,c=Math.hypot(o-t.x,s-t.z);if(c>i)continue;let l=e.alongX?0:Math.sign(t.x-o)||1,u=e.alongX?Math.sign(t.z-s)||1:0;(n.x-o)*l+(n.z-s)*u>0||(i=c,r={x:o+l*Gc.off,z:s+u*Gc.off})}return r??{x:t.x,z:t.z}}var Yc={shoulder:[-.27,1.46],arm:.66,lead:.06};function Xc(e,t){let n=e.player.body,r=bc.pitch;if(t.state===`hunt`||t.state===`peer`){let e=Math.max(.5,t.dp);r=a(Math.atan2(t.y+Yc.shoulder[1]-(n.y+1.1),e),-.6,.9)}else t.graft>0&&(r=a(Math.atan2(Yc.shoulder[1]-.6,Math.max(.4,Math.hypot(t.wx-t.x,t.wz-t.z))),0,1.1));let i=Math.sin(t.yaw),o=Math.cos(t.yaw),s=Math.cos(r),c=Math.sin(r),[l,u]=Yc.shoulder,d=Yc.arm+Yc.lead,f=t.x+l*o+i*s*d,p=t.z-l*i+o*s*d;return{x:f,y:t.y+u-c*d,z:p,dx:i*s,dy:-c,dz:o*s,pitch:r}}var Zc={husk(e,t){let n=e.fields?.hands,r=t.d;switch(t.round&&(t.peered+=K),t.state){case`idle`:if(cc(e,t)||mc(e,t))break;if(t.round){t.state=`round`,t.dest=-1,t.wt=0,t.st=0;break}t.post||Us(e,t,1.3);break;case`round`:if(ac(e,t)||cc(e,t)||mc(e,t))break;Tc(e,t);break;case`peer`:{if(t.peered=0,Math.hypot(t.wx-t.x,t.wz-t.z)>.15?xs(e,t,t.wx,t.wz,bc.pace):oc(e,t,3),(t.st-=K)>0)break;let n=t.round;n[t.beat%n.length].tries&&(t.beat=(t.beat+1)%n.length,t.beat===0&&t.lap++),t.state=`round`,t.dest=-1,t.wt=0,t.st=0;break}case`answer`:if(cc(e,t))break;if(!t.F||t.dest<0||t.spot===t.dest||t.F[t.spot]<1.5){t.state=`idle`,t.dest=-1,t.wt=sc(e,6,12);break}Cs(e,t,t.F,yc(e,t)?_c.caught:_c.pace,!1)?t.stk=0:(t.stk+=K)>3&&(t.stk=0,t.state=`idle`,t.dest=-1,t.wt=sc(e,2,4));break;case`fix`:{if(cc(e,t))break;let n=e.drills.find(e=>e.spot===t.dest);if(!n||!t.F||t.dest<0||!Number.isFinite(t.F[t.spot])){t.state=`idle`,t.dest=-1,t.wt=sc(e,2,4);break}if(t.spot===t.dest||t.F[t.spot]<1.5){oc(e,t,6),(t.st-=K)<=0&&(nl(e,n),t.state=`search`,t.st=sc(e,uc.time[0],uc.time[1]),t.dest=-1,t.wx=t.x,t.wz=t.z,t.wt=sc(e,uc.look[0],uc.look[1]),t.wm=t.yaw+Math.PI);break}t.st=1.2,Cs(e,t,t.F,1.6,!1)?t.stk=0:(t.stk+=K)>4&&(t.stk=0,t.state=`idle`,t.dest=-1,t.wt=sc(e,2,4));break}case`shut`:{if(cc(e,t)){t.door=-1;break}let n=e.doors[t.door],r=e=>{t.state=`idle`,t.door=-1,t.dest=-1,t.wt=e};if(!n||!pc(e,n)||!t.F||t.dest<0){r(sc(e,2,4));break}if(t.spot===t.dest||t.F[t.spot]<1.2){let i=fc(n);if(t.yaw=s(t.yaw,Math.atan2(i.x-t.x,i.z-t.z),Math.min(1,K*4)),(t.st-=K)>0)break;if(Fi(n,vu(e))){t.st=.5;break}(n.def.kind!==`heavy`||si(e.game,n.def.circuit)>=2)&&(n.open=!1,G(e.game,`door`,{...i,y:n.def.y0})),r(sc(e,3,6));break}Cs(e,t,t.F,dc.pace,!1)?t.stk=0:(t.stk+=K)>3&&r(sc(e,2,4));break}case`search`:if(cc(e,t)||_s(e,t,uc.see)&&lc(e,t))break;if((t.st-=K)<=0){t.state=`idle`,t.dest=-1,t.wt=sc(e,2,4);break}if(t.wt>0){t.wt-=K,t.yaw=s(t.yaw,t.wm,Math.min(1,K*1.6));break}if(t.dest<0||!t.F){let n=hc(e,t);if(n<0){t.wt=1;break}if(t.F=Ns(e,t,n),!Number.isFinite(t.F[t.spot])){t.F=null,t.wt=1;break}t.dest=n}if(t.spot===t.dest||t.F[t.spot]<1.2){t.dest=-1,t.wt=sc(e,uc.look[0],uc.look[1]),t.wm=t.yaw+sc(e,-2.2,2.2);break}Cs(e,t,t.F,uc.pace,!1)?t.stk=0:(t.stk+=K)>2&&(t.stk=0,t.dest=-1,t.wt=1);break;case`hunt`:if(ac(e,t))break;if(t.hp<t.max*.4&&!t.fled&&r>2.8){t.state=`flee`,t.st=7,t.fled=!0,Gs(e,t,`moan`);break}if(_s(e,t,22)?t.lost=0:t.lost+=K,t.lost>8){t.state=`idle`,t.dest=-1,t.wt=sc(e,2,5);break}if(nc(t,Ya.husk)&&Rc(e,t))break;nc(t,Ya.husk)?(oc(e,t,10),t.cd<=0&&(ic(e,t,Ya.husk),t.pat=0)):Js(e,t)?(t.pat+=K,Ys(e,t,Ks.ring)):n&&Es(e,t,t.round?bc.hunt:3.5,t.cards&&!Number.isFinite(n[t.spot])&&e.fields?ra(e,e.fields):n);break;case`flee`:t.st-=K,Ds(e,t,4.2,n),t.st<0&&(t.state=`lurk`,t.st=sc(e,14,22),t.dest=-1,t.wt=0);break;case`lurk`:t.st-=K,Us(e,t,1.6),t.st<0&&(t.state=`idle`,t.hp=Math.min(t.max,t.hp+20),t.fled=!1)}t.mv>0&&(t.tk-=K)<0&&(t.tk=t.mv>2?.3:.58,Gs(e,t,`hstep`))},skitter(e,t){let n=t.big,r=e.fields?.crawl;if(t.state===`idle`){if(_s(e,t,n?18:14)||vs(e,t)){t.state=`hunt`,t.lost=0,t.bt=0,Gs(e,t,`skit`);return}t.wt-=K,t.wt<0&&(t.wt=sc(e,2,7),t.wx=t.hx+sc(e,-3,3),t.wz=t.hz+sc(e,-3,3),t.wm=sc(e,.3,.8)),t.wm>0&&(t.wm-=K,xs(e,t,t.wx,t.wz,n?2:3),t.mv&&(t.tk-=K)<0&&(t.tk=n?.2:.11,Gs(e,t,`tap`,n)));return}if(ac(e,t))return;if(_s(e,t,n?24:18)?t.lost=0:t.lost+=K,t.lost>9){t.state=`idle`;return}t.bt-=K,t.bt<=0&&(t.burst=!t.burst,t.bt=t.burst?sc(e,.4,.9):sc(e,.1,.4));let i=Xs(t);nc(t,i)?(oc(e,t,6),t.cd<=0&&ic(e,t,i)):t.burst&&r&&(Es(e,t,n?4.3:5,r),t.mv&&(t.tk-=K)<0&&(t.tk=n?.16:.09,Gs(e,t,`tap`,n)))},bloat(e,t){t.sit||(t.wt-=K,t.wt<0&&(t.wt=sc(e,9,18),As(e,t),t.wm=sc(e,5,10)),t.wm>0&&(t.wm-=K,xs(e,t,t.wx,t.wz,.55),t.mv&&(t.tk-=K)<0&&(t.tk=1.1,Gs(e,t,`hstep`,!0))))},thresher(e,t){let n=e.player,o=n.body,s=t.d;switch(t.state){case`idle`:case`patrol`:if(_s(e,t,16)||vs(e,t)&&gs(e,t)){t.state=`wind`,t.st=.75,Gs(e,t,`roar`);break}if(t.ct-=K,t.ct<0){t.ct=sc(e,7,15),t.cdir=sc(e,i),t.tgt=!1,t.state=`charge`,t.st=sc(e,1,2.2),Gs(e,t,`roar`,!0);break}t.wt-=K,t.wt<0&&(t.wt=sc(e,4,9),As(e,t)),xs(e,t,t.wx,t.wz,1.2),t.mv&&(t.tk-=K)<0&&(t.tk=.62,Gs(e,t,`hstep`,!0));break;case`wind`:oc(e,t,6),t.st-=K,t.st<0&&(t.state=`charge`,t.st=3,t.tgt=!0,t.cdir=Math.atan2(o.x-t.x,o.z-t.z));break;case`charge`:if(t.tgt){let e=((Math.atan2(o.x-t.x,o.z-t.z)-t.cdir+r)%i+i)%i-r;t.cdir+=a(e,-1.3*K,1.3*K)}if(t.st-=K,(t.tk-=K)<0&&(t.tk=.16,Gs(e,t,`hstep`,!0)),t.dp<t.r+.55&&Math.abs(t.dy)<1.4){Ws(e,t,45,60,0,9),n.body.vx=0,n.body.vz=0,qr(n.body,Math.sin(t.cdir)*9,Math.cos(t.cdir)*9),t.state=`recover`,t.st=1.6;break}Os(e,t,7.4)?t.st<0&&(t.state=`recover`,t.st=.8):(Gs(e,t,`thud`),s<10&&e.game.events.push({type:`shake`,k:.3}),t.state=`recover`,t.st=1.4);break;case`recover`:t.st-=K,t.st<0&&(_s(e,t,18)?(t.state=`wind`,t.st=.5,Gs(e,t,`roar`)):(t.state=`pursue`,t.st=t.tgt?7:0));break;case`pursue`:if(ac(e,t))break;if(t.st-=K,t.st<0){t.state=`patrol`;break}if(_s(e,t,18)&&s>3.5){t.state=`wind`,t.st=.5,Gs(e,t,`roar`);break}nc(t,Ya.thresher)?(oc(e,t,4),t.cd<=0&&ic(e,t,Ya.thresher)):e.fields&&Es(e,t,2.6,e.fields.big)}},worm(e,t){let n=e.game,r=e.fields?.crawl,i=t.d;if(t.flee>0){t.flee-=K,Ds(e,t,2.6);return}let a=n.lightOn&&n.light===`flash`,o=n.lightOn&&n.light===`lantern`;if(i<10&&a&&ys(e,t)||i<4.5&&o){t.blow=null,Ds(e,t,1.5);return}if(!ac(e,t)){if(i<5||i<13&&gs(e,t)){nc(t,Ya.worm)?e.wormN>=2?(oc(e,t,8),t.cd<=0&&ic(e,t,Ya.worm)):vi(n,`touched`,`It only touches you. Its hand is warm.`):r&&Es(e,t,1.25,r);return}t.wt-=K,t.wt<0&&(t.wt=sc(e,3,9),t.wx=t.hx+sc(e,-2,2),t.wz=t.hz+sc(e,-2,2),t.wm=sc(e,1,3)),t.wm>0&&(t.wm-=K,xs(e,t,t.wx,t.wz,.5))}},swimmer(e,t){let n=e.game,r=n.lightOn&&n.light===`lantern`,i=e.fields?.crawl;if(t.flee>0){t.flee-=K,Ds(e,t,3);return}if(!ac(e,t)){if(t.d<(r?22:9)){nc(t,Ya.swimmer)?(oc(e,t,8),t.cd<=0&&ic(e,t,Ya.swimmer)):i&&(Es(e,t,2.5,i),t.mv&&(t.tk-=K)<0&&(t.tk=.5,Gs(e,t,`slosh`)));return}t.wt-=K,t.wt<0&&(t.wt=sc(e,3,8),t.wx=t.hx+sc(e,-5,5),t.wz=t.hz+sc(e,-2,2),t.wm=sc(e,2,5)),t.wm>0&&(t.wm-=K,xs(e,t,t.wx,t.wz,.9))}},grabber(e,t){t.grab>0&&(t.grab-=K),t.dp<1.5&&Math.abs(t.dy)<2&&gs(e,t)?(t.tense===0&&Gs(e,t,`skit`),t.tense+=K,t.tense>.8&&t.cd<=0&&(t.cd=2.4,t.grab=1,t.tense=.01,Ws(e,t,20,10),e.player.slow=1.4,vi(e.game,`grab`,`The arms are only arms. Whatever is holding on is above them.`))):t.tense=Math.max(0,t.tense-K*2)},patient:Uc},Qc={now:.25,quick:[1.5,4],last:180,first:30};function $c(e,t,n){let r=e.game.station?.circuits;for(let e=t,i=0;e&&i<8;e=r?.[e]?.feed??``,i++)if(e===n)return!0;return!1}var el=e=>e.ai===`husk`&&!e.dead&&!e.post&&e.state!==`hunt`&&e.state!==`fix`;function tl(e,t,n,r,i){let a=e.fields;if(!a)return;e.drills=e.drills.filter(e=>e.c!==t),e.lighting=null;let o=[];for(let n of e.cast){if(!el(n))continue;let r=e.world.roomAt(n.x,n.y+.5,n.z);if(!r||!$c(e,r.circuit,t)||Ls(e,n.x,n.y+1,n.z))continue;let i=e.rng.chance(Qc.now)?e.rng.range(Qc.quick[0],Qc.quick[1]):Qc.first+(Qc.last-Qc.first)*Math.sqrt(e.rng.range(0,1));o.push({id:n.id,at:i})}let s=a.nav.locate(n,r-1.3,i);o.length&&s>=0&&e.drills.push({c:t,x:n,y:r,z:i,spot:s,t:0,due:o})}function nl(e,t){let n=e.game.station?.circuits[t.c],r=e.game;if(e.drills=e.drills.filter(e=>e!==t),!n||n.on||n.broken)return;n.on=!0,r.events.push({type:`power`,loud:!1}),G(r,`clang`,{x:t.x,y:t.y,z:t.z});let i=e.player.body;Math.hypot(i.x-t.x,i.z-t.z)<24&&vi(r,`drill`,`Somewhere close, a breaker slams home. They remember that much.`)}function rl(e){for(let t of[...e.drills]){let n=e.game.station?.circuits[t.c];if(!n||n.on){e.drills=e.drills.filter(e=>e!==t);continue}t.t+=K;for(let n of t.due){let r=e.cast[n.id];if(n.at<0||t.t<n.at||(n.at=-1,!r||!el(r)||Ls(e,r.x,r.y+1,r.z)||r.spot<0||!e.fields))continue;let i=Ns(e,r,t.spot);Number.isFinite(i[r.spot])&&(Gs(e,r,`mutter`),r.state=`fix`,r.post=!1,r.dest=t.spot,r.F=i,r.st=1.2,r.stk=0)}t.due=t.due.filter(e=>e.at>=0)}}function il(e){rl(e),e.front=qs(e);let t=e.player.body,n=e.fields,r=0;for(let t of e.cast)t.ai===`worm`&&!t.dead&&t.flee<=0&&t.dp<2.6&&r++;e.wormN=r;for(let r of e.cast){if(r.px=r.x,r.py=r.y,r.pz=r.z,r.hit>0&&(r.hit=Math.max(0,r.hit-K*4)),r.calm+=K,r.poise=Qa(r.poise,r.pmax,r.calm,K),r.reel>0&&(r.reel=Math.max(0,r.reel-K)),r.graft>0&&(r.graft=Math.max(0,r.graft-K)),r.down>0?(r.down=Math.max(0,r.down-K),r.down===0&&(r.rise=io.rise)):r.rise>0&&(r.rise=Math.max(0,r.rise-K)),r.rag&&!r.dead&&r.down===0&&r.rise===0&&(r.rag=null),r.dead){r.gone<1&&(r.gone=Math.min(1,r.gone+K*2.5));continue}let i=r.state===`dragged`||r.state===`out`?null:r.body,a=!!i&&r.still>2&&i.ground&&i.vy===0&&!i.on,o=i?.x,s=i?.z;if(i&&(a||ei(e.world,i),r.x=i.x,r.y=i.y,r.z=i.z,n&&!r.ride)){let e=n.nav.locate(i.x,i.y,i.z);e>=0&&(r.spot=e)}r.cd-=K;let c=t.x-r.x,l=t.z-r.z;if(r.dy=t.y-r.y,r.dp=Math.hypot(c,l),r.d=Math.hypot(c,l,r.dy),r.mv=0,r.ph+=K,r.drove=!1,r.stun>0?r.stun-=K:Zc[r.ai](e,r),i&&!r.dead&&!r.drove&&bs(e,r,0,0),i&&(i.carried=!1),!r.dead){if(i){let t=i.x!==o||i.z!==s;if(t||!a){let{impact:t}=Qr(e.world,i,K);t>ro.min&&dl(e,r,t-ro.min,ro)}r.still=t?0:r.still+1,r.x=i.x,r.y=i.y,r.z=i.z}if(e.game.ended)return}}}var al=28,ol={dmg:1.25,poise:1.6},sl={flinch:.2,stagger:.9};function cl(e,t,n,r=1){let i=e.game,a=e.player.body,o=t.blow?.ph,s=o===`after`;t.down>0&&(r*=io.more),t.hp-=n.dmg*r*(s?ol.dmg:1),t.hit=Math.max(t.hit,Math.min(1,r)),G(i,`hit`);let c=0,l=0,u=0;if(t.body&&n.shove){let e=t.x-a.x,i=t.z-a.z,o=Math.hypot(e,i)||1;c=Math.min(to.most,n.shove*r/t.body.mass),l=n.dir?n.dir.x:e/o,u=n.dir?n.dir.z:i/o,c>0&&(t.body.vx+=l*c,t.body.vz+=u*c)}let d=e=>ci(i,`${n.by??`blow`} → ${t.type}  ${(n.dmg*r*(s?ol.dmg:1)).toFixed(0)} dmg  ×${r.toFixed(2)}${s?` open`:``}  shove ${c.toFixed(1)} m/s  → ${e}`);if(t.hp<=0){hl(e,t,{ux:l,uz:u,v:c,at:n.at,way:n.way}),d(`dead`);return}if(t.down>0){t.rag&&t.body&&n.at&&c>0&&Oa(t.rag,n.at,n.way??{x:l,y:0,z:u},c*t.body.mass,e.tick),t.rag&&(t.rag.guard=Ia.guard.time),d(`down already`);return}let f=Xs(t),p=f?o===`wind`?f.armour.wind:o===`strike`?f.armour.strike:0:0,m=Math.max(0,n.poise*r*(s?ol.poise:1)-(t.rise>0?oo.guard:0)),h=Za(t.poise,t.pmax,m,p),g=s?ol.poise:1;switch(t.poise=h.left,t.calm=0,h.r===`stagger`&&c>=ao.dv&&t.body&&(t.body.vy+=ao.up*c,t.body.ground=!1),h.r===`stagger`&&c>=io.dv&&ll(t)?ul(e,t,{ux:l,uz:u,v:c,at:n.at,way:n.way}):h.r===`stagger`?(t.blow=null,t.reel=sl.stagger*g,t.stun=Math.max(t.stun,t.reel)):h.r===`flinch`&&(s||(t.blow=null),t.stun=Math.max(t.stun,sl.flinch*g)),d(`${t.down>0?c>=ao.dv?`thrown`:`down`:h.r}  (poise ${m.toFixed(0)}, ${h.left.toFixed(0)}/${t.pmax} left)`),t.ai){case`husk`:t.state===`idle`||t.state===`lurk`?(t.state=`hunt`,t.lost=0,t.post=!1):t.hp<t.max*.4&&!t.fled&&e.rng.chance(.5)&&(t.state=`flee`,t.st=7,t.fled=!0,t.blow=null,Gs(e,t,`moan`)),h.r===`stagger`&&Gs(e,t,`moan`);break;case`worm`:t.flee=5,t.blow=null;break;case`swimmer`:t.flee=3.5,t.blow=null;break;case`skitter`:t.state===`idle`&&(t.state=`hunt`,t.lost=0);break;case`thresher`:[`idle`,`patrol`].includes(t.state)&&(t.state=`wind`,t.st=.5,t.dest=-1);break;case`bloat`:vi(i,`bloat`,`It does not seem to notice.`)}}var ll=e=>!!e.body&&!e.low&&!e.swim&&Number.isFinite(e.body.mass);function ul(e,t,n=null){la.floored&&(t.rag=da(t,n,!0),t.rag&&(t.rag.woke=e.tick)),t.blow=null,t.reel=0,t.down=io.time,t.rise=0,t.stun=Math.max(t.stun,io.time+io.rise),Gs(e,t,`thud`,!0)}function dl(e,t,n,r){if(t.dead)return;if(t.down>0&&(n*=io.more),ci(e.game,`${r===ro?`fall`:`slam`} → ${t.type}  ${(n*r.dmg).toFixed(0)} dmg  (${n.toFixed(1)} m/s over)`),t.hp-=n*r.dmg,t.hit=Math.max(t.hit,.6),Gs(e,t,`thud`,t.big||t.mass>2),t.hp<=0){hl(e,t);return}if(t.down>0)return;let i=Za(t.poise,t.pmax,Math.max(0,n*r.poise-(t.rise>0?oo.guard:0)),0);t.poise=i.left,t.calm=0,i.r===`stagger`&&r===ro&&ll(t)?ul(e,t):i.r===`stagger`?(t.blow=null,t.reel=sl.stagger,t.stun=Math.max(t.stun,t.reel)):i.r===`flinch`&&(t.blow=null,t.stun=Math.max(t.stun,sl.flinch))}function fl(e,t){t.dead||(t.ai===`husk`&&t.state!==`hunt`&&t.state!==`flee`?(t.state=`hunt`,t.lost=0,t.post=!1,t.dest=-1,Gs(e,t,`moan`)):t.ai===`skitter`&&t.state===`idle`&&(t.state=`hunt`,t.lost=0,t.bt=0,Gs(e,t,`skit`)))}function pl(e,t,n){if(t.dead||!t.body)return;t.hide&&e.pools.push({x:t.hide.x,y:t.y,z:t.hide.z,r:1.3});let r=t.body;r.x=t.x=t.px=n.x,r.y=t.y=t.py=n.y,r.z=t.z=t.pz=n.z,r.sync(),t.rag=fa(t),Ac(e,t),t.state=`out`,t.grafted=!0,e.pools.push({x:n.x,y:n.y,z:n.z,r:Fc.pool})}function ml(e){if(e.cast.some(e=>!e.dead)){for(let t of e.cast)t.dead||hl(e,t);return}for(let t of e.cast)t.rag=null,t.away=!0}function hl(e,t,n=null,r=!0){if(t.dead=!0,t.rag&&t.body&&n?.at&&n.v>0?Oa(t.rag,n.at,n.way??{x:n.ux,y:0,z:n.uz},n.v*t.body.mass,e.tick):t.rag||=da(t,n),t.rag&&(t.rag.woke=e.tick),t.gone=0,t.blow=null,t.ride=null,r&&e.game.kills++,t.body){let n=e.world.dyn.indexOf(t.body.dyn);n>=0&&e.world.dyn.splice(n,1)}}var gl=()=>({forward:0,strafe:0,run:!1,yaw:0,pitch:0,jump:!1,crouch:!1,light:!1,use:!1,rise:!1,sink:!1,attack:!1}),_l={hold:1.4,sound:12,reach:34,every:1.3,still:.3,drain:.5},vl={draw:1.1},yl=e=>e.kind===`body`||!!e.glass;function bl(e){return(e.world.def.cameras??[]).map(t=>({def:t,guard:Dl(e.world,t.x,t.y-1,t.z),broken:!1,hold:0,tripped:!1}))}var xl=new WeakMap;function Sl(e,t){let n=xl.get(t);if(!n){let r=t.def,i=(r.x0+r.x1)/2,a=(r.z0+r.z1)/2,o=r.y0+.5,s=1.3,c=r.alongX?[e.roomAt(i,o,a-s),e.roomAt(i,o,a+s)]:[e.roomAt(i-s,o,a),e.roomAt(i+s,o,a)];n=[...new Set(c.map(e=>e?.zone).filter(e=>!!e))],xl.set(t,n)}return n}var Cl=(e,t)=>{let n=t.def;return!(n.seal||n.vent||n.lift||n.stuck||n.glass)&&si(e.game,n.circuit)>=(n.kind===`heavy`?2:1)};function wl(e,t){for(let n of e.doors)n.down||n.drawing>0||!Sl(e.world,n).includes(t)||!Cl(e,n)||(n.drawing=vl.draw,G(e.game,`bolt-draw`,Tl(n)))}var Tl=e=>({x:(e.def.x0+e.def.x1)/2,y:e.def.y0+2,z:(e.def.z0+e.def.z1)/2});function El(e){for(let t of e.doors){if(!t.down&&t.drawing<=0)continue;let n=Sl(e.world,t).some(t=>e.alarms.some(e=>e.zone===t))&&Cl(e,t);t.drawing>0&&(t.drawing-=.016666666666666666)<=0?(t.drawing=0,n&&(t.down=!0,G(e.game,`bolt`,Tl(t)))):t.down&&!n&&(t.down=!1,G(e.game,`bolt-free`,Tl(t)))}}var Dl=(e,t,n,r)=>!!e.roomAt(t,n,r)?.armed;function Ol(e,t){let n=e.roomAt(t.x,t.y+1,t.z);return n?n.y0+n.ht:t.y+3}var kl=(e,t)=>!e.mute.includes(t);function Al(e,t){if(!kl(e,t))return!1;let n=e.world.def.speakers?.find(e=>e.zone===t);return!n?.pa||si(e.game,n.pa)>=1}var jl=(e,t)=>!t.broken&&si(e.game,t.def.circuit)>=1;function Ml(e,t){let n=t.def,r=e.player.body,i=r.y+jo(e.player)*.9,a=r.x-n.x,o=r.z-n.z,s=Math.hypot(a,o);return Math.hypot(a,i-n.y,o)>n.range*e.game.vis||s<.01||(a*Math.sin(n.yaw)+o*Math.cos(n.yaw))/s<Math.cos(n.fov/2)?!1:e.world.raycast(n.x,n.y,n.z,r.x,i,r.z,yl)>=1}function Nl(e,t){let n=e.world.def.speakers?.find(e=>e.zone===t),r=e.fields;if(!n||!r||!Al(e,t))return;let i=e.alarms.find(e=>e.zone===t);if(i){i.t=_l.sound;return}let a=r.nav.locate(n.x,n.y,n.z);a<0||e.alarms.push(Pl(e,t,a,_l.sound))}function Pl(e,t,n,r){let i=e.fields;return{zone:t,t:r,spot:n,next:0,route:Nr(i.nav,n,Xi(e,i,`hands`)),heard:Nr(i.nav,n,Zi(e,i),void 0,_l.reach)}}var Fl=e=>({zone:e.zone,t:e.t,spot:e.spot,next:e.next});function Il(e,t){e.alarms=e.fields?t.map(t=>({...Pl(e,t.zone,t.spot,t.t),next:t.next})):[]}function Ll(t){let n=t.game,r=t.player.body,i=Math.hypot(r.vx,r.vz)>_l.still,a=Dl(t.world,r.x,r.y+.5,r.z);for(let r of t.cams){if(!r.guard||!a||!jl(t,r)||!Ml(t,r)){r.hold=0,r.tripped=!1;continue}if(i?(r.hold===0&&G(n,`cam`,r.def),r.hold=Math.min(_l.hold,r.hold+e)):(r.hold=Math.max(0,r.hold-_l.drain*.016666666666666666))===0&&(r.tripped=!1),i){if(r.tripped){let e=t.alarms.find(e=>e.zone===r.def.zone);e&&(e.t=_l.sound)}else r.hold>=_l.hold&&(r.tripped=!0,Nl(t,r.def.zone))}}for(let r of t.alarms)if(r.t-=e,(r.next-=.016666666666666666)<=0&&Al(t,r.zone)){r.next=_l.every;let e=t.world.def.speakers.find(e=>e.zone===r.zone);G(n,`klaxon`,{x:e.x,y:e.y+2.6,z:e.z},!0);for(let e of t.cast)e.spot>=0&&r.heard[e.spot]<_l.reach&&vc(t,e,r.spot,r.route);wl(t,r.zone)}t.alarms=t.alarms.filter(e=>e.t>0),El(t)}function Rl(e,t,n,r=0){let i=n.map(t=>e.cams.findIndex(e=>e.def.name===t)).filter(e=>e>=0);i.length&&(e.watch={c:t,feeds:i,at:0,side:0,hp:e.game.hp,dwell:r,t:0})}function zl(e){let t=e.watch;if(!t)return null;let n=e.cams[t.feeds[t.at]];return{cam:n,live:jl(e,n)}}function Bl(e,t){let n=e.watch;if(t.use||e.game.hp<n.hp||si(e.game,n.c)<1)return e.watch=null,gl();let r=Math.sign(t.strafe),i=n.feeds.length;return r&&r!==n.side?(n.at=(n.at+r+i)%i,n.t=0):n.dwell&&(n.t+=.016666666666666666)>=n.dwell&&(n.at=(n.at+1)%i,n.t=0),n.side=r,gl()}var Vl={OPS:`upper station`,SEC:`Security wing`,HALL:`Muster hall west`,EAST:`Muster hall east`,CRIT:`Operations, critical`,RES:`main level`,ENG:`plant level`,HYD:`the sump`,CARGO:`Cargo`,HORT:`Horticulture`,LIFT:`lift`},Hl={near:2.5,dwell:3,wait:60,fail:10,late:200,black:2,weak:90,slow:.55,alarm:2.2},Ul=e=>e.cast.filter(e=>e.ai===`patient`),Wl=e=>e.cast.find(e=>e.round&&e.torch);function Gl(e){let t=e.game.station?.circuits.ISO;t&&(t.back=!0,t.on=!0);for(let t of e.doors)t.def.failsafe&&(t.unlocked=!1);return e.lighting=null,{phase:`wake`,t:0,alarm:!0,next:.6,weak:Hl.weak,near:0}}function Kl(e){let t=Wl(e)?.round?.find(e=>e.graft);for(let n of Ul(e))t&&pl(e,n,t)}var ql=e=>e.world.def.uses.find(e=>e.kind===`pump`);function Jl(e){let t=e.player.body;return e.world.roomAt(t.x,t.y+.5,t.z)?.name===`Isolation room 1`&&e.doors.some(e=>(e.def.glass||e.def.failsafe)&&Math.hypot((e.def.x0+e.def.x1)/2-t.x,(e.def.z0+e.def.z1)/2-t.z)<Hl.near)}function Yl(t){let n=t.opening;if(!n)return;let r=t.game;n.weak>0&&(n.weak=Math.max(0,n.weak-e));let i=ql(t);if(n.alarm&&i&&(n.next-=.016666666666666666)<=0&&(n.next=Hl.alarm,G(r,`pump`,i)),n.phase!==`done`)switch(n.t+=e,n.phase){case`wake`:if(n.near=Jl(t)?n.near+e:0,n.near<Hl.dwell&&n.t<Hl.wait)break;for(let e of Ul(t))!e.dead&&e.state===`wait`&&(e.state=`bang`,e.wt=.3,e.st=0,e.tense=0);n.phase=`scene`,n.t=0;break;case`scene`:{let e=Wl(t),r=e?.round;(!e||e.dead||!r||e.lap>0||e.beat>=r.findIndex(e=>!e.once)-1||n.t>Hl.late)&&(n.phase=`left`,n.t=0);break}case`left`:if(n.t<Hl.fail)break;Xl(t),n.phase=`black`,n.t=0;break;case`black`:{if(n.t<Hl.black)break;let e=r.station?.circuits.CELLS;e&&!e.back&&(e.back=!0,r.events.push({type:`power`,loud:!1,quiet:!0}),i&&G(r,`strike`,i)),n.phase=`done`,n.t=0;break}}}function Xl(e){let t=e.game,n=t.station?.circuits.ISO,r=t.station?.circuits.CELLS;if(!n?.back)return;n.back=!1,r&&(r.back=!1),t.events.push({type:`power`,loud:!1});let i=ql(e);i&&G(t,`winddown`,i)}function Zl(e){let t=e.opening;t&&(t.alarm=!1),G(e.game,`take`,ql(e)),W(e.game,`EMPTY BAG, the screen says, and over it MAINS FAIL, and the clock: 14 NOV, 03:12. The bag went up on the eleventh.`)}function Ql(e,t){let n=e.opening;if(!n||n.weak<=0||(e.player.pace*=Hl.slow+(1-Hl.slow)*(1-n.weak/Hl.weak),!t.run))return t;let r=e.hands;return(t.forward!==0||t.strafe!==0)&&r.stag<=0&&r.down<=0&&(r.stag=lo.you,G(e.game,`reel`),e.game.events.push({type:`shake`,k:.25}),vi(e.game,`weak`,`Your legs will not run. Not yet: days of lying still are in them.`)),{...t,run:!1}}function $l(e){let t=e.game,n=[],r=e.world.def;for(let t of e.doors){let r=t.def;n.push({x:(r.x0+r.x1)/2,y:r.y0+(r.vent?.6:1.3),z:(r.z0+r.z1)/2,r:r.vent?1.7:2.6,label:()=>nu(e,t),act:()=>ru(e,t)})}for(let t of e.platforms)t.def.call&&n.push(eu(e,t,0),eu(e,t,1));let i=(e,n)=>()=>{if(!t.weapon){W(t,`With what? You would want something heavy in your hand.`),G(t,`deny`);return}n(),G(t,`smash`,e,!0),yi(t,14)};for(let t of e.cams){let e=t.def;n.push({x:e.x,y:e.y,z:e.z,r:2.4,label:()=>t.broken?null:`Smash the camera`,act:i(e,()=>{t.broken=!0,t.hold=0})})}for(let t of r.speakers??[]){let r={x:t.x,y:Ol(e.world,t)-.25,z:t.z};n.push({...r,r:3.2,label:()=>e.mute.includes(t.zone)||e.player.body.y>r.y-2?null:`Smash the speaker`,act:i(r,()=>{e.mute.push(t.zone)})})}for(let t of e.items)n.push(tu(e,t));for(let e of r.notes){let r=t.notes[e.key];r&&n.push({x:e.x,y:e.y+.05,z:e.z,r:2,label:()=>`Read: `+r.t.toLowerCase(),act:()=>pi(t,e.key)})}return r.uses.forEach((i,a)=>{let o=i.opts,s={x:i.x,y:i.y,z:i.z,r:2.4,key:`use`+a};switch(i.kind){case`body`:{let e={...s,label:()=>o.label??`Search the body`,act:()=>{e.off=!0,o.say&&W(t,o.say);for(let e of o.keys??[])di(t,e);o.note&&(t.read.includes(o.note)||t.read.push(o.note),W(t,`Armory: `+t.code+`. You will not forget it.`))}};n.push(e);break}case`backup`:{let e=o.c;n.push({...s,label:()=>`Backup set, `+(Vl[e]??e)+`: `+(t.station?.circuits[e]?.back?`running`:`stopped`),act:()=>{let n=t.station?.circuits[e];n&&(n.back=!n.back,t.events.push({type:`power`,loud:!1}),W(t,n.back?si(t,e)===2?`The backup set turns over. With Gen-1 on the floor it changes nothing.`:`The backup set catches. Half-light in the halls; the rooms stay dark. Doors that can, will open for anything.`:`The backup set coughs out.`))}});break}case`panel`:{let r=o.c,a=!!o.cut,c=Vl[r]??r,l=o.brk?`Breaker, `:`Service connection, `;n.push({...s,label:()=>{let e=t.station?.circuits[r];return l+c+`: `+(e?e.broken?a?`cut through`:`burned through`:e.on?`closed`:`open`:`none`)},act:()=>{let n=t.station?.circuits[r];if(n){if(n.broken){let r=t.inv.findIndex(e=>e.id===`kit`);if(r<0){W(t,a?`The feed has been cut clean through behind the switch, by hand. It would need cable, crimps, a proper splice.`:`The feed is burned through behind the switch. It would need cable, crimps, a proper splice.`),G(t,`deny`);return}ui(t,r),n.broken=!1,n.on=!0,G(t,`clang`),W(t,`You splice the feed and close the switch.`),o.zone&&Nl(e,o.zone)}else{n.on=!n.on,n.on||tl(e,r,i.x,i.y,i.z);let a=si(t,n.feed??r)>0,o=n.feed?a?`The `+c+` takes power.`:`Nothing upstream to take.`:t.station.main?`That floor takes power.`:`Nothing upstream to take.`;W(t,n.on?`Switch closed. `+o:n.feed?`Switch open. The `+c+` is cut off.`:`Switch open. That floor is cut off from Gen-1.`)}t.events.push({type:`power`,loud:!1})}}});break}case`elev`:{let e=o.c,a=o.to;n.push({...s,label:()=>`Elevator: `+(t.station?.names[a]??a),act:()=>{if(si(t,e)<1){W(t,`The panel is dark. The car runs off the `+(Vl[e]??e)+`, and that is dead.`),G(t,`deny`);return}if(!t.station?.built.includes(a)){W(t,`The car answers. Where it goes is not built yet.`);return}G(t,`door`,i),yi(t,10),t.travel={level:a,mark:`elev:`+r.id}}});break}case`fuse`:n.push({...s,label:()=>t.station?.fuseIn?null:`Fuse socket`,act:()=>{let e=t.inv.findIndex(e=>e.id===`fuse`);if(e<0||!t.station){W(t,`A scorched, empty socket. Gen-1 will not hold a load without a fuse.`),G(t,`deny`);return}ui(t,e),t.station.fuseIn=!0,G(t,`clang`),W(t,`The fuse seats with a clunk.`)}});break;case`breaker`:n.push({...s,label:()=>`Gen-1 main breaker: `+(t.station?.main?`on`:`off`),act:()=>{let e=t.station;if(e){if(!e.fuseIn){G(t,`door`),W(t,`The lever throws, and nothing answers. The bus is open.`);return}e.main=!e.main,t.events.push({type:`power`,loud:e.main}),W(t,e.main?`Gen-1 takes the load. Five floors of station wake up over your head. The lifts will run.`:`Gen-1 winds down. The dark comes back in from the far end.`)}}});break;case`lift`:n.push({...s,label:()=>`Lift panel`,act:()=>{if(si(t,`LIFT`)<2){W(t,`The lift is dead. It runs off Gen-1 and nothing else.`),G(t,`deny`);return}t.events.push({type:`lift`})}});break;case`ladder`:{let e=o.id,i=!!o.up,a=r.id,c=()=>t.station?.ladders[e]?.ends?.find(e=>e!==a);n.push({...s,label:()=>o.text??(i?`Ladder up: `:`Ladder down: `)+(t.station?.names[c()??``]??`nowhere`),act:()=>{let n=t.station?.ladders[e],r=c();if(n?.broken){W(t,n.broken),G(t,`deny`);return}let i=n?.need;if(i?.power&&si(t,i.power)<1){W(t,i.msg??`It will not open.`),G(t,`deny`);return}if(!r||!t.station?.built.includes(r)){W(t,`The ladderway is clear. Where it leads is not built yet.`);return}n?.say&&W(t,n.say),G(t,`step`),yi(t,6),t.travel={level:r,mark:`ladder:`+e}}});break}case`stair`:{let e=o.to;n.push({...s,label:()=>(o.up?`Stairs up`:`Stairs down`)+(t.station?.names[e]?`: `+t.station.names[e]:``),act:()=>{if(!t.station?.built.includes(e)){W(t,`Where these lead is not built yet.`);return}t.travel={level:e,mark:`stair:`+r.id}}});break}case`dive`:{let e=o.to;n.push({...s,label:()=>o.label,act:()=>{if(!t.station?.built.includes(e)){W(t,`Where this goes is not built yet.`);return}G(t,`slosh`),t.travel={level:e,mark:`dive:`+r.id},o.under&&vi(t,`dive`,t.worn.includes(`rebreather`)?`The rebreather ticks. You have time.`:`One lungful. Count it.`)}});break}case`look`:n.push({...s,label:()=>o.label??`Look`,act:()=>{W(t,o.text),o.sfx&&G(t,o.sfx,s)}});break;case`pump`:n.push({...s,r:1.8,label:()=>e.opening?.alarm?`Silence the pump`:`Look at the pump`,act:()=>Zl(e)});break;case`watch`:{let r=o.c,i=o.feeds,a=o.dwell??0;n.push({...s,r:1.8,label:()=>si(t,r)>=1?`Watch the monitors`:`Monitors: dark`,act:()=>{if(si(t,r)<1){W(t,`The screens are dark. The console has no power.`),G(t,`deny`);return}Rl(e,r,i,a)}});break}case`call`:{let r=o.zone,a={x:i.x,y:i.y,z:i.z},c={...s,r:1.8,label:()=>`Break the glass`,act:()=>{if(c.off=!0,G(t,`smash`,a),yi(t,6),!Al(e,r)){W(t,`The glass goes and the button sinks under your thumb. Nothing sounds: whatever it calls has no voice.`);return}Nl(e,r),W(t,`The glass goes and the button sinks under your thumb. The klaxon starts.`)}};n.push(c);break}}}),n}function eu(e,t,n){let r=e.game,i=t.def,a=i.call,o=e.player.body,s=()=>o.x>i.x0&&o.x<i.x1&&o.z>i.z0&&o.z<i.z1&&Math.abs(o.y-t.y)<.6;return{x:(i.x0+i.x1)/2,y:(n?i.y1:i.y0)+1.1,z:(i.z0+i.z1)/2,r:3.6,label:()=>t.moving?null:s()?t.target===n?a.name+`: `+(n?`down`:`up`):null:t.target===n?null:`Call the `+a.name.toLowerCase(),act:()=>{if(si(r,a.circuit)<1){W(r,`No power to it. The platform sits where it stopped.`),G(r,`deny`);return}ji(t,s()?+!n:n),G(r,`door`,{x:(i.x0+i.x1)/2,y:t.y,z:(i.z0+i.z1)/2}),yi(r,12)}}}function tu(e,t){let n=e.game,r={x:t.x,y:t.y+.05,z:t.z,r:2,label:()=>t.taken?null:`Take `+ti[t.id].n.toLowerCase(),act:()=>{let e=ti[t.id].per;fi(n,t.id,t.raw&&e?t.n/e:t.n)&&(t.taken=!0,r.off=!0,G(n,`take`),t.on&&ti[t.id].tool&&n.batt>0&&(n.light=t.id,n.lightOn=!0))}};return r}function nu(e,t){let n=t.def,r=e.game;if(n.glass)return null;if(n.vent)return t.open?null:`Loose panel`;if(n.lift)return`Call the surface lift`;if(n.seal)return`Jammed shut`;if(n.stuck)return e.player.crouch?null:`Jammed half open`;if(t.down)return`Locked down`;let i=si(r,n.circuit),a=n.card?`Card reader`:`Keypad`;return n.kind===`heavy`?i<2?`Heavy door: no power`:Ni(t)?a:t.open?`Door control: close`:`Door control: open`:i>0?Ni(t)?a:null:Ni(t)?a+`: dark`:t.open?`Slide the door shut`:`Slide the door open`}function ru(e,t){let n=t.def,r=e.game,i={x:(n.x0+n.x1)/2,y:n.y0,z:(n.z0+n.z1)/2};if(n.lift){if(si(r,n.circuit)<2||si(r,e.world.def.circuit)<2){W(r,r.station?.main?`Gen-1 is up but this floor is not taking it. The feed is open somewhere below.`:`The call button is dead. The surface lift runs off Gen-1, five floors down.`),G(r,`deny`);return}if(!r.keys.includes(`surf`)&&!r.keys.includes(`lift`)){W(r,`Power, and a slot. It wants a surface pass from the Armory, or the director's own key.`),G(r,`deny`);return}Si(r,!0,`lift`);return}if(n.seal){W(r,n.msg??`It does not move. Something on the other side shifts its weight.`),G(r,`deny`);return}if(n.stuck){W(r,`Jammed at waist height. You could get under it. Not everything could.`);return}if(n.vent){t.open=!0,G(r,`clang`,i),yi(r,7),W(r,`The panel comes away in your hands. There is a way through.`);return}if(t.down){W(r,`Locked down. The bolt is home and the light over it is red: it holds while the alarm sounds.`),G(r,`deny`);return}let a=si(r,n.circuit),o=n.kind===`heavy`;if(o&&a<2){W(r,a?`The backup set cannot move a door this size.`:`A door this heavy does not move without power.`),G(r,`deny`);return}if(Ni(t)){if(a===0){W(r,n.card?`The reader is dark. It needs power to read a card, and the door will not slide.`:`The keypad is dark, and the door will not slide.`),G(r,`deny`);return}if(n.card){if(!r.keys.includes(n.card)){W(r,`The reader wants: `+ri(n.card)+`.`),G(r,`deny`);return}if(t.unlocked=!0,G(r,`take`),W(r,`The reader takes the card.`),!o)return}else{r.pad={code:n.code===2?r.code2:r.code,typed:``,door:e.doors.indexOf(t)},r.events.push({type:`pad`});return}}!o&&a>0||t.open&&Fi(t,vu(e))||(t.open=!t.open,t.hold=3,G(r,`door`,i),yi(r,o?10:7))}function iu(e,t,n){let r=e.pad;if(r&&(r.miss=void 0,n===`C`?r.typed=``:r.typed.length<4&&(r.typed+=n),G(e,`take`),r.typed.length===4)){if(r.typed===r.code){let n=t.doors[r.door];n&&(n.unlocked=!0),e.pad=null,W(e,`The keypad goes green.`)}else G(e,`deny`),r.miss=r.typed,r.typed=``}}function au(e){let t=e.player,n=t.body,r=n.y+jo(t),i=Math.cos(t.pitch),a=[-Math.sin(t.yaw)*i,Math.sin(t.pitch),-Math.cos(t.yaw)*i],o=null,s=.78;for(let t of e.usables){if(t.off)continue;let e=t.x-n.x,i=t.y-r,c=t.z-n.z,l=Math.hypot(e,i,c);if(l>t.r)continue;let u=l<.5?1:(e*a[0]+i*a[1]+c*a[2])/l;if(u<=s)continue;let d=t.label();d&&(s=u,o=Object.assign(t,{text:d}))}return o}var ou=7,su=.4,cu=.001;function lu(e,t){let n=Math.abs(Math.cos(t.ry)),r=Math.abs(Math.sin(t.ry)),i=(t.sx*n+t.sz*r)/2,a=(t.sx*r+t.sz*n)/2,o={kind:`loose`,id:e.newId(),x0:0,y0:0,z0:0,x1:0,y1:0,z1:0,mat:t.mat},s={prop:t,x:t.x,y:t.y,z:t.z,hx:i,hz:a,h:t.sy,vx:0,vy:0,vz:0,awake:!1,ground:!0,still:0,woke:0,on:null,dyn:o,sync:()=>du(s),clear:(t,n,r)=>!e.overlap(uu(s,s.x+t,s.z+r),s.y+n+cu,s.y+n+s.h,s.dyn)};return e.dyn.push(o),du(s),s}var uu=(e,t=e.x,n=e.z)=>Nn(t,n,e.hx-.005,e.hz-.005);function du(e){let t=e.dyn;t.x0=e.x-e.hx,t.x1=e.x+e.hx,t.z0=e.z-e.hz,t.z1=e.z+e.hz,t.y0=e.y,t.y1=e.y+e.h}var fu=class{all;w;constructor(e,t){this.all=e,this.w=t;for(let n of e)n.on=$r(t,uu(n),n.y,n.dyn)}awakeCount(){let e=0;for(let t of this.all)t.awake&&e++;return e}wake(e,t){if(!e.awake){if(this.awakeCount()>=16){let e=null;for(let t of this.all)t.awake&&t.ground&&(!e||t.woke<e.woke)&&(e=t);e&&this.sleep(e)}e.awake=!0,e.still=0,e.woke=t}}sleep(e){e.awake=!1,e.vx=0,e.vy=0,e.vz=0}push(e,t,n,r,i){this.wake(e,i);let a=e.vx*t+e.vz*n;a<r&&(e.vx+=t*(r-a),e.vz+=n*(r-a))}update(e,t,n){for(let r of this.all)r.awake&&this.step(r,e,t,n)}step(e,t,n,r){let i=this.w;if(e.ground){let n=Math.max(0,1-ou*t);e.vx*=n,e.vz*=n}this.slide(e,e.vx*t,0,n,r),this.slide(e,0,e.vz*t,n,r),e.vy-=20*t;let a=uu(e),o=i.groundBelow(a,e.y+.05,e.dyn),s=e.y+e.vy*t;s<=o?(s=o,e.vy=0,e.ground=!0):e.ground=!1;let c=i.ceilingAbove(a,e.y+e.h,e.dyn,Math.max(e.y,s)+e.h+.5);s+e.h>c&&(s=Math.max(o,c-e.h),e.vy>0&&(e.vy=0)),s!==e.y&&this.wakeRiders(e,n),e.y=s,e.on=e.ground?$r(i,a,e.y,e.dyn):null,du(e),e.ground&&Math.hypot(e.vx,e.vz)<.05?(e.still+=t,e.still>su&&this.sleep(e)):e.still=0}slide(e,t,n,r,i){if(!t&&!n)return;let a=this.w,o=a.sweep(uu(e),e.y+cu,e.y+e.h,t,n,e.dyn),s=t*o,c=n*o;if(o<1){let i=a.overlap(uu(e,e.x+t,e.z+n),e.y+cu,e.y+e.h,e.dyn),o=i&&i!==`world`&&i.kind===`loose`?this.all.find(e=>e.dyn===i):void 0;o?(this.wake(o,r),t?(o.vx+=e.vx*.6,e.vx*=.3):(o.vz+=e.vz*.6,e.vz*=.3)):t?e.vx=0:e.vz=0}if(s||c){e.x+=s,e.z+=c,du(e);for(let t of i)if(t.on===e.dyn){t.clear(s,0,c)&&(t.x+=s,t.z+=c,t.sync());let e=this.all.find(e=>e===t);e&&this.wake(e,r)}}}wakeRiders(e,t){for(let n of this.all)n.on===e.dyn&&this.wake(n,t)}};function pu(e){return new yr(e.world,t=>si(e.game,t),t=>e.doors[t].t,hu(e))}var mu=e=>e.batt<15?.6:1;function hu(e){let t=[];e.items.forEach((n,r)=>{if(n.taken||!n.on)return;let{yaw:i,pitch:a}=n.on,o=Math.cos(a),s=-Math.sin(i)*o,c=Math.sin(a),l=-Math.cos(i)*o,u=n.raw?mu(e.game):1,d=`item`+r;n.id===`flash`?t.push({key:d,kind:`flash`,x:n.x+s*.15,y:n.y+.04,z:n.z+l*.15,dx:s,dy:c,dz:l,k:u}):n.id===`lantern`&&t.push({key:d,kind:`lantern`,x:n.x,y:n.y+.2,z:n.z,dx:0,dy:1,dz:0,k:u})});for(let n of e.cast){if(!n.torch||n.dead||n.away)continue;let{x:r,y:i,z:a,dx:o,dy:s,dz:c}=Xc(e,n);t.push({key:`torch`+n.id,kind:`flash`,x:r,y:i,z:a,dx:o,dy:s,dz:c,k:1})}return t}function gu(e){let t=e.player.body,n=t.x-Math.sin(e.player.yaw)*.7,r=t.z-Math.cos(e.player.yaw)*.7;return e.world.solidAt(n,t.y+.1,r)&&(n=t.x,r=t.z),{x:n,y:e.world.groundBelow({x:n,z:r,hx:.1,hz:.1,round:!0},t.y+.5),z:r}}function _u(e,t={}){let n=new Vn(e),r=e.start,i=t.rng??new d(t.seed??e.seed),a=new fu(e.props.filter(e=>e.loose).map(e=>lu(n,e)),n),o=t.station?{circuits:structuredClone(t.station.circuits),ladders:structuredClone(t.station.ladders),main:t.station.main,fuseIn:!1,names:{...t.station.names},built:t.station.levels.map(e=>e.id)}:null,s={tick:0,world:n,loose:a,rng:i,game:t.game??oi(i,o),player:Ao(n,r.x,r.y,r.z,r.yaw),doors:e.doors.map(e=>Di(n,e)),platforms:e.platforms.map(e=>Ai(n,e)),items:e.items.map(e=>({...e,taken:!1})),usables:[],focus:null,cast:[],fields:null,hands:Fo(),wormN:0,front:-1,lighting:null,cams:[],alarms:[],mute:[],drills:[],watch:null,opening:null,pools:[]};for(let e of s.doors)Pi(e,si(s.game,e.def.circuit));s.cams=bl(s),s.usables=$l(s),s.cast=ls(s,e.mutants),s.cast.length&&(s.fields=Vi(s),ia(s,s.fields));let c=!t.game&&!!t.station&&e.id===t.station.start;return c&&t.opening?s.opening=Gl(s):Kl(s),c&&!s.opening&&t.station?.intro&&W(s.game,t.station.intro),s}function vu(e){return[e.player.body,...e.loose.all,...ps(e)]}var yu=e=>{let t=e.player.body;return t.y+jo(e.player)<e.world.waterAt(t.x,t.z)};function bu(e,t){let n=e.game;switch(t.type){case`use`:gi(n,t.slot);break;case`drop`:{let r=n.inv[t.slot];if(!r)return;n.inv.splice(t.slot,1),n.weapon===r.id&&(n.weapon=null);let i={id:r.id,n:r.n,...gu(e),taken:!1,raw:!0};e.items.push(i),e.usables.push(tu(e,i)),G(n,`step`);break}case`putDown`:{if(!n.tools.includes(t.tool))return;n.tools.splice(n.tools.indexOf(t.tool),1);let r=n.light===t.tool&&n.lightOn&&!(t.tool===`flash`&&yu(e));n.light===t.tool&&(n.lightOn=!1,n.light=n.tools[0]??null);let i={id:t.tool,n:1,...gu(e),taken:!1,raw:!0,...r?{on:{yaw:e.player.yaw,pitch:.04}}:{}};e.items.push(i),e.usables.push(tu(e,i)),G(n,`step`);break}case`light`:mi(n,t.tool,yu(e));break;case`unwear`:_i(n,t.id);break;case`pad`:iu(n,e,t.key);break;case`padClose`:n.pad=null;break;case`read`:n.notes[t.key]&&(n.events.push({type:`note`,key:t.key}),G(n,`paper`));break;case`lift`:{let r=e.world.def.id;if(t.level===r)break;if(!n.station?.built.includes(t.level)){W(n,(n.station?.names[t.level]??`That level`)+` is not built yet.`);break}n.travel={level:t.level,mark:`lift`};break}}}function xu(e){for(let t of e.game.commands.splice(0))bu(e,t)}function Su(t,n){let r=t.game;if(xu(t),r.ended)return;t.watch&&(n=Bl(t,n)),t.tick++,r.time+=e;let i=vu(t),o=t.player.body,s=[o,...ms(t)],c=r.events.length;for(let e of t.doors){let t={x:(e.def.x0+e.def.x1)/2,y:e.def.y0,z:(e.def.z0+e.def.z1)/2},n=si(r,e.def.circuit);Pi(e,n)&&G(r,`bolt-free`,{...t,y:t.y+1.2}),Ii(e,i,s,n,.016666666666666666)&&G(r,`door`,t)}t.lighting?.follow(e=>t.doors[e].t);for(let n of t.platforms){let a=Ri(n,i,e),o={x:(n.def.x0+n.def.x1)/2,y:n.y,z:(n.def.z0+n.def.z1)/2};a===`arrived`?G(r,`thud`,o):a===`moving`&&t.rng.chance(.1)&&G(r,`rattle`,o,!0)}t.player.airMax=ko(r.worn),t.player.air=Math.min(t.player.air,t.player.airMax),t.player.load=ii(r.weapon).mass*+!!r.weapon,o.mass=75+t.player.load,t.player.pace=Ho(t),t.opening&&(n=Ql(t,n)),t.player.down=Uo(t);let{stride:l,hit:u}=No(t.world,t.player,n,e);if(u&&u!==`world`&&u.kind===`loose`){let e=t.loose.all.find(e=>e.dyn===u),n=Math.hypot(l.dx,l.dz);e&&n>0&&t.loose.push(e,l.dx/n,l.dz/n,l.speed*.9,t.tick)}if(u&&u!==`world`&&u.kind===`body`){let n=t.cast.find(e=>e.body?.dyn===u);n?.body&&(Xr(o,n.body,l.dx/e,l.dz/e,l.wx,l.wz,!0),fl(t,n))}else if(u&&t.player.thrown&&t.player.slam>no.min){let e=t.player.slam-no.min;G(r,`thud`),yi(r,8),xi(r,e*no.dmg,`You met the wall harder than it met you.`,.5);let n=Ko(t,e*no.poise);ci(r,`slam → you  ${(e*no.dmg).toFixed(0)} dmg  (${e.toFixed(1)} m/s over)  → ${n}`)}let d=t.player;d.impact>3&&d.water===`dry`&&G(r,`land`,void 0,!1,0,a((d.impact-3)/9,0,1)),d.impact>10?(xi(r,(d.impact-10)*6,`It was further down than it looked.`,.5),yi(r,8)):d.impact>4&&yi(r,5),d.air<=0&&xi(r,14*e,`Your chest made the decision for you, and the water came in.`,0,!1),d.jumped&&(yi(r,3),G(r,`jump`));let f=d.water!==`dry`;d.stepD+=d.moved,d.stepD>(f?1.3:d.running?2.3:1.7)&&(d.stepD=0,f?G(r,`slosh`):d.crouch||G(r,`step`,void 0,!1,d.running?0:8)),r.noiseT>0?r.noiseT-=e:r.noiseI=0;let p=d.moved>.001?d.water===`swimming`?3:d.water===`wading`?5:d.crouch?0:d.running?9:4:0;Wo(t,n),r.noise=Math.max(p,r.noiseI),n.light&&mi(r,null,yu(t)),hi(r,e,yu(t));for(let n of t.items)n.on&&!n.taken&&n.raw&&(r.batt-=e*100/(n.id===`flash`?270:420),r.batt<=0&&(r.batt=0,delete n.on));if(t.lighting?.lights(hu(t)),t.cast.length){t.lighting??=pu(t);let e=t.lighting.seen(o.x,o.y+.5,o.z);r.vis=a(.3+Math.max(e[0],e[1],e[2])*.8+(r.lightOn?.35:0),.3,1.3)*(d.crouch?.6:1)}t.fields&&ta(t,t.fields),Ll(t),il(t),Yl(t),_a(t),t.loose.update(e,t.tick,i);let m=t.watch?null:au(t);t.focus=m?{text:m.text}:null,n.use&&m&&m.act();for(let e=c;e<r.events.length;e++){let n=r.events[e];n.type===`relight`&&(t.lighting=null),n.type===`power`&&(t.lighting=null,n.loud?(yi(r,30),r.events.push({type:`shake`,k:.4})):n.quiet||G(r,`door`))}}var Cu=1e3,wu=1001,Tu=1002,Eu=1003,Du=1004,Ou=1005,ku=1006,Au=1007,ju=1008,Mu=1009,Nu=1010,Pu=1011,Fu=1012,Iu=1013,Lu=1014,Ru=1015,zu=1016,Bu=1017,Vu=1018,Hu=1020,Uu=35902,Wu=35899,Gu=1021,Ku=1022,qu=1023,Ju=1026,Yu=1027,Xu=1028,Zu=1029,Qu=1030,$u=1031,ed=1033,td=33776,nd=33777,rd=33778,id=33779,ad=35840,od=35841,sd=35842,cd=35843,ld=36196,ud=37492,dd=37496,fd=37488,pd=37489,md=37490,hd=37491,gd=37808,_d=37809,vd=37810,yd=37811,bd=37812,xd=37813,Sd=37814,Cd=37815,wd=37816,Td=37817,Ed=37818,Dd=37819,Od=37820,kd=37821,Ad=36492,jd=36494,Md=36495,Nd=36283,Pd=36284,Fd=36285,Id=36286,Ld=2300,Rd=2301,zd=2302,Bd=2303,Vd=2400,Hd=2401,Ud=2402,Wd=3200,Gd=`srgb`,Kd=`srgb-linear`,qd=`linear`,Jd=`srgb`,Yd=7680,Xd=35044,Zd=35048,Qd=2e3;function $d(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function ef(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function tf(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function nf(){let e=tf(`canvas`);return e.style.display=`block`,e}var rf={};function af(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function of(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function q(...e){e=of(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function J(...e){e=of(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function sf(...e){let t=e.join(` `);t in rf||(rf[t]=!0,q(...e))}function cf(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var lf={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3},uf=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},df=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),ff=Math.PI/180,pf=180/Math.PI;function mf(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(df[e&255]+df[e>>8&255]+df[e>>16&255]+df[e>>24&255]+`-`+df[t&255]+df[t>>8&255]+`-`+df[t>>16&15|64]+df[t>>24&255]+`-`+df[n&63|128]+df[n>>8&255]+`-`+df[n>>16&255]+df[n>>24&255]+df[r&255]+df[r>>8&255]+df[r>>16&255]+df[r>>24&255]).toLowerCase()}function hf(e,t,n){return Math.max(t,Math.min(n,e))}function gf(e,t){return(e%t+t)%t}function _f(e,t,n){return(1-n)*e+n*t}function vf(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:case Uint8ClampedArray:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}function yf(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}var bf=class e{static{e.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=hf(this.x,e.x,t.x),this.y=hf(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=hf(this.x,e,t),this.y=hf(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(hf(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(hf(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},xf=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:q(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(hf(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},Y=class e{static{e.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Cf.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Cf.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=hf(this.x,e.x,t.x),this.y=hf(this.y,e.y,t.y),this.z=hf(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=hf(this.x,e,t),this.y=hf(this.y,e,t),this.z=hf(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(hf(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Sf.copy(this).projectOnVector(e),this.sub(Sf)}reflect(e){return this.sub(Sf.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(hf(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Sf=new Y,Cf=new xf,wf=class e{static{e.prototype.isMatrix3=!0}constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return sf(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(Tf.makeScale(e,t)),this}rotate(e){return sf(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(Tf.makeRotation(-e)),this}translate(e,t){return sf(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(Tf.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Tf=new wf,Ef=new wf().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Df=new wf().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Of(){let e={enabled:!0,workingColorSpace:Kd,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n?e:(this.spaces[t].transfer===`srgb`&&(e.r=Af(e.r),e.g=Af(e.g),e.b=Af(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=jf(e.r),e.g=jf(e.g),e.b=jf(e.b)),e)},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?qd:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(t,n){return sf(`ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`),e.workingToColorSpace(t,n)},toWorkingColorSpace:function(t,n){return sf(`ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`),e.colorSpaceToWorking(t,n)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[Kd]:{primaries:t,whitePoint:r,transfer:qd,toXYZ:Ef,fromXYZ:Df,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:Gd},outputColorSpaceConfig:{drawingBufferColorSpace:Gd}},[Gd]:{primaries:t,whitePoint:r,transfer:Jd,toXYZ:Ef,fromXYZ:Df,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:Gd}}}),e}var kf=Of();function Af(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function jf(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var Mf,Nf=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Mf===void 0&&(Mf=tf(`canvas`)),Mf.width=e.width,Mf.height=e.height;let t=Mf.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=Mf}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=tf(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=Af(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(Af(t[e]/255)*255):t[e]=Af(t[e]);return{data:t,width:e.width,height:e.height}}return q(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},Pf=0,Ff=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Pf++}),this.uuid=mf(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width,t.height,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(If(r[t].image)):e.push(If(r[t]))}else e=If(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function If(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?Nf.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(q(`Texture: Unable to serialize Texture.`),{})}var Lf=0,Rf=new Y,zf=class e extends uf{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=wu,i=wu,a=ku,o=ju,s=qu,c=Mu,l=e.DEFAULT_ANISOTROPY,u=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Lf++}),this.uuid=mf(),this.name=``,this.source=new Ff(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=i,this.magFilter=a,this.minFilter=o,this.anisotropy=l,this.format=s,this.internalFormat=null,this.type=c,this.offset=new bf(0,0),this.repeat=new bf(1,1),this.center=new bf(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new wf,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Rf).x}get height(){return this.source.getSize(Rf).y}get depth(){return this.source.getSize(Rf).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){q(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){q(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Cu:e.x-=Math.floor(e.x);break;case wu:e.x=e.x<0?0:1;break;case Tu:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case Cu:e.y-=Math.floor(e.y);break;case wu:e.y=e.y<0?0:1;break;case Tu:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};zf.DEFAULT_IMAGE=null,zf.DEFAULT_MAPPING=300,zf.DEFAULT_ANISOTROPY=1;var Bf=class e{static{e.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=hf(this.x,e.x,t.x),this.y=hf(this.y,e.y,t.y),this.z=hf(this.z,e.z,t.z),this.w=hf(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=hf(this.x,e,t),this.y=hf(this.y,e,t),this.z=hf(this.z,e,t),this.w=hf(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(hf(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Vf=class extends uf{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ku,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Bf(0,0,e,t),this.scissorTest=!1,this.viewport=new Bf(0,0,e,t),this.textures=[];let r=new zf({width:e,height:t,depth:n.depth}),i=n.count;for(let e=0;e<i;e++)this.textures[e]=r.clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:ku,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new Ff(n)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null){if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture}return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},Hf=class extends Vf{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Uf=class extends zf{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Eu,this.minFilter=Eu,this.wrapR=wu,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},Wf=class extends zf{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Eu,this.minFilter=Eu,this.wrapR=wu,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},Gf=class e{static{e.prototype.isMatrix4=!0}constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/Kf.setFromMatrixColumn(e,0).length(),i=1/Kf.setFromMatrixColumn(e,1).length(),a=1/Kf.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Jf,e,Yf)}lookAt(e,t,n){let r=this.elements;return Qf.subVectors(e,t),Qf.lengthSq()===0&&(Qf.z=1),Qf.normalize(),Xf.crossVectors(n,Qf),Xf.lengthSq()===0&&(Math.abs(n.z)===1?Qf.x+=1e-4:Qf.z+=1e-4,Qf.normalize(),Xf.crossVectors(n,Qf)),Xf.normalize(),Zf.crossVectors(Qf,Xf),r[0]=Xf.x,r[4]=Zf.x,r[8]=Qf.x,r[1]=Xf.y,r[5]=Zf.y,r[9]=Qf.y,r[2]=Xf.z,r[6]=Zf.z,r[10]=Qf.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],k=r[2],A=r[6],j=r[10],ee=r[14],M=r[3],te=r[7],ne=r[11],re=r[15];return i[0]=a*x+o*T+s*k+c*M,i[4]=a*S+o*E+s*A+c*te,i[8]=a*C+o*D+s*j+c*ne,i[12]=a*w+o*O+s*ee+c*re,i[1]=l*x+u*T+d*k+f*M,i[5]=l*S+u*E+d*A+f*te,i[9]=l*C+u*D+d*j+f*ne,i[13]=l*w+u*O+d*ee+f*re,i[2]=p*x+m*T+h*k+g*M,i[6]=p*S+m*E+h*A+g*te,i[10]=p*C+m*D+h*j+g*ne,i[14]=p*w+m*O+h*ee+g*re,i[3]=_*x+v*T+y*k+b*M,i[7]=_*S+v*E+y*A+b*te,i[11]=_*C+v*D+y*j+b*ne,i[15]=_*w+v*O+y*ee+b*re,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,O=d*g-f*h,k=_*O-v*D+y*E+b*T-x*w+S*C;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/k;return e[0]=(o*O-s*D+c*E)*A,e[1]=(r*D-n*O-i*E)*A,e[2]=(m*S-h*x+g*b)*A,e[3]=(d*x-u*S-f*b)*A,e[4]=(s*T-a*O-c*w)*A,e[5]=(t*O-r*T+i*w)*A,e[6]=(h*y-p*S-g*v)*A,e[7]=(l*S-d*y+f*v)*A,e[8]=(a*D-o*T+c*C)*A,e[9]=(n*T-t*D-i*C)*A,e[10]=(p*x-m*y+g*_)*A,e[11]=(u*y-l*x-f*_)*A,e[12]=(o*w-a*E-s*C)*A,e[13]=(t*E-n*w+r*C)*A,e[14]=(m*v-p*b-h*_)*A,e[15]=(l*b-u*v+d*_)*A,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=Kf.set(r[0],r[1],r[2]).length(),o=Kf.set(r[4],r[5],r[6]).length(),s=Kf.set(r[8],r[9],r[10]).length();i<0&&(a=-a),qf.copy(this);let c=1/a,l=1/o,u=1/s;return qf.elements[0]*=c,qf.elements[1]*=c,qf.elements[2]*=c,qf.elements[4]*=l,qf.elements[5]*=l,qf.elements[6]*=l,qf.elements[8]*=u,qf.elements[9]*=u,qf.elements[10]*=u,t.setFromRotationMatrix(qf),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=Qd,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=Qd,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Kf=new Y,qf=new Gf,Jf=new Y(0,0,0),Yf=new Y(1,1,1),Xf=new Y,Zf=new Y,Qf=new Y,$f=new Gf,ep=new xf,tp=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(hf(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-hf(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(hf(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-hf(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(hf(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-hf(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:q(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return $f.makeRotationFromQuaternion(e),this.setFromRotationMatrix($f,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ep.setFromEuler(this),this.setFromQuaternion(ep,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};tp.DEFAULT_ORDER=`XYZ`;var np=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&(1<<e|0))}},rp=0,ip=new Y,ap=new xf,op=new Gf,sp=new Y,cp=new Y,lp=new Y,up=new xf,dp=new Y(1,0,0),fp=new Y(0,1,0),pp=new Y(0,0,1),mp={type:`added`},hp={type:`removed`},gp={type:`childadded`,child:null},_p={type:`childremoved`,child:null},vp=class e extends uf{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:rp++}),this.uuid=mf(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new Y,n=new tp,r=new xf,i=new Y(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Gf},normalMatrix:{value:new wf}}),this.matrix=new Gf,this.matrixWorld=new Gf,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new np,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ap.setFromAxisAngle(e,t),this.quaternion.multiply(ap),this}rotateOnWorldAxis(e,t){return ap.setFromAxisAngle(e,t),this.quaternion.premultiply(ap),this}rotateX(e){return this.rotateOnAxis(dp,e)}rotateY(e){return this.rotateOnAxis(fp,e)}rotateZ(e){return this.rotateOnAxis(pp,e)}translateOnAxis(e,t){return ip.copy(e).applyQuaternion(this.quaternion),this.position.add(ip.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(dp,e)}translateY(e){return this.translateOnAxis(fp,e)}translateZ(e){return this.translateOnAxis(pp,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(op.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?sp.copy(e):sp.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),cp.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?op.lookAt(cp,sp,this.up):op.lookAt(sp,cp,this.up),this.quaternion.setFromRotationMatrix(op),r&&(op.extractRotation(r.matrixWorld),ap.setFromRotationMatrix(op),this.quaternion.premultiply(ap.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(J(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(mp),gp.child=e,this.dispatchEvent(gp),gp.child=null):J(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(hp),_p.child=e,this.dispatchEvent(_p),_p.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),op.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),op.multiply(e.parent.matrixWorld)),e.applyMatrix4(op),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(mp),gp.child=e,this.dispatchEvent(gp),gp.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(cp,e,lp),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(cp,up,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:`dispose`})}};vp.DEFAULT_UP=new Y(0,1,0),vp.DEFAULT_MATRIX_AUTO_UPDATE=!0,vp.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var yp=class extends vp{constructor(){super(),this.isGroup=!0,this.type=`Group`}},bp={type:`move`},xp=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new yp,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new yp,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new Y,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new Y),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new yp,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new Y,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new Y,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(bp)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new yp;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Sp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Cp={h:0,s:0,l:0},wp={h:0,s:0,l:0};function Tp(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var Ep=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Gd){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,kf.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=kf.workingColorSpace){return this.r=e,this.g=t,this.b=n,kf.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=kf.workingColorSpace){if(e=gf(e,1),t=hf(t,0,1),n=hf(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=Tp(i,r,e+1/3),this.g=Tp(i,r,e),this.b=Tp(i,r,e-1/3)}return kf.colorSpaceToWorking(this,r),this}setStyle(e,t=Gd){function n(t){t!==void 0&&parseFloat(t)<1&&q(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:q(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);q(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Gd){let n=Sp[e.toLowerCase()];return n===void 0?q(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Af(e.r),this.g=Af(e.g),this.b=Af(e.b),this}copyLinearToSRGB(e){return this.r=jf(e.r),this.g=jf(e.g),this.b=jf(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Gd){return kf.workingToColorSpace(Dp.copy(this),e),Math.round(hf(Dp.r*255,0,255))*65536+Math.round(hf(Dp.g*255,0,255))*256+Math.round(hf(Dp.b*255,0,255))}getHexString(e=Gd){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=kf.workingColorSpace){kf.workingToColorSpace(Dp.copy(this),t);let n=Dp.r,r=Dp.g,i=Dp.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=kf.workingColorSpace){return kf.workingToColorSpace(Dp.copy(this),t),e.r=Dp.r,e.g=Dp.g,e.b=Dp.b,e}getStyle(e=Gd){kf.workingToColorSpace(Dp.copy(this),e);let t=Dp.r,n=Dp.g,r=Dp.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(Cp),this.setHSL(Cp.h+e,Cp.s+t,Cp.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Cp),e.getHSL(wp);let n=_f(Cp.h,wp.h,t),r=_f(Cp.s,wp.s,t),i=_f(Cp.l,wp.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Dp=new Ep;Ep.NAMES=Sp;var Op=class extends vp{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new tp,this.environmentIntensity=1,this.environmentRotation=new tp,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},kp=new Y,Ap=new Y,jp=new Y,Mp=new Y,Np=new Y,Pp=new Y,Fp=new Y,Ip=new Y,Lp=new Y,Rp=new Y,zp=new Bf,Bp=new Bf,Vp=new Bf,Hp=class e{constructor(e=new Y,t=new Y,n=new Y){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),kp.subVectors(e,t),r.cross(kp);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){kp.subVectors(r,t),Ap.subVectors(n,t),jp.subVectors(e,t);let a=kp.dot(kp),o=kp.dot(Ap),s=kp.dot(jp),c=Ap.dot(Ap),l=Ap.dot(jp),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Mp)!==null&&Mp.x>=0&&Mp.y>=0&&Mp.x+Mp.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,Mp)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,Mp.x),s.addScaledVector(a,Mp.y),s.addScaledVector(o,Mp.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return zp.setScalar(0),Bp.setScalar(0),Vp.setScalar(0),zp.fromBufferAttribute(e,t),Bp.fromBufferAttribute(e,n),Vp.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(zp,i.x),a.addScaledVector(Bp,i.y),a.addScaledVector(Vp,i.z),a}static isFrontFacing(e,t,n,r){return kp.subVectors(n,t),Ap.subVectors(e,t),kp.cross(Ap).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return kp.subVectors(this.c,this.b),Ap.subVectors(this.a,this.b),kp.cross(Ap).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;Np.subVectors(r,n),Pp.subVectors(i,n),Ip.subVectors(e,n);let s=Np.dot(Ip),c=Pp.dot(Ip);if(s<=0&&c<=0)return t.copy(n);Lp.subVectors(e,r);let l=Np.dot(Lp),u=Pp.dot(Lp);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(Np,a);Rp.subVectors(e,i);let f=Np.dot(Rp),p=Pp.dot(Rp);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(Pp,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return Fp.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(Fp,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(Np,a).addScaledVector(Pp,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Up=class{constructor(e=new Y(1/0,1/0,1/0),t=new Y(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Gp.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Gp.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Gp.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,Gp):Gp.fromBufferAttribute(r,t),Gp.applyMatrix4(e.matrixWorld),this.expandByPoint(Gp);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),Kp.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),Kp.copy(e.boundingBox)),Kp.applyMatrix4(e.matrixWorld),this.union(Kp)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Gp),Gp.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter($p),em.subVectors(this.max,$p),qp.subVectors(e.a,$p),Jp.subVectors(e.b,$p),Yp.subVectors(e.c,$p),Xp.subVectors(Jp,qp),Zp.subVectors(Yp,Jp),Qp.subVectors(qp,Yp);let t=[0,-Xp.z,Xp.y,0,-Zp.z,Zp.y,0,-Qp.z,Qp.y,Xp.z,0,-Xp.x,Zp.z,0,-Zp.x,Qp.z,0,-Qp.x,-Xp.y,Xp.x,0,-Zp.y,Zp.x,0,-Qp.y,Qp.x,0];return!rm(t,qp,Jp,Yp,em)||(t=[1,0,0,0,1,0,0,0,1],!rm(t,qp,Jp,Yp,em))?!1:(tm.crossVectors(Xp,Zp),t=[tm.x,tm.y,tm.z],rm(t,qp,Jp,Yp,em))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Gp).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Gp).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Wp[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Wp[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Wp[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Wp[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Wp[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Wp[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Wp[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Wp[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Wp),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Wp=[new Y,new Y,new Y,new Y,new Y,new Y,new Y,new Y],Gp=new Y,Kp=new Up,qp=new Y,Jp=new Y,Yp=new Y,Xp=new Y,Zp=new Y,Qp=new Y,$p=new Y,em=new Y,tm=new Y,nm=new Y;function rm(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){nm.fromArray(e,a);let o=i.x*Math.abs(nm.x)+i.y*Math.abs(nm.y)+i.z*Math.abs(nm.z),s=t.dot(nm),c=n.dot(nm),l=r.dot(nm);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var im=new Y,am=new bf,om=0,sm=class extends uf{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:om++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=Xd,this.updateRanges=[],this.gpuType=Ru,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)am.fromBufferAttribute(this,t),am.applyMatrix3(e),this.setXY(t,am.x,am.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)im.fromBufferAttribute(this,t),im.applyMatrix3(e),this.setXYZ(t,im.x,im.y,im.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)im.fromBufferAttribute(this,t),im.applyMatrix4(e),this.setXYZ(t,im.x,im.y,im.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)im.fromBufferAttribute(this,t),im.applyNormalMatrix(e),this.setXYZ(t,im.x,im.y,im.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)im.fromBufferAttribute(this,t),im.transformDirection(e),this.setXYZ(t,im.x,im.y,im.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=vf(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=yf(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=vf(t,this.array)),t}setX(e,t){return this.normalized&&(t=yf(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=vf(t,this.array)),t}setY(e,t){return this.normalized&&(t=yf(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=vf(t,this.array)),t}setZ(e,t){return this.normalized&&(t=yf(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=vf(t,this.array)),t}setW(e,t){return this.normalized&&(t=yf(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=yf(t,this.array),n=yf(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=yf(t,this.array),n=yf(n,this.array),r=yf(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=yf(t,this.array),n=yf(n,this.array),r=yf(r,this.array),i=yf(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:`dispose`})}},cm=class extends sm{constructor(e,t,n){super(new Uint16Array(e),t,n)}},lm=class extends sm{constructor(e,t,n){super(new Uint32Array(e),t,n)}},um=class extends sm{constructor(e,t,n){super(new Float32Array(e),t,n)}},dm=new Up,fm=new Y,pm=new Y,mm=class{constructor(e=new Y,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?dm.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;fm.subVectors(e,this.center);let t=fm.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(fm,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(pm.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(fm.copy(e.center).add(pm)),this.expandByPoint(fm.copy(e.center).sub(pm))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},hm=0,gm=new Gf,_m=new vp,vm=new Y,ym=new Up,bm=new Up,xm=new Y,Sm=class e extends uf{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:hm++}),this.uuid=mf(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new($d(e)?lm:cm)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new wf().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return gm.makeRotationFromQuaternion(e),this.applyMatrix4(gm),this}rotateX(e){return gm.makeRotationX(e),this.applyMatrix4(gm),this}rotateY(e){return gm.makeRotationY(e),this.applyMatrix4(gm),this}rotateZ(e){return gm.makeRotationZ(e),this.applyMatrix4(gm),this}translate(e,t,n){return gm.makeTranslation(e,t,n),this.applyMatrix4(gm),this}scale(e,t,n){return gm.makeScale(e,t,n),this.applyMatrix4(gm),this}lookAt(e){return _m.lookAt(e),_m.updateMatrix(),this.applyMatrix4(_m.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(vm).negate(),this.translate(vm.x,vm.y,vm.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new um(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&q(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Up);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){J(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new Y(-1/0,-1/0,-1/0),new Y(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];ym.setFromBufferAttribute(n),this.morphTargetsRelative?(xm.addVectors(this.boundingBox.min,ym.min),this.boundingBox.expandByPoint(xm),xm.addVectors(this.boundingBox.max,ym.max),this.boundingBox.expandByPoint(xm)):(this.boundingBox.expandByPoint(ym.min),this.boundingBox.expandByPoint(ym.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&J(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new mm);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){J(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new Y,1/0);return}if(e){let n=this.boundingSphere.center;if(ym.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];bm.setFromBufferAttribute(n),this.morphTargetsRelative?(xm.addVectors(ym.min,bm.min),ym.expandByPoint(xm),xm.addVectors(ym.max,bm.max),ym.expandByPoint(xm)):(ym.expandByPoint(bm.min),ym.expandByPoint(bm.max))}ym.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)xm.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(xm));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)xm.fromBufferAttribute(a,t),o&&(vm.fromBufferAttribute(e,t),xm.add(vm)),r=Math.max(r,n.distanceToSquared(xm))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&J(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){J(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new sm(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[];for(let e=0;e<n.count;e++)o[e]=new Y,s[e]=new Y;let c=new Y,l=new Y,u=new Y,d=new bf,f=new bf,p=new bf,m=new Y,h=new Y;function g(e,t,r){c.fromBufferAttribute(n,e),l.fromBufferAttribute(n,t),u.fromBufferAttribute(n,r),d.fromBufferAttribute(i,e),f.fromBufferAttribute(i,t),p.fromBufferAttribute(i,r),l.sub(c),u.sub(c),f.sub(d),p.sub(d);let a=1/(f.x*p.y-p.x*f.y);isFinite(a)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(a),h.copy(u).multiplyScalar(f.x).addScaledVector(l,-p.x).multiplyScalar(a),o[e].add(m),o[t].add(m),o[r].add(m),s[e].add(h),s[t].add(h),s[r].add(h))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)g(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let v=new Y,y=new Y,b=new Y,x=new Y;function S(e){b.fromBufferAttribute(r,e),x.copy(b);let t=o[e];v.copy(t),v.sub(b.multiplyScalar(b.dot(t))).normalize(),y.crossVectors(x,t);let n=y.dot(s[e])<0?-1:1;a.setXYZW(e,v.x,v.y,v.z,n)}for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)S(e.getX(t+0)),S(e.getX(t+1)),S(e.getX(t+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new sm(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new Y,i=new Y,a=new Y,o=new Y,s=new Y,c=new Y,l=new Y,u=new Y;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)xm.fromBufferAttribute(e,t),xm.normalize(),e.setXYZ(t,xm.x,xm.y,xm.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new sm(a,r,i)}if(this.index===null)return q(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},Cm=new Y,wm=new Y,Tm=new wf,Em=class{constructor(e=new Y(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=Cm.subVectors(n,t).cross(wm.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(Cm),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Tm.getNormalMatrix(e),r=this.coplanarPoint(Cm).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},Dm=0,Om=class extends uf{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Dm++}),this.uuid=mf(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ep(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Yd,this.stencilZFail=Yd,this.stencilZPass=Yd,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){q(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){q(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(e=>e.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Ep().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(e=>new Em().fromJSON(e))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new bf().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new bf().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},km=new Y,Am=new Y,jm=new Y,Mm=new Y,Nm=class{constructor(e=new Y,t=new Y(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,km)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=km.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(km.copy(this.origin).addScaledVector(this.direction,t),km.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Am.copy(e).add(t).multiplyScalar(.5),jm.copy(t).sub(e).normalize(),Mm.copy(this.origin).sub(Am);let i=e.distanceTo(t)*.5,a=-this.direction.dot(jm),o=Mm.dot(this.direction),s=-Mm.dot(jm),c=Mm.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(Am).addScaledVector(jm,d),f}intersectSphere(e,t){if(e.radius<0)return null;km.subVectors(e.center,this.origin);let n=km.dot(this.direction),r=km.dot(km)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,km)!==null}intersectTriangle(e,t,n,r,i){let a=this.origin,o=this.direction,s=o.x,c=o.y,l=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,p=t.x-a.x,m=t.y-a.y,h=t.z-a.z,g=n.x-a.x,_=n.y-a.y,v=n.z-a.z,y=Math.abs(s),b=Math.abs(c),x=Math.abs(l),S,C,w,T,E,D,O,k,A,j,ee,M;if(y>=b&&y>=x?(w=s,D=u,A=p,M=g,s>=0?(S=c,C=l,T=d,E=f,O=m,k=h,j=_,ee=v):(S=l,C=c,T=f,E=d,O=h,k=m,j=v,ee=_)):b>=x?(w=c,D=d,A=m,M=_,c>=0?(S=l,C=s,T=f,E=u,O=h,k=p,j=v,ee=g):(S=s,C=l,T=u,E=f,O=p,k=h,j=g,ee=v)):(w=l,D=f,A=h,M=v,l>=0?(S=s,C=c,T=u,E=d,O=p,k=m,j=g,ee=_):(S=c,C=s,T=d,E=u,O=m,k=p,j=_,ee=g)),w===0)return null;let te=S/w,ne=C/w,re=1/w,ie=T-te*D,ae=E-ne*D,oe=O-te*A,se=k-ne*A,ce=j-te*M,le=ee-ne*M,ue=ce*se-le*oe,de=ie*le-ae*ce,fe=oe*ae-se*ie;if(r){if(ue<0||de<0||fe<0)return null}else if((ue<0||de<0||fe<0)&&(ue>0||de>0||fe>0))return null;let pe=ue+de+fe;if(pe===0)return null;let me=re*(ue*D+de*A+fe*M);return(pe>0?me<0:me>0)?null:this.at(me/pe,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Pm=class extends Om{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new Ep(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new tp,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Fm=new Gf,Im=new Nm,Lm=new mm,Rm=new Y,zm=new Y,Bm=new Y,Vm=new Y,Hm=new Y,Um=new Y,Wm=new Y,Gm=new Y,Km=class extends vp{constructor(e=new Sm,t=new Pm){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){Um.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(Hm.fromBufferAttribute(s,e),a?Um.addScaledVector(Hm,r):Um.addScaledVector(Hm.sub(t),r))}t.add(Um)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Lm.copy(n.boundingSphere),Lm.applyMatrix4(i),Im.copy(e.ray).recast(e.near),!(Lm.containsPoint(Im.origin)===!1&&(Im.intersectSphere(Lm,Rm)===null||Im.origin.distanceToSquared(Rm)>(e.far-e.near)**2))&&(Fm.copy(i).invert(),Im.copy(e.ray).applyMatrix4(Fm),(n.boundingBox===null||Im.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,Im)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=Jm(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=Jm(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=Jm(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=Jm(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function qm(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;Gm.copy(s),Gm.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(Gm);return l<n.near||l>n.far?null:{distance:l,point:Gm.clone(),object:e}}function Jm(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,zm),e.getVertexPosition(c,Bm),e.getVertexPosition(l,Vm);let u=qm(e,t,n,r,zm,Bm,Vm,Wm);if(u){let e=new Y;Hp.getBarycoord(Wm,zm,Bm,Vm,e),i&&(u.uv=Hp.getInterpolatedAttribute(i,s,c,l,e,new bf)),a&&(u.uv1=Hp.getInterpolatedAttribute(a,s,c,l,e,new bf)),o&&(u.normal=Hp.getInterpolatedAttribute(o,s,c,l,e,new Y),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new Y,materialIndex:0};Hp.getNormal(zm,Bm,Vm,t.normal),u.face=t,u.barycoord=e}return u}var Ym=class extends zf{constructor(e=null,t=1,n=1,r,i,a,o,s,c=Eu,l=Eu,u,d){super(null,a,o,s,c,l,r,i,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Xm=class extends sm{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Zm=new mm,Qm=new bf(.5,.5),$m=new Y,eh=class{constructor(e=new Em,t=new Em,n=new Em,r=new Em,i=new Em,a=new Em){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Qd,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Zm.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Zm.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Zm)}intersectsSprite(e){return Zm.center.set(0,0,0),Zm.radius=.7071067811865476+Qm.distanceTo(e.center),Zm.applyMatrix4(e.matrixWorld),this.intersectsSphere(Zm)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if($m.x=r.normal.x>0?e.max.x:e.min.x,$m.y=r.normal.y>0?e.max.y:e.min.y,$m.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint($m)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},th=class extends Om{constructor(e){super(),this.isLineBasicMaterial=!0,this.type=`LineBasicMaterial`,this.color=new Ep(16777215),this.map=null,this.linewidth=1,this.linecap=`round`,this.linejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},nh=new Y,rh=new Y,ih=new Gf,ah=new Nm,oh=new mm,sh=new Y,ch=new Y,lh=class extends vp{constructor(e=new Sm,t=new th){super(),this.isLine=!0,this.type=`Line`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let e=1,r=t.count;e<r;e++)nh.fromBufferAttribute(t,e-1),rh.fromBufferAttribute(t,e),n[e]=n[e-1],n[e]+=nh.distanceTo(rh);e.setAttribute(`lineDistance`,new um(n,1))}else q(`Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`);return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),oh.copy(n.boundingSphere),oh.applyMatrix4(r),oh.radius+=i,e.ray.intersectsSphere(oh)===!1)return;ih.copy(r).invert(),ah.copy(e.ray).applyMatrix4(ih);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=this.isLineSegments?2:1,l=n.index,u=n.attributes.position;if(l!==null){let n=Math.max(0,a.start),r=Math.min(l.count,a.start+a.count);for(let i=n,a=r-1;i<a;i+=c){let n=l.getX(i),r=l.getX(i+1),a=uh(this,e,ah,s,n,r,i);a&&t.push(a)}if(this.isLineLoop){let i=l.getX(r-1),a=l.getX(n),o=uh(this,e,ah,s,i,a,r-1);o&&t.push(o)}}else{let n=Math.max(0,a.start),r=Math.min(u.count,a.start+a.count);for(let i=n,a=r-1;i<a;i+=c){let n=uh(this,e,ah,s,i,i+1,i);n&&t.push(n)}if(this.isLineLoop){let i=uh(this,e,ah,s,r-1,n,r-1);i&&t.push(i)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function uh(e,t,n,r,i,a,o){let s=e.geometry.attributes.position;if(nh.fromBufferAttribute(s,i),rh.fromBufferAttribute(s,a),n.distanceSqToSegment(nh,rh,sh,ch)>r)return;sh.applyMatrix4(e.matrixWorld);let c=t.ray.origin.distanceTo(sh);if(!(c<t.near||c>t.far))return{distance:c,point:ch.clone().applyMatrix4(e.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:e}}var dh=new Y,fh=new Y,ph=class extends lh{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type=`LineSegments`}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let e=0,r=t.count;e<r;e+=2)dh.fromBufferAttribute(t,e),fh.fromBufferAttribute(t,e+1),n[e]=e===0?0:n[e-1],n[e+1]=n[e]+dh.distanceTo(fh);e.setAttribute(`lineDistance`,new um(n,1))}else q(`LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`);return this}},mh=class extends Om{constructor(e){super(),this.isPointsMaterial=!0,this.type=`PointsMaterial`,this.color=new Ep(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},hh=new Gf,gh=new Nm,_h=new mm,vh=new Y,yh=class extends vp{constructor(e=new Sm,t=new mh){super(),this.isPoints=!0,this.type=`Points`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),_h.copy(n.boundingSphere),_h.applyMatrix4(r),_h.radius+=i,e.ray.intersectsSphere(_h)===!1)return;hh.copy(r).invert(),gh.copy(e.ray).applyMatrix4(hh);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=n.index,l=n.attributes.position;if(c!==null){let n=Math.max(0,a.start),i=Math.min(c.count,a.start+a.count);for(let a=n,o=i;a<o;a++){let n=c.getX(a);vh.fromBufferAttribute(l,n),bh(vh,n,s,r,e,t,this)}}else{let n=Math.max(0,a.start),i=Math.min(l.count,a.start+a.count);for(let a=n,o=i;a<o;a++)vh.fromBufferAttribute(l,a),bh(vh,a,s,r,e,t,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function bh(e,t,n,r,i,a,o){let s=gh.distanceSqToPoint(e);if(s<n){let n=new Y;gh.closestPointToPoint(e,n),n.applyMatrix4(r);let c=i.ray.origin.distanceTo(n);if(c<i.near||c>i.far)return;a.push({distance:c,distanceToRay:Math.sqrt(s),point:n,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var xh=class extends zf{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Sh=class extends zf{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},Ch=class extends zf{constructor(e,t,n=Lu,r,i,a,o=Eu,s=Eu,c,l=Ju,u=1){if(l!==1026&&l!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:u},r,i,a,o,s,l,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Ff(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},wh=class extends Ch{constructor(e,t=Lu,n=301,r,i,a=Eu,o=Eu,s,c=Ju){let l={width:e,height:e,depth:1},u=[l,l,l,l,l,l];super(e,e,t,n,r,i,a,o,s,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Th=class extends zf{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Eh=class e extends Sm{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new um(c,3)),this.setAttribute(`normal`,new um(l,3)),this.setAttribute(`uv`,new um(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new Y;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},Dh=class e extends Sm{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new um(p,3)),this.setAttribute(`normal`,new um(m,3)),this.setAttribute(`uv`,new um(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}};function Oh(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(Ah(i))i.isRenderTargetTexture?(q(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if(Ah(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function kh(e){let t={};for(let n=0;n<e.length;n++){let r=Oh(e[n]);for(let e in r)t[e]=r[e]}return t}function Ah(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function jh(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function Mh(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:kf.workingColorSpace}var Nh={clone:Oh,merge:kh},Ph=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Fh=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Ih=class extends Om{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ph,this.fragmentShader=Fh,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Oh(e.uniforms),this.uniformsGroups=jh(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new Ep().setHex(r.value);break;case`v2`:this.uniforms[n].value=new bf().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new Y().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new Bf().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new wf().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new Gf().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Lh=class extends Ih{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},Rh=class extends Om{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=Wd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},zh=class extends Om{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Bh(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function Vh(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}var Hh=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},Uh=class extends Hh{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Vd,endingEnd:Vd}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case Hd:i=e,o=2*t-n;break;case Ud:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case Hd:a=e,s=2*n-t;break;case Ud:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},Wh=class extends Hh{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},Gh=class extends Hh{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},Kh=class extends Hh{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=Yh(n,t,g,y,r);i[p]=qh(x,o,_,b,m)}return i}};function qh(e,t,n,r,i){let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*r+e*e*e*i}function Jh(e,t,n,r,i){let a=1-e;return 3*a*a*(n-t)+6*a*e*(r-n)+3*e*e*(i-r)}function Yh(e,t,n,r,i){let a=(e-t)/(i-t);for(let o=0;o<8;o++){let o=qh(a,t,n,r,i)-e;if(Math.abs(o)<1e-10)break;let s=Jh(a,t,n,r,i);if(Math.abs(s)<1e-10)break;a=Math.max(0,Math.min(1,a-o/s))}return a}var Xh=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=Bh(t,this.TimeBufferType),this.values=Bh(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Bh(e.times,Array),values:Bh(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t),Vh(e.settings)&&(n.settings={inTangents:Bh(e.settings.inTangents,Array),outTangents:Bh(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Gh(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Wh(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Uh(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Kh(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Ld:t=this.InterpolantFactoryMethodDiscrete;break;case Rd:t=this.InterpolantFactoryMethodLinear;break;case zd:t=this.InterpolantFactoryMethodSmooth;break;case Bd:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return q(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ld;case this.InterpolantFactoryMethodLinear:return Rd;case this.InterpolantFactoryMethodSmooth:return zd;case this.InterpolantFactoryMethodBezier:return Bd}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e;Vh(this.settings)&&(Zh(this.settings.inTangents,e),Zh(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(J(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(J(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){J(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){J(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&ef(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){J(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===zd,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,Vh(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function Zh(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]*=t}Xh.prototype.ValueTypeName=``,Xh.prototype.TimeBufferType=Float32Array,Xh.prototype.ValueBufferType=Float32Array,Xh.prototype.DefaultInterpolation=Rd;var Qh=class extends Xh{constructor(e,t,n){super(e,t,n)}};Qh.prototype.ValueTypeName=`bool`,Qh.prototype.ValueBufferType=Array,Qh.prototype.DefaultInterpolation=Ld,Qh.prototype.InterpolantFactoryMethodLinear=void 0,Qh.prototype.InterpolantFactoryMethodSmooth=void 0;var $h=class extends Xh{constructor(e,t,n,r){super(e,t,n,r)}};$h.prototype.ValueTypeName=`color`;var eg=class extends Xh{constructor(e,t,n,r){super(e,t,n,r)}};eg.prototype.ValueTypeName=`number`;var tg=class extends Hh{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)xf.slerpFlat(i,0,a,c-o,a,c,s);return i}},ng=class extends Xh{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new tg(this.times,this.values,this.getValueSize(),e)}};ng.prototype.ValueTypeName=`quaternion`,ng.prototype.InterpolantFactoryMethodSmooth=void 0;var rg=class extends Xh{constructor(e,t,n){super(e,t,n)}};rg.prototype.ValueTypeName=`string`,rg.prototype.ValueBufferType=Array,rg.prototype.DefaultInterpolation=Ld,rg.prototype.InterpolantFactoryMethodLinear=void 0,rg.prototype.InterpolantFactoryMethodSmooth=void 0;var ig=class extends Xh{constructor(e,t,n,r){super(e,t,n,r)}};ig.prototype.ValueTypeName=`vector`;var ag=new Y,og=new xf,sg=new Y,cg=class extends vp{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new Gf,this.projectionMatrix=new Gf,this.projectionMatrixInverse=new Gf,this.coordinateSystem=Qd,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(ag,og,sg),sg.x===1&&sg.y===1&&sg.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ag,og,sg.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(ag,og,sg),sg.x===1&&sg.y===1&&sg.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ag,og,sg.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},lg=new Y,ug=new bf,dg=new bf,fg=class extends cg{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=pf*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(ff*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return pf*2*Math.atan(Math.tan(ff*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){lg.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(lg.x,lg.y).multiplyScalar(-e/lg.z),lg.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(lg.x,lg.y).multiplyScalar(-e/lg.z)}getViewSize(e,t){return this.getViewBounds(e,ug,dg),t.subVectors(dg,ug)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(ff*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},pg=class extends cg{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},mg=class extends Sm{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type=`InstancedBufferGeometry`,this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){let e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}},hg=-90,gg=1,_g=class extends vp{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new fg(hg,gg,e,t);r.layers=this.layers,this.add(r);let i=new fg(hg,gg,e,t);i.layers=this.layers,this.add(i);let a=new fg(hg,gg,e,t);a.layers=this.layers,this.add(a);let o=new fg(hg,gg,e,t);o.layers=this.layers,this.add(o);let s=new fg(hg,gg,e,t);s.layers=this.layers,this.add(s);let c=new fg(hg,gg,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},vg=class extends fg{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},yg=`\\[\\]\\.:\\/`,bg=RegExp(`[\\[\\]\\.:\\/]`,`g`),xg=`[^\\[\\]\\.:\\/]`,Sg=`[^`+yg.replace(`\\.`,``)+`]`,Cg=`((?:WC+[\\/:])*)`.replace(`WC`,xg),wg=`(WCOD+)?`.replace(`WCOD`,Sg),Tg=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,xg),Eg=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,xg),Dg=RegExp(`^`+Cg+wg+Tg+Eg+`$`),Og=[`material`,`materials`,`bones`,`map`],kg=class{constructor(e,t,n){let r=n||Ag.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Ag=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(bg,``)}static parseTrackName(e){let t=Dg.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);Og.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){q(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){J(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){J(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){J(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){J(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){J(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){J(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){J(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;J(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){J(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){J(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Ag.Composite=kg,Ag.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},Ag.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},Ag.prototype.GetterByBindingType=[Ag.prototype._getValue_direct,Ag.prototype._getValue_array,Ag.prototype._getValue_arrayElement,Ag.prototype._getValue_toArray],Ag.prototype.SetterByBindingTypeAndVersioning=[[Ag.prototype._setValue_direct,Ag.prototype._setValue_direct_setNeedsUpdate,Ag.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ag.prototype._setValue_array,Ag.prototype._setValue_array_setNeedsUpdate,Ag.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ag.prototype._setValue_arrayElement,Ag.prototype._setValue_arrayElement_setNeedsUpdate,Ag.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ag.prototype._setValue_fromArray,Ag.prototype._setValue_fromArray_setNeedsUpdate,Ag.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]],class e{static{e.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}};function jg(e,t,n,r){let i=Mg(r);switch(n){case Gu:return e*t;case Xu:return e*t/i.components*i.byteLength;case Zu:return e*t/i.components*i.byteLength;case Qu:return e*t*2/i.components*i.byteLength;case $u:return e*t*2/i.components*i.byteLength;case Ku:return e*t*3/i.components*i.byteLength;case qu:return e*t*4/i.components*i.byteLength;case ed:return e*t*4/i.components*i.byteLength;case td:case nd:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case rd:case id:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case od:case cd:return Math.max(e,16)*Math.max(t,8)/4;case ad:case sd:return Math.max(e,8)*Math.max(t,8)/2;case ld:case ud:case fd:case pd:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case dd:case md:case hd:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case gd:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case _d:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case vd:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case yd:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case bd:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case xd:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case Sd:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case Cd:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case wd:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case Td:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case Ed:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case Dd:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case Od:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case kd:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case Ad:case jd:case Md:return Math.ceil(e/4)*Math.ceil(t/4)*16;case Nd:case Pd:return Math.ceil(e/4)*Math.ceil(t/4)*8;case Fd:case Id:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function Mg(e){switch(e){case Mu:case Nu:return{byteLength:1,components:1};case Fu:case Pu:case zu:return{byteLength:2,components:1};case Bu:case Vu:return{byteLength:2,components:4};case Lu:case Iu:case Ru:return{byteLength:4,components:1};case Uu:case Wu:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`186`}})),typeof window<`u`&&(window.__THREE__?q(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`186`);function Ng(){let e=null,t=!1,n=null,r=null;function i(t,a){r=e.requestAnimationFrame(i),n(t,a)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function Pg(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var Fg={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},X={common:{diffuse:{value:new Ep(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new wf},alphaMap:{value:null},alphaMapTransform:{value:new wf},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new wf}},envmap:{envMap:{value:null},envMapRotation:{value:new wf},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new wf}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new wf}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new wf},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new wf},normalScale:{value:new bf(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new wf},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new wf}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new wf}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new wf}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ep(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new Y},probesMax:{value:new Y},probesResolution:{value:new Y}},points:{diffuse:{value:new Ep(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new wf},alphaTest:{value:0},uvTransform:{value:new wf}},sprite:{diffuse:{value:new Ep(16777215)},opacity:{value:1},center:{value:new bf(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new wf},alphaMap:{value:null},alphaMapTransform:{value:new wf},alphaTest:{value:0}}},Ig={basic:{uniforms:kh([X.common,X.specularmap,X.envmap,X.aomap,X.lightmap,X.fog]),vertexShader:Fg.meshbasic_vert,fragmentShader:Fg.meshbasic_frag},lambert:{uniforms:kh([X.common,X.specularmap,X.envmap,X.aomap,X.lightmap,X.emissivemap,X.bumpmap,X.normalmap,X.displacementmap,X.fog,X.lights,{emissive:{value:new Ep(0)},envMapIntensity:{value:1}}]),vertexShader:Fg.meshlambert_vert,fragmentShader:Fg.meshlambert_frag},phong:{uniforms:kh([X.common,X.specularmap,X.envmap,X.aomap,X.lightmap,X.emissivemap,X.bumpmap,X.normalmap,X.displacementmap,X.fog,X.lights,{emissive:{value:new Ep(0)},specular:{value:new Ep(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Fg.meshphong_vert,fragmentShader:Fg.meshphong_frag},standard:{uniforms:kh([X.common,X.envmap,X.aomap,X.lightmap,X.emissivemap,X.bumpmap,X.normalmap,X.displacementmap,X.roughnessmap,X.metalnessmap,X.fog,X.lights,{emissive:{value:new Ep(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Fg.meshphysical_vert,fragmentShader:Fg.meshphysical_frag},toon:{uniforms:kh([X.common,X.aomap,X.lightmap,X.emissivemap,X.bumpmap,X.normalmap,X.displacementmap,X.gradientmap,X.fog,X.lights,{emissive:{value:new Ep(0)}}]),vertexShader:Fg.meshtoon_vert,fragmentShader:Fg.meshtoon_frag},matcap:{uniforms:kh([X.common,X.bumpmap,X.normalmap,X.displacementmap,X.fog,{matcap:{value:null}}]),vertexShader:Fg.meshmatcap_vert,fragmentShader:Fg.meshmatcap_frag},points:{uniforms:kh([X.points,X.fog]),vertexShader:Fg.points_vert,fragmentShader:Fg.points_frag},dashed:{uniforms:kh([X.common,X.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Fg.linedashed_vert,fragmentShader:Fg.linedashed_frag},depth:{uniforms:kh([X.common,X.displacementmap]),vertexShader:Fg.depth_vert,fragmentShader:Fg.depth_frag},normal:{uniforms:kh([X.common,X.bumpmap,X.normalmap,X.displacementmap,{opacity:{value:1}}]),vertexShader:Fg.meshnormal_vert,fragmentShader:Fg.meshnormal_frag},sprite:{uniforms:kh([X.sprite,X.fog]),vertexShader:Fg.sprite_vert,fragmentShader:Fg.sprite_frag},background:{uniforms:{uvTransform:{value:new wf},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Fg.background_vert,fragmentShader:Fg.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new wf}},vertexShader:Fg.backgroundCube_vert,fragmentShader:Fg.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Fg.cube_vert,fragmentShader:Fg.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Fg.equirect_vert,fragmentShader:Fg.equirect_frag},distance:{uniforms:kh([X.common,X.displacementmap,{referencePosition:{value:new Y},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Fg.distance_vert,fragmentShader:Fg.distance_frag},shadow:{uniforms:kh([X.lights,X.fog,{color:{value:new Ep(0)},opacity:{value:1}}]),vertexShader:Fg.shadow_vert,fragmentShader:Fg.shadow_frag}};Ig.physical={uniforms:kh([Ig.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new wf},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new wf},clearcoatNormalScale:{value:new bf(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new wf},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new wf},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new wf},sheen:{value:0},sheenColor:{value:new Ep(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new wf},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new wf},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new wf},transmissionSamplerSize:{value:new bf},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new wf},attenuationDistance:{value:0},attenuationColor:{value:new Ep(0)},specularColor:{value:new Ep(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new wf},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new wf},anisotropyVector:{value:new bf},anisotropyMap:{value:null},anisotropyMapTransform:{value:new wf}}]),vertexShader:Fg.meshphysical_vert,fragmentShader:Fg.meshphysical_frag};var Lg={r:0,b:0,g:0},Rg=new Gf,zg=new wf;zg.set(-1,0,0,0,1,0,0,0,1);function Bg(e,t,n,r,i,a){let o=new Ep(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&(i.isCubeTexture||i.mapping===306)?(l===void 0&&(l=new Km(new Eh(1,1,1),new Ih({name:`BackgroundCubeMaterial`,uniforms:Oh(Ig.backgroundCube.uniforms),vertexShader:Ig.backgroundCube.vertexShader,fragmentShader:Ig.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(Rg.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(zg),l.material.toneMapped=kf.getTransfer(i.colorSpace)!==Jd,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new Km(new Dh(2,2),new Ih({name:`BackgroundMaterial`,uniforms:Oh(Ig.background.uniforms),vertexShader:Ig.background.vertexShader,fragmentShader:Ig.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=kf.getTransfer(i.colorSpace)!==Jd,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(Lg,Mh(e)),n.buffers.color.setClear(Lg.r,Lg.g,Lg.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function Vg(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function Hg(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function Ug(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&n!==1015&&!i&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(q(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&q(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function Wg(e){let t=this,n=null,r=0,i=!1,a=!1,o=new Em,s=new wf,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var Gg=4,Kg=6,qg=20,Jg=256,Yg=new pg,Xg=new Ep,Zg=null,Qg=0,$g=0,e_=!1,t_=new Y,n_=new Y,r_=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=t_}=i;Zg=this._renderer.getRenderTarget(),Qg=this._renderer.getActiveCubeFace(),$g=this._renderer.getActiveMipmapLevel(),e_=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=u_(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=l_(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Zg,Qg,$g),this._renderer.xr.enabled=e_,e.scissorTest=!1,o_(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Zg=this._renderer.getRenderTarget(),Qg=this._renderer.getActiveCubeFace(),$g=this._renderer.getActiveMipmapLevel(),e_=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:ku,minFilter:ku,generateMipmaps:!1,type:zu,format:qu,colorSpace:Kd,depthBuffer:!1},r=a_(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=a_(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=i_(r)),this._blurMaterial=c_(r,e,t),this._ggxMaterial=s_(r,e,t)}return r}_compileMaterial(e){let t=new Km(new Sm,e);this._renderer.compile(t,Yg)}_sceneToCubeUV(e,t,n,r,i){let a=new fg(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(Xg),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Km(new Eh,new Pm({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy(Xg),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;o_(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=u_()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=l_());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;o_(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,Yg)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-Gg?n-d+Gg:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,o_(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,Yg),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,o_(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,Yg)}_blur(e,t,n,r){let i=this._pingPongRenderTarget,a=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,i,t,n,a),this._blurPass(i,e,n,n,a)}_blurPass(e,t,n,r,i){let a=this._renderer,o=this._blurMaterial,s=this._lodMeshes[r];s.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=i,c.mipInt.value=this._lodMax-n;let l=this._sizeLods[r];o_(t,3*l*(r>this._lodMax-Gg?r-this._lodMax+Gg:0),4*(this._cubeSize-l),3*l,2*l),a.setRenderTarget(t),a.render(s,Yg)}};function i_(e){let t=[],n=[],r=e,i=e-Gg+1+Kg;for(let e=0;e<i;e++){let e=2**r;t.push(e);let i=1/(e-2),a=-i,o=1+i,s=[a,a,o,a,o,o,a,a,o,o,a,o],c=new Float32Array(108),l=new Float32Array(108);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];c.set(r,18*e);for(let t=0;t<6;t++){let n=s[t*2]*2-1,r=s[t*2+1]*2-1;e===0?n_.set(1,r,n):e===1?n_.set(-n,1,-r):e===2?n_.set(-n,r,1):e===3?n_.set(-1,r,-n):e===4?n_.set(-n,-1,r):n_.set(n,r,-1),n_.toArray(l,(e*6+t)*3)}}let u=new Sm;u.setAttribute(`position`,new sm(c,3)),u.setAttribute(`outputDirection`,new sm(l,3)),n.push(new Km(u,null)),r>Gg&&r--}return{lodMeshes:n,sizeLods:t}}function a_(e,t,n){let r=new Hf(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function o_(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function s_(e,t,n){return new Ih({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:Jg,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:d_(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function c_(e,t,n){return new Ih({name:`SphericalGaussianBlur`,defines:{SAMPLES:qg,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:d_(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function l_(){return new Ih({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:d_(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function u_(){return new Ih({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:d_(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function d_(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var f_=class extends Hf{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new xh(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Eh(5,5,5),i=new Ih({name:`CubemapFromEquirect`,uniforms:Oh(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new Km(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=ku),new _g(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function p_(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new f_(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new r_(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new r_(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function m_(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&sf(`WebGLRenderer: `+e+` extension not supported.`),t}}}function h_(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0?t:(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++,t)}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?lm:cm)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function g_(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function __(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:J(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function v_(e,t,n){let r=new WeakMap,i=new Bf;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new Uf(h,p,m,u);g.type=Ru,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new bf(p,m)},r.set(o,d);function v(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,v)}o.addEventListener(`dispose`,v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function y_(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var b_={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function x_(e,t,n,r,i,a){let o=new Hf(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),s=null,c=null,l=new Sm;l.setAttribute(`position`,new um([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute(`uv`,new um([0,2,0,0,2,0],2));let u=new Lh({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new Km(l,u),f=new pg(-1,1,1,-1,0,1),p=null,m=null,h=!1,g,_=null,v=[],y=!1;this.setSize=function(e,t){o.setSize(e,t),s!==null&&s.setSize(e,t),c!==null&&c.setSize(e,t);for(let n=0;n<v.length;n++){let r=v[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){v=e,y=v.length>0&&v[0].isRenderPass===!0;let t=o.width,n=o.height;v.length>0&&s===null&&(s=new Hf(t,n,{type:zu,depthBuffer:!1,stencilBuffer:!1}),c=new Hf(t,n,{type:zu,depthBuffer:!1,stencilBuffer:!1}));for(let e=0;e<v.length;e++){let r=v[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(h||e.toneMapping===0&&v.length===0)return!1;if(_=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return y===!1&&e.setRenderTarget(o),g=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return y},this.end=function(e,t){e.toneMapping=g,h=!0;let n=o,r=s;for(let i=0;i<v.length;i++){let a=v[i];a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1&&(n=r,r=r===s?c:s))}if(p!==e.outputColorSpace||m!==e.toneMapping){p=e.outputColorSpace,m=e.toneMapping,u.defines={},kf.getTransfer(p)===`srgb`&&(u.defines.SRGB_TRANSFER=``);let t=b_[m];t&&(u.defines[t]=``),u.needsUpdate=!0}u.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(_),e.render(d,f),_=null,h=!1},this.isCompositing=function(){return h},this.dispose=function(){o.dispose(),s!==null&&s.dispose(),c!==null&&c.dispose(),l.dispose(),u.dispose()}}var S_=new zf,C_=new Ch(1,1),w_=new Uf,T_=new Wf,E_=new xh,D_=[],O_=[],k_=new Float32Array(16),A_=new Float32Array(9),j_=new Float32Array(4);function M_(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=D_[i];if(a===void 0&&(a=new Float32Array(i),D_[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function N_(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function P_(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function F_(e,t){let n=O_[t];n===void 0&&(n=new Int32Array(t),O_[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function I_(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function L_(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(N_(n,t))return;e.uniform2fv(this.addr,t),P_(n,t)}}function R_(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(N_(n,t))return;e.uniform3fv(this.addr,t),P_(n,t)}}function z_(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(N_(n,t))return;e.uniform4fv(this.addr,t),P_(n,t)}}function B_(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(N_(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),P_(n,t)}else{if(N_(n,r))return;j_.set(r),e.uniformMatrix2fv(this.addr,!1,j_),P_(n,r)}}function V_(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(N_(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),P_(n,t)}else{if(N_(n,r))return;A_.set(r),e.uniformMatrix3fv(this.addr,!1,A_),P_(n,r)}}function H_(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(N_(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),P_(n,t)}else{if(N_(n,r))return;k_.set(r),e.uniformMatrix4fv(this.addr,!1,k_),P_(n,r)}}function U_(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function W_(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(N_(n,t))return;e.uniform2iv(this.addr,t),P_(n,t)}}function G_(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(N_(n,t))return;e.uniform3iv(this.addr,t),P_(n,t)}}function K_(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(N_(n,t))return;e.uniform4iv(this.addr,t),P_(n,t)}}function q_(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function J_(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(N_(n,t))return;e.uniform2uiv(this.addr,t),P_(n,t)}}function Y_(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(N_(n,t))return;e.uniform3uiv(this.addr,t),P_(n,t)}}function X_(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(N_(n,t))return;e.uniform4uiv(this.addr,t),P_(n,t)}}function Z_(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(C_.compareFunction=n.isReversedDepthBuffer()?518:515,a=C_):a=S_,n.setTexture2D(t||a,i)}function Q_(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||T_,i)}function $_(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||E_,i)}function ev(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||w_,i)}function tv(e){switch(e){case 5126:return I_;case 35664:return L_;case 35665:return R_;case 35666:return z_;case 35674:return B_;case 35675:return V_;case 35676:return H_;case 5124:case 35670:return U_;case 35667:case 35671:return W_;case 35668:case 35672:return G_;case 35669:case 35673:return K_;case 5125:return q_;case 36294:return J_;case 36295:return Y_;case 36296:return X_;case 35678:case 36198:case 36298:case 36306:case 35682:return Z_;case 35679:case 36299:case 36307:return Q_;case 35680:case 36300:case 36308:case 36293:return $_;case 36289:case 36303:case 36311:case 36292:return ev}}function nv(e,t){e.uniform1fv(this.addr,t)}function rv(e,t){let n=M_(t,this.size,2);e.uniform2fv(this.addr,n)}function iv(e,t){let n=M_(t,this.size,3);e.uniform3fv(this.addr,n)}function av(e,t){let n=M_(t,this.size,4);e.uniform4fv(this.addr,n)}function ov(e,t){let n=M_(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function sv(e,t){let n=M_(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function cv(e,t){let n=M_(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function lv(e,t){e.uniform1iv(this.addr,t)}function uv(e,t){e.uniform2iv(this.addr,t)}function dv(e,t){e.uniform3iv(this.addr,t)}function fv(e,t){e.uniform4iv(this.addr,t)}function pv(e,t){e.uniform1uiv(this.addr,t)}function mv(e,t){e.uniform2uiv(this.addr,t)}function hv(e,t){e.uniform3uiv(this.addr,t)}function gv(e,t){e.uniform4uiv(this.addr,t)}function _v(e,t,n){let r=this.cache,i=t.length,a=F_(n,i);N_(r,a)||(e.uniform1iv(this.addr,a),P_(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?C_:S_;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function vv(e,t,n){let r=this.cache,i=t.length,a=F_(n,i);N_(r,a)||(e.uniform1iv(this.addr,a),P_(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||T_,a[e])}function yv(e,t,n){let r=this.cache,i=t.length,a=F_(n,i);N_(r,a)||(e.uniform1iv(this.addr,a),P_(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||E_,a[e])}function bv(e,t,n){let r=this.cache,i=t.length,a=F_(n,i);N_(r,a)||(e.uniform1iv(this.addr,a),P_(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||w_,a[e])}function xv(e){switch(e){case 5126:return nv;case 35664:return rv;case 35665:return iv;case 35666:return av;case 35674:return ov;case 35675:return sv;case 35676:return cv;case 5124:case 35670:return lv;case 35667:case 35671:return uv;case 35668:case 35672:return dv;case 35669:case 35673:return fv;case 5125:return pv;case 36294:return mv;case 36295:return hv;case 36296:return gv;case 35678:case 36198:case 36298:case 36306:case 35682:return _v;case 35679:case 36299:case 36307:return vv;case 35680:case 36300:case 36308:case 36293:return yv;case 36289:case 36303:case 36311:case 36292:return bv}}var Sv=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=tv(t.type)}},Cv=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=xv(t.type)}},wv=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},Tv=/(\w+)(\])?(\[|\.)?/g;function Ev(e,t){e.seq.push(t),e.map[t.id]=t}function Dv(e,t,n){let r=e.name,i=r.length;for(Tv.lastIndex=0;;){let a=Tv.exec(r),o=Tv.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){Ev(n,l===void 0?new Sv(s,e,t):new Cv(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new wv(s),Ev(n,e)),n=e}}}var Ov=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);Dv(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function kv(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var Av=37297,jv=0;function Mv(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var Nv=new wf;function Pv(e){kf._getMatrix(Nv,kf.workingColorSpace,e);let t=`mat3( ${Nv.elements.map(e=>e.toFixed(4))} )`;switch(kf.getTransfer(e)){case qd:return[t,`LinearTransferOETF`];case Jd:return[t,`sRGBTransferOETF`];default:return q(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function Fv(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+Mv(e.getShaderSource(t),r)}return i}function Iv(e,t){let n=Pv(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var Lv={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function Rv(e,t){let n=Lv[t];return n===void 0?(q(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var zv=new Y;function Bv(){return kf.getLuminanceCoefficients(zv),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${zv.x.toFixed(4)}, ${zv.y.toFixed(4)}, ${zv.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function Vv(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(Wv).join(`
`)}function Hv(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function Uv(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function Wv(e){return e!==``}function Gv(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Kv(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var qv=/^[ \t]*#include +<([\w\d./]+)>/gm;function Jv(e){return e.replace(qv,Xv)}var Yv=new Map;function Xv(e,t){let n=Fg[t];if(n===void 0){let e=Yv.get(t);if(e!==void 0)n=Fg[e],q(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`)}return Jv(n)}var Zv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Qv(e){return e.replace(Zv,$v)}function $v(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function ey(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var ty={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function ny(e){return ty[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var ry={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function iy(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:ry[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var ay={302:`ENVMAP_MODE_REFRACTION`};function oy(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:ay[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var sy={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function cy(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:sy[e.combine]||`ENVMAP_BLENDING_NONE`}function ly(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function uy(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=ny(n),l=iy(n),u=oy(n),d=cy(n),f=ly(n),p=Vv(n),m=Hv(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Wv).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Wv).join(`
`),_.length>0&&(_+=`
`)):(g=[ey(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(Wv).join(`
`),_=[ey(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.retroreflection?`#define USE_RETROREFLECTION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:Fg.tonemapping_pars_fragment,n.toneMapping===0?``:Rv(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,Fg.colorspace_pars_fragment,Iv(`linearToOutputTexel`,n.outputColorSpace),Bv(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(Wv).join(`
`)),o=Jv(o),o=Gv(o,n),o=Kv(o,n),s=Jv(s),s=Gv(s,n),s=Kv(s,n),o=Qv(o),s=Qv(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=kv(i,i.VERTEX_SHADER,y),S=kv(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=Fv(i,x,`vertex`),n=Fv(i,S,`fragment`);J(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):q(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new Ov(i,h),T=Uv(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,Av)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=jv++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var dy=0,fy=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new py(e),t.set(e,n)),n}},py=class{constructor(e){this.id=dy++,this.code=e,this.usedTimes=0}};function my(e){return e===1030||e===37490||e===36285}function hy(e,t,n,r,i,a){let o=new np,s=new fy,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&q(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,O,k,A;if(C){let e=Ig[C];D=e.vertexShader,O=e.fragmentShader}else{D=i.vertexShader,O=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),k=e.id,A=t.id}let j=e.getRenderTarget(),ee=e.state.buffers.depth.getReversed(),M=h.isInstancedMesh===!0,te=h.isBatchedMesh===!0,ne=!!i.map,re=!!i.matcap,ie=!!x,ae=!!i.aoMap,oe=!!i.lightMap,se=!!i.bumpMap&&i.wireframe===!1,ce=!!i.normalMap,le=!!i.displacementMap,ue=!!i.emissiveMap,de=!!i.metalnessMap,fe=!!i.roughnessMap,pe=i.anisotropy>0,me=i.clearcoat>0,he=i.dispersion>0,ge=i.retroreflectivity>0,_e=i.iridescence>0,ve=i.sheen>0,ye=i.transmission>0,be=pe&&!!i.anisotropyMap,xe=me&&!!i.clearcoatMap,Se=me&&!!i.clearcoatNormalMap,N=me&&!!i.clearcoatRoughnessMap,Ce=_e&&!!i.iridescenceMap,P=_e&&!!i.iridescenceThicknessMap,we=ve&&!!i.sheenColorMap,Te=ve&&!!i.sheenRoughnessMap,Ee=!!i.specularMap,F=!!i.specularColorMap,I=!!i.specularIntensityMap,L=ye&&!!i.transmissionMap,De=ye&&!!i.thicknessMap,Oe=!!i.gradientMap,ke=!!i.alphaMap,R=i.alphaTest>0,z=!!i.alphaHash,B=!!i.extensions,Ae=0;i.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(Ae=e.toneMapping);let je={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:O,defines:i.defines,customVertexShaderID:k,customFragmentShaderID:A,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:te,batchingColor:te&&h._colorsTexture!==null,instancing:M,instancingColor:M&&h.instanceColor!==null,instancingMorph:M&&h.morphTexture!==null,outputColorSpace:j===null?e.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:kf.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:ne,matcap:re,envMap:ie,envMapMode:ie&&x.mapping,envMapCubeUVHeight:S,aoMap:ae,lightMap:oe,bumpMap:se,normalMap:ce,displacementMap:le,emissiveMap:ue,normalMapObjectSpace:ce&&i.normalMapType===1,normalMapTangentSpace:ce&&i.normalMapType===0,packedNormalMap:ce&&i.normalMapType===0&&my(i.normalMap.format),metalnessMap:de,roughnessMap:fe,anisotropy:pe,anisotropyMap:be,clearcoat:me,clearcoatMap:xe,clearcoatNormalMap:Se,clearcoatRoughnessMap:N,dispersion:he,retroreflection:ge,iridescence:_e,iridescenceMap:Ce,iridescenceThicknessMap:P,sheen:ve,sheenColorMap:we,sheenRoughnessMap:Te,specularMap:Ee,specularColorMap:F,specularIntensityMap:I,transmission:ye,transmissionMap:L,thicknessMap:De,gradientMap:Oe,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:ke,alphaTest:R,alphaHash:z,combine:i.combine,mapUv:ne&&m(i.map.channel),aoMapUv:ae&&m(i.aoMap.channel),lightMapUv:oe&&m(i.lightMap.channel),bumpMapUv:se&&m(i.bumpMap.channel),normalMapUv:ce&&m(i.normalMap.channel),displacementMapUv:le&&m(i.displacementMap.channel),emissiveMapUv:ue&&m(i.emissiveMap.channel),metalnessMapUv:de&&m(i.metalnessMap.channel),roughnessMapUv:fe&&m(i.roughnessMap.channel),anisotropyMapUv:be&&m(i.anisotropyMap.channel),clearcoatMapUv:xe&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:Se&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:N&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:Ce&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:P&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:we&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:Te&&m(i.sheenRoughnessMap.channel),specularMapUv:Ee&&m(i.specularMap.channel),specularColorMapUv:F&&m(i.specularColorMap.channel),specularIntensityMapUv:I&&m(i.specularIntensityMap.channel),transmissionMapUv:L&&m(i.transmissionMap.channel),thicknessMapUv:De&&m(i.thicknessMap.channel),alphaMapUv:ke&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(ce||pe),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(ne||ke),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&ce===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:ee,skinning:h.isSkinnedMesh===!0,hasPositionAttribute:v.attributes.position!==void 0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numSunLights:o.sun.length,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numSunLightShadows:o.sunShadowMap.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:Ae,decodeVideoTexture:ne&&i.map.isVideoTexture===!0&&kf.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:ue&&i.emissiveMap.isVideoTexture===!0&&kf.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:B&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(B&&i.extensions.multiDraw===!0||te)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return je.vertexUv1s=c.has(1),je.vertexUv2s=c.has(2),je.vertexUv3s=c.has(3),c.clear(),je}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numSunLights),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numSunLightShadows),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.retroreflection&&o.enable(24),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function y(e){let t=p[e.type],n;if(t){let e=Ig[t];n=Nh.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r=u.get(n);return r===void 0?(r=new uy(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function x(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function S(e){s.remove(e)}function C(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:y,acquireProgram:b,releaseProgram:x,releaseShaderCache:S,programs:l,dispose:C}}function gy(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function _y(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function vy(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function yy(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l,u){u.reversedDepth===!0&&(c=-c);let d=s(e,t,a,o,c,l);a.transmission>0?r.push(d):a.transparent===!0?i.push(d):n.push(d)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||_y),r.length>1&&r.sort(t||vy),i.length>1&&i.sort(t||vy)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function by(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new yy,e.set(t,[i])):n>=r.length?(i=new yy,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function xy(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={direction:new Y,color:new Ep};break;case`SpotLight`:n={position:new Y,direction:new Y,color:new Ep,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new Y,color:new Ep,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new Y,skyColor:new Ep,groundColor:new Ep};break;case`RectAreaLight`:n={color:new Ep,position:new Y,halfWidth:new Y,halfHeight:new Y}}return e[t.id]=n,n}}}function Sy(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new bf};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new bf};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new bf,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var Cy=0;function wy(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function Ty(e){let t=new xy,n=Sy(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new Y);let i=new Y,a=new Gf,o=new Gf;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=0,x=0;i.sort(wy);for(let e=0,S=i.length;e<S;e++){let S=i[e],C=S.color,w=S.intensity,T=S.distance,E=null;if(S.shadow&&S.shadow.map&&(E=S.shadow.map.texture.format===1030?S.shadow.map.texture:S.shadow.map.depthTexture||S.shadow.map.texture),S.isAmbientLight)a+=C.r*w,o+=C.g*w,s+=C.b*w;else if(S.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(S.sh.coefficients[e],w);x++}else if(S.isSunLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()),r.sunShadow[l]=t,r.sunShadowMap[l]=E;let i=e.getViewportCount();for(let t=0;t<i;t++)r.sunShadowMatrix[u+t]=e.getMatrix(t),r.sunShadowCascade[u+t]=e._cascadeData[t];u+=i,l++}r.sun[c]=e,c++}else if(S.isDirectionalLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[d]=t,r.directionalShadowMap[d]=E,r.directionalShadowMatrix[d]=S.shadow.matrix,g++}r.directional[d]=e,d++}else if(S.isSpotLight){let e=t.get(S);e.position.setFromMatrixPosition(S.matrixWorld),e.color.copy(C).multiplyScalar(w),e.distance=T,e.coneCos=Math.cos(S.angle),e.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),e.decay=S.decay,r.spot[p]=e;let i=S.shadow;if(S.map&&(r.spotLightMap[y]=S.map,y++,i.updateMatrices(S),S.castShadow&&b++),r.spotLightMatrix[p]=i.matrix,S.castShadow){let e=n.get(S);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[p]=e,r.spotShadowMap[p]=E,v++}p++}else if(S.isRectAreaLight){let e=t.get(S);e.color.copy(C).multiplyScalar(w),e.halfWidth.set(S.width*.5,0,0),e.halfHeight.set(0,S.height*.5,0),r.rectArea[m]=e,m++}else if(S.isPointLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),e.distance=S.distance,e.decay=S.decay,S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[f]=t,r.pointShadowMap[f]=E,r.pointShadowMatrix[f]=S.shadow.matrix,_++}r.point[f]=e,f++}else if(S.isHemisphereLight){let e=t.get(S);e.skyColor.copy(S.color).multiplyScalar(w),e.groundColor.copy(S.groundColor).multiplyScalar(w),r.hemi[h]=e,h++}}m>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=X.LTC_FLOAT_1,r.rectAreaLTC2=X.LTC_FLOAT_2):(r.rectAreaLTC1=X.LTC_HALF_1,r.rectAreaLTC2=X.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let S=r.hash;(S.sunLength!==c||S.directionalLength!==d||S.pointLength!==f||S.spotLength!==p||S.rectAreaLength!==m||S.hemiLength!==h||S.numSunShadows!==l||S.numDirectionalShadows!==g||S.numPointShadows!==_||S.numSpotShadows!==v||S.numSpotMaps!==y||S.numLightProbes!==x)&&(r.sun.length=c,r.directional.length=d,r.spot.length=p,r.rectArea.length=m,r.point.length=f,r.hemi.length=h,r.sunShadow.length=l,r.sunShadowMap.length=l,r.sunShadowMatrix.length=u,r.sunShadowCascade.length=u,r.directionalShadow.length=g,r.directionalShadowMap.length=g,r.directionalShadowMatrix.length=g,r.pointShadow.length=_,r.pointShadowMap.length=_,r.pointShadowMatrix.length=_,r.spotShadow.length=v,r.spotShadowMap.length=v,r.spotLightMatrix.length=v+y-b,r.spotLightMap.length=y,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=x,S.sunLength=c,S.directionalLength=d,S.pointLength=f,S.spotLength=p,S.rectAreaLength=m,S.hemiLength=h,S.numSunShadows=l,S.numDirectionalShadows=g,S.numPointShadows=_,S.numSpotShadows=v,S.numSpotMaps=y,S.numLightProbes=x,r.version=Cy++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=0,f=t.matrixWorldInverse;for(let t=0,p=e.length;t<p;t++){let p=e[t];if(p.isSunLight){let e=r.sun[n];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),n++}else if(p.isDirectionalLight){let e=r.directional[s];e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),s++}else if(p.isSpotLight){let e=r.spot[l];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),l++}else if(p.isRectAreaLight){let e=r.rectArea[u];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),o.identity(),a.copy(p.matrixWorld),a.premultiply(f),o.extractRotation(a),e.halfWidth.set(p.width*.5,0,0),e.halfHeight.set(0,p.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),u++}else if(p.isPointLight){let e=r.point[c];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),c++}else if(p.isHemisphereLight){let e=r.hemi[d];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),d++}}}return{setup:s,setupView:c,state:r}}function Ey(e){let t=new Ty(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function Dy(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new Ey(e),t.set(n,[a])):r>=i.length?(a=new Ey(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var Oy=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,ky=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Ay=[new Y(1,0,0),new Y(-1,0,0),new Y(0,1,0),new Y(0,-1,0),new Y(0,0,1),new Y(0,0,-1)],jy=[new Y(0,-1,0),new Y(0,-1,0),new Y(0,0,1),new Y(0,0,-1),new Y(0,-1,0),new Y(0,-1,0)],My=new Gf,Ny=new Y,Py=new Y;function Fy(e,t,n){let r=new eh,i=new bf,a=new bf,o=new Bf,s=new Rh,c=new zh,l={},u=n.maxTextureSize,d={0:1,1:0,2:2},f=new Ih({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new bf},radius:{value:4}},vertexShader:Oy,fragmentShader:ky}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let m=new Sm;m.setAttribute(`position`,new sm(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let h=new Km(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let _=this.type;this.render=function(t,n,s){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||t.length===0)return;this.type===2&&(q(`WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead.`),this.type=1);let c=e.getRenderTarget(),l=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),f=e.state;f.setBlending(0),f.buffers.depth.getReversed()===!0?f.buffers.color.setClear(0,0,0,0):f.buffers.color.setClear(1,1,1,1),f.buffers.depth.setTest(!0),f.setScissorTest(!1);let p=_!==this.type;p&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let c=0,l=t.length;c<l;c++){let l=t[c],d=l.shadow;if(d===void 0){q(`WebGLShadowMap:`,l,`has no shadow.`);continue}if(d.autoUpdate===!1&&d.needsUpdate===!1)continue;i.copy(d.mapSize);let m=d.getFrameExtents();i.multiply(m),a.copy(d.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(a.x=Math.floor(u/m.x),i.x=a.x*m.x,d.mapSize.x=a.x),i.y>u&&(a.y=Math.floor(u/m.y),i.y=a.y*m.y,d.mapSize.y=a.y));let h=e.state.buffers.depth.getReversed();if(d.camera._reversedDepth=h,d.map===null||p===!0){if(d.map!==null&&(d.map.depthTexture!==null&&(d.map.depthTexture.dispose(),d.map.depthTexture=null),d.map.dispose()),this.type===3){if(l.isPointLight){q(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}d.map=new Hf(i.x,i.y,{format:Qu,type:zu,minFilter:ku,magFilter:ku,generateMipmaps:!1}),d.map.texture.name=l.name+`.shadowMap`,d.map.depthTexture=new Ch(i.x,i.y,Ru),d.map.depthTexture.name=l.name+`.shadowMapDepth`,d.map.depthTexture.format=Ju,d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=Eu,d.map.depthTexture.magFilter=Eu}else l.isPointLight?(d.map=new f_(i.x),d.map.depthTexture=new wh(i.x,Lu)):(d.map=new Hf(i.x,i.y),d.map.depthTexture=new Ch(i.x,i.y,Lu)),d.map.depthTexture.name=l.name+`.shadowMap`,d.map.depthTexture.format=Ju,this.type===1?(d.map.depthTexture.compareFunction=h?518:515,d.map.depthTexture.minFilter=ku,d.map.depthTexture.magFilter=ku):(d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=Eu,d.map.depthTexture.magFilter=Eu);d.camera.updateProjectionMatrix()}d.map.isWebGLCubeRenderTarget!==!0&&(d.map.width!==i.x||d.map.height!==i.y)&&d.map.setSize(i.x,i.y);let g=d.map.isWebGLCubeRenderTarget?6:d.getViewportCount();l.isPointLight!==!0&&d.updateMatrices(l,s);for(let t=0;t<g;t++){let i=d.getCamera(t);if(l.isPointLight){let e=d.camera,n=d.matrix,r=l.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),Ny.setFromMatrixPosition(l.matrixWorld),e.position.copy(Ny),Py.copy(e.position),Py.add(Ay[t]),e.up.copy(jy[t]),e.lookAt(Py),e.updateMatrixWorld(),n.makeTranslation(-Ny.x,-Ny.y,-Ny.z),My.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),d._frustum.setFromProjectionMatrix(My,e.coordinateSystem,e.reversedDepth)}if(d.map.isWebGLCubeRenderTarget)e.setRenderTarget(d.map,t),e.clear();else{t===0&&(e.setRenderTarget(d.map),e.clear());let n=d.getViewport(t);o.set(a.x*n.x,a.y*n.y,a.x*n.z,a.y*n.w),f.viewport(o)}r=d.getFrustum(t),b(n,s,i,l,this.type)}d.isPointLightShadow!==!0&&this.type===3&&v(d,s),d.needsUpdate=!1}_=this.type,g.needsUpdate=!1,e.setRenderTarget(c,l,d)};function v(n,r){let a=t.update(h);f.defines.VSM_SAMPLES!==n.blurSamples&&(f.defines.VSM_SAMPLES=n.blurSamples,p.defines.VSM_SAMPLES=n.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),n.mapPass===null?n.mapPass=new Hf(i.x,i.y,{format:Qu,type:zu}):(n.mapPass.width!==n.map.width||n.mapPass.height!==n.map.height)&&n.mapPass.setSize(n.map.width,n.map.height),f.uniforms.shadow_pass.value=n.map.depthTexture,f.uniforms.resolution.value.set(n.map.width,n.map.height),f.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,f,h,null),p.uniforms.shadow_pass.value=n.mapPass.texture,p.uniforms.resolution.value.set(n.map.width,n.map.height),p.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,p,h,null)}function y(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?c:s,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=l[e];r===void 0&&(r={},l[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,x)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?d[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function b(n,i,a,o,s){if(n.visible===!1)return;if(n.layers.test(i.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||n.intersectsFrustum(r))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),c=n.material;if(Array.isArray(c)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=y(n,d,o,s);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(c.visible){let t=y(n,c,o,s);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)b(c[e],i,a,o,s)}function x(e){e.target.removeEventListener(`dispose`,x);for(let t in l){let n=l[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function Iy(e,t){function n(){let t=!1,n=new Bf,r=null,i=new Bf(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?de(e.DEPTH_TEST):fe(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=lf[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?de(e.STENCIL_TEST):fe(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new Ep(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,ee=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),M=!1,te=0,ne=e.getParameter(e.VERSION);ne.indexOf(`WebGL`)===-1?ne.indexOf(`OpenGL ES`)!==-1&&(te=parseFloat(/^OpenGL ES (\d)/.exec(ne)[1]),M=te>=2):(te=parseFloat(/^WebGL (\d)/.exec(ne)[1]),M=te>=1);let re=null,ie={},ae=e.getParameter(e.SCISSOR_BOX),oe=e.getParameter(e.VIEWPORT),se=new Bf().fromArray(ae),ce=new Bf().fromArray(oe);function le(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let ue={};ue[e.TEXTURE_2D]=le(e.TEXTURE_2D,e.TEXTURE_2D,1),ue[e.TEXTURE_CUBE_MAP]=le(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),ue[e.TEXTURE_2D_ARRAY]=le(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),ue[e.TEXTURE_3D]=le(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),de(e.DEPTH_TEST),o.setFunc(3),be(!1),xe(1),de(e.CULL_FACE),ve(0);function de(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function fe(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function pe(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function me(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function he(t){return h!==t&&(e.useProgram(t),h=t,!0)}let ge={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};ge[103]=e.MIN,ge[104]=e.MAX;let _e={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function ve(t,n,r,i,a,o,s,c,l,u){if(t===0){g===!0&&(fe(e.BLEND),g=!1);return}if(g===!1&&(de(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:J(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:J(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:J(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:J(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}return}a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(ge[n],ge[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(_e[r],_e[i],_e[o],_e[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function ye(t,n){t.side===2?fe(e.CULL_FACE):de(e.CULL_FACE);let r=t.side===1;n&&(r=!r),be(r),t.blending===1&&t.transparent===!1?ve(0):ve(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),N(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?de(e.SAMPLE_ALPHA_TO_COVERAGE):fe(e.SAMPLE_ALPHA_TO_COVERAGE)}function be(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function xe(t){t===0?fe(e.CULL_FACE):(de(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function Se(t){t!==k&&(M&&e.lineWidth(t),k=t)}function N(t,n,r){t?(de(e.POLYGON_OFFSET_FILL),(A!==n||j!==r)&&(A=n,j=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):fe(e.POLYGON_OFFSET_FILL)}function Ce(t){t?de(e.SCISSOR_TEST):fe(e.SCISSOR_TEST)}function P(t){t===void 0&&(t=e.TEXTURE0+ee-1),re!==t&&(e.activeTexture(t),re=t)}function we(t,n,r){r===void 0&&(r=re===null?e.TEXTURE0+ee-1:re);let i=ie[r];i===void 0&&(i={type:void 0,texture:void 0},ie[r]=i),(i.type!==t||i.texture!==n)&&(re!==r&&(e.activeTexture(r),re=r),e.bindTexture(t,n||ue[t]),i.type=t,i.texture=n)}function Te(){let t=ie[re];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function Ee(){try{e.compressedTexImage2D(...arguments)}catch(e){J(`WebGLState:`,e)}}function F(){try{e.compressedTexImage3D(...arguments)}catch(e){J(`WebGLState:`,e)}}function I(){try{e.texSubImage2D(...arguments)}catch(e){J(`WebGLState:`,e)}}function L(){try{e.texSubImage3D(...arguments)}catch(e){J(`WebGLState:`,e)}}function De(){try{e.compressedTexSubImage2D(...arguments)}catch(e){J(`WebGLState:`,e)}}function Oe(){try{e.compressedTexSubImage3D(...arguments)}catch(e){J(`WebGLState:`,e)}}function ke(){try{e.texStorage2D(...arguments)}catch(e){J(`WebGLState:`,e)}}function R(){try{e.texStorage3D(...arguments)}catch(e){J(`WebGLState:`,e)}}function z(){try{e.texImage2D(...arguments)}catch(e){J(`WebGLState:`,e)}}function B(){try{e.texImage3D(...arguments)}catch(e){J(`WebGLState:`,e)}}function Ae(t){return d[t]===void 0?e.getParameter(t):d[t]}function je(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function Me(t){se.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),se.copy(t))}function V(t){ce.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),ce.copy(t))}function Ne(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function H(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function Pe(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},re=null,ie={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new Ep(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,se.set(0,0,e.canvas.width,e.canvas.height),ce.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:de,disable:fe,bindFramebuffer:pe,drawBuffers:me,useProgram:he,setBlending:ve,setMaterial:ye,setFlipSided:be,setCullFace:xe,setLineWidth:Se,setPolygonOffset:N,setScissorTest:Ce,activeTexture:P,bindTexture:we,unbindTexture:Te,compressedTexImage2D:Ee,compressedTexImage3D:F,texImage2D:z,texImage3D:B,pixelStorei:je,getParameter:Ae,updateUBOMapping:Ne,uniformBlockBinding:H,texStorage2D:ke,texStorage3D:R,texSubImage2D:I,texSubImage3D:L,compressedTexSubImage2D:De,compressedTexSubImage3D:Oe,scissor:Me,viewport:V,reset:Pe}}function Ly(e,t,n,r,i,a,o){let s=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,c=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),l=new bf,u=new WeakMap,d=new Set,f,p=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function h(e,t){return m?new OffscreenCanvas(e,t):tf(`canvas`)}function g(e,t,n){let r=1,i=Ee(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);f===void 0&&(f=h(n,a));let o=t?h(n,a):f;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),q(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&q(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function _(e){return e.generateMipmaps}function v(t){e.generateMipmap(t)}function y(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function b(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];q(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||q(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?qd:kf.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function x(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,q(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function S(e,t){return _(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function C(e){let t=e.target;t.removeEventListener(`dispose`,C),T(t),t.isVideoTexture&&u.delete(t),t.isHTMLTexture&&d.delete(t)}function w(e){let t=e.target;t.removeEventListener(`dispose`,w),D(t)}function T(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=p.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&E(e),Object.keys(i).length===0&&p.delete(n)}r.remove(e)}function E(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=p.get(i);delete a[n.__cacheKey],o.memory.textures--}function D(t){let n=r.get(t);if(t.depthTexture&&(t.depthTexture.dispose(),r.remove(t.depthTexture)),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let i=t.textures;for(let t=0,n=i.length;t<n;t++){let n=r.get(i[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),o.memory.textures--),r.remove(i[t])}r.remove(t)}let O=0;function k(){O=0}function A(){return O}function j(e){O=e}function ee(){let e=O;return e>=i.maxTextures&&q(`WebGLTextures: Trying to use `+(e+1)+` texture units while this GPU supports only `+i.maxTextures),O+=1,e}function M(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function te(t,i){let a=r.get(t);if(t.isVideoTexture&&we(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)q(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)q(`WebGLRenderer: Texture marked for update but image is incomplete`);else{fe(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function ne(t,i){let a=r.get(t);if(t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version){fe(a,t,i);return}t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i)}function re(t,i){let a=r.get(t);if(t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version){fe(a,t,i);return}n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function ie(t,i){let a=r.get(t);if(t.isCubeDepthTexture!==!0&&t.version>0&&a.__version!==t.version){pe(a,t,i);return}n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let ae={[Cu]:e.REPEAT,[wu]:e.CLAMP_TO_EDGE,[Tu]:e.MIRRORED_REPEAT},oe={[Eu]:e.NEAREST,[Du]:e.NEAREST_MIPMAP_NEAREST,[Ou]:e.NEAREST_MIPMAP_LINEAR,[ku]:e.LINEAR,[Au]:e.LINEAR_MIPMAP_NEAREST,[ju]:e.LINEAR_MIPMAP_LINEAR},se={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function ce(n,a){if(a.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(a.magFilter===1006||a.magFilter===1007||a.magFilter===1005||a.magFilter===1008||a.minFilter===1006||a.minFilter===1007||a.minFilter===1005||a.minFilter===1008)&&q(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,ae[a.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,ae[a.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,ae[a.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,oe[a.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,oe[a.minFilter]),a.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,se[a.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(a.magFilter===1003||a.minFilter!==1005&&a.minFilter!==1008||a.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(a.anisotropy>1||r.get(a).__currentAnisotropy){let o=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy}}}function le(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,C));let i=n.source,a=p.get(i);a===void 0&&(a={},p.set(i,a));let s=M(n);if(s!==t.__cacheKey){a[s]===void 0&&(a[s]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,r=!0),a[s].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&E(n)),t.__cacheKey=s,t.__webglTexture=a[s].texture}return r}function ue(e,t,n){return Math.floor(Math.floor(e/n)/t)}function de(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=ue(n.start,r.width,4),c=ue(t.start,r.width,4);n.start<=i+1&&a===c&&ue(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function fe(t,o,s){let c=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(c=e.TEXTURE_3D);let l=le(t,o),u=o.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+s);let f=r.get(u);if(u.version!==f.__version||l===!0){if(n.activeTexture(e.TEXTURE0+s),!(typeof ImageBitmap<`u`&&o.image instanceof ImageBitmap)){let t=kf.getPrimaries(kf.workingColorSpace),r=o.colorSpace===``?null:kf.getPrimaries(o.colorSpace),i=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,i)}n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment);let t=g(o.image,!1,i.maxTextureSize);t=Te(o,t);let r=a.convert(o.format,o.colorSpace),p=a.convert(o.type),m=b(o.internalFormat,r,p,o.normalized,o.colorSpace,o.isVideoTexture);ce(c,o);let h,y=o.mipmaps,C=o.isVideoTexture!==!0,w=f.__version===void 0||l===!0,T=u.dataReady,E=S(o,t);if(o.isDepthTexture)m=x(o.format===Yu,o.type),w&&(C?n.texStorage2D(e.TEXTURE_2D,1,m,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,null));else if(o.isDataTexture){if(y.length>0){C&&w&&n.texStorage2D(e.TEXTURE_2D,E,m,y[0].width,y[0].height);for(let t=0,i=y.length;t<i;t++)h=y[t],C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data);o.generateMipmaps=!1}else C?(w&&n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height),T&&de(o,t,r,p)):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,t.data)}else if(o.isCompressedTexture){if(o.isCompressedArrayTexture){C&&w&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,y[0].width,y[0].height,t.depth);for(let i=0,a=y.length;i<a;i++)if(h=y[i],o.format!==1023){if(r!==null){if(C){if(T){if(o.layerUpdates.size>0){let t=jg(h.width,h.height,o.format,o.type);for(let a of o.layerUpdates){let o=h.data.subarray(a*t/h.data.BYTES_PER_ELEMENT,(a+1)*t/h.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,a,h.width,h.height,1,r,o)}}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,h.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,h.data,0,0)}else q(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else C?T&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,p,h.data):n.texImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,r,p,h.data);o.layerUpdates.size>0&&o.clearLayerUpdates()}else{C&&w&&n.texStorage2D(e.TEXTURE_2D,E,m,y[0].width,y[0].height);for(let t=0,i=y.length;t<i;t++)h=y[t],o.format===1023?C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data):r===null?q(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):C?T&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,h.data):n.compressedTexImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,h.data)}}else if(o.isDataArrayTexture){if(C){if(w&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,t.width,t.height,t.depth),T){if(o.layerUpdates.size>0){let i=jg(t.width,t.height,o.format,o.type);for(let a of o.layerUpdates){let o=t.data.subarray(a*i/t.data.BYTES_PER_ELEMENT,(a+1)*i/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,a,t.width,t.height,1,r,p,o)}o.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,m,t.width,t.height,t.depth,0,r,p,t.data)}else if(o.isData3DTexture)C?(w&&n.texStorage3D(e.TEXTURE_3D,E,m,t.width,t.height,t.depth),T&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)):n.texImage3D(e.TEXTURE_3D,0,m,t.width,t.height,t.depth,0,r,p,t.data);else if(o.isFramebufferTexture){if(w){if(C)n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height);else{let i=t.width,a=t.height;for(let t=0;t<E;t++)n.texImage2D(e.TEXTURE_2D,t,m,i,a,0,r,p,null),i>>=1,a>>=1}}}else if(o.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),d.add(o),n.onpaint=e=>{let t=e.changedElements;for(let e of d)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(y.length>0){if(C&&w){let t=Ee(y[0]);n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height)}for(let t=0,i=y.length;t<i;t++)h=y[t],C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,r,p,h):n.texImage2D(e.TEXTURE_2D,t,m,r,p,h);o.generateMipmaps=!1}else if(C){if(w){let r=Ee(t);n.texStorage2D(e.TEXTURE_2D,E,m,r.width,r.height)}T&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,r,p,t)}else n.texImage2D(e.TEXTURE_2D,0,m,r,p,t);_(o)&&v(c),f.__version=u.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function pe(t,o,s){if(o.image.length!==6)return;let c=le(t,o),l=o.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+s);let u=r.get(l);if(l.version!==u.__version||c===!0){n.activeTexture(e.TEXTURE0+s);let t=kf.getPrimaries(kf.workingColorSpace),r=o.colorSpace===``?null:kf.getPrimaries(o.colorSpace),d=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=o.isCompressedTexture||o.image[0].isCompressedTexture,p=o.image[0]&&o.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=g(o.image[e],!0,i.maxCubemapSize):m[e]=p?o.image[e].image:o.image[e],m[e]=Te(o,m[e]);let h=m[0],y=a.convert(o.format,o.colorSpace),x=a.convert(o.type),C=b(o.internalFormat,y,x,o.normalized,o.colorSpace),w=o.isVideoTexture!==!0,T=u.__version===void 0||c===!0,E=l.dataReady,D=S(o,h);ce(e.TEXTURE_CUBE_MAP,o);let O;if(f){w&&T&&n.texStorage2D(e.TEXTURE_CUBE_MAP,D,C,h.width,h.height);for(let t=0;t<6;t++){O=m[t].mipmaps;for(let r=0;r<O.length;r++){let i=O[r];o.format===1023?w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,y,x,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,C,i.width,i.height,0,y,x,i.data):y===null?q(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):w?E&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,y,i.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,C,i.width,i.height,0,i.data)}}}else{if(O=o.mipmaps,w&&T){O.length>0&&D++;let t=Ee(m[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,D,C,t.width,t.height)}for(let t=0;t<6;t++)if(p){w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,m[t].width,m[t].height,y,x,m[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,C,m[t].width,m[t].height,0,y,x,m[t].data);for(let r=0;r<O.length;r++){let i=O[r].image[t].image;w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,y,x,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,C,i.width,i.height,0,y,x,i.data)}}else{w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,y,x,m[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,C,y,x,m[t]);for(let r=0;r<O.length;r++){let i=O[r];w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,y,x,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,C,y,x,i.image[t])}}}_(o)&&v(e.TEXTURE_CUBE_MAP),u.__version=l.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function me(t,i,o,c,l,u){let d=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=b(o.internalFormat,d,f,o.normalized,o.colorSpace),m=r.get(i),h=r.get(o);if(h.__renderTarget=i,!m.__hasExternalTextures){let t=Math.max(1,i.width>>u),r=Math.max(1,i.height>>u);l===e.TEXTURE_3D||l===e.TEXTURE_2D_ARRAY?n.texImage3D(l,u,p,t,r,i.depth,0,d,f,null):n.texImage2D(l,u,p,t,r,0,d,f,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),P(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,c,l,h.__webglTexture,0,Ce(i)):(l===e.TEXTURE_2D||l>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&l<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,c,l,h.__webglTexture,u),n.bindFramebuffer(e.FRAMEBUFFER,null)}function he(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=x(n.stencilBuffer,a),c=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;P(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Ce(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Ce(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,c,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let o=t[i],c=a.convert(o.format,o.colorSpace),l=a.convert(o.type),u=b(o.internalFormat,c,l,o.normalized,o.colorSpace);P(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Ce(n),u,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Ce(n),u,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,u,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function ge(t,i,o){let c=i.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let l=r.get(i.depthTexture);if(l.__renderTarget=i,(!l.__webglTexture||i.depthTexture.image.width!==i.width||i.depthTexture.image.height!==i.height)&&(i.depthTexture.image.width=i.width,i.depthTexture.image.height=i.height,i.depthTexture.needsUpdate=!0),c){if(l.__webglInit===void 0&&(l.__webglInit=!0,i.depthTexture.addEventListener(`dispose`,C)),l.__webglTexture===void 0){l.__webglTexture=e.createTexture(),n.bindTexture(e.TEXTURE_CUBE_MAP,l.__webglTexture),ce(e.TEXTURE_CUBE_MAP,i.depthTexture);let t=a.convert(i.depthTexture.format),r=a.convert(i.depthTexture.type),o;i.depthTexture.format===1026?o=e.DEPTH_COMPONENT24:i.depthTexture.format===1027&&(o=e.DEPTH24_STENCIL8);for(let n=0;n<6;n++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0,o,i.width,i.height,0,t,r,null)}}else te(i.depthTexture,0);let u=l.__webglTexture,d=Ce(i),f=c?e.TEXTURE_CUBE_MAP_POSITIVE_X+o:e.TEXTURE_2D,p=i.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(i.depthTexture.format===1026)P(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else if(i.depthTexture.format===1027)P(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function _e(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)for(let e=0;e<6;e++)ge(i.__webglFramebuffer[e],t,e);else{let e=t.texture.mipmaps;e&&e.length>0?ge(i.__webglFramebuffer[0],t,0):ge(i.__webglFramebuffer,t,0)}}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),he(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else{let r=t.texture.mipmaps;if(r&&r.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),he(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function ve(t,n,i){let a=r.get(t);n!==void 0&&me(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&_e(t)}function ye(t){let i=t.texture,s=r.get(t),c=r.get(i);t.addEventListener(`dispose`,w);let l=t.textures,u=t.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(c.__webglTexture===void 0&&(c.__webglTexture=e.createTexture()),c.__version=i.version,o.memory.textures++),u){s.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)s.__webglFramebuffer[t][n]=e.createFramebuffer()}else s.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)s.__webglFramebuffer[t]=e.createFramebuffer()}else s.__webglFramebuffer=e.createFramebuffer();if(d)for(let t=0,n=l.length;t<n;t++){let n=r.get(l[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),o.memory.textures++)}if(t.samples>0&&P(t)===!1){s.__webglMultisampledFramebuffer=e.createFramebuffer(),s.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];s.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,s.__webglColorRenderbuffer[n]);let i=a.convert(r.format,r.colorSpace),o=a.convert(r.type),c=b(r.internalFormat,i,o,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),u=Ce(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,s.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(s.__webglDepthRenderbuffer=e.createRenderbuffer(),he(s.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),ce(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps&&i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)me(s.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else me(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);_(i)&&v(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(d){for(let i=0,a=l.length;i<a;i++){let a=l[i],o=r.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,o.__webglTexture),ce(c,a),me(s.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+i,c,0),_(a)&&v(c)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,c.__webglTexture),ce(r,i),i.mipmaps&&i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)me(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else me(s.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);_(i)&&v(r),n.unbindTexture()}t.depthBuffer&&_e(t)}function be(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(_(a)){let t=y(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),v(t),n.unbindTexture()}}}let xe=[],Se=[];function N(t){if(t.samples>0){if(P(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,l=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,u=r.get(t),d=i.length>1;if(d)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,u.__webglMultisampledFramebuffer);let f=t.texture.mipmaps;f&&f.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),d){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,u.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),c===!0&&(xe.length=0,Se.length=0,xe.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&(xe.push(l),Se.push(l),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,Se)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,xe))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),d)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,u.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&c){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function Ce(e){return Math.min(i.maxSamples,e.samples)}function P(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function we(e){let t=o.render.frame;u.get(e)!==t&&(u.set(e,t),e.update())}function Te(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(kf.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&q(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):J(`WebGLTextures: Unsupported texture color space:`,n)),t}function Ee(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(l.width=e.naturalWidth||e.width,l.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(l.width=e.displayWidth,l.height=e.displayHeight):(l.width=e.width,l.height=e.height),l}this.allocateTextureUnit=ee,this.resetTextureUnits=k,this.getTextureUnits=A,this.setTextureUnits=j,this.setTexture2D=te,this.setTexture2DArray=ne,this.setTexture3D=re,this.setTextureCube=ie,this.rebindTextures=ve,this.setupRenderTarget=ye,this.updateRenderTargetMipmap=be,this.updateMultisampleRenderTarget=N,this.setupDepthRenderbuffer=_e,this.setupFrameBufferTexture=me,this.useMultisampledRTT=P,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function Ry(e,t){function n(n,r=``){let i,a=kf.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var zy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,By=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Vy=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Th(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Ih({vertexShader:zy,fragmentShader:By,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Km(new Dh(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Hy=class extends uf{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,f=null,p=null,m=typeof XRWebGLBinding<`u`,h=new Vy,g={},_=t.getContextAttributes(),v=null,y=null,b=[],x=[],S=new bf,C=null,w=null,T=new fg;T.viewport=new Bf;let E=new fg;E.viewport=new Bf;let D=[T,E],O=new vg,k=null,A=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=b[e];return t===void 0&&(t=new xp,b[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=b[e];return t===void 0&&(t=new xp,b[e]=t),t.getGripSpace()},this.getHand=function(e){let t=b[e];return t===void 0&&(t=new xp,b[e]=t),t.getHandSpace()};function j(e){let t=x.indexOf(e.inputSource);if(t===-1)return;let n=b[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function ee(){r.removeEventListener(`select`,j),r.removeEventListener(`selectstart`,j),r.removeEventListener(`selectend`,j),r.removeEventListener(`squeeze`,j),r.removeEventListener(`squeezestart`,j),r.removeEventListener(`squeezeend`,j),r.removeEventListener(`end`,ee),r.removeEventListener(`inputsourceschange`,M);for(let e=0;e<b.length;e++){let t=x[e];t!==null&&(x[e]=null,b[e].disconnect(t))}k=null,A=null,h.reset();for(let e in g)delete g[e];if(e.setRenderTarget(v),f=null,d=null,u=null,r=null,y=null,ce.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(S.width,S.height,!1),w!==null){let e=w.camera;e.fov=w.fov,e.zoom=w.zoom,e.updateProjectionMatrix(),w=null}n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&q(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&q(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?f:d},this.getBinding=function(){return u===null&&m&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(v=e.getRenderTarget(),r.addEventListener(`select`,j),r.addEventListener(`selectstart`,j),r.addEventListener(`selectend`,j),r.addEventListener(`squeeze`,j),r.addEventListener(`squeezestart`,j),r.addEventListener(`squeezeend`,j),r.addEventListener(`end`,ee),r.addEventListener(`inputsourceschange`,M),_.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(S),m&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;_.depth&&(o=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=_.stencil?Yu:Ju,a=_.stencil?Hu:Lu);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new Hf(d.textureWidth,d.textureHeight,{format:qu,type:Mu,depthTexture:new Ch(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let n={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:i};f=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Hf(f.framebufferWidth,f.framebufferHeight,{format:qu,type:Mu,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),ce.setContext(r),ce.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return h.getDepthTexture()};function M(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=x.indexOf(n);r>=0&&(x[r]=null,b[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=x.indexOf(n);if(r===-1){for(let e=0;e<b.length;e++)if(e>=x.length){x.push(n),r=e;break}else if(x[e]===null){x[e]=n,r=e;break}if(r===-1)break}let i=b[r];i&&i.connect(n)}}let te=new Y,ne=new Y;function re(e,t,n){te.setFromMatrixPosition(t.matrixWorld),ne.setFromMatrixPosition(n.matrixWorld);let r=te.distanceTo(ne),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function ie(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;h.texture!==null&&(h.depthNear>0&&(t=h.depthNear),h.depthFar>0&&(n=h.depthFar)),O.near=E.near=T.near=t,O.far=E.far=T.far=n,(k!==O.near||A!==O.far)&&(r.updateRenderState({depthNear:O.near,depthFar:O.far}),k=O.near,A=O.far),O.layers.mask=e.layers.mask|6,T.layers.mask=O.layers.mask&-5,E.layers.mask=O.layers.mask&-3;let i=e.parent,a=O.cameras;ie(O,i);for(let e=0;e<a.length;e++)ie(a[e],i);a.length===2?re(O,T,E):O.projectionMatrix.copy(T.projectionMatrix),w===null&&e.isPerspectiveCamera&&(w={camera:e,fov:e.fov,zoom:e.zoom}),ae(e,O,i)};function ae(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=pf*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(d!==null||f!==null)return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=e)},this.hasDepthSensing=function(){return h.texture!==null},this.getDepthSensingMesh=function(){return h.getMesh(O)},this.getCameraTexture=function(e){return g[e]};let oe=null;function se(t,i){if(l=i.getViewerPose(c||a),p=i,l!==null){let t=l.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let i=!1;t.length!==O.cameras.length&&(O.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(f!==null)a=f.getViewport(r);else{let t=u.getViewSubImage(d,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(y,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(y))}let o=D[n];o===void 0&&(o=new fg,o.layers.enable(n),o.viewport=new Bf,D[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(O.matrix.copy(o.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),i===!0&&O.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&m){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&h.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&m){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=g[n];e||(e=new Th,g[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<b.length;e++){let t=x[e],n=b[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}oe&&oe(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),p=null}let ce=new Ng;ce.setAnimationLoop(se),this.setAnimationLoop=function(e){oe=e},this.dispose=function(){}}},Uy=new Gf,Wy=new wf;Wy.set(-1,0,0,0,1,0,0,0,1);function Gy(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,Mh(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(Uy.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(Wy),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.retroreflectivity>0&&(e.retroreflectivity.value=t.retroreflectivity),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function Ky(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(g(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,v));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return J(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)p(t[n],e,n,a);else p(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(t,n,r,i){if(h(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=_(i);m(i,t.__data,e),typeof i!=`number`&&typeof i!=`boolean`&&!i.isMatrix3&&!ArrayBuffer.isView(i)&&(e+=a.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function m(e,t,n){typeof e==`number`||typeof e==`boolean`?t[0]=e:e.isMatrix3?(t[0]=e.elements[0],t[1]=e.elements[1],t[2]=e.elements[2],t[3]=0,t[4]=e.elements[3],t[5]=e.elements[4],t[6]=e.elements[5],t[7]=0,t[8]=e.elements[6],t[9]=e.elements[7],t[10]=e.elements[8],t[11]=0):ArrayBuffer.isView(e)?t.set(new e.constructor(e.buffer,e.byteOffset,t.length)):e.toArray(t,n)}function h(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:ArrayBuffer.isView(i)?i.slice():i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function g(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=_(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function _(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?q(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):q(`WebGLRenderer: Unsupported uniform value type.`,e),t}function v(t){let n=t.target;n.removeEventListener(`dispose`,v);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function y(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:y}}var qy=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Jy=null;function Yy(){return Jy===null&&(Jy=new Ym(qy,16,16,Qu,zu),Jy.name=`DFG_LUT`,Jy.minFilter=ku,Jy.magFilter=ku,Jy.wrapS=wu,Jy.wrapT=wu,Jy.generateMipmaps=!1,Jy.needsUpdate=!0),Jy}var Xy=class{constructor(e={}){let{canvas:t=nf(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=Mu}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);p=n.getContextAttributes().alpha}else p=a;let m=f,h=new Set([ed,$u,Zu]),g=new Set([Mu,Lu,Fu,Hu,Bu,Vu]),_=new Uint32Array(4),v=new Int32Array(4),y=new Y,b=null,x=null,S=[],C=[],w=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let T=this,E=!1,D=null,O=null,k=null,A=null;this._outputColorSpace=Gd;let j=0,ee=0,M=null,te=-1,ne=null,re=new Bf,ie=new Bf,ae=null,oe=new Ep(0),se=0,ce=t.width,le=t.height,ue=1,de=null,fe=null,pe=new Bf(0,0,ce,le),me=new Bf(0,0,ce,le),he=!1,ge=new eh,_e=!1,ve=!1,ye=new Gf,be=new Y,xe=new Bf,Se={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},N=!1;function Ce(){return M===null?ue:1}let P=n;function we(e,n){return t.getContext(e,n)}let Te,Ee,F,I,L,De,Oe,ke,R,z,B,Ae,je,Me,V,Ne,H,Pe,Fe,Ie,Le,Re,ze;try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r186`),t.addEventListener(`webglcontextlost`,He,!1),t.addEventListener(`webglcontextrestored`,Ue,!1),t.addEventListener(`webglcontextcreationerror`,We,!1),P===null){let t=`webgl2`;if(P=we(t,e),P===null)throw we(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}Be()}catch(e){throw t.removeEventListener(`webglcontextlost`,He,!1),t.removeEventListener(`webglcontextrestored`,Ue,!1),t.removeEventListener(`webglcontextcreationerror`,We,!1),J(`WebGLRenderer: `+e.message),e}function Be(){Te=new m_(P),Te.init(),Le=new Ry(P,Te),Ee=new Ug(P,Te,e,Le),F=new Iy(P,Te),Ee.reversedDepthBuffer&&d&&F.buffers.depth.setReversed(!0),O=P.createFramebuffer(),k=P.createFramebuffer(),A=P.createFramebuffer(),I=new __(P),L=new gy,De=new Ly(P,Te,F,L,Ee,Le,I),Oe=new p_(T),ke=new Pg(P),Re=new Vg(P,ke),R=new h_(P,ke,I,Re),z=new y_(P,R,ke,Re,I),Pe=new v_(P,Ee,De),V=new Wg(L),B=new hy(T,Oe,Te,Ee,Re,V),Ae=new Gy(T,L),je=new by,Me=new Dy(Te),H=new Bg(T,Oe,F,z,p,s),Ne=new Fy(T,z,Ee),ze=new Ky(P,I,Ee,F),Fe=new Hg(P,Te,I),Ie=new g_(P,Te,I),I.programs=B.programs,T.capabilities=Ee,T.extensions=Te,T.properties=L,T.renderLists=je,T.shadowMap=Ne,T.state=F,T.info=I}m!==1009&&(w=new x_(m,t.width,t.height,o,r,i));let Ve=new Hy(T,P);this.xr=Ve,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){let e=Te.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=Te.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return ue},this.setPixelRatio=function(e){e!==void 0&&(ue=e,this.setSize(ce,le,!1))},this.getSize=function(e){return e.set(ce,le)},this.setSize=function(e,n,r=!0){if(Ve.isPresenting){q(`WebGLRenderer: Can't change size while VR device is presenting.`);return}ce=e,le=n,t.width=Math.floor(e*ue),t.height=Math.floor(n*ue),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,e,n)},this.getDrawingBufferSize=function(e){return e.set(ce*ue,le*ue).floor()},this.setDrawingBufferSize=function(e,n,r){ce=e,le=n,ue=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(m===1009){J(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);return}if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){q(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}w.setEffects(e||[])},this.getCurrentViewport=function(e){return e.copy(re)},this.getViewport=function(e){return e.copy(pe)},this.setViewport=function(e,t,n,r){e.isVector4?pe.set(e.x,e.y,e.z,e.w):pe.set(e,t,n,r),F.viewport(re.copy(pe).multiplyScalar(ue).round())},this.getScissor=function(e){return e.copy(me)},this.setScissor=function(e,t,n,r){e.isVector4?me.set(e.x,e.y,e.z,e.w):me.set(e,t,n,r),F.scissor(ie.copy(me).multiplyScalar(ue).round())},this.getScissorTest=function(){return he},this.setScissorTest=function(e){F.setScissorTest(he=e)},this.setOpaqueSort=function(e){de=e},this.setTransparentSort=function(e){fe=e},this.getClearColor=function(e){return e.copy(H.getClearColor())},this.setClearColor=function(){H.setClearColor(...arguments)},this.getClearAlpha=function(){return H.getClearAlpha()},this.setClearAlpha=function(){H.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(M!==null){let t=M.texture.format;e=h.has(t)}if(e){let e=M.texture.type,t=g.has(e),n=H.getClearColor(),r=H.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(_[0]=i,_[1]=a,_[2]=o,_[3]=r,P.clearBufferuiv(P.COLOR,0,_)):(v[0]=i,v[1]=a,v[2]=o,v[3]=r,P.clearBufferiv(P.COLOR,0,v))}else r|=P.COLOR_BUFFER_BIT}t&&(r|=P.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&P.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),D=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,He,!1),t.removeEventListener(`webglcontextrestored`,Ue,!1),t.removeEventListener(`webglcontextcreationerror`,We,!1),H.dispose(),je.dispose(),Me.dispose(),L.dispose(),Oe.dispose(),z.dispose(),Re.dispose(),ze.dispose(),B.dispose(),Ve.dispose(),Ve.removeEventListener(`sessionstart`,Ze),Ve.removeEventListener(`sessionend`,Qe),$e.stop()};function He(e){e.preventDefault(),af(`WebGLRenderer: Context Lost.`),E=!0}function Ue(){af(`WebGLRenderer: Context Restored.`),E=!1;let e=I.autoReset,t=Ne.enabled,n=Ne.autoUpdate,r=Ne.needsUpdate,i=Ne.type;Be(),I.autoReset=e,Ne.enabled=t,Ne.autoUpdate=n,Ne.needsUpdate=r,Ne.type=i}function We(e){J(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function Ge(e){let t=e.target;t.removeEventListener(`dispose`,Ge),Ke(t)}function Ke(e){qe(e),L.remove(e)}function qe(e){let t=L.get(e).programs;t!==void 0&&(t.forEach(function(e){B.releaseProgram(e)}),e.isShaderMaterial&&B.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=Se);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=lt(e,t,n,r,i);F.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=R.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;Re.setup(i,r,s,n,c);let h,g=Fe;if(c!==null&&(h=ke.get(c),g=Ie,g.setIndex(h)),i.isMesh)r.wireframe===!0?(F.setLineWidth(r.wireframeLinewidth*Ce()),g.setMode(P.LINES)):g.setMode(P.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),F.setLineWidth(e*Ce()),i.isLineSegments?g.setMode(P.LINES):i.isLineLoop?g.setMode(P.LINE_LOOP):g.setMode(P.LINE_STRIP)}else i.isPoints?g.setMode(P.POINTS):i.isSprite&&g.setMode(P.TRIANGLES);if(i.isBatchedMesh){if(Te.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?ke.get(c).bytesPerElement:1,o=L.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(P,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function Je(e,t,n,r){D!==null&&e.isNodeMaterial&&D.setObject(r,e),_e===!0&&V.setState(e,n,!1),e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,at(e,t,r),e.side=0,e.needsUpdate=!0,at(e,t,r),e.side=2):at(e,t,r)}this.compile=function(e,t,n=null){n===null&&(n=e),D!==null&&D.renderStart(e,t,n),x=Me.get(n),x.init(t),C.push(x),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),x.setupLights(),D!==null&&D.updateLights(x.state.lightsArray),ve=this.localClippingEnabled,_e=V.init(this.clippingPlanes,ve),_e===!0&&V.setGlobalState(this.clippingPlanes,t),D!==null&&Ne.render(x.state.shadowsArray,n,t);let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let i=e.material;if(i){if(Array.isArray(i))for(let a=0;a<i.length;a++){let o=i[a];Je(o,n,t,e),r.add(o)}else Je(i,n,t,e),r.add(i)}}),x=C.pop(),D!==null&&D.renderEnd(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){if(r.forEach(function(e){let t=L.get(e).currentProgram;(t===void 0||t.isReady())&&r.delete(e)}),r.size===0){t(e);return}setTimeout(n,10)}Te.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let Ye=null;function Xe(e){Ye&&Ye(e)}function Ze(){$e.stop()}function Qe(){$e.start()}let $e=new Ng;$e.setAnimationLoop(Xe),typeof self<`u`&&$e.setContext(self),this.setAnimationLoop=function(e){Ye=e,Ve.setAnimationLoop(e),e===null?$e.stop():$e.start()},Ve.addEventListener(`sessionstart`,Ze),Ve.addEventListener(`sessionend`,Qe),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){J(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(E===!0)return;D!==null&&D.renderStart(e,t);let n=Ve.enabled===!0&&Ve.isPresenting===!0,r=w!==null&&(M===null||n)&&w.begin(T,M);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),Ve.enabled===!0&&Ve.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(Ve.cameraAutoUpdate===!0&&Ve.updateCamera(t),t=Ve.getCamera()),e.isScene===!0&&e.onBeforeRender(T,e,t,M),x=Me.get(e,C.length),x.init(t),x.state.textureUnits=De.getTextureUnits(),C.push(x),ye.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),ge.setFromProjectionMatrix(ye,Qd,t.reversedDepth),ve=this.localClippingEnabled,_e=V.init(this.clippingPlanes,ve),b=je.get(e,S.length),b.init(),S.push(b),Ve.enabled===!0&&Ve.isPresenting===!0){let e=T.xr.getDepthSensingMesh();e!==null&&et(e,t,-1/0,T.sortObjects)}et(e,t,0,T.sortObjects),b.finish(),D!==null&&D.updateLights(x.state.lightsArray),T.sortObjects===!0&&b.sort(de,fe),N=Ve.enabled===!1||Ve.isPresenting===!1||Ve.hasDepthSensing()===!1,N&&H.addToRenderList(b,e),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),_e===!0&&V.beginShadows();let i=x.state.shadowsArray;if(Ne.render(i,e,t),_e===!0&&V.endShadows(),(r&&w.hasRenderPass())===!1){let n=b.opaque,r=b.transmissive;if(x.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];nt(n,r,e,a)}N&&H.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];tt(b,e,n,n.viewport)}}else r.length>0&&nt(n,r,e,t),N&&H.render(e),tt(b,e,t)}M!==null&&ee===0&&(De.updateMultisampleRenderTarget(M),De.updateRenderTargetMipmap(M)),r&&w.end(T),e.isScene===!0&&e.onAfterRender(T,e,t),Re.resetDefaultState(),te=-1,ne=null,C.pop(),C.length>0?(x=C[C.length-1],De.setTextureUnits(x.state.textureUnits),_e===!0&&V.setGlobalState(T.clippingPlanes,x.state.camera)):x=null,S.pop(),b=S.length>0?S[S.length-1]:null,D!==null&&D.renderEnd()};function et(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)x.pushLightProbeGrid(e);else if(e.isLight)x.pushLight(e),e.castShadow&&x.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||e.intersectsFrustum(ge)){r&&xe.setFromMatrixPosition(e.matrixWorld).applyMatrix4(ye);let i=z.update(e),a=e.material;a.visible&&b.push(e,i,a,n,xe.z,null,t)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||e.intersectsFrustum(ge))){let i=z.update(e),a=e.material;if(r&&(e.boundingSphere===void 0?(i.boundingSphere===null&&i.computeBoundingSphere(),xe.copy(i.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),xe.copy(e.boundingSphere.center)),xe.applyMatrix4(e.matrixWorld).applyMatrix4(ye)),Array.isArray(a)){let r=i.groups;for(let o=0,s=r.length;o<s;o++){let s=r[o],c=a[s.materialIndex];c&&c.visible&&b.push(e,i,c,n,xe.z,s,t)}}else a.visible&&b.push(e,i,a,n,xe.z,null,t)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)et(i[e],t,n,r)}function tt(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;x.setupLightsView(n),_e===!0&&V.setGlobalState(T.clippingPlanes,n),r&&F.viewport(re.copy(r)),i.length>0&&rt(i,t,n),a.length>0&&rt(a,t,n),o.length>0&&rt(o,t,n),F.buffers.depth.setTest(!0),F.buffers.depth.setMask(!0),F.buffers.color.setMask(!0),F.setPolygonOffset(!1)}function nt(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(x.state.transmissionRenderTarget[r.id]===void 0){let e=Te.has(`EXT_color_buffer_half_float`)||Te.has(`EXT_color_buffer_float`);x.state.transmissionRenderTarget[r.id]=new Hf(1,1,{generateMipmaps:!0,type:e?zu:Mu,minFilter:ju,samples:Math.max(4,Ee.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:kf.workingColorSpace})}let a=x.state.transmissionRenderTarget[r.id],o=r.viewport||re;a.setSize(o.z*T.transmissionResolutionScale,o.w*T.transmissionResolutionScale);let s=T.getRenderTarget(),c=T.getActiveCubeFace(),l=T.getActiveMipmapLevel();T.setRenderTarget(a),T.getClearColor(oe),se=T.getClearAlpha(),se<1&&T.setClearColor(16777215,.5),T.clear(),N&&H.render(n);let u=T.toneMapping;T.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),x.setupLightsView(r),_e===!0&&V.setGlobalState(T.clippingPlanes,r),rt(e,n,r),De.updateMultisampleRenderTarget(a),De.updateRenderTargetMipmap(a),Te.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,it(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(De.updateMultisampleRenderTarget(a),De.updateRenderTargetMipmap(a))}T.setRenderTarget(s,c,l),T.setClearColor(oe,se),d!==void 0&&(r.viewport=d),T.toneMapping=u}function rt(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&it(o,t,n,s,l,c)}}function it(e,t,n,r,i,a){D!==null&&i.isNodeMaterial&&D.setObject(e,i),e.onBeforeRender(T,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(T,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=2):T.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(T,t,n,r,i,a)}function at(e,t,n){t.isScene!==!0&&(t=Se);let r=L.get(e),i=x.state.lights,a=x.state.shadowsArray,o=i.state.version,s=B.getParameters(e,i.state,a,t,n,x.state.lightProbeGridArray),c=B.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=Oe.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,Ge),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return st(e,s),d}else s.uniforms=B.getUniforms(e),D!==null&&e.isNodeMaterial&&D.build(e,n,s),e.onBeforeCompile(s,T),d=B.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=V.uniform),st(e,s),r.needsLights=dt(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.sunLights.value=i.state.sun,f.sunLightShadows.value=i.state.sunShadow,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.sunShadowMatrix.value=i.state.sunShadowMatrix,f.sunShadowCascade.value=i.state.sunShadowCascade,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=x.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function ot(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=Ov.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function st(e,t){let n=L.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function ct(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];y.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(y))return n}return null}function lt(e,t,n,r,i){t.isScene!==!0&&(t=Se),De.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=M===null?T.outputColorSpace:M.isXRRenderTarget===!0?M.texture.colorSpace:kf.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=Oe.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(M===null||M.isXRRenderTarget===!0)&&(h=T.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=L.get(r),y=x.state.lights;if(_e===!0&&(ve===!0||e!==ne)){let t=e===ne&&r.id===te;V.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i._colorsTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i._colorsTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==V.numPlanes||v.numIntersection!==V.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=x.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let S=v.currentProgram;b===!0&&(S=at(r,t,i),D&&r.isNodeMaterial&&D.onUpdateProgram(r,S,v));let C=!1,w=!1,E=!1,O=S.getUniforms(),k=v.uniforms;if(F.useProgram(S.program)&&(C=!0,w=!0,E=!0),r.id!==te&&(te=r.id,w=!0),v.needsLights){let e=ct(x.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,w=!0)}if(C||ne!==e){F.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),O.setValue(P,`projectionMatrix`,e.projectionMatrix),O.setValue(P,`viewMatrix`,e.matrixWorldInverse);let t=O.map.cameraPosition;t!==void 0&&t.setValue(P,be.setFromMatrixPosition(e.matrixWorld)),Ee.logarithmicDepthBuffer&&O.setValue(P,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&O.setValue(P,`isOrthographic`,e.isOrthographicCamera===!0),ne!==e&&(ne=e,w=!0,E=!0)}if(v.needsLights&&(y.state.sunShadowMap.length>0&&O.setValue(P,`sunShadowMap`,y.state.sunShadowMap,De),y.state.directionalShadowMap.length>0&&O.setValue(P,`directionalShadowMap`,y.state.directionalShadowMap,De),y.state.spotShadowMap.length>0&&O.setValue(P,`spotShadowMap`,y.state.spotShadowMap,De),y.state.pointShadowMap.length>0&&O.setValue(P,`pointShadowMap`,y.state.pointShadowMap,De)),i.isSkinnedMesh){O.setOptional(P,i,`bindMatrix`),O.setOptional(P,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),O.setValue(P,`boneTexture`,e.boneTexture,De))}i.isBatchedMesh&&(O.setOptional(P,i,`batchingTexture`),O.setValue(P,`batchingTexture`,i._matricesTexture,De),O.setOptional(P,i,`batchingIdTexture`),O.setValue(P,`batchingIdTexture`,i._indirectTexture,De),O.setOptional(P,i,`batchingColorTexture`),i._colorsTexture!==null&&O.setValue(P,`batchingColorTexture`,i._colorsTexture,De));let A=n.morphAttributes;if((A.position!==void 0||A.normal!==void 0||A.color!==void 0)&&Pe.update(i,n,S),(w||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,O.setValue(P,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(k.envMapIntensity.value=t.environmentIntensity),k.dfgLUT!==void 0&&(k.dfgLUT.value=Yy()),w){if(O.setValue(P,`toneMappingExposure`,T.toneMappingExposure),v.needsLights&&ut(k,E),a&&r.fog===!0&&Ae.refreshFogUniforms(k,a),Ae.refreshMaterialUniforms(k,r,ue,le,x.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;k.probesSH.value=e.texture,k.probesMin.value.copy(e.boundingBox.min),k.probesMax.value.copy(e.boundingBox.max),k.probesResolution.value.copy(e.resolution)}Ov.upload(P,ot(v),k,De)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(Ov.upload(P,ot(v),k,De),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&O.setValue(P,`center`,i.center),O.setValue(P,`modelViewMatrix`,i.modelViewMatrix),O.setValue(P,`normalMatrix`,i.normalMatrix),O.setValue(P,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];ze.update(n,S),ze.bind(n,S)}}return S}function ut(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.sunLights.needsUpdate=t,e.sunLightShadows.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function dt(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return j},this.getActiveMipmapLevel=function(){return ee},this.getRenderTarget=function(){return M},this.setRenderTargetTextures=function(e,t,n){let r=L.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),L.get(e.texture).__webglTexture=t,L.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=L.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){M=e,j=t,ee=n;let r=null,i=!1,a=!1;if(e){let o=L.get(e);if(o.__useDefaultFramebuffer!==void 0){F.bindFramebuffer(P.FRAMEBUFFER,o.__webglFramebuffer),re.copy(e.viewport),ie.copy(e.scissor),ae=e.scissorTest,F.viewport(re),F.scissor(ie),F.setScissorTest(ae),te=-1;return}if(o.__webglFramebuffer===void 0)De.setupRenderTarget(e);else if(o.__hasExternalTextures)De.rebindTextures(e,L.get(e.texture).__webglTexture,L.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&L.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);De.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=L.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&De.useMultisampledRTT(e)===!1?L.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,re.copy(e.viewport),ie.copy(e.scissor),ae=e.scissorTest}else re.copy(pe).multiplyScalar(ue).floor(),ie.copy(me).multiplyScalar(ue).floor(),ae=he;if(n!==0&&(r=O),F.bindFramebuffer(P.FRAMEBUFFER,r)&&F.drawBuffers(e,r),F.viewport(re),F.scissor(ie),F.setScissorTest(ae),i){let r=L.get(e.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=L.get(e.textures[t]);P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=L.get(e.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,t.__webglTexture,n)}te=-1};function ft(e){let t=L.get(e);return(t.__readFormat!==e.format||t.__readType!==e.type)&&(t.__readFormat=e.format,t.__readType=e.type,t.__formatReadable=Ee.textureFormatReadable(e.format),t.__typeReadable=Ee.textureTypeReadable(e.type)),t}this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){J(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=L.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){F.bindFramebuffer(P.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;e.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+s);let u=ft(o);if(u.__formatReadable===!1){J(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(u.__typeReadable===!1){J(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&P.readPixels(t,n,r,i,Le.convert(c),Le.convert(l),a)}finally{let e=M===null?null:L.get(M).__webglFramebuffer;F.bindFramebuffer(P.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=L.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){F.bindFramebuffer(P.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;e.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+s);let d=ft(o);if(d.__formatReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(d.__typeReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let f=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,f),P.bufferData(P.PIXEL_PACK_BUFFER,a.byteLength,P.STREAM_READ),P.readPixels(t,n,r,i,Le.convert(l),Le.convert(u),0),P.bindBuffer(P.PIXEL_PACK_BUFFER,null);let p=M===null?null:L.get(M).__webglFramebuffer;F.bindFramebuffer(P.FRAMEBUFFER,p);let m=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await cf(P,m,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,f),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,a),P.bindBuffer(P.PIXEL_PACK_BUFFER,null),P.deleteBuffer(f),P.deleteSync(m),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;De.setTexture2D(e,0),P.copyTexSubImage2D(P.TEXTURE_2D,n,0,0,o,s,i,a),F.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=Le.convert(t.format),_=Le.convert(t.type),v;t.isData3DTexture?(De.setTexture3D(t,0),v=P.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(De.setTexture2DArray(t,0),v=P.TEXTURE_2D_ARRAY):(De.setTexture2D(t,0),v=P.TEXTURE_2D),F.activeTexture(P.TEXTURE0),F.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,t.flipY),F.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),F.pixelStorei(P.UNPACK_ALIGNMENT,t.unpackAlignment);let y=F.getParameter(P.UNPACK_ROW_LENGTH),b=F.getParameter(P.UNPACK_IMAGE_HEIGHT),x=F.getParameter(P.UNPACK_SKIP_PIXELS),S=F.getParameter(P.UNPACK_SKIP_ROWS),C=F.getParameter(P.UNPACK_SKIP_IMAGES);F.pixelStorei(P.UNPACK_ROW_LENGTH,h.width),F.pixelStorei(P.UNPACK_IMAGE_HEIGHT,h.height),F.pixelStorei(P.UNPACK_SKIP_PIXELS,l),F.pixelStorei(P.UNPACK_SKIP_ROWS,u),F.pixelStorei(P.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=L.get(e),r=L.get(t),h=L.get(n.__renderTarget),g=L.get(r.__renderTarget);F.bindFramebuffer(P.READ_FRAMEBUFFER,h.__webglFramebuffer),F.bindFramebuffer(P.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,L.get(e).__webglTexture,i,d+n),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,L.get(t).__webglTexture,a,m+n)),P.blitFramebuffer(l,u,o,s,f,p,o,s,P.DEPTH_BUFFER_BIT,P.NEAREST);F.bindFramebuffer(P.READ_FRAMEBUFFER,null),F.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||L.has(e)){let n=L.get(e),r=L.get(t);F.bindFramebuffer(P.READ_FRAMEBUFFER,k),F.bindFramebuffer(P.DRAW_FRAMEBUFFER,A);for(let e=0;e<c;e++)w?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,n.__webglTexture,i),T?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,r.__webglTexture,a),i===0?T?P.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):P.copyTexSubImage2D(v,a,f,p,l,u,o,s):P.blitFramebuffer(l,u,o,s,f,p,o,s,P.COLOR_BUFFER_BIT,P.NEAREST);F.bindFramebuffer(P.READ_FRAMEBUFFER,null),F.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?P.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?P.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):P.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):P.texSubImage2D(P.TEXTURE_2D,a,f,p,o,s,g,_,h);F.pixelStorei(P.UNPACK_ROW_LENGTH,y),F.pixelStorei(P.UNPACK_IMAGE_HEIGHT,b),F.pixelStorei(P.UNPACK_SKIP_PIXELS,x),F.pixelStorei(P.UNPACK_SKIP_ROWS,S),F.pixelStorei(P.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&P.generateMipmap(v),F.unbindTexture()},this.initRenderTarget=function(e){L.get(e).__webglFramebuffer===void 0&&De.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?De.setTextureCube(e,0):e.isData3DTexture?De.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?De.setTexture2DArray(e,0):De.setTexture2D(e,0),F.unbindTexture()},this.resetState=function(){j=0,ee=0,M=null,F.reset(),Re.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return Qd}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=kf._getDrawingBufferColorSpace(e),t.unpackColorSpace=kf._getUnpackColorSpace()}},Zy=[`none`,`cast`,`block`,`plaster`,`tiles`,`glazed`,`flags`,`plate`,`mesh`,`rock`,`boards`,`shot`,`epoxy`,`vinyl`,`carpet`,`terrazzo`,`stone`],Qy=g.length+1,$y=new Map(g.map((e,t)=>[e,t+1])),eb=e=>e?$y.get(e):0,tb=e=>Zy.indexOf(e),nb=e=>`vec4[${Qy}](vec4(0.0), ${g.map(t=>`vec4(${e(h[t].look).map(e=>e.toFixed(4)).join(`, `)})`).join(`, `)})`,rb=`
attribute vec3 aCol; attribute float aMat; attribute vec2 aRoomY;
const vec4 LOOK_A[${Qy}] = ${nb(e=>[e.gloss,e.tight,e.metal,e.bump])};
const vec4 LOOK_B[${Qy}] = ${nb(e=>[tb(e.pattern),e.wear,e.salt,0])};
#if defined(STATIC)
attribute float aLight;
#elif defined(BAKED)
attribute vec4 aLight;
#else
uniform vec3 uLight;
#endif
varying vec3 vW; varying vec3 vO; varying vec3 vC; varying vec3 vL; varying vec4 vLA; varying vec4 vLB; varying vec2 vRY;
void main(){
  vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vO = position; vC = aCol;
  int k = int(aMat + 0.5); vLA = LOOK_A[k]; vLB = LOOK_B[k]; vRY = aRoomY;
#if defined(STATIC)
  vL = vec3(aLight, 0.0, 0.0);
#elif defined(BAKED)
  vL = aLight.rgb;
#else
  vL = uLight;
#endif
  gl_Position = projectionMatrix * viewMatrix * w;
}`,ib={fitting:2.4,most:3.2,dim:.72,bright:.92},ab={base:.76,slope:.6,relief:1.1,sheen:.5},ob=e=>e.toFixed(4),sb=e=>`vec3(${e.map(ob).join(`, `)})`,cb={fov:100,near:.05,far:30},lb={size:1024,fov:86},ub={caps:5,fix:2,dark:1.6,most:.8},db=`
uniform vec3 uFlashDir; uniform vec3 uFlashPos; uniform float uFlash; uniform float uLamp; uniform float uBounce;
uniform vec4 uBeam[2]; uniform vec3 uBeamDir[2]; uniform mat4 uBeamM[2];
uniform sampler2D uSh0; uniform sampler2D uSh1; uniform sampler2D uShH; uniform mat4 uHeldM;
float spot(float ca){
  float rim = (ca - ${ob(lr.rim)}) / ${ob(lr.rimW)};
  return 0.65 * smoothstep(${ob(lr.hot[0])}, ${ob(lr.hot[1])}, ca) + 0.42 * smoothstep(${ob(lr.spill[0])}, ${ob(lr.spill[1])}, ca) + 0.12 * exp(-rim * rim);
}
float unshadowed(sampler2D sm, mat4 M, vec3 p, float px);
vec3 held(vec3 p, float facing){
  if (uFlash <= 0.0) return vec3(0.0);
  vec3 v = p - uFlashPos; float d = length(v); vec3 L = v / max(d, 0.001);
  float s = spot(dot(L, uFlashDir));
  if (s <= 0.0) return vec3(0.0);
  /* (looked up a little toward the hand, so a surface does not shadow itself) */
  s *= unshadowed(uShH, uHeldM, p - L * 0.05, ${(1/lb.size).toFixed(7)});
  return uFlash * s * facing * ${ob(lr.gain)} / (1.0 + ${ob(lr.fall)} * d * d) * ${sb(lr.colour)};
}
vec3 bounce(vec3 p){
  vec3 tc = cameraPosition - p;
  return uBounce / (1.0 + ${ob(dr.fall)} * dot(tc, tc)) * ${sb(dr.colour)};
}
vec3 lantern(vec3 p, float facing){
  vec3 tc = cameraPosition - p;
  return uLamp * facing * ${ob(fr.gain)} / (1.0 + ${ob(fr.fall)} * dot(tc, tc)) * ${sb(fr.colour)};
}
vec3 carried(vec3 p, float facing){ return held(p, facing) + bounce(p) + lantern(p, facing); }
/* how much of a beam's light reaches p, by its shadow map (3 by 3 taps px apart, so the edge is soft) */
float unshadowed(sampler2D sm, mat4 M, vec3 p, float px){
  vec4 c = M * vec4(p, 1.0);
  if (c.w <= ${ob(cb.near)}) return 0.0;
  vec2 uv = c.xy / c.w * 0.5 + 0.5;
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return 0.0;
  float n = ${ob(cb.near)}, f = ${ob(cb.far)}, bias = 0.03 + 0.012 * c.w, lit = 0.0;
  for (int i = -1; i <= 1; i++)
    for (int j = -1; j <= 1; j++) {
      float z = textureLod(sm, uv + vec2(float(i), float(j)) * px, 0.0).r * 2.0 - 1.0;
      lit += c.w <= 2.0 * n * f / (f + n - z * (f - n)) + bias ? 1.0 : 0.0;
    }
  return lit / 9.0;
}
vec3 beamOn(vec3 p, vec3 n, vec4 B, vec3 dir, float seen){
  vec3 v = p - B.xyz; float d = length(v); vec3 L = v / max(d, 0.001);
  float facing = dot(n, n) > 0.0 ? 0.35 + 0.65 * abs(dot(n, L)) : 1.0;
  return B.w * seen * spot(dot(L, dir)) * facing * ${ob(lr.gain)} / (1.0 + ${ob(lr.fall)} * d * d) * ${sb(lr.colour)};
}
vec3 lying(vec3 p, vec3 n){
  vec3 q = p + n * 0.04, out3 = vec3(0.0);
  if (uBeam[0].w > 0.0) out3 += beamOn(p, n, uBeam[0], uBeamDir[0], unshadowed(uSh0, uBeamM[0], q, ${(1/512).toFixed(7)}));
  if (uBeam[1].w > 0.0) out3 += beamOn(p, n, uBeam[1], uBeamDir[1], unshadowed(uSh1, uBeamM[1], q, ${(1/512).toFixed(7)}));
  return out3;
}`,fb=`
uniform sampler2D uNoise;
/* smooth noise in three dimensions from one look-up: the noise texture's green is its red moved by (37, 17), which is
   the next layer up */
float n3(vec3 p){
  vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  vec2 uv = i.xy + vec2(37.0, 17.0) * i.z + f.xy;
  vec2 rg = texture2D(uNoise, (uv + 0.5) / 256.0).rg;
  return mix(rg.x, rg.y, f.z);
}
float hash(vec2 p){ vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
/* 1 on a line of a grid every per metres, w either side of it; 0 between */
float grid(float x, float per, float w){
  float d = abs(fract(x / per + 0.5) - 0.5) * per, fw = fwidth(x);
  float on = 1.0 - smoothstep(w - fw, w + fw, d);
  return mix(on, min(1.0, 2.0 * w / per), smoothstep(0.1, 0.45, fw / per));
}
/* 1 within r of a point of a lattice of dots, d from the nearest */
float dot1(float d, float r, float fw){ return (1.0 - smoothstep(r - fw, r + fw, d)) * (1.0 - smoothstep(r * 0.4, r * 1.2, fw)); }
void surface(int pat, vec3 p, vec3 n, float up, float det, out float alb, out float h, out float gm, out vec3 tint){
  alb = 1.0; h = 0.0; gm = 1.0; tint = vec3(1.0);
  vec3 an = abs(n);
  bool horiz = an.y > max(an.x, an.z);
  bool overhead = horiz && n.y < 0.0;
  /* across the face and up it: a floor or ceiling's are x and z; a wall's along it and up from the floor */
  vec2 uv = horiz ? p.xz : vec2(an.x > an.z ? p.z : p.x, up);
  float fw = fwidth(uv.x) + fwidth(uv.y), fine = 1.0 - smoothstep(0.006, 0.02, fw);
  if (pat == ${tb(`cast`)}) {
    float b = n3(p * 0.6), s = n3(p * 7.0), sp = n3(p * 31.0);
    alb = 1.0 + 0.18 * (b - 0.5) + 0.12 * (s - 0.5) * det + 0.08 * (sp - 0.5) * det;
    h = 0.006 * b + 0.0015 * s + 0.0004 * sp;
    if (!horiz || overhead) {
      /* the formwork it was poured in: boards 1.2 by 0.6 m up a wall, sheets 1.2 by 2.4 overhead, and a pair of tie
         holes in each */
      vec2 per = overhead ? vec2(1.2, 2.4) : vec2(1.2, 0.6);
      float seam = max(grid(uv.x, per.x, 0.003), grid(uv.y, per.y, 0.003));
      vec2 c = fract(uv / per) * per;
      float tie = dot1(min(length(c - per * vec2(0.25, 0.5)), length(c - per * vec2(0.75, 0.5))), 0.012, fw);
      alb *= (1.0 - 0.16 * seam) * (1.0 - 0.5 * tie);
      h -= 0.002 * seam + 0.008 * tie;
    }
  } else if (pat == ${tb(`block`)}) {
    /* block filled and painted smooth, as an institution paints it: no coursing (drawn, it read as brick), a roller's
       stipple, the paint a little uneven, and a control joint every 6 m */
    float m = n3(p * 0.7), st = mix(0.5, n3(p * 55.0), fine), j = grid(uv.x, 6.0, 0.004);
    alb = (1.0 + 0.05 * (m - 0.5) + 0.05 * (st - 0.5) * det) * (1.0 - 0.15 * j);
    h = 0.0003 * st - 0.002 * j;
    gm = 1.0 - 0.6 * j;
  } else if (pat == ${tb(`plaster`)}) {
    float b = n3(p * 1.1), pe = n3(p * 42.0);
    alb = 1.0 + 0.05 * (b - 0.5) + 0.03 * (pe - 0.5) * det;
    h = 0.0002 * pe;
  } else if (pat == ${tb(`tiles`)}) {
    /* a suspended ceiling's grid, a third of a 2 m tile each way, of painted T-bar; the tiles pitted mineral fibre */
    vec2 q = horiz ? p.xz : uv;
    float bar = max(grid(q.x, 2.0 / 3.0, 0.012), grid(q.y, 2.0 / 3.0, 0.012));
    float pits = smoothstep(0.7, 0.78, n3(p * 70.0)) * det, tone = hash(floor(q * 1.5));
    alb = mix(1.0 + 0.06 * (tone - 0.5) + 0.04 * (n3(p * 9.0) - 0.5) - 0.1 * pits, 1.12, bar);
    h = 0.004 * bar - 0.0006 * pits;
    gm = 1.0 + 5.0 * bar;
  } else if (pat == ${tb(`glazed`)}) {
    /* 150 mm tiles in grout; each laid a little out of true, so a highlight breaks across them */
    vec2 q = horiz ? p.xz : uv, cell = floor(q / 0.15), f = fract(q / 0.15) - 0.5;
    float g = max(grid(q.x, 0.15, 0.0025), grid(q.y, 0.15, 0.0025));
    float tone = hash(cell), tilt = hash(cell + 17.0);
    alb = (1.0 + 0.06 * (tone - 0.5)) * (1.0 - 0.35 * g);
    h = 0.0012 * ((tone - 0.5) * f.x + (tilt - 0.5) * f.y) - 0.002 * g;
    gm = 1.0 - 0.95 * g;
  } else if (pat == ${tb(`flags`)}) {
    /* the street: large square flags, joint to joint (laid half a flag along, small and contrasting, they read as a
       brick pavement), each a little different in tone */
    vec2 cell = floor(uv / 0.9);
    float j = max(grid(uv.x, 0.9, 0.003), grid(uv.y, 0.9, 0.003));
    float tone = hash(cell), grit = n3(p * 18.0);
    alb = (1.0 + 0.06 * (tone - 0.5) + 0.08 * (grit - 0.5) * det) * (1.0 - 0.2 * j);
    h = 0.0012 * grit - 0.003 * j;
  } else if (pat == ${tb(`mesh`)} && horiz) {
    /* bar grating, galvanised: bearing bars 5 mm thick on 30 mm centres along z, 30 mm deep, so looked at across them
       their sides close the gaps and it reads as a floor, and looked along them you see down through (drawn as a
       square grid of thin lines, the same from every side, it read as graph paper); twisted cross rods every 100 mm,
       flush with their tops; panels a metre wide, a banding bar at each edge, each a little different */
    vec3 v = normalize(cameraPosition - p);
    float tilt = 1.0 / max(abs(v.y), 0.05);
    float top = grid(p.x, 0.03, 0.0025);
    float bear = grid(p.x, 0.03, min(0.0025 + 0.015 * abs(v.x) * tilt, 0.015));
    /* (a rod is 6 mm proud of the slot's floor of shadow: looking along the slots at a slant, the rods close them) */
    float rod = grid(p.z, 0.1, min(0.0015 + 0.006 * abs(v.z) * tilt, 0.05));
    float band = grid(p.x, 1.0, 0.004);
    float pan = hash(vec2(floor(p.x), floor(p.z / 6.0))), grime = n3(p * 0.8);
    float solid = max(max(bear, 0.85 * rod), band);
    /* between the bars, the dim of what is under the walkway: not black */
    alb = mix(0.3, mix(0.62, 1.0, max(top, band)) * (1.0 + 0.1 * (pan - 0.5) + 0.14 * (grime - 0.5)), solid);
    h = 0.0015 * top + 0.003 * band;
    gm = max(top, band);
  } else if (pat == ${tb(`plate`)} || pat == ${tb(`mesh`)}) {
    /* steel plate in panels a metre across and 1.2 m high, seamed and riveted; brushed along its length */
    vec2 per = vec2(1.0, 1.2), c = fract(uv / per) * per;
    float seam = max(grid(uv.x, per.x, 0.002), grid(uv.y, per.y, 0.002));
    float ex = min(c.x, per.x - c.x), ey = min(c.y, per.y - c.y);
    float ax = abs(fract(uv.x / 0.15 + 0.5) - 0.5) * 0.15, ay = abs(fract(uv.y / 0.15 + 0.5) - 0.5) * 0.15;
    float riv = dot1(min(length(vec2(ex - 0.03, ay)), length(vec2(ey - 0.03, ax))), 0.007, fw);
    float brush = n3(vec3(uv.x * 2.0, uv.y * 70.0, 3.1)), stain = n3(p * 0.4);
    alb = (1.0 + 0.1 * (brush - 0.5) * det + 0.24 * (stain - 0.5)) * (1.0 - 0.3 * seam) * (1.0 + 0.15 * riv);
    h = -0.002 * seam + 0.003 * riv + 0.0001 * brush;
    gm = 0.7 + 0.6 * brush;
  } else if (pat == ${tb(`rock`)}) {
    float a = n3(p * 0.9), b = n3(p * 3.1), c = n3(p * 11.0);
    float strata = 0.5 + 0.5 * sin(p.y * 6.0 + a * 5.0);
    alb = 0.88 + 0.5 * (0.5 * a + 0.33 * b + 0.17 * c * det - 0.5) + 0.07 * strata;
    h = 0.09 * a + 0.025 * b + 0.004 * c * det;
    /* where it is wet, it shines */
    gm = 0.4 + 6.0 * smoothstep(0.6, 0.78, n3(p * 0.35 + 9.0));
  } else if (pat == ${tb(`boards`)}) {
    /* planks 120 mm wide, across the face; grain along them */
    vec2 q = horiz ? p.xz : vec2(an.x > an.z ? p.z : p.x, p.y);
    float k = floor(q.y / 0.12), gap = grid(q.y, 0.12, 0.003);
    float tone = hash(vec2(k, 7.0)), grain = n3(vec3(q.x * 1.5, q.y * 60.0, k * 3.0));
    alb = (1.0 + 0.2 * (tone - 0.5) + 0.14 * (grain - 0.5) * det) * (1.0 - 0.5 * gap);
    h = -0.003 * gap + 0.0003 * grain;
  } else if (pat == ${tb(`shot`)}) {
    /* sprayed over blasted rock: lumps the size of the rock's own under the spray's grain, and no seams */
    float a = n3(p * 0.7), b = n3(p * 2.3), g = n3(p * 23.0), sp = n3(p * 61.0);
    alb = 0.94 + 0.2 * (a - 0.5) + 0.12 * (b - 0.5) + (0.1 * (g - 0.5) + 0.06 * (sp - 0.5) * fine) * det;
    h = 0.07 * a + 0.025 * b + (0.002 * g + 0.0004 * sp * fine) * det;
    if (!horiz || overhead) {
      /* the rock bolts: a plate 150 mm square every 1.5 m, rows staggered, sprayed over with the rest, so it shows as a
         raised square and the nut through it; under one in four on a wall, a faint stain of rust run down from it */
      float row = floor(uv.y / 1.5);
      vec2 q = vec2(uv.x + 0.75 * mod(row, 2.0), uv.y), cell = floor(q / 1.5), c = fract(q / 1.5) * 1.5 - 0.75;
      float edge = 1.0 - smoothstep(0.02, 0.08, fw);
      float plate = (1.0 - smoothstep(0.075 - fw, 0.075 + fw, max(abs(c.x), abs(c.y)))) * edge + 0.01 * (1.0 - edge);
      float nut = dot1(length(c), 0.022, fw);
      float tear = overhead ? 0.0 : step(0.75, hash(cell + 3.0)) * (1.0 - smoothstep(0.02, 0.07, abs(c.x)))
        * smoothstep(-0.5, -0.1, c.y) * (1.0 - smoothstep(-0.09, -0.07, c.y)) * edge;
      alb *= 1.0 - 0.15 * nut;
      h += 0.004 * plate + 0.006 * nut;
      gm = mix(gm, 3.0, nut);
      tint = mix(mix(vec3(1.0), vec3(1.0, 0.9, 0.8), nut), vec3(1.2, 0.9, 0.7), 0.45 * tear);
    }
  } else if (pat == ${tb(`epoxy`)}) {
    /* a coated slab: the coat smooth and a little uneven in tone, saw cuts between 4 m bays, scuffs where wheels and
       feet went, which take the shine off it */
    float m = n3(p * 0.45), cut = max(grid(uv.x, 4.0, 0.003), grid(uv.y, 4.0, 0.003));
    float scuff = smoothstep(0.6, 0.8, n3(vec3(uv.x * 1.5, uv.y * 9.0, 7.7))) * smoothstep(0.45, 0.7, n3(p * 0.3 + 3.0));
    alb = (1.0 + 0.08 * (m - 0.5) - 0.14 * scuff * det) * (1.0 - 0.45 * cut);
    h = -0.003 * cut;
    gm = (1.0 - 0.6 * scuff) * (1.0 - cut);
  } else if (pat == ${tb(`vinyl`)}) {
    /* sheet vinyl: flecked dark and light, the seams welded every 2 m along the roll */
    float f1 = mix(0.12, smoothstep(0.68, 0.74, n3(p * 140.0)), fine), f2 = mix(0.1, smoothstep(0.7, 0.76, n3(p * 110.0 + 5.0)), fine);
    float seam = grid(uv.x, 2.0, 0.0015), m = n3(p * 0.6);
    alb = 1.0 + 0.05 * (m - 0.5) + (0.12 * f2 - 0.14 * f1) * det - 0.15 * seam;
    h = -0.0005 * seam;
    gm = 1.0 - 0.4 * seam;
  } else if (pat == ${tb(`carpet`)}) {
    /* carpet tile, 500 mm, each laid a quarter turn from the next, so the pile takes the light one way or the other;
       worn paler where the feet went */
    vec2 cell = floor(uv / 0.5);
    float turn = mod(cell.x + cell.y, 2.0);
    float pile = n3(turn > 0.5 ? vec3(uv.x * 200.0, uv.y * 60.0, 1.0) : vec3(uv.x * 60.0, uv.y * 200.0, 1.0));
    float j = max(grid(uv.x, 0.5, 0.001), grid(uv.y, 0.5, 0.001)), worn = n3(p * 0.7);
    alb = (1.0 + 0.04 * (turn - 0.5) + 0.14 * (pile - 0.5) * fine * det + 0.08 * (worn - 0.5)) * (1.0 - 0.1 * j);
    h = 0.0008 * pile * fine - 0.001 * j;
    gm = 0.0;
  } else if (pat == ${tb(`terrazzo`)}) {
    /* marble chips in cement, ground flat and polished: dark, pale and a few rust-red ones, an inch or so across, so
       they read further off than the finer specks elsewhere; brass strips between bays 1.5 m square */
    float big = 1.0 - smoothstep(0.012, 0.04, fw);
    float c1 = mix(0.08, smoothstep(0.7, 0.74, n3(p * 34.0)), big), c2 = mix(0.12, smoothstep(0.66, 0.7, n3(p * 27.0 + 11.0)), big);
    float c3 = mix(0.03, smoothstep(0.77, 0.81, n3(p * 40.0 + 23.0)), big), grain = n3(p * 90.0);
    float strip = max(grid(uv.x, 1.5, 0.0015), grid(uv.y, 1.5, 0.0015)), m = n3(p * 0.5);
    alb = mix((1.0 + 0.06 * (m - 0.5) + 0.06 * (grain - 0.5) * fine) * (1.0 - 0.3 * c1) * (1.0 + 0.14 * c2), 1.04, strip);
    tint = mix(mix(vec3(1.0), vec3(1.18, 0.9, 0.76), c3), vec3(1.15, 1.03, 0.8), strip);
    h = 0.0002 * (c2 - c1) * big + 0.0004 * strip;
    gm = 1.0 + 1.5 * strip;
  } else if (pat == ${tb(`stone`)}) {
    /* honed limestone hung as cladding: panels 1.5 m long and 0.75 high stacked joint over joint (set half a panel
       along, as masonry is, it reads as brick), hairline joints; its bedding planes, and pits where a fossil fell out */
    float row = floor(uv.y / 0.75), x = uv.x;
    float j = max(grid(uv.y, 0.75, 0.001), grid(x, 1.5, 0.001));
    float tone = hash(vec2(floor(x / 1.5), row)), bed = n3(vec3(x * 1.5, uv.y * 14.0, tone * 40.0));
    float pit = smoothstep(0.73, 0.78, n3(p * 45.0)) * fine;
    alb = (1.0 + 0.06 * (tone - 0.5) + 0.08 * (bed - 0.5) * det - 0.12 * pit) * (1.0 - 0.1 * j);
    h = -0.001 * j - 0.0004 * pit;
    gm = 1.0 - 0.9 * j;
  }
}
/* the facing n tipped by a height h over the surface, from how both change across the screen (Mikkelsen's bump
   mapping of unparametrised surfaces) */
vec3 bumped(vec3 n, vec3 w, float h){
  vec3 dx = dFdx(w), dy = dFdy(w), r1 = cross(dy, n), r2 = cross(n, dx);
  float det = dot(dx, r1);
  vec3 g = sign(det) * (dFdx(h) * r1 + dFdy(h) * r2);
  return normalize(abs(det) * n - g);
}`,pb=`
#ifdef STATIC
uniform sampler2D uLA; uniform sampler2D uLD; uniform highp sampler3D uLI; uniform vec3 uLO; uniform vec3 uLN; uniform int uLW;
/* the level's light at p, on a surface facing n (toward the eye); in fl the part of it that flickers, and in dl which way
   it comes from (as long as the share of it that comes from one way); found, false where no open point is near */
vec3 fieldAt(vec3 p, vec3 n, out vec3 fl, out vec3 dl, out bool found){
  fl = vec3(0.0); dl = vec3(0.0); found = false;
  vec3 f = (p + n * 0.2 - ${ob(Un)}) / ${ob(Hn)}, b = floor(f), t = f - b;
  vec3 bk = floor(b / ${Wn}.0), ix = bk - uLO;
  if (any(lessThan(ix, vec3(0.0))) || any(greaterThanEqual(ix, uLN))) return vec3(0.0);
  float slot = texelFetch(uLI, ivec3(ix), 0).r;
  if (slot < 0.0) return vec3(0.0);
  ivec3 l = ivec3(b - bk * ${Wn}.0);
  int base = int(slot) * ${(Wn+1)**3};
  vec4 S[8]; vec3 D[8]; float W[8]; int best = -1;
  for (int c = 0; c < 8; c++) {
    ivec3 o = ivec3(c & 1, (c >> 1) & 1, c >> 2), q = l + o;
    int i = base + (q.z * ${Wn+1} + q.y) * ${Wn+1} + q.x;
    S[c] = texelFetch(uLA, ivec2(i % uLW, i / uLW), 0);
    D[c] = texelFetch(uLD, ivec2(i % uLW, i / uLW), 0).rgb * 2.0 - 1.0;
    vec3 w3 = mix(1.0 - t, t, vec3(o));
    /* a point behind the surface counts for little: the far side of a wall it stands on */
    vec3 cp = (b + vec3(o)) * ${ob(Hn)} + ${ob(Un)};
    W[c] = w3.x * w3.y * w3.z * (dot(cp - p, n) > -0.05 ? 1.0 : 0.03);
    if (S[c].a > 0.0 && (best < 0 || W[c] > W[best])) best = c;
  }
  if (best < 0) return vec3(0.0);
  found = true;
  /* only the points joined to the nearest open one */
  int reach = 1 << best;
  for (int pass = 0; pass < 3; pass++)
    for (int a = 0; a < 3; a++)
      for (int c = 0; c < 8; c++) {
        if ((c & (1 << a)) != 0) continue;
        int d = c | (1 << a);
        int bits = int(S[c].a * 255.0 + 0.5);
        if (((reach >> c) & 1) != ((reach >> d) & 1) && (bits & (2 << a)) != 0) reach |= (1 << c) | (1 << d);
      }
  vec3 acc = vec3(0.0), accF = vec3(0.0), accD = vec3(0.0); float sw = 0.0, sl = 0.0;
  for (int c = 0; c < 8; c++) {
    if (((reach >> c) & 1) == 0) continue;
    vec3 l = W[c] * S[c].rgb * S[c].rgb;
    float lm = dot(l, vec3(0.3, 0.59, 0.11));
    acc += l; accF += l * float(int(S[c].a * 255.0 + 0.5) >> 4) / 15.0; sw += W[c];
    accD += lm * D[c]; sl += lm;
  }
  dl = sl > 1e-7 ? accD / sl : vec3(0.0);
  fl = accF / max(sw, 1e-5) * ${ob(4)};
  return acc / max(sw, 1e-5) * ${ob(4)};
}
/* the same, at p on a surface a pixel wide px metres there. A pixel on a face's edge is shaded where its middle would
   be on that face, though only part of it is (the scene is smoothed at its edges: post.ts); past the edge, that can be
   inside what the face meets, with nothing open about it: a floor seen far off, along the foot of a wall. Unlit, such
   pixels made a line of black specks that crawled as you moved. There, it is looked up again from that far nearer the
   eye, which is in the open; and failing that (a rough cave roof), a lattice step nearer again */
vec3 field(vec3 p, vec3 n, float px, out vec3 fl, out vec3 dl){
  vec3 V = normalize(cameraPosition - p), l = vec3(0.0);
  bool found = false;
  for (int k = 0; k < 3 && !found; k++) l = fieldAt(p + V * (k == 0 ? 0.0 : px + (k == 1 ? 0.1 : 0.6)), n, fl, dl, found);
  return l;
}
uniform vec4 uSelfA[${ub.caps}]; uniform vec4 uSelfB[${ub.caps}]; uniform vec4 uFix[${ub.fix}]; uniform vec3 uSelfLo; uniform vec3 uSelfHi;
/* how much of a capsule (a to b, radius r) stands between p and a light dl away along l: soft, its edge wider and its
   middle fainter the further p is behind it, and gone past 7 m */
float capsule(vec3 p, vec3 l, float dl, vec3 a, vec3 b, float r){
  vec3 ba = b - a, pa = p - a;
  float bb = max(dot(ba, ba), 1e-6), lb = dot(l, ba), lp = dot(l, pa), bp = dot(ba, pa);
  float s = clamp((bp - lp * lb) / max(bb - lb * lb, 1e-6), 0.0, 1.0);
  float t = clamp(s * lb - lp, 0.0, dl);
  if (t < 0.02 || t > dl - 0.05) return 0.0;
  s = clamp(dot(pa + t * l, ba) / bb, 0.0, 1.0);
  float d = length(pa + t * l - s * ba), w = 0.03 + 0.45 * t / max(dl - t, 0.25);
  return (1.0 - smoothstep(r - 0.5 * w, r + 0.5 * w, d)) * min(1.0, 2.0 * r / w) * (1.0 - smoothstep(4.0, 7.0, t));
}
/* how much of the level's light at p (facing n) your body leaves: each fitting's share of it, as the field reckons a
   fitting's pool (POOL in world/lightField.ts), less what the body hides of that fitting; drawn SELF.dark darker */
float selfShade(vec3 p, vec3 n){
  if (uFix[0].w <= 0.0 || any(lessThan(p, uSelfLo)) || any(greaterThan(p, uSelfHi))) return 1.0;
  vec3 q = p + n * 0.02;
  float sum = 0.0, cut = 0.0;
  for (int j = 0; j < ${ub.fix}; j++) {
    vec4 F = uFix[j];
    vec3 L = F.xyz - q; float dl = length(L);
    if (F.w <= 0.0 || L.y <= 0.0) continue;
    float c = L.y / dl, v = F.w * c * c * c * ${ob(Kn.r2)} / (${ob(Kn.r2)} + dl * dl), occ = 0.0;
    for (int k = 0; k < ${ub.caps}; k++) occ = max(occ, capsule(q, L / dl, dl, uSelfA[k].xyz, uSelfB[k].xyz, uSelfA[k].w));
    sum += v; cut += v * occ;
  }
  if (sum <= 0.0) return 1.0;
  float pool = ${ob(Kn.gain)} * min(sum, 1.0);
  return 1.0 - min(${ob(ub.most)}, ${ob(ub.dark)} * pool / (${ob(Kn.base)} + pool) * cut / sum);
}
#endif
${db}
uniform float uFog; uniform float uWet;
uniform float uFlick; uniform float uHit; uniform float uBright; uniform float uDetail;
#if !defined(STATIC) && !defined(BAKED)
uniform vec3 uLightF; uniform vec3 uLightD;
#endif
varying vec3 vW; varying vec3 vO; varying vec3 vC; varying vec3 vL; varying vec4 vLA; varying vec4 vLB; varying vec2 vRY;
${fb}
/* how much of the level's light a surface takes, facing nf (nb with its bumps): of what comes from every way, as before
   (sh, and rel for a bump facing up); of what comes from one way (dl, as long as its share), by how it faces that way */
float takes(vec3 nf, vec3 nb, vec3 dl, float sh, float rel){
  float a = min(length(dl), 1.0);
  if (a < 1e-3) return sh * rel;
  vec3 u = dl / a;
  float g = ${ob(ab.base)} + ${ob(ab.slope)} * dot(nf, u), r = clamp(1.0 + ${ob(ab.relief)} * dot(nb - nf, u), 0.5, 1.5);
  return mix(sh * rel, g * r, a);
}
void main(){
  vec3 n = normalize(cross(dFdx(vW), dFdy(vW)));
  vec3 tc = cameraPosition - vW; float d = length(tc); vec3 Ld = tc / max(d, 0.001);
  vec3 nf = dot(n, Ld) < 0.0 ? -n : n;
  vec3 base = vC; float em = 0.0;
  if (base.r > 1.5) { base -= 2.0; em = 1.0; }
  /* what it is made of: the level's drawn where it is in the world, a moving thing's in its own frame */
  int pat = int(vLB.x + 0.5);
  float alb = 1.0, h = 0.0, gm = 1.0, det = 1.0 - smoothstep(9.0, 26.0, d);
  vec3 tint = vec3(1.0);
  bool walls = vRY.y > vRY.x, on = uDetail > 0.5;
  if (on && pat > 0 && em == 0.0) {
#ifdef STATIC
    surface(pat, vW, nf, walls ? vW.y - vRY.x : vW.y, det, alb, h, gm, tint);
#else
    vec3 no = normalize(cross(dFdx(vO), dFdy(vO)));
    surface(pat, vO, no, vO.y, det, alb, h, gm, tint);
#endif
  }
  /* wear, on the level's walls and ceilings: grime at the foot of a wall; in places, water run down from the
     ceiling, fading as it goes: on bare cement the white salts it leached out (vLB.z), on paint and tile a brown
     tide mark; blotches overhead */
  if (on && vLB.y > 0.0 && walls && em == 0.0) {
    float k = vLB.y;
    if (abs(nf.y) < 0.5) {
      float g = (1.0 - smoothstep(0.0, 0.45, vW.y - vRY.x)) * (0.45 + 0.9 * n3(vW * 1.7));
      float along = abs(nf.x) > abs(nf.z) ? vW.z : vW.x;
      float run = smoothstep(0.58, 0.78, n3(vW * 0.21 + 5.0)) * smoothstep(0.45, 0.8, n3(vec3(along * 9.0, vW.y * 0.5, 1.7))) * exp(-(vRY.y - vW.y) / 1.4);
      alb *= 1.0 - 0.3 * k * g;
      vec3 left = vLB.z > 0.5 ? min(base * vec3(1.6, 1.6, 1.55) + 0.06, vec3(0.82, 0.81, 0.78)) : base * vec3(0.74, 0.66, 0.52);
      base = mix(base, left, 0.7 * k * run);
      gm *= 1.0 - 0.6 * g;
    } else if (nf.y < 0.0) alb *= 1.0 - 0.12 * k * smoothstep(0.6, 0.85, n3(vW * 0.5 + 2.0));
  }
  base *= alb * tint;
  vec3 nb = on && vLA.w > 0.0 && det > 0.0 ? bumped(nf, vW, h * vLA.w * det) : nf;
  float sh = 0.55 + 0.45 * (abs(nb.y) * 0.95 + abs(nb.x) * 0.7 + abs(nb.z) * 0.5);
  /* the carried lights' facing, from your hand; the room's light comes from above, so a bump facing up takes more of it */
  vec3 Lf = normalize(uFlashPos - vW);
  float facing = on ? 0.35 + 0.65 * max(dot(nb, Lf), 0.0) : 0.35 + 0.65 * abs(dot(n, Ld));
  float rel = clamp(1.0 + 1.1 * (nb.y - nf.y), 0.5, 1.5);
  /* the level's light here, and which way it comes from */
  vec3 lvl = vec3(0.0), dl = vec3(0.0);
#if defined(STATIC)
  float px = length(fwidth(vW));
  vec3 fl, lv = field(vW, nf, px, fl, dl);
  lvl = (lv - fl * 0.55 * uFlick) * (vL.x > 1.0 ? vL.x * ${ob(ib.fitting)} : vL.x) * selfShade(vW, nf);
  vec3 light = lvl * takes(nf, nb, dl, sh, rel);
#elif defined(BAKED)
  vec3 light = vL * sh;
#else
  lvl = vL - uLightF * 0.55 * uFlick; dl = uLightD;
  vec3 light = lvl * takes(nf, nb, dl, sh, rel);
#endif
  light += vec3(0.014) / (1.0 + 3.0 * d * d) + carried(vW, facing) + lying(vW, nf) + vec3(uBright);
  /* a light that is lit is brighter than white, the brightest the most */
  float top = max(base.r, max(base.g, base.b));
  vec3 c = mix(base * light, max(base, vec3(0.0)) * (1.0 + ${ob(ib.most-1)} * smoothstep(${ob(ib.dim)}, ${ob(ib.bright)}, top)), em);
  /* the highlight, of the flashlight and the lantern you carry, and a sheen from the level's light where it comes from
     one way: tight and tinted on metal, broad and white on paint */
  if (on && vLA.x > 0.0 && em == 0.0) {
    float tight = vLA.y, norm = (tight + 8.0) / 32.0, a = min(length(dl), 1.0);
    float sb = pow(max(dot(nb, normalize(Lf + Ld)), 0.0), tight), sl = pow(max(dot(nb, Ld), 0.0), tight);
    float sf = a > 1e-3 ? pow(max(dot(nb, normalize(dl / a + Ld)), 0.0), tight) * a * ${ob(ab.sheen)} : 0.0;
    vec3 tint = mix(vec3(1.0), base * 2.2, vLA.z);
    c += tint * vLA.x * gm * norm * (held(vW, 1.0) * sb + lantern(vW, 1.0) * sl + lvl * sf);
  }
  c += uHit * vec3(0.45, 0.08, 0.06);
  c *= exp(-d * uFog);
  c = max(mix(c, c * vec3(0.5, 0.85, 0.9), uWet), vec3(0.0));
#ifdef ALPHA
  gl_FragColor = vec4(c, ALPHA);
#else
  gl_FragColor = vec4(c, 1.0);
#endif
}`;function mb(){let e=new Uint8Array(65536),t=new Uint8Array(262144),n=625341585;for(let t=0;t<e.length;t++)n^=n<<13,n^=n>>>17,n^=n<<5,e[t]=n>>>0&255;for(let n=0;n<256;n++)for(let r=0;r<256;r++){let i=(n*256+r)*4;t[i]=e[n*256+r],t[i+1]=e[(n+17)%256*256+(r+37)%256],t[i+3]=255}let r=new Ym(t,256,256,qu);return r.wrapS=r.wrapT=Cu,r.magFilter=r.minFilter=ku,r.generateMipmaps=!1,r.needsUpdate=!0,r}var Z={uFlashDir:{value:new Y(0,0,-1)},uFlashPos:{value:new Y},uDetail:{value:1},uFlash:{value:0},uLamp:{value:0},uFog:{value:.02},uWet:{value:0},uTime:{value:0},uFlick:{value:0},uBright:{value:0},uBounce:{value:0},uExpo:{value:1},uBeam:{value:Array.from({length:2},()=>new Bf)},uBeamDir:{value:Array.from({length:2},()=>new Y(0,0,-1))},uBeamM:{value:Array.from({length:2},()=>new Gf)},uSh0:{value:null},uSh1:{value:null},uShH:{value:null},uHeldM:{value:new Gf},uSelfA:{value:Array.from({length:ub.caps},()=>new Bf)},uSelfB:{value:Array.from({length:ub.caps},()=>new Bf)},uFix:{value:Array.from({length:ub.fix},()=>new Bf)},uSelfLo:{value:new Y},uSelfHi:{value:new Y},uLA:{value:null},uLD:{value:null},uLI:{value:null},uLO:{value:new Y},uLN:{value:new Y},uLW:{value:2048},uNoise:{value:mb()}},hb={aMat:[0],aRoomY:[0,0]};function gb(e){let t=new Ih({vertexShader:rb,fragmentShader:pb,side:2,...e});return t.defaultAttributeValues={...t.defaultAttributeValues,...hb},t}function _b(){return new Ih({vertexShader:`void main(){ vec4 w = modelMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:`void main(){ gl_FragColor = vec4(0.0); }`,side:2,colorWrite:!1,polygonOffset:!0,polygonOffsetFactor:1,polygonOffsetUnits:1})}function vb(){return gb({uniforms:{...Z,uHit:{value:0}},defines:{STATIC:``}})}function yb(e){return gb({uniforms:{...Z,uHit:{value:0}},defines:{BAKED:``,ALPHA:e.toFixed(3)},transparent:!0,depthWrite:!1})}function bb(e){let t={...Z,uHit:{value:0},uLight:{value:new Y},uLightF:{value:new Y},uLightD:{value:new Y}};return gb(e===void 0?{uniforms:t}:{uniforms:t,defines:{ALPHA:e.toFixed(3)},transparent:!0,depthWrite:!1})}function xb(){let{uFlashDir:e,uFlashPos:t,uFlash:n,uLamp:r,uBounce:i,uBeam:a,uBeamDir:o,uBeamM:s,uSh0:c,uSh1:l,uShH:u,uHeldM:d}=Z;return{uFlashDir:e,uFlashPos:t,uFlash:n,uLamp:r,uBounce:i,uBeam:a,uBeamDir:o,uBeamM:s,uSh0:c,uSh1:l,uShH:u,uHeldM:d}}var Sb=[0,0,0];function Cb(e,t,n,r=Sb){e.uniforms.uLight.value.set(t[0],t[1],t[2]),e.uniforms.uLightF.value.set(n[0],n[1],n[2]),e.uniforms.uLightD.value.set(r[0],r[1],r[2])}function wb(e){Z.uDetail.value=+!!e}function Tb(){let e=[[-.5,-.5,-.5],[.5,-.5,-.5],[.5,.5,-.5],[-.5,.5,-.5],[-.5,-.5,.5],[.5,-.5,.5],[.5,.5,.5],[-.5,.5,.5]],t=[[0,1,2,3],[5,4,7,6],[4,0,3,7],[1,5,6,2],[3,2,6,7],[4,5,1,0]],n=[];for(let r of t)for(let t of[0,1,2,0,2,3])n.push(...e[r[t]]);return new Float32Array(n)}function Eb(){let e=(1+Math.sqrt(5))/2,t=.5/Math.hypot(1,e),n=[[-1,e,0],[1,e,0],[-1,-e,0],[1,-e,0],[0,-1,e],[0,1,e],[0,-1,-e],[0,1,-e],[e,0,-1],[e,0,1],[-e,0,-1],[-e,0,1]].map(e=>e.map(e=>e*t)),r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],i=[];for(let e of r)i.push(...n[e]);return new Float32Array(i)}function Db(e=6){let t=[],n=Math.PI*2;for(let r=0;r<e;r++){let i=r/e*n,a=(r+1)/e*n,o=Math.cos(i)*.5,s=Math.sin(i)*.5,c=Math.cos(a)*.5,l=Math.sin(a)*.5;t.push(o,-.5,s,c,-.5,l,c,.5,l,o,-.5,s,c,.5,l,o,.5,s,0,.5,0,o,.5,s,c,.5,l,0,-.5,0,c,-.5,l,o,-.5,s)}return new Float32Array(t)}var Ob={box:Tb(),ico:Eb(),cyl:Db()},kb={across:16,up:8},Ab=class{rooms;constructor(e){this.rooms=e}P=[];C=[];room=[];m=[];M=[];RY=[];pw=[];vert(e,t,n,r,i){this.P.push(e,t,n),this.C.push(r[0],r[1],r[2]),this.room.push(i.room),this.m.push(i.m);let a=i.room>=0?this.rooms[i.room]:null;this.M.push(i.mat),this.RY.push(a?a.y0:0,a?a.y0+a.ht:0)}rect(e,t,n,r,i,a,o,s,c,l=0){let u=(n,r)=>e===0?[t,n,r]:e===1?[n,t,r]:[n,r,t],d=[u(n,i),u(r,i),u(r,a),u(n,a)];for(let e of[0,1,2,0,2,3])this.vert(d[e][0],d[e][1],d[e][2],o,{room:s,m:c,mat:l})}get count(){return this.P.length/3}},jb=class{o;pieces;services;piece;at;cols;touched=new Set;constructor(e,t){this.o=e;let n=Mb(e);this.pieces=n.geometries,this.piece=n.piece,this.at=n.at,this.cols=this.pieces.map(e=>e.getAttribute(`aCol`).array),this.services=Mb(t).geometries}relight(e){for(let[t,n,r,i]of this.o.pw)this.fitting(e,t,n,r,i);this.send()}relightRooms(e,t){let n=this.o;this.pwByRoom||(this.pwByRoom=new Map,n.pw.forEach((e,t)=>{let r=n.room[e[0]],i=this.pwByRoom.get(r);i||this.pwByRoom.set(r,i=[]),i.push(t)}));for(let r of t)for(let t of this.pwByRoom.get(r)??[]){let[r,i,a,o]=n.pw[t];this.fitting(e,r,i,a,o)}this.send()}pwByRoom=null;fitting(e,t,n,r,i){let a=e.fittingIn(r,i,this.o.room[t]);for(let e=t;e<t+n;e++){let t=this.piece[e];this.cols[t].set(a,this.at[e]*3),this.touched.add(t)}}send(){for(let e of this.touched)this.pieces[e].getAttribute(`aCol`).needsUpdate=!0;this.touched.clear()}};function Mb(e){let t=e.count,n=e.P,r=new Int32Array(t),i=new Int32Array(t),a=new Map,o=[];for(let e=0;e<t;e+=3){let t=(n[e*3]+n[e*3+3]+n[e*3+6])/3,s=(n[e*3+1]+n[e*3+4]+n[e*3+7])/3,c=(n[e*3+2]+n[e*3+5]+n[e*3+8])/3,l=((Math.floor(t/kb.across)+512)*1024+(Math.floor(s/kb.up)+512))*1024+(Math.floor(c/kb.across)+512),u=a.get(l);u===void 0&&a.set(l,u=o.push(0)-1);for(let t=0;t<3;t++)r[e+t]=u,i[e+t]=o[u]++}let s=o.map(e=>({P:new Float32Array(e*3),C:new Float32Array(e*3),m:new Float32Array(e),M:new Float32Array(e),RY:new Float32Array(e*2)}));for(let a=0;a<t;a++){let t=s[r[a]],o=i[a];for(let r=0;r<3;r++)t.P[o*3+r]=n[a*3+r],t.C[o*3+r]=e.C[a*3+r];t.m[o]=e.m[a],t.M[o]=e.M[a],t.RY[o*2]=e.RY[a*2],t.RY[o*2+1]=e.RY[a*2+1]}return{geometries:s.map(e=>{let t=new Sm;return t.setAttribute(`position`,new sm(e.P,3)),t.setAttribute(`aCol`,new sm(e.C,3)),t.setAttribute(`aLight`,new sm(e.m,1)),t.setAttribute(`aMat`,new sm(e.M,1)),t.setAttribute(`aRoomY`,new sm(e.RY,2)),t.computeBoundingSphere(),t}),piece:r,at:i}}function Nb(e,t,n){let r=[e,...n.filter(n=>n>e+1e-6&&n<t-1e-6).sort((e,t)=>e-t),t],i=[];for(let e=0;e<r.length-1;e++)i.push([r[e],r[e+1]]);return i}function Pb(e,t){let n=e.grid,r=new Ab(e.rooms),i=new Ab(e.rooms),a=(e,t,n,i,a,o,s,c,l,u)=>r.rect(e,t,n,i,a,o,c,s,l,u),o=(t,n,r,i,a,o)=>{let s=t?`floor`:`ceiling`;return e.surfaces.some(e=>{let c=e.def;if(c.kind!==s||c.hidden||r<c.x0-.001||i>c.x1+.001||a<c.z0-.001||o>c.z1+.001)return!1;let l=Math.max(1,Math.ceil((i-r)/.5)),u=Math.max(1,Math.ceil((o-a)/.5));for(let s=0;s<=l;s++)for(let c=0;c<=u;c++){let d=Math.min(Math.max(r+(i-r)*s/l,r+.01),i-.01),f=Math.min(Math.max(a+(o-a)*c/u,a+.01),o-.01);if(!e.has(d,f))return!1;let p=e.heightAt(d,f);if(t?p<n-.002:p>n+.002)return!1}return!0})},s=(t,n,r,i,s,c,u,d,f)=>{let p=e.rooms[u];if(t===1&&o(f,n,r,i,s,c))return;if(d>=0){a(t,n,r,i,s,c,u,e.blocks[d].colour,1,eb(e.blocks[d].mat));return}if(t===1){let e=eb(p.mat.floor);f?a(t,n,r,i,s,c,u,p.floor,1,e):p.sky?a(t,n,r,i,s,c,u,p.sky,1.5,0):a(t,n,r,i,s,c,u,l(p.wall,.6),.8,eb(p.mat.ceiling));return}let m=t===0,[h,g]=m?[r,i]:[s,c],[_,v]=m?[s,c]:[r,i],y=p.y0,b=eb(p.mat.wall),x=!p.plain&&!p.doorway&&p.mat.wall===`block`,S=p.mat.upper?y+(p.mat.datum??4):1/0;for(let[e,r]of Nb(h,g,[y+3.2,...x?[y+.9,y+1.05]:[],...p.mat.upper?[S]:[]])){let i=e>=y+3.2-1e-6,o=!x||i?2:r<=y+.9+1e-6?0:r<=y+1.05+1e-6?1:2,s=o===0?l(p.wall,.78):o===1?p.stripe:p.wall,c=e>=S-1e-6?eb(p.mat.upper):b;m?a(t,n,e,r,_,v,u,s,i?.6:1,c):a(t,n,_,v,e,r,u,s,i?.6:1,c)}},c=new Int32Array(256),u=[1,16,256];n.forEachChunk((e,t,r)=>{let i=[e*16,t*16,r*16],a=n.chunkCells(e,t,r),o=a[0]>=0,l=!1;for(let e=1;e<a.length;e++)if(a[e]>=0!==o){l=!0;break}for(let o=0;o<3;o++){let d=+(o===0),f=o===2?1:2,p=u[d],m=u[f],h=u[o],g=[e,t,r],_=[e,t,r];g[o]--,_[o]++;let v=n.chunkCells(g[0],g[1],g[2]),y=n.hasChunk(_[0],_[1],_[2])?15:16;for(let e=0;e<=y;e++){if(!l&&e>0&&e<16)continue;let t=i[o]+e;for(let t=0;t<16;t++)for(let n=0;n<16;n++){let r=n*p+t*m,i=e>0?a[r+(e-1)*h]:v?v[r+15*h]:-1,o=e<16?a[r+e*h]:-1,s=0;if(i>=0!=o>=0){let e=i>=0?i:o,t=i>=0?o:i,n=+(o>=0);s=((-1-t)*4096+e)*2+n+1}c[t*16+n]=s}for(let e=0;e<16;e++)for(let n=0;n<16;){let r=c[e*16+n];if(!r){n++;continue}let a=1;for(;n+a<16&&c[e*16+n+a]===r;)a++;let l=1;grow:for(;e+l<16;){for(let t=0;t<a;t++)if(c[(e+l)*16+n+t]!==r)break grow;l++}for(let t=0;t<l;t++)for(let r=0;r<a;r++)c[(e+t)*16+n+r]=0;let u=r-1,p=u&1,m=u>>1&4095,h=Math.floor((u>>1)/4096)-1,g=i[d]+n,_=i[f]+e;s(o,t*U,g*U,(g+a)*U,_*U,(_+l)*U,m,h,p===1),n+=a}}}});for(let t of e.surfaces)t.def.hidden||Lb(r,e,t);e.def.props.forEach((t,n)=>{if(t.loose||t.mat===`glass`)return;let a=e.roomAt(t.x,t.y+.05,t.z)??e.roomAt(t.x,t.y+t.sy/2,t.z),o={room:a?a.id:-1,m:t.glow,mat:eb(t.mat)},s=t.services?i:r,c=s.count,l=t.flush?0:Ib(n);Fb({...t,sx:t.sx+2*l,sy:t.sy+2*l,sz:t.sz+2*l,y:t.y-l},(e,n,r)=>s.vert(e,n,r,t.colour,o)),t.pw&&s.pw.push([c,s.count-c,t.pw,t.pc??e.def.circuit])});let d=new jb(r,i);return d.relight(t),d}function Fb(e,t,n){let r=Ob[e.shape],i=n?n.x:e.x,a=n?n.y:e.y,o=n?n.z:e.z,s=Math.cos(e.ry),c=Math.sin(e.ry),l=Math.cos(e.rz),u=Math.sin(e.rz),d=a+e.sy/2*(e.shape===`ico`?C:1);for(let n=0;n<r.length;n+=3){let a=r[n]*e.sx,f=r[n+1]*e.sy,p=r[n+2]*e.sz;if(e.rz){let e=a*l-f*u;f=a*u+f*l,a=e}let m=a*s+p*c;p=-a*c+p*s,a=m,t(i+a,d+f,o+p)}}var Ib=e=>.001*(1+e%7);function Lb(e,t,n){let r=n.def,i=r.kind===`floor`,a=r.res,o=e=>r.x0+e*a,s=e=>r.z0+e*a,c=(e,t)=>r.h[t*r.nx+e],u=eb(r.mat),d=(e,n,r,a)=>{let o=t.roomAt(e,n+(i?.3:-.3),r);return{room:o?o.id:-1,m:a,mat:u}},f=i?1:.8;for(let t=0;t<r.nz-1;t++)for(let n=0;n<r.nx-1;n++){if(r.mask&&!r.mask[t*(r.nx-1)+n])continue;let i=o(n),a=o(n+1),l=s(t),u=s(t+1),p=c(n,t),m=c(n+1,t),h=c(n+1,t+1),g=c(n,t+1),_=d((i+a)/2,(p+h)/2,(l+u)/2,f),v=[[i,p,l],[a,m,l],[a,h,u],[i,g,u]];for(let t of[0,1,2,0,2,3])e.vert(v[t][0],v[t][1],v[t][2],r.colour,_)}if(!r.sides)return;let p=t=>{for(let n=0;n<t.length-1;n++){let[i,a,o]=t[n],[s,c,u]=t[n+1],f=d((i+s)/2,r.base+.1,(o+u)/2,1),p=l(r.colour,.85),m=[[i,r.base,o],[s,r.base,u],[s,c,u],[i,a,o]];for(let t of[0,1,2,0,2,3])e.vert(m[t][0],m[t][1],m[t][2],p,f)}};p(Array.from({length:r.nx},(e,t)=>[o(t),c(t,0),s(0)])),p(Array.from({length:r.nx},(e,t)=>[o(t),c(t,r.nz-1),s(r.nz-1)])),p(Array.from({length:r.nz},(e,t)=>[o(0),c(0,t),s(t)])),p(Array.from({length:r.nz},(e,t)=>[o(r.nx-1),c(r.nx-1,t),s(t)]))}var Rb={plate:{h:.24,retro:2.2,cut:!1},clinic:{h:.26,retro:1.2,cut:!1},bronze:{h:.26,retro:.9,cut:!0},stencil:{h:.26,retro:0,cut:!0}},zb=420;function Bb(e){return e===`stone`?`bronze`:e===`shot`||e===`concrete`||e===`rock`?`stencil`:e===`glazed`?`clinic`:`plate`}var Vb=e=>`rgb(${e.map(e=>Math.round(Math.min(1,e)*255)).join(`,`)})`,Hb=`"Barlow Condensed","Arial Narrow",Arial,sans-serif`,Ub=`Newsreader,Georgia,serif`;function Wb(e,t,n,r,i){let a=Rb[n],o=Math.round(a.h*zb),s=e.getContext(`2d`),c=t.toUpperCase(),l=n===`bronze`?`500 ${Math.round(o*.72)}px ${Ub}`:n===`stencil`?`600 ${Math.round(o*.72)}px ${Hb}`:`600 ${Math.round(o*.56)}px ${Hb}`;s.font=l,n===`stencil`&&(s.letterSpacing=`${Math.round(o*.08)}px`),n===`bronze`&&(s.letterSpacing=`${Math.round(o*.06)}px`);let u=n===`plate`?o*.75:n===`clinic`?o*.55:o*.1,d=Math.ceil(s.measureText(c).width),f=Math.min(Math.round(1.9*zb),Math.ceil(d+2*u));e.width=f,e.height=o,s.clearRect(0,0,f,o),s.font=l,s.textAlign=`center`,s.textBaseline=`middle`,n===`stencil`&&(s.letterSpacing=`${Math.round(o*.08)}px`),n===`bronze`&&(s.letterSpacing=`${Math.round(o*.06)}px`);let p=f/2+(n===`plate`?o*.12:0),m=f-2*u;if(n===`plate`)s.fillStyle=Vb([.1,.11,.12]),s.fillRect(0,0,f,o),s.fillStyle=Vb(r),s.fillRect(o*.18,o*.2,o*.12,o*.6),s.fillStyle=Vb([.86,.84,.78]),s.fillText(c,p,o*.53,m);else if(n===`clinic`)s.fillStyle=Vb([.82,.84,.82]),s.fillRect(0,0,f,o),s.fillStyle=Vb(r),s.fillRect(0,o*.8,f,o*.2),s.fillStyle=Vb([.12,.13,.14]),s.fillText(c,p,o*.42,m);else if(n===`bronze`)s.fillStyle=Vb([.24,.16,.08]),s.fillText(c,p,o*.55,m);else{s.fillStyle=Vb([.74,.68,.46]),s.fillText(c,p,o*.54,m);let e=i*9301+49297,t=()=>(e=(e*9301+49297)%233280)/233280;s.globalCompositeOperation=`destination-out`;for(let e=0;e<f*o/90;e++){let e=t()*f,n=t()*o,r=.5+t()*1.8*(.5+n/o);s.globalAlpha=.4+t()*.6,s.beginPath(),s.arc(e,n,r,0,6.283),s.fill()}s.globalAlpha=1,s.globalCompositeOperation=`source-over`}return f/zb}var Gb=`
varying vec2 vUv; varying vec3 vW;
void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,Kb=`
uniform sampler2D uMap; uniform vec3 uL; uniform vec3 uN; uniform float uRetro; uniform float uCut;
uniform float uFog; uniform float uBright;
varying vec2 vUv; varying vec3 vW;
${db}
void main(){
  vec4 t = texture2D(uMap, vUv);
  if (uCut > 0.5 && t.a < 0.5) discard;
  vec3 base = t.rgb / max(t.a, 0.001);
  vec3 tc = cameraPosition - vW; float d = length(tc);
  float facing = 0.35 + 0.65 * max(dot(uN, tc / max(d, 0.001)), 0.0);
  vec3 c = base * (uL + carried(vW, facing) + lying(vW, uN) + vec3(uBright));
  /* what is pale on it sends your beam straight back at you */
  c += base * uRetro * dot(base, vec3(0.3, 0.59, 0.11)) * held(vW, 1.0);
  c *= exp(-d * uFog);
  gl_FragColor = vec4(c, 1.0);
}`,qb=class{hung=[];constructor(e,t,n){t.def.signs.forEach((n,r)=>this.hang(e,t,n,r)),document.fonts?.ready.then(()=>{for(let e of this.hung)e.draw()}),this.setLighting(n)}hang(e,t,n,r){let i=Math.sin(n.yaw),a=Math.cos(n.yaw),o=t.roomAt(n.x+i*.5,n.y-1,n.z+a*.5),s=Bb(o?.mat.wall),c=Rb[s],l=e=>{let t=new Sh(e);return t.colorSpace=``,t.anisotropy=4,t.premultiplyAlpha=!0,t},u=new Ih({vertexShader:Gb,fragmentShader:Kb,uniforms:{...xb(),uFog:Z.uFog,uBright:Z.uBright,uMap:{value:null},uL:{value:new Y},uN:{value:new Y(i,0,a)},uRetro:{value:c.retro},uCut:{value:+!!c.cut}}}),d=new Km(new Dh(1,c.h),u),f=c.cut?-.02:0;d.position.set(n.x+i*f,n.y,n.z+a*f),d.rotation.y=n.yaw;let p=o?o.stripe:[.5,.5,.5],m=()=>{let e=document.createElement(`canvas`);d.scale.x=Wb(e,n.text,s,p,r+1),u.uniforms.uMap.value?.dispose(),u.uniforms.uMap.value=l(e)};m(),e.add(d),this.hung.push({mat:u,at:[n.x+i*.3,n.y-.4,n.z+a*.3],draw:m})}setLighting(e){for(let t of this.hung)t.mat.uniforms.uL.value.set(...e.atPoint(...t.at))}};function Jb(e,t){return t&&e.setAttribute(`aMat`,new sm(new Float32Array(e.getAttribute(`position`).count).fill(t),1)),e}function Yb(e,t=0){let n=[],r=[];e.forEach(([e,t,i,a,o,s,l,u,d],f)=>{let p=Ob[e],m=c(t),h=Math.cos(d??0),g=Math.sin(d??0),_=2*Ib(f);for(let e=0;e<p.length;e+=3){let t=p[e]*(i+_),c=p[e+1]*(a+_);n.push(t*h-c*g+s,t*g+c*h+l,p[e+2]*(o+_)+u),r.push(m[0],m[1],m[2])}});let i=new Sm;return i.setAttribute(`position`,new sm(new Float32Array(n),3)),i.setAttribute(`aCol`,new sm(new Float32Array(r),3)),Jb(i,t)}var Xb=[2.3,2.9,2.4];function Zb(e,t,n,r,i,a,o,s,c,l,u){let d=s-l/2,f=s+l/2,p=c-u/2,m=c+u/2;return[[`box`,e,d+t/2,n,r,i+(d-t/2)/2,a,o],[`box`,e,t/2-f,n,r,i+(f+t/2)/2,a,o],[`box`,e,l,p+n/2,r,i+s,a+(p-n/2)/2,o],[`box`,e,l,n/2-m,r,i+s,a+(m+n/2)/2,o]]}var Qb=[.55,.66,.7];function $b(e){let t=e.side??1,n=e.look,r=[],i=[],a=[],o=(e,t=1)=>{r.push({body:e,f:t})},s=(e,t=1)=>{r.push({body:e,mat:`steel`,f:t})},c=-t,l=[.13,.16,.18];if(n===`shutter`){let e=[[`box`,6711916,2,2.4,.07,0,0,0]];for(let t=-1.08;t<1.15;t+=.12)e.push([`box`,5593435,2,.025,.09,0,t,0]);e.push([`box`,2763822,2,.07,.11,0,-1.165,0],[`box`,9080464,.24,.05,.13,0,-.95,0]),s(e)}else if(n===`heavy`){r.push({body:[...Zb(e.lift?5857384:3883078,2,2.4,.3,0,0,0,c*.5,.35,.26,.26),[`box`,2764081,.14,2.4,.36,0,0,0]],mat:`steel`,f:1,glass:[[`box`,Qb,.26,.26,.04,c*.5,.35,0]]});let t=[];for(let e of[-1,1])t.push([`box`,12098350,1.9,.16,.02,0,-.95,e*.16],[`box`,12098350,1.9,.16,.02,0,.95,e*.16]);o(t)}else if(n===`steel`||n===`office`){let t=n===`office`,i=Math.max(e.x1-e.x0,e.z1-e.z0),a=2/i,u=i/2,[d,f,p,m]=t?[c*(u-.3)*a,.2,.14*a,1.3]:[c*(u-.4)*a,.32,.24*a,.62];r.push({body:Zb(t?8019006:5923176,2,2.4,.08,0,0,0,d,f,p,m),f:1,glass:[[`box`,Qb,p,m,.02,d,f,0]]}),t||o([[`box`,l,.006,m,.03,d,f,0],[`box`,l,p,.006,.03,d,f,0]]),s([[`box`,10133154,.05*a,t?.05:.4,.14,c*(u-.12)*a,-.15,0],...t?[]:[[`box`,9080466,1.92,.22,.086,0,-1.07,0]]])}else{let e=n===`grand`,i=e?3810840:12765122,a=e?9071162:10133668;for(let[n,l,u]of[[!1,1,-.035],[!0,.5,.035]]){let d=(n?t:-t)*.5;e?(o([[`box`,i,1,2.4,.06,d,0,u]],l),s([[`box`,a,.05,2.4,.064,d-.475,0,u],[`box`,a,.05,2.4,.064,d+.475,0,u],[`box`,a,1,.05,.064,d,1.175,u],[`box`,a,1,.22,.064,d,-1.09,u],[`box`,a,.04,1.2,.1,d+c*.36,.05,u]],l)):(r.push({body:Zb(i,1,2.4,.06,d,0,u,0,.38,.36,.48),f:l,glass:[[`box`,Qb,.36,.48,.02,d,.38,u]]}),s([[`box`,a,.98,.18,.066,d,-.3,u],[`box`,a,.98,.2,.066,d,-1.08,u]],l))}}e.seal&&o([[`box`,2763822,1.5,.1,.4,0,-.1,0],[`box`,2763822,1.5,.1,.4,0,.6,0]]);let u=Math.max(e.x1-e.x0,e.z1-e.z0),d=2/u,f=t*(u/2+.32)*d,p=(e.depth??2)/2+.02;for(let t of[-p,p]){if(e.card&&(i.push([`box`,2237994,.12*d,.18,.04,f,-.05,t]),a.push([`box`,[2.25,2.45,2.85],.08*d,.04,.05,f,.01,t])),e.code){i.push([`box`,2237994,.16*d,.24,.04,f,-.05,t]);for(let e=0;e<9;e++)a.push([`box`,[2.5,2.6,2.5],.028*d,.028,.05,f+(-.045+e%3*.045)*d,-.12+Math.floor(e/3)*.055,t])}n===`heavy`&&a.push([`box`,Xb,.1*d,.1,.04,f,.35,t])}return{leaves:r,fixed:i,lights:a}}function ex(e){let t=e.kind===`heavy`,n=[],r=[];if(t){n.push([`box`,e.lift?5857384:3883078,2,2.4,.3,0,0,0],[`box`,2764081,.14,2.4,.36,0,0,0]);for(let e of[-1,1])n.push([`box`,12098350,1.9,.16,.02,0,-.95,e*.16],[`box`,12098350,1.9,.16,.02,0,.95,e*.16]),r.push([`box`,Xb,.12,.12,.04,-.72,.05,e*.17])}else n.push([`box`,e.seal?4540492:6712435,2,2.4,.1,0,0,0],[`box`,1382427,.5,.3,.12,0,.5,0],[`box`,4869973,2,.1,.14,0,-1.1,0]);if(e.seal)for(let e of[-1,1])n.push([`box`,2763822,1.5,.1,.06,0,-.1,e*.1]);let i=t?.17:.07;if(e.card)for(let e of[-1,1])n.push([`box`,2237994,.16,.24,.04,.72,.1,e*i]),r.push([`box`,[2.25,2.45,2.85],.1,.05,.05,.72,.16,e*(i+.01)]);if(e.code)for(let e of[-1,1]){n.push([`box`,2237994,.18,.26,.04,.72,.1,e*i]);for(let t=0;t<9;t++)r.push([`box`,[2.5,2.6,2.5],.03,.03,.05,.67+t%3*.05,.03+Math.floor(t/3)*.06,e*(i+.005)])}return{body:n,lights:r}}var tx=[[`box`,12106944,.17,.17,.36,0,0,-.2],[`box`,1382427,.12,.12,.03,0,0,0],[`box`,2895667,.05,.4,.05,0,.28,-.3],[`box`,2895667,.14,.04,.14,0,.48,-.3]];function nx(e,t){let n=[[`box`,4869973,e-.12,.16,t-.12,0,-.08,0],[`box`,12098350,e-.12,.02,.12,0,.01,t/2-.14],[`box`,12098350,e-.12,.02,.12,0,.01,-t/2+.14],[`box`,2895667,.2,1.1,.2,0,.55,0],[`box`,Xb,.1,.1,.22,0,1.05,0]];for(let r of[-1,1])for(let i of[-1,1])n.push([`box`,9075242,.08,1.1,.08,r*(e/2-.14),.55,i*(t/2-.14)]);return n}function rx(e,t,n=0){let r=new Sm,i=e.length/3,a=new Float32Array(i*3);for(let e=0;e<i;e++)a.set(t,e*3);return r.setAttribute(`position`,new sm(e,3)),r.setAttribute(`aCol`,new sm(a,3)),Jb(r,n)}var ix=class{scene;sim;L;list=[];signs;setLighting(e){this.L=e,this.signs?.setLighting(e)}constructor(e,t,n){this.scene=e,this.sim=t,this.L=n;let r=t.world;for(let e of t.doors){if(e.def.glass){this.pane(e.def);continue}let t=e.def,n=Math.max(t.x1-t.x0,t.z1-t.z0),r=t.kind===`heavy`?2:1,i=[(t.x0+t.x1)/2,t.y0,(t.z0+t.z1)/2],a=t.alongX?[0,.6]:[.6,0],o=t.alongX?0:Math.PI/2,s=(r,a=1)=>{if(t.slides){let o=(t.side??1)*(n-.02)*e.t*a;r.position.set(i[0]+(t.alongX?o:0),t.y0+1.2,i[2]+(t.alongX?0:o))}else r.position.set((e.dyn.x0+e.dyn.x1)/2,e.dyn.y0+1.2,(e.dyn.z0+e.dyn.z1)/2);r.rotation.y=o,r.scale.set(n/2,1,1),t.vent&&(r.visible=e.t<.5)},c=e=>{e.position.set(i[0],t.y0+1.2,i[2]),e.rotation.y=o,e.scale.set(n/2,1,1)},l=()=>this.L.power(t.circuit)>=r&&!t.vent;if(t.look){let{leaves:e,fixed:n,lights:r}=$b(t);for(let t of e)this.add(Yb(t.body,eb(t.mat)),e=>s(e,t.f),i,a),t.glass&&this.add(Yb(t.glass,eb(`glass`)),e=>{s(e,t.f),e.renderOrder=1},i,a,.2);n.length&&this.add(Yb(n),c,i,a),r.length&&this.add(Yb(r),e=>{c(e),e.visible=l()},i,a)}else{let{body:e,lights:n}=ex(t);this.add(Yb(e,eb(t.mat)),e=>s(e),i,a),n.length&&this.add(Yb(n),e=>{s(e),e.visible=l()},i,a)}if(t.card){let r=t=>n=>{n.visible=e.beep>0&&e.beepOk===t&&l()};for(let[e,o]of[[[.3,2.8,.5],!0],[[2.9,.3,.25],!1]])if(t.look){let s=2/n,l=(t.side??1)*(n/2+.32)*s,u=(t.depth??2)/2+.03;this.add(Yb([-1,1].map(t=>[`box`,e,.085*s,.045,.05,l,.01,t*u])),e=>{c(e),r(o)(e)},i,a)}else{let n=t.kind===`heavy`?.17:.07;this.add(Yb([-1,1].map(t=>[`box`,e,.105,.055,.05,.72,.16,t*(n+.02)])),e=>{s(e),r(o)(e)},i,a)}}if(!(t.seal||t.vent||t.lift||t.stuck)){let r=2/n,o=(t.side??1)*(n/2+.32)*r,s=(t.depth??2)/2+.03;this.add(Yb([-1,1].map(e=>[`box`,[2.9,.35,.3],.14*r,.14,.05,o,.75,e*s])),t=>{c(t),t.visible=e.down||e.drawing>0&&Math.floor(performance.now()/150)%2==0},i,a)}}for(let e of t.platforms){let t=e.def;this.add(Yb(nx(t.x1-t.x0,t.z1-t.z0),eb(t.mat)),n=>n.position.set((t.x0+t.x1)/2,e.y,(t.z0+t.z1)/2))}for(let e of t.cams){let n=e.def,r=()=>jl(t,e),i=t=>{t.position.set(n.x,n.y,n.z),t.rotation.set(e.broken?.7:0,n.yaw,e.broken?.4:0)};this.add(Yb(tx),i),this.add(Yb([[`box`,[.4,2.6,.7],.045,.045,.045,0,.1,0]]),t=>{i(t),t.visible=e.guard&&r()&&e.hold===0}),this.add(Yb([[`box`,[2.9,.35,.3],.05,.05,.05,0,.1,0]]),t=>{i(t),t.visible=e.guard&&r()&&e.hold>0})}r.def.uses.forEach((e,n)=>{if(e.kind!==`call`)return;let r=e.opts.face,i=r===`e`||r===`w`,a=r===`e`||r===`s`?-1:1,o=t.usables.find(e=>e.key===`use`+n);this.add(Yb([[`box`,[.75,.82,.86],i?.01:.13,.13,i?.13:.01,0,0,0]]),t=>{t.position.set(e.x+(i?a*.12:0),e.y-.03,e.z+(i?0:a*.12)),t.visible=!o?.off})});for(let e of r.def.speakers??[]){let n=Ol(r,e),i=()=>!kl(t,e.zone),a=[e.x,n-1,e.z];this.add(Yb([[`box`,2895667,.5,.12,.5,0,-.06,0]]),t=>t.position.set(e.x,n,e.z),a),this.add(Yb([[`cyl`,3816768,.34,.22,.34,0,-.23,0]]),t=>{t.position.set(e.x,n-(i()?.12:0),e.z),t.rotation.set(i()?.9:0,0,i()?.3:0)},a),this.add(Yb([[`box`,[2.9,1.6,.3],.16,.12,.16,0,-.4,0]]),r=>{r.position.set(e.x,n,e.z),r.visible=Al(t,e.zone)&&t.alarms.some(t=>t.zone===e.zone)&&Math.floor(performance.now()/300)%2==0})}this.signs=new qb(e,r,n),this.setLighting(n),t.loose.all.forEach((e,t)=>{let n=[],r=Ib(t),i=e.prop;Fb({...i,ry:0,sx:i.sx+2*r,sy:i.sy+2*r,sz:i.sz+2*r},(e,t,r)=>n.push(e,t,r),{x:0,y:-r,z:0}),this.add(rx(new Float32Array(n),e.prop.colour,eb(e.prop.mat)),t=>t.position.set(e.x,e.y,e.z))});for(let e of r.def.notes)e.bare||this.addFixed(Yb(E(`note`)),e.x,e.y,e.z,k(e));this.glazing(r),this.water(r)}items=0;itemMeshes=[];syncItems(){for(;this.items<this.sim.items.length;this.items++){let e=this.sim.items[this.items],t=O(e),n=this.addFixed(Yb(E(e.id)),e.x,e.y,e.z,t);if(this.itemMeshes.push({mesh:n,shown:()=>!e.taken}),e.id===`flash`){let n=this.addFixed(Yb(T),e.x,e.y,e.z,t);this.itemMeshes.push({mesh:n,shown:()=>!e.taken&&!!e.on})}}for(let e of this.itemMeshes)e.mesh.visible=e.shown()}addFixed(e,t,n,r,i){let a=bb(),o=new Km(e,a);return o.position.set(t,n,r),o.rotation.y=i,this.scene.add(o),this.list.push({mesh:o,mat:a,place:()=>{}}),o}add(e,t,n,r,i){let a=bb(i),o=new Km(e,a);this.scene.add(o),this.list.push({mesh:o,mat:a,place:()=>t(o),litAt:n,across:r})}pane(e){let t=e.y1-e.y0,n=Math.max(e.x1-e.x0,e.z1-e.z0),r=e.y0+t/2,i=(e.x0+e.x1)/2,a=(e.z0+e.z1)/2,o=this.L.atPoint(i,r,a),s=e.alongX?0:Math.PI/2,c=Yb([[`box`,[.55,.66,.7],n,t,.03,0,0,0]],eb(e.mat)),l=c.getAttribute(`position`).count,u=new Float32Array(l*4);for(let e=0;e<l;e++)u.set([.02+o[0],.025+o[1],.03+o[2],0],e*4);c.setAttribute(`aLight`,new sm(u,4));let d=new Km(c,yb(.18));d.position.set(i,r,a),d.rotation.y=s,d.frustumCulled=!1,d.renderOrder=1,this.scene.add(d);let f=n/2-.04,p=t/2,m=[[`box`,2763822,n,.08,.12,0,p,0],[`box`,2763822,n,.08,.12,0,-p,0],[`box`,2763822,.08,t,.12,-f,0,0],[`box`,2763822,.08,t,.12,f,0,0]];this.add(Yb(m),e=>{e.position.set(i,r,a),e.rotation.y=s},[i,e.y0,a])}glazing(e){let t=[],n=[],r=[],i=[],a=eb(`glass`);for(let o of e.def.props){if(o.mat!==`glass`)continue;let e=this.L.atPoint(o.x,o.y+o.sy/2,o.z),s=t.length/3;Fb(o,(e,n,r)=>t.push(e,n,r));for(let c=s;c<t.length/3;c++)n.push(...o.colour),r.push(.02+e[0],.025+e[1],.03+e[2],0),i.push(a)}if(!t.length)return;let o=new Sm;o.setAttribute(`position`,new sm(new Float32Array(t),3)),o.setAttribute(`aCol`,new sm(new Float32Array(n),3)),o.setAttribute(`aLight`,new sm(new Float32Array(r),4)),o.setAttribute(`aMat`,new sm(new Float32Array(i),1));let s=new Km(o,yb(.18));s.frustumCulled=!1,s.renderOrder=1,this.scene.add(s)}water(e){if(!e.water.length)return;let t=[],n=[],r=[],i=[.07,.13,.14];for(let a of e.water){let e=this.L.atPoint((a.x0+a.x1)/2,a.level+.1,(a.z0+a.z1)/2);for(let[o,s]of[[a.x0,a.z0],[a.x1,a.z0],[a.x1,a.z1],[a.x0,a.z0],[a.x1,a.z1],[a.x0,a.z1]])t.push(o,a.level,s),n.push(...i),r.push(e[0],e[1],e[2],0)}let a=new Sm;a.setAttribute(`position`,new sm(new Float32Array(t),3)),a.setAttribute(`aCol`,new sm(new Float32Array(n),3)),a.setAttribute(`aLight`,new sm(new Float32Array(r),4));let o=new Km(a,yb(.78));o.frustumCulled=!1,o.renderOrder=1,this.scene.add(o)}update(){this.syncItems();let e=this.L;for(let t of this.list){t.place();let n=t.litAt?{x:t.litAt[0],y:t.litAt[1],z:t.litAt[2]}:t.mesh.position,r=this.sim.world,i=t.lit;if(i&&i.L===e&&i.epoch===e.epoch&&i.x===n.x&&i.y===n.y&&i.z===n.z)continue;t.lit={L:e,epoch:e.epoch,x:n.x,y:n.y,z:n.z};let a=r.roomAt(n.x,n.y+.3,n.z)??r.roomAt(n.x,n.y+1.2,n.z),o=[n.x,n.y+.3,n.z],s=a?this.L.atPoint(...o):[0,0,0];if(a&&t.across)for(let e of[-1,1]){let r=[n.x+e*t.across[0],n.y+.3,n.z+e*t.across[1]],i=this.L.atPoint(...r);Math.max(...i)>Math.max(...s)&&(s=i,o=r)}Cb(t.mat,s,a?this.L.flickAt(...o):[0,0,0],a?this.L.towards(...o):[0,0,0])}}},ax=11883548,ox=9059860,sx=11568498,cx=1841690,lx=2760988,ux=.44,dx=.43,fx=.08,px=.5,mx=.175,hx=.16,gx=(e,t)=>t?1.3:e?2.3:1.7;function _x(e,t,n,r,i){let a=.08*t+.22*e,o=vo+(yo-vo)*e-mx-px*Math.cos(a)-.08*t*(1-e),s=r/4*.8*t,c=.12*t*(1-.5*e);return{hip:o,lean:a,feet:[0,1].map(e=>{let t=((n/(2*Math.PI)+e/2)%1+1)%1,r,a;if(t<.5)r=s*(1-4*t),a=0;else{let e=(t-.5)*2,n=e*e*(3-2*e);r=-s+2*s*n,a=c*Math.sin(Math.PI*e)}return[r+i*(e?.05:.18),a+i*(e?.1:.22)]})}}function vx(e,t){let n=Math.min(Math.hypot(e,t),.8699),r=e=>Math.min(1,Math.max(-1,e)),i=Math.PI-Math.acos(r((ux**2+dx**2-n*n)/(2*ux*dx)));return{thigh:Math.atan2(e,t)+Math.acos(r((ux**2+n*n-dx**2)/(2*ux*n))),knee:i}}function yx(e,t,n,r,i,a=ub.fix){let o=e.world.roomAt(n,r+.5,i),s=o&&t.fixtures.get(o.id);return!o||!s||Math.max(...t.room(o.id))<.02?{room:o,near:[]}:{room:o,near:[...s].sort((e,t)=>Math.hypot(e.x-n,e.z-i)-Math.hypot(t.x-n,t.z-i)).slice(0,a)}}function bx(e,t,n,r){let i=new yp;return i.position.set(t,n,r),e.add(i),i}var xx=class{sim;L;root=new vp;mat=bb();hips;torso;head;legs=[];arms=[];ends=[];walking=0;ph=0;air=0;v=new Y;constructor(e,t,n){this.sim=t,this.L=n;let r=this.mat,i=(e,t,n=!1)=>{let i=new Km(Yb(t),r);return i.frustumCulled=!1,n&&i.layers.set(1),e.add(i),i};this.hips=bx(this.root,0,1,0),i(this.hips,[[`box`,ax,.36,.16,.22,0,-.02,0]]);for(let e of[1,-1]){let t=bx(this.hips,e*.1,0,0),n=bx(t,0,-.44,0),r=bx(n,0,-.43,0);i(t,[[`box`,ax,.15,.48,.16,0,-.44/2,0]]),i(n,[[`box`,ax,.13,dx,.14,0,-.43/2,0],[`box`,ox,.135,.03,.145,0,-.36,0]]),i(r,[[`box`,cx,.12,.1,.27,0,-.08/2,-.06]]),this.legs.push({thigh:t,shin:n,foot:r})}this.torso=bx(this.hips,0,0,0),i(this.torso,[[`box`,ax,.4,.46,.23,0,px/2,0],[`box`,ox,.025,.4,.235,0,px/2,0],[`box`,ox,.41,.05,.24,0,.1,0]]),this.head=bx(this.torso,0,px,.01),i(this.head,[[`box`,sx,.09,.1,.09,0,.04,0],[`ico`,sx,.21,.25,.23,0,.19,0],[`ico`,lx,.22,.13,.23,0,.27,.02]],!0);for(let e of[1,-1]){let t=bx(this.torso,e*.25,.44,0),n=bx(t,0,-.3,0);i(t,[[`box`,ax,.11,.32,.12,0,-.15,0]],!0),i(n,[[`box`,ax,.1,.24,.1,0,-.12,0],[`box`,sx,.08,.11,.1,0,-.29,0]],!0),this.arms.push({up:t,fore:n})}let a=(e,t,n,r)=>[e,new Y(t,n,r)];this.ends=[{a:a(this.hips,0,.08,0),b:a(this.head,0,.16,0),r:.17},...this.legs.map(e=>({a:a(e.thigh,0,-.04,0),b:a(e.foot,0,-.02,-.06),r:.075})),...this.arms.map(e=>({a:a(e.up,0,-.02,0),b:a(e.fore,0,-.3,0),r:.055}))],e.add(this.root)}setLighting(e){this.L=e}update(e,t,n){let r=this.sim,i=r.player,a=i.body,o=Math.min(1,Math.max(0,(vo-t)/(vo-yo))),s=i.water!==`dry`,c=i.water===`swimming`,l=gx(i.running,s),u=2*Math.PI*(i.stepD/l)-this.ph;u-=2*Math.PI*Math.round(u/(2*Math.PI)),this.ph+=u*Math.min(1,n*20);let d=+(i.moved>1e-4&&!i.fly);this.walking+=(d-this.walking)*Math.min(1,n*(d?8:5)),this.air+=((a.ground||s||i.fly?0:1)-this.air)*Math.min(1,n*8);let f=_x(o,this.walking,c?r.tick*.05:this.ph,l,this.air),p=Math.min(1,Math.max(0,(-e.pitch-.4)/1)),m=hx+px*Math.sin(f.lean)+.14*p,h=-Math.sin(e.yaw),g=-Math.cos(e.yaw);this.root.position.set(e.x-h*m,e.y,e.z-g*m),this.root.rotation.set(0,e.yaw,0);let _=this.walking*(1-o)*.025*Math.abs(Math.cos(this.ph));this.hips.position.y=f.hip-_,this.torso.rotation.x=-f.lean,this.head.rotation.x=e.pitch*.8+f.lean,f.feet.forEach(([e,t],n)=>{let r=this.legs[n],{thigh:i,knee:a}=vx(e,f.hip-_-fx-t);r.thigh.rotation.x=i,r.shin.rotation.x=-a,r.foot.rotation.x=a-i});let[v,y]=this.arms;v.up.rotation.set(1.05+e.pitch*.6+f.lean,0,.12),v.fore.rotation.x=.45;let b=Math.sin(this.ph)*.35*this.walking;y.up.rotation.set(b+o*.5+f.lean*.5,0,-.08),y.fore.rotation.x=.25+o*.3,Cb(this.mat,this.L.atPoint(a.x,a.y+1,a.z),this.L.flickAt(a.x,a.y+1,a.z),this.L.towards(a.x,a.y+1,a.z)),this.shadow(e)}shadow(e){this.root.updateMatrixWorld(!0);let t=Z.uSelfA.value,n=Z.uSelfB.value,r=this.v;this.ends.forEach((e,i)=>{r.copy(e.a[1]),e.a[0].localToWorld(r),t[i].set(r.x,r.y,r.z,e.r),r.copy(e.b[1]),e.b[0].localToWorld(r),n[i].set(r.x,r.y,r.z,0)});let{room:i,near:a}=yx(this.sim,this.L,e.x,e.y,e.z);Z.uFix.value.forEach((e,t)=>{let n=a[t];n?e.set(n.x,n.y-.1,n.z,1):e.set(0,0,0,0)}),i&&(Z.uSelfLo.value.set(i.x0-.05,i.y0-.05,i.z0-.05),Z.uSelfHi.value.set(i.x1+.05,i.y0+i.ht+.05,i.z1+.05))}},Sx=11568498,Cx=9194052,wx=5117462,Tx=13483950,Ex=14538432,Dx=1313805,Ox=11883548,kx=[4155962,5208640,3103284,5929530,6982212,2771500],Ax=new Map;function jx(e,t,n,r,i){let a=`${e}|${t}|${n}|${r}|${i}`,o=Ax.get(a);return o||Ax.set(a,o=Yb([[e,t,n,r,i,0,0,0]])),o}function Q(e,t,n,r,i,a,o,s,c,l){let u=new Km(jx(n,r,i,a,o),t);return u.position.set(s,c,l),e.add(u),u}function Mx(e,t,n,r){let i=new yp;return i.position.set(t,n,r),e.add(i),i}function Nx(e){let t=e*2654435761>>>0||1,n=()=>(t=Math.imul(t,1664525)+1013904223>>>0)/4294967296;return{rnd:(e,t)=>e+n()*(t-e),pick:e=>e[Math.floor(n()*e.length)]}}var Px=new Gf,Fx=new Y;function Ix(e,t,n){let r=new yp,i=[];n(r),r.updateMatrixWorld(!0),r.traverse(e=>{e.isMesh&&i.push(e)});let a=0;for(let e of i)a+=e.geometry.getAttribute(`position`).count;let o=new Float32Array(a*3),s=new Float32Array(a*3),c=0;for(let e of i){let t=e.geometry.getAttribute(`position`),n=e.geometry.getAttribute(`aCol`);Px.copy(e.matrixWorld);for(let e=0;e<t.count;e++,c++)Fx.fromBufferAttribute(t,e).applyMatrix4(Px).toArray(o,c*3),s[c*3]=n.getX(e),s[c*3+1]=n.getY(e),s[c*3+2]=n.getZ(e)}let l=new Sm;l.setAttribute(`position`,new sm(o,3)),l.setAttribute(`aCol`,new sm(s,3));let u=new Km(l,t);return e.add(u),u}var Lx=[4938794,5924400,7236140,8287280],Rx=9079898,zx=6183480,Bx=5128232;function Vx(e,t,n,r,i,a,o,s,c){let l=Mx(e,n,r,i);l.rotation.set(s*.6,a,0),Q(l,t,`box`,zx,.08*o,.07*o,.26*o,0,0,.13*o),Q(l,t,`ico`,c,.7*o,.09*o,.62*o,0,0,.5*o),Q(l,t,`box`,Rx,.03*o,.095*o,.5*o,0,.01*o,.5*o);let u=Mx(l,0,0,.72*o);u.rotation.x=s,Q(u,t,`ico`,c,.62*o,.08*o,.6*o,0,0,.22*o)}function Hx(e,t,n,r,i,a,o,s,c,l={}){let u=l.rise??s*.3,d=l.lean??0,f=l.fan??.4,p=Math.sin(a),m=Math.cos(a);Q(e,t,`ico`,Bx,s*.45,u*(o-.4),s*.4,n,r+u*(o-1)/2,i);for(let l=0;l<o;l++)for(let h=-1;h<=1;h++){let g=1-.5/o*l;Vx(e,t,n+p*d*l,r+l*u,i+m*d*l,a+h*f+c(-.12,.12),s*g*c(.85,1.1),c(-.05,.14),Lx[(h+l+4)%4])}}var Ux=.15,Wx={husk:{parts:[{at:e=>e.b,frame:[[`hipL`,`hipR`],[`hipL`,`hipR`],[`shL`,`shR`],`hipL`,`hipR`]},{at:e=>e.hd,bone:[[`shL`,`shR`],`head`],parent:0,o:`head`},{at:e=>e.legs[0],bone:[`hipL`,`kneeL`],parent:0},{at:e=>e.shins[0],bone:[`kneeL`,`footL`],parent:2},{at:e=>e.legs[1],bone:[`hipR`,`kneeR`],parent:0},{at:e=>e.shins[1],bone:[`kneeR`,`footR`],parent:4},{at:e=>e.arms[0],bone:[`shL`,`handL`],parent:0},{at:e=>e.arms[1],bone:[`shR`,`handR`],parent:0}]},thresher:{parts:[{at:e=>e.b,frame:[[`hipL`,`hipR`],[`hipL`,`hipR`],[`shL`,`shR`],`hipL`,`hipR`]},{at:e=>e.hd,bone:[[`shL`,`shR`],`head`],parent:0,o:`head`},{at:e=>e.legs[0],bone:[`hipL`,`kneeL`],parent:0},{at:e=>e.shins[0],bone:[`kneeL`,`footL`],parent:2},{at:e=>e.legs[1],bone:[`hipR`,`kneeR`],parent:0},{at:e=>e.shins[1],bone:[`kneeR`,`footR`],parent:4},{at:e=>e.arms[0].a,bone:[`shL`,`elbL`],parent:0},{at:e=>e.arms[0].f,bone:[`elbL`,`handL`],parent:6},{at:e=>e.arms[1].a,bone:[`shR`,`elbR`],parent:0},{at:e=>e.arms[1].f,bone:[`elbR`,`handR`],parent:8}]},skitter:{parts:[{at:e=>e.b,frame:[[`fl`,`fr`,`bl`,`br`],[`fl`,`fr`,`bl`,`br`],`top`,[`fl`,`ml`,`bl`],[`fr`,`mr`,`br`]]},...[`fl`,`ml`,`bl`,`fr`,`mr`,`br`].map((e,t)=>({at:e=>e.limbs[t].l,bone:[e,`f`+t],parent:0}))]},worm:{parts:[{at:e=>e.hd,bone:[`s0`,`head`],o:`head`},...[0,1,2,3,4,5].map(e=>({at:t=>t.segs[e],bone:[e?`s`+(e-1):`head`,e<5?`s`+(e+1):`s5`],o:`s`+e}))]}};Wx.patient=Wx.husk;var Gx=new Y,Kx=new Y,qx=new Y,Jx=new Y,Yx=new Y,Xx=new Y,Zx=new Gf,Qx=new Gf,$x=new xf,eS=new Y(1,1,1),tS=new Y,nS=new xf;function rS(e,t,n){e.set(0,0,0);for(let r of t)e.set(e.x+n(r,0),e.y+n(r,1),e.z+n(r,2));return e.multiplyScalar(1/t.length)}var iS=class{M;parts;bound;G;O;from=null;t=0;still=!1;woke=-1;last=null;idle;restore(){this.still=!1,this.bound.forEach((e,t)=>{e.obj.position.copy(this.idle[t].p),e.obj.quaternion.copy(this.idle[t].q),e.obj.scale.copy(this.idle[t].s)})}W;constructor(e,t){this.M=e;let n=ca(t),r=Wx[t],i=e=>(Array.isArray(e)?e:[e]).map(e=>{let r=n.at[e];if(r===void 0)throw Error(`${t}: no point ${e}`);return r}),a=(e,t)=>n.rest[e*3+t];this.parts=r.parts.map(e=>{let t={o:[],parent:e.parent??-1,o0:new Y,R0i:new xf,d0:new Y};return e.frame?(t.frame=e.frame.map(i),t.o=t.frame[0],aS(t.frame,a,$x),t.R0i.copy($x).invert()):(t.bone=e.bone.map(i),t.o=e.o?i(e.o):t.bone[0],t.d0.subVectors(rS(Kx,t.bone[1],a),rS(Gx,t.bone[0],a)).normalize()),rS(t.o0,t.o,a),t}),e.g.position.set(0,0,0),e.g.rotation.set(0,0,0),e.g.scale.set(1,1,1),e.g.updateMatrixWorld(!0),this.bound=r.parts.map((t,n)=>({obj:t.at(e),part:n,P0:t.at(e).matrixWorld.clone()}));let o=new Set(this.bound.map(e=>e.obj));for(let t of e.g.children)o.has(t)||this.bound.push({obj:t,part:r.rest??0,P0:t.matrixWorld.clone()});this.idle=this.bound.map(e=>({p:e.obj.position.clone(),q:e.obj.quaternion.clone(),s:e.obj.scale.clone()})),this.G=this.parts.map(()=>new xf),this.O=this.parts.map(()=>new Y),this.W=this.bound.map(()=>new Gf)}pose(e,t,n){let r=this.M.g;if(e!==this.last&&(this.last=e,this.from=null,this.still=!1),(e.awake||e.woke!==this.woke)&&(this.still=!1),this.woke=e.woke,r.position.set(0,0,0),r.rotation.set(0,0,0),r.scale.set(1,1,1),this.still)return;this.from||(r.updateMatrixWorld(!0),this.from=this.bound.map(e=>e.obj.matrixWorld.clone()),this.t=0),this.t=Math.min(Ux,this.t+n),r.updateMatrix(),r.updateMatrixWorld(!0);let i=this.t/Ux;this.lay(e,t,this.from,i*i*(3-2*i)),this.still=!e.awake&&this.t>=.15}get settled(){return this.still}bake(){let e=this.M.g,t=Zx.copy(e.matrixWorld).invert(),n=[];for(let t of e.children)t.traverseVisible(e=>{e.isMesh&&n.push(e)});let r=0;for(let e of n)r+=e.geometry.getAttribute(`position`).count;let i=new Float32Array(r*3),a=new Float32Array(r*3),o=0;for(let e of n){let n=e.geometry.getAttribute(`position`),r=e.geometry.getAttribute(`aCol`),s=Qx.multiplyMatrices(t,e.matrixWorld);for(let e=0;e<n.count;e++,o++)tS.fromBufferAttribute(n,e).applyMatrix4(s).toArray(i,o*3),a[o*3]=r.getX(e),a[o*3+1]=r.getY(e),a[o*3+2]=r.getZ(e)}let s=new Sm;return s.setAttribute(`position`,new sm(i,3)),s.setAttribute(`aCol`,new sm(a,3)),s}rise(e,t,n){this.M.g.updateMatrixWorld(!0);let r=this.bound.map(e=>e.obj.matrixWorld.clone()),i=Math.min(1,Math.max(0,n));this.lay(e,t,r,1-i*i*(3-2*i)),this.from=null,this.still=!1}lay(e,t,n,r){let i=this.M.g,a=(n,r)=>e.o[n*3+r]+(e.p[n*3+r]-e.o[n*3+r])*t;this.parts.forEach((e,t)=>{let n=this.G[t];if(e.frame)aS(e.frame,a,n).multiply(e.R0i);else{let t=e.parent>=0?this.G[e.parent]:$x.identity();qx.subVectors(rS(Kx,e.bone[1],a),rS(Gx,e.bone[0],a)).normalize(),qx.applyQuaternion(nS.copy(t).invert()),n.setFromUnitVectors(e.d0,qx).premultiply(t)}rS(this.O[t],e.o,a)});let o=new Map;this.bound.forEach((e,t)=>{let i=this.parts[e.part],a=this.W[t];a.makeTranslation(-i.o0.x,-i.o0.y,-i.o0.z).premultiply(Zx.makeRotationFromQuaternion(this.G[e.part])).premultiply(Qx.makeTranslation(this.O[e.part].x,this.O[e.part].y,this.O[e.part].z)).multiply(e.P0),r<1&&uS(n[t],a,r,a),o.set(e.obj,a)});for(let e of this.bound){let t=o.get(e.obj),n=e.obj.parent,r=o.get(n)??n.matrixWorld;Zx.copy(r).invert().multiply(t).decompose(e.obj.position,e.obj.quaternion,e.obj.scale)}i.updateMatrixWorld(!0)}};function aS(e,t,n){return Yx.subVectors(rS(Kx,e[2],t),rS(Gx,e[1],t)).normalize(),Jx.subVectors(rS(Kx,e[4],t),rS(Gx,e[3],t)),Xx.crossVectors(Jx,Yx).normalize(),Jx.crossVectors(Yx,Xx),n.setFromRotationMatrix(Zx.makeBasis(Jx,Yx,Xx))}var oS=new xf,sS=new xf,cS=new Y,lS=new Y;function uS(e,t,n,r){e.decompose(cS,oS,eS),t.decompose(lS,sS,eS),tS.lerpVectors(cS,lS,n),r.compose(tS,oS.slerp(sS,n),eS.set(1,1,1))}var dS=Math.PI;function fS(e,t,n){if(!t.torch)return null;Q(n,e,`cyl`,2763822,.055,.26,.055,0,-Yc.arm+.17,.03),Q(n,e,`cyl`,3816768,.075,.06,.075,0,-Yc.arm+.03,.03);let r=new Km(Yb([[`cyl`,16774364,.06,.012,.06,0,0,0]]),new Pm({color:new Ep().setRGB(1,.94,.82).multiplyScalar(ib.most)}));return r.position.set(0,-Yc.arm,.03),n.add(r),r}var pS=2896960,mS=2303531,hS=1382427,gS=12562062,_S=[1.1,1.08,.98];function vS(e,t){let n=Nx(t.id),r=new yp,i=t.torch||n.rnd(0,1)<.65,a=i?pS:n.pick([12567488,4871520,7040858,8018512]),o=i?mS:2829876,s=[],c=[];for(let t of[-1,1]){let n=Mx(r,t*.11,.9,0),i=Mx(n,0,-.45,0);Q(n,e,`box`,o,.16,.45,.17,0,-.225,0),Q(i,e,`box`,o,.16,.45,.17,0,-.225,0),Q(i,e,`box`,Dx,.17,.09,.28,0,-.42,.04),s.push(n),c.push(i)}let l=Mx(r,0,.9,0);if(Q(l,e,`box`,a,.42,.6,.24,0,.3,0),Q(l,e,`box`,hS,.43,.08,.25,0,.05,0),i){Q(l,e,`box`,10127952,.06,.07,.02,-.12,.44,.125),Q(l,e,`box`,9080460,.07,.05,.02,0,.05,.13);for(let t of[-1,1])Q(l,e,`box`,2041134,.13,.025,.2,t*.15,.6,0);Q(l,e,`box`,1908513,.07,.13,.05,.2,.06,.06)}Q(l,e,`cyl`,gS,.13,.14,.13,-.02,.64,0);let u=Mx(l,-.02,.76,0);Q(u,e,`ico`,gS,.24,.28,.25,0,0,0);for(let t of[-1,1])Q(u,e,`ico`,_S,.058,.04,.03,t*.055,.025,.112),Q(u,e,`ico`,Dx,.01,.01,.01,t*.055,.024,.127),Q(u,e,`box`,[1.45,1.45,1.4],.014,.012,.006,t*.055+.013,.031,.129),Q(u,e,`box`,12101252,.064,.016,.03,t*.055,.045,.117),Q(u,e,`box`,10115662,.05,.008,.03,t*.055,.004,.116);Q(u,e,`box`,3810850,.08,.022,.03,0,-.075,.112),u.rotation.z=.25;let d=[];for(let[t,n]of[[-.27,.56],[.27,.56]]){let r=Mx(l,t,n,0);Q(r,e,`box`,a,.11,.36,.12,0,-.18,0),Q(r,e,`box`,gS,.08,.34,.08,0,-.52,0),d.push(r)}let f=t.torch?3:1+Math.floor(n.rnd(0,3));return Ix(l,e,t=>{Hx(t,e,-.03,.58,-.1,dS+.3,4,.3,n.rnd,{rise:.07,lean:.015,fan:.45}),f>1&&Hx(t,e,.08,.6,0,dS/2+.5,3,.25,n.rnd,{rise:.065}),Hx(t,e,.2,.48,-.02,dS/2+.15,f>2?4:2,.3,n.rnd,{rise:.075,fan:.4}),f>2&&Hx(t,e,.15,.24,-.11,dS*.8,3,.24,n.rnd,{rise:.065})}),{g:r,b:l,hd:u,legs:s,shins:c,arms:d,lens:fS(e,t,d[0])}}var yS=9412763,bS=13219748,xS=2761760,SS=4853004;function CS(e){let t=new yp,n=[],r=[];for(let i of[-1,1]){let a=Mx(t,i*.1,.9,0),o=Mx(a,0,-.45,0);Q(a,e,`box`,bS,.11,.45,.12,0,-.225,0),Q(o,e,`box`,bS,.1,.45,.11,0,-.225,0),Q(o,e,`box`,bS,.1,.06,.22,0,-.43,.04),n.push(a),r.push(o)}let i=Mx(t,0,.9,0);Q(i,e,`box`,yS,.4,.6,.22,0,.3,0),Q(i,e,`box`,yS,.44,.42,.25,0,-.18,0),Q(i,e,`cyl`,bS,.1,.12,.1,0,.64,0);let a=Mx(i,0,.76,0);Q(a,e,`ico`,bS,.21,.27,.23,0,0,0),Q(a,e,`ico`,xS,.26,.17,.27,0,.09,-.03),Q(a,e,`ico`,xS,.2,.2,.12,0,0,-.1);for(let t of[-1,1])Q(a,e,`ico`,5914680,.05,.035,.02,t*.05,.02,.105),Q(a,e,`ico`,Dx,.018,.018,.01,t*.05,.02,.113);Q(a,e,`box`,5913140,.06,.03,.02,0,-.07,.108);let o=[];for(let t of[-1,1]){let n=Mx(i,t*.25,.56,0);Q(n,e,`box`,yS,.12,.16,.13,0,-.06,0),Q(n,e,`box`,bS,.07,.6,.07,0,-.38,0),o.push(n)}let s=Ix(i,e,t=>{for(let[n,r,i,a,o]of[[.08,.38,.115,.14,.3],[-.1,.12,.118,.1,.22],[.12,-.2,.13,.12,.26],[0,.45,-.115,.22,.2],[-.12,-.05,-.13,.12,.3]])Q(t,e,`box`,SS,a,o,.012,n,r,i);Q(t,e,`ico`,SS,.2,.12,.22,0,.72,.02)}),c=Ix(o[0],e,t=>{Q(t,e,`ico`,6957088,.1,.12,.1,0,-.42,.03),Hx(t,e,0,-.44,.04,0,2,.16,Nx(7).rnd,{rise:.05,fan:.5})});return s.visible=c.visible=!1,{g:t,b:i,hd:a,legs:n,shins:r,arms:o,gore:s,graft:c}}var wS={patient:e=>CS(e),husk(e,t){if(t.cards)return vS(e,t);let n=Nx(t.id),r=new yp,i=n.pick([12567488,4871520,3754074,7040858,8018512]),a=2829876,o=[],s=[];for(let t of[-1,1]){let n=Mx(r,t*.11,.9,0),i=Mx(n,0,-.45,0);Q(n,e,`box`,a,.16,.45,.17,0,-.225,0),Q(i,e,`box`,a,.16,.45,.17,0,-.225,0),Q(i,e,`box`,Dx,.16,.07,.26,0,-.42,.04),o.push(n),s.push(i)}let c=Mx(r,0,.9,0);Q(c,e,`box`,i,.42,.6,.24,0,.3,0),Q(c,e,`box`,a,.4,.12,.23,0,.03,0),Q(c,e,`ico`,Cx,.26,.3,.22,.17,.52,-.04);let l=Mx(c,-.02,.76,0);Q(l,e,`ico`,Tx,.24,.28,.25,0,0,0),Q(l,e,`box`,Dx,.1,.03,.03,0,-.07,.11),Q(l,e,`ico`,Dx,.04,.04,.04,-.05,.03,.11),Q(l,e,`ico`,Cx,.1,.11,.07,.07,.04,.09),l.rotation.z=.25;let u=[],d=Mx(c,-.27,.56,0);return Q(d,e,`box`,i,.11,.36,.12,0,-.18,0),Q(d,e,`box`,Tx,.08,.34,.08,0,-.52,0),u.push(d),d=Mx(c,.3,.58,0),Q(d,e,`box`,Cx,.14,.4,.14,0,-.2,0),Q(d,e,`box`,Sx,.1,.52,.1,0,-.64,0),Q(d,e,`box`,Ex,.05,.16,.05,0,-.97,.02),u.push(d),{g:r,b:c,hd:l,legs:o,shins:s,arms:u,lens:fS(e,t,u[0])}},skitter(e){let t=new yp,n=Mx(t,0,.55,0);Q(n,e,`box`,Sx,.42,.26,.95,0,0,0),Q(n,e,`box`,Cx,.2,.1,.7,0,.16,-.05),Q(n,e,`box`,4871520,.44,.1,.3,0,-.05,-.25);let r=Mx(n,0,.02,.6);Q(r,e,`ico`,Tx,.3,.36,.3,0,0,0),Q(r,e,`box`,Dx,.16,.07,.05,0,-.09,.13),Q(r,e,`ico`,Dx,.06,.06,.06,-.07,.06,.13),Q(r,e,`ico`,Dx,.06,.06,.06,.08,.04,.13),r.rotation.z=2.5;let i=[];for(let t of[-1,1])for(let r=0;r<3;r++){let a=Mx(n,t*.2,0,.38-r*.38),o=Q(a,e,`box`,Sx,.6,.08,.08,t*.28,.13,0);o.rotation.z=t*.45,Q(a,e,`box`,Tx,.07,.82,.07,t*.56,-.14,0),Q(a,e,`box`,Cx,.11,.05,.16,t*.56,-.53,.03),i.push({l:a,s:t,k:r})}return{g:t,b:n,hd:r,limbs:i}},bloat(e,t){let n=Nx(t.id),r=new yp,i=t.sit,a=Mx(r,0,i?1.05:1.75,0);Q(a,e,`ico`,Tx,1.9,2.1,1.7,0,0,0),Q(a,e,`ico`,Sx,1.3,1,1.2,0,-.6,.3),Q(a,e,`ico`,Cx,.5,.4,.4,.6,.3,.5);let o=Mx(a,0,1.4,.1);Q(o,e,`ico`,Tx,1.25,1.35,1.2,0,0,0),Q(o,e,`ico`,Dx,.07,.07,.07,-.14,-.22,.52),Q(o,e,`ico`,Dx,.07,.07,.07,.14,-.22,.52),Q(o,e,`box`,Dx,.16,.03,.04,0,-.38,.5);let s=[];for(let t of[-1,1]){let n=Mx(a,t*.98,.35,0);Q(n,e,`box`,Sx,.22,1,.22,0,-.5,0),s.push(n)}if(i)for(let t of[-1,1])Q(r,e,`box`,Sx,.42,.4,1.3,t*.45,.2,.85);else for(let t of[-1,1])Q(r,e,`box`,Sx,.5,1,.5,t*.45,.5,0);if(i&&!t.holt&&(Q(a,e,`box`,Dx,.5,.02,.02,0,.62,.8),Q(a,e,`box`,[2.9,2.85,2.6],.12,.18,.02,0,.48,.84)),t.holt)for(let t=0;t<9;t++)Q(a,e,`ico`,n.pick(kx),n.rnd(.3,.7),n.rnd(.2,.5),n.rnd(.3,.7),n.rnd(-.9,.9),n.rnd(-.8,1.6),n.rnd(-.6,.7));return{g:r,b:a,hd:o,arms:s}},thresher(e){let t=new yp,n=2829876,r=11117973,i=[],a=[];for(let r of[-1,1]){let o=Mx(t,r*.17,1,0),s=Mx(o,0,-.52,0);Q(o,e,`box`,n,.2,.52,.22,0,-.26,0),Q(s,e,`box`,n,.17,.46,.19,0,-.22,.02),Q(s,e,`box`,Dx,.17,.08,.3,0,-.44,.06),i.push(o),a.push(s)}Q(t,e,`box`,n,.5,.2,.3,0,1.06,0),Q(t,e,`box`,9078908,.4,.38,.03,0,.9,.17);let o=Mx(t,0,1.14,0);Q(o,e,`box`,r,.6,.8,.1,0,.42,-.19),Q(o,e,`box`,wx,.52,.7,.14,0,.42,-.09),Q(o,e,`box`,Ex,.07,.74,.07,0,.42,-.03),Q(o,e,`ico`,Cx,.26,.3,.14,-.1,.5,-.02),Q(o,e,`ico`,7220008,.2,.24,.12,.12,.3,-.02),Q(o,e,`box`,Sx,.8,.15,.3,0,.86,-.08);let s=[];for(let t of[-1,1]){let n=Mx(o,t*.31,.42,-.06);Q(n,e,`box`,r,.31,.74,.08,-t*.155,0,.05),Q(n,e,`box`,Cx,.29,.7,.03,-t*.155,0,0);for(let r=0;r<4;r++)Q(n,e,`box`,Ex,.27,.035,.05,-t*.15,-.27+r*.18,-.02);for(let r=0;r<6;r++)Q(n,e,`box`,Ex,.1,.04,.04,-t*.34,-.3+r*.12,-.01);s.push({d:n,s:t})}let c=Mx(o,0,.98,-.14);Q(c,e,`box`,Sx,.1,.14,.1,0,-.06,.02),Q(c,e,`ico`,Tx,.23,.27,.25,0,.1,0),Q(c,e,`box`,Dx,.1,.06,.03,0,.03,.11),c.rotation.x=-.7;let l=[];for(let t of[-1,1]){let n=Mx(o,t*.47,.84,-.06);Q(n,e,`box`,r,.12,.44,.12,0,-.22,0);let i=Mx(n,0,-.44,0);Q(i,e,`box`,Tx,.09,.48,.09,0,-.24,0),Q(i,e,`box`,Sx,.1,.15,.05,0,-.55,0),l.push({a:n,f:i,s:t})}return{g:t,b:o,hd:c,legs:i,shins:a,arms:l,doors:s}},worm(e,t){let n=new yp,r=[],i=t.green,a=i?4876856:Sx,o=i?6982212:Ox,s=i?3103284:Cx,c=i?11057296:Tx;for(let t=0;t<6;t++)r.push(Q(n,e,`ico`,t===2||t===3?o:t===5?s:a,.42-.04*t,.36-.035*t,.5,0,.18,-t*.36));let l=Mx(n,0,.22,.3);return Q(l,e,`ico`,c,.3,.3,.32,0,0,0),Q(l,e,`ico`,Dx,.05,.05,.05,-.07,.04,.14),Q(l,e,`ico`,Dx,.05,.05,.05,.07,.04,.14),Q(l,e,`box`,Dx,.1,.03,.03,0,-.07,.15),{g:n,segs:r,hd:l,hand:Q(n,e,`box`,c,.06,.05,.34,.24,.1,.12)}},grabber(e,t){let n=new yp,r=t.green,i=r?3103284:Cx,a=r?5208640:Sx,o=r?10137712:Tx,s=Mx(n,0,2.3,0);Q(s,e,`ico`,i,.9,.5,.5,0,0,0),Q(s,e,`ico`,a,.5,.4,.4,.3,.15,.05);let c=Mx(n,0,2.02,.22);Q(c,e,`ico`,o,.36,.4,.36,0,0,0),Q(c,e,`box`,Dx,.14,.07,.04,0,-.08,.16),Q(c,e,`ico`,Dx,.06,.06,.06,-.08,.05,.16),Q(c,e,`ico`,Dx,.06,.06,.06,.08,.05,.16);let l=[];for(let t=0;t<5;t++){let r=Mx(n,-.42+t*.21,2.12,.12),i=[];for(let t=0;t<5;t++)Q(r,e,`box`,t%2?a:o,.07-.008*t,.34,.07-.008*t,0,-.17,0),i.push(r),r=Mx(r,0,-.34,0);Q(r,e,`box`,o,.1,.12,.04,0,-.05,0),l.push({ch:i,k:t})}return{g:n,hd:c,sac:s,tent:l}}},TS=(e,t)=>e+Math.random()*(t-e),ES=e=>e*e*(3-2*e),DS={patient(e,t){let n=e.mv>0;for(let r=0;r<2;r++)t.legs[r].rotation.x=n?Math.sin(e.ph*6+r*dS)*.3:0,t.shins[r].rotation.x=0,t.arms[r].rotation.z=0;if(t.hd.rotation.set(0,0,0),e.state===`bang`){let n=ES(1-Math.min(1,e.wt/.5));for(let e=0;e<2;e++)t.arms[e].rotation.x=-2.3+n*1+e*.15;t.b.rotation.x=.05+n*.12,t.hd.rotation.x=-.1}else if(e.state===`warn`)t.b.rotation.x=0,t.arms[1].rotation.z=2.3,t.arms[1].rotation.x=-.35+Math.sin(e.ph*9)*.05,t.arms[0].rotation.x=0,t.hd.rotation.y=Math.sin(e.ph*2.2)>0?.7:0;else if(e.state===`hide`){if(t.b.rotation.x=.45,t.arms[0].rotation.x=t.arms[1].rotation.x=-2.6,t.hd.rotation.x=.5,!n){for(let e=0;e<2;e++)t.legs[e].rotation.x=-.9,t.shins[e].rotation.x=1.5;t.g.position.y-=.22}}else t.b.rotation.x=.12,t.arms[0].rotation.x=-1.35+Math.sin(e.ph*.4)*.03,t.arms[1].rotation.x=.05,t.hd.rotation.x=.35,t.hd.rotation.z=.12},husk(e,t,n){let r=e.mv>0,i=e.state===`hunt`,a=i?11:5;for(let n=0;n<2;n++)t.legs[n].rotation.x=r?Math.sin(e.ph*a+n*dS)*(i?.7:.35):0,t.shins&&(t.shins[n].rotation.x=0);t.arms[0].rotation.x=i?-1.1+Math.sin(e.ph*a)*.2:r?Math.sin(e.ph*a+dS)*.25:0,t.arms[1].rotation.x=i?-1.3+Math.sin(e.ph*a+2)*.25:r?Math.sin(e.ph*a)*.2:Math.sin(e.ph*.9)*.06,t.b.rotation.x=e.state===`flee`?.4:i?.18:.06;let o=Zs(e);if(o){if(o.ph===`wind`){let n=ES(o.q),r=o.q>.7?Math.sin(e.ph*45)*.05:0;t.arms[1].rotation.x=-1.3+-1.45*n+r,t.arms[0].rotation.x=-1.1+.6*n,t.b.rotation.x=.18-.26*n}else if(o.ph===`strike`){let e=o.q*o.q;t.arms[1].rotation.x=-2.75+2.6*e,t.arms[0].rotation.x=-.5,t.b.rotation.x=-.08+.58*e}else{let e=ES(Math.max(0,(o.q-.35)/.65));t.arms[1].rotation.x=-.15+-1.1500000000000001*e,t.arms[0].rotation.x=-.5-.6*e,t.b.rotation.x=.5-.32*e}}if(e.reel>0){let n=Math.min(1,e.reel/.3),r=Math.sin(e.ph*23)*.06*n;t.b.rotation.x=-.4*n+r,t.arms[0].rotation.x=-.25*n,t.arms[1].rotation.x=.2*n+r}if(t.b.rotation.z=Math.sin(e.ph*(r?a:.8))*.04,t.hd.rotation.z=.25+Math.sin(e.ph*.7)*.1+(Math.random()<.015?TS(-.5,.5):0),t.hd.rotation.y=Math.sin(e.ph*.5)*.25,t.lens&&(t.arms[0].rotation.x=Xc(n.sim,e).pitch-dS/2),e.drag>=0&&(t.arms[1].rotation.x=.6,t.arms[1].rotation.z=-.15),e.graft>0){for(let e=0;e<2;e++)t.legs[e].rotation.x=-1.35,t.shins[e].rotation.x=1.6;t.g.position.y-=.5,t.b.rotation.x=.85,t.arms[1].rotation.x=-1.2+Math.max(0,Math.sin(e.ph*7))*.5,t.hd.rotation.x=.5}},skitter(e,t){let n=e.mv>0,r=e.state===`idle`?.4:1;for(let i of t.limbs)i.l.rotation.y=i.s*Math.sin(e.ph*(n?14:1.3)+i.k*2.1+(i.s>0?dS:0))*(n?.5:.1)+(Math.random()<.04*r?TS(-.3,.3):0);t.hd.rotation.z=2.5+Math.sin(e.ph*3.1)*.2+(Math.random()<.05*r?TS(-.7,.7):0),t.b.position.y=.55+Math.sin(e.ph*(n?20:2))*.02,t.b.rotation.z=Math.random()<.03*r?TS(-.12,.12):0;let i=Zs(e),a=i?i.ph===`wind`?Math.min(1,i.q/.5):i.ph===`strike`?1-1.4*i.q*i.q:-.4*(1-ES(Math.max(0,(i.q-.4)/.6))):0;t.b.rotation.x=-a*.75,t.b.position.y+=a*(a>0?.28:.4);for(let n of t.limbs)a>0&&n.k===0?(n.l.rotation.z=n.s*a*1.1+Math.sin(e.ph*40)*.06,n.l.rotation.y=n.s*-.5*a):a<0?n.l.rotation.z=n.s*a*.6:n.l.rotation.z=0},bloat(e,t){let n=1+Math.sin(e.ph*.9)*.02;t.b.scale.set(n,1/n,n),t.hd.rotation.z=Math.sin(e.ph*.4)*.08,t.hd.rotation.y=Math.sin(e.ph*.23)*.2;for(let n of t.arms)n.rotation.x=Math.sin(e.ph*.9)*.06},thresher(e,t){let n=e.state===`charge`||e.state===`wind`,r=n?1.2+Math.sin(e.ph*24)*.14:e.state===`recover`?.75:.2+Math.sin(e.ph*1.4)*.1;for(let e of t.doors)e.d.rotation.y=e.s*r;for(let r of t.arms)r.a.rotation.x=n?-2+Math.sin(e.ph*17+r.s)*1.1:Math.sin(e.ph*1.6+r.s)*.2,r.a.rotation.z=r.s*(n?.5+Math.sin(e.ph*13+r.s*2)*.4:.1),r.f.rotation.x=n?-.6+Math.sin(e.ph*19+r.s)*.5:-.15;for(let r=0;r<2;r++)t.legs[r].rotation.x=e.mv>0?Math.sin(e.ph*(n?16:5)+r*dS)*.6:0;t.b.rotation.x=e.state===`charge`?.35:e.state===`recover`?-.1:.05;let i=Zs(e);if(i){let n=i.ph===`wind`?ES(i.q):i.ph===`strike`?1-2*i.q*i.q:-(1-ES(Math.max(0,(i.q-.3)/.7))),r=i.ph===`wind`&&i.q>.65;for(let e of t.doors)e.d.rotation.y=e.s*(.3+(n>=0?1:-.45)*n);for(let i of t.arms)i.a.rotation.x=n>=0?-2.5*n+(r?Math.sin(e.ph*30+i.s)*.08:0):-.4*n,i.a.rotation.z=i.s*(n>=0?.9*n:0),i.f.rotation.x=n>=0?-.4*n:-.2*n;t.b.rotation.x=i.ph===`wind`?-.15*n:i.ph===`strike`?-.15+.6*i.q:-.45*n}t.hd.rotation.x=-.7+Math.sin(e.ph*2.3)*.1,t.hd.rotation.z=Math.sin(e.ph*(n?15:1.1))*.2},worm(e,t){let n=e.mv>0?7:1.5;for(let r=0;r<6;r++){let i=t.segs[r];i.position.x=Math.sin(e.ph*n-r*.9)*.1,i.position.y=.18+Math.max(0,Math.sin(e.ph*n-r*.9))*.07}t.hd.position.x=Math.sin(e.ph*n+.9)*.08,t.hd.rotation.y=Math.sin(e.ph*1.7)*.4,t.hand.position.z=.12+Math.sin(e.ph*n)*.1;let r=Zs(e),i=r?r.ph===`wind`?ES(r.q):r.ph===`strike`?1-2*r.q*r.q:-(1-ES(Math.max(0,(r.q-.3)/.7))):0;t.hd.position.y=.22+(i>=0?.14:.04)*i,t.hd.position.z=.3-(i>=0?.1:.25)*i,t.hd.rotation.x=-(i>=0?.45:.25)*i,t.hd.rotation.z=r?.ph===`wind`&&r.q>.5?Math.sin(e.ph*40)*.08:0,t.hand.position.y=.1+Math.max(0,i)*.15,r&&(t.hand.position.z=.12-(i>=0?.12:.38)*i),t.segs[0].position.y+=Math.max(0,i)*.1,t.segs[1].position.y+=Math.max(0,i)*.05},grabber(e,t){let n=e.grab>0?3:1,r=Math.min(1,e.tense/.8);for(let i of t.tent)for(let t=0;t<5;t++){let a=i.ch[t];a.rotation.x=Math.sin(e.ph*1.8*n+t*.8+i.k)*.22*n*(1-r*.7)+(e.grab>0?.25:r*.3),a.rotation.z=Math.cos(e.ph*1.3*n+t*.6+i.k*2)*.16*(1-r*.8)}t.hd.rotation.y=Math.sin(e.ph)*.5*(1-r),t.hd.rotation.x=r*.3;let i=1+Math.sin(e.ph*2.2)*.05;t.sac.scale.set(i,i,i)}};DS.swimmer=DS.worm;var OS={after:.25,speed:.6,from:.15,spread:3.5},kS={pool:(e,t)=>[[`cyl`,e,t,.012,t*.9,0,0,0],[`cyl`,e,t*.55,.012,t*.42,t*.42,0,t*.14],[`cyl`,e,t*.36,.012,t*.5,-t*.3,0,-t*.34],[`cyl`,e,t*.2,.012,t*.16,t*.12,0,-t*.58]],smear:[[`cyl`,3803915,.34,.012,1.1,0,0,0],[`cyl`,3016969,.07,.012,1.2,.12,0,.05],[`cyl`,3016969,.06,.012,1,-.13,0,-.04]]},AS={near:3,wide:1.5,sprawl:1,cone:.7,reach:40},jS=(e,t)=>e.traverse(e=>e.layers.set(t)),MS=new eh,NS=new Gf,PS=new mm;function FS(e,t,n){if(!Wx[e.model]||!e.body)return null;let r={...e,state:`idle`,mv:0,blow:null,reel:0,ph:0,down:0,rise:0,los:!1,hit:0};return(DS[e.model]??DS[e.ai])?.(r,t,n),new iS(t,e.model)}var IS=class{scene;sim;L;shown=[];constructor(e,t,n){this.scene=e,this.sim=t,this.L=n,this.more()}more(){for(let e=this.shown.length;e<this.sim.cast.length;e++){let t=this.sim.cast[e],n=bb(),r=wS[t.model](n,t),i=FS(t,r,{sim:this.sim,dt:1/60,L:this.L});this.scene.add(r.g),this.shown.push({m:t,M:r,mat:n,blood:!1,fall:0,rig:i,loose:!1,baked:null,drawn:`seen`})}}setLighting(e){this.L=e;for(let e of this.bloods)this.light(e)}bloods=[];spreading=[];light(e){let t=e.position,n=this.sim.world.roomAt(t.x,t.y+.3,t.z),r=[0,0,0];Cb(e.material,n?this.L.atPoint(t.x,t.y,t.z):r,n?this.L.flickAt(t.x,t.y,t.z):r,n?this.L.towards(t.x,t.y,t.z):r)}last=0;update(e,t){this.shown.length<this.sim.cast.length&&this.more();let n=this.sim.world,r=performance.now()/1e3,i={sim:this.sim,dt:this.last?Math.min(.1,r-this.last):0,L:this.L};this.last=r,this.spread(),this.struck(i.dt),t.updateMatrixWorld(),MS.setFromProjectionMatrix(NS.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse));let a=t.getWorldPosition(new Y),o=this.L.looseLights.filter(e=>e.kind===`flash`);for(let t of this.shown){let{m:r,M:s,mat:c}=t,l=s.g;t.baked&&(r.away||!r.rag)&&this.unbake(t);let u=r.away?`none`:this.drawn(r,a,o);if(u!==t.drawn&&(u!==`none`&&(jS(l,u===`seen`?0:3),t.baked&&jS(t.baked,u===`seen`?0:3)),t.drawn=u),l.visible=u!==`none`&&!t.baked,t.baked&&(t.baked.visible=u!==`none`),r.away)continue;s.lens&&(s.lens.visible=!r.dead),s.gore&&(s.gore.visible=r.state===`dragged`||r.state===`out`),s.graft&&(s.graft.visible=r.grafted);let d=r.px+(r.x-r.px)*e,f=r.pz+(r.z-r.pz)*e,p=r.py+(r.y-r.py)*e;if(r.swim){let e=n.waterAt(d,f)-p;e>0&&(p+=e<2?Math.max(0,e-.23):.3)}l.position.set(d,p,f),l.rotation.order=`YXZ`,l.rotation.y=r.yaw,l.rotation.x=r.dead||r.fixed?0:-.32*r.hit*r.hit/Math.max(1,r.mass);let m=r.down>0?1:r.rise>0?r.rise/io.rise:0;t.fall+=(m-t.fall)*Math.min(1,i.dt*(m>t.fall?10:5)),r.rag&&t.rig&&(t.fall=0),t.fall>.001&&!r.dead&&(l.rotation.x-=t.fall*1.45,l.position.y+=t.fall*.15),c.uniforms.uHit.value=r.hit;let h=n.roomAt(d,p+.5,f)??n.roomAt(d,p+1.2,f),g=[0,0,0],_=p+(r.rag?.4:.8);if(Cb(c,h?this.L.atPoint(d,_,f):g,h?this.L.flickAt(d,_,f):g,h?this.L.towards(d,_,f):g),r.dead&&r.rag&&t.rig){t.rig.pose(r.rag,e,i.dt),t.loose=!0,t.rig.settled!==!!t.baked&&(t.rig.settled?this.bake(t):this.unbake(t)),!t.blood&&!r.swim&&n.waterAt(r.x,r.z)<r.y&&this.down(r)&&(t.blood=!0,this.blood(r));continue}if(r.dead){l.scale.y=1-.62*r.gone,r.fixed?l.scale.x=l.scale.z=1-.4*r.gone:l.rotation.z=r.gone*.35,!t.blood&&!r.fixed&&!r.swim&&n.waterAt(r.x,r.z)<r.y&&(t.blood=!0,this.blood(r));continue}if(r.rag&&t.rig&&r.down>0){t.rig.pose(r.rag,e,i.dt),t.loose=!0;continue}t.loose&&=(t.rig.restore(),!1),(DS[r.model]??DS[r.ai])?.(r,s,i),r.rag&&t.rig&&(t.rig.rise(r.rag,e,1-r.rise/io.rise),t.loose=!0)}}drawn(e,t,n){let r=ss[e.type]?.h??1.8,i=(e.r??.4)*AS.wide+(e.dead?AS.sprawl:0),a=e.y+r/2,o=Math.hypot(i,r/2);if(PS.center.set(e.x,a,e.z),PS.radius=o,MS.intersectsSphere(PS)){let n=e.x-t.x,o=e.z-t.z,s=Math.hypot(n,o);if(s<AS.near)return`seen`;let c=this.sim.world,l=-o/s*i,u=n/s*i,d=e.y+.15,f=e.y+r-.1;if(c.gridClear(t.x,t.y,t.z,e.x,a,e.z))return`seen`;for(let[n,r]of[[-1,d],[1,d],[-1,f],[1,f]])if(c.gridClear(t.x,t.y,t.z,e.x+l*n,r,e.z+u*n))return`seen`}else if(Z.uFlash.value>0){let t=Z.uFlashPos.value,n=Z.uFlashDir.value,r=e.x-t.x,i=a-t.y,s=e.z-t.z,c=Math.hypot(r,i,s);if(c<o||c<cb.far+o&&(r*n.x+i*n.y+s*n.z)/c>Math.cos(Math.acos(AS.cone)+Math.asin(Math.min(1,o/c))))return`seen`}for(let t of n)if(Math.hypot(t.x-e.x,t.y-a,t.z-e.z)<AS.reach+o)return`shadow`;return`none`}bake(e){let t=e.M.g,n=new Km(e.rig.bake(),e.mat);e.drawn===`shadow`&&jS(n,3),n.visible=e.drawn!==`none`,t.parent.add(n),e.baked=n,t.visible=!1}unbake(e){let t=e.baked;t.removeFromParent(),t.geometry.dispose(),e.baked=null,e.M.g.visible=!e.m.away}down(e){let t=e.rag;return t.awake?t.t<OS.after||ga(t)>OS.speed?!1:e.y-this.sim.world.groundBelow(Nn(e.x,e.z,.05,.05),e.y+.1)<.06:!0}blood(e){let t=bb(),n=new Km(Yb(kS.pool(e.green?2375711:3803915,e.r*2.6)),t);n.position.set(e.x,e.y+.012,e.z),n.rotation.y=Math.random()*dS,n.scale.set(OS.from,1,OS.from),this.light(n),this.bloods.push(n),this.scene.add(n),this.spreading.push({mesh:n,m:e,t0:this.sim.tick,held:!!e.rag?.awake})}pooled=[];struck(e){let t=this.sim.pools;for(let e=this.pooled.length;e<t.length;e++){let n=t[e],r=new Km(Yb(n.kind===`smear`?kS.smear:kS.pool(3803915,1)),bb());r.position.set(n.x,n.y+.012+e%8*.0015,n.z),r.rotation.y=n.yaw??Math.random()*dS;let i=n.kind?n.r:.05;r.scale.set(i,1,i),this.light(r),this.bloods.push(r),this.pooled.push(r),this.scene.add(r)}this.pooled.forEach((n,r)=>{if(t[r].kind)return;let i=n.scale.x+(t[r].r-n.scale.x)*Math.min(1,e*1.5);n.scale.set(i,1,i)})}spread(){this.spreading=this.spreading.filter(t=>{let{mesh:n,m:r}=t,i=Math.min(1,(this.sim.tick-t.t0)*e/OS.spread),a=OS.from+(1-OS.from)*(1-(1-i)**3);return n.scale.set(a,1,a),t.held&&!r.rag?.awake&&(t.held=!1),t.held&&(n.position.set(r.x,r.y+.012,r.z),this.light(n)),i<1||t.held})}},LS=40,RS=60,zS=class{targets;cams;depthOnly=new Pm({colorWrite:!1,side:2});held;heldCam=new fg(lb.fov,1,cb.near,cb.far);clear=[];since=1/0;constructor(){this.targets=Array.from({length:2},()=>{let e=new Hf(512,512,{depthBuffer:!0});return e.depthTexture=new Ch(512,512,Lu),e.depthTexture.minFilter=e.depthTexture.magFilter=Eu,e}),this.cams=Array.from({length:2},()=>{let e=new fg(cb.fov,1,cb.near,cb.far);return e.layers.enable(1),e.layers.enable(3),e}),Z.uSh0.value=this.targets[0].depthTexture,Z.uSh1.value=this.targets[1].depthTexture,this.held=new Hf(lb.size,lb.size,{depthBuffer:!0}),this.held.depthTexture=new Ch(lb.size,lb.size,Lu),this.held.depthTexture.minFilter=this.held.depthTexture.magFilter=Eu,Z.uShH.value=this.held.depthTexture}rescan(){this.since=1/0}render(e,t,n,r){let i=r.filter(e=>e.kind===`flash`&&e.k>0).map(e=>({L:e,d:Math.hypot(e.x-n.x,e.y-n.y,e.z-n.z)})).filter(e=>e.d<LS).sort((e,t)=>e.d-t.d).slice(0,2);for(let e=0;e<2;e++)Z.uBeam.value[e].w=0;let a=Z.uFlash.value>0;if(!i.length&&!a)return;++this.since>=RS&&(this.since=0,this.clear=[],t.traverse(e=>{let t=e.material;(e.isPoints||e.isCamera||t?.transparent)&&this.clear.push(e)}));let o=[];for(let e of this.clear)e.visible&&(e.visible=!1,o.push(e));let s=e.getRenderTarget(),c=t.overrideMaterial;t.overrideMaterial=this.depthOnly;let l=(e,t,n,r,i,a,o,s)=>{e.position.set(t,n,r),e.up.set(0,1,0),Math.abs(a)>.95&&e.up.set(1,0,0),e.lookAt(t+i,n+a,r+o),e.updateMatrixWorld(),s.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse)};if(i.forEach(({L:n},r)=>{let i=this.cams[r];l(i,n.x,n.y,n.z,n.dx,n.dy,n.dz,Z.uBeamM.value[r]),Z.uBeam.value[r].set(n.x,n.y,n.z,n.k),Z.uBeamDir.value[r].set(n.dx,n.dy,n.dz),e.setRenderTarget(this.targets[r]),e.clear(),e.render(t,i)}),a){let n=Z.uFlashPos.value,r=Z.uFlashDir.value;l(this.heldCam,n.x,n.y,n.z,r.x,r.y,r.z,Z.uHeldM.value),e.setRenderTarget(this.held),e.clear(),e.render(t,this.heldCam)}t.overrideMaterial=c,e.setRenderTarget(s);for(let e of o)e.visible=!0}},BS=(e,t)=>{let n={};for(let r of t)n[r]=structuredClone(e[r]);return n},VS=(e,t)=>{Object.assign(e,structuredClone(t))},HS=[`inv`,`cap`,`tools`,`keys`,`worn`,`weapon`,`read`,`code`,`code2`,`hp`,`batt`,`light`,`lightOn`,`pad`,`ended`,`time`,`noise`,`noiseI`,`noiseT`,`vis`,`once`,`kills`,`god`],US=[`yaw`,`pitch`,`crouch`,`wantStand`,`moved`,`impact`,`water`,`air`,`airMax`,`under`,`slow`,`load`,`slam`,`running`,`jumped`,`stepD`,`fly`],WS=[`x`,`y`,`z`,`vx`,`vz`,`vy`,`h`,`ground`],GS=[`t`,`open`,`unlocked`,`hold`,`down`,`drawing`,`pass`,`beep`,`beepOk`],KS=[`y`,`target`,`wait`,`moving`,`armed`],qS=[`x`,`y`,`z`,`vx`,`vy`,`vz`,`awake`,`ground`,`still`,`woke`],JS=`x.y.z.px.py.pz.yaw.state.st.cd.stun.hp.post.wt.wm.wx.wz.tk.lost.bt.burst.flee.ct.cdir.tgt.grab.tense.stk.fled.side.spot.mv.hit.poise.calm.reel.pat.down.rise.ph.dead.gone.away.dest.los.losAt.still.door.beat.lap.peered.torch.drag.trail.graft.grafted`.split(`.`),YS=e=>e.on?.id??0,XS=e=>{let t=new Uint8Array(e.buffer,e.byteOffset,e.byteLength),n=``;for(let e=0;e<t.length;e+=32768)n+=String.fromCharCode(...t.subarray(e,e+32768));return btoa(n)},ZS=(e,t)=>{let n=atob(e),r=new Uint8Array(t.buffer,t.byteOffset,t.byteLength);if(n.length!==r.length)throw Error(`save does not fit this level's nav graph`);for(let e=0;e<r.length;e++)r[e]=n.charCodeAt(e)};function QS(e){let t=e.game;return{v:11,level:e.world.def.id,tick:e.tick,rng:e.rng.state(),game:{...BS(t,HS),station:structuredClone(t.station)},player:BS(e.player,US),body:BS(e.player.body,WS),doors:e.doors.map(e=>BS(e,GS)),platforms:e.platforms.map(e=>BS(e,KS)),loose:e.loose.all.map(e=>BS(e,qS)),items:structuredClone(e.items),spent:e.usables.filter(e=>e.off&&e.key).map(e=>e.key),cast:e.cast.map(e=>({...BS(e,JS),ride:structuredClone(e.ride),blow:structuredClone(e.blow),rag:structuredClone(e.rag),body:e.body?BS(e.body,WS):null})),hands:structuredClone(e.hands),on:[e.player.body,...e.loose.all,...e.cast.map(e=>e.body)].map(e=>e?YS(e):0),cams:e.cams.map(e=>({broken:e.broken,hold:e.hold,tripped:e.tripped})),alarms:e.alarms.map(Fl),drills:structuredClone(e.drills),...e.opening?{opening:structuredClone(e.opening)}:{},...e.pools.length?{pools:structuredClone(e.pools)}:{},mute:[...e.mute],fields:e.fields&&{from:e.fields.from,turn:e.fields.turn,made:{...e.fields.made},crawl:XS(e.fields.crawl),hands:XS(e.fields.hands),big:XS(e.fields.big),sound:XS(e.fields.sound)}}}function $S(e,t,n={}){let r=!!n.game;if(t.v!==11)throw Error(`save version ${t.v}, expected 11`);if(t.level!==e.id)throw Error(`save is of ${t.level}, not ${e.id}`);let i=_u(e,{...n,opening:!!t.opening}),a=i.game;a.events.length=0,i.tick=t.tick,r||(i.rng=new d(t.rng),VS(a,t.game),a.notes=ai(a.code,a.code2)),VS(i.player,t.player),VS(i.player.body,t.body),Hr(i.player.body),i.doors.forEach((e,n)=>{VS(e,t.doors[n]),Object.assign(e.dyn,Li(e,e.t))}),i.platforms.forEach((e,n)=>{VS(e,t.platforms[n]),ki(e)}),i.loose.all.forEach((e,n)=>{VS(e,t.loose[n]),e.sync()}),i.items=structuredClone(t.items),i.usables=$l(i);let o=new Set(t.spent);for(let e of i.usables)e.key&&o.has(e.key)&&(e.off=!0);i.cast.forEach((e,n)=>{let{body:r,ride:a,blow:o,rag:s,...c}=t.cast[n];if(VS(e,c),e.ride=structuredClone(a)??null,e.blow=structuredClone(o)??null,e.rag=structuredClone(s)??null,e.body&&(VS(e.body,r),Hr(e.body),e.dead)){let t=i.world.dyn.indexOf(e.body.dyn);t>=0&&i.world.dyn.splice(t,1)}e.dead&&!e.away&&s===void 0&&(e.rag=fa(e))}),i.hands={...Fo(),...structuredClone(t.hands)},i.lighting=null;let s=i.fields,c=t.fields;s&&c&&(s.from=c.from,s.turn=c.turn,s.made={...c.made},ZS(c.crawl,s.crawl),ZS(c.hands,s.hands),ZS(c.big,s.big),ZS(c.sound,s.sound));for(let e of i.cast)Ps(i,e);i.cams.forEach((e,n)=>{let r=t.cams?.[n];r&&(e.broken=r.broken,e.hold=r.hold,e.tripped=r.tripped)}),i.mute=[...t.mute??[]],i.drills=structuredClone(t.drills??[]),i.opening=t.opening?structuredClone(t.opening):null,i.pools=structuredClone(t.pools??[]),Il(i,t.alarms??[]);let l=new Map(i.world.dyn.map(e=>[e.id,e]));return[i.player.body,...i.loose.all,...i.cast.map(e=>e.body)].forEach((e,n)=>{e&&(e.on=l.get(t.on[n])??null)}),i}var eC=new Map;function tC(e,t){let n=eC.get(t);if(!n){let r=e.levels.find(e=>e.id===t);if(!r)throw Error(`no level `+t+` in the station`);eC.set(t,n=r.build())}return n}function nC(e,t={}){let n=t.start??e.start,r=_u(tC(e,n),{seed:t.seed,station:e,opening:t.opening});return{station:e,sims:new Map([[n,r]]),here:r}}function rC(e,t){Su(e.here,t);let n=e.here.game,r=n.travel;r&&(n.travel=null,iC(e,r.level,r.mark))}function iC(e,t,n){let r=e.here;if(!e.station)return;let i=e.sims.get(t);i||(i=_u(tC(e.station,t),{station:e.station,game:r.game,rng:r.rng}),e.sims.set(t,i));let a=i.world.def.marks[n]??i.world.def.start,o=r.player,s=i.player,c=s.body;Object.assign(s,{yaw:a.yaw,pitch:0,crouch:!1,wantStand:!1,air:o.air,airMax:o.airMax,slow:0,load:0,slam:0,thrown:!1,pace:1,down:!1,stepD:0,fly:o.fly}),c.x=a.x,c.y=a.y,c.z=a.z,c.vx=c.vz=c.vy=0,c.ground=!0,c.h=1.8,c.on=null,Hr(c),i.hands=structuredClone(r.hands),i.lighting=null,e.here=i,r.game.events.push({type:`level`,id:t})}function aC(e){return{station:null,sims:new Map([[e.world.def.id,e]]),here:e}}function oC(e){let t={};for(let n of[...e.sims.keys()].sort())t[n]=QS(e.sims.get(n));return{v:11,here:e.here.world.def.id,levels:t}}function sC(e,t){if(t.v!==11)throw Error(`save version ${t.v}, expected 11`);let n=$S(tC(e,t.here),t.levels[t.here],{station:e}),r=new Map([[t.here,n]]);for(let[i,a]of Object.entries(t.levels))i!==t.here&&r.set(i,$S(tC(e,i),a,{station:e,game:n.game,rng:n.rng}));return n.rng.restore(t.levels[t.here].rng),{station:e,sims:r,here:n}}var cC=new Set([`fuse`,`kit`,`rebreather`]),lC=2.4;function uC(e,t,n,r,i){let a=[];for(let o=0;o<e.n;o++){let s=n-e.y[o];s<-.5||s>2.5||Math.hypot(e.x[o]-t,e.z[o]-r)<=i&&a.push(o)}return a}function dC(e,t){let n=e.world.def,r=ai(``,``),i=new Map;for(let[e,t]of Object.entries(r))t.b.includes(``)?i.set(e,`#1`):t.b.includes(``)&&i.set(e,`#2`);let a=new Map;n.doors.forEach((e,n)=>{e.lift&&a.set(n,uC(t,(e.x0+e.x1)/2,e.y0+1.3,(e.z0+e.z1)/2,2.6))});let o=new Uint8Array(t.n),s=new Uint8Array(t.n),c=n.uses.map(e=>uC(t,e.x,e.y,e.z,2.4));for(let n=0;n<t.n;n++)e.world.waterAt(t.x[n],t.z[n])>t.y[n]+t.head[n]-.18&&(o[n]=1);return n.uses.forEach((e,t)=>{if(e.kind===`dive`&&!e.opts.under)for(let e of c[t])s[e]=1}),{nav:t,level:n,codeNotes:i,liftDoorAt:a,doorAt:n.doors.map(e=>uC(t,(e.x0+e.x1)/2,e.y0+1.3,(e.z0+e.z1)/2,2.6)),itemIds:e.items.map(e=>e.id),mainGoal:!1,airless:o,wet:o.some(e=>e===1),exit:s,useAt:c,itemAt:e.items.map(e=>uC(t,e.x,e.y+.05,e.z,2)),noteAt:n.notes.map(e=>uC(t,e.x,e.y+.05,e.z,2))}}var fC=(e,t)=>si({station:e.station},t);function pC(e,t,n){if(e.seal||e.lift)return!1;if(e.stuck||e.vent)return!0;let r=fC(n,e.circuit),i=!!(e.card||e.code)&&!n.have.has(`d`+t);return e.kind===`heavy`?r===2&&!i:!i}function mC(e,t){return e.level.doors.map((e,n)=>+!!pC(e,n,t)).join(``)+e.level.platforms.map(e=>+(!e.call||fC(t,e.call.circuit)>=1)).join(``)}var hC=e=>ko(e.have.has(`rebreather`)?[`rebreather`]:[]);function gC(e,t){if(e.wet)return _C(e,t);let n=e.nav,r=new Uint8Array(n.n),i=[t.at],a=e.level.doors.map((e,n)=>pC(e,n,t)),o=e.level.platforms.map(e=>!e.call||fC(t,e.call.circuit)>=1);for(r[t.at]=1;i.length;){let e=i.pop();for(let t=n.start[e];t<n.start[e+1];t++){let e=n.to[t];r[e]||n.door[e]>=0&&!a[n.door[e]]||(n.kind[t]!==Dr.Lift||o[n.lift[t]])&&(r[e]=1,i.push(e))}}return r}function _C(e,t){let n=e.nav,r=n.n,i=hC(t),a=MC(n),o=e.level.doors.map((e,n)=>pC(e,n,t)),s=e.level.platforms.map(e=>!e.call||fC(t,e.call.circuit)>=1),c=(e,t)=>!(n.door[t]>=0&&!o[n.door[t]])&&!(n.kind[e]===Dr.Lift&&!s[n.lift[e]]),l=(t,r,i)=>e.airless[r]||e.airless[i]?n.len[t]/lC:0,u=new Float32Array(r).fill(1/0),d=new vC;for(let t=0;t<r;t++)(!e.airless[t]||e.exit[t])&&(u[t]=0,d.push(t,0));for(let e=d.pop();e>=0;e=d.pop())for(let t=a.start[e];t<a.start[e+1];t++){let n=a.edge[t],r=a.from[t];if(!c(n,e))continue;let i=u[e]+l(n,r,e);i<u[r]&&(u[r]=i,d.push(r,i))}let f=new Float32Array(r).fill(-1),p=new vC;f[t.at]=e.airless[t.at]?t.air:i,p.push(t.at,-f[t.at]);for(let t=p.pop();t>=0;t=p.pop())for(let r=n.start[t];r<n.start[t+1];r++){let a=n.to[r];if(!c(r,a))continue;let o=f[t]-l(r,t,a);if(o<0)continue;let s=e.airless[a]?o:i;s>f[a]&&(f[a]=s,p.push(a,-s))}let m=new Uint8Array(r);for(let e=0;e<r;e++)f[e]>=0&&f[e]>=u[e]-1e-6&&(m[e]=1);return m.air=f,m}var vC=class{k=[];v=[];push(e,t){let n=this.k,r=this.v,i=n.length;for(n.push(t),r.push(e);i>0;){let e=i-1>>1;if(n[e]<=n[i])break;[n[e],n[i]]=[n[i],n[e]],[r[e],r[i]]=[r[i],r[e]],i=e}}pop(){let e=this.k,t=this.v;if(!e.length)return-1;let n=t[0],r=e.pop(),i=t.pop();if(e.length){e[0]=r,t[0]=i;for(let n=0;;){let r=2*n+1,i=r+1,a=n;if(r<e.length&&e[r]<e[a]&&(a=r),i<e.length&&e[i]<e[a]&&(a=i),a===n)break;[e[a],e[n]]=[e[n],e[a]],[t[a],t[n]]=[t[n],t[a]],n=a}}return n}},yC=e=>{let t=e.station,n=Object.keys(t.circuits).sort().map(e=>{let n=t.circuits[e];return e+ +!!n.on+ +!!n.back+ +!!n.broken});return[e.at,[...e.have].sort().join(`,`),e.fuse,e.kit,+!!t.main,+!!t.fuseIn,n.join(``),Math.round(e.air)].join(`|`)},bC=(e,t,n=e.air)=>({have:new Set(e.have),fuse:e.fuse,kit:e.kit,station:structuredClone(e.station),at:t,air:n}),xC=(e,t)=>{let n=bC(e,t.at,t.air);return t.apply(n),n};function SC(e,t,n){let r=[],i=e.level,a=e=>{let t=-1;for(let r of e)n[r]&&(t<0||n.air&&n.air[r]>n.air[t])&&(t=r);return t},o=e=>n.air?n.air[e]:hC(t);return e.itemAt.forEach((n,i)=>{let s=e.itemIds[i],c=ti[s];if(t.have.has(`i`+i)||!(c?.key||cC.has(s)))return;let l=a(n);l<0||r.push({id:`item`+i,label:`take `+c.n.toLowerCase(),at:l,air:o(l),mono:!0,apply:e=>{e.have.add(`i`+i),c.key&&e.have.add(c.key),s===`fuse`&&e.fuse++,s===`kit`&&e.kit++,s===`rebreather`&&e.have.add(`rebreather`)}})}),e.noteAt.forEach((n,s)=>{let c=e.codeNotes.get(i.notes[s].key);if(!c||t.have.has(c))return;let l=a(n);l<0||r.push({id:`note`+s,label:`read `+i.notes[s].key,at:l,air:o(l),mono:!0,apply:e=>{e.have.add(c)}})}),i.doors.forEach((n,i)=>{if(!(n.card||n.code)||t.have.has(`d`+i)||n.seal||n.lift||!(n.card?t.have.has(n.card):t.have.has(`#`+n.code))||fC(t,n.circuit)===0)return;let s=a(e.doorAt[i]);s<0||r.push({id:`door`+i,label:(n.card?`use the card at door `:`key the code at door `)+i,at:s,air:o(s),mono:!0,apply:e=>{e.have.add(`d`+i)}})}),i.uses.forEach((n,i)=>{let s=a(e.useAt[i]);if(s<0)return;let c=n.opts,l=t.station,u=(e,t,n=!1)=>r.push({id:`use`+i,label:e,at:s,air:o(s),mono:n,apply:t});switch(n.kind){case`body`:if(t.have.has(`b`+i))return;u((c.label??`search the body`).toLowerCase(),e=>{e.have.add(`b`+i);for(let t of c.keys??[])e.have.add(t);c.note&&e.have.add(`#1`)},!0);break;case`backup`:{let e=c.c,t=l.circuits[e];t&&!t.back&&u(`start the `+e+` backup set`,t=>{t.station.circuits[e].back=!0},!0);break}case`panel`:{let e=c.c,n=l.circuits[e];if(!n)return;n.broken?t.kit>0&&u(`mend the `+e+` connection with a kit`,t=>{t.kit--,Object.assign(t.station.circuits[e],{broken:!1,on:!0})}):n.on||u(`close the `+e+` connection`,t=>{t.station.circuits[e].on=!0},!0);break}case`fuse`:!l.fuseIn&&t.fuse>0&&u(`seat the fuse`,e=>{e.fuse--,e.station.fuseIn=!0});break;case`breaker`:l.fuseIn&&!l.main&&u(`start Gen-1`,e=>{e.station.main=!0},!0)}}),r}function CC(e,t,n){let r=[],i=e.level,a=t.station;e.mainGoal&&a.main&&r.push(`Gen-1 running`),i.uses.forEach((o,s)=>{if(!e.useAt[s].some(e=>n[e]))return;let c=o.opts;if(o.kind===`ladder`){let e=a.ladders[c.id];if(!e||e.broken||e.need?.power&&fC(t,e.need.power)<1)return;let n=e.ends?.find(e=>e!==i.id);r.push(`ladder `+c.id+(n?` to `+(a.names[n]??n):``))}else o.kind===`stair`?r.push(`stairs to `+c.to):o.kind===`dive`?r.push(`dive to `+(a.names[c.to]??c.to)):o.kind===`elev`&&fC(t,c.c)>=1?r.push(`elevator to `+(a.names[c.to]??c.to)):o.kind===`lift`&&fC(t,`LIFT`)===2&&r.push(`the lift`)});for(let[a,o]of e.liftDoorAt){let e=i.doors[a];o.some(e=>n[e])&&fC(t,e.circuit)===2&&fC(t,i.circuit)===2&&(t.have.has(`surf`)||t.have.has(`lift`))&&r.push(`the surface`)}return r}function wC(e,t,n){let r=e.game,i=e.player.body,a=new Set([...r.keys,...n.have??[]]);for(let e of r.read){let t=r.notes[e];t?.b.includes(r.code)&&a.add(`#1`),t?.b.includes(r.code2)&&a.add(`#2`)}e.items.forEach((e,t)=>{e.taken&&a.add(`i`+t)});for(let t of e.usables)t.off&&t.key&&a.add(`b`+t.key.slice(3));let o=!!e.opening&&e.opening.phase!==`done`;e.doors.forEach((e,t)=>{(e.unlocked||o&&e.def.failsafe)&&a.add(`d`+t)});let s=r.station?structuredClone(r.station):{circuits:{},ladders:{},main:!0,fuseIn:!0,names:{},built:[]};o&&s.circuits.ISO&&(s.circuits.ISO.back=!1),n.main!==void 0&&(s.main=n.main),(r.worn.includes(`rebreather`)||n.rebreather)&&a.add(`rebreather`);let c=n.from??{x:i.x,y:i.y,z:i.z,air:e.player.air};return{have:a,station:s,at:t.locate(c.x,c.y,c.z),air:c.air,fuse:r.inv.find(e=>e.id===`fuse`)?.n??0,kit:r.inv.find(e=>e.id===`kit`)?.n??0}}function TC(e,t={}){let n=(e.fields??Vi(e)).nav,r=dC(e,n),i=r.itemIds,a=wC(e,n,t);if(r.mainGoal=!a.station.main,a.at<0)throw Error(`you are not standing anywhere on the nav graph`);r.airless[a.at]||(a.air=hC(a));let o=[],s=new Map,c=new Set,l=new Set,u=(e,t,n)=>{let r=yC(e);return s.has(r)?s.get(r):(s.set(r,o.length),o.push({st:e,from:t,steps:n,goals:[],next:[]}),o.length-1)};u(a,-1,[]);let d=t.limit??2e4,f=[],p=new Set,m=new Map,h=new Set;for(let t=0;t<o.length&&t<d;t++){let i=o[t],a=gC(r,i.st),s=AC(r,i.st),d=i.st.at;for(let e=0;e<n.n;e++)if(a[e]&&s[e]){d=e;break}let g=mC(r,i.st),_=g+`|`+d+`|`+yC({...i.st,at:-1}),v=m.get(_);if(v!==void 0){i.next.push(v);continue}m.set(_,t);for(let e=0;e<n.n;e++)a[e]&&n.room[e]>=0&&c.add(n.room[e]);r.itemAt.forEach((e,t)=>{e.some(e=>a[e])&&l.add(t)}),i.goals=CC(r,i.st,a);let y=SC(r,i.st,a);if(y.some(e=>e.mono&&a[e.at]&&s[e.at])){let e=bC(i.st,i.st.at),n=[];for(let t=0;t<1e3;t++){let t=gC(r,e),i=AC(r,e),a=SC(r,e,t).find(e=>e.mono&&t[e.at]&&i[e.at]);if(!a)break;a.apply(e),n.push(a)}i.next.push(u(e,t,n))}else for(let e of y)i.next.push(u(xC(i.st,e),t,[e]));if(h.has(g+`|`+d))continue;h.add(g+`|`+d);let b=new Uint8Array(n.n);for(let c=0;c<n.n;c++){if(!a[c]||s[c]||b[c])continue;let l=bC(i.st,c,a.air?a.air[c]:i.st.air),u=gC(r,l),d=!1;for(let e=0;e<n.n;e++)u[e]&&(b[e]=1,s[e]&&(d=!0));if(d||CC(r,l,u).length||SC(r,l,u).length)continue;let m=n.room[c];p.has(m)||(p.add(m),f.push({room:m>=0?EC(e,m):`nowhere`,route:OC(o,t)}))}}let g=new Set(o.flatMap(e=>e.goals)),_=new Map,v=o.map(()=>[]);o.forEach((e,t)=>{for(let n of e.next)v[n].push(t)});for(let e of g){let t=new Uint8Array(o.length),n=[];for(o.forEach((r,i)=>{r.goals.includes(e)&&(t[i]=1,n.push(i))});n.length;){let e=n.pop();for(let r of v[e])t[r]||(t[r]=1,n.push(r))}_.set(e,t)}let y=[],b=new Set;o.forEach((e,t)=>{let n=[...g].filter(e=>!_.get(e)[t]),r=n.join(`|`);n.length&&!b.has(r)&&(b.add(r),y.push({lost:n,route:OC(o,t)}))});let x={};for(let e of g){let t=DC(o,o.findIndex(t=>t.goals.includes(e)));for(let n=t.length-1;n>=0;n--)kC(r,a,t.filter((e,t)=>t!==n),e)&&t.splice(n,1);x[e]=t.map(e=>e.label)}let S=t=>EC(e,t),C=e=>[...new Set(e.map(S))].sort(),w={};if(t.through)for(let e of g){let n=o[o.findIndex(t=>t.goals.includes(e))].st,i=gC(r,n),a=r.level.uses.findIndex((t,a)=>t.kind===`dive`&&t.opts.under&&e===`dive to `+(n.station.names[t.opts.to]??t.opts.to)&&r.useAt[a].some(e=>i[e]));if(a<0)continue;let s=r.level.uses[a].opts.to,c=t.through(s),l=c?.world.def.marks[`dive:`+r.level.id];if(!c||!l)continue;let u=r.useAt[a].filter(e=>i[e]).sort((e,t)=>(i.air?.[t]??0)-(i.air?.[e]??0))[0],d=i.air?i.air[u]:hC(n),f=TC(c,{from:{...l,air:d},rebreather:n.have.has(`rebreather`),main:n.station.main});w[e]={air:Math.round(d),rooms:f.rooms.reached,never:f.rooms.never,goals:Object.keys(f.goals).sort()}}return{air:{now:Math.round(r.airless[a.at]?a.air:hC(a)),max:hC(a)},through:w,states:o.length,rooms:{reached:C([...c]),never:C(e.world.rooms.map(e=>e.id).filter(e=>!c.has(e)&&(n.byRoom.get(e)?.length??0)>0)).filter(e=>!C([...c]).includes(e))},items:{reached:[...l].map(e=>ti[i[e]]?.n??i[e]).sort(),never:i.map((e,t)=>[e,t]).filter(([,t])=>!l.has(t)&&!e.items[t].taken).map(([e])=>ti[e]?.n??e).sort()},goals:x,softLocks:y,deadEnds:f}}function EC(e,t){let n=e.world.rooms[t];if(n.name)return n.name;let r=e.world.neighbours(t).map(t=>e.world.rooms[t].name).filter(Boolean);return r.length?`the doorway between `+r.join(` and `):`room `+t}function DC(e,t){let n=[];for(let r=t;r>0;r=e[r].from)n.push(e[r].steps);return n.reverse().flat()}var OC=(e,t)=>DC(e,t).map(e=>e.label);function kC(e,t,n,r){let i=t;for(let t of n){let n=SC(e,i,gC(e,i)).find(e=>e.id===t.id);if(!n)return!1;i=xC(i,n)}return CC(e,i,gC(e,i)).includes(r)}function AC(e,t){let n=e.nav,r=new Uint8Array(n.n),i=[t.at],a=MC(n),o=e.level.doors.map((e,n)=>pC(e,n,t)),s=e.level.platforms.map(e=>!e.call||fC(t,e.call.circuit)>=1);for(r[t.at]=1;i.length;){let e=i.pop();if(!(n.door[e]>=0&&!o[n.door[e]]))for(let t=a.start[e];t<a.start[e+1];t++){let e=a.edge[t],c=a.from[t];r[c]||(n.kind[e]!==Dr.Lift||s[n.lift[e]])&&(n.door[c]>=0&&!o[n.door[c]]||(r[c]=1,i.push(c)))}}return r}var jC=new WeakMap;function MC(e){let t=jC.get(e);if(t)return t;let n=e.n,r=e.to.length,i=new Int32Array(n+1),a=new Int32Array(r),o=new Int32Array(r);for(let t=0;t<r;t++)i[e.to[t]+1]++;for(let e=0;e<n;e++)i[e+1]+=i[e];let s=i.slice(0,n);for(let t=0;t<n;t++)for(let n=e.start[t];n<e.start[t+1];n++){let r=s[e.to[n]]++;a[r]=n,o[r]=t}return jC.set(e,t={start:i,edge:a,from:o}),t}function NC(e){let t=[`${e.states} states searched.`];t.push(`Rooms reached: ${e.rooms.reached.length}; never: ${e.rooms.never.join(`, `)||`none`}.`),t.push(`Things never in reach: ${e.items.never.join(`, `)||`none`}.`),t.push(`Air: ${e.air.now} s of ${e.air.max}.`);for(let[n,r]of Object.entries(e.goals)){t.push(`${n}: ${r.length?r.join(` → `):`from where you stand`}.`);let i=e.through[n];i&&t.push(`  down there on ${i.air} s of air: ${i.rooms.join(`, `)||`nowhere`}${i.never.length?`; out of reach: `+i.never.join(`, `):``}; ways on: ${i.goals.join(`, `)||`none`}.`)}Object.keys(e.goals).length||t.push(`No way off the level can be reached.`);for(let n of e.softLocks)t.push(`SOFT-LOCK: ${n.route.join(` → `)} loses ${n.lost.join(`, `)}.`);for(let n of e.deadEnds)t.push(`DEAD END: ${n.room}, after ${n.route.join(` → `)||`nothing`}.`);return t.join(`
`)}function PC(e){try{return localStorage.getItem(e)}catch{return null}}function FC(e,t){try{t===null?localStorage.removeItem(e):localStorage.setItem(e,t)}catch{}}var IC=e=>e.kind===`body`||!!e.glass,LC={near:1,far:20,ease:6},RC=class{cy=NaN;eye=1.62;at={x:0,y:0,z:0,yaw:0,pitch:0};bob=0;shake=0;beam={x:0,y:0,z:-1};snap=!0;t=0;bounce=0;aim=LC.far;jolt={y:0,p:0,r:0};fall=0;impact(e){this.jolt.p-=.022*e,this.jolt.r+=.012*e}struck(e){let t=Math.sin(e),n=Math.cos(e);this.jolt.y+=.07*t,this.jolt.r-=.06*t,this.jolt.p+=.045*n}reset(){this.cy=NaN,this.snap=!0}update(t,n,r,i,o,s){let c=n.player,l=c.body,u=r.x+(l.x-r.x)*i,d=r.y+(l.y-r.y)*i,f=r.z+(l.z-r.z)*i;Number.isNaN(this.cy)&&(this.cy=d),this.cy+=(d-this.cy)*Math.min(1,o*18);let p=n.hands,m=p.down>0?1:p.rise>0?p.rise/io.rise:0;this.fall+=(m-this.fall)*Math.min(1,o*(m>this.fall?12:5));let h=c.crouch?.95:1.62;this.eye+=(h+(.35-h)*this.fall-this.eye)*Math.min(1,o*(this.fall>.01?14:10)),this.bob+=c.moved/e*o*3.3;let g=c.yaw+s.yaw,_=a(c.pitch+s.pitch,-1.45,1.45);this.at.x=u,this.at.y=this.cy,this.at.z=f,this.at.yaw=g,this.at.pitch=_,this.shake=Math.max(0,this.shake-o*1.6);let v=this.shake*.08,y=()=>(Math.random()*2-1)*v;t.position.set(u+y(),this.cy+this.eye+Math.sin(this.bob)*.035+y(),f+y());let b=this.jolt,x=Math.exp(-o*9);b.y*=x,b.p*=x,b.r*=x,t.rotation.set(_+b.p+.3*this.fall,g+b.y,b.r-.45*p.side*this.fall),Z.uFlashPos.value.set(t.position.x-Math.cos(g)*.22,t.position.y-.3,t.position.z+Math.sin(g)*.22),this.t+=o;let S=Math.min(1,c.moved/e/3),C=g+Math.sin(this.bob*.5)*.022*S+Math.sin(this.t*.7)*.004,w=_+(Math.abs(Math.cos(this.bob*.5))-.6)*.03*S+Math.sin(this.t*1.1)*.005,T=Math.cos(w),E={x:-Math.sin(C)*T,y:Math.sin(w),z:-Math.cos(C)*T},D=this.beam,O=this.snap?1:1-Math.exp(-o*14),k=this.snap;this.snap=!1,D.x+=(E.x-D.x)*O,D.y+=(E.y-D.y)*O,D.z+=(E.z-D.z)*O;let A=Math.hypot(D.x,D.y,D.z)||1;D.x/=A,D.y/=A,D.z/=A;let j=n.game,ee=j.batt<15?.6:1;Z.uFlash.value=j.lightOn&&j.light===`flash`?ee:0;let M=u,te=this.cy+this.eye,ne=f,re=LC.far,ie=Z.uFlash.value>0?n.world.raycast(M,te,ne,M+D.x*re,te+D.y*re,ne+D.z*re,IC)*re:re,ae=Math.max(LC.near,ie),oe=Z.uFlashPos.value;this.aim=k?ae:this.aim+(ae-this.aim)*Math.min(1,o*LC.ease);let se=t.position.x+D.x*this.aim-oe.x,ce=t.position.y+D.y*this.aim-oe.y,le=t.position.z+D.z*this.aim-oe.z,ue=Math.hypot(se,ce,le)||1;Z.uFlashDir.value.set(se/ue,ce/ue,le/ue);let de=ie/dr.reach,fe=de<1?Z.uFlash.value*dr.gain/(1+dr.hit*(de*dr.reach)**2):0;this.bounce+=(fe-this.bounce)*Math.min(1,o*10),Z.uBounce.value=this.bounce,Z.uLamp.value=n.hands.muzzle>0?2.5:j.lightOn&&j.light===`lantern`?ee:0}},zC=.0022,BC=class{canvas;onUnlock;onHint;keys={};press={jump:!1,crouch:!1,light:!1,use:!1};onKey=new Map;pending={yaw:0,pitch:0};dragLook=!1;dragging=!1;mouse=!1;clicked=!1;q=!1;everLocked=!1;drag=null;enabled=!1;touch=null;constructor(e,t,n=()=>{}){this.canvas=e,this.onUnlock=t,this.onHint=n,window.addEventListener(`keydown`,e=>{(e.code===`Tab`||e.code===`Space`)&&e.preventDefault(),!e.repeat&&(this.keys[e.code]=!0,this.enabled&&(e.code===`Space`?this.press.jump=!0:e.code===`KeyC`?this.press.crouch=!0:e.code===`KeyF`?this.press.light=!0:e.code===`KeyE`?this.press.use=!0:e.code===`KeyQ`?(this.q=!0,this.clicked=!0):e.code===`Escape`&&this.dragLook&&this.onUnlock(),this.onKey.get(e.code)?.()))}),window.addEventListener(`keyup`,e=>{this.keys[e.code]=!1,e.code===`KeyQ`&&(this.q=!1)}),window.addEventListener(`blur`,()=>{this.keys={},this.mouse=!1,this.q=!1}),document.addEventListener(`mousemove`,e=>{this.enabled&&(this.locked()||this.dragLook&&this.dragging)&&(this.drag&&(this.drag.moved+=Math.abs(e.movementX)+Math.abs(e.movementY)),this.pending.yaw-=e.movementX*zC,this.pending.pitch-=e.movementY*zC)}),e.addEventListener(`mousedown`,e=>{if(this.enabled){if(this.dragLook){this.dragging=!0,this.drag={moved:0,t:performance.now()};return}e.button===0&&(this.mouse=!0,this.clicked=!0)}}),window.addEventListener(`mouseup`,e=>{this.dragging=!1,this.drag?(this.enabled&&this.drag.moved<5&&performance.now()-this.drag.t<250&&(this.clicked=!0),this.drag=null):e.button===0&&(this.mouse=!1)}),document.addEventListener(`pointerlockchange`,()=>{this.locked()?this.everLocked=!0:this.enabled&&!this.dragLook&&this.onUnlock()}),document.addEventListener(`pointerlockerror`,()=>this.lockFail())}locked(){return document.pointerLockElement===this.canvas}lock(){if(!(this.dragLook||this.touch))try{this.canvas.requestPointerLock()?.catch?.(()=>this.lockFail())}catch{this.lockFail()}}lockFail(){if(this.everLocked){this.enabled&&this.onUnlock();return}this.dragLook||(this.dragLook=!0,this.onHint(`Mouse capture is unavailable here. Hold a mouse button and drag to look. Hold Q to load a swing.`))}push(e){this.enabled&&(e===`attack`?this.clicked=!0:this.press[e]=!0)}look(e,t){this.enabled&&(this.pending.yaw+=e,this.pending.pitch+=t)}take(){let e=this.keys,t=gl(),n=this.touch;if(!this.enabled)return t;let r=e=>Math.max(-1,Math.min(1,e));return t.forward=r((e.KeyW||e.ArrowUp?1:0)-(e.KeyS||e.ArrowDown?1:0)+(n?.forward??0)),t.strafe=r((e.KeyD||e.ArrowRight?1:0)-(e.KeyA||e.ArrowLeft?1:0)+(n?.strafe??0)),t.run=!!(e.ShiftLeft||e.ShiftRight||n?.run),t.yaw=this.pending.yaw,t.pitch=this.pending.pitch,this.pending.yaw=0,this.pending.pitch=0,t.jump=this.press.jump,t.crouch=this.press.crouch,t.light=this.press.light,t.use=this.press.use,t.rise=!!(e.Space||n?.rise),t.sink=!!(e.KeyC||n?.sink),t.attack=this.mouse||this.clicked||this.q||!!n?.attack,this.clicked=!1,this.press={jump:!1,crouch:!1,light:!1,use:!1},t}},VC={door:46,roar:55,thud:40,hstep:18,moan:28,tap:24,skit:24,slosh:20,swing:10,whiff:14,heave:20,rasp:12,gust:24,strike:30,knock:32,groan:55,tick:12,settle:45,step:30,rattle:30,breath:10,mutter:20,click:14,gurgle:22,growl:30,slither:10,bubble:12,creak:12,drip:30,scrape:20,crate:30,klaxon:70,cam:16,smash:34,blow:30,"bolt-draw":24,bolt:26,"bolt-free":18,bang:40,taken:60,pump:14,static:8,struck:60,graft:70,winddown:45,"die-husk":40,"die-skitter":36,"die-bloat":46,"die-thresher":50,"die-worm":20,"die-swimmer":20,"die-grabber":24},HC=(e,t)=>e+Math.random()*(t-e),UC=class{ac=null;master;bus;amb;under;dest;noise;hum;bed;air;airTone;airPan=null;space=[];buzz;foot=!1;last={};changed(e,...t){let n=t.map(e=>e.toFixed(2)).join();return this.last[e]!==n&&(this.last[e]=n,!0)}start(){if(this.ac){this.ac.resume();return}try{let e=new AudioContext;this.ac=e,this.master=e.createGain(),this.master.gain.value=.55,this.master.connect(e.destination),this.under=e.createBiquadFilter(),this.under.type=`lowpass`,this.under.frequency.value=22e3,this.under.connect(this.master),this.bus=e.createGain(),this.bus.connect(this.under),this.amb=e.createGain(),this.amb.connect(this.under),this.dest=this.bus;for(let[t,n]of[[.45,.2],[1.6,.4],[3.4,.6]]){let r=e.createConvolver(),i=e.createGain();r.buffer=this.impulse(t,n),i.gain.value=0,this.bus.connect(r),r.connect(i),i.connect(this.under),this.space.push(i)}this.noise=e.createBuffer(1,e.sampleRate,e.sampleRate);let t=this.noise.getChannelData(0);for(let e=0;e<t.length;e++)t[e]=Math.random()*2-1;for(let t of[46,49.3]){let n=e.createOscillator(),r=e.createGain();n.frequency.value=t,r.gain.value=.06,n.connect(r),r.connect(this.amb),n.start()}let n=e.createOscillator(),r=e.createOscillator(),i=e.createBiquadFilter(),a=e.createGain(),o=e.createGain(),s=e.createStereoPanner?e.createStereoPanner():null;n.type=`sawtooth`,n.frequency.value=25,r.frequency.value=12.5,o.gain.value=1.4,i.type=`lowpass`,i.frequency.value=220,a.gain.value=0,n.connect(i),r.connect(o),o.connect(i),i.connect(a),s?(a.connect(s),s.connect(this.amb)):a.connect(this.amb),n.start(),r.start(),this.hum={o:n,sub:r,g:a,f:i,p:s};let c=e.createBufferSource(),l=e.createBiquadFilter();c.buffer=this.noise,c.loop=!0,l.type=`bandpass`,l.frequency.value=240,l.Q.value=.6,this.bed=e.createGain(),this.bed.gain.value=0,c.connect(l),l.connect(this.bed),this.bed.connect(this.amb),c.start();let u=e.createBufferSource(),d=e.createBiquadFilter(),f=e.createBiquadFilter();u.buffer=this.noise,u.loop=!0,u.playbackRate.value=.7,d.type=`bandpass`,d.frequency.value=900,d.Q.value=.45,f.type=`lowpass`,f.frequency.value=2600,this.air=e.createGain(),this.air.gain.value=0,this.airTone=f,this.airPan=e.createStereoPanner?e.createStereoPanner():null,u.connect(d),d.connect(f),f.connect(this.air),this.airPan?(this.air.connect(this.airPan),this.airPan.connect(this.amb)):this.air.connect(this.amb),u.start();let p=e.createOscillator(),m=e.createBiquadFilter();p.type=`sawtooth`,p.frequency.value=120,m.type=`highpass`,m.frequency.value=900,this.buzz=e.createGain(),this.buzz.gain.value=0,p.connect(m),m.connect(this.buzz),this.buzz.connect(this.amb),p.start()}catch{this.ac=null}}impulse(e,t){let n=this.ac,r=n.sampleRate,i=Math.floor(e*r),a=Math.floor(.012*r),o=n.createBuffer(2,i,r);for(let n=0;n<2;n++){let s=o.getChannelData(n),c=0;for(let n=a;n<i;n++){let i=(n-a)/r,o=Math.min(.97,t+.5*i/e);c=c*o+(Math.random()*2-1)*(1-o),s[n]=c*Math.exp(-6.9*i/e)/Math.sqrt((1-o)/(1+o))}}return o}setHum(e,t=1,n=0,r=0){if(!this.ac||!this.changed(`hum`,+e,t,n,r))return;let i=this.ac.currentTime,a=this.hum;a.o.frequency.setTargetAtTime(e?100:25,i,e?.8:1.6),a.sub.frequency.setTargetAtTime(e?50:12.5,i,e?.8:1.6),a.g.gain.setTargetAtTime(e?.12*t:0,i,e?.5:1.4),a.f.frequency.setTargetAtTime(160+1100*t*(1-n),i,.3),a.p?.pan.setTargetAtTime(r,i,.1)}setSpace(e,t,n){if(!this.ac||!this.changed(`space`,e,t,n))return;let r=this.ac.currentTime;[e,t,n].forEach((e,t)=>this.space[t].gain.setTargetAtTime(e,r,.35))}setBuzz(e,t){this.ac&&this.changed(`buzz`,e,+t)&&this.buzz.gain.setTargetAtTime(.018*e*(t?.12:1),this.ac.currentTime,.008)}setUnder(e){this.ac&&this.changed(`under`,+e)&&this.under.frequency.setTargetAtTime(e?420:22e3,this.ac.currentTime,e?.05:.12)}setAir(e,t=0,n=0){if(!this.ac||!this.changed(`air`,e,Math.round(t*20),Math.round(n*20)))return;let r=this.ac.currentTime;this.air.gain.setTargetAtTime(.03*e*(.55+.9*t),r,e>0?1.2:.9),this.airTone.frequency.setTargetAtTime(2e3+2400*t,r,.3),this.airPan?.pan.setTargetAtTime(n*t,r,.2)}setBed(e){this.ac&&this.changed(`bed`,e)&&this.bed.gain.setTargetAtTime(.05*e,this.ac.currentTime,.8)}chain(e,t){let n=this.ac,r=this.bus;if(e&&n.createStereoPanner){let t=n.createStereoPanner();t.pan.value=e,t.connect(r),r=t}if(t>.02){let e=n.createBiquadFilter();e.type=`lowpass`,e.frequency.value=18e3*(300/18e3)**Math.min(1,t),e.connect(r),r=e}return r}tn(e,t,n,r,i,a=0,o=0){if(i<.003)return;let s=this.ac,c=s.createOscillator(),l=s.createGain(),u=s.currentTime+a;c.type=r,c.frequency.setValueAtTime(e,u),c.frequency.exponentialRampToValueAtTime(Math.max(1,t),u+n),o>0?(l.gain.setValueAtTime(.001,u),l.gain.linearRampToValueAtTime(i,u+o)):l.gain.setValueAtTime(i,u),l.gain.exponentialRampToValueAtTime(.001,u+Math.max(n,o+.01)),c.connect(l),l.connect(this.dest),c.start(u),c.stop(u+Math.max(n,o)+.02)}nz(e,t,n,r=`lowpass`,i=0,a=1,o=0,s=0){if(t<.003)return;let c=this.ac,l=c.createBufferSource(),u=c.createBiquadFilter(),d=c.createGain(),f=c.currentTime+i;l.buffer=this.noise,u.type=r,u.frequency.setValueAtTime(n,f),u.Q.value=a,o>0&&u.frequency.exponentialRampToValueAtTime(o,f+e),s>0?(d.gain.setValueAtTime(.001,f),d.gain.linearRampToValueAtTime(t,f+s)):d.gain.setValueAtTime(t,f),d.gain.exponentialRampToValueAtTime(.001,f+Math.max(e,s+.01)),l.connect(u),u.connect(d),d.connect(this.dest),l.start(f,Math.random()*.5,Math.max(e,s)+.05)}step(e,t,n=0){let r=HC(.88,1.12)*((this.foot=!this.foot)?1:.94);switch(e){case`metal`:this.tn(95*r,60,.08,`sine`,.4*t,n),this.nz(.05,.55*t,1300*r,`bandpass`,n,1.2),this.tn(380*r,365*r,.18,`triangle`,.16*t,n),this.tn(1130*r,1090*r,.1,`triangle`,.07*t,n),this.nz(.04,.25*t,2400*r,`bandpass`,n+.05,1.5);break;case`rock`:this.tn(90*r,50,.06,`sine`,.35*t,n);for(let e=0,r=n;e<4;e++,r+=HC(.01,.025))this.nz(.025,HC(.25,.5)*t,HC(1800,3600),`bandpass`,r,2);break;case`wood`:this.tn(190*r,130*r,.12,`sine`,.55*t,n),this.tn(420*r,300,.05,`triangle`,.12*t,n),this.nz(.05,.35*t,500,`lowpass`,n);break;case`wet`:this.tn(90,55,.06,`sine`,.3*t,n),this.nz(.12,.45*t,1800*r,`bandpass`,n,.7,900),this.nz(.16,.25*t,600*r,`bandpass`,n+.02,1);break;default:this.tn(110*r,55,.07,`sine`,.5*t,n),this.nz(.05,.6*t,700*r,`bandpass`,n,.8),this.nz(.04,.3*t,1500*r,`bandpass`,n+.045,1)}}heavy(e,t,n){let r=HC(.85,1.15);if(this.tn(58*r,32,.22,`sine`,.55*t),this.nz(.16,.5*t,160*r),n){this.tread(n,.3*t,0,1.5);return}if(e===`wet`){this.nz(.35,.4*t,900,`bandpass`,.02,.8,300);return}this.step(e,.3*t)}impact(e,t,n,r=1,i=0){let a=h[e].ring,o=HC(.92,1.08)/r;this.nz(a.clickT*(1.3-.5*n),t*(.35+.4*n),a.click*o*(.7+.6*n),`bandpass`,i,.9);let s=a.build===`sheet`||a.build===`grate`,c=a.build===`sheet`?1.5:a.build===`hollow`?1.2:1;for(let[e,r,l]of a.modes){let u=a.base*e*o,d=r*(e<=1?1:n+(1-n)/e);this.tn(u,s?u*.985:u*.75,l*c*(.6+.4*n),s&&n>.5?`triangle`:`sine`,t*d*.45,i)}if(a.build===`hollow`&&(this.tn(130*o,75*o,.13,`sine`,t*.5,i),this.nz(.07,t*.3,480,`lowpass`,i)),a.build===`grate`)for(let e=0,n=i+.03;e<3;e++,n+=HC(.015,.03))this.nz(.02,t*HC(.12,.25),HC(2e3,3200),`bandpass`,n,3);for(let e=0,n=i;e<a.grit;e++,n+=HC(.01,.025))this.nz(.025,HC(.25,.5)*t,HC(1800,3600),`bandpass`,n,2)}tread(e,t,n=0,r=1){let i=HC(.88,1.12)*((this.foot=!this.foot)?1:.94),a=h[e].ring;t*=.62,this.tn(100*i/r,50,.07,`sine`,.45*t,n),this.impact(e,t,.35,r,n),a.build===`solid`&&!a.grit&&this.impact(e,.45*t,.45,r*1.3,n+.045)}scrape(e,t,n){let r=h[e].ring,i=h[t].ring;this.nz(.25,.12*n,r.click*.45,`bandpass`,0,2,r.click*.75,.03),this.nz(.2,.08*n,150,`lowpass`);for(let[e,t]of i.modes.slice(0,2))this.nz(.22,.06*n*t,i.base*e,`bandpass`,.02,10);if(r.build===`grate`)for(let e=0,t=.02;e<4;e++,t+=HC(.03,.06))this.nz(.02,n*HC(.06,.12),HC(2e3,3200),`bandpass`,t,3)}play(e,t={}){if(!this.ac)return;let n=Math.max(0,Math.min(1,1-(t.d??0)/(VC[e]??22)));if(n<=0)return;n*=n;let r=!!t.big,i=t.surf??`concrete`,a=t.k??.5;this.dest=this.chain(t.pan??0,t.muffle??0);try{switch(e){case`step`:t.mat?this.tread(t.mat,.16*n):this.step(i,.16*n);break;case`land`:t.mat?this.tread(t.mat,.16+.25*a):this.step(i,.16+.25*a),this.tn(80,40,.12+.1*a,`sine`,.25+.5*a),this.nz(.15+.15*a,.15+.5*a,200),a>.5&&this.nz(.08,.15*a,3200,`highpass`,.05);break;case`jump`:this.nz(.08,.1,900,`bandpass`,0,1,500),this.nz(.15,.04,2500,`bandpass`,.02,1,1200,.04);break;case`slosh`:this.nz(.3,.22*n,HC(600,800),`bandpass`,0,1,400),this.nz(.2,.15*n,250);break;case`stroke`:this.nz(.45,.14*n,500,`bandpass`,0,.8,1100,.15),this.nz(.3,.08*n,250,`lowpass`,.1);break;case`splash`:this.nz(.6,.5*a,900,`bandpass`,0,.7,300),this.nz(.3,.35*a,3e3,`highpass`),this.tn(110,40,.25,`sine`,.3*a);break;case`gasp`:this.nz(.45,.12+.12*a,1300,`bandpass`,0,1.2,700,.05),this.nz(.5,.07,900,`bandpass`,.55,1.5,500,.1);break;case`heart`:this.tn(60,40,.12,`sine`,.2+.25*a),this.tn(55,38,.1,`sine`,.14+.18*a,.22);break;case`bubble`:for(let e=0,t=0;e<3+(r?3:0);e++,t+=HC(.04,.12)){let e=HC(350,900);this.tn(e,e*1.7,.05,`sine`,.07*n,t)}break;case`hstep`:if(r){this.heavy(i,n,t.mat);break}t.mat?this.tread(t.mat,.3*n):this.step(i,.3*n),Math.random()<.6&&this.nz(.18,.1*n,400,`bandpass`,.06,1.5,900,.05);break;case`tap`:{if(t.mat){for(let e=0,i=0;e<3;e++,i+=HC(.02,.035))this.impact(t.mat,(e?.07:.12)*n,1,r?1.4:2.6,i);break}let e=r?HC(450,650):HC(1200,1700);for(let t=0,r=0;t<3;t++,r+=HC(.02,.035))this.tn(e*HC(.9,1.1),e*.65,.025,`square`,(t?.06:.1)*n,r);i===`wet`&&this.nz(.1,.12*n,1600,`bandpass`,0,1);break}case`skit`:this.tn(900,1500,.15,`sawtooth`,.09*n);break;case`moan`:this.tn(190,120,.7,`sawtooth`,.12*n),this.tn(285,170,.6,`sine`,.1*n);break;case`roar`:this.tn(120,55,.8,`sawtooth`,.4*n),this.nz(.7,.3*n,600);break;case`swing`:this.nz(.14,.12*n,1200,`bandpass`);break;case`rasp`:this.nz(.22,.09*n,2e3,`bandpass`,0,3,900,.06),this.tn(1900,1300,.02,`square`,.05*n,.2);break;case`heave`:this.nz(.28,.1*n,1500,`bandpass`,0,2,2400,.12),this.tn(130,95,.32,`sawtooth`,.1*n,.24,.04);break;case`whiff`:this.nz(r?.32:.22,(r?.2:.15)*n,r?600:1e3,`bandpass`,0,1.5,r?200:320,.05);break;case`breath`:this.nz(.6,.06*n,600,`bandpass`,0,3,900,.4),this.nz(.9,.07*n,800,`bandpass`,.7,3,450,.2);break;case`mutter`:{let e=HC(120,170);this.tn(e,e*.7,.45,`sawtooth`,.07*n,0,.08),this.nz(.4,.05*n,650,`bandpass`,0,2,0,.08);break}case`click`:for(let e=0,t=0;e<2+Math.floor(Math.random()*3);e++,t+=HC(.06,.18))this.tn(HC(1800,2600),1400,.015,`square`,.06*n,t);break;case`gurgle`:this.nz(.8,.12*n,180,`bandpass`,0,4,420,.2),this.tn(70,58,.7,`sine`,.12*n,0,.2);break;case`growl`:this.tn(HC(62,74),55,1.2,`sawtooth`,.11*n,0,.3),this.nz(1.1,.1*n,280,`lowpass`,0,1,0,.3);break;case`slither`:this.nz(.35,.08*n,1200,`bandpass`,0,2,700,.1);break;case`creak`:{let e=HC(110,160);this.tn(e,e*.9,.6,`sawtooth`,.05*n,0,.2),this.nz(.5,.05*n,1800,`bandpass`,0,6,0,.2);break}case`die-husk`:this.tn(170,70,1.1,`sawtooth`,.14*n,0,.05),this.tn(255,90,.9,`sine`,.1*n),this.nz(.25,.45*n,140,`lowpass`,.55);break;case`die-skitter`:this.tn(1500,300,.5,`sawtooth`,.09*n),this.nz(.2,.3*n,200,`lowpass`,.3);break;case`die-bloat`:this.nz(1.3,.3*n,320,`bandpass`,0,2,110,.1),this.tn(90,40,1.2,`sawtooth`,.18*n),this.nz(.4,.7*n,110,`lowpass`,.9),this.tn(55,30,.35,`sine`,.5*n,.9);break;case`die-thresher`:this.tn(140,35,1.4,`sawtooth`,.35*n),this.nz(1.2,.3*n,400),this.nz(.35,.7*n,120,`lowpass`,.8),this.tn(50,30,.3,`sine`,.5*n,.8);break;case`die-worm`:case`die-swimmer`:this.nz(.3,.25*n,700,`bandpass`,0,1.5,200),this.tn(300,120,.3,`sine`,.08*n);break;case`die-grabber`:this.tn(220,90,.5,`sawtooth`,.1*n),this.nz(.1,.3*n,2500,`bandpass`,0,2);break;case`door`:this.nz(.4,.5*n,260),this.tn(85,48,.35,`sine`,.35*n),this.tn(320,180,.12,`square`,.05*n);break;case`thud`:this.nz(.25,.7*n,120);break;case`rattle`:for(let e=0,t=0;e<3;e++,t+=HC(.03,.08)){let e=HC(500,1400);this.tn(e,e*.96,.08,`triangle`,.08*n,t)}this.nz(.12,.25*n,1500,`bandpass`,0,1.5),this.tn(60,40,.1,`sine`,.2*n);break;case`crate`:if(t.mat){this.impact(t.by??`wood`,(.3+.38*a)*n,.5),this.impact(t.mat,(.17+.25*a)*n,.5,.8);break}this.tn(170,110,.15,`sine`,(.25+.4*a)*n),this.nz(.2,(.3+.4*a)*n,300),this.nz(.06,.15*a*n,2e3,`bandpass`,.01);break;case`scrape`:if(t.mat){this.scrape(t.mat,t.by??`wood`,n);break}this.nz(.25,.14*n,300,`bandpass`,0,2,520,.03),this.nz(.2,.1*n,150,`lowpass`);break;case`blow`:if(t.mat){this.tn(80,45,.08,`sine`,.2*n),this.impact(t.mat,.35*n,t.hard??.9);break}this.tn(900,700,.18,`triangle`,.15*n),this.nz(.05,.2*n,2e3,`bandpass`);break;case`zap`:this.nz(.06,.14*a,4200,`highpass`),this.tn(120,118,.05,`square`,.03*a);break;case`tink`:this.tn(2600,2100,.012,`square`,.025*a);break;case`knock`:for(let e=0,t=0,r=1+Math.round(a*4);e<r;e++,t+=HC(.1,.22)){let i=HC(140,190),a=1-e/(r+1);this.tn(i,i*.6,.09,`square`,.08*n*a,t),this.nz(.07,.12*n*a,700,`bandpass`,t,3)}break;case`groan`:this.tn(HC(48,62),HC(38,46),HC(1.6,2.6),`sawtooth`,.05*n,0,.6),this.nz(2.2,.035*n,240,`bandpass`,0,5,HC(380,520),.7);break;case`tick`:{let e=HC(2200,3400);this.tn(e,e*.8,.008,`square`,.035*n),Math.random()<.35&&this.tn(e*.9,e*.7,.008,`square`,.025*n,HC(.05,.12));break}case`settle`:this.nz(.9,.18*n,90,`lowpass`,0,1,0,.15);for(let e=0,t=HC(.3,.6);e<2+Math.floor(Math.random()*3);e++,t+=HC(.05,.3))this.tn(HC(1800,3200),1500,.02,`triangle`,.03*n,t);break;case`strike`:this.tn(2400,2e3,.012,`square`,.05*n),this.tn(100,100,.12,`square`,.03*n,.03),this.nz(.1,.04*n,3200,`bandpass`,.03,2);break;case`gust`:this.nz(1.4,(.12+.12*a)*n,260,`bandpass`,0,.7,520,.25),this.nz(.9,(.05+.05*a)*n,1400,`bandpass`,.1,1.2,700,.2);break;case`drip`:{let e=HC(1400,2600);a>.5||t.k===void 0?(this.tn(e,e*.5,.06,`sine`,.05*n),this.tn(e,e*.5,.06,`sine`,.015*n,.17)):(this.tn(e*.7,e*.45,.025,`triangle`,.04*n),this.nz(.03,.03*n,2500,`bandpass`,0,2));break}case`klaxon`:this.tn(620,600,.55,`square`,.07*n,0,.02),this.tn(470,455,.55,`square`,.07*n,.62,.02),this.nz(1.1,.03*n,900,`bandpass`,0,1);break;case`cam`:this.nz(.28,.06*n,2400,`bandpass`,0,4,1600,.04),this.tn(1900,1900,.06,`sine`,.06*n,.3);break;case`bolt-draw`:this.tn(110,160,.9,`sawtooth`,.05*n,0,.1),this.nz(.9,.05*n,900,`bandpass`,0,2,0,.1);break;case`bolt`:this.nz(.08,.6*n,1600,`bandpass`,0,1.2),this.tn(180,90,.12,`square`,.12*n);break;case`bolt-free`:this.nz(.06,.3*n,1200,`bandpass`),this.tn(140,200,.08,`square`,.06*n);break;case`bang`:this.tn(HC(95,120),60,.14,`sine`,.4*n),this.nz(.09,.3*n,HC(500,800),`bandpass`,0,1.2),this.tn(HC(1700,1900),1650,.3,`triangle`,.025*n,.01);break;case`taken`:this.tn(560,420,.4,`sawtooth`,.12*n,0,.02),this.nz(.35,.12*n,1200,`bandpass`,0,3,800,.02),this.tn(300,140,1.6,`sawtooth`,.07*n,.4,.2),this.nz(1.4,.06*n,500,`bandpass`,.4,2,250,.2),this.tn(75,40,.25,`sine`,.6*n,.7),this.nz(.2,.3*n,250,`lowpass`,.7);break;case`graft`:this.nz(5.5,.12*n,380,`bandpass`,0,3,220,.4),this.nz(5.5,.05*n,1800,`bandpass`,.2,6,900,.5);for(let[e,t]of[[.15,640],[1.6,560],[2.9,700],[4.3,520]])this.tn(t,t*.55,.9,`sawtooth`,.09*n,e,.05),this.nz(.8,.07*n,t*1.8,`bandpass`,e,3,t,.05);this.tn(70,38,.3,`sine`,.5*n,.05),this.nz(.25,.3*n,300,`lowpass`,.05);break;case`struck`:this.nz(.12,.9*n,220,`lowpass`),this.tn(90,45,.18,`sine`,.8*n),this.tn(HC(480,560),300,.35,`sawtooth`,.1*n,.05,.02),this.nz(.3,.1*n,1100,`bandpass`,.05,2,600,.05);break;case`winddown`:this.tn(110,28,2.2,`sawtooth`,.1*n,0,.1),this.nz(2,.06*n,160,`lowpass`,0,1,60,.1),this.tn(1200,600,.03,`square`,.08*n,2.1),this.nz(.05,.25*n,1500,`bandpass`,2.1,2);break;case`pump`:for(let e of[0,.17,.34])this.tn(e===.17?1170:980,e===.17?1170:980,.11,`square`,.035*n,e,.005);break;case`static`:this.nz(1.4,.07*n,2600,`bandpass`,0,.6,1900,.04),this.nz(1.4,.03*n,700,`bandpass`,0,1);break;case`smash`:this.nz(.25,.5*n,3800,`highpass`),this.nz(.2,.4*n,500,`bandpass`,.02,1.5),this.tn(900,300,.15,`triangle`,.12*n);break;case`hit`:this.nz(.12,.5,260),this.tn(95,50,.14,`square`,.2);break;case`clang`:this.tn(900,700,.18,`triangle`,.15),this.nz(.05,.2,2e3,`bandpass`);break;case`hurt`:this.tn(180,60,.35,`sawtooth`,.3),this.nz(.2,.3,500);break;case`reel`:this.nz(.35,.22,380,`bandpass`,0,1.2,160,.03),this.tn(140,70,.3,`sawtooth`,.12,.03),this.nz(.2,.12,900,`bandpass`,.2,1,500);break;case`take`:this.tn(520,780,.07,`sine`,.1);break;case`deny`:this.tn(140,140,.15,`square`,.1);break;case`power`:this.nz(.6,.7,90),this.tn(40,100,2.5,`sawtooth`,.12);break;case`paper`:this.nz(.15,.1,3e3,`highpass`);break;case`eat`:this.nz(.2,.12,800);break;case`shot`:this.nz(.18,.9,1800),this.tn(220,60,.12,`square`,.4);break;case`boom`:this.nz(.4,1,900),this.tn(120,40,.3,`sawtooth`,.6);break;case`load`:this.tn(300,380,.05,`triangle`,.05)}}finally{this.dest=this.bus}}};function WC(e,t=!1){let n=Math.sin(Math.floor(e*(t?17:11)))*43758.5453;return n-Math.floor(n)>=(t?.4:.72)}var GC=e=>e?1.7:1,KC=(e,t)=>e+Math.random()*(t-e);function qC(e,t,n,r,i=null){return!i&&e.waterAt(t,r)>n+.03?`wet`:e.floorMat(t,n,r,i)}function JC(e,t,n,r,i=null){if(i)return i.kind===`loose`?`wood`:i.kind===`mover`?`metal`:`concrete`;if(e.waterAt(t,r)>n+.03)return`wet`;for(let i of e.surfaces){let e=i.def;if(!(e.kind!==`floor`||e.sides||e.hidden||t<e.x0||t>e.x1||r<e.z0||r>e.z1||!i.has(t,r))&&Math.abs(i.heightAt(t,r)-n)<.25)return`rock`}let a=e.roomAt(t,n+.3,r);return a?.cells||a?.sky!==void 0?`rock`:a?.plain?`metal`:`concrete`}function YC(e){let t=e?ti[e]?.w:void 0;return!t||t.type===`fist`?.1:e===`baton`?.35:.9}function XC(e,t){let n=0,r=e.cells;if(r)for(let e=0;e<r.lo.length;e++)r.hi[e]>r.lo[e]&&(n+=r.res*r.res*(r.hi[e]-r.lo[e]));else n=(e.x1-e.x0)*(e.z1-e.z0)*e.ht;let i=Math.log10(Math.max(1,n)),a=(e,t)=>Math.max(0,1-Math.abs(i-e)/t),o=i<=2.2?1:a(2.2,.7),s=a(2.9,.8),c=i>=3.7?1:a(3.7,.8),l=o+s+c||1,u=(.2+.12*s/l+.2*c/l)*(t?1.3:1);return[o/l*u,s/l*u,c/l*u]}function ZC(e){let t=e.def.uses.find(e=>e.kind===`breaker`);return t?{x:t.x,y:t.y-1,z:t.z}:null}function QC(e,t,n,r){let i=e.player,o=i.body,s=t-o.x,c=r-o.z,l=Math.hypot(s,c),u=l<.6?0:a((s*Math.cos(i.yaw)-c*Math.sin(i.yaw))/l,-1,1)*.85,d=n===void 0?l:Math.hypot(l,n-o.y),f=e.fields;if(!f||f.from<0||n===void 0)return{d,pan:u,muffle:0};let p=f.nav.locate(t,n,r);if(p<0)return{d,pan:u,muffle:0};let m=f.sound[p];if(!Number.isFinite(m))return{d:d*1.5+8,pan:u*.6,muffle:1};let h=Math.max(0,m-d);return{d:d+h*.6,pan:u*(1-a(h/20,0,.5)),muffle:a(h/14,0,1)}}function $C(e,t){return e.cells?0:t===2?1:t===1?.3:0}function ew(e,t,n){if(t)return[{n:`settle`,w:3},{n:`groan`,w:.7}];let[,r,i]=XC(e,!1);return[{n:`knock`,w:n?3:1.5},{n:`groan`,w:.4+r+2*i},{n:`tick`,w:.8}]}var tw={husk:{n:`breath`,t:[5,11]},skitter:{n:`click`,t:[3,8]},bloat:{n:`gurgle`,t:[4,9]},thresher:{n:`growl`,t:[4,8]},grabber:{n:`creak`,t:[7,14]}},nw=new Set([`hstep`,`tap`]),rw=class{audio;sim=null;cast=new WeakMap;crates=new WeakMap;was={water:`dry`,under:!1,air:0,vy:0};heart=0;drip=2;bubbles=2;gen=null;near=new Map;room=-1;dim=!1;amb=KC(5,12);ticks=0;tickT=0;knockT=-1;constructor(e){this.audio=e}materials=!0;floor(e,t,n,r,i,a=null){if(!this.materials)return e.surf=JC(t.world,n,r,i,a),e;let o=qC(t.world,n,r,i,a);return o===`wet`?e.surf=`wet`:e.mat=o,e}event(e,t){let n=e.player,r=n.body,i=t.name,a={big:t.big,k:t.k};t.x===void 0?(a.d=t.d??0,(i===`step`||i===`land`)&&this.floor(a,e,r.x,r.y,r.z,r.on),i===`slosh`&&n.water===`swimming`&&(i=`stroke`)):(Object.assign(a,QC(e,t.x,t.y,t.z)),nw.has(i)&&t.y!==void 0&&this.floor(a,e,t.x,t.y,t.z),i===`blow`&&this.materials&&(a.mat=e.world.solidMat(t.x,t.y,t.z,r.x,t.y,r.z),a.hard=YC(e.game.weapon))),this.audio.play(i,a)}strike(e,t){let n=e.player.body,r=(t.x0+t.x1)/2,i=(t.z0+t.z1)/2;this.struck>=3||Math.hypot(r-n.x,i-n.z)>30||t.lit===`none`||(this.struck++,this.at(e,`strike`,r,t.y0+t.ht-.3,i))}struck=0;powerChanged(){this.ticks=8+Math.floor(Math.random()*6),this.tickT=KC(.6,1.4),this.knockT=KC(1.5,3.5)}somewhere(e,t){let n=[t.id,...this.nearTo(e,t.id)].map(t=>e.rooms[t]).filter(e=>!e.doorway),r=n[Math.floor(Math.random()*n.length)]??t;return{x:KC(r.x0,r.x1),y:r.y0+r.ht-.3,z:KC(r.z0,r.z1)}}dripAt(e,t,n,r,i){let a=e.player.body;Math.hypot(t-a.x,n-a.y,r-a.z)<30&&this.at(e,`drip`,t,n,r,{k:+!!i})}placedDrips=!1;gust(e,t,n,r,i){this.at(e,`gust`,t,n,r,{k:i})}at(e,t,n,r,i,a={}){this.audio.play(t,{...a,...QC(e,n,r,i)})}update(e,t,n=0){let r=e.player,i=r.body,o=e.game,s=e.world,c=this.audio;if(this.struck=0,e!==this.sim&&(this.sim=e,this.was={water:r.water,under:r.under,air:r.air,vy:0},this.gen=ZC(s),this.near.clear(),this.room=-1),c.setUnder(r.under),this.was.water===`dry`&&r.water!==`dry`){let e=Math.min(this.was.vy,i.vy);e<-3&&c.play(`splash`,{k:a(-e/12,.3,1)})}if(this.was.under&&!r.under&&this.was.air<r.airMax*.7&&c.play(`gasp`,{k:1-this.was.air/r.airMax}),r.under&&(this.bubbles-=t)<0){let e=r.air<r.airMax*.3;this.bubbles=e?KC(.5,1.4):KC(1.8,4.5),c.play(`bubble`,{d:2,big:e})}if(this.was.water=r.water,this.was.under=r.under,this.was.air=r.air,this.was.vy=i.vy,o.hp<35&&!o.ended){let e=1-Math.max(0,o.hp)/35;(this.heart-=t)<0&&(this.heart=1.1-.5*e,c.play(`heart`,{k:e}))}else this.heart=0;for(let n of e.cast){let r=this.cast.get(n);if(r||this.cast.set(n,r={dead:n.dead,t:KC(1,6),x:n.x,z:n.z,walked:0}),n.dead){r.dead||(r.dead=!0,this.at(e,`die-`+n.ai,n.x,n.y,n.z,{big:n.big}));continue}let i=Math.hypot(n.x-r.x,n.z-r.z);if(r.x=n.x,r.z=n.z,i>0&&i<1&&(r.walked+=i,n.ai===`worm`&&r.walked>.7?(r.walked=0,this.at(e,`slither`,n.x,n.y,n.z)):n.ai===`swimmer`&&r.walked>2.5&&(r.walked=0,this.at(e,`bubble`,n.x,n.y,n.z))),(r.t-=t)>0)continue;let a=tw[n.ai];if(!a){r.t=5;continue}let o=n.state===`hunt`||n.state===`pursue`;if(n.ai===`husk`&&o){r.t=KC(2.5,5),this.at(e,`mutter`,n.x,n.y,n.z);continue}r.t=KC(a.t[0],a.t[1]),n.state!==`charge`&&n.state!==`wind`&&this.at(e,a.n,n.x,n.y,n.z,{big:n.big})}for(let n of e.loose.all){let r=this.crates.get(n);if(r||this.crates.set(n,r={ground:n.ground,vmin:0,x:n.x,z:n.z,slid:0}),!n.awake){r.ground=n.ground,r.x=n.x,r.z=n.z;continue}n.ground?!r.ground&&r.vmin<-3&&this.at(e,`crate`,n.x,n.y,n.z,this.floor({k:a(-r.vmin/10,0,1),by:n.prop.mat},e,n.x,n.y,n.z)):r.vmin=Math.min(r.vmin,n.vy),n.ground&&(r.vmin=0);let i=Math.hypot(n.x-r.x,n.z-r.z);n.ground&&i>.3*t&&(r.slid+=i,r.slid>.5&&(r.slid=0,this.at(e,`scrape`,n.x,n.y,n.z,this.floor({by:n.prop.mat},e,n.x,n.y,n.z)))),r.ground=n.ground,r.x=n.x,r.z=n.z}let l=JC(s,i.x,i.y,i.z)===`rock`;c.setBed(+!!l);let u=s.roomAt(i.x,i.y+1,i.z);if(u){let t=0,n=0,r=1/0;for(let o of s.def.vents??[]){if(o.x<u.x0||o.x>u.x1||o.z<u.z0||o.z>u.z1||o.y<u.y0||o.y>u.y0+u.ht+.5)continue;let s=Math.hypot(o.x-i.x,o.y-i.y-1.6,o.z-i.z);s<r&&(r=s,t=a(1-s/5,0,1),n=QC(e,o.x,void 0,o.z).pan)}c.setAir($C(u,si(o,u.circuit)),t,n)}u&&!u.doorway&&u.id!==this.room&&(this.room=u.id,c.setSpace(...XC(u,l||!!u.cells)));let d=!!o.station?.main,f=this.gen;if(f){let t=QC(e,f.x,f.y,f.z),n=a(1-t.d/90,0,1);c.setHum(d,Math.max(.15,n*n),t.muffle,t.pan)}else c.setHum(d,.15,1,0);let p=0;if(u){let e=e=>e.flick&&Math.max(...cr(e,e=>si(o,e)))>.02;e(u)?p=1:this.nearTo(s,u.id).some(t=>e(s.rooms[t]))&&(p=.3)}if(u&&!o.ended){let n=si(o,u.circuit)>0,r=l||!!u.cells;if((this.amb-=t)<0){this.amb=KC(7,20);let t=ew(u,r,n),i=t.reduce((e,t)=>e+t.w,0),a=Math.random()*i,o=t[0].n;for(let e of t)if(a-=e.w,a<=0){o=e.n;break}let c=this.somewhere(s,u);this.at(e,o,c.x,c.y,c.z,{k:Math.random()<.3?KC(.5,1):0})}if(this.ticks>0&&(this.tickT-=t)<0){this.ticks--,this.tickT=KC(.3,1.2)*(1+(14-this.ticks)*.15);let t=this.somewhere(s,u);this.at(e,`tick`,t.x,t.y,t.z)}if(this.knockT>0&&(this.knockT-=t)<=0&&!r){let t=this.somewhere(s,u);this.at(e,`knock`,t.x,t.y,t.z,{k:KC(.5,1)})}}let m=WC(n,Pc(e));c.setBuzz(p,m),p&&m!==this.dim&&c.play(m?`zap`:`tink`,{k:p}),this.dim=m,!this.placedDrips&&(this.drip-=t)<0&&(this.drip=KC(1.2,4.5),(l||[[0,0],[6,0],[-6,0],[0,6],[0,-6]].some(([e,t])=>s.waterAt(i.x+e,i.z+t)>-1/0))&&c.play(`drip`,{d:KC(3,16),pan:KC(-.8,.8),muffle:KC(0,.3)}))}nearTo(e,t){let n=this.near.get(t);if(!n){let r=new Set;for(let n of e.neighbours(t))if(r.add(n),e.rooms[n].doorway)for(let t of e.neighbours(n))r.add(t);r.delete(t),this.near.set(t,n=[...r])}return n}},iw=`vec3 lift(vec3 c){ return pow(max(c, vec3(0.0)), vec3(0.78)); }`,aw={knee:.72,room:.42,white:.55,whiteAt:7},ow={from:1,soft:.45,gain:1.5,steps:6},sw=e=>e.toFixed(4),cw=`
varying vec2 vUv;
void main(){ vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`,lw=`
uniform sampler2D uSrc; uniform vec2 uPx; uniform float uExpo;
varying vec2 vUv;
vec3 s(float x, float y){ return texture2D(uSrc, vUv + vec2(x, y) * uPx).rgb; }
float luma(vec3 c){ return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
#ifdef FIRST
vec3 w(vec3 a, vec3 b, vec3 c, vec3 d){ vec3 m = (a + b + c + d) * 0.25; return m / (1.0 + luma(m)); }
vec3 kw(vec3 a, vec3 b, vec3 c, vec3 d){ vec3 m = (a + b + c + d) * 0.25; return vec3(1.0 / (1.0 + luma(m))); }
#endif
void main(){
  vec3 a = s(-2.0, 2.0), b = s(0.0, 2.0), c = s(2.0, 2.0);
  vec3 d = s(-2.0, 0.0), e = s(0.0, 0.0), f = s(2.0, 0.0);
  vec3 g = s(-2.0, -2.0), h = s(0.0, -2.0), i = s(2.0, -2.0);
  vec3 j = s(-1.0, 1.0), k = s(1.0, 1.0), l = s(-1.0, -1.0), m = s(1.0, -1.0);
#ifdef FIRST
  a *= uExpo; b *= uExpo; c *= uExpo; d *= uExpo; e *= uExpo; f *= uExpo; g *= uExpo; h *= uExpo; i *= uExpo;
  j *= uExpo; k *= uExpo; l *= uExpo; m *= uExpo;
  vec3 sum = w(j, k, l, m) * 0.5 + (w(a, b, d, e) + w(b, c, e, f) + w(d, e, g, h) + w(e, f, h, i)) * 0.125;
  vec3 wt = kw(j, k, l, m) * 0.5 + (kw(a, b, d, e) + kw(b, c, e, f) + kw(d, e, g, h) + kw(e, f, h, i)) * 0.125;
  vec3 o = sum / wt;
  /* what is over the threshold, softly */
  float br = max(o.r, max(o.g, o.b)), sk = clamp(br - ${sw(ow.from-ow.soft)}, 0.0, ${sw(2*ow.soft)});
  sk = sk * sk / ${sw(4*ow.soft)};
  o *= max(sk, br - ${sw(ow.from)}) / max(br, 1e-4);
#else
  vec3 o = e * 0.125 + (a + c + g + i) * 0.03125 + (b + d + f + h) * 0.0625 + (j + k + l + m) * 0.125;
#endif
  gl_FragColor = vec4(o, 1.0);
}`,uw=`
uniform sampler2D uSrc; uniform vec2 uPx;
varying vec2 vUv;
vec3 s(float x, float y){ return texture2D(uSrc, vUv + vec2(x, y) * uPx).rgb; }
void main(){
  vec3 o = (s(-1.0, 1.0) + s(1.0, 1.0) + s(-1.0, -1.0) + s(1.0, -1.0)) + 2.0 * (s(0.0, 1.0) + s(-1.0, 0.0) + s(1.0, 0.0) + s(0.0, -1.0)) + 4.0 * s(0.0, 0.0);
  gl_FragColor = vec4(o / 16.0, 1.0);
}`,dw=`
uniform sampler2D uScene; uniform sampler2D uGlow; uniform float uExpo; uniform float uGlowK; uniform float uTime;
varying vec2 vUv;
${iw}
vec3 tone(vec3 c){
  c = max(c, vec3(0.0));
  float m = max(c.r, max(c.g, c.b));
  if (m <= ${sw(aw.knee)}) return lift(c);
  float t = m - ${sw(aw.knee)}, r = ${sw(aw.knee)} + t / (1.0 + t / ${sw(aw.room)});
  c = mix(c, vec3(m), ${sw(aw.white)} * smoothstep(1.0, ${sw(aw.whiteAt)}, m));
  return lift(c * (r / m));
}
void main(){
  vec3 c = tone(texture2D(uScene, vUv).rgb * uExpo + texture2D(uGlow, vUv).rgb * uGlowK);
  /* a hash with no sin in it (a sin hash shows patterns on some GPUs), moved every frame */
  vec3 h3 = fract(vec3(gl_FragCoord.xyx + floor(fract(uTime * 7.13) * 977.0)) * 0.1031);
  h3 += dot(h3, h3.yzx + 33.33);
  float gr = fract((h3.x + h3.y) * h3.z) - 0.5;
  c += gr * 0.022 * (1.0 - smoothstep(0.0, 0.35, dot(c, vec3(0.3, 0.59, 0.11))));
  gl_FragColor = vec4(c, 1.0);
}`,fw=(e,t,n={})=>new Ih({vertexShader:cw,fragmentShader:e,uniforms:t,depthTest:!1,depthWrite:!1,...n}),pw=class{renderer;scene;steps=[];type;quad;stage=new Op;cam=new cg;first;down;up;final;size=new bf;constructor(e){this.renderer=e;let t=e.extensions;this.type=t.has(`EXT_color_buffer_float`)||t.has(`EXT_color_buffer_half_float`)?zu:Mu,this.scene=new Hf(1,1,{type:this.type,samples:4,depthBuffer:!0});let n=new Sm;n.setAttribute(`position`,new um([-1,-1,0,3,-1,0,-1,3,0],3));let r=()=>({uSrc:{value:null},uPx:{value:new bf}});this.first=fw(lw,{...r(),uExpo:Z.uExpo},{defines:{FIRST:``}}),this.down=fw(lw,{...r(),uExpo:Z.uExpo}),this.up=fw(uw,r(),{blending:2,transparent:!0}),this.final=fw(dw,{uScene:{value:this.scene.texture},uGlow:{value:null},uExpo:Z.uExpo,uGlowK:{value:ow.gain/ow.steps},uTime:Z.uTime}),this.quad=new Km(n,this.final),this.quad.frustumCulled=!1,this.stage.add(this.quad)}resize(){let e=this.renderer.getDrawingBufferSize(this.size),t=Math.max(1,e.x),n=Math.max(1,e.y);this.scene.setSize(t,n);for(let e of this.steps)e.dispose();this.steps=[];for(let e=1;e<=ow.steps;e++){let r=Math.max(1,Math.round(t/2**e)),i=Math.max(1,Math.round(n/2**e)),a=new Hf(r,i,{type:this.type,depthBuffer:!1});if(a.texture.minFilter=a.texture.magFilter=ku,a.texture.generateMipmaps=!1,this.steps.push(a),r<=2||i<=2)break}this.final.uniforms.uGlow.value=this.steps[0].texture,this.final.uniforms.uGlowK.value=ow.gain/this.steps.length}draw(e,t,n){n&&(e.uniforms.uSrc.value=n.texture,e.uniforms.uPx.value.set(1/n.width,1/n.height)),this.quad.material=e,this.renderer.setRenderTarget(t),this.renderer.render(this.stage,this.cam)}depthFirst=_b();render(e,t){let n=this.renderer,r=n.autoClear,i=t.layers.mask,a=e.overrideMaterial;n.setRenderTarget(this.scene),t.layers.set(2),e.overrideMaterial=this.depthFirst,n.render(e,t),e.overrideMaterial=a,t.layers.mask=i,n.autoClear=!1,n.render(e,t);let o=this.steps;this.draw(this.first,o[0],this.scene);for(let e=1;e<o.length;e++)this.draw(this.down,o[e],o[e-1]);for(let e=o.length-1;e>0;e--)this.draw(this.up,o[e-1],o[e]);n.autoClear=r,this.draw(this.final,null)}},mw=class{renderer;scene=new Op;camera=new fg(72,1,.06,140);post;scale;constructor(e,t=1){this.renderer=new Xy({canvas:e,antialias:!1}),this.renderer.setClearColor(0),this.camera.rotation.order=`YXZ`,this.post=new pw(this.renderer),this.scale=t,window.addEventListener(`resize`,()=>this.size()),this.size()}setScale(e){e!==this.scale&&(this.scale=e,this.size())}size(){let e=window.innerWidth,t=window.innerHeight;this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5)*this.scale),this.renderer.setSize(e,t,!1),this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.post.resize()}show(e){e.parent!==this.scene&&this.scene.add(e);for(let t of this.scene.children)t!==this.camera&&t.type===`Group`&&(t.visible=t===e)}draw(e,t=!1){Z.uTime.value=e,Z.uFlick.value=WC(e,t)?GC(t):0,this.post.render(this.scene,this.camera)}},hw=Wn+1,gw=hw*hw*hw,_w=class{atlas;dirAtlas;index;data;dirData;origin=new Y;size=new Y;width;L;constructor(e){let t=e.field,n=t.slots,r=1/0,i=1/0,a=1/0,o=-1/0,s=-1/0,c=-1/0;for(let e=0;e<n;e++){let n=t.bpos[e*3],l=t.bpos[e*3+1],u=t.bpos[e*3+2];r=Math.min(r,n),i=Math.min(i,l),a=Math.min(a,u),o=Math.max(o,n),s=Math.max(s,l),c=Math.max(c,u)}n||(r=i=a=o=s=c=0);let l=o-r+1,u=s-i+1,d=c-a+1,f=new Float32Array(l*u*d).fill(-1);for(let e=0;e<n;e++)f[((t.bpos[e*3+2]-a)*u+(t.bpos[e*3+1]-i))*l+(t.bpos[e*3]-r)]=e;this.index=new Wf(f,l,u,d),this.index.format=Xu,this.index.type=Ru,this.index.minFilter=this.index.magFilter=Eu,this.index.unpackAlignment=1,this.index.needsUpdate=!0,this.origin.set(r,i,a),this.size.set(l,u,d);let p=Math.max(1,n*gw);this.width=p<=4194304?2048:4096;let m=Math.ceil(p/this.width);this.data=new Uint8Array(this.width*m*4),this.dirData=new Uint8Array(this.width*m*4);let h=e=>{let t=new Ym(e,this.width,m,qu,Mu);return t.minFilter=t.magFilter=Eu,t.generateMipmaps=!1,t};this.atlas=h(this.data),this.dirAtlas=h(this.dirData),this.L=null,this.sync(e)}sync(e){let t=e.field;if(e!==this.L){this.L=e,e.changed();for(let e=0;e<t.slots;e++)this.brick(e);for(let e of[this.atlas,this.dirAtlas])e.clearUpdateRanges(),e.needsUpdate=!0;return}let n=e.changed();if(!n.length)return;let r=new Set;for(let e of n)for(let n=-1;n<=0;n++)for(let i=-1;i<=0;i++)for(let a=-1;a<=0;a++){let o=t.nb[e*27+(n+1)*9+(i+1)*3+a+1];o>=0&&r.add(o)}for(let e of r){this.brick(e);for(let t=e*gw,n=t+gw;t<n;){let e=Math.min(n,(Math.floor(t/this.width)+1)*this.width);this.atlas.addUpdateRange(t*4,(e-t)*4),this.dirAtlas.addUpdateRange(t*4,(e-t)*4),t=e}}this.atlas.needsUpdate=!0,this.dirAtlas.needsUpdate=!0}brick(e){let t=this.L,n=t.field,r=t.colours,i=t.flickers,a=t.directions,o=this.data,s=this.dirData,c=e*gw*4;for(let t=0;t<hw;t++)for(let l=0;l<hw;l++)for(let u=0;u<hw;u++,c+=4){let d=n.local(e,u,l,t),f=d>=0?n.flags[d]:0;if(!f){o[c]=o[c+1]=o[c+2]=o[c+3]=0,s[c]=s[c+1]=s[c+2]=128,s[c+3]=0;continue}let p=n.pid[d]*3,m=Math.max(r[p],r[p+1],r[p+2]),h=m>1e-4?Math.min(15,Math.round(15*Math.max(i[p],i[p+1],i[p+2])/m)):0;o[c]=vw(r[p]),o[c+1]=vw(r[p+1]),o[c+2]=vw(r[p+2]),o[c+3]=f&15|h<<4;let g=.3*r[p]+.59*r[p+1]+.11*r[p+2],_=g>1e-5?1/g:0;s[c]=yw(a[p]*_),s[c+1]=yw(a[p+1]*_),s[c+2]=yw(a[p+2]*_),s[c+3]=0}}bind(){Z.uLA.value=this.atlas,Z.uLD.value=this.dirAtlas,Z.uLI.value=this.index,Z.uLO.value.copy(this.origin),Z.uLN.value.copy(this.size),Z.uLW.value=this.width}},vw=e=>Math.round(Math.sqrt(Math.min(Math.max(e/4,0),1))*255),yw=e=>Math.round((Math.min(Math.max(e,-1),1)*.5+.5)*255),bw={wind:[1,.55,.1],strike:[1,.1,.1],after:[.3,.5,1]},xw=class{sim;fixed;moving;blows;on=!1;constructor(e,t){this.sim=t;let n=t.world,r=[];n.forEachBox(e=>Cw(e,r));let i=[];for(let e of n.surfaces){let t=e.def,n=(n,r)=>!t.mask||e.has(t.x0+(n+.5)*t.res,t.z0+(r+.5)*t.res);for(let e=0;e<t.nz;e++)for(let r=0;r<t.nx-1;r++)(n(r,e)||n(r,e-1))&&i.push(t.x0+r*t.res,t.h[e*t.nx+r],t.z0+e*t.res,t.x0+(r+1)*t.res,t.h[e*t.nx+r+1],t.z0+e*t.res);for(let e=0;e<t.nx;e++)for(let r=0;r<t.nz-1;r++)(n(e,r)||n(e-1,r))&&i.push(t.x0+e*t.res,t.h[r*t.nx+e],t.z0+r*t.res,t.x0+e*t.res,t.h[(r+1)*t.nx+e],t.z0+(r+1)*t.res)}this.fixed=new ph(Sw([...r]),new th({color:10132112}));let a=new ph(Sw(i),new th({color:6270570}));this.fixed.add(a),this.moving=new ph(new Sm,new th({color:13214247})),this.blows=new ph(new Sm,new th({vertexColors:!0}));for(let t of[this.fixed,this.moving,this.blows])t.visible=!1,t.frustumCulled=!1,e.add(t)}toggle(){this.on=!this.on,this.fixed.visible=this.moving.visible=this.blows.visible=this.on}update(){if(!this.on)return;let e=[];for(let t of this.sim.world.dyn)t.kind!==`body`&&Cw(t,e);let t=this.sim.player.body;for(let n=0;n<16;n++){let r=n/16*Math.PI*2,i=(n+1)/16*Math.PI*2;for(let n of[t.y+.02,t.y+t.h])e.push(t.x+Math.cos(r)*t.r,n,t.z+Math.sin(r)*t.r,t.x+Math.cos(i)*t.r,n,t.z+Math.sin(i)*t.r)}this.moving.geometry.dispose(),this.moving.geometry=Sw(e);let n=[],r=[];for(let e of this.sim.cast){let t=Xs(e);if(e.dead||!e.blow||!t)continue;let i=Math.acos(t.arc),a=e.r+t.reach,o=bw[e.blow.ph],s=(t,n,r)=>[e.x+Math.sin(t)*n,r,e.z+Math.cos(t)*n];for(let t of[e.y+.05,e.y+1]){for(let r of[-i,i])n.push(...s(0,0,t),...s(e.yaw+r,a,t));for(let r=0;r<12;r++)n.push(...s(e.yaw-i+2*i*r/12,a,t),...s(e.yaw-i+2*i*(r+1)/12,a,t))}for(;r.length<n.length;)r.push(...o)}let i=(e,t,i,a,o)=>{for(let s=0;s<12;s++){let c=s/12*Math.PI*2,l=(s+1)/12*Math.PI*2;n.push(e+Math.cos(c)*a,t,i+Math.sin(c)*a,e+Math.cos(l)*a,t,i+Math.sin(l)*a),r.push(...o,...o)}},a=(e,t,a,o,s,c,l,u,d)=>{let f=[1-c,c,.2];n.push(e,o,a,e,o+.6*c,a),r.push(...f,...f),(l||u)&&(n.push(e,t+.05,a,e+l/3,t+.05,a+u/3),r.push(.3,.8,1,.3,.8,1)),d===`down`?i(e,t+.05,a,s+.15,[1,.15,.1]):d===`rise`?i(e,t+.05,a,s+.15,[1,.9,.2]):d===`reel`&&i(e,t+.05,a,s+.15,[1,.55,.1])};for(let e of this.sim.cast)!e.dead&&e.body&&a(e.x,e.y,e.z,e.y+e.body.h+.25,e.r,e.poise/e.pmax,e.body.vx,e.body.vz,e.down>0?`down`:e.rise>0?`rise`:e.reel>0?`reel`:``);{let e=this.sim.hands;a(t.x,t.y,t.z,t.y+t.h+.25,t.r,e.poise/30,t.vx,t.vz,e.down>0?`down`:e.rise>0?`rise`:e.stag>0?`reel`:``)}let o=$o(this.sim);if(o)for(let e=0;e+1<o.length;e++){let t=o[e],i=o[e+1];n.push(t.x,t.y,t.z,i.x,i.y,i.z),r.push(1,1,1,1,1,1)}this.blows.geometry.dispose(),this.blows.geometry=Sw(n),this.blows.geometry.setAttribute(`color`,new sm(new Float32Array(r),3))}};function Sw(e){let t=new Sm;return t.setAttribute(`position`,new sm(new Float32Array(e),3)),t}function Cw(e,t){let n=[e.x0,e.x1],r=[e.y0,e.y1],i=[e.z0,e.z1];for(let e of[0,1])for(let a of[0,1])t.push(n[0],r[e],i[a],n[1],r[e],i[a]),t.push(n[e],r[0],i[a],n[e],r[1],i[a]),t.push(n[e],r[a],i[0],n[e],r[a],i[1])}var ww=class{sim;group=new yp;overlay;mesh;volume;things;cast;meshMs;constructor(e,t,n){this.sim=e;let r=performance.now();this.mesh=Pb(e.world,t),this.volume=new _w(t);let i=vb(),a=(e,t)=>{let n=new Km(e,i);n.matrixAutoUpdate=!1,n.layers.enable(2),t.add(n)};for(let e of this.mesh.pieces)a(e,this.group);this.services.visible=Z.uDetail.value>.5;for(let e of this.mesh.services)a(e,this.services);this.group.add(this.services),this.meshMs=performance.now()-r,this.things=new ix(this.group,e,t),this.cast=new IS(this.group,e,t),this.overlay=n?new xw(this.group,e):null}services=new yp;showDetail(e){this.services.visible=e}get pieces(){return this.mesh.pieces.length+this.mesh.services.length}bind(){this.volume.bind()}relight(e){this.mesh.relight(e),this.volume.sync(e),this.things.setLighting(e),this.cast.setLighting(e)}relightRooms(e,t){this.mesh.relightRooms(e,t)}syncLight(e){this.volume.sync(e)}update(e,t){this.things.update(),this.cast.update(e,t),this.overlay?.update()}},Tw=Math.PI/2,Ew={side:.3,chop:.87,thrust:0},Dw=Tw-.5,Ow=e=>e*e*(3-2*e);function kw(e,t,n,r){let i=fo[e],a=i.from+Ew[e],o=i.to-.6,s=e=>e<uo.from?a+(i.from-a)*Ow(e/uo.from):e<uo.to?i.from+(i.to-i.from)*(e-uo.from)/(uo.to-uo.from):i.to+(o-i.to)*Ow((e-uo.to)/(1-uo.to)),c=n??r;if(c===void 0||t<c)return s(t);let l=s(c),u=(t-c)/Math.max(.001,1-c);return l+(i.from-l)*(n===void 0?.08:.35)*Math.sin(Math.min(1,u*3)*Tw)}function Aw(e){switch(e){case`baton`:return[[`cyl`,1842720,.05,.6,.05,0,.22,0]];case`pipe`:return[[`cyl`,8027780,.055,.85,.055,0,.3,0]];case`wrench`:return[[`box`,9058858,.05,.5,.03,0,.2,0],[`box`,10133156,.12,.1,.04,0,.47,0]];case`knife`:return[[`box`,2237994,.03,.12,.03,0,0,0],[`box`,13159632,.012,.24,.045,0,.18,0]];case`axe`:return[[`box`,8018484,.04,.95,.045,0,.3,0],[`box`,11020832,.045,.16,.24,0,.72,-.09]];case`adjwrench`:return[[`box`,12106944,.04,.4,.025,0,.16,0],[`box`,12106944,.1,.08,.03,0,.38,0]];case`pistol`:return[[`box`,1842720,.04,.06,.24,0,.12,-.1],[`box`,1842720,.04,.14,.05,0,.04,0]];case`shotgun`:return[[`box`,1842720,.05,.06,.7,0,.1,-.3],[`box`,5914676,.05,.1,.26,0,.06,.12],[`box`,5914676,.055,.05,.2,0,.06,-.3]];default:return[[`box`,11568498,.1,.11,.14,0,.02,-.02],[`box`,11883548,.1,.1,.34,0,.01,.22]]}}var jw=class{sim;L;vm=new yp;mat=bb();mesh=null;id=void 0;constructor(e,t,n){this.sim=t,this.L=n,this.vm.rotation.order=`ZYX`,e.add(this.vm)}setLighting(e){this.L=e}set shown(e){this.vm.visible=e}update(e,t){let n=this.sim,r=n.game,i=n.hands,o=n.player.body,s=this.vm;this.id!==r.weapon&&(this.id=r.weapon,this.mesh&&(this.vm.remove(this.mesh),this.mesh.geometry.dispose()),this.mesh=new Km(Yb(Aw(r.weapon)),this.mat),this.mesh.frustumCulled=!1,this.vm.add(this.mesh)),Cb(this.mat,this.L.atPoint(o.x,o.y+1,o.z),this.L.flickAt(o.x,o.y+1,o.z),this.L.towards(o.x,o.y+1,o.z));let c=ii(r.weapon),l=!r.weapon,u=i.swing,d=i.chg>=0?a(i.chg/zo(n,c),0,1):0,f=c.shape,p=l||f===`thrust`,m=-.15;if(s.rotation.set(0,l?.12:0,-.15),i.stag>0||i.down>0||i.rise>0){let e=i.down>0?1:i.rise>0?Math.min(1,i.rise/.3):Math.min(1,i.stag/.25),n=Math.sin(t*31)*.02*e;s.rotation.x=.7*e+n,s.position.set(.34+.06*e,-.36-.18*e+n,-.42+.06*e)}else if(c.gun)s.rotation.x=i.kick*.5,s.position.set(.22,-.3+i.kick*.04+Math.sin(e)*.01,-.42+i.kick*.12);else if(u&&p){let e=u.struck??u.glance,n=Math.min(1,u.t/u.dur,e===void 0?1:Math.max(e,.4)),r=l?.6:.45,i=u.glance!==void 0&&u.t/u.dur>u.glance?Math.sin(t*60)*.015:0;if(s.rotation.x=l?.05:-Tw+.1,n<.4){let e=n/.4;s.position.set(.26-e*.16,-.3+e*.1,-.42+.2*(1-e)-e*r)}else{let e=(n-.4)/.6;s.position.set(.1+e*.16+i,-.2-e*.1,-.42-r*(1-e))}}else if(u&&f===`chop`){let e=Math.min(1,u.t/u.dur),n=kw(f,e,u.glance,u.struck),r=u.glance!==void 0&&e>u.glance?Math.sin(t*55)*.04*(1-e):0;s.rotation.set(n-Tw+r,0,-.15),s.position.set(.18,-.32+.16*Math.sin(n),-.38)}else if(u){let e=Math.min(1,u.t/u.dur),n=kw(f,e,u.glance,u.struck),r=u.glance!==void 0&&e>u.glance?Math.sin(t*55)*.04*(1-e):0;s.rotation.set(-Tw+.35-.25*Math.min(1,e/uo.to)+r,-n,m),s.position.set(.16+.14*Math.sin(n),-.28,-.32)}else if(f===`chop`){let n=d>=1?Math.sin(t*38)*.012:0,r=Ow(d),i=Dw+(fo.chop.from+Ew.chop-Dw)*r;s.rotation.set(i-Tw+Math.sin(e*.5)*.02*(1-r)+n,0,-.15),s.position.set(.3+-.12*r,-.34+(-.32+.16*Math.sin(i)+.34)*r+Math.sin(e)*.012*(1-r),-.5+.12*r)}else if(p)s.rotation.x=l?.05:-Tw+.1,s.position.set(.26+d*.04,-.3-d*.03+Math.sin(e)*.012,-.42+d*.2);else{let n=d>=1?Math.sin(t*38)*.012:0,r=Ow(d),i=fo[f].from+Ew[f];s.rotation.set((-.5+Math.sin(e*.5)*.02)*(1-r)+(-Tw+.35)*r+n,-i*r,-.15*(1-r)+m*r),s.position.set(.3-.14*r+.14*Math.sin(i)*r,-.34+.06*r+Math.sin(e)*.012*(1-r),-.5+.18*r)}}},Mw=900,Nw=80,Pw=4,Fw=2,Iw=4,Lw=(e,t)=>e+Math.random()*(t-e),Rw={dust:{c:[.95,.9,.8],show:.15,share:1,size:1,lift:-.006,glow:0},spores:{c:[.72,.95,.48],show:.4,share:.5,size:1.35,lift:.012,glow:.02},flesh:{c:[.5,.15,.12],show:.22,share:.35,size:1.15,lift:-.012,glow:0}},zw=`
attribute vec3 aCol; attribute vec3 aL; attribute float aA; attribute float aS;
uniform float uFog; uniform float uPx; uniform float uExpo;
varying vec3 vC; varying float vA;
${db}
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vec3 tc = cameraPosition - position; float d = length(tc);
  /* a beam through dust shows it, softly: less than a wall would take */
  vec3 light = aL + 0.45 * (held(position, 1.0) + lying(position, vec3(0.0))) + bounce(position) + 0.8 * lantern(position, 1.0);
  /* dust is never the brightest thing in view: bright light is given back softly, as the eye sees it */
  vec3 c = aCol * light * uExpo;
  vC = c / (1.0 + 0.35 * c) / uExpo;
  /* not right at the eye, not at the box's edge (where a speck comes back in), thinned by the fog */
  vA = aA * smoothstep(0.25, 0.8, d) * (1.0 - smoothstep(2.8, 3.9, d)) * exp(-d * uFog * 1.5);
  /* whole pixels, so a fleck is a crisp square and not a smudge */
  gl_PointSize = floor(clamp(uPx * aS / max(-mv.z, 0.1), 2.0, 14.0));
  gl_Position = projectionMatrix * mv;
}`,Bw=`
varying vec3 vC; varying float vA;
void main(){
  if (vA < 0.01) discard;
  gl_FragColor = vec4(vC, vA);
}`,Vw=.8,Hw=.45,Uw=5,Ww=2.5,Gw=class{L;onGust;points;geo=new Sm;pos=new Float32Array(2940);vel=new Float32Array(2940);col=new Float32Array(2940);lit=new Float32Array(2940);alpha=new Float32Array(980);want=new Float32Array(980);size=new Float32Array(980);seed=new Float32Array(980);room=new Int32Array(980).fill(-1);life=new Float32Array(Nw);air=new Map;shut=[];wasOpen=[];sim=null;turn=0;you=null;mat;constructor(e,t,n){this.L=t,this.onGust=n;let r=(e,t)=>new sm(e,t).setUsage(Zd);this.geo.setAttribute(`position`,r(this.pos,3)),this.geo.setAttribute(`aCol`,r(this.col,3)),this.geo.setAttribute(`aL`,r(this.lit,3)),this.geo.setAttribute(`aA`,r(this.alpha,1)),this.geo.setAttribute(`aS`,r(this.size,1)),this.mat=new Ih({uniforms:{...xb(),uFog:Z.uFog,uExpo:Z.uExpo,uPx:{value:4}},vertexShader:zw,fragmentShader:Bw,transparent:!0,depthWrite:!1}),this.points=new yh(this.geo,this.mat),this.points.frustumCulled=!1,this.points.renderOrder=2,e.add(this.points);for(let e=0;e<980;e++)this.seed[e]=Math.random()}setLighting(e){this.L=e,this.air.clear();for(let e=0;e<Mw;e++)this.room[e]>=0&&(this.room[e]=-3)}resize(e,t){this.mat.uniforms.uPx.value=e/2/Math.tan(t*Math.PI/360)*.027}airOf(e,t){let n=this.air.get(t.id);if(n)return n;let r=t.motes??`dust`,i=!!t.cells,a=si(e.game,t.circuit),o=i?.05:a===2?.22:a===1?.06:0,s=t.x1-t.x0>=t.z1-t.z0,c=t.id*2654435761%2?1:-1,l=[];if(!i){for(let n of e.world.def.vents??[])n.x>t.x0&&n.x<t.x1&&n.z>t.z0&&n.z<t.z1&&n.y>t.y0&&n.y<t.y0+t.ht+.5&&l.push(n);for(let n of e.doors){let e=n.def;if(!e.vent)continue;let r=(e.x0+e.x1)/2,i=(e.z0+e.z1)/2;r>t.x0-1&&r<t.x1+1&&i>t.z0-1&&i<t.z1+1&&e.y0<t.y0+t.ht&&e.y1>t.y0&&l.push({x:r,y:(e.y0+e.y1)/2,z:i})}}return n={fx:s?c:0,fz:s?0:c,speed:o,kind:r,vents:l,still:o===0,holds:i?.7:a===2?.25:a===1?.55:1},this.air.set(t.id,n),n}airVel(e,t,n){let r=e.fx,i=e.fz,a=0;if(e.vents.length){let o=1/0;for(let a of e.vents){let e=a.x-t,s=a.z-n,c=Math.hypot(e,s);c<o&&(o=c,r=e/(c||1),i=s/(c||1))}if(o<2){let e=1-o/2;r*=1-.6*e,i*=1-.6*e,a=.8*e}}return[r*e.speed,Rw[e.kind].lift*(e.still?1:.4)+a*e.speed,i*e.speed]}scatter(e,t,n,r,i){let a=t*3;this.pos[a]=n+Lw(-4,Pw),this.pos[a+1]=r+Lw(-2,Fw),this.pos[a+2]=i+Lw(-4,Iw),this.place(e,t,!0);let o=this.room[t];this.vel.set(o>=0?this.airVel(this.airOf(e,e.world.rooms[o]),this.pos[a],this.pos[a+2]):[0,0,0],a)}place(e,t,n=!1){let r=this.pos[t*3],i=this.pos[t*3+1],a=this.pos[t*3+2],o=e.world.roomAt(r,i,a),s=t>=Mw;if(!o){this.room[t]=-1,s||(this.alpha[t]=this.want[t]=0);return}this.room[t]=o.id;let c=this.airOf(e,o),l=this.seed[t],u=this.L.atPoint(r,i,a),d=Rw[c.kind],f=l*5.71%1<d.share?d:Rw.dust,p=.4+.6*(l*13.7%1);this.col[t*3]=f.c[0]*p,this.col[t*3+1]=f.c[1]*p,this.col[t*3+2]=f.c[2]*p,this.lit[t*3]=u[0]+f.glow,this.lit[t*3+1]=u[1]+f.glow*1.6,this.lit[t*3+2]=u[2]+f.glow*.6,this.size[t]=f.size*(.6+.8*l*l),!s&&(this.want[t]=l<d.show*c.holds?(.45+.55*(l*7.31%1))*(.8+.2*(l*3.17%1)):0,n&&(this.alpha[t]=this.want[t]))}movers(t,n,r,i){let a=[],o=t.player.body;if(this.you&&i>0){let e=(n-this.you.x)/i,t=(r-this.you.z)/i;Math.hypot(e,t)<12&&a.push({x:n,y:o.y,z:r,vx:e,vz:t,r:.35,h:1.8})}this.you={x:n,z:r};for(let i of t.cast)i.dead||Math.abs(i.x-n)>5||Math.abs(i.z-r)>5||a.push({x:i.x,y:i.y,z:i.z,vx:(i.x-i.px)/e,vz:(i.z-i.pz)/e,r:i.r,h:i.body?.h??1});return a}update(e,t,n){let r=this.pos,i=this.vel,a=t.x,o=t.y,s=t.z;if(e!==this.sim){this.sim=e,this.air.clear(),this.you=null,this.shut=e.doors.map(()=>1/0),this.wasOpen=e.doors.map(e=>e.t>.02);for(let t=0;t<Mw;t++)this.scatter(e,t,a,o,s);this.life.fill(0)}e.doors.forEach((t,r)=>{let i=t.t>.02,o=t.def;if(i||(this.shut[r]+=n),i&&!this.wasOpen[r]&&this.shut[r]>20&&!o.vent&&!o.lift){let n=(o.x0+o.x1)/2,r=(o.z0+o.z1)/2;Math.hypot(n-a,r-s)<12&&this.gust(e,t.def,a,s,o.kind===`heavy`||o.seal?1:.6)}i||this.wasOpen[r]&&(this.shut[r]=0),this.wasOpen[r]=i});let c=Math.ceil(Mw/8);for(let t=0;t<c;t++){let n=(this.turn+t)%Mw;this.place(e,n)}this.turn=(this.turn+c)%Mw;let l=this.movers(e,a,s,n),u=Math.min(1,n*1.2),d=Math.sqrt(n),f=1-Math.exp(-n*Vw),p=1-Math.exp(-n*Vw*2);for(let t=0;t<980;t++){let c=t*3,m=t>=Mw;if(m){let e=t-Mw;if(this.life[e]<=0){this.alpha[t]=0;continue}this.life[e]-=n,this.alpha[t]=Math.min(1,this.life[e]/.8)*(.4+.4*this.seed[t])}else{let n=r[c],l=r[c+1],d=r[c+2],f=!1;n-a>Pw?(n-=8,f=!0):a-n>Pw&&(n+=8,f=!0),l-o>Fw?(l-=4,f=!0):o-l>Fw&&(l+=4,f=!0),d-s>Iw?(d-=8,f=!0):s-d>Iw&&(d+=8,f=!0),r[c]=n,r[c+1]=l,r[c+2]=d,f||this.room[t]===-2?this.place(e,t,!0):this.room[t]===-3&&this.place(e,t),f&&this.room[t]>=0&&i.set(this.airVel(this.airOf(e,e.world.rooms[this.room[t]]),n,d),c),this.alpha[t]+=(this.want[t]-this.alpha[t])*u}let h=this.room[t];if(!(h<0&&!m)){if(h>=0){let t=this.airOf(e,e.world.rooms[h]),n=this.airVel(t,r[c],r[c+2]),a=(t.still?.012:.035)*d,o=m?p:f;i[c]+=(n[0]-i[c])*o+(Math.random()-.5)*a,i[c+1]+=(n[1]-i[c+1])*o+(Math.random()-.5)*a*.6,i[c+2]+=(n[2]-i[c+2])*o+(Math.random()-.5)*a}for(let e of l){let t=r[c+1]-e.y;if(t<-.1||t>e.h+.1)continue;let a=r[c]-e.x,o=r[c+2]-e.z,s=Math.hypot(a,o),l=e.r+Hw;if(s>=l)continue;let u=1-s/l,d=Math.hypot(e.vx,e.vz),f=1-Math.exp(-n*Uw*u);i[c]+=(e.vx-i[c])*f,i[c+2]+=(e.vz-i[c+2])*f;let p=s>.001?a/s:Math.random()-.5,m=s>.001?o/s:Math.random()-.5;i[c]+=p*d*Ww*u*n,i[c+2]+=m*d*Ww*u*n}r[c]+=i[c]*n,r[c+1]+=i[c+1]*n,r[c+2]+=i[c+2]*n}}for(let e of[`position`,`aCol`,`aL`,`aA`,`aS`])this.geo.getAttribute(e).needsUpdate=!0}gust(e,t,n,r,i){let a=(t.x0+t.x1)/2,o=(t.z0+t.z1)/2,s=t.y0+1,c=t.alongX?0:Math.sign(n-a)||1,l=t.alongX?Math.sign(r-o)||1:0,u=Math.round(Nw*.5*i);for(let n=0,r=0;n<Nw&&r<u;n++){if(this.life[n]>0)continue;r++;let s=Mw+n,u=s*3,d=Math.random();this.pos[u]=t.alongX?t.x0+(t.x1-t.x0)*d:a-c*.4,this.pos[u+1]=Lw(t.y0+.1,Math.min(t.y1,t.y0+2.2)),this.pos[u+2]=t.alongX?o-l*.4:t.z0+(t.z1-t.z0)*d;let f=Lw(1.2,2.4)*(.6+.4*i);this.vel[u]=c*f+Lw(-.4,.4),this.vel[u+1]=Lw(-.15,.3),this.vel[u+2]=l*f+Lw(-.4,.4),this.life[n]=Lw(1.2,2.4),this.place(e,s),this.size[s]*=.7,this.room[s]<0&&(this.col.set(Rw.dust.c,u),this.lit.set([.05,.05,.05],u),this.size[s]=.7)}this.onGust(a,s,o,i)}},Kw=256,qw=.86,Jw=.8,Yw=32,Xw={by:.03,most:1.6},Zw={wet:[.05,.05,.055],red:[.23,.045,.045],green:[.14,.25,.12]},Qw={w:.12,l:.28,pace:.75,side:.1},$w={husk:{w:.16,l:.26,pace:.8,side:.11},thresher:{w:.17,l:.3,pace:1.2,side:.17},skitter:{w:.11,l:.16,pace:.4,side:.7},worm:{w:.38,l:.36,pace:.36,side:0}},eT=`
attribute vec3 iPos; attribute float iYaw; attribute vec2 iSize; attribute vec3 iCol; attribute float iA; attribute vec3 iL;
uniform float uFog;
varying vec3 vC; varying float vA; varying vec2 vQ;
${db}
void main(){
  float c = cos(iYaw), s = sin(iYaw);
  vQ = position.xz;
  vec2 q = position.xz * iSize;
  vec3 p = iPos + vec3(q.x * c + q.y * s, 0.0, -q.x * s + q.y * c);
  vec3 tc = cameraPosition - p; float d = length(tc);
  vC = iCol * (iL + carried(p, 1.0) + lying(p, vec3(0.0, 1.0, 0.0)));
  vA = iA * exp(-d * uFog);
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
}`,tT=`
varying vec3 vC; varying float vA; varying vec2 vQ;
void main(){
  if (vA < 0.01) discard;
  /* a foot, not a block: the ball and sole toward its front, the heel behind, round at both (the quad a unit square) */
  vec2 a = vec2(vQ.x / 0.5, (vQ.y - 0.12) / 0.38), h = vec2(vQ.x / 0.4, (vQ.y + 0.3) / 0.2);
  if (dot(a, a) > 1.0 && dot(h, h) > 1.0) discard;
  gl_FragColor = vec4(vC, vA);
}`,nT=class e{L;geo=new mg;iPos=new Float32Array(Kw*3);iYaw=new Float32Array(Kw);iSize=new Float32Array(Kw*2);iCol=new Float32Array(Kw*3);iA=new Float32Array(Kw);iL=new Float32Array(Kw*3);list=[];next=0;you=null;feet=new Map;sim=null;constructor(e,t){this.L=t;let n=new Dh(1,1).rotateX(-Math.PI/2);this.geo.index=n.index,this.geo.setAttribute(`position`,n.getAttribute(`position`));let r=(e,t)=>new Xm(e,t).setUsage(Zd);this.geo.setAttribute(`iPos`,r(this.iPos,3)),this.geo.setAttribute(`iYaw`,r(this.iYaw,1)),this.geo.setAttribute(`iSize`,r(this.iSize,2)),this.geo.setAttribute(`iCol`,r(this.iCol,3)),this.geo.setAttribute(`iA`,r(this.iA,1)),this.geo.setAttribute(`iL`,r(this.iL,3)),this.geo.instanceCount=0;let i=new Ih({uniforms:{...xb(),uFog:Z.uFog},vertexShader:eT,fragmentShader:tT,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),a=new Km(this.geo,i);a.frustumCulled=!1,a.renderOrder=1,e.add(a)}setLighting(e){this.L=e,this.list.forEach((e,t)=>this.light(e,t)),this.geo.getAttribute(`iL`).needsUpdate=!0}light(e,t){let n=this.L.atPoint(e.x,e.y+.05,e.z);this.iL[t*3]=n[0],this.iL[t*3+1]=n[1],this.iL[t*3+2]=n[2]}static under(e,t,n,r,i,a,o){let s=e-n,c=t-r,l=Math.cos(i),u=Math.sin(i);return Math.abs(s*l-c*u)<a/2&&Math.abs(s*u+c*l)<o/2}printAt(t,n,r,i){for(let a=0;a<this.list.length;a++){let o=this.list[a];if(o.stuff===i&&Math.abs(o.y-n)<.3&&e.under(t,r,o.x,o.z,this.iYaw[a],o.w,o.l))return a}return-1}spilt(e,t,n,r){for(let i of e.world.def.stains??[])if(Math.abs(i.y-n)<.5&&Math.hypot(i.x-t,i.z-r)<i.r+.12)return`red`;for(let i of e.pools)if(!i.kind&&Math.abs(i.y-n)<.5&&Math.hypot(i.x-t,i.z-r)<i.r*.45+.12)return`red`;for(let i of e.cast)if(!(!i.dead||i.away||i.fixed||i.swim||Math.abs(i.y-n)>.5)&&Math.hypot(i.x-t,i.z-r)<i.r*1.2+.12)return i.green?`green`:`red`;return null}put(e,t,n,r,i,a,o,s){let c={x:e,y:t+.012,z:n,stuff:o,k:s,age:0,w:i,l:a,w0:i,l0:a},l=this.next;this.next=(this.next+1)%Kw,this.list[l]=c,this.iPos.set([c.x,c.y,c.z],l*3),this.iYaw[l]=r,this.iSize[l*2]=i,this.iSize[l*2+1]=a,this.light(c,l),this.geo.instanceCount=this.list.length;for(let e of[`iPos`,`iYaw`,`iSize`,`iL`])this.geo.getAttribute(e).needsUpdate=!0}step(e,t,n,r,i,a,o,s,c){if(s){t.wet=1;return}if(!c)return;t.left=!t.left;let l=t.left?-n.side:n.side,u=r+Math.cos(o)*l,d=a-Math.sin(o)*l,f=this.spilt(e,u,i,d);if(f&&(t.blood=1,t.sap=f===`green`),t.wet<.08&&t.blood<.1)return;let p=t.blood>=.1?t.sap?`green`:`red`:`wet`,m=p===`wet`?t.wet:t.blood,h=this.printAt(u,i,d,p);if(h>=0){let e=this.list[h];e.w=Math.min(e.w0*Xw.most,e.w+Xw.by),e.l=Math.min(e.l0*Xw.most,e.l+Xw.by),e.k=Math.max(e.k,m),e.age=0,this.iSize[h*2]=e.w,this.iSize[h*2+1]=e.l,this.geo.getAttribute(`iSize`).needsUpdate=!0}else{let e=.85+.15*m;this.put(u,i,d,o+(Math.random()-.5)*.3,n.w*e,n.l*e,p,m)}t.wet*=qw,t.blood*=Jw,t.wet<.08&&(t.wet=0),t.blood<.1&&(t.blood=0)}reset(e){this.sim=e,this.list=[],this.next=0,this.you=null,this.feet.clear(),this.geo.instanceCount=0}static feet(e,t,n){return{x:e,z:t,gone:0,left:!1,wet:0,blood:0,sap:n}}update(t,n){t!==this.sim&&this.reset(t);let r=t.world,i=t.player,a=i.body,o=this.you??=e.feet(a.x,a.z,!1),s=a.ground&&!a.on,c=i.water===`dry`;i.fly||this.walked(o,a.x,a.z,Qw.pace,()=>this.step(t,o,Qw,a.x,a.y,a.z,i.yaw,!c,s)),o.x=a.x,o.z=a.z;for(let n of t.cast){let i=$w[n.ai];if(!i||n.dead||n.fixed||n.swim||n.ride){this.feet.delete(n);continue}let a=this.feet.get(n);a||this.feet.set(n,a=e.feet(n.x,n.z,!!n.green));let o=n.body,s=n.yaw+Math.PI,c=r.waterAt(n.x,n.z)>n.y+.05,l=!o||o.ground&&!o.on,u=a;this.walked(u,n.x,n.z,i.pace,()=>this.step(t,u,i,n.x,n.y,n.z,s,c,l)),a.x=n.x,a.z=n.z}this.list.forEach((e,t)=>{e.age+=n,this.iCol.set(Zw[e.stuff],t*3),this.iA[t]=e.stuff===`wet`?.45*e.k*Math.max(0,1-e.age/Yw):.3+.6*e.k}),this.geo.getAttribute(`iCol`).needsUpdate=!0,this.geo.getAttribute(`iA`).needsUpdate=!0}walked(e,t,n,r,i){let a=Math.hypot(t-e.x,n-e.z);a<3&&(e.gone+=a),e.gone>=r&&(e.gone=0,i())}},rT=48,iT=48,aT=9.8,oT=(e,t)=>e+Math.random()*(t-e);function sT(e){let t=new d(`drips:`+e.def.id),n=[];for(let r of e.rooms){if(r.doorway)continue;let i=(r.x0+r.x1)/2,a=(r.z0+r.z1)/2,o=e.waterAt(i,a)>r.y0-.5;if(!r.cells&&!o)continue;let s=Math.min(3,Math.max(1,Math.round((r.x1-r.x0)*(r.z1-r.z0)/60)));for(let i=0,a=0;i<12&&a<s;i++){let i=t.range(r.x0+.5,r.x1-.5),o=t.range(r.z0+.5,r.z1-.5),s=-1/0;for(let t=r.y0+.5;t<r.y0+r.ht;t+=.5)if(e.roomAt(i,t,o)?.id===r.id){s=t;break}if(!Number.isFinite(s))continue;let c=e.raycast(i,s,o,i,s+30,o),l=e.raycast(i,s,o,i,s-30,o);if(c>=1||l>=1)continue;let u=s+30*c-.02,d=s-30*l,f=e.waterAt(i,o),p=f>d,m=p?f:d+.01;u-m<1||(n.push({x:i,z:o,top:u,low:m,water:p,every:t.range(2,7),t:t.range(0,7)}),a++)}}return n}var cT=`
attribute vec3 iPos; attribute float iSize; attribute vec3 iCol; attribute float iA; attribute vec3 iL;
uniform float uFog;
varying vec3 vC; varying float vA; varying vec2 vS;
${db}
void main(){
  vec3 p = iPos + vec3(position.x * iSize, 0.0, position.z * iSize);
  vec3 tc = cameraPosition - p; float d = length(tc);
  /* a ring on water is mostly what it catches: a little light of its own (iA > 0); a wet patch has none */
  vC = iCol * (iL + carried(p, 1.0) + lying(p, vec3(0.0, 1.0, 0.0)) + (iA > 0.0 ? 0.12 : 0.0));
  vA = iA * exp(-d * uFog);
  vS = position.xz * 2.0;
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
}`,lT=`
varying vec3 vC; varying float vA; varying vec2 vS;
void main(){
  float a = abs(vA), edge = max(abs(vS.x), abs(vS.y));
  if (vA > 0.0 && edge < 0.62) discard;
  if (a < 0.01) discard;
  gl_FragColor = vec4(vC, a);
}`,uT=`
attribute vec3 aL; attribute float aA;
uniform float uFog; uniform float uPx;
varying vec3 vC; varying float vA;
${db}
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vec3 tc = cameraPosition - position; float d = length(tc);
  vC = vec3(0.7, 0.8, 0.85) * (aL + 0.6 * (held(position, 1.0) + lying(position, vec3(0.0))) + bounce(position) + 0.1);
  vA = aA * exp(-d * uFog);
  gl_PointSize = floor(clamp(uPx / max(-mv.z, 0.1), 2.0, 6.0));
  gl_Position = projectionMatrix * mv;
}`,dT=`
varying vec3 vC; varying float vA;
void main(){ if (vA < 0.01) discard; gl_FragColor = vec4(vC, vA); }`,fT=class{L;onDrip;points=[];sim=null;drops=[];dropGeo=new Sm;dPos=new Float32Array(144);dL=new Float32Array(144);dA=new Float32Array(iT);dropMat;ringGeo=new mg;rPos=new Float32Array(144);rSize=new Float32Array(rT);rCol=new Float32Array(144);rA=new Float32Array(rT);rL=new Float32Array(144);rings=[];patches=[];constructor(e,t,n){this.L=t,this.onDrip=n;let r=e=>e.setUsage(Zd);this.dropGeo.setAttribute(`position`,r(new sm(this.dPos,3))),this.dropGeo.setAttribute(`aL`,r(new sm(this.dL,3))),this.dropGeo.setAttribute(`aA`,r(new sm(this.dA,1))),this.dropMat=new Ih({uniforms:{...xb(),uFog:Z.uFog,uPx:{value:30}},vertexShader:uT,fragmentShader:dT,transparent:!0,depthWrite:!1});let i=new yh(this.dropGeo,this.dropMat);i.frustumCulled=!1,e.add(i);let a=new Dh(1,1).rotateX(-Math.PI/2);this.ringGeo.index=a.index,this.ringGeo.setAttribute(`position`,a.getAttribute(`position`));let o=(e,t)=>new Xm(e,t).setUsage(Zd);this.ringGeo.setAttribute(`iPos`,o(this.rPos,3)),this.ringGeo.setAttribute(`iSize`,o(this.rSize,1)),this.ringGeo.setAttribute(`iCol`,o(this.rCol,3)),this.ringGeo.setAttribute(`iA`,o(this.rA,1)),this.ringGeo.setAttribute(`iL`,o(this.rL,3)),this.ringGeo.instanceCount=0;let s=new Ih({uniforms:{...xb(),uFog:Z.uFog},vertexShader:cT,fragmentShader:lT,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),c=new Km(this.ringGeo,s);c.frustumCulled=!1,c.renderOrder=1,e.add(c)}get count(){return this.points.length}setLighting(e){this.L=e}resize(e,t){this.dropMat.uniforms.uPx.value=e/2/Math.tan(t*Math.PI/360)*.012}reset(e){this.sim=e,this.points=sT(e.world),this.patches=this.points.filter(e=>!e.water).slice(0,rT/2),this.drops=[],this.rings=[]}update(e,t){e!==this.sim&&this.reset(e);for(let e of this.points)(e.t-=t)>0||(e.t=e.every*oT(.7,1.3),this.drops.length<iT&&this.drops.push({p:e,t:0}));let n=0;this.drops=this.drops.filter(e=>{e.t+=t;let r=e.p.top-.5*aT*e.t*e.t;if(r<=e.p.low)return this.onDrip(e.p.x,e.p.low,e.p.z,e.p.water),this.rings.length<rT-this.patches.length&&this.rings.push({x:e.p.x,y:e.p.low+.006,z:e.p.z,age:0,life:e.p.water?.9:.35,most:e.p.water?.5:.14,water:e.p.water}),!1;let i=this.L.atPoint(e.p.x,r,e.p.z);return this.dPos.set([e.p.x,r,e.p.z],n*3),this.dL.set(i,n*3),this.dA[n]=.8,n++,!0});for(let e=n;e<iT;e++)this.dA[e]=0;this.dropGeo.setDrawRange(0,n);for(let e of[`position`,`aL`,`aA`])this.dropGeo.getAttribute(e).needsUpdate=!0;let r=0;for(let e of this.patches){let t=this.L.atPoint(e.x,e.low+.05,e.z);this.rPos.set([e.x,e.low+.004,e.z],r*3),this.rSize[r]=.32,this.rCol.set([.05,.05,.055],r*3),this.rL.set(t,r*3),this.rA[r]=-.4,r++}this.rings=this.rings.filter(e=>(e.age+=t)<e.life);for(let e of this.rings){let t=e.age/e.life,n=this.L.atPoint(e.x,e.y+.05,e.z);this.rPos.set([e.x,e.y,e.z],r*3),this.rSize[r]=.04+e.most*t,this.rL.set(n,r*3),this.rCol.set(e.water?[.7,.8,.85]:[.5,.52,.55],r*3),this.rA[r]=.7*(1-t),r++}this.ringGeo.instanceCount=r;for(let e of[`iPos`,`iSize`,`iCol`,`iA`,`iL`])this.ringGeo.getAttribute(e).needsUpdate=!0}},pT=(e,t)=>e+Math.random()*(t-e),mT=e=>e[0]+e[1]+e[2],hT=class extends yr{from;to;on;constructor(e,t,n,r){super(e,n.power,e=>n.open[e],n.looseLights),this.from=t,this.to=n,this.on=r}colourOf(e){let t=this.field.sources[e].room;return(t>=0&&!this.on[t]?this.from:this.to).colourOf(e)}room(e){return(this.on[e]?this.to:this.from).room(e)}flipped(e){let t=[];for(let n of e)this.field.roomSource[n]>=0&&t.push(this.field.roomSource[n]);this.recolour(t)}fittingIn(e,t,n){return n>=0&&!this.on[n]?this.from.fitting(e,t):this.to.fitting(e,t)}},gT=class{strike;L;flips;t=0;end=0;constructor(e,t,n,r,i){this.strike=i;let a=e.rooms.length,o=new Uint8Array(a).fill(1);this.flips=e.rooms.map(()=>[]);let s=Array(a).fill(1/0);if(r>=0){s[r]=0;let t=[r];for(;t.length;){let n=t.shift();for(let r of e.neighbours(n))s[r]===1/0&&(s[r]=s[n]+1,t.push(r))}}let c=r>=0?e.rooms[r]:null;for(let r of e.rooms){let e=t.room(r.id);if(mT(n.room(r.id))<=mT(e)+.01)continue;o[r.id]=0;let i=c?Math.hypot((r.x0+r.x1-c.x0-c.x1)/2,(r.z0+r.z1-c.z0-c.z1)/2)/6:4,a=Math.min(Number.isFinite(s[r.id])?s[r.id]:i,30),l=Math.min(2.6,a*.085+pT(0,.06)),u=[l,l+pT(.04,.08)];u.push(u[1]+pT(.05,.13)),Math.random()<.45&&(u.push(u[2]+pT(.04,.07)),u.push(u[3]+pT(.08,.2))),this.flips[r.id]=u,this.end=Math.max(this.end,u[u.length-1])}this.L=new hT(e,t,n,o)}get done(){return this.t>this.end}update(e){let t=this.t,n=this.t+=e,r=[],i=this.L.on;return this.flips.forEach((e,a)=>{let o=0;for(let r of e)r>t&&r<=n&&o++;if(!o)return;let s=e.filter(e=>e<=n).length;i[a]=s%2,r.push(a),e[0]>t&&e[0]<=n&&this.strike(a)}),r.length&&this.L.flipped(r),r}},_T=e=>document.getElementById(e),vT=class{room=``;roomTimer=0;show(e,t){_T(e).classList.toggle(`hide`,!t)}onClick(e,t){_T(e).addEventListener(`click`,t)}setRoom(e,t,n){let r=_T(`roomn`);if(e&&e+`|`+t!==this.room){this.room=e+`|`+t,r.innerHTML=``,r.append(e);let n=document.createElement(`small`);n.textContent=t,r.append(n),r.style.opacity=`1`,this.roomTimer=2.6}else this.roomTimer>0&&(this.roomTimer-=n)<=0&&(r.style.opacity=`0`)}air(e){_T(`o2w`).classList.toggle(`hide`,e===null),e!==null&&(_T(`o2`).style.width=(e*100).toFixed(1)+`%`)}track(e){let t=_T(`track`);t.classList.toggle(`hide`,e===null),e!==null&&t.textContent!==e&&(t.textContent=e)}dev(e){let t=_T(`devtag`);t.classList.toggle(`hide`,e===null),e!==null&&t.textContent!==e&&(t.textContent=e)}},yT=e=>document.getElementById(e),bT=e=>e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`),xT=class{send;game;onClose;open=null;promptText=``;wpnText=``;invHtml=``;constructor(e,t,n){this.send=e,this.game=t,this.onClose=n,yT(`invb`).addEventListener(`click`,e=>{let t=e.target,n=t.closest(`[data-d]`),r=t.closest(`[data-pt]`),i=t.closest(`[data-t]`),a=t.closest(`[data-i]`),o=t.closest(`[data-n]`),s=t.closest(`[data-w]`);if(n)this.send({type:`drop`,slot:+n.dataset.d});else if(r)this.send({type:`putDown`,tool:r.dataset.pt});else if(s)this.send({type:`unwear`,id:s.dataset.w});else if(i)this.send({type:`light`,tool:i.dataset.t});else if(a)this.send({type:`use`,slot:+a.dataset.i});else if(o){this.send({type:`read`,key:o.dataset.n});return}else return;setTimeout(()=>this.renderInv(),30)}),yT(`note`).addEventListener(`click`,()=>this.close());let r=``;for(let e of[`1`,`2`,`3`,`4`,`5`,`6`,`7`,`8`,`9`,`C`,`0`])r+=`<button data-k="`+e+`">`+(e===`C`?`Clear`:e)+`</button>`;yT(`padk`).innerHTML=r,yT(`padk`).addEventListener(`click`,e=>{let t=e.target.closest(`[data-k]`);t&&this.send({type:`pad`,key:t.dataset.k})}),yT(`liftb`).addEventListener(`click`,e=>{let t=e.target.closest(`[data-f]`);t&&!t.disabled&&(this.send({type:`lift`,level:t.dataset.f}),this.close())}),yT(`back`).addEventListener(`click`,e=>{e.stopPropagation(),this.open&&this.close()})}touch=!1;show(e){this.closeAll(),this.open=e,yT(e).classList.remove(`hide`),document.body.classList.add(`panelled`),e===`inv`&&(this.invHtml=``,this.renderInv()),document.pointerLockElement&&document.exitPointerLock()}close(){this.open===`pad`&&this.send({type:`padClose`}),this.closeAll(),this.onClose()}closeAll(){for(let e of[`inv`,`note`,`pad`,`lift`])yT(e).classList.add(`hide`);document.body.classList.remove(`panelled`),this.open=null}say(e){let t=document.createElement(`p`),n=yT(`msgs`);for(t.textContent=e,n.appendChild(t);n.children.length>4;)n.removeChild(n.firstChild);setTimeout(()=>{t.style.opacity=`0`},4800),setTimeout(()=>t.remove(),5900)}prompt(e){let t=e??``;if(t===this.promptText)return;this.promptText=t;let n=yT(`prompt`);n.innerHTML=t?this.touch?`<kbd>Use</kbd>`:`<kbd>E</kbd>`:``,t&&n.append(t)}status(e,t,n,r=0){yT(`hp`).style.width=e.hp+`%`,yT(`batw`).classList.toggle(`hide`,!e.light),yT(`bat`).style.width=e.batt+`%`,yT(`bat`).style.opacity=e.lightOn?`1`:`0.45`,yT(`o2w`).classList.toggle(`hide`,t===null),t!==null&&(yT(`o2`).style.width=(t*100).toFixed(1)+`%`);let i=e.weapon?ti[e.weapon].n:`Bare hands`,a=e.weapon?ti[e.weapon].w:null;a?.gun&&(i+=` (`+(e.inv.find(e=>e.id===a.ammo)?.n??0)+`)`);let o=bT(i)+(n?`<span>crouched</span>`:``)+(e.lightOn?`<span>`+(e.light===`flash`?`flashlight`:`lantern`)+`</span>`:``);o!==this.wpnText&&(this.wpnText=o,yT(`wpn`).innerHTML=o),e.ended||(yT(`vig`).style.opacity=String(Math.max(r,e.hp<35?(35-e.hp)/50:0)))}renderInv(){let e=this.game(),t=`<h2>Carried <span>`+e.inv.length+` of `+e.cap+`</span></h2><div class="slots">`;for(let n=0;n<e.cap;n++){let r=e.inv[n];if(r){let i=ti[r.id],a=e.weapon===r.id;t+=`<div class="slot`+(a?` on`:``)+`"><button class="use" data-i="`+n+`"><b>`+bT(i.n)+`</b>`+(r.n>1?`<em>×`+r.n+`</em>`:``)+`<small>`+bT(i.d??``)+(a?` In hand.`:``)+`</small></button><button class="drop" data-d="`+n+`">Put down</button></div>`}else t+=`<div class="slot empty"></div>`}let n=`<p>Prisoner's garb</p>`+e.worn.map(e=>`<button data-w="`+e+`">`+bT(ti[e].n)+`</button>`).join(``),r=e.keys.map(ri);t+=`</div><div class="cols"><section><h3>Lights</h3>`+(e.tools.length?e.tools.map(t=>`<div class="tool"><button data-t="`+t+`">`+bT(ti[t].n)+(e.light===t?e.lightOn?` (on)`:` (ready)`:``)+`</button><button class="drop" data-pt="`+t+`">Put down</button></div>`).join(``):`<p>None</p>`)+`</section><section><h3>Worn</h3>`+n+`</section><section><h3>Keys</h3><p>`+(r.length?r.map(bT).join(`<br>`):`None`)+`</p></section><section><h3>Papers</h3>`+(e.read.length?e.read.map(t=>`<button data-n="`+t+`">`+bT(e.notes[t].t)+`</button>`).join(``):`<p>None</p>`)+`</section></div><p class="hint">`+(this.touch?`Tap an item to use it, put it on or take it in hand; tap something worn to take it off.`:`Click an item to use it, put it on or take it in hand; click something worn to take it off. Tab closes.`)+`</p>`,t!==this.invHtml&&(this.invHtml=t,yT(`invb`).innerHTML=t)}showNote(e,t){let n=e.notes[t],r=yT(`notet`);r.innerHTML=`<h2></h2><div></div><footer>`+(this.touch?`Tap`:`E`)+` to put it down</footer>`,r.firstElementChild.textContent=n.t,r.children[1].textContent=n.b,this.show(`note`)}miss=null;renderPad(e){let t=e.pad?.miss,n=performance.now();t&&(!this.miss||this.miss.code!==t)&&(this.miss={code:t,until:n+350}),t||(this.miss=null);let r=this.miss&&n<this.miss.until?this.miss.code:e.pad?.typed??``;yT(`padd`).textContent=(r+`····`).slice(0,4)}showLift(e){let t=`<h2>Lift <span>Gen-1 running</span></h2>`;for(let n of e)t+=`<button data-f="`+n.id+`"`+(n.here?` disabled`:``)+`>`+bT(n.name)+`</button>`;yT(`liftb`).innerHTML=t+(this.touch?``:`<p class="hint">Esc steps back.</p>`),this.show(`lift`)}showEnd(e,t,n){let r=Math.floor(e.time),i=Math.floor(r/60),a=(`0`+r%60).slice(-2);yT(`endh`).textContent=t?`Surface`:`Grafted`,yT(`endp`).textContent=t?`The lift climbs for a long time. When the doors open it is raining, and the rain is the first thing in nine days that has asked nothing of you. Six floors down, something green and something red go on disagreeing about who the station belongs to. `+i+`:`+a+` underground, `+e.kills+` put down, `+e.read.length+` of `+Object.keys(e.notes).length+` papers read.`:n+` Lowfield keeps what it is given.`,setTimeout(()=>yT(`end`).classList.remove(`hide`),t?300:900),t||(yT(`vig`).style.opacity=`1`)}},ST=(e,t=``)=>{let n=document.createElement(`div`);return n.id=e,t&&(n.className=t),n},CT=class{canvas;root=ST(`feed`,`hide`);name=ST(`feedn`);clock=ST(`feedt`);none=ST(`feedx`);on=!1;constructor(e){this.canvas=e,this.none.textContent=`NO SIGNAL`;let t=ST(`feedh`);t.innerHTML=`<span class="keysonly"><kbd>A</kbd><kbd>D</kbd> camera &nbsp; <kbd>E</kbd> stand up</span><span class="touchonly">Stick left or right: camera &nbsp; <kbd>Use</kbd> stand up</span>`,this.root.append(this.name,this.clock,this.none,t),document.body.append(this.root)}update(e,t){let n=zl(e),r=e.watch;if(!n||!r)return this.on&&(this.on=!1,this.root.classList.add(`hide`),this.canvas.style.filter=``,t.layers.disable(1),document.body.classList.remove(`watching`)),!1;this.on=!0,this.root.classList.remove(`hide`),document.body.classList.add(`watching`),t.layers.enable(1);let i=n.cam.def;t.position.set(i.x,i.y,i.z),t.rotation.set(-.32,i.yaw+Math.PI,0),this.name.textContent=`CAM ${r.at+1}/${r.feeds.length}  ${(i.name??``).toUpperCase()}`;let a=11640+e.game.time,o=Math.floor(a/3600)%24,s=Math.floor(a/60)%60,c=Math.floor(a)%60;return this.clock.textContent=[o,s,c].map(e=>String(e).padStart(2,`0`)).join(`:`),this.none.classList.toggle(`hide`,n.live),this.canvas.style.filter=n.live?`grayscale(0.85) contrast(1.35) brightness(1.15)`:`brightness(0)`,!0}},wT=.5,TT=class{now=new Map;sum=new Map;most=new Map;frames=0;t=0;shown=new Map;add(e,t){this.now.set(e,(this.now.get(e)??0)+t)}end(e){for(let[e,t]of this.now)this.sum.set(e,(this.sum.get(e)??0)+t),this.most.set(e,Math.max(this.most.get(e)??0,t));this.now.clear(),this.frames++,this.t+=e,!(this.t<wT)&&(this.shown=new Map([...this.sum].map(([e,t])=>[e,{mean:t/this.frames,max:this.most.get(e)}])),this.sum.clear(),this.most.clear(),this.frames=0,this.t=0)}line(e,t=2){return e.map(e=>{let n=this.shown.get(e);return`${e} ${n?`${n.mean.toFixed(t)}/${n.max.toFixed(t)}`:`-`}`}).join(`  `)}},ET=[1,.85,.72,.6,.5,.42],DT={window:1,trim:.1,frame:1e3/60,slow:1.2,quick:1.06,page:.75,gain:.9,depth:3,calm:3,ceiling:30,rest:60},OT=class{step;t=0;times=[];work=0;now=0;calm=0;slowUntil=ET.map(()=>0);slowFor=ET.map(()=>DT.ceiling);trial=null;restUntil=0;rest=DT.rest;constructor(e=0){this.step=Math.max(0,Math.min(ET.length-1,Math.round(e)))}get scale(){return ET[this.step]}frame(e,t){if(this.now+=e,e<=0||(this.t+=e,this.times.push(e*1e3),this.work+=t,this.t<DT.window))return!1;let n=this.times.sort((e,t)=>e-t),r=n.slice(0,n.length-Math.floor(n.length*DT.trim)),i=r.reduce((e,t)=>e+t,0)/r.length,a=this.work/n.length,o=this.step;this.t=this.work=0,this.times=[];let s=DT,c=i>s.frame*s.slow,l=this.trial;return l?i<=l.was*s.gain?this.trial=null:l.depth<s.depth&&this.step<ET.length-1?(this.step++,l.depth++):(this.step=l.from,this.slowUntil[l.from]=0,this.restUntil=this.now+this.rest,this.rest*=2,this.trial=null):c&&a<s.page*i&&this.step<ET.length-1&&this.now>=this.restUntil&&(this.slowUntil[this.step]=this.now+this.slowFor[this.step],this.slowFor[this.step]*=2,this.trial={from:this.step,was:i,depth:1},this.step++),this.calm=i<s.frame*s.quick?this.calm+1:0,this.calm>=s.calm&&this.step>0&&this.now>=this.slowUntil[this.step-1]&&!this.trial&&(this.step--,this.calm=0),this.step!==o}},kT={reach:52,run:1.4,dead:.12,look:.0042,side:.42},AT=[[`hands`,`Swing`],[`use`,`Use`],[`light`,`Light`],[`jump`,`Jump`],[`crouch`,`Crouch`],[`carry`,`Carried`],[`pause`,`Pause`]],jT=class{controls;on;speed=1;root=document.createElement(`div`);stick=document.createElement(`div`);knob=document.createElement(`i`);buttons=new Map;fingers=new Map;hold={forward:0,strafe:0,run:!1,attack:!1,rise:!1,sink:!1};constructor(e,t){this.controls=e,this.on=t,e.touch=this.hold,this.root.id=`touch`,this.root.className=`hide`,this.stick.id=`stick`,this.stick.append(this.knob),this.root.append(this.stick);for(let[e,t]of AT){let n=document.createElement(`div`);n.className=`tb`,n.dataset.tb=e,n.textContent=t,this.buttons.set(e,n),this.root.append(n)}document.body.append(this.root);let n=this.root;n.addEventListener(`pointerdown`,e=>this.down(e)),n.addEventListener(`pointermove`,e=>this.move(e));for(let e of[`pointerup`,`pointercancel`])n.addEventListener(e,e=>this.up(e));n.addEventListener(`contextmenu`,e=>e.preventDefault()),n.addEventListener(`touchend`,e=>e.preventDefault(),{passive:!1})}show(e){if(this.root.classList.toggle(`hide`,!e),!e)for(let e of[...this.fingers.keys()])this.lift(e)}update(e,t){this.buttons.get(`use`).classList.toggle(`lit`,e);let n=this.buttons.get(`hands`),r=t?`Fire`:`Swing`;n.textContent!==r&&(n.textContent=r)}down(e){e.preventDefault(),this.root.setPointerCapture?.(e.pointerId);let t=e.target.closest(`[data-tb]`)?.dataset.tb,n=[...this.fingers.values()].some(e=>e.on===`stick`),r=t??(e.clientX<innerWidth*kT.side&&!n?`stick`:`look`);this.fingers.set(e.pointerId,{on:r,x:e.clientX,y:e.clientY,x0:e.clientX,y0:e.clientY});let i=this.controls,a=this.hold;r===`stick`?(this.stick.style.left=e.clientX+`px`,this.stick.style.top=e.clientY+`px`,this.stick.classList.add(`on`),this.pushStick(0,0)):r!==`look`&&(this.buttons.get(r).classList.add(`down`),r===`hands`?(a.attack=!0,i.push(`attack`)):r===`jump`?(a.rise=!0,i.push(`jump`)):r===`crouch`?(a.sink=!0,i.push(`crouch`)):r===`use`||r===`light`?i.push(r):r===`carry`?this.on.carry():r===`pause`&&this.on.pause())}move(e){let t=this.fingers.get(e.pointerId);if(!t)return;let n=e.clientX-t.x,r=e.clientY-t.y;if(t.x=e.clientX,t.y=e.clientY,t.on===`stick`)this.pushStick(t.x-t.x0,t.y-t.y0);else if(t.on===`look`||t.on===`hands`){let e=kT.look*this.speed;this.controls.look(-n*e,-r*e)}}up(e){this.lift(e.pointerId)}lift(e){let t=this.fingers.get(e);if(!t)return;this.fingers.delete(e);let n=this.hold;t.on===`stick`?(this.stick.classList.remove(`on`,`run`),n.forward=n.strafe=0,n.run=!1):t.on!==`look`&&(this.buttons.get(t.on).classList.remove(`down`),t.on===`hands`?n.attack=!1:t.on===`jump`?n.rise=!1:t.on===`crouch`&&(n.sink=!1))}pushStick(e,t){let n=kT,r=Math.hypot(e,t),i=n.reach*n.run,a=r>i?i/r:1,o=this.hold;this.knob.style.transform=`translate(${e*a}px, ${t*a}px)`;let s=Math.min(1,r/n.reach),c=r>0?s/r:0,l=s>n.dead;o.forward=l?-t*c:0,o.strafe=l?e*c:0,o.run=r>n.reach*n.run*.92,this.stick.classList.toggle(`run`,o.run)}},MT=new URLSearchParams(location.search),NT=MT.has(`dev`),PT=MT.has(`fps`),FT=matchMedia(`(pointer: coarse)`).matches;FT&&document.body.classList.add(`touch`);var IT=`rootshock-v2:scale`,LT=PC(IT),RT=new OT(LT===null?FT?2:0:Number(LT)),zT=document.getElementById(`c`),BT=new vT,VT;try{VT=new mw(zT,RT.scale)}catch{throw document.getElementById(`titleg`).textContent=`This browser could not start WebGL.`,Error(`no WebGL`)}var HT=MT.get(`level`)??Dn.start,UT=Dn.levels.some(e=>e.id===HT);if(UT&&MT.get(`power`)===`full`){Dn.main=!0;for(let e of Object.values(Dn.circuits))e.on=!0,e.broken=!1}var WT=`rootshock-v2:run`,GT=!NT&&UT&&!MT.has(`level`),KT=GT?PC(WT):null,qT=null;if(KT)try{qT=sC(Dn,JSON.parse(KT))}catch{FC(WT,null)}var JT=Math.random()*2**32>>>0,YT=!MT.has(`level`)&&MT.get(`power`)!==`full`,XT=qT??(UT?nC(Dn,{seed:JT,start:HT,opening:YT}):aC(_u(ye(),{seed:JT}))),$=XT.here,ZT=`title`;function QT(){GT&&$.tick>0&&!$.game.ended&&ZT!==`title`&&ZT!==`end`&&FC(WT,JSON.stringify(oC(XT)))}if(qT){document.getElementById(`titleg`).innerHTML=`<span class="keysonly">Click</span><span class="touchonly">Tap</span> to go on where you left off`;let e=document.createElement(`p`),t=document.createElement(`a`);e.className=`aside`,t.href=`#`,t.textContent=`Or start again from the cell.`,t.addEventListener(`click`,e=>{e.preventDefault(),e.stopPropagation(),FC(WT,null),location.reload()}),e.append(t),document.getElementById(`title`).append(e)}document.addEventListener(`visibilitychange`,()=>{document.hidden&&(FT&&ZT===`play`&&ME(`pause`),QT())}),window.addEventListener(`pagehide`,QT);var $T=()=>$.lighting??=pu($),eE=$T(),tE=new Map;function nE(){let e=tE.get($);return e?e.relight(eE):tE.set($,e=new ww($,eE,NT)),e}var rE=nE();VT.show(rE.group),rE.bind(),VT.scene.add(VT.camera),VT.scene.matrixWorldAutoUpdate=!1;var iE=new jw(VT.camera,$,eE),aE=new xx(VT.scene,$,eE),oE=0,sE=0,cE=document.getElementById(`hitdir`),lE=new RC,uE=new CT(zT),dE=new zS,fE=new nT(VT.scene,eE),pE=new fT(VT.scene,eE,(e,t,n,r)=>_E.dripAt($,e,t,n,r)),mE=new Gw(VT.scene,eE,(e,t,n,r)=>_E.gust($,e,t,n,r)),hE=new n,gE=new UC,_E=new rw(gE),vE={x:0,y:0,z:0},yE=document.getElementById(`fade`),bE=new BC(zT,()=>{ZT===`play`&&ME(`pause`)},e=>xE.say(e)),xE=new xT(e=>$.game.commands.push(e),()=>$.game,()=>{ZT===`panel`&&(ME(`play`),bE.lock())});xE.touch=FT;var SE=FT?new jT(bE,{carry:()=>{ZT===`play`&&NE(()=>xE.show(`inv`))},pause:()=>{ZT===`play`&&ME(`pause`)}}):null;function CE(){FT&&!document.fullscreenElement&&document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen({navigationUI:`hide`}).then(()=>screen.orientation.lock?.(`landscape`)).catch(()=>{})}document.addEventListener(`fullscreenchange`,()=>{FT&&!document.fullscreenElement&&ZT===`play`&&ME(`pause`)});var wE={bright:!1,track:!1,slow:1,frozen:!1},TE=[],EE=[[`husk`,{}],[`skitter`,{}],[`thresher`,{}],[`worm`,{}],[`skitter`,{big:1}]],DE=[null,`baton`,`pipe`,`wrench`,`axe`,`knife`];NT&&(EE.forEach(([e,t],n)=>bE.onKey.set(`Digit`+(n+1),()=>{if(ZT!==`play`)return;let n=$.player.body,r=n.x-Math.sin($.player.yaw)*3.5,i=n.z-Math.cos($.player.yaw)*3.5,a=$.world.groundBelow({x:r,z:i,hx:.3,hz:.3,round:!0},n.y+1.5),o=ds($,e,r,a,i,t);o&&wE.frozen&&(o.stun=1e9)})),bE.onKey.set(`Digit0`,()=>ml($)),bE.onKey.set(`KeyT`,()=>{wE.slow=wE.slow===1?.25:wE.slow===.25?.1:1}),bE.onKey.set(`KeyY`,()=>{let e=$.game,t=DE[(DE.indexOf(e.weapon)+1)%DE.length];t&&!e.inv.some(e=>e.id===t)&&fi(e,t),e.weapon=t}),bE.onKey.set(`KeyH`,()=>{let e=$.hands;$.game.hp=100,e.poise=30,e.stag=e.down=e.rise=0}),bE.onKey.set(`KeyU`,()=>{wE.frozen=!wE.frozen;for(let e of $.cast)e.stun=wE.frozen?1e9:0}),bE.onKey.set(`KeyV`,()=>{$.player.fly=!$.player.fly}),bE.onKey.set(`KeyG`,()=>{$.game.god=!$.game.god}),bE.onKey.set(`KeyB`,()=>{wE.bright=!wE.bright,Z.uBright.value=wE.bright?.55:0}),bE.onKey.set(`KeyO`,()=>rE.overlay?.toggle()),bE.onKey.set(`KeyP`,()=>{wE.track=!wE.track,OE=``}));var OE=``,kE=0,AE=new Map;function jE(e){if(!wE.track||!UT){BT.track(null);return}let t=$.game,n=$.player.body,r=$.world.roomAt(n.x,n.y+.5,n.z),i=JSON.stringify([$.world.def.id,r?.id,t.inv,t.worn,t.keys,t.read,t.station,$.doors.map(e=>e.unlocked),$.items.map(e=>e.taken)]);if(kE-=e,i===OE&&!($.player.under&&kE<=0))return;OE=i,kE=.5;let a=e=>XT.sims.get(e)??AE.get(e)??(AE.set(e,_u(tC(Dn,e),{station:Dn,seed:1})),AE.get(e));try{BT.track(NC(TC($,{through:a})))}catch(e){BT.track(`The tracker cannot say: `+e.message)}}function ME(e){e===`pause`&&QT(),ZT=e,bE.enabled=e===`play`,BT.show(`title`,e===`title`),BT.show(`pause`,e===`pause`),BT.show(`hud`,e!==`title`),SE?.show(e===`play`),document.body.classList.toggle(`playing`,e===`play`)}function NE(e){ME(`panel`),e()}var PE=`rootshock-v2:bright`,FE=[...document.querySelectorAll(`input.brightness`)],IE=Number(PC(PE))||1;for(let e of FE)e.value=String(IE),e.closest(`p`).addEventListener(`click`,e=>e.stopPropagation()),e.addEventListener(`input`,()=>{IE=Number(e.value),FC(PE,String(IE));for(let t of FE)t.value=e.value});var LE=`rootshock-v2:look`,RE=[...document.querySelectorAll(`input.lookspeed`)];SE&&(SE.speed=Number(PC(LE))||1);for(let e of RE)e.value=String(SE?.speed??1),e.addEventListener(`input`,()=>{SE&&(SE.speed=Number(e.value)),FC(LE,e.value);for(let t of RE)t.value=e.value});var zE=`rootshock-v2:detail`,BE=[...document.querySelectorAll(`input.detail`)],VE=MT.get(`detail`)?MT.get(`detail`)!==`off`:PC(zE)!==`off`;function HE(e,t){VE=e,wb(e),_E.materials=e;for(let t of tE.values())t.showDetail(e);for(let t of BE)t.checked=e;t&&FC(zE,e?`on`:`off`)}for(let e of BE)e.closest(`p`).addEventListener(`click`,e=>e.stopPropagation()),e.addEventListener(`change`,()=>HE(e.checked,!0));HE(VE,!1),NT&&bE.onKey.set(`KeyM`,()=>HE(!VE,!1)),BT.onClick(`title`,()=>{FC(WT,null),gE.start(),ME(`play`),bE.lock(),CE()}),BT.onClick(`pause`,()=>{ME(`play`),bE.lock(),CE()}),document.getElementById(`end`).addEventListener(`click`,()=>location.reload()),window.addEventListener(`keydown`,e=>{if(e.repeat)return;let t=e.code;if(ZT===`play`&&(t===`Tab`||t===`KeyI`)){NE(()=>xE.show(`inv`));return}if(ZT===`end`&&t===`KeyR`){location.reload();return}if(ZT!==`panel`)return;let n=xE.open;if(n===`pad`){let e=/^(?:Digit|Numpad)(\d)$/.exec(t);e?$.game.commands.push({type:`pad`,key:e[1]}):t===`Backspace`?$.game.commands.push({type:`pad`,key:`C`}):(t===`Escape`||t===`Tab`)&&xE.close()}else(t===`Escape`||t===`Tab`||t===`KeyI`||t===`KeyE`&&n!==`inv`||t===`Space`&&n===`note`)&&xE.close()});function UE(){let e=$.hands,t=$.game,n=$.player.body,r=e.down>0?`down`:e.rise>0?`getting up`:e.stag>0?`reeling`:``;return`${`you  hp ${Math.max(0,t.hp).toFixed(0)}  poise ${e.poise.toFixed(0)}/30  ${Math.hypot(n.vx,n.vz).toFixed(1)} m/s  ${t.weapon??`fists`}  ${r}${wE.slow<1?`  time ×${wE.slow}`:``}${wE.frozen?`  cast held`:``}`}\n1-5 put down changed skitter thresher worm big-skitter  0 clear  T slow  Y weapon  H heal  U hold\n${TE.join(`
`)}`}var WE=null;function GE(e){eE=e,rE.relight(e),iE.setLighting(e),aE.setLighting(e),mE.setLighting(e),fE.setLighting(e),pE.setLighting(e)}function KE(){$=XT.here,WE=null,eE=$T(),rE=nE(),VT.show(rE.group),rE.bind(),dE.rescan(),iE.sim=$,iE.setLighting(eE),aE.sim=$,aE.setLighting(eE),mE.setLighting(eE),fE.setLighting(eE),pE.setLighting(eE),lE.reset();let e=$.player.body;vE.x=e.x,vE.y=e.y,vE.z=e.z,yE.style.transition=`none`,yE.style.opacity=`1`,requestAnimationFrame(()=>{yE.style.transition=`opacity .65s`,yE.style.opacity=`0`})}function qE(){let e=$.game;for(let t of e.events.splice(0))switch(t.type){case`say`:xE.say(t.text);break;case`log`:NT&&(TE.push(t.text),TE.length>5&&TE.shift());break;case`sfx`:_E.event($,t);break;case`note`:NE(()=>xE.showNote(e,t.key));break;case`pad`:NE(()=>{xE.show(`pad`),xE.renderPad(e)});break;case`lift`:NE(()=>xE.showLift(Dn.levels.map(e=>({id:e.id,name:e.name,here:e.id===$.world.def.id}))));break;case`level`:break;case`power`:{let e=$.player.body,n=$.world.roomAt(e.x,e.y+.5,e.z),r=WE?WE.L.to:eE;WE=new gT($.world,r,$T(),n?.id??-1,e=>_E.strike($,$.world.rooms[e])),GE(WE.L),_E.powerChanged(),t.loud&&gE.play(`power`);break}case`relight`:WE=null,GE($T());break;case`hurt`:if(oE=t.shake>0?1:Math.max(oE,.7),lE.shake=Math.max(lE.shake,t.shake),t.from){let e=$.player.body,n=Math.atan2(t.from.x-e.x,-(t.from.z-e.z))+$.player.yaw;lE.struck(n),cE.style.setProperty(`--hx`,(50+50*Math.sin(n)).toFixed(1)+`%`),cE.style.setProperty(`--hy`,(50-50*Math.cos(n)).toFixed(1)+`%`),sE=1}break;case`impact`:lE.impact(t.k);break;case`shake`:lE.shake=Math.max(lE.shake,t.k);break;case`end`:ME(`end`),document.pointerLockElement&&document.exitPointerLock(),xE.showEnd(e,t.win,t.msg)}xE.open===`pad`&&(xE.renderPad(e),e.pad||xE.close()),xE.open===`inv`&&xE.renderInv()}var JE=0,YE=60,XE=0,ZE=1,QE=new TT;VT.renderer.info.autoReset=!1;function $E(e){requestAnimationFrame($E);let t=performance.now();VT.renderer.info.reset();let n=JE?Math.min(.25,(e-JE)/1e3):0;if(JE=e,ZT===`play`){let e=hE.advance(n*wE.slow);for(let t=0;t<e;t++){let e=$.player.body;vE.x=e.x,vE.y=e.y,vE.z=e.z,rC(XT,bE.take()),XT.here!==$&&(qE(),KE())}QE.add(`steps`,e)}else ZT===`panel`&&xu($);let r=performance.now();if(QE.add(`sim`,r-t),!$.tick){let e=$.player.body;vE.x=e.x,vE.y=e.y,vE.z=e.z}lE.update(VT.camera,$,vE,ZT===`play`?hE.alpha:1,n,bE.pending),iE.shown=!uE.update($,VT.camera);let i=$.game;XE-=n,XE<0&&Math.random()<n*(i.batt<20?1.4:.3)&&(XE=.05+Math.random()*.2),XE>0&&i.lightOn&&(Z.uFlash.value*=.25,Z.uBounce.value*=.25);let a=performance.now();rE.update(ZT===`play`?hE.alpha:1,VT.camera);let o=performance.now()-a;QE.add(`cast`,o);{let e=$.player.body,t=eE.atPoint(e.x,e.y+1,e.z),r=Math.max(t[0],t[1],t[2])+Z.uFlash.value*.12+Z.uBounce.value*2+Z.uLamp.value*.3,i=Math.min(1,Math.max(0,(r-.02)/.48)),a=wE.bright?1:1.45-.25*i*i*(3-2*i);ZE+=(a-ZE)*Math.min(1,n*(a>ZE?.6:4)),Z.uExpo.value=ZE*IE}if(WE){let e=WE.update(n);e.length&&rE.relightRooms(eE,e),WE.done&&(GE(WE.L.to),WE=null)}eE.follow(e=>$.doors[e].t),eE.lights(hu($)),rE.syncLight(eE),iE.update(lE.bob,e/1e3),aE.update(lE.at,lE.eye,n),mE.resize(VT.renderer.domElement.height,VT.camera.fov),mE.update($,VT.camera.position,ZT===`play`?n:0),fE.update($,ZT===`play`?n:0),pE.resize(VT.renderer.domElement.height,VT.camera.fov),pE.update($,ZT===`play`?n:0),_E.placedDrips=pE.count>0,oE=Math.max(0,oE-n*.9),sE=Math.max(0,sE-n*1.6),cE.style.opacity=sE.toFixed(2),qE(),ZT===`play`&&_E.update($,n,e/1e3);let s=$.player,c=s.under,l=s.water!==`dry`;Z.uWet.value=c?1:l?.4:0;let u=(c?i.worn.includes(`goggles`)?.075:.21:l?.045:.02)*(wE.bright?.25:1);Z.uFog.value+=(u-Z.uFog.value)*Math.min(1,n*4),xE.prompt(ZT===`play`?$.focus?.text??null:null),SE?.update(!!$.focus||!!$.watch,!!(i.weapon&&ti[i.weapon].w?.gun)),xE.status(i,s.air<s.airMax-.01?s.air/s.airMax:null,s.crouch,oE);let d=$.player.body,f=$.world.roomAt(d.x,d.y+.5,d.z);BT.setRoom($.watch?``:f?.name??``,$.world.def.name,ZT===`title`?0:n),n>0&&(YE+=(1/n-YE)*.05),NT&&jE(n),BT.dev(!NT&&PT?`${Math.round(YE)} fps  ${Math.round(RT.scale*100)}%`:NT?`${d.x.toFixed(2)} ${d.y.toFixed(2)} ${d.z.toFixed(2)}  ${f?.name??`rock`}  ${d.ground?`ground`:`air`}  ${Math.round(YE)} fps\n${$.world.def.name}: ${$.world.grid.chunkCount} chunks  mesh ${rE.meshMs.toFixed(0)} ms in ${rE.pieces} pieces  ${[`fly`,`god`,`bright`].filter(e=>e===`fly`?$.player.fly:e===`god`?$.game.god:wE.bright).join(` `)}\n${eD()}\nV fly  G god  B bright  O colliders  P tracker  M surface detail\n${UE()}`:null);let p=performance.now();VT.scene.updateMatrixWorld(),dE.render(VT.renderer,VT.scene,VT.camera.position,eE.looseLights),VT.draw(e/1e3,Pc($));let m=performance.now(),h=VT.renderer.info.render;QE.add(`gl`,m-p),QE.add(`page`,p-r-o),QE.add(`frame`,m-t),QE.add(`calls`,h.calls),QE.add(`tris`,h.triangles/1e3),QE.end(n),RT.frame(n,p-t)&&(VT.setScale(RT.scale),FC(IT,String(RT.step)))}function eD(){let e=$.cast.filter(e=>e.rag),t=e.filter(e=>e.rag.awake).length;return`ms  ${QE.line([`frame`,`sim`,`cast`,`page`,`gl`])}  (${QE.line([`steps`],1)} a frame)  drawn at ${Math.round(RT.scale*100)}%\n${QE.line([`calls`],0)} draw calls  ${QE.line([`tris`],0)}k triangles  loose bodies ${t} awake of ${e.length}`}NT&&(window.rs={run:XT,view:VT,get sim(){return $},step:rC,save:()=>QS($),saveRun:()=>oC(XT),progress:e=>NC(TC($,e))}),ME(`title`),requestAnimationFrame($E);