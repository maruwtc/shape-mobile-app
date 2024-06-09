import * as React from 'react';
import { Appbar } from 'react-native-paper';
import { Platform } from 'react-native';

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

const Header = ({ title }: { title: String }) => (
    <Appbar.Header>
        <Appbar.Content title={title} />
    </Appbar.Header>
);

export default Header;