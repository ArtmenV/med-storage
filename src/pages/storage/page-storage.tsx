import * as React from 'react';

import SectionBar from 'components/sections-bar';

export default (): JSX.Element => {
    React.useEffect(() => {
        //
    }, []);

    return (
        <div className="container main-layout">
            <SectionBar
                activeSection="storage"
            />
        </div>
    );
};
