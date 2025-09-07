import React from 'react';

const Databox = ({number, label}) => {
    return (
        <div className="flex flex-col items-center justify-center bg-white text-black h-[20vh] rounded-[var(--br-radius)] space-y-5 2xl:space-y-8">
            <div className="text-5xl 2xl:text-7xl font-bold">
                {number}
            </div>
            <div className="text-xl 2xl:text-4xl font-medium">
                {label}
            </div>
        </div>
    );
};

export default Databox;