/* Square-pixel Earth texture with orbiting service satellites. */
(() => {
  if (customElements.get("service-globe")) return;
  const rad = Math.PI / 180, tau = Math.PI * 2;
  const earthRadius = .72;
  const services = [
    ["AI customer support","ai-development","#93e9f9","dish"],
    ["Web development","web-development","#a3bcff","relay"],
    ["3D product animation","animation","#d1acff","camera"],
    ["Branding","branding","#ffd58a","gold"],
    ["UX/UI design","ux-ui-design","#b4ffdc","sensor"],
    ["Mobile app development","mobile-app-development","#c1baff","antenna"]
  ];
  const telemetry = [
    ["SYS.01 / AI SUPPORT", "AI customer support", "Routine questions answered quickly, with complex cases handed to your team.", "Approved answers", "Human handoff"],
    ["SYS.02 / WEB", "Web development", "Sites and web apps designed around the way your business works.", "Responsive build", "Connected workflows"],
    ["SYS.03 / 3D", "3D product animation", "Show the materials, movement, and details that still photos miss.", "Product detail", "Motion & materials"],
    ["SYS.04 / BRAND", "Branding", "A consistent identity across the places customers meet your business.", "Visual identity", "Brand systems"],
    ["SYS.05 / UX", "UX/UI design", "Clearer paths through the tasks your customers need to complete.", "User flows", "Interface design"],
    ["SYS.06 / MOBILE", "Mobile app development", "Useful mobile experiences for buying, booking, and returning.", "iOS & Android", "Customer journeys"]
  ];
  const clamp = (v,a,b) => Math.min(b,Math.max(a,v));
  const axis = (x,y,z,a) => [x*Math.sin(a/2),y*Math.sin(a/2),z*Math.sin(a/2),Math.cos(a/2)];
  function multiply([x,y,z,w],[a,b,c,d]) {
    return [w*a+x*d+y*c-z*b,w*b-x*c+y*d+z*a,w*c+x*b-y*a+z*d,w*d-x*a-y*b-z*c];
  }
  function matrix([x,y,z,w]) {
    return [1-2*(y*y+z*z),2*(x*y+w*z),2*(x*z-w*y),
      2*(x*y-w*z),1-2*(x*x+z*z),2*(y*z+w*x),
      2*(x*z+w*y),2*(y*z-w*x),1-2*(x*x+y*y)];
  }
  function transform(m,[x,y,z]) {
    return [m[0]*x+m[3]*y+m[6]*z,m[1]*x+m[4]*y+m[7]*z,m[2]*x+m[5]*y+m[8]*z];
  }
  function orientation([lon,lat]) { return multiply(axis(1,0,0,lat*rad),axis(0,1,0,-lon*rad)); }
  function orbit(track,t) {
    const incl=[24,62,-42][track]*rad, node=[35,117,-20][track]*rad;
    const x=Math.cos(t), y=Math.sin(t)*Math.sin(incl), z=Math.sin(t)*Math.cos(incl), r=1.14+track*.052;
    return [r*(x*Math.cos(node)+z*Math.sin(node)),r*y,r*(-x*Math.sin(node)+z*Math.cos(node))];
  }
  function spacecraft(color,kind) {
    const instruments={
      dish:'<path d="M-5 -4 Q-7 -11 1 -8 Q-1 -4 -5 -4Z" fill="#e3f5ff"/><path d="M-3 -7L-5 -10"/>',
      relay:'<path d="M-4 -4H5V-6H-4Z" fill="#cfdef6"/>',
      camera:'<circle cx="4" cy="-3" r="3.4" fill="#698292"/><circle cx="4" cy="-3" r="2" fill="#182844"/>',
      gold:'<path d="M-5 -4L1 -7L6 -3V3L1 5L-5 2Z" fill="#e6bb70"/>',
      sensor:'<g fill="#bbfcff"><circle cx="-2" cy="-4" r="2"/><circle cx="3" cy="-4" r="2"/></g>',
      antenna:'<path d="M0 -3L0 -11M-3 -9H3" stroke="#d7eeff"/>'
    };
    return '<svg viewBox="-16 -12 32 24" aria-hidden="true"><g stroke="#8fb2d4" stroke-width=".8"><path d="M-13 0H13"/><path fill="#386695" d="M-16 -4H-6V4H-16ZM6 -4H16V4H6Z"/><path d="M-11 -4V4M11 -4V4M-16 0H-6M6 0H16"/><path fill="'+color+'" d="M-4 -4L2 -5L5 -2V4L-2 5L-4 2Z"/>'+instruments[kind]+'</g></svg>';
  }
  function renderer(canvas,mapImage,lightsImage) {
    const gl=canvas.getContext("webgl",{alpha:true,antialias:false,depth:false,powerPreference:"low-power"});
    if (!gl) return;
    function shader(type,source) {
      const s=gl.createShader(type); gl.shaderSource(s,source); gl.compileShader(s);
      if (!gl.getShaderParameter(s,gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(s));
      return s;
    }
    const program=gl.createProgram();
    const shaders=[
      shader(gl.VERTEX_SHADER,'attribute vec2 p; varying vec2 uv; void main(){uv=p;gl_Position=vec4(p,0.,1.);}'),
      shader(gl.FRAGMENT_SHADER,`#ifdef GL_FRAGMENT_PRECISION_HIGH
        precision highp float;
        #else
        precision mediump float;
        #endif
        varying vec2 uv; uniform sampler2D land; uniform sampler2D cityLights; uniform mat3 camera; uniform float radius;
        void main(){
          vec2 p=uv/radius; float rr=dot(p,p);
          if(rr>1.) discard;
          vec3 n=vec3(p,sqrt(max(0.,1.-rr))), world=n*camera;
          vec2 st=vec2(fract(.5+atan(world.x,world.z)/6.2831853),.5-asin(clamp(world.y,-1.,1.))/3.14159265);
          vec3 color=texture2D(land,st).rgb;
          float sun=dot(n,vec3(-.75,.35,.28));
          float daylight=.24+.75*max(0.,sun);
          float night=1.-smoothstep(-.28,.12,sun);
          vec3 measured=texture2D(cityLights,st).rgb;
          vec3 rim=mix(vec3(.16,.52,.66),vec3(.45,.17,.74),clamp(.5+p.x*.6,0.,1.));
          gl_FragColor=vec4(color*daylight+measured*night*.7+rim*pow(1.-n.z,3.),1.);
        }`)
    ];
    shaders.forEach(s=>gl.attachShader(program,s)); gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS)) throw Error(gl.getProgramInfoLog(program));
    shaders.forEach(s=>gl.deleteShader(s)); gl.useProgram(program);
    const buffer=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
    const p=gl.getAttribLocation(program,"p"); gl.enableVertexAttribArray(p); gl.vertexAttribPointer(p,2,gl.FLOAT,false,0,0);
    const textures=[mapImage,lightsImage].map((image,unit)=>{
      const texture=gl.createTexture(); gl.activeTexture(gl.TEXTURE0+unit); gl.bindTexture(gl.TEXTURE_2D,texture);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,image);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
      return texture;
    });
    gl.uniform1i(gl.getUniformLocation(program,"land"),0);
    gl.uniform1i(gl.getUniformLocation(program,"cityLights"),1);
    const camera=gl.getUniformLocation(program,"camera"), radius=gl.getUniformLocation(program,"radius");
    return {
      draw(m,r){gl.viewport(0,0,canvas.width,canvas.height); gl.clear(gl.COLOR_BUFFER_BIT); gl.uniformMatrix3fv(camera,false,m); gl.uniform1f(radius,r); gl.drawArrays(gl.TRIANGLES,0,3);},
      destroy(){textures.forEach(texture=>gl.deleteTexture(texture)); gl.deleteBuffer(buffer); gl.deleteProgram(program);}
    };
  }
  class ServiceGlobe extends HTMLElement {
    connectedCallback() {
      if(this.cleanup) return;
      const host=this;
      const controller=new AbortController(), signal=controller.signal;
      const on=(el,type,fn,opts={})=>el.addEventListener(type,fn,{...opts,signal});
      const stage=this.querySelector(".earth-stage"), canvas=this.querySelector("canvas");
      const copy=this.closest(".hero-split")?.querySelector(".hero-copy");
      const hud=this.querySelector(".earth-hud"), card=hud.querySelector(".earth-hud__card");
      const leader=hud.querySelector(".earth-hud__leader");
      const reticles=hud.querySelectorAll(".earth-hud__reticle, .earth-hud__reticle-core");
      const reduced=matchMedia("(prefers-reduced-motion: reduce)");
      let q=orientation([82,22]), clock=0, speed=0, spin=[0,1,0];
      let size=0, scene=null, visible=false, frame=0, last=0, dirty=true, pinned=-1, drag=null;
      let focusedAngle=0, cardWidth=0, cardHeight=0;
      const phases=[.2,1.5,2.9,3.5,4.5,5.7];
      const rate=i=>.069-(i%3)*.009;
      const paths=Array.from({length:3},(_,i)=>{
        const path=document.createElementNS("http://www.w3.org/2000/svg","path");
        path.setAttribute("stroke",["#64cadd","#9b9be1","#b994eb"][i]);
        path.setAttribute("opacity",".36"); this.querySelector(".earth-orbits").append(path); return path;
      });
      const buttons=services.map(([name,slug,color,kind],i)=>{
        const b=document.createElement("button"); b.type="button"; b.className="satellite"; b.hidden=true;
        b.setAttribute("aria-label",name); b.setAttribute("data-name",name); b.setAttribute("aria-pressed","false"); b.innerHTML=spacecraft(color,kind);
        this.querySelector(".earth-craft").append(b);
        on(b,"click",()=>select(pinned===i?-1:i));
        return b;
      });
      function select(i){
        if(pinned>=0)phases[pinned]=focusedAngle-clock*rate(pinned);
        pinned=i;
        buttons.forEach((b,j)=>b.setAttribute("aria-pressed",String(j===i)));
        if(i<0){hud.hidden=true;delete host.dataset.selected;host.style.paddingBottom="";wake();return;}
        focusedAngle=clock*rate(i)+phases[i];
        const [code,title,summary,specA,specB]=telemetry[i];
        hud.querySelector(".earth-hud__code").textContent=code;
        hud.querySelector(".earth-hud__title").textContent=title;
        hud.querySelector(".earth-hud__summary").textContent=summary;
        hud.querySelector(".earth-hud__specs").replaceChildren(...[specA,specB].map(value=>{const span=document.createElement("span");span.textContent=value;return span;}));
        const link=hud.querySelector(".earth-hud__link");
        link.href="/services/"+services[i][1];
        link.setAttribute("aria-label","View "+title+" service");
        card.setAttribute("aria-label",title+" details");
        hud.hidden=false;host.dataset.selected="";
        cardWidth=card.offsetWidth;cardHeight=card.offsetHeight;
        wake();
      }
      on(hud.querySelector(".earth-hud__close"),"click",()=>{const old=pinned;select(-1);if(old>=0)buttons[old].focus();});
      function positionHud(x,y){
        if(pinned<0)return;
        const sx=size/2+x*earthRadius*size/2, sy=size/2-y*earthRadius*size/2;
        const compact=size<390;
        let left,top,endX,endY,path;
        if(compact){
          left=Math.round((size-cardWidth)/2);top=size+15;
          endX=size/2;endY=top;
          path=`M${sx.toFixed(1)} ${sy.toFixed(1)} L${sx.toFixed(1)} ${(size+4).toFixed(1)} L${endX.toFixed(1)} ${(size+4).toFixed(1)} L${endX.toFixed(1)} ${endY.toFixed(1)}`;
          const padding=cardHeight+22+"px";
          if(host.style.paddingBottom!==padding)host.style.paddingBottom=padding;
        }else{
          const right=sx<size/2;
          left=right?size-cardWidth-8:8;
          top=clamp(sy-cardHeight/2,8,size-cardHeight-8);
          endX=right?left:left+cardWidth;
          endY=clamp(sy,top+15,top+cardHeight-15);
          const startX=sx+(right?18:-18),elbow=startX+(right?16:-16);
          path=`M${startX.toFixed(1)} ${sy.toFixed(1)} L${elbow.toFixed(1)} ${sy.toFixed(1)} L${elbow.toFixed(1)} ${endY.toFixed(1)} L${endX.toFixed(1)} ${endY.toFixed(1)}`;
          if(host.style.paddingBottom)host.style.paddingBottom="";
        }
        card.style.left=Math.round(left)+"px";card.style.top=Math.round(top)+"px";
        const svg=hud.querySelector(".earth-hud__line");
        svg.setAttribute("viewBox",`0 0 ${size} ${size}`);
        leader.setAttribute("d",path);
        reticles.forEach(circle=>{circle.setAttribute("cx",sx.toFixed(1));circle.setAttribute("cy",sy.toFixed(1));});
      }
      const tracks=paths.map((_,i)=>Array.from({length:161},(_,j)=>orbit(i,tau*j/160)));
      function fit(){
        if(copy)stage.parentElement.style.setProperty("--earth-fit",Math.round(copy.getBoundingClientRect().height / earthRadius)+"px");
        size=stage.clientWidth;
        const pixels=Math.min(768,Math.round(size*Math.min(1.5,devicePixelRatio)));
        if(canvas.width!==pixels){canvas.width=canvas.height=pixels;}
        if(pinned>=0){cardWidth=card.offsetWidth;cardHeight=card.offsetHeight;}
        dirty=true; wake();
      }
      function wake(){if(!frame && scene && visible && !document.hidden)frame=requestAnimationFrame(tick);}
      function tick(now){
        frame=0; if(!scene || !visible || document.hidden)return;
        if(last && now-last<32){wake();return;}
        const dt=Math.min(.05,(now-last)/1000); last=now;
        const moving=!drag && !reduced.matches;
        if(moving){
          clock+=dt;
          if(speed>.012){
            q=multiply(axis(...spin,speed*dt),q); speed*=Math.exp(-4.1*dt); dirty=true;
          }
        }
        const m=matrix(q), r=earthRadius;
        if(dirty || moving){
          const surfaceMatrix=matrix(multiply(q,axis(0,1,0,clock*.055)));
          scene.draw(surfaceMatrix,r);
        }
        if(dirty){
          tracks.forEach((points,i)=>{
            let pen=false,d="";
            for(const pt of points){
              const [x,y,z]=transform(m,pt);
              if(z<0 && x*x+y*y<1){pen=false;continue;}
              d+=(pen?"L":"M")+(x*r).toFixed(4)+" "+(-y*r).toFixed(4); pen=true;
            }
            paths[i].setAttribute("d",d);
          }); dirty=false;
        }
        buttons.forEach((b,i)=>{
          const track=i%3, angle=pinned===i?focusedAngle:clock*rate(i)+phases[i];
          const [x,y,z]=transform(m,orbit(track,angle));
          b.hidden=z<0 && x*x+y*y<1;
          b.style.transform="translate(-50%, -50%) translate("+(x*r*size/2).toFixed(2)+"px,"+(-y*r*size/2).toFixed(2)+"px)";
          b.firstChild.style.transform="rotate("+([22,-32,45][track]+x*17)+"deg)";
          b.style.zIndex=String(Math.round((z+2)*10));
          if(pinned===i)positionHud(x,y);
        });
        if(moving)wake();
      }
      function surface(e){
        const rect=stage.getBoundingClientRect(), r=size*earthRadius/2;
        const x=(e.clientX-rect.left-size/2)/r,y=(size/2-e.clientY+rect.top)/r;
        const z=Math.sqrt(Math.max(0,1-x*x-y*y)), l=Math.hypot(x,y,z);
        return [x/l,y/l,z/l];
      }
      const point=e=>({v:surface(e),t:e.timeStamp,id:e.pointerId});
      on(stage,"pointerdown",e=>{
        if(!scene || drag || !e.isPrimary || e.target.closest("button, .earth-hud__card") || e.button!==0)return;
        if(pinned>=0)select(-1);
        speed=0; drag=point(e); this.dataset.grabbing=""; stage.setPointerCapture(e.pointerId);
      });
      on(stage,"pointermove",e=>{
        if(!drag || drag.id!==e.pointerId)return;
        const prev=drag,next=point(e);
        drag=next;
        const [a,b,c]=prev.v,[x,y,z]=next.v;
        const cross=[b*z-c*y,c*x-a*z,a*y-b*x], n=Math.hypot(...cross); if(n<.0001)return;
        const angle=Math.atan2(n,a*x+b*y+c*z); spin=cross.map(v=>v/n); q=multiply(axis(...spin,angle),q);
        speed=clamp(angle*1000/Math.max(12,next.t-prev.t),0,4); dirty=true;wake();
      });
      const release=e=>{
        if(!drag || drag.id!==e.pointerId)return;
        if(e.type==="pointercancel" || e.timeStamp-drag.t>90)speed=0;
        drag=null; delete this.dataset.grabbing; last=0; wake();
      };
      on(stage,"pointerup",release); on(stage,"pointercancel",release); on(stage,"lostpointercapture",release);
      on(this,"keydown",e=>{
        if(e.key==="Escape" && pinned>=0){const old=pinned;select(-1);buttons[old].focus();}
      });
      on(reduced,"change",()=>{dirty=true;wake();});
      on(document,"visibilitychange",()=>{last=0;wake();});
      const ro=new ResizeObserver(fit);ro.observe(stage);if(copy)ro.observe(copy);
      const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;last=0;wake();});io.observe(stage);
      const img=new Image(), lights=new Image();
      const setup=()=>{
        if(signal.aborted || !img.complete || !lights.complete || !img.naturalWidth || !lights.naturalWidth)return;
        try{scene=renderer(canvas,img,lights);}catch{scene=null;}
        if(scene){fit();scene.draw(matrix(q),earthRadius);this.dataset.ready="";wake();}
      };
      on(canvas,"webglcontextlost",e=>{
        e.preventDefault(); scene=null; drag=null; delete this.dataset.ready;delete this.dataset.grabbing;
        select(-1);buttons.forEach(b=>{b.hidden=true;b.setAttribute("aria-pressed","false");});
        paths.forEach(p=>p.removeAttribute("d"));
      });
      on(canvas,"webglcontextrestored",setup);
      on(img,"load",setup);on(lights,"load",setup);
      img.src="/images/orbital-map.png";lights.src="/images/orbital-lights.png";
      this.cleanup=()=>{controller.abort();cancelAnimationFrame(frame);ro.disconnect();io.disconnect();scene?.destroy();
        buttons.forEach(b=>b.remove());paths.forEach(p=>p.remove());delete this.dataset.ready; delete this.dataset.grabbing;delete this.dataset.selected;this.style.paddingBottom="";};
    }
    disconnectedCallback(){this.cleanup?.();this.cleanup=null;}
  }
  customElements.define("service-globe",ServiceGlobe);
})();
