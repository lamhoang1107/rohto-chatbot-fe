"use strict";

/* Package System */
import React from "react";

/* Application */
import {Slide,useScrollTrigger} from '@mui/material';

const HideOnScroll=props=>{

    // please keep it undefined here to not make useScrollTrigger throw an error on first render 
	const {children,window} = props;
	const trigger = useScrollTrigger({target:window?window():undefined});

    return (
        <React.Fragment>
            <Slide appear={false} direction="down" in={!trigger}>
			  	{children}
			</Slide>
        </React.Fragment>
    );
};

export default HideOnScroll;