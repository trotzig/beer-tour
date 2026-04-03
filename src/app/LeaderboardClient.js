'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './page.module.css';

const LOWER = 'abcdefghijklmnopqrstuvwxyz';

function randomWord(len) {
  const chars = Array.from({ length: len }, () => LOWER[Math.floor(Math.random() * LOWER.length)]);
  chars[0] = chars[0].toUpperCase();
  return chars.join('');
}

function scrambleName() {
  return `${randomWord(5)} ${randomWord(8)}`;
}

function randomNumber() {
  return String(Math.floor(Math.random() * 100));
}

function ScrambleCell({ value, loading, number }) {
  const [display, setDisplay] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    if (loading) {
      setDisplay(number ? randomNumber() : scrambleName());
      intervalRef.current = setInterval(() => {
        setDisplay(number ? randomNumber() : scrambleName());
      }, 80);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDisplay(value);
    }
    return () => clearInterval(intervalRef.current);
  }, [loading, value, number]);

  return <span>{display}</span>;
}

const PLACEHOLDER_ROWS = 5;

export default function LeaderboardClient() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(r => r.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, []);

  const rows = loading
    ? Array.from({ length: PLACEHOLDER_ROWS }, (_, i) => ({
        position: String(i + 1),
        name: null,
        points: null,
      }))
    : data.leaderboard;

  const debts = loading ? [] : data.debts;

  return (
    <>
      <div className={styles.scoreboardMount}>
        <div className={styles.scoreboard}>
          <div className={styles.scoreboardHeader}>
            <span className={styles.scoreboardTitle}>Ledartavla</span>
          </div>
          <table className={styles.leaderboard}>
            <colgroup>
              <col style={{ width: '15%' }} />
              <col style={{ width: '60%' }} />
              <col style={{ width: '25%' }} />
            </colgroup>
            <thead>
              <tr>
                <th>Pos</th>
                <th>Spelare</th>
                <th>Intjänade öl</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((entry, i) => (
                <tr key={loading ? i : entry.name}>
                  <td>{entry.position}</td>
                  <td>
                    {loading ? (
                      <ScrambleCell value="" loading={loading} />
                    ) : (
                      entry.name
                    )}
                  </td>
                  <td>
                    {loading ? (
                      <ScrambleCell value="" loading={loading} number />
                    ) : (
                      entry.points
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className={styles.sectionTitle}>Skulder</p>
      <h2 className={styles.sectionHeading}>Skuldtavla</h2>
      <div className={styles.debts}>
        {loading ? (
          <span style={{ opacity: 0.4 }}>Laddar...</span>
        ) : (
          debts.map(debt => <div key={debt}>{debt}</div>)
        )}
      </div>
    </>
  );
}
