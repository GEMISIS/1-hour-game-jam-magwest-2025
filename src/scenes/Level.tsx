import React, { useEffect, useRef, useState } from 'react';
import { KaijuConfig, CityDefinition } from '../types';

interface Props {
  config: KaijuConfig;
  city: CityDefinition;
  onGameOver: (score: number) => void;
}

interface Enemy {
  id: number;
  x: number;
  type: 'tank' | 'heli';
  damage: number;
  value: number;
}

const PLAYER_X = 100; // px from left
const WORLD_SPEED = 100; // px / sec
const BLOCK_LENGTH = 1000; // world units per city block
const ENEMY_SPAWN_MS = 2000;

export const Level: React.FC<Props> = ({ config, city, onGameOver }) => {
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [enemies, setEnemies] = useState<Enemy[]>([]);

  // refs to avoid stale closures in RAF loop
  const enemiesRef = useRef<Enemy[]>(enemies);
  const scoreRef = useRef(0);
  const healthRef = useRef(100);
  const progressRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    enemiesRef.current = enemies;
  }, [enemies]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    healthRef.current = health;
  }, [health]);

  const spawnEnemy = () => {
    const id = Date.now() + Math.random();
    const enemy: Enemy = {
      id,
      x: 800,
      type: Math.random() < 0.5 ? 'tank' : 'heli',
      damage: 10,
      value: 1000,
    };
    enemiesRef.current.push(enemy);
    setEnemies([...enemiesRef.current]);
  };

  // simple input handler: space to attack
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        const idx = enemiesRef.current.findIndex(
          (enemy) => enemy.x - PLAYER_X < 80
        );
        if (idx !== -1) {
          const [enemy] = enemiesRef.current.splice(idx, 1);
          setScore(scoreRef.current + enemy.value);
          setEnemies([...enemiesRef.current]);
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

      progressRef.current += WORLD_SPEED * dt;

      if (time - lastSpawnRef.current > ENEMY_SPAWN_MS) {
        lastSpawnRef.current = time;
        spawnEnemy();
      }

      enemiesRef.current.forEach((enemy) => {
        enemy.x -= WORLD_SPEED * dt;
      });

      enemiesRef.current = enemiesRef.current.filter((enemy) => {
        if (enemy.x <= PLAYER_X) {
          const newHealth = healthRef.current - enemy.damage;
          setHealth(newHealth);
          return false;
        }
        return true;
      });
      setEnemies([...enemiesRef.current]);

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
      <div className="hud">
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
          width: 800,
          height: 300,
          overflow: 'hidden',
          background: '#88c',
        }}
      >
        <img
          src="/kaiju.svg"
          alt={config.name}
          style={{ position: 'absolute', left: PLAYER_X, bottom: 0 }}
        />
        {enemies.map((enemy) => (
          <div
            key={enemy.id}
            className={`enemy enemy-${enemy.type}`}
            style={{
              position: 'absolute',
              left: enemy.x,
              bottom: 0,
              width: 40,
              height: 40,
              background: enemy.type === 'tank' ? 'green' : 'gray',
            }}
          />
        ))}
      </div>
    </div>
  );
};
