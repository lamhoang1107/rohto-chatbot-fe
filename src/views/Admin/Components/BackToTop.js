"use strict";

/* Package System */
import React from "react";

/* Application */
import {Slide,useScrollTrigger,Zoom} from '@mui/material';

const BackToTop=props=>{

    // please keep it undefined here to not make useScrollTrigger throw an error on first render 
	const {children,window} = props;
	const trigger = useScrollTrigger({target:window?window():undefined,disableHysteresis: true,threshold: 50});

    return (
        <React.Fragment>
            <Zoom in={trigger}>
                <div className="backToTop" role="presentation">
                    {children}
                </div>
			</Zoom>
        </React.Fragment>
    );
};

export default BackToTop;