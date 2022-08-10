import React from 'react';

const HeaderPromo = () => {

    const event = new Date();
    const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    const date = event.toLocaleDateString(undefined, options)


    return (
        <React.Fragment>
            <div id="header-date">
                <p>{date}</p>
            </div>
            <div id="header-promotion">
                <img/>
            </div>

        </React.Fragment>
    );
};

export default HeaderPromo;
