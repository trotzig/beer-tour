import { google } from 'googleapis';
import { NextResponse } from 'next/server';

const { GOOGLE_API_KEY } = process.env;

async function getData(sheetName = 'standings') {
  const sheets = google.sheets({
    version: 'v4',
    auth: GOOGLE_API_KEY,
  });

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

  const rawDebts = new Map();
  for (const entry of leaderboard) {
    for (const debtor of entry.debtors) {
      const key = `${debtor.name}→${entry.name}`;
      rawDebts.set(key, (rawDebts.get(key) || 0) + debtor.points);
    }
  }
  const debts = [];
  for (const [key, amount] of rawDebts) {
    const [debtor, creditor] = key.split('→');
    const reverseKey = `${creditor}→${debtor}`;
    const reverseAmount = rawDebts.get(reverseKey) || 0;
    const net = amount - reverseAmount;
    if (net > 0) {
      debts.push(`${debtor} är skyldig ${creditor} ${net} öl`);
    }
  }

  return { leaderboard, debts };
}

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await getData();
  return NextResponse.json(data);
}
