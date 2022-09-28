import './preview.scss';

export const parameters = {
  actions: {
    argTypesRegex: "^on[A-Z].*"
  },

  backgrounds: {
    default: 'light',
    values: [
      {
        name: 'light',
        value: '#fff',
      },
      {
        name: 'dark',
        value: '#ddd',
      },
    ],
  },

  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },

  viewport: {
    viewports: {
      mobile1: {
        name: 'Телефон',
        styles: {
          height: '568px',
          width: '320px',
        },
        type: 'mobile',
      },
      tablet1: {
        name: 'Планшет',
        styles: {
          height: '1024px',
          width: '768px',
        },
        type: 'tablet',
      },
      desktop1: {
        name: 'Десктоп',
        styles: {
          height: '1080px',
          width: '1920px',
        },
        type: 'mobile',
      },
    },
  },
}