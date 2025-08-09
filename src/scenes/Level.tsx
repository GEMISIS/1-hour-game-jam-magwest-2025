import React, { useEffect, useRef, useState } from 'react';
import { KaijuConfig, CityDefinition } from '../types';

interface Props {
  config: KaijuConfig;
  city: CityDefinition;
  onGameOver: (score: number) => void;
}

type EntityType = 'building' | 'car' | 'tank' | 'heli';

interface Entity {
  id: number;
  type: EntityType;
  x: number;
  y?: number;
  hp?: number;
  damage?: number;
  value: number;
  lastAttack?: number;
}

const WORLD_SPEED = 100; // px / sec
const BLOCK_LENGTH = 1000; // world units per city block
const LAND_SPAWN_MS = 1500;
const AIR_SPAWN_MS = 3000;
const ATTACK_PAUSE_MS = 300;

export const Level: React.FC<Props> = ({ config, city, onGameOver }) => {
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // refs for raf loop
  const entitiesRef = useRef<Entity[]>(entities);
  const scoreRef = useRef(0);
  const healthRef = useRef(100);
  const progressRef = useRef(0);
  const lastLandSpawnRef = useRef(0);
  const lastAirSpawnRef = useRef(0);
  const frameRef = useRef<number>(0);
  const pauseUntilRef = useRef(0);
  const playerXRef = useRef(100);
  const fieldWidthRef = useRef(800);

  useEffect(() => {
    entitiesRef.current = entities;
  }, [entities]);
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);
  useEffect(() => {
    healthRef.current = health;
  }, [health]);

  useEffect(() => {
    const onResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const fieldWidth = Math.min(dimensions.width, 800);
  const fieldHeight = Math.min(dimensions.height * 0.6, 400);
  playerXRef.current = fieldWidth * 0.125;
  fieldWidthRef.current = fieldWidth;

  const spawnLand = () => {
    const id = Date.now() + Math.random();
    const roll = Math.random();
    if (roll < 0.2) {
      entitiesRef.current.push({
        id,
        type: 'building',
        x: fieldWidthRef.current,
        hp: 3,
        value: 5000,
      });
    } else if (roll < 0.6) {
      entitiesRef.current.push({
        id,
        type: 'car',
        x: fieldWidthRef.current,
        value: 500,
      });
    } else {
      entitiesRef.current.push({
        id,
        type: 'tank',
        x: fieldWidthRef.current,
        damage: 10,
        value: 1500,
      });
    }
    setEntities([...entitiesRef.current]);
  };

  const spawnAir = () => {
    const id = Date.now() + Math.random();
    entitiesRef.current.push({
      id,
      type: 'heli',
      x: fieldWidthRef.current,
      y: fieldHeight - 80,
      hp: 2,
      damage: 5,
      value: 2000,
      lastAttack: performance.now(),
    });
    setEntities([...entitiesRef.current]);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        pauseUntilRef.current = performance.now() + ATTACK_PAUSE_MS;

        const building = entitiesRef.current.find(
          (ent) =>
            ent.type === 'building' &&
            ent.x - playerXRef.current < 80 &&
            (ent.hp ?? 0) > 0
        );
        if (building) {
          building.hp!--;
          if ((building.hp ?? 0) <= 0) {
            setScore(scoreRef.current + building.value);
            entitiesRef.current = entitiesRef.current.filter(
              (e) => e.id !== building.id
            );
            setEntities([...entitiesRef.current]);
          }
          return;
        }

        const heliIdx = entitiesRef.current.findIndex(
          (ent) => ent.type === 'heli' && ent.x - playerXRef.current <= 300
        );
        if (heliIdx !== -1) {
          const [heli] = entitiesRef.current.splice(heliIdx, 1);
          setScore(scoreRef.current + heli.value);
          setEntities([...entitiesRef.current]);
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    let last = performance.now();

    const update = (time: number) => {
      const dt = (time - last) / 1000;
      last = time;

      const blocked = entitiesRef.current.some(
        (e) =>
          e.type === 'building' &&
          e.x - playerXRef.current < 80 &&
          (e.hp ?? 0) > 0
      );
      const paused =
        blocked || time < pauseUntilRef.current;

      if (!paused) {
        progressRef.current += WORLD_SPEED * dt;
        entitiesRef.current.forEach((e) => {
          e.x -= WORLD_SPEED * dt;
          if (e.type === 'heli' && e.x < playerXRef.current + 200) {
            e.x = playerXRef.current + 200;
          }
        });
      }

      if (time - lastLandSpawnRef.current > LAND_SPAWN_MS) {
        lastLandSpawnRef.current = time;
        spawnLand();
      }
      if (time - lastAirSpawnRef.current > AIR_SPAWN_MS) {
        lastAirSpawnRef.current = time;
        spawnAir();
      }

      entitiesRef.current = entitiesRef.current.filter((e) => {
        if (e.type === 'car' || e.type === 'tank') {
          if (e.x <= playerXRef.current) {
            const dmg = e.type === 'tank' ? e.damage ?? 0 : 0;
            setHealth(healthRef.current - dmg);
            setScore(scoreRef.current + e.value);
            return false;
          }
        }
        if (e.type === 'heli') {
          if (time - (e.lastAttack ?? 0) > 1000) {
            e.lastAttack = time;
            setHealth(healthRef.current - (e.damage ?? 0));
          }
        }
        return e.x > -100;
      });
      setEntities([...entitiesRef.current]);

      if (
        healthRef.current <= 0 ||
        progressRef.current >= city.blocks * BLOCK_LENGTH
      ) {
        onGameOver(scoreRef.current);
        return;
      }

      frameRef.current = requestAnimationFrame(update);
    };

    frameRef.current = requestAnimationFrame(update);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [city.blocks, onGameOver]);

  return (
    <div className="level-screen">
      <h2>Rampage in {city.name}</h2>
      <div
        className="hud"
        style={{
          background: 'rgba(0,0,0,0.6)',
          color: '#fff',
          padding: '0.5rem',
          borderRadius: '4px',
          display: 'inline-block',
        }}
      >
        <div>Health: {health}</div>
        <div>Score: ${score}</div>
        <div>
          Blocks: {Math.floor(progressRef.current / BLOCK_LENGTH)} / {city.blocks}
        </div>
      </div>
      <div
        className="playfield"
        style={{
          position: 'relative',
          width: fieldWidth,
          height: fieldHeight,
          overflow: 'hidden',
          background: '#88c',
          margin: '0 auto',
        }}
      >
        <img
          src="/kaiju.svg"
          alt={config.name}
          style={{ position: 'absolute', left: playerXRef.current, bottom: 0 }}
        />
        {entities.map((ent) => (
          <div
            key={ent.id}
            className={`entity entity-${ent.type}`}
            style={{
              position: 'absolute',
              left: ent.x,
              bottom:
                ent.type === 'heli'
                  ? 160
                  : 0,
              width: 40,
              height: ent.type === 'building' ? 100 : 40,
              background:
                ent.type === 'car'
                  ? 'orange'
                  : ent.type === 'tank'
                  ? 'green'
                  : ent.type === 'heli'
                  ? 'gray'
                  : '#555',
            }}
          />
        ))}
      </div>
    </div>
  );
};
