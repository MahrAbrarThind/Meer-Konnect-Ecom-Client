import React from 'react';

const NoResultSearch = () => {
    return (
        <div className="NoResultSearchContainer">
            <h2 className="NoResultSearchHeading">Search No Result</h2>
            <p className="NoResultSearchParagraph">No result found for your search</p>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={96}
                height={96}
                viewBox="0 0 24 24"
                className="NoResultSearchSvg"
            >
                <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                    <circle cx={11} cy={11} r={8}></circle>
                    <path d="m21 21l-4.3-4.3"></path>
                </g>
            </svg>
        </div>
    );
};

export default NoResultSearch;
