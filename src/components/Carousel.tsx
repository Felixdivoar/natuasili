import useEmblaCarousel from "embla-carousel-react";
import { PropsWithChildren, useEffect } from "react";

export default function Carousel({ children }: PropsWithChildren){
  const [ref, api] = useEmblaCarousel({ loop:true, align:"start", slidesToScroll:1 });
  useEffect(()=>{ api?.reInit(); },[api, children]);
  return (
    <div className="embla">
      <div className="embla__viewport" ref={ref}>
        <div className="embla__container flex gap-4">{children}</div>
      </div>
    </div>
  );
}