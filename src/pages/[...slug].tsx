import React from 'react';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { NotFound, Head, RenderBlocks } from '../components';
import classes from '../styles/page.module.css';
import { Page } from '../../payload-types';
import { fetchPage } from '../graphql/query';

export type Props = {
  page?: Page;
  statusCode: number;
};

const Page: React.FC<Props> = (props) => {
  const { page } = props;

  if (!page) {
    return <NotFound />;
  }

  return (
    <main className={classes.page}>
      <Head
        title={page.meta?.title || page.title}
        description={page.meta?.description}
        keywords={page.meta?.keywords}
      />
      <header className={classes.header}>
        <h1>{page.title}</h1>
      </header>
      <div className={classes.featuredImage}>
        {page.image && typeof page.image === 'object' && (
          <Image
            src={page.image.sizes.feature.url || page.image.url}
            alt={page.image.alt}
            width={page.image.sizes.feature.width || page.image.width}
            height={page.image.sizes.feature.height || page.image.height}
          />
        )}
      </div>
      <RenderBlocks layout={page.layout} />
      <footer className={classes.footer}>
        <hr />
        NextJS + Payload Server Boilerplate made by
        {' '}
        <a
          href="https://payloadcms.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Payload
        </a>
      </footer>
    </main>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const slug = ctx.params?.slug
    ? (ctx.params.slug as string[]).join('/')
    : 'home';

  const { page } = await fetchPage(slug);

  if (!page) {
    ctx.res.statusCode = 404;

    return {
      props: {},
    };
  }

  return {
    props: {
      page,
    },
  };
};
