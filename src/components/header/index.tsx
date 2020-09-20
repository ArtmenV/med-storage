import * as React from 'react';
import './styles.less';

import UserWidget from 'medici-ui-kit/components/user-widget';

export default (): JSX.Element => (
    <header className="main-header container">
        <UserWidget
            user={{
                username: 'Мотылев А.А.',
                avatar: 'asdf',
            }}
        />
    </header>
);
