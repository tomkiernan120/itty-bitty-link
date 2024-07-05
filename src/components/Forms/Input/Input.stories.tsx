import { Meta, StoryObj } from '@storybook/react';

import Input from './';

const meta: Meta = {
    component: Input,
}

export default meta;

type Story = StoryObj<typeof Input>;

export const InputComponent: Story = {
    args: {
    }
}