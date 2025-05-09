
import Button from "./Button.jsx";

export default {
  title: 'Components/Button',
  component: Button,
  args: {
    children: '기본 버튼',
    className: 'btn-primary',
    loading: false,

  },
};

export const Default = {};

export const Outlined = {
  args: {
    outlined: true,
    children: 'Outlined Button',
  },
};

export const Loading = {
  args: {
    loading: true,
  },
};
