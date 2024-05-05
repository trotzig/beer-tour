import Image from 'next/image';
import styles from './page.module.css';
import { google } from 'googleapis';

const { GOOGLE_API_KEY } = process.env;

async function getData() {
  // Initialize the Sheets API client
  const sheets = google.sheets({
    version: 'v4',
    auth: GOOGLE_API_KEY,
  });

  // Fetch data from Google Sheets
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: '1wpLkUl-P-OMEgXE2w98aQ3wbKp62__-TR5wjFxS3zlU',
    range: 'standings',
  });

  const values = response.data.values;
  const players = values
    .splice(0, 1)[0]
    .slice(1)
    .map(name => {
      return { name, points: 0 };
    });
  for (const row of values) {
    let i = 0;
    for (const debt of row.slice(1)) {
      players[i].points += parseInt(debt, 10);
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

  console.log({ leaderboard, values });

  return {
    leaderboard,
    values,
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
