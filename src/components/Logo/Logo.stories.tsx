import type { Meta, StoryObj } from '@storybook/react';

import Logo from './';

const meta: Meta = {
    component: Logo,
}

export default meta;

type Story = StoryObj<typeof Logo>;

export const LogoComponent: Story = {
    args: {
    }
}