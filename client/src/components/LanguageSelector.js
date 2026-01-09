import React, { useState, useEffect, useRef } from "react";

const LanguageSelector = ({ languages, selected, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const wrapperRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    // Filter languages based on search term
    const filteredLanguages = languages.filter((lang) =>
        lang.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (langKey) => {
        onSelect(langKey);
        setIsOpen(false);
        setSearchTerm(""); // Reset search after selection
    };

    const selectedLangName = languages.find(l => l.key === selected)?.name || "Select Language";

    return (
        <div ref={wrapperRef} style={{ position: "relative", width: "300px", display: "inline-block" }}>
            {/* Dropdown Header (Input-like) */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    padding: "10px",
                    background: "#333",
                    color: "#fff",
                    borderRadius: "5px",
                    cursor: "pointer",
                    border: "1px solid #555",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <span>{languages.length === 0 ? "Loading..." : selectedLangName}</span>
                <span>{isOpen ? "▲" : "▼"}</span>
            </div>

            {/* Dropdown Content */}
            {isOpen && (
                <div
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        width: "100%",
                        maxHeight: "300px",
                        overflowY: "auto",
                        background: "#222",
                        border: "1px solid #555",
                        borderRadius: "5px",
                        zIndex: 99999,
                        marginTop: "5px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.3)"
                    }}
                >
                    {/* Search Input */}
                    <input
                        type="text"
                        placeholder="Search language..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            background: "#333",
                            color: "#fff",
                            border: "none",
                            borderBottom: "1px solid #555",
                            boxSizing: "border-box", // Important for padding
                            outline: "none"
                        }}
                        autoFocus
                    />

                    {/* Language List */}
                    {filteredLanguages.length > 0 ? (
                        filteredLanguages.map((lang) => (
                            <div
                                key={lang.key}
                                onClick={() => handleSelect(lang.key)}
                                style={{
                                    padding: "10px",
                                    cursor: "pointer",
                                    background: selected === lang.key ? "#444" : "transparent",
                                    color: "#eee",
                                    borderBottom: "1px solid #333"
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "#555")}
                                onMouseLeave={(e) =>
                                (e.currentTarget.style.background =
                                    selected === lang.key ? "#444" : "transparent")
                                }
                            >
                                {lang.name} <span style={{ fontSize: "12px", color: "#888" }}>({lang.version})</span>
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: "10px", color: "#888" }}>No languages found</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LanguageSelector;
