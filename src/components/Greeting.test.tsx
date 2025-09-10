import React from 'react';
import { render, screen } from '@testing-library/react';
import Greeting from './Greeting';

describe('Greeting', () => {
  it('renders a greeting', () => {
    render(<Greeting name="World" />);

    const heading = screen.getByRole('heading', {
      name: /hello, world/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
