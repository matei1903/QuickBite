import React, { useState, useEffect } from "react";

export default ({ path, className }) => {
    const [contents, setContents] = useState("");
    useEffect(() => {
        fetch(path)
            .then((data) => data.text())
            .then((data) => setContents(data));
    }, []);
    return (
        <>
            {contents && (
                <span
                    className={className}
                    dangerouslySetInnerHTML={{ __html: contents }}
                ></span>
            )}
        </>
    );
};