import React from 'react';
import { Link } from 'react-router-dom';
import Exception from '../../components/Exception';

const Exception500 = () => (
  <Exception
    type="500"
    linkElement={Link}
  />
);

export default Exception500;
