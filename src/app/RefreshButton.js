import styles from './page.module.css';

export default function RefreshButton() {
  return (
    <a
      className={styles.refreshButton}
      href="https://docs.google.com/spreadsheets/d/1wpLkUl-P-OMEgXE2w98aQ3wbKp62__-TR5wjFxS3zlU/edit?usp=sharing"
      target="_blank"
      rel="noopener noreferrer"
    >
      Uppdatera ledartavla
    </a>
  );
}
