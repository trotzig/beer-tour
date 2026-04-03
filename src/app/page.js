import styles from './page.module.css';
import RefreshButton from './RefreshButton';
import LeaderboardClient from './LeaderboardClient';
import results2024 from '../data/2024.json';
import results2025 from '../data/2025.json';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Öltouren 2026</h1>
        <p className={styles.subtitle}>Stockholms Golfklubb</p>
      </div>

      <LeaderboardClient />
      <RefreshButton />

      <p className={styles.sectionTitle}>Historik</p>
      <h2 className={styles.sectionHeading}>Resultat 2025</h2>
      <table className={styles.leaderboard}>
        <thead>
          <tr>
            <th>Pos</th>
            <th>Spelare</th>
            <th>Intjänade öl</th>
          </tr>
        </thead>
        <tbody>
          {results2025.leaderboard.map(entry => {
            return (
              <tr key={entry.name}>
                <td>{entry.position}</td>
                <td>{entry.name}</td>
                <td>{entry.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <p className={styles.sectionTitle}>Historik</p>
      <h2 className={styles.sectionHeading}>Resultat 2024</h2>
      <table className={styles.leaderboard}>
        <thead>
          <tr>
            <th>Pos</th>
            <th>Spelare</th>
            <th>Intjänade öl</th>
          </tr>
        </thead>
        <tbody>
          {results2024.leaderboard.map(entry => {
            return (
              <tr key={entry.name}>
                <td>{entry.position}</td>
                <td>{entry.name}</td>
                <td>{entry.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className={styles.dataLink}>
        Uppdatera här:{' '}
        <a href="https://docs.google.com/spreadsheets/d/1wpLkUl-P-OMEgXE2w98aQ3wbKp62__-TR5wjFxS3zlU/edit?usp=sharing">
          https://docs.google.com/spreadsheets/d/1wpLkUl-P-OMEgXE2w98aQ3wbKp62__-TR5wjFxS3zlU/edit?usp=sharing
        </a>
        .
      </p>
    </main>
  );
}
