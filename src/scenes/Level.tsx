import React, { useEffect, useRef, useState } from 'react';
import { KaijuConfig, CityDefinition } from '../types';

interface Props {
  config: KaijuConfig;
  city: CityDefinition;
  onGameOver: (score: number) => void;
  spawnRates?: {
    land: number;
    air: number;
  };
}

type EntityType =
  | 'building'
  | 'car'
  | 'tank'
  | 'heli'
  | 'explosion'
  | 'missile';

interface Entity {
  id: number;
  type: EntityType;
  x: number;
  y?: number;
  hp?: number;
  damage?: number;
  value: number;
  lastAttack?: number;
  ttl?: number;
  speed?: number;
}

const WORLD_SPEED = 100; // px / sec
const BLOCK_LENGTH = 1000; // world units per city block
const LAND_SPAWN_MS = 1500;
const AIR_SPAWN_MS = 3000;
const ATTACK_PAUSE_MS = 300;
const KAIJU_SIZE = 120;
const BUILDING_WIDTH = 80;
const BUILDING_HEIGHT = 160;
const VEHICLE_SIZE = 40;
const BUILDING_MAX_HP = 3;
const TANK_MISSILE_SPEED = 300;
const HELI_MISSILE_SPEED = 350;

export const Level: React.FC<Props> = ({
  config,
  city,
  onGameOver,
  spawnRates,
}) => {
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [attacking, setAttacking] = useState(false);

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

  const landInterval = spawnRates?.land ?? LAND_SPAWN_MS;
  const airInterval = spawnRates?.air ?? AIR_SPAWN_MS;

  const spawnLand = () => {
    const id = Date.now() + Math.random();
    const roll = Math.random();
    if (roll < 0.2) {
      entitiesRef.current.push({
        id,
        type: 'building',
        x: fieldWidthRef.current,
        hp: BUILDING_MAX_HP,
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
        lastAttack: performance.now(),
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

  const fireMissile = (
    x: number,
    y: number,
    speed: number,
    damage: number
  ) => {
    entitiesRef.current.push({
      id: Date.now() + Math.random(),
      type: 'missile',
      x,
      y,
      speed,
      damage,
      value: 0,
    });
    setEntities([...entitiesRef.current]);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        pauseUntilRef.current = performance.now() + ATTACK_PAUSE_MS;
        setAttacking(true);
        setTimeout(() => setAttacking(false), ATTACK_PAUSE_MS);

        const building = entitiesRef.current.find(
          (ent) =>
            ent.type === 'building' &&
            ent.x - playerXRef.current < BUILDING_WIDTH &&
            (ent.hp ?? 0) > 0
        );
        if (building) {
          building.hp!--;
          setEntities([...entitiesRef.current]);
          if ((building.hp ?? 0) <= 0) {
            setScore(scoreRef.current + building.value);
            entitiesRef.current = entitiesRef.current.filter(
              (e) => e.id !== building.id
            );
            entitiesRef.current.push({
              id: Date.now() + Math.random(),
              type: 'explosion',
              x: building.x,
              value: 0,
              ttl: 300,
            });
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
          e.x - playerXRef.current < BUILDING_WIDTH &&
          (e.hp ?? 0) > 0
      );
      const heliThreat = entitiesRef.current.some(
        (e) => e.type === 'heli' && e.x - playerXRef.current < 300
      );
      const paused =
        blocked || heliThreat || time < pauseUntilRef.current;

      if (!paused) {
        progressRef.current += WORLD_SPEED * dt;
        entitiesRef.current.forEach((e) => {
          if (e.type !== 'missile') {
            e.x -= WORLD_SPEED * dt;
            if (e.type === 'heli' && e.x < playerXRef.current + 200) {
              e.x = playerXRef.current + 200;
            }
          }
        });
      }

      if (time - lastLandSpawnRef.current > landInterval) {
        lastLandSpawnRef.current = time;
        spawnLand();
      }
      if (time - lastAirSpawnRef.current > airInterval) {
        lastAirSpawnRef.current = time;
        spawnAir();
      }

      entitiesRef.current.forEach((e) => {
        if (e.type === 'tank') {
          if (e.x - playerXRef.current < 400 && time - (e.lastAttack ?? 0) > 1500) {
            e.lastAttack = time;
            fireMissile(e.x, VEHICLE_SIZE / 2, TANK_MISSILE_SPEED, e.damage ?? 0);
          }
        }
        if (e.type === 'heli') {
          if (time - (e.lastAttack ?? 0) > 1500) {
            e.lastAttack = time;
            fireMissile(
              e.x,
              KAIJU_SIZE * 0.5,
              HELI_MISSILE_SPEED,
              e.damage ?? 0
            );
          }
        }
      });

      entitiesRef.current = entitiesRef.current.filter((e) => {
        if (e.type === 'car' || e.type === 'tank') {
          if (e.x <= playerXRef.current) {
            setScore(scoreRef.current + e.value);
            return false;
          }
        }
        if (e.type === 'missile') {
          e.x -= (e.speed ?? 0) * dt;
          if (e.x <= playerXRef.current + KAIJU_SIZE && e.x >= playerXRef.current) {
            setHealth(healthRef.current - (e.damage ?? 0));
            return false;
          }
          return e.x > -50;
        }
        if (e.type === 'explosion') {
          e.ttl = (e.ttl ?? 0) - dt * 1000;
          return (e.ttl ?? 0) > 0;
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
  }, [city.blocks, onGameOver, landInterval, airInterval]);

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
          style={{
            position: 'absolute',
            left: playerXRef.current,
            bottom: 0,
            width: KAIJU_SIZE,
            height: KAIJU_SIZE,
          }}
        />
        {attacking && (
          <div
            style={{
              position: 'absolute',
              left: playerXRef.current + KAIJU_SIZE,
              bottom: KAIJU_SIZE * 0.6,
              width: 60,
              height: 20,
              background: 'orange',
            }}
          />
        )}
        {entities.map((ent) => (
          <React.Fragment key={ent.id}>
            <div
              className={`entity entity-${ent.type}`}
              style={{
                position: 'absolute',
                left: ent.x,
                bottom:
                  ent.type === 'heli'
                    ? 160
                    : ent.type === 'missile'
                    ? ent.y
                    : 0,
                width:
                  ent.type === 'building'
                    ? BUILDING_WIDTH
                    : ent.type === 'missile'
                    ? 10
                    : VEHICLE_SIZE,
                height:
                  ent.type === 'building'
                    ? BUILDING_HEIGHT
                    : ent.type === 'heli'
                    ? VEHICLE_SIZE
                    : ent.type === 'missile'
                    ? 4
                    : VEHICLE_SIZE,
                background:
                  ent.type === 'car'
                    ? 'orange'
                    : ent.type === 'tank'
                    ? 'green'
                    : ent.type === 'heli'
                    ? 'gray'
                    : ent.type === 'missile'
                    ? 'red'
                    : ent.type === 'explosion'
                    ? 'yellow'
                    : ['#bbb', '#999', '#777', '#555'][ent.hp ?? 0],
                borderRadius: ent.type === 'explosion' ? '50%' : undefined,
              }}
            />
            {ent.type === 'building' && (
              <div
                style={{
                  position: 'absolute',
                  left: ent.x,
                  bottom: BUILDING_HEIGHT + 4,
                  width: BUILDING_WIDTH,
                  height: 6,
                  background: '#400',
                }}
              >
                <div
                  style={{
                    width: `${((ent.hp ?? 0) / BUILDING_MAX_HP) * 100}%`,
                    height: '100%',
                    background: '#f00',
                  }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
