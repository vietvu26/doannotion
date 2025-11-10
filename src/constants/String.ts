const String = {
  VERSION: '1.0 (3)',
  EMPTY: '',
  PREFIX_IMG_BASE64: 'data:image/png;base64,',
  NOMINATIM_HOST: 'https://nominatim.openstreetmap.org/reverse',
  ROLE: {
    ROLE_ORG_ADMIN: 'ROLE_ORG_ADMIN',
  },
  USER_AGENT:
    'Mozilla/5.0 (Linux; Android 10; Redmi Note 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.88 Mobile Safari/537.36',
  SCRIPT_SCALE_WEBVIEW: `
  const meta = document.createElement('meta');
  meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0');
  meta.setAttribute('name', 'viewport');
  document.head.appendChild(meta);
  `,
  DEFAULT_IMAGE:
    'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg',
};

export default String;
