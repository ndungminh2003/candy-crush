(()=>{"use strict";var e,t={885:(e,t,i)=>{i(440);class s extends Phaser.Scene{constructor(){super({key:"BootScene"})}preload(){this.cameras.main.setBackgroundColor(10016391),this.createLoadingbar(),this.load.on("progress",(e=>{this.progressBar.clear(),this.progressBar.fillStyle(16774867,1),this.progressBar.fillRect(this.cameras.main.width/4,this.cameras.main.height/2-16,this.cameras.main.width/2*e,16)}),this),this.load.on("complete",(()=>{this.progressBar.destroy(),this.loadingBar.destroy()}),this),this.load.pack("preload","./assets/pack.json","preload")}update(){this.scene.start("GameScene").start("HUDScene")}createLoadingbar(){this.loadingBar=this.add.graphics(),this.loadingBar.fillStyle(6139463,1),this.loadingBar.fillRect(this.cameras.main.width/4-2,this.cameras.main.height/2-18,this.cameras.main.width/2+4,20),this.progressBar=this.add.graphics()}}let h={score:0,highscore:0,gridRows:8,gridColumns:8,tileWidth:72,tileHeight:72,candyTypes:["bear","chicken","fox","frog","hippo"]};var l;!function(e){e[e.NULL=0]="NULL",e[e.CIRCLE=1]="CIRCLE",e[e.RECTANGLE=2]="RECTANGLE",e[e.TRIANGLE=3]="TRIANGLE"}(l||(l={}));class r extends Phaser.GameObjects.Image{constructor(e){super(e.scene,e.x,e.y,e.texture,e.frame),this.isSelect=!1,this.isCombine4=!1,this.isCombine5=!1,this.init()}init(){this.setOrigin(.5,.5),this.setInteractive(),this.scene.add.existing(this),this.isActive=!0,this.tweenSelected=this.scene.add.tween({targets:this,angle:360,yoyo:!0,loop:-1}),this.point=2,this.tweenSelected.pause(),this.particleCombine4=this.scene.add.particles(this.x,this.y,"flare",{color:[9055202,9699539,10040012,4915330],colorEase:"quad.out",lifespan:1500,angle:{min:-120,max:-60},scale:{start:.9,end:0,ease:"expo.out"},speed:{min:150,max:200},quantity:5,frequency:100,blendMode:"ADD",emitting:!1}).startFollow(this,-this.x,-this.y).setDepth(-1),this.particleCombine5=this.scene.add.particles(this.x,this.y,"flare",{color:[65280,3329330,10025880,11403055],colorEase:"quad.out",lifespan:1500,angle:{min:-120,max:-60},scale:{start:.9,end:0,ease:"expo.out"},speed:{min:150,max:200},quantity:5,frequency:100,blendMode:"ADD",emitting:!1}).startFollow(this,-this.x,-this.y).setDepth(-1)}getPoint(){return this.point}setIsActive(e){this.isActive=e}getIsActive(){return this.isActive}getSelected(){!this.isSelect&&this.isActive&&this.tweenSelected.play(),this.isSelect=!0}getDeselected(){this.isSelect&&(this.tweenSelected.pause(),this.angle=0,this.isSelect=!1)}explode3(){this.scene.add.particles(this.x,this.y,"flare",{speed:{min:-50,max:50},lifespan:600,blendMode:"ADD",scale:{start:.2,end:0},gravityY:50,alpha:{start:1,end:0},emitZone:{source:new Phaser.Geom.Rectangle(-h.tileWidth/2,-h.tileHeight/2,64,72),type:"edge",quantity:30,total:120}}).explode(30)}enableCombine4(){this.isCombine4=!0,this.particleCombine4.start()}enableCombine5(){this.isCombine5=!0,this.particleCombine5.start()}disableCombine4(){this.isCombine4=!1,this.particleCombine4&&this.particleCombine4.stop()}disableCombine5(){this.isCombine5=!1,this.particleCombine5&&this.particleCombine5.stop()}getParticleCombine4(){return this.particleCombine4}getParticleCombine5(){return this.particleCombine5}getIsCombine4(){return this.isCombine4}getIsCombine5(){return this.isCombine5}}class n{constructor(e){this.scene=e,this.init()}init(){this.pool=[]}static getInstance(e){return n.instance||(n.instance=new n(e)),n.instance}getTile(e,t){if(this.pool.length>0){let i=this.pool.pop();return i.setVisible(!0),i.setTexture(h.candyTypes[Phaser.Math.RND.between(0,h.candyTypes.length-1)]),i.setPosition(e*h.tileWidth+h.tileWidth/2,t*h.tileHeight+h.tileHeight/2),i}let i=h.candyTypes[Phaser.Math.RND.between(0,h.candyTypes.length-1)];return new r({scene:this.scene,x:e*h.tileWidth+h.tileWidth/2,y:t*h.tileHeight+h.tileHeight/2,texture:i})}returnTile(e){e.setPosition(-100,-100),e.setVisible(!1),this.pool.push(e)}getPool(){return this.pool}clear(){this.pool=[]}}class a{static getInstance(e){return a.instance||(a.instance=new a(e)),a.instance}constructor(e){this.scene=e,this.confetti=this.scene.add.particles(0,window.innerHeight-300,"confetti",{frame:["1.png","2.png","3.png","4.png","5.png","6.png","7.png","8.png","9.png","10.png"],alpha:{min:.8,max:1},lifespan:3e3,angle:{min:-60,max:-30},scale:{start:.3,end:0},speed:{onEmit:e=>{let t=2*-e.angle-800;return Phaser.Math.RND.between(t-200,t+200)}},rotate:{onEmit:()=>Phaser.Math.RND.between(0,360),onUpdate:(e,t,i,s)=>s+4*i},accelerationX:{onEmit:()=>-1e3,onUpdate:e=>e.velocityX>=100?-1e3:0},accelerationY:{onEmit:()=>1200,onUpdate:e=>e.velocityY<=-100?1200:0},quantity:1,gravityY:600}).setDepth(100)}startConfetti(){this.confetti.explode(50)}}class o{constructor(e){this.progress=0,this.scene=e,this.activeTweens=0,this.init()}init(){this.circle=new Phaser.Geom.Circle(300,350,250),this.rectangle=new Phaser.Geom.Rectangle(70,80,500,500),this.triangle=new Phaser.Geom.Triangle(50,550,270,80,550,550)}setPath(e){this.pathType=e}getPoints(e){switch(this.pathType){case l.CIRCLE:return this.circle.getPoints(e.length);case l.RECTANGLE:return this.rectangle.getPoints(e.length);case l.TRIANGLE:return this.triangle.getPoints(e.length)}return[]}areTweensActive(){return this.activeTweens>0}setPositions(e){let t=this.getPoints(e);for(let i=0;i<e.length;i++)e[i].setDepth(1+.001*i),this.activeTweens++,this.scene.add.tween({targets:e[i],x:t[i].x,y:t[i].y,ease:"quad.out",duration:500,onComplete:()=>{this.activeTweens--}})}update(e,t,i){if(this.pathType===l.NULL)return;this.progress+=.001*i,this.progress=this.progress%1;const s=1/e.length;for(let t=0;t<e.length;t++){let h=(this.progress+t*s)%1,r=new Phaser.Geom.Point;switch(this.pathType){case l.CIRCLE:r.setTo(this.circle.getPoint(h).x,this.circle.getPoint(h).y);break;case l.RECTANGLE:r.setTo(this.rectangle.getPoint(h).x,this.rectangle.getPoint(h).y);break;case l.TRIANGLE:r.setTo(this.triangle.getPoint(h).x,this.triangle.getPoint(h).y)}const n=r.x,a=r.y,o=e[t].x,d=e[t].y,c=.02*(n-o),g=.02*(a-d);e[t].setPosition(o+c*i,d+g*i)}}}class d{constructor(e){this.exp=0,this.goal=320}static getInstance(e){return d.instance||(d.instance=new d(e)),d.instance}resetExp(){this.exp=0}getExp(){return this.exp}addExp(e){this.exp+=e}reachGoal(){return this.exp>=this.goal}update(e,t){this.reachGoal()}}const c=[{y:-1,x:-1},{y:-1,x:0},{y:-1,x:1},{y:0,x:-1},{y:0,x:0},{y:0,x:1},{y:1,x:-1},{y:1,x:0},{y:1,x:1}];class g extends Phaser.GameObjects.Container{constructor(e){super(e),this.visited=[],this.idleTimeoutDuration=1e4,this.isIdle=!1,this.isNext=!1,this.totalTweens=0,this.init()}init(){this.tileGrid=[];for(let e=0;e<h.gridRows;e++){this.tileGrid[e]=[];for(let t=0;t<h.gridColumns;t++)this.tileGrid[e][t]=this.addTile(t,e)}this.canMove=!0,this.shapePath=new o(this.scene);for(let e=0;e<h.gridRows;e++){this.visited[e]=[];for(let t=0;t<h.gridColumns;t++)this.visited[e][t]=!1}this.firstSelectedTile=void 0,this.secondSelectedTile=void 0,this.scene.input.on("gameobjectdown",this.tileDown,this),this.scene.input.on("pointerdown",this.handleInteraction,this),this.startIdleTimer(),this.checkMatches(),this.resetHintTimer(),this.clearHint()}update(e,t){d.getInstance(this.scene).reachGoal()&&this.isNext&&(this.resetHintTimer(),this.shapePath.update(this.tileArr,e,t))}resetTileGrid(){if(d.getInstance(this.scene).resetExp(),this.shapePath.setPath(0),this.isNext=!1,this.startIdleTimer(),console.log(this.shapePath.areTweensActive()),this.shapePath.areTweensActive())this.scene.time.delayedCall(100,(()=>this.resetTileGrid()));else for(let e=0;e<h.gridRows;e++)for(let t=0;t<h.gridColumns;t++)this.scene.add.tween({targets:this.tileGrid[e][t],x:t*h.tileWidth+h.tileWidth/2,y:e*h.tileHeight+h.tileHeight/2,ease:"expo.inout",duration:500})}getTileToShuffer(){this.scene.time.removeAllEvents(),this.emitterFirstHint&&this.emitterSecondHint&&(this.emitterFirstHint.stop(),this.emitterSecondHint.stop()),this.tileArr=[];for(let e=0;e<h.gridRows;e++)for(let t=0;t<h.gridColumns;t++){const i=this.tileGrid[e][t];i&&(i.getIsCombine4()?(i.disableCombine4(),console.log("disable combine 4")):i.disableCombine5(),this.tileArr.push(i))}this.shuffleArray(this.tileArr)}shuffleArray(e){for(let t=e.length-1;t>0;t--){const i=Math.floor(Math.random()*(t+1));[e[t],e[i]]=[e[i],e[t]]}}addTile(e,t){let i=h.candyTypes[Phaser.Math.RND.between(0,h.candyTypes.length-1)];return new r({scene:this.scene,x:e*h.tileWidth+h.tileWidth/2,y:t*h.tileHeight+h.tileHeight/2,texture:i})}getTileGrid(){return this.tileGrid}handleInteraction(){this.idleTimer&&this.idleTimer.remove(!1),this.startIdleTimer()}startIdleTimer(){this.idleTimer=this.scene.time.delayedCall(this.idleTimeoutDuration,this.playIdleAnimation,[],this)}playIdleAnimation(){if(this.idleTween||this.isIdle)return;this.isIdle=!0;let e=0;for(let t=0;t<h.gridRows;t++){let i=this.tileGrid[t];for(let t=0;t<h.gridColumns;t++){let s=i[t];void 0!==s&&(this.scene.tweens.add({targets:s,scale:.6,ease:"sine.inout",duration:300,delay:50*e,repeat:2,yoyo:!0,repeatDelay:200,onComplete:()=>{this.isIdle=!1}}),e++,e%8==0&&(e=0))}}this.startIdleTimer()}getTilePos(e,t){let i={x:-1,y:-1};for(let s=0;s<e.length;s++)for(let h=0;h<e[s].length;h++)if(t===e[s][h]){i.x=h,i.y=s;break}return i}handleExplode(e,t){let i=this.getTilePos(this.tileGrid,e);if(void 0!==e&&!this.visited[i.y][i.x])return e.getIsCombine4()?void this.emit4(e,t):e.getIsCombine5()?void this.emit5(e,t):void this.emit3(e,t)}emit4(e,t){let i=this.getTilePos(this.tileGrid,e);if(void 0!==e&&!this.visited[i.y][i.x]){this.emit3(e,t),e.disableCombine4();for(let e=0;e<c.length;e++){let s=i.y+c[e].y,l=i.x+c[e].x;if(s<0||s>=h.gridRows||l<0||l>=h.gridColumns)continue;let r=this.tileGrid[s][l];void 0!==r&&this.handleExplode(r,t+50*e)}}}emit5(e,t){let i=this.getTilePos(this.tileGrid,e);if(-1!==i.x&&-1!==i.y&&!this.visited[i.y][i.x]){this.emit3(e,t),e.disableCombine5();for(let e=0;e<h.gridRows;e++){let s=this.tileGrid[e][i.x];void 0!==s&&this.handleExplode(s,t+50*Math.abs(e-i.y))}for(let e=0;e<h.gridColumns;e++){let s=this.tileGrid[i.y][e];void 0!==s&&this.handleExplode(s,t+50*Math.abs(e-i.x))}}}emit3(e,t){let i=this.getTilePos(this.tileGrid,e);void 0===e||this.visited[i.y][i.x]||(this.visited[i.y][i.x]=!0,this.totalTweens++,this.scene.add.tween({targets:e,scale:1,duration:t,onComplete:()=>{this.totalTweens--,d.getInstance(this.scene).addExp(e.getPoint()),e.explode3(),n.getInstance(this.scene).returnTile(e),this.tileGrid[i.y][i.x]=void 0,0===this.totalTweens&&this.resetTile()}}))}tileDown(e,t,i){if(this.canMove)if(this.firstSelectedTile){if(this.secondSelectedTile=t,this.firstSelectedTile===this.secondSelectedTile)return this.firstSelectedTile.getDeselected(),console.log("unpick"),this.firstSelectedTile=void 0,void(this.secondSelectedTile=void 0);let e=Math.abs(this.firstSelectedTile.x-this.secondSelectedTile.x)/h.tileWidth,i=Math.abs(this.firstSelectedTile.y-this.secondSelectedTile.y)/h.tileHeight;1===e&&0===i||0===e&&1===i?(this.canMove=!1,this.firstSelectedTile.getDeselected(),this.swapTiles()):(this.firstSelectedTile.getDeselected(),this.firstSelectedTile=this.secondSelectedTile,this.firstSelectedTile.getSelected(),this.secondSelectedTile=void 0)}else this.firstSelectedTile=t,this.firstSelectedTile.getSelected(),console.log("pick")}swapTiles(){if(this.firstSelectedTile&&this.secondSelectedTile){let e={x:this.firstSelectedTile.x-h.tileWidth/2,y:this.firstSelectedTile.y-h.tileHeight/2},t={x:this.secondSelectedTile.x-h.tileWidth/2,y:this.secondSelectedTile.y-h.tileHeight/2};this.tileGrid[e.y/h.tileHeight][e.x/h.tileWidth]=this.secondSelectedTile,this.tileGrid[t.y/h.tileHeight][t.x/h.tileWidth]=this.firstSelectedTile,this.scene.add.tween({targets:this.firstSelectedTile,x:this.secondSelectedTile.x,y:this.secondSelectedTile.y,ease:"Back.easeIn",duration:400,repeat:0,yoyo:!1}),this.scene.add.tween({targets:this.secondSelectedTile,x:this.firstSelectedTile.x,y:this.firstSelectedTile.y,ease:"Back.easeIn",duration:400,repeat:0,yoyo:!1,onComplete:()=>{this.checkMatches()}}),this.firstSelectedTile=this.tileGrid[e.y/h.tileHeight][e.x/h.tileWidth],this.secondSelectedTile=this.tileGrid[t.y/h.tileHeight][t.x/h.tileWidth]}}mergeMatch(e){let t=0,i=!1;for(let s=0;s<e.length;s++){const h=e[s];if(4===h.length){const s=h[0].x,l=h[0].y;let r=!1;for(let e=0;e<h.length;e++)(h[e].getIsCombine4()||h[e].getIsCombine5())&&(r=!0);for(let r=1;r<h.length;r++){const a=h[r],o=this.getTilePos(this.tileGrid,a);t++,i=!0,this.scene.add.tween({targets:a,x:s,y:l,ease:"Linear",duration:300,onComplete:()=>{n.getInstance(this.scene).returnTile(a),this.tileGrid[o.y][o.x]=void 0,t--,0===t&&this.removeTileGroup(e)}})}r?h[0].enableCombine5():h[0].enableCombine4()}else if(h.length>=5){const s=h[0].x,l=h[0].y;for(let r=1;r<h.length;r++){const a=h[r],o=this.getTilePos(this.tileGrid,a);t++,i=!0,this.scene.add.tween({targets:a,x:s,y:l,ease:"Linear",duration:300,onComplete:()=>{n.getInstance(this.scene).returnTile(a),this.tileGrid[o.y][o.x]=void 0,t--,0===t&&this.removeTileGroup(e)}})}h[0].enableCombine5()}}i||this.removeTileGroup(e)}checkMatches(){let e=this.getMatches(this.tileGrid);e.length>0?this.mergeMatch(e):(this.swapTiles(),this.tileUp(),this.scene.time.delayedCall(400,(()=>{this.canMove=!0})),d.getInstance(this.scene).reachGoal()&&(this.shapePath.setPath(Phaser.Math.RND.between(1,3)),this.getTileToShuffer(),this.shapePath.setPositions(this.tileArr),this.isNext=!0,a.getInstance(this.scene).startConfetti(),this.scene.time.delayedCall(5e3,(()=>{this.resetTileGrid()})))),this.clearHint(),this.resetHintTimer()}resetTile(){let e=0,t=!1;for(let i=this.tileGrid.length-1;i>0;i--)for(let s=this.tileGrid[i].length-1;s>=0;s--)if(void 0===this.tileGrid[i][s]){let l=!1;for(let r=i-1;r>=0;r--)if(void 0!==this.tileGrid[r][s]){const n=this.tileGrid[r][s];this.tileGrid[i][s]=n,this.tileGrid[r][s]=void 0,e++,t=!0,this.scene.add.tween({targets:n,y:h.tileHeight*i+h.tileHeight/2,ease:"Cubic.easeOut",duration:500,onComplete:()=>{e--,0===e&&(this.tileUp(),this.checkMatches())}}),l=!0;break}l&&(s=this.tileGrid[i].length)}for(let i=this.tileGrid.length-1;i>=0;i--)for(let s=0;s<this.tileGrid[i].length;s++)if(void 0===this.tileGrid[i][s]){const l=n.getInstance(this.scene).getTile(s,i);l.y=-(h.tileHeight*(this.tileGrid.length-i)+h.tileHeight/2),e++,t=!0,this.scene.add.tween({targets:l,y:h.tileHeight*i+h.tileHeight/2,ease:"Cubic.easeOut",duration:500,alpha:{start:0,to:1},onComplete:()=>{e--,0===e&&(this.tileUp(),this.checkMatches())}}),this.tileGrid[i][s]=l}t||(this.canMove=!0,this.tileUp(),this.checkMatches())}tileUp(){this.firstSelectedTile=void 0,this.secondSelectedTile=void 0}removeTileGroup(e){for(let e=0;e<h.gridRows;e++)for(let t=0;t<h.gridColumns;t++)this.visited[e][t]=!1;const t=e.filter((e=>3===e.length));for(let e=0;e<t.length;e++){const i=t[e];for(let e=0;e<i.length;e++){const t=i[e],s=this.getTilePos(this.tileGrid,t);-1!==s.x&&-1!==s.y&&this.handleExplode(t,0)}}0===this.totalTweens&&this.resetTile()}getMatches(e){let t=[],i=[];for(let e=0;e<h.gridRows;e++)for(let t=0;t<h.gridColumns;t++)this.visited[e][t]=!1;for(let i=0;i<e.length;i++){let s=e[i];for(let h=0;h<s.length;h++){if(!s[h]||this.visited[i][h])continue;let l=[];l.push(s[h]),this.visited[i][h]=!0;let r=[],n=[];for(let e=h+1;e<s.length&&s[e]&&s[h].texture.key===s[e].texture.key&&!this.visited[i][e];e++)r.push(s[e]),n.push({x:e,y:i}),this.visited[i][e]=!0;let a=[],o=[];for(let e=h-1;e>=0&&s[e]&&s[h].texture.key===s[e].texture.key&&!this.visited[i][e];e--)a.push(s[e]),o.push({x:e,y:i}),this.visited[i][e]=!0;let d=[],c=[];for(let t=i+1;t<e.length&&e[t][h]&&e[i][h].texture.key===e[t][h].texture.key&&!this.visited[t][h];t++)d.push(e[t][h]),c.push({x:h,y:t}),this.visited[t][h]=!0;let g=[],p=[];for(let t=i-1;t>=0&&e[t][h]&&e[i][h].texture.key===e[t][h].texture.key&&!this.visited[t][h];t--)g.push(e[t][h]),p.push({x:h,y:t}),this.visited[t][h]=!0;r.length+a.length>=2&&d.length+g.length>=2?(l.push(...r),l.push(...a),l.push(...d),l.push(...g),t.push(l)):(this.visited[i][h]=!1,n.forEach((e=>{this.visited[e.y][e.x]=!1})),o.forEach((e=>{this.visited[e.y][e.x]=!1})),c.forEach((e=>{this.visited[e.y][e.x]=!1})),p.forEach((e=>{this.visited[e.y][e.x]=!1})))}}for(let s=0;s<e.length;s++){let h=e[s];for(let e=0;e<h.length;e++){if(!h[e]||this.visited[s][e])continue;i=[],i.push(h[e]),this.visited[s][e]=!0;let l=[];for(let t=e+1;t<h.length&&h[t]&&h[e].texture.key===h[t].texture.key&&!this.visited[s][t];t++)l.push(h[t]),this.visited[s][t]=!0;if(l.length>=2)i.push(...l),t.push(i);else{this.visited[s][e]=!1;for(let e=0;e<l.length;e++){let t=this.getTilePos(this.tileGrid,l[e]);this.visited[t.y][t.x]=!1}}}}for(let s=0;s<e.length;s++){let h=e[s];for(let l=0;l<h.length;l++){if(!h[l]||this.visited[s][l])continue;i=[],i.push(h[l]),this.visited[s][l]=!0;let r=[];for(let t=s+1;t<e.length&&e[t][l]&&e[s][l].texture.key===e[t][l].texture.key&&!this.visited[t][l];t++)r.push(e[t][l]),this.visited[t][l]=!0;if(r.length>=2)i.push(...r),t.push(i);else{this.visited[s][l]=!1;for(let e=0;e<r.length;e++){let t=this.getTilePos(this.tileGrid,r[e]);this.visited[t.y][t.x]=!1}}}}return t}getPossibleMatches(){let e=[],t=this.copyTileGrid(this.tileGrid);for(let i=0;i<h.gridRows;i++)for(let s=0;s<h.gridColumns;s++)s<h.gridColumns-1&&(this.swapTiles1(t,s,i,s+1,i),this.checkMatch(t)&&e.push([{x1:s,y1:i,x2:s+1,y2:i}]),this.swapTiles1(t,s,i,s+1,i)),i<h.gridRows-1&&(this.swapTiles1(t,s,i,s,i+1),this.checkMatch(t)&&e.push([{x1:s,y1:i,x2:s,y2:i+1}]),this.swapTiles1(t,s,i,s,i+1));return e[Math.floor(Math.random()*e.length)]}copyTileGrid(e){return e.map((e=>e.slice()))}swapTiles1(e,t,i,s,h){let l=e[i][t];e[i][t]=e[h][s],e[h][s]=l}checkMatch(e){return this.getMatches(e).length>0}resetHintTimer(){this.hintTimer&&this.hintTimer.remove(!1),this.hintTimer=this.scene.time.addEvent({delay:5e3,callback:()=>this.showHint(),callbackScope:this,loop:!1})}showHint(){const e=this.getPossibleMatches();if(e){this.clearHint();const t={type:"edge",source:new Phaser.Geom.Rectangle(e[0].x1*h.tileWidth,e[0].y1*h.tileHeight,h.tileWidth,h.tileHeight),quantity:42},i={type:"edge",source:new Phaser.Geom.Rectangle(e[0].x2*h.tileWidth,e[0].y2*h.tileHeight,h.tileWidth,h.tileHeight),quantity:42};this.emitterFirstHint=this.scene.add.particles(0,0,"flare",{color:[16711680,16744192,16776960,65280,255,9055202],speed:20,lifespan:250,quantity:2,scale:{start:.2,end:0},advance:2e3,emitZone:t}),this.emitterSecondHint=this.scene.add.particles(0,0,"flare",{color:[16711680,16744192,16776960,65280,255,9055202],speed:20,lifespan:250,quantity:2,scale:{start:.2,end:0},advance:2e3,emitZone:i})}}clearHint(){this.emitterFirstHint&&this.emitterFirstHint.stop(),this.emitterSecondHint&&this.emitterSecondHint.stop()}}class p extends Phaser.Scene{constructor(){super({key:"GameScene"})}init(){this.add.image(0,0,"bg").setDepth(-2),this.tileGrid=new g(this)}update(e,t){this.tileGrid.update(e,t)}}class u extends Phaser.Scene{constructor(){super({key:"HUDScene"})}create(){this.progressBox=this.add.graphics(),this.progressBox.fillStyle(16729344,.8),this.progressBox.fillRect(600,100,320,40),this.progressBar=this.add.graphics(),this.progressValue=0,this.scoreText=this.add.text(600,70,"Score: 0",{fontFamily:"Verdana",fontSize:"20px",color:"#ffffff"}),this.targetText=this.add.text(600,45,"Target: 320",{fontFamily:"Verdana",fontSize:"20px",color:"#ffffff"}),this.emitter=this.add.particles(0,0,"flare",{speed:{min:-100,max:100},color:[8355711,7303023,9408399,6250335,7368816],scale:{start:.1,end:0},blendMode:"ADD",lifespan:600,emitZone:{source:new Phaser.Geom.Rectangle(0,-18,1,40),type:"edge",quantity:20}}),this.updateProgressBar(this.progressValue)}updateProgressBar(e){this.add.tween({targets:this,progressValue:e,ease:"Linear",duration:200,onUpdate:()=>{this.progressBar.clear(),this.progressBar.fillStyle(16753920,1),this.progressBar.fillRect(600,100,this.progressValue,40);const e=600+this.progressValue;this.emitter.setPosition(e,120),this.scoreText.setText(`Score: ${d.getInstance(this).getExp()}`),this.targetText.setText("Target: 320")}})}setProgress(e){this.updateProgressBar(e)}update(e,t){d.getInstance(this).update(e,t),this.setProgress(d.getInstance(this).getExp())}}const m={title:"Candy crush",url:"https://github.com/digitsensitive/phaser3-typescript",version:"0.0.1",width:1e3,height:window.innerHeight,type:Phaser.AUTO,parent:"game",scene:[s,p,u],backgroundColor:"#de3412",render:{pixelArt:!1,antialias:!0},scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},physics:{default:"arcade",arcade:{debug:!0,gravity:{x:0,y:0}}}};class f extends Phaser.Game{constructor(e){super(e)}}window.addEventListener("load",(()=>{new f(m)}))}},i={};function s(e){var h=i[e];if(void 0!==h)return h.exports;var l=i[e]={exports:{}};return t[e].call(l.exports,l,l.exports,s),l.exports}s.m=t,e=[],s.O=(t,i,h,l)=>{if(!i){var r=1/0;for(d=0;d<e.length;d++){for(var[i,h,l]=e[d],n=!0,a=0;a<i.length;a++)(!1&l||r>=l)&&Object.keys(s.O).every((e=>s.O[e](i[a])))?i.splice(a--,1):(n=!1,l<r&&(r=l));if(n){e.splice(d--,1);var o=h();void 0!==o&&(t=o)}}return t}l=l||0;for(var d=e.length;d>0&&e[d-1][2]>l;d--)e[d]=e[d-1];e[d]=[i,h,l]},s.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={792:0};s.O.j=t=>0===e[t];var t=(t,i)=>{var h,l,[r,n,a]=i,o=0;if(r.some((t=>0!==e[t]))){for(h in n)s.o(n,h)&&(s.m[h]=n[h]);if(a)var d=a(s)}for(t&&t(i);o<r.length;o++)l=r[o],s.o(e,l)&&e[l]&&e[l][0](),e[l]=0;return s.O(d)},i=self.webpackChunktype_project_template=self.webpackChunktype_project_template||[];i.forEach(t.bind(null,0)),i.push=t.bind(null,i.push.bind(i))})();var h=s.O(void 0,[96],(()=>s(885)));h=s.O(h)})();