/** @type { import('@storybook/react').Preview } */
import React, { useState } from 'react';

import '../src/index.scss';      // ✅ 필요한 CSS 직접 import


// 전역에서 포탈 루트 요소를 Storybook HTML에 삽입
export const decorators = [
    (Story) => {
        return (
            <>
                <div id="modal-root" /> {/* ✅ 여기 추가 */}
                <Story />
            </>
        );
    },
];

const preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;