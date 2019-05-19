import React, { useState, useEffect } from 'react';
import Line from '../Line';
import dataBroker from '../../Helpers/dataBroker';
import sortData from '../../Helpers/sortData';
import { Global, Wrapper } from '../../Helpers/styles';

const endpoint =
  'https://api.tfl.gov.uk/line/mode/tube%2Cdlr%2Coverground%2Ctflrail%2Ctram%2Ccable-car/status';

const App = () => {
  const [lines, setLines] = useState([]);
  const updateData = () => {
    dataBroker(endpoint)
      .then(sortData)
      .then(setLines);
  };

  useEffect(() => {
    if (!lines.length) {
      updateData();
    }

    setInterval(() => updateData(), 30000);
  }, []);

  return (
    <React.Fragment>
      <Global />
      <Wrapper>
        {lines.map(line => (
          <Line key={line.name} line={line} />
        ))}
      </Wrapper>
    </React.Fragment>
  );
};

export default App;
