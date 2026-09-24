import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export interface Visualizador {
  aproximar(): void;
  afastar(): void;
  voltarAoInicio(): void;
  destruir(): void;
}

interface Opcoes {
  url: string;
  girarSozinho: boolean;
  aoCarregar(): void;
  aoFalhar(erro: unknown): void;
  /** Ângulo horizontal (graus, 0–360) e distância da câmera, a cada mudança. */
  aoMover(azimute: number, distancia: number): void;
}

/** Vista inicial: um pouco à direita da fachada, levemente de cima. */
const AZIMUTE_INICIAL = 0.6;
const ELEVACAO_INICIAL = 0.32;
const FOV = 35;
/** Cada clique em aproximar/afastar muda a distância nesta proporção. */
const PASSO_ZOOM = 0.8;
/**
 * Proporção (largura/altura) abaixo da qual a largura do prédio passa a limitar o enquadramento:
 * em telas mais estreitas (celular) a câmera se afasta na mesma proporção.
 */
const PROPORCAO_LIMITE = 1.15;

/** Sombra suave no chão, desenhada num canvas (dispensa luz com sombra). */
function sombraNoChao(raio: number): THREE.Mesh {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, "rgba(20,20,19,0.28)");
  g.addColorStop(0.6, "rgba(20,20,19,0.10)");
  g.addColorStop(1, "rgba(20,20,19,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const plano = new THREE.Mesh(
    new THREE.PlaneGeometry(raio * 2.4, raio * 2.4),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true, depthWrite: false }),
  );
  plano.rotation.x = -Math.PI / 2;
  plano.position.y = 0.01;
  return plano;
}

/** Monta a cena 3D dentro de `palco` e carrega o modelo. */
export function criarVisualizador(palco: HTMLElement, opcoes: Opcoes): Visualizador {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  palco.appendChild(renderer.domElement);

  const cena = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const ambiente = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  cena.environment = ambiente;
  cena.add(new THREE.HemisphereLight(0xffffff, 0xd9cbb9, 1));
  const sol = new THREE.DirectionalLight(0xffffff, 2);
  sol.position.set(5, 10, 7);
  cena.add(sol);

  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 1000);
  const alvo = new THREE.Vector3();
  let distanciaInicial = 40;

  // A roda do mouse rola a página em vez de dar zoom: o listener de captura roda
  // antes do OrbitControls e o impede de ver o evento (sem preventDefault).
  const bloquearRoda = (e: WheelEvent) => e.stopImmediatePropagation();
  renderer.domElement.addEventListener("wheel", bloquearRoda, { capture: true });

  const controles = new OrbitControls(camera, renderer.domElement);
  controles.enableDamping = true;
  controles.enablePan = false;
  controles.minPolarAngle = 0.12 * Math.PI;
  controles.maxPolarAngle = 0.49 * Math.PI;
  controles.autoRotate = opcoes.girarSozinho;
  controles.autoRotateSpeed = 0.6;
  // Na tela de toque, arrastar na vertical continua rolando a página.
  renderer.domElement.style.touchAction = "pan-y";
  controles.addEventListener("start", () => (controles.autoRotate = false));

  let destruido = false;
  let visivel = true;
  let quadro = 0;

  function informar() {
    const graus = (THREE.MathUtils.radToDeg(controles.getAzimuthalAngle()) + 360) % 360;
    opcoes.aoMover(graus, camera.position.distanceTo(controles.target));
  }
  controles.addEventListener("change", informar);

  function redimensionar() {
    const { width, height } = palco.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  const observadorTamanho = new ResizeObserver(redimensionar);
  observadorTamanho.observe(palco);
  redimensionar();

  // Só desenha enquanto a seção está na tela.
  const observadorTela = new IntersectionObserver(([e]) => {
    visivel = e.isIntersecting;
    if (visivel && !quadro) laco();
  });
  observadorTela.observe(palco);

  function laco() {
    if (destruido || !visivel) {
      quadro = 0;
      return;
    }
    controles.update();
    renderer.render(cena, camera);
    quadro = requestAnimationFrame(laco);
  }

  function posicionar(distancia: number) {
    const horizontal = distancia * Math.cos(ELEVACAO_INICIAL);
    camera.position.set(
      alvo.x + Math.sin(AZIMUTE_INICIAL) * horizontal,
      alvo.y + distancia * Math.sin(ELEVACAO_INICIAL),
      alvo.z + Math.cos(AZIMUTE_INICIAL) * horizontal,
    );
    controles.target.copy(alvo);
    controles.update();
    informar();
  }

  function mudarDistancia(fator: number) {
    const atual = camera.position.distanceTo(controles.target);
    const nova = THREE.MathUtils.clamp(atual * fator, controles.minDistance, controles.maxDistance);
    const direcao = camera.position.clone().sub(controles.target).setLength(nova);
    camera.position.copy(controles.target).add(direcao);
    controles.update();
    informar();
  }

  const carregador = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  carregador.load(
    opcoes.url,
    (gltf) => {
      if (destruido) return;
      const modelo = gltf.scene;
      // Centraliza no chão: base em y=0, meio do prédio na origem.
      const caixa = new THREE.Box3().setFromObject(modelo);
      const centro = caixa.getCenter(new THREE.Vector3());
      modelo.position.sub(new THREE.Vector3(centro.x, caixa.min.y, centro.z));
      cena.add(modelo);

      const tamanho = caixa.getSize(new THREE.Vector3());
      const raio = tamanho.length() / 2;
      cena.add(sombraNoChao(raio));
      alvo.set(0, tamanho.y * 0.42, 0);
      // A esfera que envolve o prédio sobra bastante nos cantos: 0.78 enquadra a fachada sem cortar.
      distanciaInicial =
        (raio / Math.sin(THREE.MathUtils.degToRad(FOV / 2))) * 0.78 * Math.max(1, PROPORCAO_LIMITE / camera.aspect);
      controles.minDistance = distanciaInicial * 0.45;
      controles.maxDistance = distanciaInicial * 1.6;
      posicionar(distanciaInicial);
      laco();
      opcoes.aoCarregar();
    },
    undefined,
    (erro) => {
      if (!destruido) opcoes.aoFalhar(erro);
    },
  );

  return {
    aproximar: () => mudarDistancia(PASSO_ZOOM),
    afastar: () => mudarDistancia(1 / PASSO_ZOOM),
    voltarAoInicio: () => {
      controles.autoRotate = false;
      posicionar(distanciaInicial);
    },
    destruir() {
      destruido = true;
      cancelAnimationFrame(quadro);
      observadorTamanho.disconnect();
      observadorTela.disconnect();
      renderer.domElement.removeEventListener("wheel", bloquearRoda, { capture: true });
      controles.dispose();
      cena.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const materiais = Array.isArray(obj.material) ? obj.material : [obj.material];
          materiais.forEach((m) => {
            (m as THREE.MeshBasicMaterial).map?.dispose();
            m.dispose();
          });
        }
      });
      ambiente.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
