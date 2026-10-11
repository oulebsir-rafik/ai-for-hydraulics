import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

const PARTS = [
  {
    title: 'Part 1 — Data Manipulation',
    weeks: 'Weeks 1–4',
    to: '/docs/part-1-data-manipulation',
  },
  {
    title: 'Part 2 — Preprocessing & Supervised Learning',
    weeks: 'Weeks 5–11',
    to: '/docs/part-2-machine-learning',
  },
  {
    title: 'Part 3 — LLMs for Engineering Work',
    weeks: 'Weeks 12–14',
    to: '/docs/part-3-llms',
  },
];

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/intro">
            Start the course
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <HomepageHeader />
      <main className="container margin-vert--xl">
        <div className="row">
          {PARTS.map(({title, weeks, to}) => (
            <div key={title} className="col col--4 margin-bottom--lg">
              <Link to={to} className="card padding--lg">
                <Heading as="h3">{title}</Heading>
                <p>{weeks}</p>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </Layout>
  );
}
