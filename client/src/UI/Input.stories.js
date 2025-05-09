import Input from './Input';

export default {
  title: 'Components/Input',
  component: Input,
  args: {
    id: 'name',
    label: '이름',
    placeholder: '이름을 입력하세요',
  },
};

export const Default = {};

export const WithPlaceholder = {
  args: {
    placeholder: '예: 홍길동',
  },
};

export const PasswordType = {
  args: {
    id: 'password',
    label: '비밀번호',
    type: 'password',
    placeholder: '비밀번호 입력',
  },
};
