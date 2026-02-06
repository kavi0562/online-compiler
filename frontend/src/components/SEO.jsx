import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

export default function SEO({
    title,
    description,
    canonical,
    keywords,
    type = 'website'
}) {
    const siteTitle = "Online Compiler"; // Default site title

    return (
        <Helmet>
            {/* Standard Meta Tags */}
            <title>{title ? `${title} | ${siteTitle}` : siteTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="canonical" href={canonical} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={canonical} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
        </Helmet>
    );
}

SEO.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    canonical: PropTypes.string.isRequired,
    keywords: PropTypes.string,
    type: PropTypes.string
};
