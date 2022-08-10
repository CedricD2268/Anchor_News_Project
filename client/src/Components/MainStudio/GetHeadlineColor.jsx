import React from 'react'


const GetHeadlineColor = ({target, option}) => {
    let HeadlineLineColor = [];


    if (option === 'full') {
        HeadlineLineColor = [
            {
                headlineTitle: 'Breaking News',
                color: 'white',
                background: '#BF1818'
            },
            {
                headlineTitle: 'Fact Check',
                color: 'white',
                background: '#52796f'
            },
            {
                headlineTitle: 'Opinion',
                color: '#002329',
                background: '#fefae0'
            },
            {
                headlineTitle: 'Review',
                color: '#002329',
                background: '#e9c46a'
            },
            {
                headlineTitle: 'Buzz',
                color: 'white',
                background: '#84a59d'
            },
            {
                headlineTitle: 'Analysis',
                color: 'white',
                background: '#2f3e46'
            },
            {
                headlineTitle: 'Overview',
                color: 'white',
                background: 'black'
            }
        ]
    }

    if (option === 'partialBackground') {
        HeadlineLineColor = [
            {headlineTitle: 'Breaking News', color: 'white', background: '#BF1818'},
            {
                headlineTitle: 'Fact Check',
                color: 'white',
                background: '#52796f'
            },
            {headlineTitle: 'Opinion', color: '#002329', background: '#fff3b0'},
            {
                headlineTitle: 'Review',
                color: 'white',
                background: ' #e9c46a'
            },
            {
                headlineTitle: 'Buzz',
                color: '#002329',
                background: '#84a59d'
            },
            {
                headlineTitle: 'Analysis',
                color: 'white',
                background: '#2f3e46'
            },
            {headlineTitle: 'Overview', color: 'white', background: 'black'}
        ]
    }


    if (option === 'textOnly') {
        HeadlineLineColor = [
            {
                headlineTitle: 'Breaking News',
                color: '#9b2226'
            },
            {
                headlineTitle: 'Fact Check',
                color: '#52796f'
            },
            {
                headlineTitle: 'Opinion',
                color: '#414833'
            },
            {
                headlineTitle: 'Review',
                color: '#ee9b00'
            },
            {
                headlineTitle: 'Buzz',
                color: '#84a59d'
            },
            {
                headlineTitle: 'Analysis',
                color: '#2f3e46'
            },
            {
                headlineTitle: 'Overview',
                color: 'black'
            }
        ]
    }


    for (const item of HeadlineLineColor) {
        if (item.headlineTitle === target) {
            return (item)
        }
    }
}


GetHeadlineColor.defaultProps={
    target: 'Opinion',
    option: 'full'
}

export default GetHeadlineColor;