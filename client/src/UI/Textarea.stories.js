import Textarea from './Textarea';

export default {
    title: 'Components/Textarea',
    component: Textarea,
    args: {
        id: 'desc',
        label: '설명',
        placeholder: '여기에 내용을 입력하세요',
        rows: 4,
        cols: 40,
    },
};

export const Default = {};

export const WithPlaceholder = {
    args: {
        placeholder: '예: 이 제품은...',
    },
};

export const Disabled = {
    args: {
        disabled: true,
        placeholder: '입력 비활성화됨',
    },
};
