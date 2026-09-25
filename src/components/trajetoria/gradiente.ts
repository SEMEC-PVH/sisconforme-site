/**
 * Gradiente vivo (WebGL) que aparece quando os dois cartões se fundem:
 * argila (Fisco) de um lado, azul (contribuinte) do outro, com a fronteira ondulando e grão de filme.
 */
export interface Gradiente {
  /** `t` em segundos; `mistura` de 0 (fronteira reta e dura) a 1 (fronteira viva e suave). */
  desenhar(t: number, mistura: number): void;
  redimensionar(): void;
  destruir(): void;
}

const VERTICE = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const FRAGMENTO = `
precision mediump float;
uniform vec2 r; uniform float t; uniform float m;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.02;a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/r;
  vec2 q=vec2(uv.x*r.x/r.y,uv.y);
  float f=fbm(q*1.6+vec2(t*.04,-t*.03));
  float g=fbm(q*2.4-vec2(t*.02,t*.05)+f);
  float borda=.5+.16*sin(uv.y*3.1+t*.35)*m+(g-.5)*.5*m;
  float w=mix(.03,.2,m);
  float k=smoothstep(borda-w,borda+w,uv.x);
  vec3 argila=vec3(.851,.467,.341), argilaFunda=vec3(.757,.373,.235);
  vec3 azul=vec3(.12,.33,.62), agua=vec3(.50,.70,.92);
  vec3 a=mix(argila,argilaFunda,clamp((1.-uv.y)*.7+(f-.5),0.,1.));
  vec3 b=mix(azul,agua,clamp(g*1.3-.25+uv.y*.2,0.,1.));
  vec3 cor=mix(a,b,k);
  cor+=vec3(.98,.96,.92)*.22*(1.-abs(k-.5)*2.)*m;
  cor+=(h(gl_FragCoord.xy+fract(t*7.)*97.)-.5)*.14;
  gl_FragColor=vec4(cor,1.);
}`;

/** Devolve `null` quando o navegador não tem WebGL (o CSS mostra um gradiente fixo no lugar). */
export function criarGradiente(canvas: HTMLCanvasElement): Gradiente | null {
  const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
  if (!gl) return null;

  const compilar = (tipo: number, fonte: string) => {
    const s = gl.createShader(tipo);
    if (!s) throw new Error("gradiente: shader não criado");
    gl.shaderSource(s, fonte);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(`gradiente: ${gl.getShaderInfoLog(s)}`);
    return s;
  };

  const prog = gl.createProgram();
  if (!prog) return null;
  const vs = compilar(gl.VERTEX_SHADER, VERTICE);
  const fs = compilar(gl.FRAGMENT_SHADER, FRAGMENTO);
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uR = gl.getUniformLocation(prog, "r");
  const uT = gl.getUniformLocation(prog, "t");
  const uM = gl.getUniformLocation(prog, "m");

  const redimensionar = () => {
    // resolução reduzida: o grão esconde a diferença e economiza GPU
    const escala = Math.min(window.devicePixelRatio || 1, 1.5) * 0.6;
    canvas.width = Math.max(1, Math.round(canvas.clientWidth * escala));
    canvas.height = Math.max(1, Math.round(canvas.clientHeight * escala));
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  redimensionar();

  return {
    desenhar(t, mistura) {
      gl.uniform2f(uR, canvas.width, canvas.height);
      gl.uniform1f(uT, t);
      gl.uniform1f(uM, mistura);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    redimensionar,
    destruir() {
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    },
  };
}
