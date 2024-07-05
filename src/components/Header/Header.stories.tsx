import { Meta, StoryObj } from '@storybook/react';

import Header from './default';

const meta: Meta = {
    component: Header,
}

export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {
    args: {
    }
}

