import Head from "next/head";
import { useRouter } from "next/router";

interface SEOHeadProps {
  title: string;
  description?: string;
  canonical?: string;
  keywords?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description = "",
  canonical = "",
  keywords = "",
}) => {
  const { pathname } = useRouter();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const url = canonical ? `${siteUrl}${canonical}` : `${siteUrl}${pathname}`;

  return (
    <Head>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      <meta property="og:title" content={title} key="og:title" />
      {description && (
        <meta property="og:description" content={description} key="og:description" />
      )}
      <meta property="og:url" content={url} key="og:url" />
      <link rel="canonical" href={url} key="canonical" />
    </Head>
  );
};

export default SEOHead;
