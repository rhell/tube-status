import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Container from '../Container';
import Line from '../Line';
import dataBroker from '../../Helpers/dataBroker';

const endpoint = 'https://api.tfl.gov.uk/line/mode/tube%2Cdlr%2Coverground%2Ctflrail%2Ctram%2Ccable-car/status';
 
const Global = createGlobalStyle`
    @font-face {
        font-family: tfl;
        font-display: auto;
        src: url('/Johnston100-Regular.woff2');
    }

    body {
        background: #273c75;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-feature-settings: none;
        font-family:'tfl', PT-Sans, sans-serif;
    }
`

const Wrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
`

const App = () => {
    const [lines, setLines] = useState([]); // Used to get and set data returned from TfL API. See /helpers/dataBroker.jsx for fetch
    const [statuses, setStatuses] = useState([]);   // Used to get and set the active statuses array

    const updateData = () => {
        dataBroker(endpoint)
            .then(setLines)
    };

    /*
        useEffect hook, to build an array of line statuses currently active.
        This is run when the value of `lines` is updated.
    */
    useEffect(() => {
        let newArr = [];

        lines.map(({ lineStatuses: [{ statusSeverity }] }) => { // Destructuring an object=>array=>object
            if (newArr.indexOf(statusSeverity) < 0) {
                // We want 'Good Service' at the bottom, and irregular services prominent.
                statusSeverity === 10 ? newArr.push(statusSeverity) : newArr.unshift(statusSeverity);
            }
        })

        setStatuses(newArr);
    }, [lines]) // Second arg, [lines] tells the hook to execute when the value of `lines` changes.

    /*
        useEffect hook, to fetch data from TfL API for London Underground line statuses.
        Runs every 30 seconds
    */
    useEffect(() => {
        if (!lines.length) {    // Hacky way to force update on first load (as oppose to waiting 30s). Implementation could be better.
            return updateData();
        } else {
            var dataBroker = setInterval(() => updateData(), 30000);

            const cleanup = () => { // ran after hook
                clearInterval(dataBroker);
            };

            return cleanup;
        }
    });

    return(
        <React.Fragment>
            <Global></Global>
            <Wrapper>
                {
                    statuses.map((status) => {
                        return (
                            <Container key={status} status={status}>
                                {
                                    lines.filter(line => line.lineStatuses[0].statusSeverity === status)
                                        .map(line => {
                                            return <Line key={line.name} line={line} />
                                        })
                                }
                            </Container>
                        )
                    })
                }
            </Wrapper>
        </React.Fragment>
    );
}

export default App;
