import React, { useEffect } from 'react';
import { Box } from 'grommet';
import List from '../components/List';
import { matches } from '../utils/data';

export default () => {
  useEffect(() => {
    document.title = 'Luuk.gg - Matches';
  }, []);

  return (
    <Box
      flex
      overflow={{ vertical: 'auto' }}
      border={{ side: 'top', size: 'small', color: 'light-1' }}
    >
      <List type="matches" items={matches}/>
    </Box>
  );
};