// src/pages/GamePage.jsx
import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import usePageMusic from '../hooks/usePageMusic';

export default function GamePage() {
  const containerRef = useRef(null);
  const gameRef = useRef(null);
  const [panel, setPanel] = useState(null);

  const mobileControls = useRef({
    left: false,
    right: false,
    up: false,
    down: false,
  });

  usePageMusic('gamepage.mp3')

  useEffect(() => {
    if (gameRef.current || !containerRef.current) return;

    const BASE_W = 1920;
    const BASE_H = 1080;
    const DEBUG = false;

    // taille de grille pour le placement (en "px natifs" du SVG)
    const PLACE_GRID = 20;

    // Coordonnées natives dans l’espace du SVG (tu peux les remplacer par l'export)
const ZONES = [
  {
    id: "zone-1",
    x: 36, y: 108, w: 20, h: 20,
    title: "🐙 Quelques propositions",
    content: "Salut !\n\nJ'ai trouvé ça vraiment sympa de te revoir.\n\nBon... je ne suis pas très fort en design ni en scénographie. Par contre, j'aime bien bidouiller des trucs.\n\nPromène-toi dedans, tu tomberas sur quelques propositions :)"
  },

  {
    id: "zone-2",
    x: 8, y: 60, w: 12, h: 16,
    title: "🧗 Bouger un peu",
    content: "Escalade, natation, course ou vélo."
  },

  {
    id: "zone-3",
    x: 108, y: 160, w: 20, h: 24,
    title: "🎭 Théâtre",
    content: "Aller voir une pièce au Théâtre Comédie Odéon.\n\n🎟️ La Prière du Hamster — Vendredi à 20h."
  },

  {
    id: "zone-4",
    x: 148, y: 96, w: 16, h: 20,
    title: "🗺️ Comment jouer",
    content: "Il suffit de se promener sur la carte et d'ouvrir les différents bâtiments.\n\nChaque lieu cache une proposition.\n\nÀ la fin, tu pourras choisir... ou en inventer une meilleure."
  
  },

  {
    id: "zone-5",
    x: 216, y: 112, w: 20, h: 20,
    title: "🧗 Bouger un peu",
    content: "Escalade, natation, course ou vélo."
  },



  {
    id: "zone-7",
    x: 328, y: 116, w: 20, h: 8,
    title: "🍸 Moscow Mule",
    content: "Mission : trouver le meilleur Moscow Mule du monde.\n\nAvec plein de glaçons 🧊. Toujours parce qu'il fait TROP CHAUUUUD !! ☀️"
  },

  {
    id: "zone-8",
    x: 304, y: 204, w: 16, h: 12,
    title: "🍦 Glace",
    content: "… pas besoin de préciser. 🌞"
  },

  {
    id: "zone-9",
    x: 380, y: 65, w: 16, h: 16,
    title: "✨ Ta proposition",
    content: "Ou alors... on oublie complètement mes idées."
  },
];




    class MainScene extends Phaser.Scene {
      preload() {
        const mapPath = `${import.meta.env.BASE_URL}images/home7.svg`;
        const playerPath = `${import.meta.env.BASE_URL}images/player.png`;
        this.load.image("map", mapPath);
        this.load.spritesheet("player", playerPath, { frameWidth: 32, frameHeight: 32 });
      }

      create() {
        this.cameras.main.setBackgroundColor("#000000ff");

        // Charger la map et calculer scale + offset (ratio conservé)
        const map = this.add.image(0, 0, "map").setOrigin(0, 0);
        const imgW = map.width;
        const imgH = map.height;
        const scale = Math.min(BASE_W / imgW, BASE_H / imgH);
        const offsetX = (BASE_W - imgW * scale) / 2;
        const offsetY = (BASE_H - imgH * scale) / 2;
        map.setScale(scale).setPosition(offsetX, offsetY).setDepth(0);

        // garder ces valeurs pour les conversions (outil de placement)
        this.viewScale = scale;
        this.viewOffsetX = offsetX;
        this.viewOffsetY = offsetY;

        // Joueur : coordonnées natives -> coordonnées affichées
        const startX = offsetX + 10 * scale;
        const startY = offsetY + 150 * scale;



        this.player = this.physics.add.sprite(startX, startY, "player", 1)
          .setOrigin(0.5)
          .setScale(0.5 * scale)
          .setDepth(10);
        this.player.body.setCollideWorldBounds(true);

        // Ajuster la hitbox physique du joueur à son scale d'affichage
        const bodyW = 32 * (0.5 * scale);
        const bodyH = 32 * (0.5 * scale);
        this.player.body.setSize(bodyW, bodyH, true);

        // Animations
        this.anims.create({ key: "down",  frames: this.anims.generateFrameNumbers("player", { start: 0,  end: 2 }), frameRate: 8, repeat: -1 });
        this.anims.create({ key: "left",  frames: this.anims.generateFrameNumbers("player", { start: 3,  end: 5 }), frameRate: 8, repeat: -1 });
        this.anims.create({ key: "right", frames: this.anims.generateFrameNumbers("player", { start: 6,  end: 8 }), frameRate: 8, repeat: -1 });
        this.anims.create({ key: "up",    frames: this.anims.generateFrameNumbers("player", { start: 9,  end: 11 }), frameRate: 8, repeat: -1 });

        // Contrôles
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys("Z,Q,S,D");
        this.speed = 80 * scale;

        // Zones adaptées au scale + offset (pour la détection)
        this.zones = ZONES.map(z => ({
          ...z,
          x: offsetX + z.x * scale,
          y: offsetY + z.y * scale,
          w: z.w * scale,
          h: z.h * scale,
        }));
        this.activeZoneId = null;

        // DEBUG des zones existantes (contours)
        if (DEBUG) {
          const g = this.add.graphics({ x: 0, y: 0 });
          g.lineStyle(2, 0xff4f81, 1);
          this.zones.forEach(z => g.strokeRect(z.x, z.y, z.w, z.h));
          this.coordText = this.add.text(12, 12, "", { fontFamily: "monospace", fontSize: "14px", color: "#fff" })
            .setScrollFactor(0)
            .setDepth(60);
        }

        // ========= Colliders/Overlaps pour ouvrir les pop-ups des zones =========
        this.zoneGroup = this.physics.add.staticGroup();

        // Crée un rectangle physique statique pour chaque zone
        this.zoneRects = this.zones.map((z) => {
          const cx = z.x + z.w / 2;
          const cy = z.y + z.h / 2;

          // Visuel (invisible en prod, visible en DEBUG)
          const rect = this.add
            .rectangle(cx, cy, z.w, z.h, 0x00ff00, DEBUG ? 0.12 : 0)
            .setOrigin(0.5)
            .setDepth(5);

          // Activer la physique statique
          this.physics.add.existing(rect, true);
          rect.meta = { id: z.id, title: z.title, content: z.content };

          this.zoneGroup.add(rect);
          return rect;
        });

        // Overlap joueur <-> zones : ouverture du panneau
        this.physics.add.overlap(
          this.player,
          this.zoneGroup,
          (_player, rect) => {
            const meta = rect.meta;
            if (!meta) return;
            if (this.activeZoneId !== meta.id) {
              this.activeZoneId = meta.id;
              window.dispatchEvent(
                new CustomEvent("openPanel", {
                  detail: { title: meta.title, content: meta.content },
                })
              );
            }
          },
          undefined,
          this
        );

        // 🔧 Outil de placement interactif
        this.initPlacementTool(PLACE_GRID);
      }

      update() {
        if (!this.player) return;
        const b = this.player.body;
        const v = this.speed;
        b.setVelocity(0);

        const left =
          this.cursors.left.isDown ||
          this.keys.Q.isDown ||
          mobileControls.current.left;

        const right =
          this.cursors.right.isDown ||
          this.keys.D.isDown ||
          mobileControls.current.right;

        const up =
          this.cursors.up.isDown ||
          this.keys.Z.isDown ||
          mobileControls.current.up;

        const down =
          this.cursors.down.isDown ||
          this.keys.S.isDown ||
          mobileControls.current.down;

        if (left)  { b.setVelocityX(-v); this.player.anims.play("left", true); this.facing = "left"; }
        else if (right) { b.setVelocityX(v); this.player.anims.play("right", true); this.facing = "right"; }
        if (up)    { b.setVelocityY(-v); this.player.anims.play("up", true); this.facing = "up"; }
        else if (down) { b.setVelocityY(v); this.player.anims.play("down", true); this.facing = "down"; }

        if (!left && !right && !up && !down) {
          this.player.anims.stop();
          const idle = { down: 1, left: 4, right: 7, up: 10 }[this.facing || "down"];
          if (idle !== undefined) this.player.setFrame(idle);
        }

        // coordonnées joueur (DEBUG)
        if (DEBUG && this.coordText) {
          this.coordText.setText(`x:${Math.round(this.player.x)} y:${Math.round(this.player.y)}`);
        }

        // Réinitialiser l'état quand on sort de toute zone
        if (this.zoneGroup) {
          const stillOverlapping = this.physics.overlap(this.player, this.zoneGroup);
          if (!stillOverlapping) this.activeZoneId = null;
        }
      }

      /* ====================== OUTIL DE PLACEMENT ====================== */

      initPlacementTool(PLACE_GRID) {
        this.PLACE_GRID = PLACE_GRID;
        this.placeMode = true;//ACTIVER/DESACTIVER PLACEMENT
        this.dragStart = null;
        this.draftZonesNative = [];
        this.showGrid = false; //ACTIVER/DESACTIVER GRILLE

        this.placeG = this.add.graphics().setDepth(50);
        this.persistG = this.add.graphics().setDepth(49);
        this.gridG = this.add.graphics().setDepth(40);
        this.labelTexts = [];

        this.hud = this.add.text(12, 40,
          "P: place  |  E: export  |  U: undo  |  C: clear  |  G: grid",
          { fontFamily: "monospace", fontSize: "14px", color: "#fff" }
        ).setScrollFactor(0).setDepth(60);

        this.modeText = this.add.text(12, 60, "Place: OFF",
          { fontFamily: "monospace", fontSize: "14px", color: "#ff4f81" }
        ).setScrollFactor(0).setDepth(60);

        this.drawGrid();

        this.input.on("pointerdown", (p) => {
          if (!this.placeMode) return;
          const { nx, ny } = this.toNative(p.worldX, p.worldY);
          this.dragStart = { x: this.snap(nx), y: this.snap(ny) };
        });

        this.input.on("pointermove", (p) => {
          if (!this.placeMode || !this.dragStart) return;
          const { nx, ny } = this.toNative(p.worldX, p.worldY);
          const end = { x: this.snap(nx), y: this.snap(ny) };
          const r = this.normRect(this.dragStart, end);
          this.drawGuide(r);
        });

        this.input.on("pointerup", (p) => {
          if (!this.placeMode || !this.dragStart) return;
          const { nx, ny } = this.toNative(p.worldX, p.worldY);
          const end = { x: this.snap(nx), y: this.snap(ny) };
          const r = this.normRect(this.dragStart, end);
          this.dragStart = null;
          this.placeG.clear();
          if (r.w > 0 && r.h > 0) {
            this.draftZonesNative.push(r);
            this.drawPersist();
          }
        });

        this.input.keyboard.on("keydown-P", () => {
          this.placeMode = !this.placeMode;
          this.modeText.setText(`Place: ${this.placeMode ? "ON" : "OFF"}`);
        });
        this.input.keyboard.on("keydown-U", () => {
          if (this.draftZonesNative.length) {
            this.draftZonesNative.pop();
            this.drawPersist();
          }
        });
        this.input.keyboard.on("keydown-C", () => {
          this.draftZonesNative = [];
          this.drawPersist();
        });
        this.input.keyboard.on("keydown-G", () => {
          this.showGrid = !this.showGrid;
          this.drawGrid();
        });
        this.input.keyboard.on("keydown-E", () => this.exportZones());
      }

      toNative(x, y) {
        return {
          nx: (x - this.viewOffsetX) / this.viewScale,
          ny: (y - this.viewOffsetY) / this.viewScale,
        };
      }
      snap(n) { return Math.round(n / this.PLACE_GRID) * this.PLACE_GRID; }
      normRect(a, b) {
        const x = Math.min(a.x, b.x);
        const y = Math.min(a.y, b.y);
        const w = Math.abs(a.x - b.x);
        const h = Math.abs(a.y - b.y);
        return { x, y, w, h };
      }

      drawGuide(r) {
        const s = this.viewScale, ox = this.viewOffsetX, oy = this.viewOffsetY;
        this.placeG.clear();
        this.placeG.lineStyle(2, 0xff4f81, 1).strokeRect(ox + r.x * s, oy + r.y * s, r.w * s, r.h * s);
      }

      drawPersist() {
        const s = this.viewScale, ox = this.viewOffsetX, oy = this.viewOffsetY;
        this.persistG.clear();
        this.persistG.lineStyle(2, 0xff4f81, 1);
        // détruire les anciens labels
        this.labelTexts.forEach(t => t.destroy());
        this.labelTexts = [];
        this.draftZonesNative.forEach((r, i) => {
          this.persistG.strokeRect(ox + r.x * s, oy + r.y * s, r.w * s, r.h * s);
          this.persistG.fillStyle(0xff4f81, 0.08).fillRect(ox + r.x * s, oy + r.y * s, r.w * s, r.h * s);
          const lbl = this.add.text(ox + (r.x + 4) * s, oy + (r.y + 4) * s, `#${i + 1}`, {
            fontFamily: "monospace", fontSize: `${12 * s}px`, color: "#ff4f81"
          }).setDepth(51);
          this.labelTexts.push(lbl);
        });
      }

      drawGrid() {
        const s = this.viewScale, ox = this.viewOffsetX, oy = this.viewOffsetY;
        this.gridG.clear();
        if (!this.showGrid) return;
        this.gridG.lineStyle(1, 0x666666, 0.2);
        for (let x = 0; x <= BASE_W; x += this.PLACE_GRID) {
          this.gridG.lineBetween(ox + x * s, oy, ox + x * s, oy + BASE_H * s);
        }
        for (let y = 0; y <= BASE_H; y += this.PLACE_GRID) {
          this.gridG.lineBetween(ox, oy + y * s, ox + BASE_W * s, oy + BASE_H * s);
        }
      }

      exportZones() {
        const lines = this.draftZonesNative.map((r, i) =>
          `  { id: "zone-${i + 1}", x: ${Math.round(r.x)}, y: ${Math.round(r.y)}, w: ${Math.round(r.w)}, h: ${Math.round(r.h)}, title: "", content: "" },`
        );
        const out = `const ZONES = [\n${lines.join("\n")}\n];`;
        console.clear();
        console.log(out);
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(out);
        }
        this.add.text(12, 80, "ZONES copiées dans le presse-papiers ✔", {
          fontFamily: "monospace", fontSize: "14px", color: "#8aff8a"
        }).setScrollFactor(0).setDepth(60).setAlpha(1);
      }
      /* ==================== FIN OUTIL DE PLACEMENT ==================== */
    }

    const config = {
      type: Phaser.CANVAS,
      width: BASE_W,
      height: BASE_H,
      parent: containerRef.current,
      backgroundColor: "#000000ff",
      pixelArt: true,
      physics: { default: "arcade" },
      scale: { mode: Phaser.Scale.NONE },
      scene: [MainScene],
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

const fitOneThird = () => {
  const canvas = game.canvas;
  if (!canvas) return;

  const isMobile = window.innerWidth < 768;

  const targetW = isMobile
    ? window.innerWidth / 1.08   // garde mobile pareil
    : Math.min(window.innerWidth * 0.78, 1250); // desktop plus compact

  const scale = targetW / BASE_W;

  canvas.style.width = `${BASE_W * scale}px`;
  canvas.style.height = `${BASE_H * scale}px`;
  canvas.style.display = "block";
  canvas.style.margin = isMobile ? "0 auto" : "-8px auto 0";
  canvas.style.border = "2px solid #fff";
  canvas.style.borderRadius = "8px";
  canvas.style.boxShadow = "4px 4px 0 #fff";
  canvas.style.imageRendering = "pixelated";
  canvas.style.marginTop = "-51px";
};

    fitOneThird();
    window.addEventListener("resize", fitOneThird);

    const onOpen = (e) => setPanel(e.detail);
    window.addEventListener("openPanel", onOpen);

    return () => {
      window.removeEventListener("resize", fitOneThird);
      window.removeEventListener("openPanel", onOpen);
      game.destroy(true);
      gameRef.current = null;
    };
  }, []);

  const press = (direction) => {
    mobileControls.current[direction] = true;
  };

  const release = (direction) => {
    mobileControls.current[direction] = false;
  };

 return (
  <>
    <div style={{
  background: "#ffffffff",
  height: "calc(100vh)",
  overflow: "hidden",
  paddingTop: "0px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start"
}}>

      {/* <<< AJOUT ICI >>> */}
      <div style={{
        textAlign: "center",
        fontFamily: "Press Start 2P, monospace",
        fontSize: "12px",
        color: "rgba(255, 107, 181, 1)",
        marginBottom: "1px",
        marginTop: "1px",
      }}>
        Use the arrow keys to move
      </div>
      {/* <<< FIN AJOUT >>> */}

      <div ref={containerRef} />

      <div className="mobile-controls">
        <button
          className="btn-up"
          onPointerDown={() => press("up")}
          onPointerUp={() => release("up")}
          onPointerLeave={() => release("up")}
          onPointerCancel={() => release("up")}
          onTouchEnd={() => release("up")}
        >
          ▲
        </button>

        <button
          className="btn-left"
          onPointerDown={() => press("left")}
          onPointerUp={() => release("left")}
          onPointerLeave={() => release("left")}
          onPointerCancel={() => release("left")}
          onTouchEnd={() => release("left")}
        >
          ◀
        </button>

        <button
          className="btn-right"
          onPointerDown={() => press("right")}
          onPointerUp={() => release("right")}
          onPointerLeave={() => release("right")}
          onPointerCancel={() => release("right")}
          onTouchEnd={() => release("right")}
        >
          ▶
        </button>

        <button
          className="btn-down"
          onPointerDown={() => press("down")}
          onPointerUp={() => release("down")}
          onPointerLeave={() => release("down")}
          onPointerCancel={() => release("down")}
          onTouchEnd={() => release("down")}
        >
          ▼
        </button>
      </div>
    </div>

    {panel && (
      <div
        onClick={() => setPanel(null)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "#fff",
            color: "#000",
            border: "2px solid #000",
            borderRadius: 12,
            width: 420,
            maxWidth: "90vw",
            padding: 20,
            boxShadow: "6px 6px 0 #000",
            fontFamily: "Press Start 2P, monospace"
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: 12 }}>{panel.title}</h2>
          <p style={{ lineHeight: 1.5, fontSize: 12 }}>{panel.content}</p>
          <button
            onClick={() => setPanel(null)}
            style={{
              marginTop: 12,
              padding: "10px 14px",
              background: "#ff4f81",
              color: "#fff",
              border: "2px solid #000",
              borderRadius: 10,
              cursor: "pointer"
            }}
          >
            Fermer
          </button>
        </div>
      </div>
    )}
  </>
);

}
