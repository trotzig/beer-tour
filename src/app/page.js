import styles from './page.module.css';
import { google } from 'googleapis';

const { GOOGLE_API_KEY } = process.env;

async function getData(sheetName = 'standings') {
  // Initialize the Sheets API client
  const sheets = google.sheets({
    version: 'v4',
    auth: GOOGLE_API_KEY,
  });

  // Fetch data from Google Sheets
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: '1wpLkUl-P-OMEgXE2w98aQ3wbKp62__-TR5wjFxS3zlU',
    range: sheetName,
  });

  const values = response.data.values;
  const players = values
    .splice(0, 1)[0]
    .slice(1)
    .map(name => {
      return { name, points: 0, debtors: [] };
    });

  for (const row of values) {
    let i = 0;
    const name = row[0];
    for (const debt of row.slice(1)) {
      const points = parseInt(debt, 10);
      if (points > 0) {
        players[i].points += points;
        players[i].debtors.push({ name, points });
      }
      i++;
    }
  }
  const leaderboard = players.sort((a, b) => b.points - a.points);

  leaderboard.forEach((entry, i) => {
    const previous = leaderboard[i - 1] || { points: -1 };
    if (previous.points === entry.points) {
      if (!previous.position.startsWith('T')) {
        previous.position = `T${previous.position}`;
      }
      entry.position = previous.position;
    } else {
      entry.position = `${i + 1}`;
    }
  });

  const debts = [];
  for (const entry of leaderboard) {
    for (const debtor of entry.debtors) {
      debts.push(`${debtor.name} är skyldig ${entry.name} ${debtor.points} öl`);
    }
  }

  return {
    leaderboard,
    debts,
  };
}

export default async function Home() {
  const { leaderboard, debts } = await getData();
  const results2025 = await getData('2025');
  const results2024 = await getData('2024');
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <span className={styles.flagIcon}>⛳️</span>
        <h1 className={styles.title}>Öltouren 2026</h1>
        <p className={styles.subtitle}>Stockholms Golfklubb</p>
      </div>

      <div className={styles.scoreboard}>
        <div className={styles.scoreboardHeader}>
          <span className={styles.scoreboardTitle}>Ledartavla</span>
        </div>
        <table className={styles.leaderboard}>
        <thead>
          <tr>
            <th>Pos</th>
            <th>Spelare</th>
            <th>Intjänade öl</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map(entry => {
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
      </div>

      <p className={styles.sectionTitle}>Skulder</p>
      <h2 className={styles.sectionHeading}>Skuldtavla</h2>
      <div className={styles.debts}>
        {debts.map(debt => {
          return <div key={debt}>{debt}</div>;
        })}
      </div>

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

export const revalidate = 0;
