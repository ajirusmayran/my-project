import React from 'react';
import { useSelector } from 'react-redux';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Slide from '@material-ui/core/Slide';
import Version from '../package.json';

import { SW_INIT, SW_UPDATE } from './types';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function UpdateAvailable() {
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [open, setOpen] = React.useState(true);
    const isServiceWorkerInitialized = useSelector(
        state => state.serviceWorkerInitialized,
    );
    const isServiceWorkerUpdated = useSelector(
        state => state.serviceWorkerUpdated,
    );
    const serviceWorkerRegistration = useSelector(
        state => state.serviceWorkerRegistration,
    );
    const updateServiceWorker = () => {
        const registrationWaiting = serviceWorkerRegistration.waiting;
        if (registrationWaiting) {
            registrationWaiting.postMessage({ type: 'SKIP_WAITING' });
            registrationWaiting.addEventListener('statechange', e => {
                if (e.target.state === 'activated') {
                    setOpen(false);
                    window.location.reload();
                }
            });
        }
    };
    return (
        <>
            {isServiceWorkerUpdated && (
                <Dialog
                    type={SW_UPDATE}
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            Versi {Version.version}
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={updateServiceWorker} color="primary">
                            Update
                        </Button>
                    </DialogActions>
                </Dialog>
            )
            }
        </>
    );
}

export default UpdateAvailable;