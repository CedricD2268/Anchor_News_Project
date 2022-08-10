import React from 'react';



const ShowHideButton = ({Name, showFunction}) => {
    const ButtonShowClicked = () => {
        showFunction()
    }

    return (
        <React.Fragment>
            <button type="button" onClick={ButtonShowClicked}>{Name}</button>
        </React.Fragment>

    );
};

ShowHideButton.defaultProps = {
    showFunction: function () {
    },
    Name: 'Password'
};

export default ShowHideButton;
