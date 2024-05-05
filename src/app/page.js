import Image from 'next/image';
import styles from './page.module.css';

async function getData() {
  return {
    leaderboard: [
      { name: 'Johan Stål', points: 5 },
      { name: 'Henric Trotzig', points: 3 },
      { name: 'Jonas Rehman', points: 3 },
      { name: 'Henrik Persson', points: 2 },
      { name: 'David Josephson', points: 0 },
    ],
  };
}

export default async function Home() {
  const { leaderboard } = await getData();
  return (
    <main className={styles.main}>
      <div className={styles.beer}>🍺⛳️</div>
      <h1>Öltouren 2024</h1>
      <p>Aktuell ställning i Öltouren på Stockholms Golfklubb.</p>
      <h2>Ledartavla</h2>
      <table>
        <thead>
          <tr>
            <th>Spelare</th>
            <th>Öl</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map(entry => {
            return (
              <tr key={entry.name}>
                <td>{entry.name}</td>
                <td>{entry.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
