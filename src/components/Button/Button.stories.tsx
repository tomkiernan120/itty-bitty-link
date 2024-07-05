import type { Meta, StoryObj } from '@storybook/react';

import { Primary as PrimaryButton, Secondary } from "./";

const meta: Meta = {
    component: PrimaryButton,
}

export default meta;

type Story = StoryObj<typeof PrimaryButton>;

export const Primary: Story = {
    args: {
        label: 'Button',
    }
}