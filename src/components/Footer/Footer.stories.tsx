import { Meta, StoryObj } from '@storybook/react';

import Footer from './';

const meta: Meta = {
    component: Footer,
}

export default meta;

type Story = StoryObj<typeof Footer>;

export const FooterComponent: Story = {
    args: {
    }
}