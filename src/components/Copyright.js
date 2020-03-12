import React from 'react';
import Version from '../../package.json';

import Typography from '@material-ui/core/Typography';

export default function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            BKKBN{' '}
            {new Date().getFullYear()}
            {'.'} <br/>
            Versi {Version.version}
        </Typography>
    );

}