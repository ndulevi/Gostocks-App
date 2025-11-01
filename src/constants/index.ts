const COLORS = {
  // Primary Colors
  primaryColor: '#fc0200', // Strong Red
  primaryBackground: '#0d0d0d',
  primaryBlack: '#0C0F14', // Deep Black
  primaryLightBlack: '#1a1a1a', // 
  primaryDarkGrey: '#252525', // Dark Charcoal Grey
  primaryGrey: '#3a3a3a', // Charcoal Grey
  primaryLightGrey: '#535252ff', // Light Grey
  primaryLightGrey1: '#DFE2E5', // Light Grey
  primaryWhite: '#FCFCFC', // Soft White
  primaryVeryWhite: '#FFFFFF', // Pure White

  // primaryGradient: ['#F9881F', '#FF774C'],

  primaryAccent: '#0B735F',

};

const primaryGradient = [
    { offset: '0%', color: '#F9881F', opacity: '1' },
    { offset: '100%', color: '#FF774C', opacity: '1' },
];

const FONT_FAMILY = {
  dmsans_black: 'DMSans-Black',
  dmsans_bold: 'DMSans-Bold',
  dmsans_extrabold: 'DMSans-ExtraBold',
  dmsans_extralight: 'DMSans-ExtraLight',
  dmsans_light: 'DMSans-Light',
  dmsans_medium: 'DMSans-Medium',
  dmsans_regular: 'DMSans-Regular',
  dmsans_semibold: 'DMSans-SemiBold',
  dmsans_thin: 'DMSans-Thin',
  sk_modernist_bold: 'Sk-Modernist-Bold',
  sk_modernist_mono: 'Sk-Modernist-Mono',
  sk_modernist_regular: 'Sk-Modernist-Regular',
};

const Logo = {
    image: require('../assets/images/gostock.png'),
    favicon: require('../assets/images/gostock.png'),
    backgroungImage: require('../assets/images/background.png'),
}

const ProductData = [
  
  {
    _id: '1',
    name: 'Coca Cola',
    description:
      'A soft, breathable 100% organic cotton crew-neck T‑shirt—ideal for casual wear, layering or gym days with unmatched comfort.',
    images: require('../assets/images/coco.jpeg'), 
    prices: '$15.99',
    category: 'soft drink',
    stock: 5,
  },
  {
    _id: '2',
    name: 'Doritos',
    description:
      'Bold graphic tee with high-quality print that stays vibrant wash after wash—perfect statement piece for casual outings.',
    images: require('../assets/images/doritos.jpeg'),
    prices: '$12.99',
    category: 'snacks',
    stock: 50,
  },
  {
    _id: '3',
    name: 'Lays',
    description:
      'Relaxed-fit longline tee crafted from heavyweight cotton, great for layering or streetwear styles.',
    images: require('../assets/images/lays.jpeg'),
    prices: '$10.99',
    category: 'snacks',
    stock: 20,
  },
  {
    _id: '4',
    name: 'Kitkat',
    description:
      'Essential tee with a subtle chest pocket and soft-touch cotton, made for everyday comfort.',
    images: require('../assets/images/kitkat.jpeg'),
    prices: '$8.99',
    category: 'snacks',
    stock: 15,
  },

  {
    _id: '5',
    name: 'Apples',
    description:
      'Refined slim-fit oxford shirt with button-down collar, perfect for both business casual and weekend wear.',
    images: require('../assets/images/apples.png'),
    prices: '$3.99',
    category: 'fruit',
    stock: 100,
  },
  
];


const homeTitle = `Find Your Next Favorite Fit And Wear It Now`;



const categories = [
  'Snacks',
  'Fruits',
  'Soft Drinks',
  'Vegetables',
];

const lottieUrl = `https://lottie.host/1ab06b3e-0271-4ed9-8fc0-ee720b39b005/0YMByi583s.lottie`;

export {
  COLORS,
  homeTitle,
  ProductData,
  categories,
  FONT_FAMILY,
  lottieUrl,
 Logo,
  primaryGradient,
};