export function animateElementsWhileScrolling(){
  const elements = document.querySelectorAll("[scroll-animate]");
  const windowInnerHeight = window.innerHeight;
  // for optimizing  ( if  an element is showed we dont have to check it again );
  let startFromIndex = 0;
  let prevScrollTop = document.scrollingElement.scrollTop;

  function showByScroll(){
    const scrollTop = document.scrollingElement.scrollTop;
    if ( scrollTop >= prevScrollTop ){
      for ( let i = startFromIndex; i < elements.length; i++  ){
        const el = elements[i];
        if (el.getBoundingClientRect().top < windowInnerHeight - 50 ){
          // check data-scroll-animate class to understand
          el.removeAttribute("scroll-animate");
          // update it to start from the next element
          startFromIndex = i + 1;
        }

      }
    }
    prevScrollTop = scrollTop;
  }

  document.addEventListener(
    'scroll',
    showByScroll,
    false
  );
  // showing first elements before start scrolling
  showByScroll();
}

export const AuthToken = {
  setToken: (token) => localStorage.setItem('token', token),
  getToken: () => localStorage.getItem('token'),
  getHeader: function(){
    return { Authorization: `Token ${this.getToken()}` }
   }
}
