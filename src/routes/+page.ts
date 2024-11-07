
import type { PageLoad } from './$types';

// export const load: PageLoad = ({ params }) => {
// 	// if (params.slug === 'hello-world') {
// 	// 	return {
// 	// 		title: 'Hello world!',
// 	// 		content: 'Welcome to our blog. Lorem ipsum dolor sit amet...',
// 	// 	};
// 	// }

// 	// error(404, 'Not found');
	
	
// };

export const load: PageLoad = async ({ url  }) => {
  return {

      uwu: url.searchParams.get('uwu'),
      shikanokonokonokokoshitantan: url.searchParams.get('shikanokonokonokokoshitantan'),
    
  };
};