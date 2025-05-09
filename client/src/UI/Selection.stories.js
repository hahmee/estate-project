import Selection from './Selection';

export default {
    title: 'Components/Selection',
    component: Selection,
    args: {
        id: 'select',
        label: '옵션 선택',
        options: [
            { value: 'apple', label: '사과' },
            { value: 'banana', label: '바나나' },
            { value: 'cherry', label: '체리' },
        ],
        isMulti: false,
    },
};

export const Default = {};

export const MultiSelect = {
    args: {
        isMulti: true,
        placeholder: '여러 개 선택 가능',
    },
};

export const WithDefaultValue = {
    args: {
        defaultValue: { value: 'banana', label: '바나나' },
    },
};
