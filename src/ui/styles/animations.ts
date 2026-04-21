// 动画系统 - 微交互动画

export const animations = {
  // 淡入
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },

  // 淡出
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },

  // 从下滑入
  slideInUp: {
    from: {
      opacity: 0,
      transform: 'translateY(8px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },

  // 从上滑入
  slideInDown: {
    from: {
      opacity: 0,
      transform: 'translateY(-8px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },

  // 从左滑入
  slideInLeft: {
    from: {
      opacity: 0,
      transform: 'translateX(-8px)',
    },
    to: {
      opacity: 1,
      transform: 'translateX(0)',
    },
  },

  // 从右滑入
  slideInRight: {
    from: {
      opacity: 0,
      transform: 'translateX(8px)',
    },
    to: {
      opacity: 1,
      transform: 'translateX(0)',
    },
  },

  // 缩放进入
  scaleIn: {
    from: {
      opacity: 0,
      transform: 'scale(0.95)',
    },
    to: {
      opacity: 1,
      transform: 'scale(1)',
    },
  },

  // 缩放退出
  scaleOut: {
    from: {
      opacity: 1,
      transform: 'scale(1)',
    },
    to: {
      opacity: 0,
      transform: 'scale(0.95)',
    },
  },
}

// CSS 动画关键帧
export const keyframes = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-8px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(8px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes scaleOut {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.95);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes ripple {
    0% {
      transform: scale(0);
      opacity: 0.5;
    }
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`

// 微交互动画类
export const microInteractions = {
  // 按钮悬停
  buttonHover: {
    transform: 'translateY(-1px)',
    boxShadow: 'var(--shadow-md)',
    transition: 'all var(--duration-fast) var(--ease-out)',
  },

  // 按钮按下
  buttonActive: {
    transform: 'translateY(0)',
    boxShadow: 'var(--shadow-sm)',
    transition: 'all var(--duration-fast) var(--ease-in)',
  },

  // 卡片悬停
  cardHover: {
    transform: 'translateY(-2px)',
    boxShadow: 'var(--shadow-lg)',
    transition: 'all var(--duration-normal) var(--ease-out)',
  },

  // 输入框聚焦
  inputFocus: {
    borderColor: 'var(--color-primary-500)',
    boxShadow: '0 0 0 3px var(--color-primary-100)',
    transition: 'all var(--duration-fast) var(--ease-out)',
  },
}

// 动画工具函数
export function createAnimation(
  name: keyof typeof animations,
  duration: string = 'var(--duration-normal)',
  easing: string = 'var(--ease-default)',
  delay: string = '0s'
) {
  return {
    animation: `${name} ${duration} ${easing} ${delay} both`,
  }
}

// 过渡工具函数
export function createTransition(
  properties: string[] = ['all'],
  duration: string = 'var(--duration-normal)',
  easing: string = 'var(--ease-default)',
  delay: string = '0s'
) {
  return {
    transition: properties
      .map((prop) => `${prop} ${duration} ${easing} ${delay}`)
      .join(', '),
  }
}
