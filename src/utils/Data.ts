import { Iconhigh, Iconlow, Iconmedium } from "../assets/images";
import { Propity } from "../model/enum/common.enum";

export const dataPriority = [
  {
    priority: Propity.low,
    imageSrc: Iconlow
  },
  {
    priority: Propity.medium,
    imageSrc: Iconmedium
  },
  {
    priority: Propity.high,
    imageSrc: Iconhigh
  }
]