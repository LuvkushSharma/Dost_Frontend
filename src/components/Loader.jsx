import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const Loader = () => {
    return (
        <div style={{ 
            position: 'fixed', 
            top: 0, 
            bottom: 0, 
            left: 0, 
            right: 0, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            backgroundColor: 'rgba(255, 255, 255, 0.5)' /* Optional: Add a semi-transparent background color */
        }}>
            <CircularProgress />
        </div>
    );
};

export default Loader;
