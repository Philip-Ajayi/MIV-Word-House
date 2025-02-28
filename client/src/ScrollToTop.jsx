import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Reset scroll position on route change
  }, [pathname]);

  return null; // This component does not render anything
};

export default ScrollToTop;
