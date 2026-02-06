import { Link } from 'react-router-dom';

export default function Breadcrumbs({ items }) {
    if (!items || items.length === 0) return null;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url ? `https://yourdomain.com${item.url}` : undefined
        }))
    };

    return (
        <nav className="text-sm breadcrumbs mb-4" aria-label="Breadcrumb">
            <script type="application/ld+json">
                {JSON.stringify(jsonLd)}
            </script>
            <ul>
                {items.map((item, index) => (
                    <li key={index}>
                        {item.url ? (
                            <Link to={item.url} className="text-blue-500 hover:underline">
                                {item.name}
                            </Link>
                        ) : (
                            <span className="text-gray-500">{item.name}</span>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
}
